// No URLs, event trails, free text, operating-system or personal identifiers.
export const ACTIVITY_PAGES = Object.freeze(['p_home','p_offer','p_booking','p_contact']);
export const ACTIVE_IDLE_MS = 30000;
export const activityTimeBucket = n => n === 0 ? '0' : n < 10 ? '1-9' : n < 30 ? '10-29' : n < 120 ? '30-119' : '120-1800';
const exact = (value, keys) => value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === keys.length && keys.every(k => Object.hasOwn(value,k));
const integer = (n,max) => Number.isSafeInteger(n) && n >= 0 && n <= max;
export function normalizeSiteActivity(s) {
    if (!exact(s,['revision','pages','transitions','last_page','ended']) || !integer(s.revision,10000) || s.revision < 1
        || !ACTIVITY_PAGES.includes(s.last_page) || !['open','pagehide','excluded','limit'].includes(s.ended)
        || !Array.isArray(s.pages) || !s.pages.length || s.pages.length > 4 || !Array.isArray(s.transitions) || s.transitions.length > 12) return null;
    const pages=new Set(),pairs=new Set();let views=0,seconds=0,changes=0;
    for(const p of s.pages){
        if(!exact(p,['page','visits','active_seconds','scroll']) || !ACTIVITY_PAGES.includes(p.page) || pages.has(p.page)
            || !integer(p.visits,64) || p.visits<1 || !integer(p.active_seconds,1800) || ![0,25,50,75,90].includes(p.scroll))return null;
        pages.add(p.page);views+=p.visits;seconds+=p.active_seconds;
    }
    if(views>64 || seconds>1800 || !pages.has(s.last_page))return null;
    for(const t of s.transitions){
        const key=t?.from+':'+t?.to;
        if(!exact(t,['from','to','count']) || !pages.has(t.from) || !pages.has(t.to) || t.from===t.to || pairs.has(key)
            || !integer(t.count,63) || t.count<1)return null;
        pairs.add(key);changes+=t.count;
    }
    if(changes!==views-1)return null;
    return {revision:s.revision,pages:s.pages.map(p=>({...p})),transitions:s.transitions.map(t=>({...t})),last_page:s.last_page,ended:s.ended};
}
export function activityAdvances(previous,next){
    if(!previous)return true;
    if(next.revision<=previous.revision)return false;
    if(previous.ended!=='open')return false;
    return previous.pages.every(p=>next.pages.some(n=>n.page===p.page && n.visits>=p.visits && n.active_seconds>=p.active_seconds && n.scroll>=p.scroll))
        && previous.transitions.every(t=>next.transitions.some(n=>n.from===t.from && n.to===t.to && n.count>=t.count));
}
// Publish counts of short flows, never exact seconds or per-flow snapshots.
// Every joint duration/scroll/repeat cell, presence complement, transition
// complement and endpoint partition must be >=5 or zero. Otherwise hide group.
export function siteActivityReport(items, cohorts, allowed){
    const result=[];
    for(const base of cohorts){
        if(!allowed.some(a=>a.day===String(base.day).slice(0,10)&&(a.code||null)===(base.code||null)))continue;
        const total=Number(base.flows),rows=items.filter(x=>String(x.day).slice(0,10)===String(base.day).slice(0,10)&&(x.code||null)===(base.code||null));
        const safe=n=>Number.isSafeInteger(n)&&n>=0&&(n===0||n>=5);
        const cells=new Map(),endpoints=new Map(),transitions=new Map(),presence=new Map(),landings=new Map();let invalid=false,observed=0;
        const add=(map,key,n=1)=>map.set(key,(map.get(key)||0)+n);
        for(const row of rows){
            if(row.landed && ACTIVITY_PAGES.includes(row.entry_class))add(landings,row.entry_class);
            if(!row.state_json){add(endpoints,'unknown');continue;}
            let raw;try{raw=typeof row.state_json==='string'?JSON.parse(row.state_json):row.state_json;}catch{invalid=true;break;}
            const s=normalizeSiteActivity(raw);if(!s){invalid=true;break;}
            observed++;
            for(const p of s.pages){add(presence,p.page);add(cells,[p.page,activityTimeBucket(p.active_seconds),p.scroll,p.visits>1?'repeated':'single'].join('|'));}
            for(const t of s.transitions)add(transitions,t.from+'>'+t.to);
            const expired=Boolean(row.expired);
            add(endpoints,s.ended==='open'&&!expired?'ongoing':s.last_page+'|'+(s.ended==='open'?'expired_last_observation':s.ended));
        }
        // Absent snapshots are unknown; never call them zero engagement or exits.
        add(endpoints,'unknown',total-rows.length);
        const landed=[...landings.values()].reduce((sum,n)=>sum+n,0);
        const counts=[observed,total-observed,landed,total-landed,...landings.values(),...cells.values(),...endpoints.values(),...presence.values(),...transitions.values()];
        if(invalid||!safe(total)||!counts.every(n=>safe(n)&&safe(total-n)))continue;
        result.push({day:String(base.day).slice(0,10),code:base.code||null,
            landings:[...landings].map(([page,flows])=>({page,flows})),
            durationScroll: [...cells].map(([key,flows])=>{const [page,seconds,scroll,visits]=key.split('|');return{page,seconds,scroll:Number(scroll),visits,flows};}),
            transitions:[...transitions].map(([pair,flows])=>({pair,flows})),
            endpoints:[...endpoints].filter(([,n])=>n>0).map(([endpoint,flows])=>({endpoint,flows}))});
    }
    return result;
}
