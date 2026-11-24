import assert from 'node:assert/strict';
import test from 'node:test';
import { deliverRaunaechteWelcomes, raunaechteCheckoutFor, raunaechtePayment, recordRaunaechtePurchase } from '../server/raunaechteWelcome.js';

test('checks the advertised price and switches to the regular payment link at the deadline', () => {
  const ends = Date.parse('2026-11-28T00:00:00+01:00');
  assert.equal(raunaechteCheckoutFor({ price: '88', now: ends - 1 }), raunaechtePayment.sale.url);
  assert.equal(raunaechteCheckoutFor({ price: '88', now: ends }), null);
  assert.equal(raunaechteCheckoutFor({ price: '111', now: ends }), raunaechtePayment.regular.url);
  const payment = { ...raunaechtePayment, regular: { url: 'https://book.stripe.com.example.org', amount: 11100 } };
  assert.equal(raunaechteCheckoutFor({ payment, price: '111', now: ends }), null);
});

const paidEvent = {
  id: 'evt_raunacht', livemode: true, type: 'checkout.session.completed',
  data: { object: {
    id: 'cs_live_raunacht', payment_link: raunaechtePayment.sale.id, payment_status: 'paid',
    object: 'checkout.session', mode: 'payment',
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

test('queues the paid Stripe invoice with its own identifier and PDF', async () => {
  const records = [];
  const db = { execute: async (_sql, values) => records.push(values) };
  const invoice = { id: 'evt_invoice', livemode: true, type: 'invoice.paid', data: { object: {
    id: 'in_raunaechte', object: 'invoice', status: 'paid', currency: 'eur', amount_paid: 8800,
    metadata: { fulfillment: 'raunaechte_welcome_2026_27' }, customer_email: 'raunaechte@example.org',
    invoice_pdf: 'https://pay.stripe.com/invoice/example/pdf',
  } } };
  await recordRaunaechtePurchase(db, invoice);
  assert.deepEqual(records, [['in_raunaechte', 'raunaechte@example.org', invoice.data.object.invoice_pdf]]);
});

test('two workers can claim one welcome, using the email from Checkout', async () => {
  const row = { stripe_id: 'cs_live_raunacht', email: 'raunaechte@example.org', welcome_attempts: 0 };
  let status = 'pending';
  const mails = [];
  const db = { execute: async (sql, values) => {
    if (sql.startsWith('SELECT')) return [[row]];
    if (sql.includes("SET welcome_status = 'sending'")) {
      assert.deepEqual(values, [row.stripe_id, 0]);
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
  assert.match(mails[0].text, /Deine Rechnung bekommst du in einer separaten E-Mail/);
});
