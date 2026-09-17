import test from 'node:test';
import assert from 'node:assert/strict';
import { berlinPaymentHash, eraseBerlinPayment, withBerlinPaymentLock } from '../server/berlinErasure.js';
import { recordStripeEvent, BERLIN_LINK_IDS } from '../server/berlinMeasurement.js';

function memoryStore() {
  const markers = new Set(), payments = new Set(['pi_eraseTest']), adjustments = new Set(['pi_eraseTest']);
  const calls = [];
  const tails = new Map();
  const db = { async getConnection() {
    const unlocks = new Map();
    return {
      async query(sql, values) {
        calls.push([sql, values]);
        if (sql.includes('GET_LOCK')) {
          const previous = tails.get(values[0]) || Promise.resolve();
          tails.set(values[0], new Promise(resolve => { unlocks.set(values[0], resolve); }));
          await previous;
          return [[{ acquired: 1 }]];
        }
        if (sql.includes('RELEASE_LOCK')) unlocks.get(values[0])();
        return [[]];
      },
      async execute(sql, values) {
        calls.push([sql, values]);
        if (sql.startsWith('SELECT * FROM berlin_measurement_consents')) return [[{code:'a01',ad_id:'123456789',consent_at:new Date(Date.now()-1000)}]];
        if (sql.startsWith('SELECT payment_hash')) return [markers.has(values[0]) ? [{ payment_hash: values[0] }] : []];
        if (sql.startsWith('INSERT INTO berlin_measurement_erasures')) markers.add(values[0]);
        if (sql.startsWith('INSERT INTO berlin_payments')) payments.add(values[1]);
        if (sql.startsWith('INSERT INTO berlin_payment_adjustments')) adjustments.add(values[0]);
        if (sql.startsWith('DELETE FROM berlin_payments')) return [{ affectedRows: Number(payments.delete(values[0])) }];
        if (sql.startsWith('DELETE FROM berlin_payment_adjustments')) adjustments.delete(values[0]);
        return [{ affectedRows: 1 }];
      },
      release() { calls.push(['release']); },
    };
  } };
  return { db, calls, markers, payments, adjustments };
}
const event = { id: 'evt_eraseTest', livemode: false, type: 'checkout.session.completed', data: { object: {
  object: 'checkout.session', mode: 'payment', payment_status: 'paid', id: 'cs_test_eraseTest',
  payment_intent: 'pi_eraseTest', payment_link: Object.keys(BERLIN_LINK_IDS)[0],
  amount_total: 44400, currency: 'eur', created: Math.floor(Date.now() / 1000),
  client_reference_id: 'bl26c_'+'a'.repeat(64),
} } };

test('erasure marker hashes only validated technical payment IDs', () => {
  assert.match(berlinPaymentHash('pi_eraseTest'), /^[a-f0-9]{64}$/);
  assert.equal(berlinPaymentHash('pi_eraseTest'), berlinPaymentHash('pi_eraseTest'));
  for (const invalid of [null, {}, 'private@example.com', 'pi_', 'pi_x;DROP', 'pi_' + 'x'.repeat(251)])
    assert.throws(() => berlinPaymentHash(invalid));
});
test('erasure is transactional, deletes only analytics copies, and blocks payment/refund/dispute replay', async () => {
  const store = memoryStore();
  assert.deepEqual(await eraseBerlinPayment(store.db, 'pi_eraseTest'), { erased: 1, replayBlocked: true });
  assert.equal(store.payments.size, 0); assert.equal(store.adjustments.size, 0);
  assert.deepEqual([...store.markers], [berlinPaymentHash('pi_eraseTest')]);
  for (const type of ['checkout.session.completed', 'checkout.session.async_payment_succeeded'])
    assert.equal(await recordStripeEvent(store.db, { ...event, type }, false), 'erased');
  for (const type of ['charge.refunded', 'charge.dispute.created', 'charge.dispute.closed'])
    assert.equal(await recordStripeEvent(store.db, { type, livemode: false, created: Math.floor(Date.now()/1000),
      data: { object: { payment_intent: 'pi_eraseTest', amount_refunded: 44400, status: 'won' } } }, false), 'erased');
  assert.equal(store.payments.size, 0); assert.equal(store.adjustments.size, 0);
  assert.ok(store.calls.some(([sql]) => sql === 'START TRANSACTION'));
  assert.ok(store.calls.some(([sql]) => sql === 'COMMIT'));
  assert.ok(store.calls.filter(([sql]) => sql.startsWith('DELETE')).every(([sql]) => sql.includes('berlin_')));
});
test('concurrent deletion and payment cannot restore erased attribution', async () => {
  for (const deletionFirst of [true, false]) {
    const store = memoryStore();
    const deletion = () => eraseBerlinPayment(store.db, 'pi_eraseTest');
    const payment = () => recordStripeEvent(store.db, event, false);
    await Promise.all(deletionFirst ? [deletion(), payment()] : [payment(), deletion()]);
    assert.equal(store.payments.size, 0);
    assert.equal(await recordStripeEvent(store.db, event, false), 'erased');
  }
});
test('lock failure prevents all writes and releases the borrowed connection', async () => {
  let released = false, executed = false;
  const db = { getConnection: async () => ({ query: async () => [[{ acquired: 0 }]], release() { released = true; } }) };
  await assert.rejects(withBerlinPaymentLock(db, 'pi_eraseTest', async () => { executed = true; }));
  assert.equal(executed, false); assert.equal(released, true);
});
test('failure rolls back and returns lock and connection', async () => {
  const calls = [];
  const db = { getConnection: async () => ({
    query: async sql => { calls.push(sql); return [[{ acquired: 1 }]]; },
    execute: async () => { throw new Error('synthetic failure'); },
    release() { calls.push('release'); },
  }) };
  await assert.rejects(eraseBerlinPayment(db, 'pi_eraseTest'));
  assert.ok(calls.includes('ROLLBACK'));
  assert.ok(calls.some(sql => sql.includes('RELEASE_LOCK')));
  assert.equal(calls.at(-1), 'release');
});
test('a connection with an unreleased lock is destroyed, never returned to the pool', async () => {
  let destroyed = false, released = false;
  const db = { getConnection: async () => ({
    query: async sql => { if (sql.includes('RELEASE_LOCK')) throw new Error('lost connection'); return [[{ acquired: 1 }]]; },
    destroy() { destroyed = true; }, release() { released = true; },
  }) };
  await assert.rejects(withBerlinPaymentLock(db, 'pi_eraseTest', async () => true), /lock release failed/);
  assert.equal(destroyed, true); assert.equal(released, false);
});
