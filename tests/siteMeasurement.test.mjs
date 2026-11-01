import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import express from 'express';
import { SITE_CONSENT_VERSION, SITE_CONSENT_MS, SITE_FLOW_MS, siteCode, siteContext, siteEvent, siteSummary, sitePage } from '../shared/siteMeasurement.js';
import { createSiteMeasurement, registerSiteMeasurementRoutes, cleanSiteMeasurement } from '../server/siteMeasurement.js';
import { createSiteMeasurementClient } from '../src/lib/siteMeasurementClient.js';
import { createRequestOrigins } from '../server/requestOrigins.js';
const receipt = 'a'.repeat(64), now = Date.now();
const choice = () => ({ enabled: true, at: now, receipt, version: SITE_CONSENT_VERSION, schema_version: 1, environment: 'local' });
const context = () => ({ receipt, flow: randomUUID(), startedAt: now, code: 's01', entry: 'p_home' });
const event = (c, event_name = 'landing_view', extra = {}) => ({ context: c, event_name, schema_version: 1, environment: 'local', ...extra });
function store() {
    const consents = new Map(), flows = new Map(), calls = [], tails = new Map();
    const date = value => new Date(typeof value === 'string' ? value.replace(' ','T')+'Z' : value);
    const db = { async execute(sql, p = []) {
        calls.push([sql,p]);
        if(sql.startsWith('SELECT 1 FROM'))return [[]];
        if(sql.startsWith('SELECT receipt_hash FROM site_measurement_flows'))return [[...flows.values()].filter(f=>f.receipt===p[0]).map(f=>({receipt_hash:f.receipt}))];
        if(sql.includes('AND revoked_at IS NOT NULL'))return [consents.get(p[0])?.revoked?[{receipt_hash:p[0]}]:[]];
        if (sql.startsWith('SELECT receipt_hash')) {
            const c = consents.get(p[0]); return [[...(c && c.version === p[1] && c.environment === p[2] && !c.revoked && c.expires > date(p[3]) && c.at <= date(p[4]) ? [c] : [])]];
        }
        if (sql.startsWith('INSERT INTO site_measurement_consents')) {
            const old = consents.get(p[0]), revoked = sql.includes('revoked_at,version');
            if (revoked) consents.set(p[0], { ...(old || { receipt_hash: p[0], at:date(p[1]),expires:date(p[2]),version:p[4],environment:p[5] }),revoked:p[3] });
            else if (!old) consents.set(p[0], { receipt_hash:p[0],at:date(p[1]),expires:date(p[2]),version:p[3],environment:p[4] });
        }
        if (sql.startsWith('INSERT INTO site_measurement_flows')) {
            const key=p[0]+p[1];if(!flows.has(key)) flows.set(key,{receipt:p[0],flow:p[1],code:p[2],entry:p[3],created:date(p[4]),expires:date(p[5]),flags:0});
        }
        if (sql.startsWith('UPDATE site_measurement_flows')) {
            const f=flows.get(p[3]+p[4]);if(!f || f.expires<=date(p[5]))return [{affectedRows:0}];
            f.flags |= p[0];f.validation = Math.max(f.validation||0,p[1]);f.technical=Math.max(f.technical||0,p[2]);
        }
        if (sql.startsWith('DELETE FROM site_measurement_flows WHERE receipt_hash')) for(const [k,f] of flows)if(f.receipt===p[0])flows.delete(k);
        return [{ affectedRows:1 }];
    }, async query() { return [[]]; } };
    const lock = async (_db,key,task) => {
        const previous = tails.get(key)||Promise.resolve();let release;
        tails.set(key,new Promise(r=>{release=r;}));await previous;
        try{return await task(db);}finally{release();}
    };
    return {db,consents,flows,calls,lock};
}
test('neutral registry, strict schemas, expiry and no public success fabrication', () => {
    assert.equal(siteCode('?sc=s01&email=private&fbclid=private'), 's01');
    for(const q of ['?sc=trauma','?sc=s01&sc=s01','?sc=__proto__','?utm_source=instagram','x'.repeat(5000)])assert.equal(siteCode(q),null);
    for(const p of ['/therapie','/coaching','/admin','/mitglieder','/startfragebogen'])assert.equal(sitePage(p),null);
    const c=context();assert.ok(siteContext(c,now));
    for(const patch of [{email:'private'},{entry:'/therapie'},{code:'diagnosis'},{startedAt:now-SITE_FLOW_MS},{startedAt:now+1},{receipt:'bad'}])assert.equal(siteContext({...c,...patch},now),null);
    assert.equal(siteEvent(event(c,'inquiry_success'),false,now),null);
    assert.ok(siteEvent(event(c,'inquiry_success'),true,now));
    assert.equal(siteEvent(event(c,'form_error',{error_class:'email invalid'}),false,now),null);
    assert.equal(siteEvent(event(c,'landing_view',{url:'private'}),false,now),null);
    assert.equal(siteEvent(event(c,'landing_view',{schema_version:2}),false,now),null);
});
test('consent is immutable, flags deduplicate, revoke races cannot restore data, no form IDs or raw values', async () => {
    const s=store();let time=now;const service=createSiteMeasurement({...s,enabled:true,clock:()=>time});const c=context();
    assert.equal(await service.record(event(c)),false);assert.equal(s.flows.size,0);
    assert.equal(await service.grant({...choice(),email:'private'}),false);
    assert.equal(await service.grant(choice()),true);
    await Promise.all(Array.from({length:20},()=>service.record(event(c))));assert.equal(s.flows.size,1);
    await service.record(event(c,'inquiry_start'));await service.record(event(c,'inquiry_success'),true);
    assert.equal([...s.flows.values()][0].flags,41);
    assert.equal(await service.record(event({...c,code:'private'})),false);
    await service.grant({...choice(),at:now+1000});assert.equal([...s.consents.values()][0].at.getTime(),now);
    await Promise.all([service.revoke(receipt),service.record(event(c))]);assert.equal(s.flows.size,0);
    assert.equal(await service.grant(choice()),false);assert.equal(await service.record(event(c)),false);
    assert.ok(s.calls.every(([,params])=>!JSON.stringify(params).includes('private')));
    time=now+SITE_CONSENT_MS;assert.equal(await service.grant(choice()),false);
    const before=store();const reversed=createSiteMeasurement({...before,enabled:true,clock:()=>now});
    await reversed.revoke(receipt);assert.equal(await reversed.grant(choice()),false);
});
test('disabled backend and expired flow cannot write; environments cannot mix',async()=>{
    const s=store(),off=createSiteMeasurement({...s});assert.equal(await off.grant(choice()),false);assert.equal(await off.record(event(context())),false);assert.equal(s.calls.length,0);
    let time=now;const on=createSiteMeasurement({...s,enabled:true,clock:()=>time});await on.grant(choice());
    assert.equal(await on.record(event(context(),'landing_view',{environment:'production'})),false);
    time+=SITE_FLOW_MS;assert.equal(await on.record(event(context())),false);assert.equal(s.flows.size,0);
});
test('summary protects small/complement cells and uses actual same-flow intersection denominator',()=>{
    const base={day:'2026-10-29',code:'s01',flows:20,landing_views:20,offer_views:15,cta_clicks:10,inquiry_starts:10,inquiry_successes:5,started_and_saved:5};
    const row=siteSummary([base])[0];assert.equal(row.startToSavedRate,0.5);assert.equal(row.source,'instagram');
    assert.equal(siteSummary([{...base,flows:4}]).length,0);
    assert.equal(siteSummary([{...base,form_errors:1}]).length,0);
    assert.equal(siteSummary([{...base,offer_views:19}]).length,0);
    assert.equal(siteSummary([{...base,inquiry_starts:8}]).length,0);
    assert.equal(siteSummary([{...base,inquiry_starts:0,started_and_saved:0}])[0].startToSavedRate,null);
});
test('summary suppresses review-reproduced success-only and both-error singleton disclosures',()=>{
    const base={day:'2026-10-29',code:'s01',flows:20,landing_views:20,inquiry_starts:10,inquiry_successes:6,started_and_saved:5};
    assert.equal(siteSummary([base]).length,0); // 6 successes - 5 with start = 1 success without start.
    assert.equal(siteSummary([{...base,inquiry_successes:5,form_errors:15,validation_errors:10,technical_errors:6}]).length,0); // 10+6-15 = 1 both-error flow.
    const safe={...base,inquiry_successes:10,form_errors:15,validation_errors:10,technical_errors:10};
    assert.equal(siteSummary([safe]).length,1); // Every nonempty atom is exactly 5.
    for(const patch of [{inquiry_successes:11},{inquiry_starts:11},{started_and_saved:6},
        {validation_errors:11},{technical_errors:11},{form_errors:16}])assert.equal(siteSummary([{...safe,...patch}]).length,0);
    for(const patch of [{started_and_saved:11},{form_errors:21},{technical_errors:30},{flows:'invalid'},{inquiry_starts:10.5}])assert.equal(siteSummary([{...safe,...patch}]).length,0);
});
test('summary exhaustively guards all four start/success and error-class atoms at the threshold',()=>{
    for(let a=0;a<=6;a++)for(let b=0;b<=6;b++)for(let c=0;c<=6;c++)for(let d=0;d<=6;d++){
        const total=a+b+c+d, expected=total>=5&&[a,b,c,d].every(n=>n===0||n>=5);
        const base={day:'2026-10-29',code:'s01',flows:total,landing_views:total};
        const start={...base,inquiry_starts:a+b,inquiry_successes:a+c,started_and_saved:a};
        const error={...base,form_errors:a+b+c,validation_errors:a+b,technical_errors:a+c};
        assert.equal(siteSummary([start]).length===1,expected,JSON.stringify({partition:'start/saved',a,b,c,d}));
        assert.equal(siteSummary([error]).length===1,expected,JSON.stringify({partition:'errors',a,b,c,d}));
    }
});
function clientFixture(options={}) {
    const data=new Map(),sent=[];let time=now,blocked=false;
    const storage={setItem:(k,v)=>data.set(k,v),getItem:k=>data.get(k),removeItem:k=>data.delete(k)};
    const client=createSiteMeasurementClient({enabled:true,storage,clock:()=>time,privacySignal:()=>blocked,
        withLock: task => task(),
        random:()=>receipt,uuid:()=>randomUUID(),send:async(action,body)=>{sent.push([action,body]);return true;},...options});
    return {client,data,sent,storage,advance:n=>{time+=n;},privacy:()=>{blocked=true;}};
}
test('client emits nothing before consent or on sensitive pages; storage holds only consent and receipt',async()=>{
    const f=clientFixture();f.client.enter('/','?sc=s01&email=private');await f.client.track('inquiry_start');assert.equal(f.sent.length,0);assert.equal(f.data.size,0);
    await f.client.choose(false,'/');assert.equal(f.sent.length,0);
    await f.client.choose(true,'/','?sc=s01&email=private');await f.client.track('inquiry_start');await f.client.track('inquiry_start');
    assert.deepEqual(f.sent.map(([a,b])=>a==='event'?b.event_name:a),['consent','landing_view','inquiry_start']);
    assert.equal(JSON.stringify([...f.data.values()]).includes('s01'),false);assert.equal(JSON.stringify(f.sent).includes('private'),false);
    f.client.enter('/prices','?sc=s02');assert.equal(f.client.context().code,'s01');
    f.client.enter('/therapie');await f.client.track('form_error','validation');assert.equal(f.client.context(),null);
    f.client.enter('/kontakt');assert.equal(f.client.context().code,null);
    f.advance(SITE_FLOW_MS);assert.equal(f.client.context(),null);
});
test('blocked storage, privacy signal, server refusal and failed withdrawal all fail closed',async()=>{
    const denied=clientFixture({storage:{getItem(){throw Error();},setItem(){throw Error();}}});assert.equal(await denied.client.choose(true,'/'),false);assert.equal(denied.client.context(),null);
    const signal=clientFixture();await signal.client.choose(true,'/');signal.privacy();assert.equal(signal.client.context(),null);
    const refused=clientFixture({send:async()=>false});assert.equal(await refused.client.choose(true,'/'),false);assert.equal(refused.client.context(),null);
    let fail=false;const f=clientFixture({send:async action=>!(fail&&action==='revoke')});await f.client.choose(true,'/');fail=true;
    assert.equal(await f.client.choose(false,'/'),false);assert.equal(f.client.context(),null);assert.equal(f.client.snapshot().choice.pending,true);
    assert.equal(await f.client.choose(true,'/'),false);assert.equal(f.client.context(),null);
});
test('late consent response cannot undo withdrawal; pending withdrawal retries on reload and disabled client',async()=>{
    let release;const f=clientFixture({send:async action=>action==='consent'?await new Promise(r=>{release=r;}):true});
    const grant=f.client.choose(true,'/');await new Promise(r=>setImmediate(r));
    await f.client.choose(false,'/');release(true);assert.equal(await grant,false);assert.equal(f.client.context(),null);
    const g=clientFixture();g.storage.setItem('sh-site-measurement-choice',JSON.stringify({...choice(),enabled:false,pending:true}));await g.client.restore('/');
    assert.equal(g.sent[0][0],'revoke');assert.equal(g.client.context(),null);
    const h=clientFixture({enabled:false});h.storage.setItem('sh-site-measurement-choice',JSON.stringify(choice()));await h.client.restore('/');
    assert.equal(h.sent[0][0],'revoke');assert.equal(h.client.context(),null);
});
test('navigation during consent registration cannot emit events for a stale allowed page',async()=>{
    let release;const sent=[];const f=clientFixture({send:async(action,body)=>{
        sent.push([action,body]);if(action==='consent')return await new Promise(r=>{release=r;});return true;
    }});
    const grant=f.client.choose(true,'/prices','?sc=s01');await new Promise(r=>setImmediate(r));
    f.client.enter('/therapie','?email=private');release(true);assert.equal(await grant,true);
    assert.equal(f.client.context(),null);assert.deepEqual(sent.map(([action])=>action),['consent']);
    f.client.enter('/kontakt');assert.equal(f.client.context().code,null);
});
test('stale tab withdraws current shared receipt and retains unconfirmed receipts until acknowledgement',async()=>{
    const data=new Map(),active=new Set(),revoked=[],key='sh-site-measurement-choice';let tail=Promise.resolve(),fail=false,release;
    const withLock=task=>{const result=tail.then(task);tail=result.catch(()=>{});return result;};
    const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
    const send=async(action,body)=>{
        if(action==='consent'){active.add(body.receipt);return true;}
        if(action==='revoke'){
            revoked.push(body.receipt);if(fail&&body.receipt==='b'.repeat(64))return false;
            if(release===null&&body.receipt==='b'.repeat(64))await new Promise(r=>{release=r;});
            active.delete(body.receipt);return true;
        }return true;
    };
    const make=token=>createSiteMeasurementClient({enabled:true,environment:'local',storage,withLock,send,random:()=>token,uuid:()=>randomUUID(),clock:()=>now});
    const a=make(receipt),b=make('b'.repeat(64));
    await a.choose(true,'/');await b.choose(true,'/');
    assert.equal(a.snapshot().choice.receipt,receipt); // Deliberately delay the real storage event.
    assert.deepEqual([...active],['b'.repeat(64)]);
    fail=true;assert.equal(await a.choose(false,'/'),false);
    assert.equal(a.context(),null);assert.equal(JSON.parse(data.get(key)).pending,true);
    assert.deepEqual(JSON.parse(data.get(key)).pendingReceipts.map(x=>x.receipt),['b'.repeat(64)]);
    b.sync();assert.equal(b.snapshot().choice.receipt,'b'.repeat(64));assert.equal(b.context(),null);
    fail=false;release=null;const withdrawal=a.choose(false,'/');await new Promise(r=>setImmediate(r));
    assert.equal(JSON.parse(data.get(key)).receipt,'b'.repeat(64));assert.equal(active.size,1);
    release();assert.equal(await withdrawal,true);assert.equal(active.size,0);
    assert.equal(JSON.parse(data.get(key)).receipt,undefined);assert.ok(revoked.includes(receipt));
});
test('expiry cleanup is separate from withdrawal; recovery preserves every attempted receipt when acknowledgement fails',async()=>{
    const f=clientFixture({send:async action=>action!=='revoke'});await f.client.choose(true,'/');
    f.advance(SITE_CONSENT_MS-1);assert.equal(await f.client.choose(false,'/'),false);
    assert.equal(f.client.snapshot().choice.at,now);f.advance(2);await f.client.restore('/');
    assert.equal(f.client.snapshot().choice.pending,true);
    assert.equal(f.client.snapshot().choice.receipt,receipt);
    const expired=clientFixture();expired.storage.setItem('sh-site-measurement-choice',JSON.stringify({...choice(),at:now-SITE_CONSENT_MS}));
    await expired.client.restore('/');assert.equal(expired.data.has('sh-site-measurement-choice'),false);
    const attempted=[];const g=clientFixture({send:async(action,body)=>{if(action==='revoke')attempted.push(body.receipt);return false;}});g.storage.setItem('sh-site-measurement-choice',JSON.stringify({
        version:SITE_CONSENT_VERSION,enabled:false,at:now-SITE_CONSENT_MS,receipt,pending:true,
        pendingReceipts:[{receipt,at:now-SITE_CONSENT_MS},{receipt:'b'.repeat(64),at:now}]}));
    await g.client.restore('/');
    assert.deepEqual(g.client.snapshot().choice.pendingReceipts,[{receipt,at:now-SITE_CONSENT_MS},{receipt:'b'.repeat(64),at:now}]);
    assert.deepEqual(attempted,[receipt,'b'.repeat(64)]);
});
test('shared-storage or cross-tab-lock failure cannot grant measurement or report withdrawal success',async()=>{
    const noLock=clientFixture({withLock:undefined});assert.equal(await noLock.client.choose(true,'/'),false);assert.equal(noLock.client.context(),null);
    const f=clientFixture();await f.client.choose(true,'/');
    const frozen=f.storage.setItem;f.storage.setItem=()=>{throw Error('blocked write');};
    assert.equal(await f.client.choose(false,'/'),false);assert.ok(JSON.parse(f.data.get('sh-site-measurement-choice')).receipt);
    f.storage.setItem=frozen;assert.equal(await f.client.choose(false,'/'),true);
});
test('explicit withdrawal never forgets a current receipt because its local timestamp is skewed',async()=>{
    const f=clientFixture();f.storage.setItem('sh-site-measurement-choice',JSON.stringify({...choice(),at:now+100000}));
    assert.equal(await f.client.choose(false,'/'),true);
    assert.ok(f.sent.some(([action,body])=>action==='revoke'&&body.receipt===receipt));
    assert.equal(JSON.parse(f.storage.getItem('sh-site-measurement-choice')).receipt,undefined);
});
test('explicit withdrawal after a browser-only 31-day clock jump revokes fresh server data and retains failures',async()=>{
    for (const fail of [false,true]) {
        const s=store(),service=createSiteMeasurement({...s,enabled:true,clock:()=>now}),sent=[];
        const f=clientFixture({send:async(action,body)=>{
            sent.push(action);
            if(action==='consent')return service.grant(body);
            if(action==='event')return service.record(body);
            if(action==='revoke')return fail?false:service.revoke(body.receipt);
            throw Error('Unexpected action');
        }});
        assert.equal(await f.client.choose(true,'/'),true);
        await f.client.track('inquiry_start');assert.equal(s.flows.size,1);
        f.advance(31*24*60*60*1000);assert.equal(f.client.context(),null);
        assert.equal(await f.client.choose(false,'/'),!fail);
        assert.equal(sent.filter(action=>action==='revoke').length,1);
        const saved=JSON.parse(f.storage.getItem('sh-site-measurement-choice'));
        assert.equal(s.flows.size,fail?1:0);
        assert.equal([...s.consents.values()][0].revoked!=null,!fail);
        assert.equal(saved.receipt,fail?receipt:undefined);
        if(fail){assert.equal(saved.pending,true);assert.equal(saved.at,now);}
    }
});
test('pending withdrawal matrix: clock skew, acknowledgement, button/online/SPA/reload/storage/concurrent recovery',async t=>{
    for(const days of [0,31])for(const ack of [false,true])for(const path of ['button','online','SPA','reload','storage','concurrent']){
        await t.test(`${days} days / ack ${ack} / ${path}`,async()=>{
            const s=store(),service=createSiteMeasurement({...s,enabled:true,clock:()=>now}),data=new Map();
            let time=now,allow=false,tail=Promise.resolve(),revokes=0;
            const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
            const withLock=task=>{const result=tail.then(task);tail=result.catch(()=>{});return result;};
            const make=()=>createSiteMeasurementClient({enabled:true,storage,withLock,clock:()=>time,
                random:()=>receipt,uuid:()=>randomUUID(),send:async(action,body)=>{
                    if(action==='consent')return service.grant(body);
                    if(action==='event')return service.record(body);
                    if(action==='revoke'){revokes++;return allow?service.revoke(body.receipt):false;}
                    throw Error('Unexpected action');
                }});
            let client=make();await client.choose(true,'/');await client.track('inquiry_start');
            assert.equal(s.flows.size,1);time+=days*24*60*60*1000;
            assert.equal(await client.choose(false,'/'),false);assert.equal(revokes,1);
            allow=ack;
            let result;
            if(path==='button')result=await client.choose(false,'/');
            if(path==='online')result=await client.recover();
            if(path==='SPA'){client.enter('/kontakt');result=await client.recover();}
            if(path==='reload'){client=make();result=await client.restore('/kontakt');}
            if(path==='storage'){
                client=make();client.sync();assert.equal(client.snapshot().choice.pending,true);
                result=await client.recover();
            }
            if(path==='concurrent'){
                const second=make();second.sync();
                const results=await Promise.all([client.recover(),second.restore('/kontakt')]);
                result=results.every(Boolean);
            }
            assert.equal(result,ack);assert.ok(revokes>=2);
            const saved=JSON.parse(data.get('sh-site-measurement-choice'));
            assert.equal(saved.receipt,ack?undefined:receipt);
            assert.equal(s.flows.size,ack?0:1);
            assert.equal([...s.consents.values()][0].revoked!=null,ack);
            assert.equal(client.context(),null);
            if(!ack){assert.equal(saved.pending,true);assert.equal(saved.at,now);assert.equal(client.snapshot().choice.pending,true);}
        });
    }
});
test('partial schemas clean existing tables independently and never falsely acknowledge a non-durable withdrawal',async()=>{
    const hash=createHash('sha256').update('site-consent:local:'+receipt).digest('hex');
    const fixture=(hasFlows,hasConsents)=>{
        const state={flows:hasFlows?[{receipt_hash:hash}]:[],consents:hasConsents?[{receipt_hash:hash,expired:true}]:[],calls:[]};
        const db={query:async()=>[[]],execute:async(sql,p=[])=>{
            state.calls.push(sql);
            if(sql.includes('site_measurement_activity'))throw Object.assign(Error('missing optional activity table'),{code:'ER_NO_SUCH_TABLE'});
            if((sql.includes('site_measurement_flows')&&!hasFlows)||(sql.includes('site_measurement_consents')&&!hasConsents))throw Object.assign(Error('missing table'),{code:'ER_NO_SUCH_TABLE'});
            if(sql.startsWith('SELECT 1'))return [[]];
            if(sql.startsWith('INSERT INTO site_measurement_consents'))state.consents=[{receipt_hash:p[0],revoked:true}];
            if(sql.startsWith('DELETE FROM site_measurement_flows'))state.flows=[];
            if(sql.startsWith('DELETE FROM site_measurement_consents'))state.consents=state.consents.filter(c=>!c.expired);
            if(sql.startsWith('SELECT receipt_hash FROM site_measurement_flows'))return [state.flows.filter(c=>c.receipt_hash===p[0])];
            if(sql.includes('AND revoked_at IS NOT NULL'))return [state.consents.filter(c=>c.receipt_hash===p[0]&&c.revoked)];
            return [{affectedRows:1}];
        }};return{db,state,lock:async(_db,_key,task)=>task(db)};
    };
    const onlyConsents=fixture(false,true);await cleanSiteMeasurement(onlyConsents.db);assert.equal(onlyConsents.state.consents.length,0);
    const onlyFlows=fixture(true,false);await cleanSiteMeasurement(onlyFlows.db);assert.equal(onlyFlows.state.flows.length,0);
    const partial=fixture(true,false),service=createSiteMeasurement({...partial,enabled:true});
    assert.equal(await service.revoke(receipt),false);assert.equal(partial.state.flows.length,0);assert.equal(service.enabled,false);
    const consentOnly=fixture(false,true);assert.equal(await createSiteMeasurement({...consentOnly,enabled:true}).revoke(receipt),true);assert.ok(consentOnly.state.consents[0].revoked);
    const absent=fixture(false,false);assert.equal(await createSiteMeasurement({...absent,enabled:true}).revoke(receipt),true);
    const denied={execute:async()=>{throw Object.assign(Error('permission'),{code:'ER_TABLEACCESS_DENIED_ERROR'});},query:async()=>[[]]};
    await assert.rejects(createSiteMeasurement({db:denied,enabled:true,lock:async(_d,_k,task)=>task(denied)}).revoke(receipt));
});
test('HTTP endpoints enforce mandatory origin, disabled state, public-success rejection, admin role and no-store',async t=>{
    const s=store(),service=createSiteMeasurement({...s,enabled:true,clock:()=>now}),app=express();app.use(express.json());
    let analyticsBlocked=false,revokeCalls=0;
    registerSiteMeasurementRoutes(app,{service,sameOrigin:createRequestOrigins('https://www.spirit-healing.tr').adminSameOriginOnly,
        limiter:(_q,res,next)=>analyticsBlocked?res.status(429).json({ok:false}):next(),
        revokeLimiter:(_q,_r,next)=>{revokeCalls++;next();},getAdminMember:async(req,res)=>{if(req.get('x-role')==='admin')return{id:1};res.status(req.get('x-role')?403:401).json({ok:false});return null;}});
    const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(()=>{server.closeAllConnections();server.close();});
    const base='http://127.0.0.1:'+server.address().port;
    const post=(action,body,origin=base)=>fetch(base+'/api/site-measurement/'+action,{method:'POST',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:JSON.stringify(body)});
    assert.equal((await post('consent',choice(),null)).status,403);assert.equal((await post('consent',choice(),'https://foreign.invalid')).status,403);
    assert.equal((await post('consent',choice())).status,202);
    assert.equal((await post('event',event(context(),'inquiry_success'))).status,400);
    const ok=await post('event',event(context()));assert.equal(ok.status,202);assert.equal(ok.headers.get('cache-control'),'no-store');
    assert.equal((await fetch(base+'/api/admin/site-measurement')).status,401);
    assert.equal((await fetch(base+'/api/admin/site-measurement',{headers:{'x-role':'member'}})).status,403);
    // Service disabled response avoids database queries, even on an authenticated read.
    service.enabled=false;
    assert.equal((await post('consent',choice())).status,404);
    const before=s.calls.length;assert.equal(await service.record(event(context())),false);
    const disabled=await fetch(base+'/api/admin/site-measurement',{headers:{'x-role':'admin'}});
    assert.equal(disabled.headers.get('cache-control'),'no-store');assert.equal((await disabled.json()).enabled,false);
    assert.equal(s.calls.length,before);
    analyticsBlocked=true;assert.equal((await post('event',event(context()))).status,429);
    assert.equal((await post('revoke',{receipt,schema_version:1,environment:'local'})).status,202);
    assert.equal(revokeCalls,1);
});
