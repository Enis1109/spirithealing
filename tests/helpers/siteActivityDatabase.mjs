// Synthetic database double. Does not execute SQL; not a MySQL migration proof.
export function fakeDatabase({clock=()=>Date.now()}={}){
    const consents=new Map(),flows=new Map(),activity=new Map(),releases=new Map(),tables=new Set(['site_measurement_consents','site_measurement_flows','site_measurement_activity','site_measurement_releases']),calls=[];
    let tail=Promise.resolve();
    const db={query:async()=>[[]],execute:async(sql,p=[])=>{
        calls.push([sql,p]);const table=['site_measurement_activity','site_measurement_releases','site_measurement_flows','site_measurement_consents'].find(t=>sql.includes(t));
        if(table&&!tables.has(table))throw Object.assign(Error('missing'),{code:'ER_NO_SUCH_TABLE'});
        if(sql.startsWith('INSERT IGNORE INTO site_measurement_releases')){const key=p[0]+':'+p[1];if(!releases.has(key))releases.set(key,{fingerprint:p[2],blocked:0});}
        if(sql.startsWith('INSERT INTO site_measurement_releases'))for(const f of flows.values())if(f.receipt===p[0]){const key=f.created.slice(0,10)+':'+(f.code||'-');releases.set(key,{...(releases.get(key)||{fingerprint:'0'.repeat(64)}),blocked:1});}
        if(sql.startsWith('UPDATE site_measurement_releases')){const row=releases.get(p[0]+':'+p[1]);if(row&&(p.length===2||row.fingerprint!==p[2]))row.blocked=1;}
        if(sql.startsWith('SELECT fingerprint'))return [[...(releases.has(p[0]+':'+p[1])?[releases.get(p[0]+':'+p[1])]:[])]];
        if(sql.startsWith('SELECT DATE_FORMAT')){
            const visible=[...flows].filter(([,f])=>!consents.get(f.receipt)?.revoked);
            if(sql.includes('state_json'))return [visible.slice(0,5001).map(([key,f])=>({day:f.created.slice(0,10),code:f.code,entry_class:f.entry_class,landed:(f.flags&1)>0,expired:new Date(f.expires.replace(' ','T')+'Z').getTime()<=clock(),state_json:activity.get(key)?.state_json||null}))];
            const groups=new Map();
            for(const [,f]of visible){const day=f.created.slice(0,10),key=day+':'+f.code;let g=groups.get(key);if(!g){g={day,code:f.code,flows:0};groups.set(key,g);}g.flows++;
                for(const [field,bit]of [['landing_views',1],['offer_views',2],['cta_clicks',4],['inquiry_starts',8],['form_errors',16],['inquiry_successes',32]])g[field]=(g[field]||0)+((f.flags&bit)>0?1:0);
                g.started_and_saved=(g.started_and_saved||0)+((f.flags&8)&&(f.flags&32)?1:0);
            }return [[...groups.values()]];
        }
        if(sql.startsWith('SELECT 1 AS active_flow')){const f=flows.get(p[0]+p[1]);return [f&&f.expires>p[2]&&f.created===p[3]&&f.code===p[4]&&f.entry_class===p[5]?[{active_flow:1}]:[]];}
        if(sql.startsWith('SELECT 1 FROM site_measurement_flows f INNER JOIN'))return [flows.size?[{found:1}]:[]];
        if(sql.startsWith('SELECT 1'))return [[]];
        if(sql.startsWith('INSERT INTO site_measurement_consents')){
            if(sql.includes('revoked_at,version'))consents.set(p[0],{revoked:true});else if(!consents.has(p[0]))consents.set(p[0],{revoked:false});
        }
        if(sql.startsWith('SELECT receipt_hash FROM site_measurement_consents'))return [[...(consents.has(p[0])&&(sql.includes('IS NOT NULL')?consents.get(p[0]).revoked:!consents.get(p[0]).revoked)?[{receipt_hash:p[0]}]:[])]];
        if(sql.startsWith('INSERT INTO site_measurement_flows')){const key=p[0]+p[1];if(!flows.has(key))flows.set(key,{receipt:p[0],flags:0,code:p[2],entry_class:p[3],created:p[4],expires:p[5]});}
        if(sql.startsWith('UPDATE site_measurement_flows'))flows.get(p[3]+p[4]).flags|=p[0];
        if(sql.startsWith('SELECT revision'))return [[...(activity.has(p[0]+p[1])?[activity.get(p[0]+p[1])]:[])]];
        if(sql.startsWith('INSERT INTO site_measurement_activity'))activity.set(p[0]+p[1],{receipt:p[0],revision:p[2],state_json:p[3]});
        if(sql.startsWith('DELETE FROM site_measurement_activity')){for(const[k,v]of activity)if(!p.length||v.receipt===p[0])activity.delete(k);}
        if(sql.startsWith('DELETE FROM site_measurement_flows')){for(const[k,v]of flows)if(!p.length||v.receipt===p[0])flows.delete(k);}
        if(sql.startsWith('SELECT receipt_hash FROM site_measurement_activity'))return [[...activity.values()].filter(v=>v.receipt===p[0])];
        if(sql.startsWith('SELECT receipt_hash FROM site_measurement_flows'))return [[...flows.values()].filter(v=>v.receipt===p[0])];
        return [{affectedRows:1}];
    }};
    const lock=(_db,_key,task)=>{const result=tail.then(()=>task(db));tail=result.catch(()=>{});return result;};
    return{db,lock,consents,flows,activity,releases,tables,calls};
}
