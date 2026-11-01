import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {createSiteMeasurement,initializeSiteMeasurement,cleanSiteMeasurement} from '../server/siteMeasurement.js';
import {SITE_CONSENT_VERSION} from '../shared/siteMeasurement.js';
test('real isolated MySQL activity migration, cumulative races, revocation, partial schema and retention',{
    skip:!process.env.SITE_MYSQL_TEST_URL&&'Requires isolated local MySQL',timeout:30000,
},async t=>{
    const url=new URL(process.env.SITE_MYSQL_TEST_URL);
    assert.equal(url.protocol,'mysql:');assert.equal(url.hostname,'127.0.0.1');assert.ok(['','/'].includes(url.pathname));assert.equal(url.search,'');assert.equal(url.hash,'');
    const mysql=await import('mysql2/promise'),options={host:url.hostname,port:Number(url.port||3306),user:decodeURIComponent(url.username),password:decodeURIComponent(url.password)};
    const control=await mysql.createConnection(options),name='activity_test_'+randomUUID().replaceAll('-','');let db,created=false;
    t.after(async()=>{if(db)await db.end();try{if(created)await control.query('DROP DATABASE `'+name+'`');}finally{await control.end();}});
    await control.query('CREATE DATABASE `'+name+'`');created=true;db=mysql.createPool({...options,database:name,timezone:'+03:00',connectionLimit:8});
    for(const file of ['20261029-site-measurement.sql','20261101-site-activity.sql']){
        const sql=await readFile(new URL('../database/migrations/'+file,import.meta.url),'utf8');
        for(const statement of sql.replace(/^--.*$/gm,'').split(';').map(s=>s.trim()).filter(Boolean))await db.query(statement);
    }
    await initializeSiteMeasurement(db);await initializeSiteMeasurement(db);
    const now=Date.now(),receipt='d'.repeat(64),service=createSiteMeasurement({db,enabled:true,clock:()=>now+60000});
    const context={receipt,flow:randomUUID(),startedAt:now,entry:'p_home',code:'i01h'};
    const grant={receipt,at:now,enabled:true,version:SITE_CONSENT_VERSION,schema_version:1,environment:'local'};
    const body={context,state:{revision:1,pages:[{page:'p_home',visits:1,active_seconds:10,scroll:25}],transitions:[],last_page:'p_home',ended:'open'},schema_version:1,environment:'local'};
    assert.equal(await service.activity(body),false);assert.equal(await service.grant(grant),true);
    assert.ok((await Promise.all(Array.from({length:24},()=>service.activity(body)))).every(Boolean));
    const [[one]]=await db.query('SELECT COUNT(*) n FROM site_measurement_activity');assert.equal(one.n,1);
    await service.activity({...body,state:{...body.state,revision:3,pages:[{page:'p_home',visits:1,active_seconds:30,scroll:50}]}});
    await service.activity({...body,state:{...body.state,revision:2}});
    const [[latest]]=await db.query('SELECT revision,state_json FROM site_measurement_activity');assert.equal(latest.revision,3);
    const expiredFlow=createSiteMeasurement({db,enabled:true,clock:()=>now+31*60000});
    assert.equal(await expiredFlow.activity({...body,context:{...context,startedAt:now+31*60000},state:{...body.state,revision:4}}),false);
    await Promise.all([service.revoke(receipt),...Array.from({length:8},()=>service.activity(body))]);
    const [[empty]]=await db.query('SELECT COUNT(*) n FROM site_measurement_activity');assert.equal(empty.n,0);
    assert.equal(await service.activity(body),false);
    const second={...context,receipt:'e'.repeat(64),flow:randomUUID()};
    await service.grant({...grant,receipt:second.receipt});await service.activity({...body,context:second});
    await db.query('UPDATE site_measurement_flows SET created_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 8 DAY)');await cleanSiteMeasurement(db);
    const [[retained]]=await db.query('SELECT COUNT(*) n FROM site_measurement_activity');assert.equal(retained.n,0);
    await service.activity({...body,context:{...second,flow:randomUUID()}});
    await db.query('DROP TABLE site_measurement_flows');await db.query('DROP TABLE site_measurement_consents');
    assert.equal(await service.revoke(second.receipt),false);
    const [[partial]]=await db.query('SELECT COUNT(*) n FROM site_measurement_activity');assert.equal(partial.n,0);
    await initializeSiteMeasurement(db);assert.equal(await service.revoke(second.receipt),true);
    // Two individually safe snapshots (5/6 and 5/5) must not both be published.
    service.enabled=true;const tokens=[];
    for(let i=0;i<11;i++){
        const token=(i+100).toString(16).padStart(64,'0');tokens.push(token);
        await service.grant({...grant,receipt:token});
        const c={...context,receipt:token,flow:randomUUID(),code:'f01h'};
        await service.record({context:c,event_name:'landing_view',schema_version:1,environment:'local'});
        await service.activity({...body,context:c,state:{...body.state,pages:[{page:'p_home',visits:1,active_seconds:i<5?0:20,scroll:0}],ended:'pagehide'}});
    }
    const publish=createSiteMeasurement({db,enabled:true,clock:()=>now+2*86400000});
    assert.equal((await publish.summary()).activity.length,1);
    await publish.revoke(tokens[10]);assert.equal((await publish.summary()).rows.length,0);
    const restarted=createSiteMeasurement({db,enabled:true,clock:()=>now+2*86400000});assert.equal((await restarted.summary()).rows.length,0);
});
