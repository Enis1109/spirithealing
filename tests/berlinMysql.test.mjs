import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, createHmac } from 'node:crypto';
import express from 'express';
import { initializeBerlinMeasurement, recordMeasurement, cleanBerlinMeasurement,
  berlinMeasurementSummary } from '../server/berlinMeasurement.js';
import { registerBerlinWebhook, berlinWebhookConfig } from '../server/berlinWebhook.js';
import { CONSENT_VERSION } from '../src/lib/berlinMeasurement.js';
import { eraseBerlinPayment, berlinPaymentHash } from '../server/berlinErasure.js';
import { registerConsent, revokeConsent } from '../server/berlinConsent.js';

// Explicit opt-in, local server only, no existing database selectable.
// Never reads DB_* or the production environment file.
function localTestConfig(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Invalid local MySQL test configuration'); }
  if (url.protocol !== 'mysql:' || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    || !['', '/'].includes(url.pathname) || url.search || url.hash || !url.username)
    throw new Error('Use a local MySQL server without a database name or query parameters');
  return { host: url.hostname.replace(/^\[|\]$/g, ''), port: Number(url.port || 3306),
    user: decodeURIComponent(url.username), password: decodeURIComponent(url.password),
    timezone: 'Z', multipleStatements: false, connectTimeout: 5000 };
}

test('real MySQL test refuses remote hosts and existing database names', () => {
  for (const value of ['mysql://user@production.invalid', 'mysql://user@localhost/production',
    'mysql://user@127.0.0.1/?database=production', 'https://user@localhost', 'invalid'])
    assert.throws(() => localTestConfig(value));
  assert.equal(localTestConfig('mysql://test@127.0.0.1:3307/').port, 3307);
  assert.equal(localTestConfig('mysql://test@[::1]/').host, '::1');
});

