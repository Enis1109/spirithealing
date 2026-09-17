import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { registerConsent, revokeConsent, receiptHash } from '../server/berlinConsent.js';
import { recordStripeEvent, recordMeasurement, BERLIN_LINK_IDS } from '../server/berlinMeasurement.js';
import { CONSENT_VERSION, measuredCheckoutUrl } from '../src/lib/berlinMeasurement.js';

const token = 'b'.repeat(64);
const consent = () => ({version:CONSENT_VERSION,at:Date.now()-1000,analytics:true,meta:false,receipt:token});
const payment = (reference = `bl26c_${token}`) => ({id:'evt_consent',type:'checkout.session.completed',livemode:false,
  data:{object:{object:'checkout.session',id:'cs_test_consent',payment_intent:'pi_consent',mode:'payment',payment_status:'paid',
    payment_link:Object.keys(BERLIN_LINK_IDS)[0],amount_total:44400,currency:'eur',created:Math.floor(Date.now()/1000),client_reference_id:reference}}});
function store() {
  const receipts = new Map(), payments = new Map(), events = new Map(), adjustments = new Map(), writes = [], tails = new Map();
  const db = { async getConnection() {
    const unlocks = new Map();
    return {async query(sql, values) {
      if (sql.includes('GET_LOCK')) {
        const previous = tails.get(values[0]) || Promise.resolve();
        tails.set(values[0],new Promise(resolve=>unlocks.set(values[0],resolve)));
        await previous; return [[{acquired:1}]];
      }
      if (sql.includes('RELEASE_LOCK')) unlocks.get(values[0])();
      return [[]];
    }, async execute(sql,p) {
      if(sql.startsWith('SELECT payment_hash')) return [[]];
      if(sql.startsWith('SELECT consent_hash')) return [payments.has(p[0])?[{consent_hash:payments.get(p[0])}]:[]];
      if(sql.startsWith('SELECT * FROM berlin_measurement_consents')) {
        const r=receipts.get(p[0]);
        return [r && !r.revoked_at && r.consent_version===p[1] && r.expires_at>p[2] && r.consent_at<=p[3]?[r]:[]];
      }
      writes.push([sql,p]);
      if(sql.startsWith('INSERT INTO berlin_measurement_consents')) {
        const previous=receipts.get(p[0]);
        if(sql.includes('revoked_at)')) receipts.set(p[0],{...(previous || {consent_version:p[1],consent_at:p[2],expires_at:p[3]}),revoked_at:p[4]});
        else if(!previous) receipts.set(p[0],{consent_version:p[1],consent_at:p[2],expires_at:p[3],code:p[4],ad_id:p[5],adset_id:p[6],campaign_id:p[7]});
      }
      if(sql.startsWith('INSERT INTO berlin_payments')) payments.set(p[1],p[12]);
      if(sql.startsWith('INSERT INTO berlin_measurement_events')) events.set(p[0],p[9]);
      if(sql.startsWith('INSERT INTO berlin_payment_adjustments')) adjustments.set(p[0],p);
      if(sql.startsWith('DELETE a FROM')) for(const [id,hash] of payments) if(hash===p[0]) adjustments.delete(id);
      if(sql.startsWith('DELETE FROM berlin_payments WHERE consent_hash')) for(const [id,hash] of payments) if(hash===p[0]) payments.delete(id);
      if(sql.startsWith('DELETE FROM berlin_measurement_events')) for(const [id,hash] of events) if(hash===p[0]) events.delete(id);
      return [{affectedRows:1}];
    },release(){} };
  }};
  return {db,receipts,payments,events,adjustments,writes};
}
test('no consent, legacy ad tag and invented receipt cannot create payment copies',async()=>{
  const s=store();
  for(const ref of [undefined,null,'bl26_a01_123456789','bl26c_'+'c'.repeat(64),'private@example.invalid'])
    assert.equal(await recordStripeEvent(s.db,payment(ref),false),'ignored');
  assert.equal(s.writes.length,0);
  assert.equal(await registerConsent(s.db,{consent:{...consent(),analytics:false}}),false);
  assert.equal(s.writes.length,0);
});
test('recorded receipt supplies attribution; no customer identity is copied',async()=>{
  const s=store(),c=consent();
  assert.equal(await registerConsent(s.db,{consent:c,attribution:{code:'a02',adId:'123456789',name:'private'}}),true);
  assert.equal(await recordStripeEvent(s.db,payment(),false),'paid');
  const entry=s.writes.find(([sql])=>sql.startsWith('INSERT INTO berlin_payments'));
  assert.equal(entry[1][8],'a02'); assert.equal(entry[1][12],receiptHash(token));
  assert.equal(JSON.stringify(s.writes).includes('private'),false);
  assert.equal(await recordMeasurement(s.db,{consent:c,sessionId:randomUUID(),event:'landing_view',attribution:{code:'a01'}}),true);
  assert.equal(s.writes.at(-1)[1][3],'a02');
});
test('withdrawal deletes linked analytics and prevents payment, click and consent-registration replay',async()=>{
  const s=store(),c=consent();
  await registerConsent(s.db,{consent:c}); await recordStripeEvent(s.db,payment(),false);
  await recordMeasurement(s.db,{consent:c,sessionId:randomUUID(),event:'landing_view'});
  await revokeConsent(s.db,token);
  assert.equal(s.payments.size,0);assert.equal(s.events.size,0);
  assert.equal(await registerConsent(s.db,{consent:c}),false);
  for(const type of ['checkout.session.completed','checkout.session.async_payment_succeeded'])
    assert.equal(await recordStripeEvent(s.db,{...payment(),type},false),'ignored');
  assert.equal(await recordMeasurement(s.db,{consent:c,sessionId:randomUUID(),event:'landing_view'}),false);
});
test('withdrawal arriving before grant cannot be undone by the delayed grant',async()=>{
  const s=store();await revokeConsent(s.db,token);
  assert.equal(await registerConsent(s.db,{consent:consent()}),false);
  assert.equal(await recordStripeEvent(s.db,payment(),false),'ignored');
});
test('concurrent withdrawal and payment never leave a payment copy',async()=>{
  for(const withdrawalFirst of [false,true]) {
    const s=store();await registerConsent(s.db,{consent:consent()});
    const withdraw=()=>revokeConsent(s.db,token), pay=()=>recordStripeEvent(s.db,payment(),false);
    await Promise.all(withdrawalFirst?[withdraw(),pay()]:[pay(),withdraw()]);
    assert.equal(s.payments.size,0);
  }
});
test('unmatched refund/dispute events never create a queue of nonconsenting payments',async()=>{
  const s=store();
  for(const type of ['charge.refunded','charge.dispute.created','charge.dispute.closed'])
    assert.equal(await recordStripeEvent(s.db,{type,livemode:false,created:Math.floor(Date.now()/1000),
      data:{object:{payment_intent:'pi_other',status:'won',amount_refunded:400}}},false),'ignored');
  assert.equal(s.writes.length,0);
});
test('expired receipts and receipts issued after checkout are rejected',async()=>{
  const s=store();await registerConsent(s.db,{consent:consent()});
  const row=s.receipts.get(receiptHash(token));row.expires_at=new Date(Date.now()-1);
  assert.equal(await recordStripeEvent(s.db,payment(),false),'ignored');
  row.expires_at=new Date(Date.now()+86400000);row.consent_at=new Date(Date.now());
  const earlier=payment();earlier.data.object.created-=5;
  assert.equal(await recordStripeEvent(s.db,earlier,false),'ignored');
});
test('plain booking works after rejection, expiry and missing receipt',()=>{
  for(const c of [null,{...consent(),analytics:false},{...consent(),receipt:null},{...consent(),at:Date.now()-91*86400000}])
    assert.equal(new URL(measuredCheckoutUrl('berlinOwn',null,c)).search,'');
});
