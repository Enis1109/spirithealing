import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import express from 'express';
import { completedConstellationSession, recordConstellationBooking, inventoryFromRows, constellationLinks } from '../server/constellationAvailability.js';
import { registerBerlinWebhook } from '../server/berlinWebhook.js';
import { BERLIN_LINK_IDS } from '../server/berlinMeasurement.js';
import { constellationDays, constellationDayPath } from '../src/content/constellationDays.js';
import { metadataForPath, structuredDataForPath } from '../src/seo/pageMeta.js';
import { publicEvents } from '../src/content/replayFunnel.js';
import { memberEvents } from '../src/content/memberEvents.js';

const linkId = Object.keys(constellationLinks).find(id => constellationLinks[id].day === '2026-12-12' && constellationLinks[id].ticket === 'representative');
const event = (patch = {}) => ({ id: 'evt_synthetic', type: 'checkout.session.completed', livemode: true,
  created: Math.floor(Date.now() / 1000), data: { object: { id: 'cs_live_synthetic', object: 'checkout.session',
    mode: 'payment', status: 'complete', payment_link: linkId, payment_status: 'paid', amount_total: 2200,
    customer_details: { email: 'synthetic@example.invalid' }, ...patch } } });

test('operational inventory counts both representative prices once per completed session', async () => {
  const stored = new Map();
  const db = { execute: async (sql, values) => { assert.match(sql, /^INSERT IGNORE INTO constellation_bookings/); stored.set(values[0], values); return [[]]; } };
  const returning = event();
  await recordConstellationBooking(db, returning, true);
  await recordConstellationBooking(db, returning, true);
  await recordConstellationBooking(db, event({ id: 'cs_live_second', amount_total: 4400 }), true);
  assert.equal(stored.size, 2);
  assert.equal([...stored.values()].some(values => JSON.stringify(values).includes('example.invalid')), false);
  assert.equal(stored.has('cs_live_synthetic'), false);
  assert.deepEqual(inventoryFromRows([{ event_date: '2026-12-12', ticket_type: 'representative', booked: 2 }])['2026-12-12'], { total: 18, representative: 13, own: 5 });
  assert.deepEqual(inventoryFromRows([{ event_date: '2026-12-12', ticket_type: 'own', booked: 8 }, { event_date: '2026-12-12', ticket_type: 'representative', booked: 15 }])['2026-12-12'], { total: 0, representative: 0, own: 0 });
});

test('foreign links, test events, uncompleted sessions and async repeats cannot alter inventory', () => {
  for (const e of [{ ...event(), livemode: false }, { ...event(), type: 'checkout.session.async_payment_succeeded' },
    event({ status: 'open' }), event({ mode: 'subscription' }), event({ payment_link: 'plink_foreign' }), event({ id: 'cs_test_synthetic' })]) {
    assert.equal(completedConstellationSession(e, true), null);
  }
  assert.equal(completedConstellationSession(event(), false), null);
  assert.ok(completedConstellationSession(event({ payment_status: 'unpaid' }), true), 'delayed payment completion reserves the same place as the Stripe link limit');
});

test('signed webhook updates inventory without advertising consent and rejects tampered requests', async t => {
  const secret = 'whsec_synthetic_local_only';
  const stored = new Set();
  const db = { execute: async (sql, values) => { assert.match(sql, /constellation_bookings/); stored.add(values[0]); return [[]]; } };
  const app = express();
  registerBerlinWebhook(app, { db, config: { enabled: true, expectedLive: true, secret, linkMap: BERLIN_LINK_IDS } });
  app.use(express.json());
  const server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/api/berlin/stripe-webhook`;
  const raw = JSON.stringify(event());
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = `t=${timestamp},v1=${createHmac('sha256', secret).update(`${timestamp}.`).update(raw).digest('hex')}`;
  const send = body => fetch(url, { method: 'POST', body, headers: { 'content-type': 'application/json', 'stripe-signature': signature } });
  assert.equal((await send(raw + ' ')).status, 400);
  assert.equal(stored.size, 0);
  const response = await send(raw);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { ok: true, result: 'booking' });
  await send(raw);
  assert.equal(stored.size, 1);
});

test('calendar, Berlin overview and per-day SEO lead to the same day with the complete hierarchy', () => {
  for (const day of constellationDays) {
    const path = constellationDayPath(day).split('?')[0];
    assert.equal(publicEvents.find(e => e.constellationDayId === day.id).href, constellationDayPath(day));
    assert.equal(memberEvents.find(e => e.id === `constellation-${day.id}`).href, constellationDayPath(day));
    assert.equal(metadataForPath(path).notFound, false);
    const graph = structuredDataForPath(path)[0]['@graph'];
    assert.equal(graph.filter(item => item['@type'] === 'Event').length, 1);
    const breadcrumbs = graph.find(item => item['@type'] === 'BreadcrumbList').itemListElement;
    assert.deepEqual(breadcrumbs.map(item => new URL(item.item).pathname), ['/', '/aufstellungsarbeit', '/berlin-live', path]);
    assert.equal(metadataForPath('/berlin-live/2026-12-99').notFound, true);
  }
});
