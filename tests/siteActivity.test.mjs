import test from 'node:test';
import { fakeDatabase } from './helpers/siteActivityDatabase.mjs';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createSiteActivityClient } from '../src/lib/siteActivityClient.js';
import { normalizeSiteActivity,activityAdvances,siteActivityReport } from '../shared/siteActivity.js';
import { SITE_CONSENT_VERSION,siteCode,sitePage,siteContext,siteEvent } from '../shared/siteMeasurement.js';
import { createSiteMeasurement, cleanSiteMeasurement, initializeSiteMeasurement, siteMeasurementSchema } from '../server/siteMeasurement.js';
import {siteMeasurementCopy} from '../shared/siteMeasurementCopy.js';
import {prepareBookingMeasurementHandoff,bookingMeasurementAvailability} from '../server/bookingMeasurementHandoff.js';
import {createSiteMeasurementClient} from '../src/lib/siteMeasurementClient.js';
import {releaseSiteMeasurements,finalizedSiteDay} from '../server/siteMeasurementRelease.js';
const receipt='a'.repeat(64),now=Date.now();
const context=()=>({receipt,flow:randomUUID(),code:'i01h',entry:'p_home',startedAt:now});
const state=(extra={})=>({revision:1,pages:[{page:'p_home',visits:1,active_seconds:0,scroll:0}],transitions:[],last_page:'p_home',ended:'open',...extra});
test('strict neutral link registry differentiates all four landing destinations without storing query values',()=>{
    for(const [suffix,path,page] of [['h','/','p_home'],['o','/prices','p_offer'],['b','/termin-buchen','p_booking'],['c','/kontakt','p_contact']]){
        assert.equal(sitePage(path),page);assert.equal(siteCode('?sc=i01'+suffix+'&email=secret',page),'i01'+suffix);
        assert.equal(siteCode('?sc=i01'+suffix,'p_other'),null);
        assert.equal(siteCode('?sc=i01'+suffix+'&sc=i01'+suffix,page),null);
    }
    assert.equal(siteContext({...context(),entry:'p_contact'},now),null);
    assert.equal(siteCode('?utm_source=trauma&fbclid=secret','p_home'),null);
    assert.equal(siteEvent({context:context(),event_name:'booking_confirmed',schema_version:1,environment:'local'},true,now),null);
});
test('snapshot schema rejects URLs, event trails, personal fields, fractional and inconsistent counters',()=>{
    assert.ok(normalizeSiteActivity(state()));
    for(const patch of [{url:'secret'},{pages:[{page:'/coaching',visits:1,active_seconds:0,scroll:0}]},
        {pages:[{page:'p_home',visits:1,active_seconds:2.5,scroll:0}]},
        {pages:[{page:'p_home',visits:2,active_seconds:0,scroll:0}]},{revision:0},{ended:'booked'},
        {transitions:[{from:'p_home',to:'p_home',count:1}]},{pages:[{page:'p_home',visits:1,active_seconds:1801,scroll:0}]}])assert.equal(normalizeSiteActivity(state(patch)),null);
    assert.equal(activityAdvances(state({ended:'pagehide'}),state({revision:2})),false);
    assert.equal(activityAdvances(state({pages:[{page:'p_home',visits:1,active_seconds:10,scroll:25}]}),state({revision:2})),false);
});
test('active sampler excludes hidden/unfocused/idle/suspended time and never collects before consent',async()=>{
    let time=0,shown=true,c=null,page='p_home';const sent=[];
    const sampler=createSiteActivityClient({context:()=>c,page:()=>page,now:()=>time,visible:()=>shown,send:async(s,ctx)=>{sent.push([s,ctx]);return true;}});
    for(let i=0;i<40;i++){time+=1000;sampler.tick();}await sampler.flush();assert.equal(sent.length,0);
    c=context();sampler.tick();
    for(let i=0;i<10;i++){time+=1000;sampler.tick();}await sampler.flush();assert.equal(sent.at(-1)[0].pages[0].active_seconds,10);
    shown=false;for(let i=0;i<20;i++){time+=1000;sampler.tick();}await sampler.flush();assert.equal(sent.at(-1)[0].pages[0].active_seconds,10);
    shown=true;sampler.activity();for(let i=0;i<45;i++){time+=1000;sampler.tick();}await sampler.flush();assert.equal(sent.at(-1)[0].pages[0].active_seconds,40);
    sampler.activity();time+=600000;sampler.tick();await sampler.flush();assert.equal(sent.at(-1)[0].pages[0].active_seconds,41); // <=1s catch-up.
    c=null;sampler.tick();const n=sent.length;sampler.scroll(100);await sampler.close();assert.equal(sent.length,n);
});
test('back/forward and repeated neutral navigation use cumulative snapshots; reset/reload uses a new flow',async()=>{
    let time=0,c=context(),page='p_home';const sent=[];
    const sampler=createSiteActivityClient({context:()=>c,page:()=>page,now:()=>time,visible:()=>true,send:async s=>{sent.push(s);return false;}});
    sampler.tick();time+=1000;sampler.tick();sampler.scroll(62);
    sampler.navigate('p_offer');page='p_offer';sampler.navigate('p_home');page='p_home';sampler.navigate('p_offer');page='p_offer';
    await sampler.flush();let s=sent.at(-1);assert.ok(normalizeSiteActivity(s));assert.equal(s.pages[0].scroll,50);
    assert.equal(s.pages[0].visits,2);assert.equal(s.pages[1].visits,2);assert.equal(s.transitions[0].count,2);
    sampler.navigate(null);page=null;assert.equal(sent.at(-1).ended,'excluded');assert.equal(JSON.stringify(sent).includes('private'),false);
    page='p_contact';c={...context(),code:null,entry:'p_contact'};sampler.tick();await sampler.close();s=sent.at(-1);
    assert.equal(s.revision,1);assert.equal(s.last_page,'p_contact');assert.equal(s.pages.length,1);assert.equal(s.ended,'pagehide');
});
test('joint activity cells, landing complements, transitions and endpoint partitions guard small groups',()=>{
    const base=[{day:'2026-11-01',code:'i01h',flows:20}],allowed=[{day:'2026-11-01',code:'i01h'}];
    const row=()=>({day:'2026-11-01',code:'i01h',entry_class:'p_home',landed:1,expired:1,state_json:state()});
    for(let n=0;n<=20;n++){
        const rows=Array.from({length:20},(_,i)=>({...row(),state_json:state({pages:[{page:'p_home',visits:1,active_seconds:i<n?10:0,scroll:0}]})}));
        assert.equal(siteActivityReport(rows,base,allowed).length===1,(n===0||n>=5)&&(20-n===0||20-n>=5),String(n));
    }
    const rows=Array.from({length:20},row);let report=siteActivityReport(rows,base,allowed)[0];
    assert.deepEqual(report.landings,[{page:'p_home',flows:20}]);assert.equal(report.endpoints[0].endpoint,'p_home|expired_last_observation');
    rows[0].landed=0;assert.equal(siteActivityReport(rows,base,allowed).length,0);rows[0].landed=1;
    rows[0].state_json=null;assert.equal(siteActivityReport(rows,base,allowed).length,0);rows[0]=row();
    rows[0].expired=0;assert.equal(siteActivityReport(rows,base,allowed).length,0);
    assert.equal(siteActivityReport([],base,[]).length,0);
});

