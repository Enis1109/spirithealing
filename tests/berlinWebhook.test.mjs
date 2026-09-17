import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { berlinWebhookConfig, registerBerlinWebhook } from '../server/berlinWebhook.js';
import { BERLIN_LINK_IDS, cleanBerlinMeasurement, startBerlinMeasurementCleanup } from '../server/berlinMeasurement.js';

const env = { BERLIN_MEASUREMENT_ENABLED:'true', BERLIN_STRIPE_MODE:'test',
  BERLIN_STRIPE_WEBHOOK_SECRET:'whsec_synthetic_test_only',
  BERLIN_STRIPE_TEST_LINKS:JSON.stringify({own_full:'plink_testOwn',intensive_full:'plink_testIntensive',own_followup:'plink_testFollowup'}) };
const config = berlinWebhookConfig(env);
function payment(overrides={}) {
  return { id:'evt_synthetic',type:'checkout.session.completed',livemode:false,data:{object:{
    id:'cs_test_synthetic',object:'checkout.session',mode:'payment',payment_status:'paid',
    payment_link:'plink_testOwn',payment_intent:'pi_synthetic',amount_total:44400,currency:'eur',
    created:Math.floor(Date.now()/1000),client_reference_id:'bl26c_'+'a'.repeat(64),...overrides,
  }} };
}
const sign = (body, time=Math.floor(Date.now()/1000), secret=config.secret) =>
  `t=${time},v1=${createHmac('sha256',secret).update(`${time}.`).update(body).digest('hex')}`;

test('disabled measurement does not require credentials',()=>{
  assert.deepEqual(berlinWebhookConfig({}),{enabled:false});
});
test('activation fails closed on missing mode or signing secret without leaking values',()=>{
  for(const patch of [{BERLIN_STRIPE_MODE:''},{BERLIN_STRIPE_MODE:'liv'},{BERLIN_STRIPE_WEBHOOK_SECRET:''}])
    assert.throws(()=>berlinWebhookConfig({...env,...patch}));
  assert.throws(()=>berlinWebhookConfig({...env,BERLIN_STRIPE_WEBHOOK_SECRET:'private-value'}),e=>!e.message.includes('private-value'));
});
test('test mapping rejects missing, malformed, duplicate, unknown and live links',()=>{
  const live=Object.keys(BERLIN_LINK_IDS)[0];
  for(const value of ['', 'null','[]','{}', JSON.stringify({own_full:'plink_testOwn'}),
    JSON.stringify({own_full:live,intensive_full:'plink_testIntensive'}),
    JSON.stringify({own_full:'plink_same',intensive_full:'plink_same'}),
    JSON.stringify({own_full:'plink_testOwn',intensive_full:'plink_testIntensive',anything:'plink_extra'})])
    assert.throws(()=>berlinWebhookConfig({...env,BERLIN_STRIPE_TEST_LINKS:value}));
  assert.equal(Object.keys(config.linkMap).length,3);
  assert.equal(berlinWebhookConfig({...env,BERLIN_STRIPE_MODE:'live'}).linkMap,BERLIN_LINK_IDS);
});
test('production registers the tested raw route before the JSON parser',async()=>{
  const source=await readFile(new URL('../server.js',import.meta.url),'utf8');
  assert.ok(source.indexOf('registerBerlinWebhook(app,') < source.indexOf('app.use(express.json('));
});

