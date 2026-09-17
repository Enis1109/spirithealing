import { createHmac, timingSafeEqual } from 'node:crypto';
import { CONSENT_VERSION, parseConsentReference, validConsent, validReceipt } from '../src/lib/berlinMeasurement.js';
import { berlinErasureSchema, berlinPaymentErased, withBerlinPaymentLock } from './berlinErasure.js';
import { berlinConsentSchema, receiptHash, activeReceipt, withConsentLock } from './berlinConsent.js';

// Verified read-only against Spirit Healing's live Payment Links on 2026-09-17.
// Follow-up installments are payments, never additional bookings.
export const BERLIN_LINK_IDS = Object.freeze({
  plink_1U9m0WQ90vf7AvfHyRCsEqyC: { ticket: 'own', booking: true, installment: 0 },
  plink_1U9m1IQ90vf7AvfH8XCuqyos: { ticket: 'intensive', booking: true, installment: 0 },
  plink_1U9mO7Q90vf7AvfHCcLxRYze: { ticket: 'own', booking: true, installment: 1 },
  plink_1U9mOXQ90vf7AvfHVmBex5Z8: { ticket: 'intensive', booking: true, installment: 1 },
  plink_1U9mOKQ90vf7AvfHsj1kzcWT: { ticket: 'own', booking: false, installment: 2 },
  plink_1U9mOiQ90vf7AvfH0g4jf2dP: { ticket: 'intensive', booking: false, installment: 2 },
});
const idPattern = /^[0-9]{5,30}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const cleanId = v => typeof v === 'string' && idPattern.test(v) ? v : null;
const PAYMENT_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;

export function normalizeMeasurement(input, now = Date.now()) {
  if (!input || !validConsent(input.consent, now) || !input.consent.analytics || !validReceipt(input.consent.receipt)
    || !uuidPattern.test(input.sessionId || '')) return null;
  if (!['landing_view', 'checkout_click'].includes(input.event)) return null;
  const offer = input.event === 'checkout_click' && ['berlinOwn', 'berlinIntensive'].includes(input.offer) ? input.offer : null;
  if (input.event === 'checkout_click' && !offer) return null;
  const a = input.attribution;
  const validCode = a && ['a01', 'a02', 'o01', 'o02'].includes(a.code);
  return { event: input.event, offer, sessionId: input.sessionId, consentHash: receiptHash(input.consent.receipt),
    code: validCode ? a.code : null, adId: validCode && a.code.startsWith('a') ? cleanId(a.adId) : null,
    adsetId: validCode && a.code.startsWith('a') ? cleanId(a.adsetId) : null,
    campaignId: validCode && a.code.startsWith('a') ? cleanId(a.campaignId) : null,
    consentVersion: CONSENT_VERSION, consentAt: new Date(input.consent.at) };
}

// Stripe's documented manual verification algorithm; no API key needed.
// Raw body required. Replay tolerance applies to the signed timestamp, not event.created.
export function verifyStripeEvent(raw, header, secret, nowSeconds = Date.now() / 1000) {
  if (!Buffer.isBuffer(raw) || !secret || typeof header !== 'string') throw new Error('Invalid signature');
  const entries = header.split(',').map(v => v.trim().split('='));
  const times = entries.filter(([k]) => k === 't');
  if (times.length !== 1 || !/^\d+$/.test(times[0][1])) throw new Error('Invalid signature');
  const time = Number(times[0][1]);
  if (Math.abs(nowSeconds - time) > 300) throw new Error('Invalid signature');
  const expected = createHmac('sha256', secret).update(`${time}.`).update(raw).digest();
  const valid = entries.filter(([k,v]) => k === 'v1' && /^[0-9a-f]{64}$/.test(v || ''))
    .some(([,v]) => timingSafeEqual(expected, Buffer.from(v, 'hex')));
  if (!valid) throw new Error('Invalid signature');
  return JSON.parse(raw.toString('utf8'));
}

