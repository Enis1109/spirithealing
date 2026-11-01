import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createSiteMeasurement, initializeSiteMeasurement, cleanSiteMeasurement } from '../server/siteMeasurement.js';
import { SITE_CONSENT_VERSION } from '../shared/siteMeasurement.js';
function config(raw) {
    const url=new URL(raw);
    if(url.protocol!=='mysql:' || url.hostname!=='127.0.0.1' || !['','/'].includes(url.pathname) || url.search || url.hash || !url.username)throw Error('Isolated loopback database required');
    return {host:url.hostname,port:Number(url.port||3306),user:decodeURIComponent(url.username),password:decodeURIComponent(url.password),connectionLimit:6};
}
test('site MySQL fixture cannot select production hosts or existing databases',()=>{
    for(const raw of ['mysql://test@production.invalid/','mysql://test@127.0.0.1/real','mysql://test@127.0.0.1/?database=real'])assert.throws(()=>config(raw));
});
test('real MySQL site measurement: concurrent flags, cohort rates, withdrawal, expiry, retention and UTC',{
    skip:!process.env.SITE_MYSQL_TEST_URL && 'Requires isolated local MySQL',timeout:30000,
},async t=>{
    const mysql=await import('mysql2/promise');const options=config(process.env.SITE_MYSQL_TEST_URL);
    const control=await mysql.createConnection(options),name='site_test_'+randomUUID().replaceAll('-','');let db,created=false;
    t.after(async()=>{if(db)await db.end();try{if(created)await control.query('DROP DATABASE `'+name+'`');}finally{await control.end();}});
    await control.query('CREATE DATABASE `'+name+'`');created=true;
    // Deliberately use a non-UTC driver setting: measurement parameters must remain explicit UTC strings.
    db=mysql.createPool({...options,database:name,timezone:'+03:00'});
    const migration=await readFile(new URL('../database/migrations/20261029-site-measurement.sql',import.meta.url),'utf8');
    for(const statement of migration.replace(/^--.*$/gm,'').split(';').map(v=>v.trim()).filter(Boolean))await db.query(statement);
    await initializeSiteMeasurement(db);await initializeSiteMeasurement(db);
    const now=Date.now(),receipt='b'.repeat(64),grant={enabled:true,version:SITE_CONSENT_VERSION,receipt,at:now,schema_version:1,environment:'local'};
    let clock=now;const service=createSiteMeasurement({db,enabled:true,clock:()=>clock});
    const ctx=()=>({receipt,flow:randomUUID(),code:'s02',entry:'p_offer',startedAt:now});
    const evt=(context,event_name='landing_view',error_class)=>({context,event_name,schema_version:1,environment:'local',...(error_class?{error_class}:{})});
    assert.equal(await service.record(evt(ctx())),false);await service.grant(grant);
    const first=ctx();await Promise.all(Array.from({length:24},()=>service.record(evt(first))));
    const [[one]]=await db.query('SELECT COUNT(*) n FROM site_measurement_flows');assert.equal(one.n,1);
    const [[utc]]=await db.query("SELECT DATE_FORMAT(created_at,'%Y-%m-%d %H:%i') AS minute FROM site_measurement_flows LIMIT 1");
    assert.equal(utc.minute,new Date(now).toISOString().slice(0,16).replace('T',' '));
    await db.query('DELETE FROM site_measurement_flows');
    for(let i=0;i<20;i++){
        const context=ctx();await service.record(evt(context));await service.record(evt(context,'offer_view'));
        if(i<10){await service.record(evt(context,'cta_click'));await service.record(evt(context,'inquiry_start'));}
        if(i<5){assert.equal(await service.record(evt(context,'inquiry_success')),false);await service.record(evt(context,'inquiry_success'),true);}
        if(i>=5&&i<10)await service.record(evt(context,'form_error','validation'));
    }
    clock=now+2*86400000;const summary=await service.summary();clock=now;assert.equal(summary.rows.length,1);assert.equal(summary.rows[0].startToSavedRate,.5);
    assert.equal(summary.rows[0].landingViews,20);assert.equal(summary.rows[0].inquirySuccesses,5);assert.equal(summary.booking,'not_instrumented');
    assert.equal(summary.rows[0].day,new Date(now).toISOString().slice(0,10));
    const [columns]=await db.query('SHOW COLUMNS FROM site_measurement_flows');
    for(const bad of ['name','email','message','request_id','url','referrer','ip','user_agent','offer','practitioner'])assert.equal(columns.some(c=>c.Field===bad),false);
    await Promise.all([service.revoke(receipt),...Array.from({length:12},()=>service.record(evt(first)))]);
    const [[empty]]=await db.query('SELECT COUNT(*) n FROM site_measurement_flows');assert.equal(empty.n,0);
    assert.equal(await service.grant(grant),false);assert.equal(await service.record(evt(ctx())),false);
    const newer={...grant,receipt:'c'.repeat(64)};await service.grant(newer);
    const fresh={...ctx(),receipt:newer.receipt};await service.record(evt(fresh));clock=now+30*60000;
    assert.equal(await service.record(evt(fresh,'cta_click')),false);clock=now;
    await db.query('UPDATE site_measurement_flows SET created_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 8 DAY)');await cleanSiteMeasurement(db);
    const [[expired]]=await db.query('SELECT COUNT(*) n FROM site_measurement_flows');assert.equal(expired.n,0);
    await db.query('UPDATE site_measurement_consents SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 DAY)');await cleanSiteMeasurement(db);
    const [[consents]]=await db.query('SELECT COUNT(*) n FROM site_measurement_consents');assert.equal(consents.n,0);
    // Real partial-schema regressions: neither cleanup nor withdrawal may skip
    // surviving tables just because a different measurement table is missing.
    await service.grant({...grant,receipt:'d'.repeat(64)});
    await db.query('UPDATE site_measurement_consents SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 DAY)');
    await db.query('DROP TABLE site_measurement_flows');await cleanSiteMeasurement(db);
    const [[consentOnly]]=await db.query('SELECT COUNT(*) n FROM site_measurement_consents');assert.equal(consentOnly.n,0);
    assert.equal(await service.revoke('d'.repeat(64)),true);assert.equal(service.enabled,false);
    await initializeSiteMeasurement(db);service.enabled=true;
    for(const token of ['e'.repeat(64),'f'.repeat(64)]){
        await service.grant({...grant,receipt:token});await service.record(evt({...ctx(),receipt:token}));
    }
    await db.query('DROP TABLE site_measurement_consents');
    assert.equal(await service.revoke('e'.repeat(64)),false);assert.equal(service.enabled,false);
    const [[targetRemoved]]=await db.query('SELECT COUNT(*) n FROM site_measurement_flows');assert.equal(targetRemoved.n,1);
    await cleanSiteMeasurement(db);const [[orphans]]=await db.query('SELECT COUNT(*) n FROM site_measurement_flows');assert.equal(orphans.n,0);
    await initializeSiteMeasurement(db);assert.equal(await service.revoke('e'.repeat(64)),true);
    assert.equal(await service.grant({...grant,receipt:'e'.repeat(64)}),false);
    await db.query('DROP TABLE site_measurement_flows');await db.query('DROP TABLE site_measurement_consents');
    // The extension's surviving activity table still requires a durable marker,
    // even when currently empty. Only confirmed absence of ALL usage tables acks.
    assert.equal(await service.revoke(receipt),false);
    await db.query('DROP TABLE site_measurement_activity');
    assert.equal(await service.revoke(receipt),true);
});
