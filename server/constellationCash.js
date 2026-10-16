import { constellationCapacity, constellationDays, constellationTicketPrices } from '../src/content/constellationDays.js';

const dayIds = new Set(constellationDays.map(day => day.id));
const ticketKinds = Object.freeze({ returning: 'representative', new: 'representative', own: 'own' });
const clean = value => String(value ?? '').trim();

export class CashBookingError extends Error {
  constructor(code) { super(code); this.code = code; }
}

export function normalizeCashBooking(input) {
  const day = clean(input?.day);
  const kind = clean(input?.kind);
  const name = clean(input?.name).replace(/\s+/gu, ' ');
  const email = clean(input?.email).toLowerCase();
  const note = clean(input?.note);
  const requestKey = clean(input?.requestKey);
  if (!dayIds.has(day) || !Object.hasOwn(ticketKinds, kind)) throw new CashBookingError('selection');
  if (!name || name.length > 100 || email.length > 254 || note.length > 500
    || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email))
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(requestKey)) {
    throw new CashBookingError('fields');
  }
  return { day, kind, ticket: ticketKinds[kind], priceCents: constellationTicketPrices[kind] * 100,
    name, email: email || null, note: note || null, requestKey };
}

export async function createCashBooking(db, input, adminId) {
  const booking = normalizeCashBooking(input);
  if (!Number.isSafeInteger(adminId) || adminId <= 0) throw new CashBookingError('admin');
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [previous] = await connection.execute(
      'SELECT id FROM constellation_cash_bookings WHERE request_key = ? LIMIT 1', [booking.requestKey]);
    if (previous.length) {
      await connection.commit();
      return { id: previous[0].id, duplicate: true };
    }
    const [locks] = await connection.execute(`SELECT event_date FROM constellation_inventory_locks
      WHERE event_date = ? AND ticket_type = ? FOR UPDATE`, [booking.day, booking.ticket]);
    if (locks.length !== 1) throw new CashBookingError('selection');
    const [[paid]] = await connection.execute(`SELECT COUNT(*) AS booked FROM constellation_bookings
      WHERE event_date = ? AND ticket_type = ?`, [booking.day, booking.ticket]);
    const [[cash]] = await connection.execute(`SELECT COUNT(*) AS booked FROM constellation_cash_bookings
      WHERE event_date = ? AND ticket_type = ? AND status = 'reserved'`, [booking.day, booking.ticket]);
    if (Number(paid.booked) + Number(cash.booked) >= constellationCapacity[booking.ticket]) {
      throw new CashBookingError('full');
    }
    const [result] = await connection.execute(`INSERT INTO constellation_cash_bookings
      (request_key, event_date, ticket_type, price_cents, participant_name, participant_email, note, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [booking.requestKey, booking.day, booking.ticket,
      booking.priceCents, booking.name, booking.email, booking.note, adminId]);
    await connection.commit();
    return { id: result.insertId, duplicate: false };
  } catch (error) {
    await connection.rollback();
    if (error?.code === 'ER_DUP_ENTRY') throw new CashBookingError('duplicate');
    throw error;
  } finally { connection.release(); }
}

export async function listCashBookings(db) {
  const [rows] = await db.execute(`SELECT id, DATE_FORMAT(event_date, '%Y-%m-%d') AS day,
    ticket_type AS ticket, price_cents AS priceCents, participant_name AS name,
    participant_email AS email, note, status, payment_status AS paymentStatus, created_at AS createdAt
    FROM constellation_cash_bookings ORDER BY event_date, id`);
  return rows;
}

export async function cancelCashBooking(db, id) {
  if (!Number.isSafeInteger(id) || id <= 0) throw new CashBookingError('selection');
  const [result] = await db.execute(`UPDATE constellation_cash_bookings SET status = 'cancelled'
    WHERE id = ? AND status = 'reserved'`, [id]);
  if (result.affectedRows !== 1) throw new CashBookingError('not_found');
}