export function paidSession(event, expectedLive = true, linkMap = BERLIN_LINK_IDS) {
  if (event?.livemode !== expectedLive || !['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) return null;
  const s = event.data?.object;
  const link = typeof s?.payment_link === 'string' ? s.payment_link : s?.payment_link?.id;
  if (!link || !Object.hasOwn(linkMap, link) || s.object !== 'checkout.session' || s.payment_status !== 'paid'
    || !/^cs_[A-Za-z0-9_]+$/.test(s.id || '') || !/^[a-z]{3}$/.test(s.currency || '')
    || !Number.isSafeInteger(s.amount_total) || s.amount_total <= 0 || s.mode !== 'payment') return null;
  const pi = typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id;
  if (!/^pi_[A-Za-z0-9]+$/.test(pi || '') || !Number.isSafeInteger(s.created)) return null;
  const receipt = parseConsentReference(s.client_reference_id);
  if (!receipt) return null;
  return { session: s.id, paymentIntent: pi, link, ...linkMap[link], amount: s.amount_total,
    currency: s.currency, consentHash: receiptHash(receipt),
    created: new Date(s.created * 1000), eventId: event.id };
}

export const berlinSchema = [
  berlinConsentSchema,
  berlinErasureSchema,
  `CREATE TABLE IF NOT EXISTS berlin_measurement_events (
    session_id CHAR(36) NOT NULL, event_name VARCHAR(24) NOT NULL, offer VARCHAR(24) NOT NULL DEFAULT '',
    code VARCHAR(8) NULL, ad_id VARCHAR(30) NULL, adset_id VARCHAR(30) NULL, campaign_id VARCHAR(30) NULL,
    consent_version VARCHAR(48) NOT NULL, consent_at DATETIME(3) NOT NULL, consent_hash CHAR(64) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(session_id,event_name,offer), INDEX berlin_events_created(created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS berlin_payments (
    session_id VARCHAR(255) PRIMARY KEY, payment_intent VARCHAR(255) NOT NULL UNIQUE,
    payment_link VARCHAR(255) NOT NULL, ticket VARCHAR(24) NOT NULL, is_booking TINYINT NOT NULL,
    installment SMALLINT NOT NULL, amount BIGINT NOT NULL, currency CHAR(3) NOT NULL,
    code VARCHAR(8) NULL, ad_id VARCHAR(30) NULL, consent_hash CHAR(64) NOT NULL, session_created_at DATETIME NOT NULL,
    first_event_id VARCHAR(255) NOT NULL, received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS berlin_payment_adjustments (
    payment_intent VARCHAR(255) PRIMARY KEY, refunded BIGINT NOT NULL DEFAULT 0,
    dispute_status VARCHAR(40) NULL, dispute_event_time BIGINT NOT NULL DEFAULT 0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

export async function initializeBerlinMeasurement(db) {
  for (const sql of berlinSchema) await db.execute(sql);
  await cleanBerlinMeasurement(db);
}

export async function cleanBerlinMeasurement(db) {
  await db.execute(`DELETE e FROM berlin_measurement_events e LEFT JOIN berlin_measurement_consents c ON c.token_hash=e.consent_hash
    WHERE e.created_at <= DATE_SUB(NOW(), INTERVAL 90 DAY) OR c.token_hash IS NULL OR c.revoked_at IS NOT NULL OR c.expires_at<=UTC_TIMESTAMP()`);
  // These are analytics copies only. Delete matching adjustments in the same statement.
  // Use the original checkout time, never a webhook retry or adjustment time.
  await db.execute(`DELETE p,a FROM berlin_payments p LEFT JOIN berlin_payment_adjustments a ON a.payment_intent=p.payment_intent
    LEFT JOIN berlin_measurement_consents c ON c.token_hash=p.consent_hash
    WHERE p.session_created_at <= DATE_SUB(NOW(), INTERVAL 90 DAY) OR c.token_hash IS NULL OR c.revoked_at IS NOT NULL OR c.expires_at<=UTC_TIMESTAMP()`);
  await db.execute(`DELETE a FROM berlin_payment_adjustments a LEFT JOIN berlin_payments p ON a.payment_intent=p.payment_intent
    WHERE p.session_id IS NULL`);
  await db.execute('DELETE FROM berlin_measurement_erasures WHERE expires_at<=UTC_TIMESTAMP()');
  await db.execute('DELETE FROM berlin_measurement_consents WHERE expires_at<=UTC_TIMESTAMP()');
}

// Only cleans the new measurement tables. Never removes a booking or an accounting record.
// One worker per process, no overlapping sweeps; the timer does not keep shutdown alive.
export function startBerlinMeasurementCleanup(db, {
  schedule = setInterval, cancel = clearInterval,
  onError = () => console.error('Berlin measurement retention cleanup failed'),
} = {}) {
  let busy = false;
  const sweep = async () => {
    if (busy) return;
    busy = true;
    try { await cleanBerlinMeasurement(db); } catch { onError(); }
    finally { busy = false; }
  };
  const timer = schedule(sweep, 60 * 60 * 1000);
  timer.unref?.();
  return () => cancel(timer);
}

export async function recordMeasurement(db, input) {
  const e = normalizeMeasurement(input);
  if (!e) return false;
  return withConsentLock(db, e.consentHash, async connection => {
  const receipt = await activeReceipt(connection, e.consentHash);
  if (!receipt) return false;
  // Unique browser-document/event/offer key prevents React retries from inflating counts.
  await connection.execute(`INSERT INTO berlin_measurement_events
    (session_id,event_name,offer,code,ad_id,adset_id,campaign_id,consent_version,consent_at,consent_hash)
    VALUES (?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE session_id=VALUES(session_id)`,
  [e.sessionId,e.event,e.offer || '',receipt.code,receipt.ad_id,receipt.adset_id,receipt.campaign_id,receipt.consent_version,receipt.consent_at,e.consentHash]);
  return true;
  });
}

export async function recordStripeEvent(db, event, expectedLive = true, linkMap = BERLIN_LINK_IDS, now = Date.now()) {
  const p = paidSession(event, expectedLive, linkMap);
  if (p) {
    // A delayed or replayed event must not recreate an expired analytics record.
    if (!Number.isFinite(p.created.getTime()) || p.created.getTime() <= now - PAYMENT_RETENTION_MS
      || p.created.getTime() > now) return 'ignored';
    return withBerlinPaymentLock(db, p.paymentIntent, async (connection, hash) => {
      if (await berlinPaymentErased(connection, hash)) return 'erased';
      return withConsentLock(connection, p.consentHash, async connection => {
      const receipt = await activeReceipt(connection, p.consentHash, now);
      if (!receipt || new Date(receipt.consent_at).getTime() > p.created.getTime()+999) return 'ignored';
      await connection.execute(`INSERT INTO berlin_payments
      (session_id,payment_intent,payment_link,ticket,is_booking,installment,amount,currency,code,ad_id,session_created_at,first_event_id,consent_hash)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE session_id=VALUES(session_id)`,
    [p.session,p.paymentIntent,p.link,p.ticket,p.booking ? 1 : 0,p.installment,p.amount,p.currency,receipt.code,receipt.ad_id,p.created,p.eventId,p.consentHash]);
    return 'paid';
      });
    });
  }
  if (event?.livemode !== expectedLive) return 'ignored';
  const o = event.data?.object;
  const pi = typeof o?.payment_intent === 'string' ? o.payment_intent : o?.payment_intent?.id;
  if (!/^pi_[A-Za-z0-9]+$/.test(pi || '')) return 'ignored';
  // Never queue unidentified payments. Earlier adjustments must be reconciled in Stripe.
  if (['charge.refunded','charge.dispute.created','charge.dispute.closed'].includes(event.type)) {
    return withBerlinPaymentLock(db, pi, async (connection, hash) => {
    if (await berlinPaymentErased(connection, hash)) return 'erased';
    const [payments] = await connection.execute('SELECT consent_hash FROM berlin_payments WHERE payment_intent=?', [pi]);
    if (!payments[0]) return 'ignored';
    return withConsentLock(connection, payments[0].consent_hash, async connection => {
    if (!await activeReceipt(connection, payments[0].consent_hash, now)) return 'ignored';
    if (event.type === 'charge.refunded') {
      if (!Number.isSafeInteger(o.amount_refunded) || o.amount_refunded < 0) return 'ignored';
      await connection.execute(`INSERT INTO berlin_payment_adjustments (payment_intent,refunded) VALUES (?,?)
        ON DUPLICATE KEY UPDATE refunded=GREATEST(refunded,VALUES(refunded))`, [pi,o.amount_refunded]);
    } else {
      if (!['warning_needs_response','warning_under_review','warning_closed','needs_response','under_review','won','lost'].includes(o.status)
        || !Number.isSafeInteger(event.created)) return 'ignored';
      await connection.execute(`INSERT INTO berlin_payment_adjustments (payment_intent,dispute_status,dispute_event_time) VALUES (?,?,?)
        ON DUPLICATE KEY UPDATE dispute_status=IF(VALUES(dispute_event_time)>=dispute_event_time,VALUES(dispute_status),dispute_status),
        dispute_event_time=GREATEST(dispute_event_time,VALUES(dispute_event_time))`, [pi,o.status,event.created]);
    }
    return 'adjusted';
    });
    });
  }
  return 'ignored';
}

export async function berlinMeasurementSummary(db) {
  const [events] = await db.execute(`SELECT COALESCE(code,'unknown') AS code, ad_id AS adId,
    SUM(event_name='landing_view') AS landingViews, SUM(event_name='checkout_click') AS checkoutClicks
    FROM berlin_measurement_events GROUP BY code,ad_id`);
  const [payments] = await db.execute(`SELECT COALESCE(p.code,'unknown') AS code,p.ad_id AS adId,p.currency,p.ticket,
    COUNT(*) AS paidPayments,SUM(p.is_booking) AS grossBookings,
    SUM(p.is_booking=1 AND COALESCE(a.refunded,0)>=p.amount) AS fullyRefundedBookings,
    SUM(a.dispute_status IS NOT NULL AND a.dispute_status NOT IN ('won','warning_closed')) AS disputedPayments,
    SUM(p.amount) AS paidMinorUnits,SUM(LEAST(p.amount,COALESCE(a.refunded,0))) AS refundedMinorUnits
    FROM berlin_payments p LEFT JOIN berlin_payment_adjustments a ON a.payment_intent=p.payment_intent
    GROUP BY p.code,p.ad_id,p.currency,p.ticket`);
  return { events, payments, scope: 'Berlin 2026; rolling 90-day analytics records only; no backfill or offline bookings',
    limitations: ['Visits and payments require a recorded active consent receipt; not a complete payment ledger',
      'Adjustments received before an eligible payment are not stored; reconcile refunds and disputes in Stripe before decisions',
      'Consent-limited document visits, not unique people', 'Checkout clicks are not checkout sessions',
      'Attribution describes the tagged booking link, not proven causal acquisition',
      'First-installment revenue is cash received, not full contract value',
      'Offline sales, cancellations and cross-link capacity require reconciliation',
      'Currency groups must not be added together', 'Disputes are flagged separately, not silently netted',
      'Expired analytics records are deleted; use original payment records for later refunds and accounting'] };
}