const testUrl = process.env.BERLIN_MYSQL_TEST_URL;
const hostedDatabase = process.env.BERLIN_MYSQL_DISPOSABLE_DATABASE;
test('real MySQL: signed HTTP webhook, deduplication, refunds, disputes and retention', {
  skip: !testUrl && 'Requires an isolated local MySQL server and BERLIN_MYSQL_TEST_URL',
  timeout: 30000,
}, async t => {
  const { default: mysql } = await import('mysql2/promise');
  const database = hostedDatabase || `berlin_test_${randomUUID().replaceAll('-', '')}`;
  // Fresh generated name, or an explicitly disposable empty hosting database.
  if (hostedDatabase) {
    // Separate account and explicitly disposable name; never allow the member database.
    assert.match(database, /^u[0-9]+_bltest[0-9]{4}$/);
    assert.equal(localTestConfig(testUrl).user, database);
  } else assert.match(database, /^berlin_test_[a-f0-9]{32}$/);
  let db;
  try { db = await mysql.createConnection(localTestConfig(testUrl)); }
  catch { throw new Error('Local MySQL test connection failed; no production connection attempted'); }
  let created = false;
  t.after(async () => {
    try {
      if (created && !hostedDatabase) await db.query(`DROP DATABASE \`${database}\``);
      if (created && hostedDatabase) {
        // Delete only tables created by this run; remove the empty hosted database in hPanel.
        for (const table of ['berlin_measurement_events', 'berlin_payments', 'berlin_payment_adjustments', 'berlin_measurement_erasures', 'berlin_measurement_consents'])
          await db.query(`DROP TABLE IF EXISTS \`${table}\``);
      }
    }
    finally { await db.end(); }
  });
  if (!hostedDatabase) { await db.query(`CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4`); created = true; }
  await db.query(`USE \`${database}\``);
  if (hostedDatabase) {
    const [tables] = await db.query('SHOW TABLES');
    assert.equal(tables.length, 0, 'Hosted test database must be empty before the test');
    created = true;
  }
  await db.query("SET time_zone = '+00:00'");
  await initializeBerlinMeasurement(db);
  await initializeBerlinMeasurement(db); // Repeated startup must preserve tables and data.

  const config = berlinWebhookConfig({ BERLIN_MEASUREMENT_ENABLED: 'true', BERLIN_STRIPE_MODE: 'test',
    BERLIN_STRIPE_WEBHOOK_SECRET: 'whsec_local_synthetic_only',
    BERLIN_STRIPE_TEST_LINKS: JSON.stringify({ own_full: 'plink_localOwn', intensive_full: 'plink_localIntensive',
      own_followup: 'plink_localFollowup' }) });
  const app = express();
  registerBerlinWebhook(app, { db, config, ready: async () => true });
  app.use(express.json());
  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, '127.0.0.1', error => error ? reject(error) : resolve(listener));
    listener.once('error', reject);
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const endpoint = `http://127.0.0.1:${server.address().port}/api/berlin/stripe-webhook`;
  const post = async event => {
    const body = JSON.stringify(event), stamp = Math.floor(Date.now() / 1000);
    const signature = createHmac('sha256', config.secret).update(`${stamp}.`).update(body).digest('hex');
    const response = await fetch(endpoint, { method: 'POST', body,
      headers: { 'content-type': 'application/json', 'stripe-signature': `t=${stamp},v1=${signature}` } });
    assert.equal(response.status, 200);
    return (await response.json()).result;
  };
  const now = Math.floor(Date.now() / 1000);
  const consent = { version:CONSENT_VERSION,at:now*1000,analytics:true,meta:false,receipt:'a'.repeat(64) };
  const paid = { id: 'evt_localPaid', type: 'checkout.session.completed', livemode: false,
    data: { object: { id: 'cs_test_localOwn', object: 'checkout.session', mode: 'payment',
      payment_status: 'paid', payment_link: 'plink_localOwn', payment_intent: 'pi_localOwn',
      amount_total: 44400, currency: 'eur', created: now, client_reference_id: 'bl26c_'+consent.receipt } } };
  assert.equal(await post(paid), 'ignored');
  assert.equal((await db.execute('SELECT COUNT(*) AS total FROM berlin_payments'))[0][0].total, 0);
  await registerConsent(db, {consent,attribution:{code:'a01',adId:'123456789'}});
  const adjustment = (type, object, created = now) => ({ id: 'evt_localAdjustment', type, livemode: false,
    created, data: { object: { payment_intent: 'pi_localOwn', ...object } } });
  // No unidentified payment queue: early adjustments are ignored and require reconciliation.
  assert.equal(await post(adjustment('charge.refunded', { amount_refunded: 44400 })), 'ignored');
  assert.equal(await post(paid), 'paid');
  assert.equal(await post(adjustment('charge.refunded', { amount_refunded: 44400 })), 'adjusted');
  await post(paid);
  await post({ ...paid, type: 'checkout.session.async_payment_succeeded', id: 'evt_localAsync' });
  await post(adjustment('charge.refunded', { amount_refunded: 10000 }));
  await post(adjustment('charge.dispute.closed', { status: 'won' }, now));
  await post(adjustment('charge.dispute.created', { status: 'needs_response' }, now - 60));
  await post({ ...paid, data: { object: { ...paid.data.object, id: 'cs_test_localFollowup',
    payment_intent: 'pi_localFollowup', payment_link: 'plink_localFollowup', amount_total: 22200 } } });
  assert.equal(await post({ ...paid, livemode: true }), 'ignored');

  const measurement = { sessionId: randomUUID(), event: 'landing_view', attribution: { code: 'a01', adId: '123456789' },
    consent };
  await recordMeasurement(db, measurement);
  await recordMeasurement(db, measurement);
  await recordMeasurement(db, { ...measurement, event: 'checkout_click', offer: 'berlinOwn' });
  const summary = await berlinMeasurementSummary(db);
  assert.equal(summary.events.length, 1);
  assert.equal(Number(summary.events[0].landingViews), 1);
  assert.equal(Number(summary.events[0].checkoutClicks), 1);
  assert.equal(summary.payments.length, 1);
  const row = summary.payments[0];
  for (const [key, expected] of Object.entries({ paidPayments: 2, grossBookings: 1, fullyRefundedBookings: 1,
    disputedPayments: 0, paidMinorUnits: 66600, refundedMinorUnits: 44400 }))
    assert.equal(Number(row[key]), expected, key);

  // Expire only the first synthetic payment. Its later adjustment must not extend retention.
  await db.execute("UPDATE berlin_payments SET session_created_at=DATE_SUB(NOW(), INTERVAL 91 DAY) WHERE payment_intent='pi_localOwn'");
  await db.execute('UPDATE berlin_measurement_events SET created_at=DATE_SUB(NOW(), INTERVAL 91 DAY)');
  await db.execute("INSERT INTO berlin_payment_adjustments (payment_intent,updated_at) VALUES ('pi_localOldOrphan',DATE_SUB(NOW(),INTERVAL 8 DAY)),('pi_localNewOrphan',NOW())");
  await cleanBerlinMeasurement(db);
  const [remaining] = await db.execute('SELECT payment_intent FROM berlin_payments');
  assert.deepEqual(remaining.map(r => r.payment_intent), ['pi_localFollowup']);
  const [adjustments] = await db.execute('SELECT payment_intent FROM berlin_payment_adjustments');
  assert.deepEqual(adjustments.map(r => r.payment_intent), []);
  assert.deepEqual((await berlinMeasurementSummary(db)).events, []);
  assert.equal(await post({ ...paid, data: { object: { ...paid.data.object, created: now - 91 * 86400 } } }), 'ignored');
  const erasure = await eraseBerlinPayment(db, 'pi_localFollowup');
  assert.equal(erasure.erased, 1);
  const replay = { ...paid, data: { object: { ...paid.data.object, id: 'cs_test_localFollowup',
    payment_intent: 'pi_localFollowup', payment_link: 'plink_localFollowup', amount_total: 22200 } } };
  assert.equal(await post(replay), 'erased');
  assert.equal(await post({ ...replay, type: 'checkout.session.async_payment_succeeded' }), 'erased');
  assert.equal(await post({ ...adjustment('charge.refunded', { amount_refunded: 22200 }),
    data: { object: { payment_intent: 'pi_localFollowup', amount_refunded: 22200 } } }), 'erased');
  assert.deepEqual((await berlinMeasurementSummary(db)).payments, []);
  const [markers] = await db.execute('SELECT payment_hash FROM berlin_measurement_erasures');
  assert.deepEqual(markers.map(row => row.payment_hash), [berlinPaymentHash('pi_localFollowup')]);
  await db.execute('UPDATE berlin_measurement_erasures SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 SECOND)');
  await cleanBerlinMeasurement(db);
  assert.equal((await db.execute('SELECT payment_hash FROM berlin_measurement_erasures'))[0].length, 0);
  assert.equal(await post(paid), 'paid');
  assert.equal(await recordMeasurement(db, measurement), true);
  assert.equal((await berlinMeasurementSummary(db)).payments.length, 1);
  assert.equal((await berlinMeasurementSummary(db)).events.length, 1);
  await revokeConsent(db, consent.receipt);
  assert.deepEqual((await berlinMeasurementSummary(db)).payments, []);
  assert.deepEqual((await berlinMeasurementSummary(db)).events, []);
  assert.equal(await post(paid), 'ignored');
  assert.equal(await recordMeasurement(db, measurement), false);
  assert.equal(await registerConsent(db, {consent}), false);
});
