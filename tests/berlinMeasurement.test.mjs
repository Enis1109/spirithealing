import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { CONSENT_VERSION, CONSENT_KEY, loadConsent, validConsent, readBerlinAttribution,
  measuredCheckoutUrl, parseCheckoutReference, pixelPermitted, startMetaPageView, revokeMeta, clearMetaCookies } from '../src/lib/berlinMeasurement.js';
import { BERLIN_LINK_IDS, normalizeMeasurement, verifyStripeEvent, paidSession, recordStripeEvent, recordMeasurement, berlinMeasurementSummary } from '../server/berlinMeasurement.js';
const now = Date.now();
const consent = { version: CONSENT_VERSION, at: now, analytics: true, meta: true, receipt: 'a'.repeat(64) };
const query = '?utm_source=meta&utm_medium=paid_social&utm_campaign=bl26&utm_content=a01&ad_id=123456789&adset_id=987654321&campaign_id=123456780';
const attribution = readBerlinAttribution(query);
const sample = { event:'landing_view', sessionId:'b4c4c7c0-a123-4123-8123-123456789abc', attribution, consent };
const link = Object.keys(BERLIN_LINK_IDS)[0];
const session = { id:'cs_test_fake1', object:'checkout.session', mode:'payment', payment_status:'paid',
  payment_link:link, payment_intent:'pi_fake1', amount_total:44400, currency:'eur', created:Math.floor(now/1000),
  client_reference_id:'bl26c_'+'a'.repeat(64), customer_details:{email:'private@example.invalid',name:'Private'}, metadata:{topic:'private'} };
const event = { id:'evt_fake', type:'checkout.session.completed', livemode:false, data:{object:session} };
const copy = value => structuredClone(value);
const lockQuery = async () => [[{ acquired: 1, released: 1 }]];
const trackingDb = calls => ({ query: lockQuery, execute: async (...args) => {
  if (args[0].startsWith('SELECT * FROM berlin_measurement_consents')) return [[{ code:'a01',ad_id:'123456789',consent_at:new Date(now-90*86400000),consent_version:CONSENT_VERSION }]];
  if (args[0].startsWith('SELECT consent_hash')) return [[{consent_hash:'a'.repeat(64)}]];
  if (!args[0].startsWith('SELECT payment_hash')) calls.push(args);
  return [[]];
}});