test('real HTTP pipeline with synthetic Stripe messages and an in-memory database double',async t=>{
  const stored=new Map(); const writes=[]; let ready=true; let databaseFails=false;
  const db={query:async()=>[[{acquired:1,released:1}]],execute:async(sql,params)=>{
    if(databaseFails) throw new Error('synthetic private database detail');
    if(sql.startsWith('SELECT * FROM berlin_measurement_consents')) return [[{code:'a01',ad_id:'123456789',consent_at:new Date(Date.now()-1000)}]];
    if(sql.startsWith('SELECT payment_hash')) return [[]];
    writes.push([sql,params]);
    if(sql.includes('INSERT INTO berlin_payments') && !stored.has(params[1])) stored.set(params[1],params);
    return [[]];
  }};
  const app=express();
  registerBerlinWebhook(app,{db,config,ready:async()=>ready});
  app.use(express.json());
  app.use((error,req,res,next)=>res.status(error.status || 500).json({ok:false}));
  const server=await new Promise((resolve,reject)=>{
    const listener=app.listen(0,'127.0.0.1',error=>error?reject(error):resolve(listener)); listener.once('error',reject);
  });
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const url=`http://127.0.0.1:${server.address().port}/api/berlin/stripe-webhook`;
  const post=async(body,signature=sign(body),type='application/json')=>{
    const res=await fetch(url,{method:'POST',body,headers:{'content-type':type,'stripe-signature':signature}});
    return {status:res.status,cache:res.headers.get('cache-control'),body:await res.json()};
  };
  await t.test('valid raw bytes reach storage; repeat and async confirmation do not add a booking',async()=>{
    const e=payment();const raw=JSON.stringify(e,null,2);
    assert.deepEqual(await post(raw),{status:200,cache:'no-store',body:{ok:true,result:'paid'}});
    await post(raw);await post(JSON.stringify({...e,id:'evt_syntheticAgain',type:'checkout.session.async_payment_succeeded'}));
    assert.equal(stored.size,1);
    assert.equal([...stored.values()][0][8],'a01');
    assert.equal([...stored.values()][0][9],'123456789');
  });
  await t.test('tampered, missing, expired signatures and invalid JSON never reach storage',async()=>{
    const before=writes.length, raw=JSON.stringify(payment());
    for(const [body,signature] of [[raw+' ',sign(raw)],[raw,''],[raw,sign(raw,Math.floor(Date.now()/1000)-400)],['{bad',sign('{bad')]])
      assert.equal((await post(body,signature)).status,400);
    assert.equal((await post(raw,sign(raw),'text/plain')).status,400);
    assert.equal(writes.length,before);
  });
  await t.test('unpaid and foreign or live events do not count; delayed successful payment does',async()=>{
    const before=stored.size;
    for(const e of [payment({payment_status:'unpaid'}),payment({payment_link:Object.keys(BERLIN_LINK_IDS)[0]}),{...payment(),livemode:true},payment({payment_link:'plink_foreign'})])
      assert.equal((await post(JSON.stringify(e))).body.result,'ignored');
    assert.equal(stored.size,before);
    const delayed=payment({id:'cs_test_delayed',payment_intent:'pi_delayed'}); delayed.type='checkout.session.async_payment_succeeded';
    await post(JSON.stringify(delayed));assert.equal(stored.size,before+1);
  });
  await t.test('follow-up installment is a payment, not another participant',async()=>{
    await post(JSON.stringify(payment({id:'cs_test_followup',payment_intent:'pi_followup',payment_link:'plink_testFollowup',amount_total:22200})));
    assert.equal(stored.get('pi_followup')[4],0);
    assert.equal(stored.get('pi_followup')[5],2);
  });
  await t.test('unready or failed storage returns retryable 503 without exposing errors',async()=>{
    ready=false;assert.equal((await post(JSON.stringify(payment()))).status,503);
    ready=true;databaseFails=true;
    const response=await post(JSON.stringify(payment()));
    assert.equal(response.status,503);assert.deepEqual(response.body,{ok:false});databaseFails=false;
  });
  await t.test('oversize payload rejected before storage',async()=>{
    const before=writes.length, raw=JSON.stringify({padding:'x'.repeat(270000)});
    assert.equal((await post(raw)).status,413);assert.equal(writes.length,before);
  });
});

test('retention deletes expired analytics copies and their adjustments, never source payments',async()=>{
  const calls=[];await cleanBerlinMeasurement({execute:async q=>calls.push(q)});
  assert.equal(calls.length,5);
  assert.match(calls[0],/created_at <= DATE_SUB\(NOW\(\), INTERVAL 90 DAY\)/);
  assert.match(calls[1],/DELETE p,a FROM berlin_payments p LEFT JOIN berlin_payment_adjustments a/);
  assert.match(calls[1],/p.session_created_at <= DATE_SUB\(NOW\(\), INTERVAL 90 DAY\)/);
  assert.doesNotMatch(calls[1],/received_at|updated_at/);
  assert.match(calls[2],/p.session_id IS NULL/);assert.doesNotMatch(calls[2],/INTERVAL 7 DAY/);
  assert.match(calls[3],/berlin_measurement_erasures WHERE expires_at<=UTC_TIMESTAMP/);
  assert.ok(calls.every(q=>/FROM berlin_/.test(q)));
});
test('hourly retention is nonoverlapping, stoppable, and does not log private errors',async()=>{
  let task,ms,unref=false,cancelled=false,release;let calls=0,errors=0;
  const timer={unref(){unref=true}};
  const db={execute:async()=>{calls++;if(calls===1)await new Promise(resolve=>release=resolve)}};
  const stop=startBerlinMeasurementCleanup(db,{schedule:(fn,delay)=>{task=fn;ms=delay;return timer},cancel:t=>{assert.equal(t,timer);cancelled=true},onError:()=>errors++});
  assert.equal(ms,3600000);assert.equal(unref,true);
  const first=task();await task();assert.equal(calls,1);release();await first;assert.equal(calls,5);
  stop();assert.equal(cancelled,true);assert.equal(errors,0);
  let failingTask;
  startBerlinMeasurementCleanup({execute:async()=>{throw new Error('private')}},{schedule:fn=>{failingTask=fn;return timer},onError:(...args)=>{assert.equal(args.length,0);errors++}});
  await failingTask();await failingTask();assert.equal(errors,2);
});
