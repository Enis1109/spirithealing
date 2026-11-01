import { ACTIVE_IDLE_MS, ACTIVITY_PAGES } from '../../shared/siteActivity.js';
// Memory only, cumulative snapshots. No raw interaction coordinates or event trail.
export function createSiteActivityClient({context,page,send,now=()=>performance.now(),visible=()=>false}){
    let key=null,ctx=null,current=null,revision=0,last=now(),activeUntil=0,lastSent=0,ended=false;
    const pages=new Map(),transitions=new Map();
    const reset=()=>{key=null;ctx=null;current=null;revision=0;pages.clear();transitions.clear();ended=false;activeUntil=0;last=now();};
    const ensure=(initialPage=page())=>{
        const c=context(),p=initialPage;
        if(!c||!ACTIVITY_PAGES.includes(p)){reset();return false;}
        const next=c.receipt+':'+c.flow;
        if(key!==next){reset();key=next;ctx=c;current=p;pages.set(p,{page:p,visits:1,active_ms:0,scroll:0});activeUntil=visible()?now()+ACTIVE_IDLE_MS:0;lastSent=now();}
        return !ended;
    };
    const accrue=()=>{
        const t=now(),delta=Math.max(0,Math.min(t-last,1000));
        if(current&&visible()&&last<activeUntil){const p=pages.get(current);p.active_ms=Math.min(1800000,p.active_ms+Math.min(delta,activeUntil-last));}
        last=t;
    };
    const snapshot=reason=>({revision:++revision,pages:[...pages.values()].map(p=>({page:p.page,visits:p.visits,active_seconds:Math.floor(p.active_ms/1000),scroll:p.scroll})),
        transitions:[...transitions.values()].map(t=>({...t})),last_page:current,ended:reason});
    const flush=(reason='open')=>{
        if(!key||ended||!context()||context().flow!==ctx.flow||context().receipt!==ctx.receipt)return Promise.resolve(false);
        accrue();lastSent=now();const state=snapshot(reason);if(reason!=='open')ended=true;
        return Promise.resolve(send(state,ctx)).catch(()=>false);
    };
    const tick=()=>{if(!ensure())return;accrue();if(now()-lastSent>=15000)void flush();};
    const activity=()=>{if(!ensure())return;accrue();if(visible())activeUntil=now()+ACTIVE_IDLE_MS;};
    // Programmatic/layout scrolling may update visible depth but cannot renew
    // activity. Only the separately bound wheel/touch/key/pointer/focus input does.
    const scroll=percent=>{if(!ensure()||!visible())return;accrue();const p=pages.get(current);for(const threshold of [25,50,75,90])if(percent>=threshold)p.scroll=Math.max(p.scroll,threshold);};
    // Called before router updates the measurement context. No excluded destination retained.
    const navigate=next=>{
        const c=context();
        if(!c){reset();return;}
        // A router effect can run before the first timer/input tick, and the URL
        // already names the destination. The validated flow entry preserves origin.
        if(!key || c.flow!==ctx.flow || c.receipt!==ctx.receipt)if(!ensure(c.entry))return;
        accrue();
        if(!ACTIVITY_PAGES.includes(next)){void flush('excluded');reset();return;}
        if(next===current)return;
        if([...pages.values()].reduce((sum,p)=>sum+p.visits,0)>=64){void flush('limit');return;}
        const pair=current+'>'+next;const t=transitions.get(pair)||{from:current,to:next,count:0};t.count++;transitions.set(pair,t);
        const p=pages.get(next)||{page:next,visits:0,active_ms:0,scroll:0};p.visits++;pages.set(next,p);current=next;
        activeUntil=visible()?now()+ACTIVE_IDLE_MS:0;void flush();
    };
    return {start:ensure,tick,activity,scroll,navigate,flush,reset,close:()=>flush('pagehide')};
}