test('neutral campaign IDs and Meta IDs parsed; sensitive extras never retained',()=>{
  assert.deepEqual(attribution,{code:'a01',source:'meta',adId:'123456789',adsetId:'987654321',campaignId:'123456780'});
  assert.deepEqual(readBerlinAttribution(query+'&email=private&fbclid=private&topic=private'),attribution);
});
test('arbitrary, duplicate, organic/paid mismatch and partial UTMs rejected',()=>{
  for(const q of ['',query+'&utm_source=meta',query.replace('a01','trauma'),query.replace('paid_social','organic_social'),query.slice(0,40),'x'.repeat(5000)]) assert.equal(readBerlinAttribution(q),null);
  assert.equal(readBerlinAttribution(query.replace('123456789','{{ad.id}}')).adId,null);
});
test('organic reference and unknown visits stay distinct',()=>{
  assert.equal(readBerlinAttribution('?utm_source=instagram&utm_medium=organic_social&utm_campaign=bl26&utm_content=o01').code,'o01');
  assert.equal(parseCheckoutReference('bl26_o01_123456789'),null);
});
test('consent requires current version, explicit booleans, nonfuture timestamp and 90 day expiry',()=>{
  assert.equal(validConsent(consent,now),true);
  for(const c of [null,{}, {...consent,version:'old'},{...consent,at:now+1},{...consent,at:now-90*86400000},{...consent,analytics:'yes'}]) assert.equal(validConsent(c,now),false);
  assert.equal(loadConsent({getItem(){throw new Error('blocked')}},now),null);
  assert.equal(loadConsent({getItem:()=>'{invalid'},now),null);
  assert.equal(loadConsent({getItem:key=>key===CONSENT_KEY?JSON.stringify(consent):null},now).analytics,true);
});
test('checkout remains plain without consent receipt; correct ticket never swapped',()=>{
  const plain=measuredCheckoutUrl('berlinOwn',attribution,null,now);
  assert.equal(plain,'https://book.stripe.com/00w4gB5NE7ClaFldfV83C07');
  assert.equal(measuredCheckoutUrl('berlinOwn',attribution,{...consent,analytics:false},now),plain);
  assert.equal(measuredCheckoutUrl('berlinOwn',attribution,{...consent,receipt:undefined},now),plain);
  assert.equal(measuredCheckoutUrl('berlinOwn',attribution,consent,now),plain+'?client_reference_id=bl26c_'+'a'.repeat(64));
  assert.match(measuredCheckoutUrl('berlinIntensive',attribution,consent,now),/fZu8wReka2i19Bhgs783C08/);
  assert.throws(()=>measuredCheckoutUrl('__proto__',attribution,consent));
});
test('malformed references never become campaign labels',()=>{
  for(const v of ['private@example.invalid','bl26_a01_private','bl26_a03','bl26_a01_123456789_extra',null,{},'bl26_o02_99999']) assert.equal(parseCheckoutReference(v),null);
});
const pixel={enabled:true,policyApproved:true,pixelId:'123456789',consent,pathname:'/berlin-live',search:query,now};
test('pixel denied without activation, policy clearance, valid ID or explicit consent',()=>{
  assert.equal(pixelPermitted(pixel),true);
  for(const overrides of [{enabled:false},{policyApproved:false},{pixelId:''},{consent:null},{consent:{...consent,meta:false}}]) assert.equal(pixelPermitted({...pixel,...overrides}),false);
});
test('pixel blocked on sensitive paths, unknown query parameters, fragments and unresolved IDs',()=>{
  for(const pathname of ['/therapie','/startfragebogen','/mitglieder','/admin','/vortrag-13-wochen-programm']) assert.equal(pixelPermitted({...pixel,pathname}),false);
  for(const search of [query+'&email=a',query+'&fbclid=abc',query+'&utm_term=private',query.replace('123456789','{{ad.id}}'),query+'&lang=private']) assert.equal(pixelPermitted({...pixel,search}),false);
  assert.equal(pixelPermitted({...pixel,hash:'#private'}),false);
});
test('pixel adapter no personal data, automatic config off, exactly one PageView, withdrawal revokes',()=>{
  const win={}; const scripts=[]; const doc={createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
  assert.equal(startMetaPageView({win,doc,pixelId:'123456789'}),true);
  assert.deepEqual(win.fbq.queue[1],['set','autoConfig',false,'123456789']);
  revokeMeta(win); startMetaPageView({win,doc,pixelId:'123456789'});
  assert.equal(scripts.length,1);
  assert.equal(win.fbq.queue.filter(c=>c[0]==='trackSingle').length,1);
  assert.equal(win.fbq.queue.some(c=>c.includes('Purchase')),false);
  assert.equal(startMetaPageView({win:{fbq(){}},doc,pixelId:'999999'}),false);
});
test('withdrawal expires own-domain Meta cookies without reading other cookies',()=>{
  const writes=[]; const doc={set cookie(value){writes.push(value)}};
  clearMetaCookies(doc,'www.spirit-healing.tr');
  assert.equal(writes.length,6);
  assert.ok(writes.every(v=>v.includes('Max-Age=0')));
});
test('internal events exclude free text and require consent; clicks have a valid offer',()=>{
  const clean=normalizeMeasurement({...sample,name:'Private',topic:'Private'},now);
  assert.equal(clean.code,'a01'); assert.equal('name' in clean,false); assert.equal('topic' in clean,false);
  assert.equal(normalizeMeasurement({...sample,consent:{...consent,analytics:false}},now),null);
  assert.equal(normalizeMeasurement({...sample,event:'Purchase'},now),null);
  assert.equal(normalizeMeasurement({...sample,event:'checkout_click'},now),null);
  assert.equal(normalizeMeasurement({...sample,sessionId:'private@example.invalid'},now),null);
});
const raw=Buffer.from(JSON.stringify(event)); const secret='whsec_synthetic_test_only'; const timestamp=Math.floor(now/1000);
const signature=createHmac('sha256',secret).update(`${timestamp}.`).update(raw).digest('hex');
test('Stripe verifies exact bytes, multiple v1 signatures and current timestamp',()=>{
  assert.equal(verifyStripeEvent(raw,`t=${timestamp},v1=${signature}`,secret,timestamp).id,event.id);
  assert.equal(verifyStripeEvent(raw,`t=${timestamp},v1=${'0'.repeat(64)},v1=${signature}`,secret,timestamp).id,event.id);
});
test('Stripe rejects tampered data, wrong key, stale/future times, duplicates and v0 only',()=>{
  for(const header of [`t=${timestamp},v0=${signature}`,`t=${timestamp},v1=wrong`,`t=${timestamp},t=${timestamp},v1=${signature}`]) assert.throws(()=>verifyStripeEvent(raw,header,secret,timestamp));
  assert.throws(()=>verifyStripeEvent(Buffer.from(raw+' '),`t=${timestamp},v1=${signature}`,secret,timestamp));
  assert.throws(()=>verifyStripeEvent(raw,`t=${timestamp},v1=${signature}`,'different',timestamp));
  assert.throws(()=>verifyStripeEvent(raw,`t=${timestamp},v1=${signature}`,secret,timestamp+301));
  assert.throws(()=>verifyStripeEvent(raw,`t=${timestamp},v1=${signature}`,secret,timestamp-301));
});
test('paid Berlin session is a purchase; never includes customer identity',()=>{
  const result=paidSession(event,false); assert.equal(result.booking,true); assert.match(result.consentHash,/^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(result).includes('private'),false);
  assert.equal(paidSession(event,true),null);
});
test('unpaid, expired, failed, foreign, subscription and zero-value sessions do not count',()=>{
  for(const overrides of [{payment_status:'unpaid'},{payment_status:'no_payment_required'},{payment_link:'plink_foreign'},{mode:'subscription'},{amount_total:0},{amount_total:-1},{currency:'EUR'}]) {
    const e=copy(event);Object.assign(e.data.object,overrides);assert.equal(paidSession(e,false),null);
  }
  for(const type of ['checkout.session.expired','checkout.session.async_payment_failed','payment_intent.succeeded']) assert.equal(paidSession({...event,type},false),null);
});
test('delayed successful payment counts once; first installments book, second installments do not',()=>{
  assert.equal(paidSession({...event,type:'checkout.session.async_payment_succeeded'},false).booking,true);
  for(const [id,config] of Object.entries(BERLIN_LINK_IDS)) {
    const e=copy(event); e.data.object.payment_link=id;
    assert.equal(paidSession(e,false).booking,config.installment!==2);
  }
});
test('database writes use unique-key idempotency and bind all values',async()=>{
  const calls=[];const db=trackingDb(calls);
  await recordStripeEvent(db,event,false);await recordStripeEvent(db,event,false);
  assert.equal(calls.length,2);assert.match(calls[0][0],/ON DUPLICATE KEY UPDATE/);
  assert.equal(calls[0][1][0],session.id);assert.equal(calls[0][1].includes('private@example.invalid'),false);
  await recordMeasurement(db,sample);assert.match(calls[2][0],/ON DUPLICATE KEY UPDATE/);
});
test('90-day payment retention boundary cannot be extended by replay, refunds or receipt time',async()=>{
  const clock = Math.floor(now/1000)*1000;
  const cutoff = clock/1000 - 90*86400;
  for (const created of [cutoff-1, cutoff, clock/1000+1, 9007199254740991]) {
    const expired=copy(event); expired.data.object.created=created;
    let writes=0;
    assert.equal(await recordStripeEvent({execute:async()=>{writes++}},expired,false,BERLIN_LINK_IDS,clock),'ignored');
    assert.equal(writes,0);
  }
  const recent=copy(event);recent.data.object.created=cutoff+1;
  const calls=[];
  assert.equal(await recordStripeEvent(trackingDb(calls),recent,false,BERLIN_LINK_IDS,clock),'paid');
  assert.equal(calls[0][1][10].getTime(),(cutoff+1)*1000);
});
test('refunds on eligible existing payments are monotonic and disputes ordered',async()=>{
  const calls=[];const db=trackingDb(calls);
  await recordStripeEvent(db,{type:'charge.refunded',livemode:false,data:{object:{payment_intent:'pi_fake1',amount_refunded:2000}}},false);
  assert.match(calls[0][0],/GREATEST/);
  await recordStripeEvent(db,{type:'charge.dispute.closed',created:timestamp,livemode:false,data:{object:{payment_intent:'pi_fake1',status:'won'}}},false);
  assert.match(calls[1][0],/dispute_event_time/);
});
test('admin summary distinguishes clicks, gross bookings, refunded bookings and currencies',async()=>{
  const sql=[];const db={execute:async(q)=>{sql.push(q);return [[]]}};
  const result=await berlinMeasurementSummary(db);
  assert.match(sql[1],/GROUP BY p.code,p.ad_id,p.currency,p.ticket/);
  assert.equal(result.limitations.some(x=>x.includes('not unique people')),true);
});
