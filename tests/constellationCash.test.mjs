import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { CashBookingError, createCashBooking, normalizeCashBooking } from '../server/constellationCash.js';
import { getConstellationAvailability } from '../server/constellationAvailability.js';

function memoryDatabase(paid = []) {
  const cash = [];
  const execute = async (sql, args = []) => {
    if (sql.includes('SELECT id FROM constellation_cash_bookings'))
      return [cash.filter(row => row.requestKey === args[0]).map(row => ({ id: row.id }))];
    if (sql.includes('FROM constellation_inventory_locks')) return [[{ event_date: args[0] }]];
    if (sql.includes('COUNT(*) AS booked FROM constellation_bookings'))
      return [[{ booked: paid.filter(row => row.day === args[0] && row.ticket === args[1]).length }]];
    if (sql.includes('COUNT(*) AS booked FROM constellation_cash_bookings'))
      return [[{ booked: cash.filter(row => row.day === args[0] && row.ticket === args[1] && row.status === 'reserved').length }]];
    if (sql.includes('INSERT INTO constellation_cash_bookings')) {
      const id = cash.length + 1;
      cash.push({ id, requestKey: args[0], day: args[1], ticket: args[2], priceCents: args[3],
        name: args[4], status: 'reserved' });
      return [{ insertId: id }];
    }
    if (sql.includes('SELECT event_date, ticket_type, SUM(booked)')) {
      const grouped = new Map();
      for (const row of [...paid, ...cash.filter(row => row.status === 'reserved')]) {
        const key = `${row.day}:${row.ticket}`;
        grouped.set(key, (grouped.get(key) || 0) + 1);
      }
      return [[...grouped].map(([key, booked]) => ({ event_date: key.split(':')[0],
        ticket_type: key.split(':')[1], booked }))];
    }
    throw new Error(`Unexpected query: ${sql}`);
  };
  return { cash, db: { execute, getConnection: async () => ({ execute,
    beginTransaction: async () => {}, commit: async () => {}, rollback: async () => {}, release: () => {} }) } };
}

test('cash booking uses each day and ticket price without making the name public', () => {
  const base = { name: '  Karin   Schuchna ', requestKey: randomUUID() };
  assert.deepEqual(normalizeCashBooking({ ...base, day: '2026-12-12', kind: 'returning' }).priceCents, 2200);
  assert.deepEqual(normalizeCashBooking({ ...base, day: '2026-12-13', kind: 'own' }).priceCents, 16000);
  assert.equal(normalizeCashBooking({ ...base, day: '2026-12-12', kind: 'new' }).ticket, 'representative');
  assert.throws(() => normalizeCashBooking({ ...base, day: '2026-12-12', kind: 'wrong' }), CashBookingError);
});

test('existing cash seats and Stripe seats share the displayed inventory', async () => {
  const { db } = memoryDatabase([{ day: '2026-12-13', ticket: 'representative' }]);
  await createCashBooking(db, { day: '2026-12-12', kind: 'returning', name: 'Karin Schuchna', requestKey: randomUUID() }, 1);
  await createCashBooking(db, { day: '2026-12-13', kind: 'own', name: 'Karin Schuchna', requestKey: randomUUID() }, 1);
  const inventory = await getConstellationAvailability(db);
  assert.deepEqual(inventory['2026-12-12'], { representative: 14, own: 5, total: 19 });
  assert.deepEqual(inventory['2026-12-13'], { representative: 14, own: 4, total: 18 });
});

test('repeated submit does not reserve a second seat and sold-out inventory rejects cash booking', async () => {
  const { db, cash } = memoryDatabase();
  const requestKey = randomUUID();
  const input = { day: '2026-12-12', kind: 'own', name: 'Test Person', requestKey };
  assert.equal((await createCashBooking(db, input, 1)).duplicate, false);
  assert.equal((await createCashBooking(db, input, 1)).duplicate, true);
  assert.equal(cash.length, 1);
  for (let i = 0; i < 4; i++) await createCashBooking(db, { ...input, requestKey: randomUUID() }, 1);
  await assert.rejects(createCashBooking(db, { ...input, requestKey: randomUUID() }, 1),
    error => error instanceof CashBookingError && error.code === 'full');
});
