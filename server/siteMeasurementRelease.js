import {createHash} from 'node:crypto';
// Immutable numeric releases, one per finalized UTC day/code. No snapshots of
// individual data, only a checksum and a permanent withdrawal/change block.
export const siteReleaseSchema=`CREATE TABLE IF NOT EXISTS site_measurement_releases (
    cohort_day DATE NOT NULL, code VARCHAR(8) NOT NULL, fingerprint CHAR(64) NOT NULL,
    blocked TINYINT NOT NULL DEFAULT 0, expires_at DATETIME NOT NULL,
    PRIMARY KEY(cohort_day,code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
export const finalizedSiteDay=(day,now)=>/^\d{4}-\d{2}-\d{2}$/.test(day)
    && Date.parse(day+'T00:00:00Z')+86400000+1800000<=now;
function canonical(value){
    if(Array.isArray(value))return value.map(canonical).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));
    return value;
}
export async function releaseSiteMeasurements({db,lock,now,cohorts,rows,activity}){
    const released=[],releasedActivity=[];
    for(const cohort of cohorts){
        const day=String(cohort.day).slice(0,10),code=cohort.code||null;
        // Do not publish a partially expired oldest UTC day from the rolling
        // retention window. Only complete retained days can be released.
        if(!finalizedSiteDay(day,now)||Date.parse(day+'T00:00:00Z')<=now-7*86400000)continue;
        const row=rows.find(x=>x.day===day&&x.code===code),a=activity?.find(x=>x.day===day&&x.code===code)||null;
        const key=createHash('sha256').update(day+':'+code).digest('hex');
        await lock(db,'sr:'+key.slice(0,60),async connection=>{
            if(!row){
                await connection.execute('UPDATE site_measurement_releases SET blocked=1 WHERE cohort_day=? AND code=?',[day,code||'-']);return;
            }
            const fingerprint=createHash('sha256').update(JSON.stringify(canonical({row,activity:a}))).digest('hex');
            const expires=new Date(Date.parse(day+'T00:00:00Z')+8*86400000).toISOString().slice(0,19).replace('T',' ');
            await connection.execute(`INSERT IGNORE INTO site_measurement_releases (cohort_day,code,fingerprint,blocked,expires_at) VALUES (?,?,?,0,?)`,[day,code||'-',fingerprint,expires]);
            // An existing published value can never change. Changes withdraw the
            // entire group instead of exposing a numeric single-record delta.
            await connection.execute('UPDATE site_measurement_releases SET blocked=1 WHERE cohort_day=? AND code=? AND fingerprint<>?',[day,code||'-',fingerprint]);
            const [saved]=await connection.execute('SELECT fingerprint,blocked FROM site_measurement_releases WHERE cohort_day=? AND code=?',[day,code||'-']);
            if(saved[0]&&!saved[0].blocked&&saved[0].fingerprint===fingerprint){released.push(row);if(a)releasedActivity.push(a);}
        });
    }
    return {rows:released,activity:activity===null?null:releasedActivity,releaseMode:'finalized_utc_day_immutable_numeric_release'};
}
