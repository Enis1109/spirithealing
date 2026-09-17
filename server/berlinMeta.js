import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { META_CONSENT_VERSION, META_MAX_AGE, validMetaConsent, metaTokenValid, metaEventValid } from '../src/lib/berlinMeta.js';
import { withBerlinLock } from './berlinErasure.js';

export const metaSchema = [
  `CREATE TABLE IF NOT EXISTS berlin_meta_consents (
    token_hash CHAR(64) PRIMARY KEY, consent_version VARCHAR(48) NOT NULL,
    consent_at DATETIME(3) NOT NULL, expires_at DATETIME(3) NOT NULL, revoked_at DATETIME(3) NULL,
    INDEX meta_consent_expiry(expires_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS berlin_meta_deliveries (
    event_id CHAR(36) PRIMARY KEY, token_hash CHAR(64) NOT NULL,
    attempted_at DATETIME(3) NOT NULL, accepted TINYINT NOT NULL DEFAULT 0,
    INDEX meta_delivery_time(attempted_at), INDEX meta_delivery_consent(token_hash)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];
export const metaHash = token => {
  if (!metaTokenValid(token)) throw new TypeError('Invalid Meta receipt');
  return createHash('sha256').update(`berlin-meta:${token}`).digest('hex');
};
const lock = (db, hash, fn) => withBerlinLock(db, `bm26:${hash.slice(0,58)}`, fn);
export function metaConfig(env) {
  const enabled = env.BERLIN_META_ENABLED === 'true';
  const pixelId = env.VITE_META_PIXEL_ID || '';
  const token = env.META_CAPI_ACCESS_TOKEN || '';
  const version = 'v26.0';
  if (enabled && (!/^[0-9]{5,30}$/.test(pixelId) || token.length < 40)) throw new Error('Meta configuration incomplete');
  return { enabled, pixelId, token, version };
}
export function metaOriginAllowed(origin, productionOrigin, mode = 'production') {
  if (typeof origin !== 'string') return false;
  const canonicalOrigin = productionOrigin.replace(/^https:\/\/www\./, 'https://');
  return origin === canonicalOrigin || origin === canonicalOrigin.replace('https://', 'https://www.')
    || (mode !== 'production' && /^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin));
}
export async function cleanMeta(db) {
  await db.execute('DELETE FROM berlin_meta_deliveries WHERE attempted_at<=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 2 DAY)');
  await db.execute('DELETE FROM berlin_meta_consents WHERE expires_at<=UTC_TIMESTAMP()');
}
export async function initializeMeta(db) {
  for (const sql of metaSchema) await db.execute(sql);
  await cleanMeta(db);
}
async function active(db, hash, now) {
  const [rows] = await db.execute(`SELECT token_hash FROM berlin_meta_consents WHERE token_hash=?
    AND consent_version=? AND revoked_at IS NULL AND expires_at>? AND consent_at<=?`,
  [hash, META_CONSENT_VERSION, new Date(now), new Date(now)]);
  return rows.length > 0;
}
export async function registerMetaConsent(db, consent, now = Date.now()) {
  if (!validMetaConsent(consent, now) || now - consent.at > 60000) return false;
  const hash = metaHash(consent.metaReceipt);
  return lock(db, hash, async conn => {
    await conn.execute(`INSERT INTO berlin_meta_consents (token_hash,consent_version,consent_at,expires_at)
      VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE token_hash=VALUES(token_hash)`,
    [hash, META_CONSENT_VERSION, new Date(consent.at), new Date(consent.at + META_MAX_AGE)]);
    return active(conn, hash, now);
  });
}
export async function revokeMetaConsent(db, token, now = Date.now()) {
  const hash = metaHash(token);
  return lock(db, hash, async conn => {
    await conn.execute(`INSERT INTO berlin_meta_consents (token_hash,consent_version,consent_at,expires_at,revoked_at)
      VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE revoked_at=VALUES(revoked_at)`,
    [hash,META_CONSENT_VERSION,new Date(now),new Date(now+META_MAX_AGE),new Date(now)]);
    await conn.execute('DELETE FROM berlin_meta_deliveries WHERE token_hash=?', [hash]);
    return true;
  });
}
export function metaPageViewPayload({ eventId, ip, userAgent, now = Date.now() }) {
  if (!metaEventValid(eventId) || !isIP(ip || '') || typeof userAgent !== 'string'
    || !userAgent.length || userAgent.length > 1024 || /[\r\n]/.test(userAgent)) return null;
  // No custom_data, Stripe/customer data, content titles, referrer, campaign parameters or click IDs.
  return { data: [{ event_name:'PageView', event_time:Math.floor(now/1000), event_id:eventId,
    action_source:'website', event_source_url:'https://spirit-healing.tr/berlin-live',
    user_data:{ client_ip_address:ip, client_user_agent:userAgent } }] };
}
export async function sendMetaPageView(db, config, input, context, fetchImpl = fetch, now = Date.now()) {
  if (!config.enabled || !metaTokenValid(input?.receipt) || !metaEventValid(input?.eventId)
    || Object.keys(input).some(k=>!['receipt','eventId'].includes(k))) return { ok:false, status:400 };
  const body = metaPageViewPayload({eventId:input.eventId,...context,now});
  if (!body) return {ok:false,status:400};
  const hash = metaHash(input.receipt);
  return lock(db,hash,async conn=>{
    if (!await active(conn,hash,now)) return {ok:false,status:403};
    const [insert] = await conn.execute(`INSERT IGNORE INTO berlin_meta_deliveries
      (event_id,token_hash,attempted_at) VALUES (?,?,?)`,[input.eventId,hash,new Date(now)]);
    if (!insert.affectedRows) {
      const [rows] = await conn.execute('SELECT token_hash,accepted FROM berlin_meta_deliveries WHERE event_id=?',[input.eventId]);
      return {ok:rows[0]?.token_hash===hash && Number(rows[0]?.accepted)===1,status:200};
    }
    // At most one server attempt per event. No queue or delayed retry after withdrawal.
    // Keep the consent lock through delivery so acknowledged withdrawal excludes later sends.
    try {
      const response = await fetchImpl(`https://graph.facebook.com/${config.version}/${config.pixelId}/events`,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...body,access_token:config.token}),signal:AbortSignal.timeout(5000),redirect:'error',
      });
      const result = await response.json();
      if (!response.ok || result.events_received !== 1) return {ok:false,status:502};
      await conn.execute('UPDATE berlin_meta_deliveries SET accepted=1 WHERE event_id=? AND token_hash=?',[input.eventId,hash]);
      return {ok:true,status:200};
    } catch { return {ok:false,status:502}; } // Never log payloads, tokens, IPs or Meta error bodies.
  });
}