test('activity service requires current grant; duplicates/late snapshots and revoke races cannot resurrect data',async()=>{
    const f=fakeDatabase(),service=createSiteMeasurement({...f,enabled:true,clock:()=>now+60000}),c=context();
    const body={context:c,state:state(),schema_version:1,environment:'local'};
    assert.equal(await service.activity(body),false);
    assert.equal(await service.grant({version:SITE_CONSENT_VERSION,receipt,at:now,enabled:true,schema_version:1,environment:'local'}),true);
    await Promise.all(Array.from({length:20},()=>service.activity(body)));assert.equal(f.activity.size,1);assert.equal([...f.flows.values()][0].flags,0);
    await service.activity({...body,state:state({revision:3,pages:[{page:'p_home',visits:1,active_seconds:30,scroll:25}]})});
    await service.activity({...body,state:state({revision:2})});assert.equal([...f.activity.values()][0].revision,3);
    assert.equal(await service.activity({...body,state:state({revision:4})}),false);
    assert.equal(await service.activity({...body,state:state({revision:4,pages:[{page:'p_home',visits:1,active_seconds:70,scroll:25}]})}),false);
    assert.equal(await service.activity({...body,url:'secret'}),false);
    const late=createSiteMeasurement({...f,enabled:true,clock:()=>now+31*60000});
    assert.equal(await late.activity({...body,context:{...c,startedAt:now+31*60000},state:state({revision:4})}),false);
    await Promise.all([service.revoke(receipt),service.activity({...body,state:state({revision:4})})]);
    assert.equal(f.activity.size,0);assert.equal(f.flows.size,0);assert.equal(await service.activity(body),false);
    assert.ok(f.calls.every(([,p])=>!JSON.stringify(p).includes('secret')));
});
test('partial schema cannot skip surviving activity deletion or falsely acknowledge missing tombstones',async()=>{
    const f=fakeDatabase(),service=createSiteMeasurement({...f,enabled:true,clock:()=>now}),c=context();
    await service.grant({version:SITE_CONSENT_VERSION,receipt,at:now,enabled:true,schema_version:1,environment:'local'});
    await service.activity({context:c,state:state(),schema_version:1,environment:'local'});assert.equal(f.activity.size,1);
    f.tables.delete('site_measurement_flows');f.tables.delete('site_measurement_consents');
    assert.equal(await service.revoke(receipt),false);assert.equal(f.activity.size,0);
    f.activity.set('orphan',{receipt:'unrelated'});await cleanSiteMeasurement(f.db);assert.equal(f.activity.size,0);
    assert.equal(siteMeasurementSchema.length,4);
});
test('DE/TR drafts disclose active/idle limits, optionality, pending retention and unconfirmed bookings',()=>{
    for(const locale of ['de','tr'])for(const key of ['purpose','retention','withdrawal','yes','no','error'])assert.ok(siteMeasurementCopy[locale][key].length>10);
    assert.match(siteMeasurementCopy.de.purpose,/30 Sekunden/);assert.match(siteMeasurementCopy.tr.purpose,/30 saniye/);
});
test('booking handoff remains disconnected and rejects clicks, done status, absent consent and expired mapping',()=>{
    assert.equal(bookingMeasurementAvailability.status,'not_instrumented');
    const base={confirmed:true,cancelled:false,serverVerified:true,consentActive:true,source:'personal_appointment_ledger',reference:'synthetic_123',context:context()};
    const result=prepareBookingMeasurementHandoff(base,now);assert.ok(result);assert.equal(JSON.stringify(result).includes('synthetic_123'),false);
    for(const patch of [{confirmed:false},{serverVerified:false},{consentActive:false},{source:'cta_click'},{source:'done'},
        {cancelled:true},{context:{...context(),startedAt:now-1800000}}])assert.equal(prepareBookingMeasurementHandoff({...base,...patch},now),null);
});
test('a broader contract never inherits old permission or loses an unconfirmed old-version receipt',async()=>{
    const values=new Map([['sh-site-measurement-choice',JSON.stringify({version:'site-first-party-2026-10-29-v1',at:now,enabled:true,receipt})]]);
    const calls=[];let ack=false;
    const client=createSiteMeasurementClient({enabled:true,storage:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},
        withLock:task=>task(),clock:()=>now,random:()=>receipt,uuid:()=>randomUUID(),send:async(action)=>{calls.push(action);return ack;}});
    assert.equal(await client.restore('/'),false);assert.equal(client.context(),null);
    assert.equal(client.snapshot().choice.pending,true);assert.deepEqual(calls,['revoke']);
    ack=true;assert.equal(await client.recover(),true);assert.equal(client.snapshot().choice.receipt,undefined);
    assert.equal(calls.includes('consent'),false);
});
test('review repro: navigation before any sampler tick preserves entry and first SPA/back/forward transition',async()=>{
    const c=context();let page='p_offer';const sent=[];
    const sampler=createSiteActivityClient({context:()=>c,page:()=>page,now:()=>0,visible:()=>true,send:async s=>{sent.push(s);return true;}});
    sampler.navigate('p_offer');await sampler.flush();
    assert.deepEqual(sent.at(-1).pages.map(p=>p.page),['p_home','p_offer']);assert.equal(sent.at(-1).transitions[0].from,'p_home');
    sampler.navigate('p_home');page='p_home';await sampler.flush();assert.equal(sent.at(-1).pages[0].visits,2);
});
test('layout/programmatic scroll cannot extend the active-time idle deadline',async()=>{
    let time=0;const sent=[],c=context();
    const sampler=createSiteActivityClient({context:()=>c,page:()=> 'p_home',now:()=>time,visible:()=>true,send:async s=>{sent.push(s);return true;}});
    sampler.start();for(let i=0;i<70;i++){time+=1000;sampler.scroll(80);sampler.tick();}await sampler.flush();
    assert.equal(sent.at(-1).pages[0].active_seconds,30);assert.equal(sent.at(-1).pages[0].scroll,75);
});
test('review repro: 5/5 to 5/6 or 6 to 5 cannot produce two different numeric releases, including after restart',async()=>{
    const f=fakeDatabase(),day='2026-10-25',now=Date.parse('2026-10-27T00:30:00Z');
    assert.equal(finalizedSiteDay(day,Date.parse(day+'T23:59:00Z')),false);
    assert.equal(finalizedSiteDay(day,Date.parse('2026-10-26T00:30:00Z')),true);
    const first={day,code:'i01h',flows:10};
    const make=(row,a)=>releaseSiteMeasurements({...f,now,cohorts:[row],rows:[row],activity:[{day,code:'i01h',cells:a}]});
    assert.equal((await make(first,[5,5])).rows.length,1);
    assert.equal((await make(first,[5,5])).rows.length,1); // Same immutable values are repeatable.
    assert.equal((await make({...first,flows:11},[5,6])).rows.length,0);
    assert.equal((await make(first,[5,5])).rows.length,0); // No republish after reversal/restart.
    f.releases.clear();assert.equal((await make({...first,flows:11},[5,6])).rows.length,1);
    assert.equal((await make(first,[5,5])).rows.length,0); // Withdrawal 6→5 also blocks whole cohort.
    assert.equal((await releaseSiteMeasurements({...f,now:Date.parse('2026-10-25T12:00:00Z'),cohorts:[first],rows:[first],activity:[]})).rows.length,0);
});
test('review repro: DE/TR separately disclose 7-day usage and 30-day server consent/block records',()=>{
    assert.match(siteMeasurementCopy.de.retention,/Nutzungsdaten.*7 Tage/);assert.match(siteMeasurementCopy.de.retention,/Einwilligungsbelege.*30-Tage/);
    assert.match(siteMeasurementCopy.de.retention,/Sperrbeleg.*30 Tage ab Widerruf/);
    assert.match(siteMeasurementCopy.tr.retention,/kullanım verileri.*7 gün/);assert.match(siteMeasurementCopy.tr.retention,/izin belgeleri.*30 günlük/);
});
test('published cohort is withdrawn on one confirmed deletion and release history cannot be silently reset',async()=>{
    const f=fakeDatabase();let t=now-2*86400000;const base=t;
    const service=createSiteMeasurement({...f,enabled:true,clock:()=>t});const tokens=[];
    for(let i=0;i<11;i++){
        const token=i.toString(16).padStart(64,'0');tokens.push(token);
        await service.grant({receipt:token,at:base,enabled:true,version:SITE_CONSENT_VERSION,schema_version:1,environment:'local'});
        const c={...context(),receipt:token,startedAt:base};t=base+60000;
        await service.record({context:c,event_name:'landing_view',schema_version:1,environment:'local'});
        await service.activity({context:c,state:state({pages:[{page:'p_home',visits:1,active_seconds:i<5?0:20,scroll:0}],ended:'pagehide'}),schema_version:1,environment:'local'});
    }
    t=now;assert.equal((await service.summary()).activity.length,1);
    await service.revoke(tokens[10]);assert.equal((await service.summary()).rows.length,0);
    const restarted=createSiteMeasurement({...f,enabled:true,clock:()=>t});assert.equal((await restarted.summary()).rows.length,0);
    f.tables.delete('site_measurement_releases');
    await assert.rejects(initializeSiteMeasurement(f.db),/Release history missing/);
});
