import { createHash } from 'node:crypto';
import { CONSENT_VERSION, validConsent, validReceipt } from '../src/lib/berlinMeasurement.js';
import { withBerlinLock } from './berlinErasure.js';

export const berlinConsentSchema = `CREATE TABLE IF NOT EXISTS berlin_measurement_consents (
  token_hash CHAR(64) PRIMARY KEY, consent_version VARCHAR(48) NOT NULL,
  consent_at DATETIME(3) NOT NULL, expires_at DATETIME(3) NOT NULL, revoked_at DATETIME(3) NULL,
  code VARCHAR(8) NULL, ad_id VARCHAR(30) NULL, adset_id VARCHAR(30) NULL, campaign_id VARCHAR(30) NULL,
  INDEX berlin_consents_expiry(expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

export function receiptHash(token) {
  if (!validReceipt(token)) throw new TypeError('Invalid consent receipt');
  return createHash('sha256').update(`berlin-consent:${token}`).digest('hex');
}
export const withConsentLock = (db, hash, task) => withBerlinLock(db, `bc26:${hash.slice(0, 58)}`, task);

export async function activeReceipt(db, hash, now = Date.now()) {
  const [rows] = await db.execute(`SELECT * FROM berlin_measurement_consents
    WHERE token_hash=? AND consent_version=? AND revoked_at IS NULL AND expires_at>? AND consent_at<=?`,
  [hash, CONSENT_VERSION, new Date(now), new Date(now)]);
  return rows[0] || null;
}

export async function registerConsent(db, input, now = Date.now()) {
  const c = input?.consent;
  if (!validConsent(c, now) || !c.analytics || !validReceipt(c.receipt)) return false;
  const hash = receiptHash(c.receipt);
  const a = input.attribution;
  const code = ['a01','a02','o01','o02'].includes(a?.code) ? a.code : null;
  const numeric = value => code?.startsWith('a') && typeof value === 'string' && /^[0-9]{5,30}$/.test(value) ? value : null;
  return withConsentLock(db, hash, async connection => {
    // Immutable receipt: retries must not extend the lifetime or undo a withdrawal.
    await connection.execute(`INSERT INTO berlin_measurement_consents
      (token_hash,consent_version,consent_at,expires_at,code,ad_id,adset_id,campaign_id)
      VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE token_hash=VALUES(token_hash)`,
    [hash, CONSENT_VERSION, new Date(c.at), new Date(c.at + 90*86400000), code,
      numeric(a?.adId), numeric(a?.adsetId), numeric(a?.campaignId)]);
    return Boolean(await activeReceipt(connection, hash, now));
  });
}

export async function revokeConsent(db, token, now = Date.now()) {
  const hash = receiptHash(token);
  return withConsentLock(db, hash, async connection => {
    await connection.query('START TRANSACTION');
    try {
      // The tombstone also handles withdrawal arriving before the registration request.
      await connection.execute(`INSERT INTO berlin_measurement_consents
        (token_hash,consent_version,consent_at,expires_at,revoked_at) VALUES (?,?,?,?,?)
        ON DUPLICATE KEY UPDATE revoked_at=VALUES(revoked_at)`,
      [hash, CONSENT_VERSION, new Date(now), new Date(now+90*86400000), new Date(now)]);
      await connection.execute(`DELETE a FROM berlin_payment_adjustments a
        INNER JOIN berlin_payments p ON p.payment_intent=a.payment_intent WHERE p.consent_hash=?`, [hash]);
      await connection.execute('DELETE FROM berlin_payments WHERE consent_hash=?', [hash]);
      await connection.execute('DELETE FROM berlin_measurement_events WHERE consent_hash=?', [hash]);
      await connection.query('COMMIT');
      return true;
    } catch (error) { await connection.query('ROLLBACK'); throw error; }
  });
}
