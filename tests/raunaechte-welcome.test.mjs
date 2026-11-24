import assert from 'node:assert/strict';
import test from 'node:test';
import { deliverRaunaechteWelcomes, raunaechteCheckoutFor, recordRaunaechtePurchase } from '../server/raunaechteWelcome.js';

test('checks the advertised price before redirecting and removes the expired promotion', () => {
  const ends = Date.parse('2026-11-28T00:00:00+01:00');
  const settings = { paymentLink: 'https://book.stripe.com/example', promoCode: 'PROMO' };
  assert.equal(raunaechteCheckoutFor({ ...settings, price: '88', now: ends - 1 }), 'https://book.stripe.com/example?prefilled_promo_code=PROMO');
  assert.equal(raunaechteCheckoutFor({ ...settings, price: '88', now: ends }), null);
  assert.equal(raunaechteCheckoutFor({ ...settings, price: '111', now: ends }), settings.paymentLink);
  assert.equal(raunaechteCheckoutFor({ ...settings, paymentLink: 'https://book.stripe.com.example.org', price: '111', now: ends }), null);
});

const paidEvent = {
  id: 'evt_raunacht', livemode: true, type: 'checkout.session.completed',
  data: { object: {
    id: 'cs_live_raunacht', payment_link: 'plink_raunacht', payment_status: 'paid',
    amount_total: 8800, currency: 'eur', metadata: { fulfillment: 'raunaechte_welcome_2026_27' },
    customer_details: { email: '  raunaechte@example.org  ' },
  } },
};

test('stores only confirmed Raunächte payments and treats repeat events as the same purchase', async () => {
  const entries = new Map();
  const db = { execute: async (sql, [id, email]) => {
    assert.match(sql, /ON DUPLICATE KEY UPDATE/);
    if (!entries.has(id)) entries.set(id, email);
  } };
  const testPayment = { ...paidEvent, livemode: false };
  const otherPurchase = structuredClone(paidEvent);
  otherPurchase.data.object.metadata.fulfillment = 'another_offer';
  const pending = structuredClone(paidEvent);
  pending.data.object.payment_status = 'unpaid';
  assert.equal(await recordRaunaechtePurchase(db, testPayment), false);
  assert.equal(await recordRaunaechtePurchase(db, otherPurchase), false);
  assert.equal(await recordRaunaechtePurchase(db, pending), true);
  assert.equal(entries.size, 0);

  await recordRaunaechtePurchase(db, paidEvent);
  await recordRaunaechtePurchase(db, { ...paidEvent, type: 'checkout.session.async_payment_succeeded' });
  assert.deepEqual([...entries], [['cs_live_raunacht', 'raunaechte@example.org']]);
});

test('two workers can claim one welcome, using the email from Checkout', async () => {
  const row = { stripe_session_id: 'cs_live_raunacht', email: 'raunaechte@example.org', welcome_attempts: 0 };
  let status = 'pending';
  const mails = [];
  const db = { execute: async (sql, values) => {
    if (sql.startsWith('SELECT')) return [[row]];
    if (sql.includes("SET welcome_status = 'sending'")) {
      assert.deepEqual(values, [row.stripe_session_id, 0]);
      if (status !== 'pending') return [{ affectedRows: 0 }];
      status = 'sending';
      return [{ affectedRows: 1 }];
    }
    status = values[0];
    return [{ affectedRows: 1 }];
  } };
  const send = async (mail) => mails.push(mail);
  await Promise.all([deliverRaunaechteWelcomes(db, send), deliverRaunaechteWelcomes(db, send)]);
  assert.equal(status, 'sent');
  assert.equal(mails.length, 1);
  assert.equal(mails[0].email, row.email);
  assert.match(mails[0].text, /Deine Rechnung kommt separat von Stripe/);
});
