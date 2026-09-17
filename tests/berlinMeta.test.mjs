import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { META_CONSENT_VERSION, META_MAX_AGE, validMetaConsent, metaPageAllowed, startRestrictedPixel } from '../src/lib/berlinMeta.js';
import { revokeMeta, measuredCheckoutUrl, CONSENT_VERSION } from '../src/lib/berlinMeasurement.js';
import { metaConfig, metaOriginAllowed, metaHash, registerMetaConsent, revokeMetaConsent, sendMetaPageView, metaPageViewPayload, cleanMeta } from '../server/berlinMeta.js';
const now = Date.now(), receipt = 'a'.repeat(64), eventId = randomUUID();
const grant = { version:CONSENT_VERSION, meta:true, analytics:false, at:now, metaVersion:META_CONSENT_VERSION, metaReceipt:receipt };
const config = {enabled:true,pixelId:'971195529371016',token:'server-secret',version:'v26.0'};
const context = {ip:'192.0.2.1',userAgent:'Consent test browser'};
function store() {
  const receipts = new Map(), deliveries = new Map(), writes = [], tails = new Map();
  const db = {async getConnection() {
    const unlocks = new Map();
    return {async query(sql,p) {
      if (sql.includes('GET_LOCK')) {
        const previous = tails.get(p[0]) || Promise.resolve();
        tails.set(p[0],new Promise(resolve=>unlocks.set(p[0],resolve)));
        await previous; return [[{acquired:1}]];
      }
      if (sql.includes('RELEASE_LOCK')) unlocks.get(p[0])();
      return [[]];
    },async execute(sql,p) {
      if(sql.startsWith('SELECT token_hash FROM berlin_meta_consents')) {
        const r=receipts.get(p[0]);
        return [r && !r.revoked_at && r.consent_version===p[1] && r.expires_at>p[2] && r.consent_at<=p[3]?[r]:[]];
      }
      if(sql.startsWith('SELECT token_hash,accepted')) return [deliveries.has(p[0])?[deliveries.get(p[0])]:[]];
      writes.push([sql,p]);
      if(sql.startsWith('INSERT INTO berlin_meta_consents')) {
        const old=receipts.get(p[0]);
        if(sql.includes('expires_at,revoked_at)')) receipts.set(p[0],{...(old||{consent_version:p[1],consent_at:p[2],expires_at:p[3]}),revoked_at:p[4]});
        else if(!old) receipts.set(p[0],{consent_version:p[1],consent_at:p[2],expires_at:p[3]});
      }
      if(sql.startsWith('INSERT IGNORE')) {
        if(deliveries.has(p[0])) return [{affectedRows:0}];
        deliveries.set(p[0],{token_hash:p[1],accepted:0});
      }
      if(sql.startsWith('UPDATE berlin_meta_deliveries')) deliveries.get(p[0]).accepted=1;
      if(sql.startsWith('DELETE FROM berlin_meta_deliveries WHERE token_hash'))
        for(const [id,row] of deliveries) if(row.token_hash===p[0]) deliveries.delete(id);
      return [{affectedRows:1}];
    },release(){}};
  }};
  return {db,receipts,deliveries,writes};
}
test('Meta needs its own current explicit grant; own analytics is independent',()=>{
  assert.equal(validMetaConsent(grant,now),true);
  for(const change of [{meta:false},{metaVersion:undefined},{metaReceipt:undefined},{at:now+1},{at:now-META_MAX_AGE}])
    assert.equal(validMetaConsent({...grant,...change},now),false);
  assert.equal(new URL(measuredCheckoutUrl('berlinOwn',null,grant,now)).search,'');
});
test('only Berlin public landing URLs and safe referrers may load the pixel',()=>{
  const page = {pathname:'/berlin-live'};
  assert.equal(metaPageAllowed(page),true);
  assert.equal(metaPageAllowed({...page,search:'?utm_source=meta&utm_medium=paid_social&utm_campaign=bl26&utm_content=a01&ad_id=123456789&fbclid=abcdefghijk_0123'}),true);
  for(const search of ['?email=private','?utm_term=private','?utm_content=family_problem','?ad_id={{ad.id}}','?ad_id=12345&ad_id=67890'])
    assert.equal(metaPageAllowed({...page,search}),false);
  for(const pathname of ['/therapie','/mitglieder','/admin','/startfragebogen','/datenschutz','/berlin-live/']) assert.equal(metaPageAllowed({pathname}),false);
  assert.equal(metaPageAllowed({...page,hash:'#private'}),false);
  for(const ref of ['https://spirit-healing.tr/therapie','https://example.org/search?q=personal','invalid']) assert.equal(metaPageAllowed(page,ref),false);
  assert.equal(metaPageAllowed(page,'https://l.facebook.com/'),true);
});
test('pixel receives same event ID as CAPI, once; no automatic configuration; queued withdrawal removes events',()=>{
  const win={}, scripts=[], doc={createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
  assert.equal(startRestrictedPixel({win,doc,pixelId:config.pixelId,eventId}),true);
  startRestrictedPixel({win,doc,pixelId:config.pixelId,eventId});
  assert.equal(scripts.length,1);
  assert.deepEqual(win.fbq.queue.find(c=>c[0]==='trackSingle'),['trackSingle',config.pixelId,'PageView',{}, {eventID:eventId}]);
  assert.equal(win.fbq.queue.filter(c=>c[0]==='trackSingle').length,1);
  assert.deepEqual(win.fbq.queue[1],['set','autoConfig',false,config.pixelId]);
  revokeMeta(win);
  assert.equal(win.fbq.queue.some(c=>c[0]==='trackSingle'||(c[0]==='consent'&&c[1]==='grant')),false);
  assert.equal(startRestrictedPixel({win:{fbq(){}},doc,pixelId:config.pixelId,eventId}),false);
});
test('server payload is PageView only and has no payment, contact, campaign or referrer fields',()=>{
  const body=metaPageViewPayload({eventId,...context,now,email:'private',price:444,url:'private'});
  assert.deepEqual(body,{data:[{event_name:'PageView',event_time:Math.floor(now/1000),event_id:eventId,action_source:'website',event_source_url:'https://spirit-healing.tr/berlin-live',user_data:{client_ip_address:context.ip,client_user_agent:context.userAgent}}]});
  assert.equal(metaPageViewPayload({eventId,...context,ip:'not-ip'}),null);
  assert.equal(metaPageViewPayload({eventId,...context,userAgent:'x\r\nprivate'}),null);
});
test('missing, expired, unregistered and old grants cannot send anything',async()=>{
  const s=store();let calls=0;const network=()=>{calls++;throw Error();};
  assert.equal(await registerMetaConsent(s.db,{...grant,metaVersion:'old'},now),false);
  for(const input of [{receipt,eventId},{eventId},{receipt,eventId,Purchase:444}])
    assert.equal((await sendMetaPageView(s.db,config,input,context,network,now)).ok,false);
  await registerMetaConsent(s.db,grant,now);
  s.receipts.get(metaHash(receipt)).expires_at=new Date(now-1);
  assert.equal((await sendMetaPageView(s.db,config,{receipt,eventId},context,network,now)).ok,false);
  assert.equal(calls,0);
});
test('one CAPI transmission despite concurrent duplicate calls; no secrets, IP or UA stored',async()=>{
  const s=store();await registerMetaConsent(s.db,grant,now);
  const calls=[];const network=async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>({events_received:1})};};
  const results=await Promise.all([1,2,3].map(()=>sendMetaPageView(s.db,config,{receipt,eventId},context,network,now)));
  assert.ok(results.every(r=>r.ok));assert.equal(calls.length,1);
  assert.equal(calls[0].url.includes(config.token),false);
  assert.equal(JSON.parse(calls[0].options.body).data[0].event_id,eventId);
  assert.equal(calls[0].options.redirect,'error');
  for(const privateValue of [receipt,context.ip,context.userAgent,config.token]) assert.equal(JSON.stringify(s.writes).includes(privateValue),false);
});
test('withdrawal deletes delivery markers and is not undone by stale registration',async()=>{
  const s=store();await registerMetaConsent(s.db,grant,now);
  const network=async()=>({ok:true,json:async()=>({events_received:1})});
  await sendMetaPageView(s.db,config,{receipt,eventId},context,network,now);
  await revokeMetaConsent(s.db,receipt,now);
  assert.equal(s.deliveries.size,0);
  assert.equal(await registerMetaConsent(s.db,grant,now),false);
  assert.equal((await sendMetaPageView(s.db,config,{receipt,eventId:randomUUID()},context,network,now)).status,403);
});
test('withdrawal before grant is an immutable tombstone',async()=>{
  const s=store();await revokeMetaConsent(s.db,receipt,now);
  assert.equal(await registerMetaConsent(s.db,grant,now),false);
});
test('concurrent withdrawal and transmission serialize: nothing is sent after acknowledged withdrawal',async()=>{
  for(const withdrawalFirst of [false,true]) {
    const s=store();await registerMetaConsent(s.db,grant,now);let withdrawn=false,calls=0;
    const network=async()=>{assert.equal(withdrawn,false);calls++;return {ok:true,json:async()=>({events_received:1})};};
    const revoke=()=>revokeMetaConsent(s.db,receipt,now).then(()=>{withdrawn=true;});
    const send=()=>sendMetaPageView(s.db,config,{receipt,eventId},context,network,now);
    await Promise.all(withdrawalFirst?[revoke(),send()]:[send(),revoke()]);
    assert.equal(calls,withdrawalFirst?0:1);assert.equal(s.deliveries.size,0);
  }
});
test('failed delivery is never silently retried; disabled CAPI sends nothing',async()=>{
  const s=store();await registerMetaConsent(s.db,grant,now);let calls=0;
  const network=async()=>{calls++;throw Error('offline');};
  for(let i=0;i<2;i++) assert.equal((await sendMetaPageView(s.db,config,{receipt,eventId},context,network,now)).ok,false);
  assert.equal(calls,1);
  await sendMetaPageView(s.db,{...config,enabled:false},{receipt,eventId:randomUUID()},context,network,now);
  assert.equal(calls,1);
});
test('configuration fails closed and accepts only own HTTPS origin in production',()=>{
  assert.equal(metaConfig({}).enabled,false);
  assert.throws(()=>metaConfig({BERLIN_META_ENABLED:'true'}));
  const origin='https://spirit-healing.tr';
  for(const value of [undefined,'null','http://localhost:1234','https://spirit-healing.tr.evil.example']) assert.equal(metaOriginAllowed(value,origin),false);
  assert.equal(metaOriginAllowed(origin,origin),true);
  assert.equal(metaOriginAllowed('https://www.spirit-healing.tr',origin),true);
  assert.equal(metaOriginAllowed(origin,'https://www.spirit-healing.tr'),true);
  assert.equal(metaOriginAllowed('https://www.spirit-healing.tr','https://www.spirit-healing.tr'),true);
  assert.equal(metaOriginAllowed('https://www.www.spirit-healing.tr','https://www.spirit-healing.tr'),false);
});
test('retention removes old delivery markers and expired consent; no client token integration',async()=>{
  const calls=[];await cleanMeta({execute:async sql=>{calls.push(sql);}});
  assert.ok(calls[0].includes('INTERVAL 2 DAY'));assert.ok(calls[1].includes('expires_at<=UTC_TIMESTAMP()'));
  const component=readFileSync(new URL('../src/components/BerlinMeasurement.jsx',import.meta.url),'utf8');
  assert.equal(component.includes('META_CAPI_ACCESS_TOKEN'),false);
  assert.ok(component.includes('Meta-Werbemessung'));
  assert.ok(component.includes('metaReceipt: next.metaReceipt')); // retained before registration awaits
});
