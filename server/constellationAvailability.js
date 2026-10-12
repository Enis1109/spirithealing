import { createHash } from 'node:crypto';
import { constellationDays, constellationCapacity } from '../src/content/constellationDays.js';

// Verified against Spirit Healing's live links on 12 October 2026: all counts were zero.
// A single representative link serves both prices, so they share the same inventory.
export const constellationLinks = Object.freeze({
  plink_1UPeNeQ90vf7AvfHsFpAw1lp: { day: '2026-12-12', ticket: 'representative' },
  plink_1UPeNqQ90vf7AvfH0HdC2jO1: { day: '2026-12-12', ticket: 'own' },
  plink_1UPeNtQ90vf7AvfHo8ZMkvws: { day: '2026-12-13', ticket: 'representative' },
  plink_1UPeNwQ90vf7AvfHCBTF7dK2: { day: '2026-12-13', ticket: 'own' },
  plink_1UPeNzQ90vf7AvfHRdAtoj4m: { day: '2027-01-30', ticket: 'representative' },
  plink_1UPeO2Q90vf7AvfH1IHjkJ44: { day: '2027-01-30', ticket: 'own' },
  plink_1UPeO4Q90vf7AvfH6XpesMWr: { day: '2027-01-31', ticket: 'representative' },
  plink_1UPeO7Q90vf7AvfHQFRtScds: { day: '2027-01-31', ticket: 'own' },
});

export async function initializeConstellationAvailability(db) {
  await db.execute(`CREATE TABLE IF NOT EXISTS constellation_bookings (
    session_hash CHAR(64) NOT NULL PRIMARY KEY,
    event_date DATE NOT NULL,
    ticket_type VARCHAR(24) NOT NULL,
    completed_at DATETIME NOT NULL,
    INDEX constellation_inventory (event_date, ticket_type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

export function completedConstellationSession(event, expectedLive = true) {
  if (!expectedLive || event?.livemode !== true || event?.type !== 'checkout.session.completed') return null;
  const session = event.data?.object;
  const link = typeof session?.payment_link === 'string' ? session.payment_link : session?.payment_link?.id;
  if (!Object.hasOwn(constellationLinks, link || '') || session?.object !== 'checkout.session'
    || session.mode !== 'payment' || session.status !== 'complete'
    || !/^cs_live_[A-Za-z0-9]+$/.test(session.id || '')
    || !Number.isSafeInteger(event.created) || event.created <= 0) return null;
  // Count completion, including delayed payment methods, exactly as Payment Link limits do.
  return { ...constellationLinks[link], hash: createHash('sha256').update(session.id).digest('hex'),
    completedAt: new Date(event.created * 1000) };
}

export async function recordConstellationBooking(db, event, expectedLive) {
  const booking = completedConstellationSession(event, expectedLive);
  if (!booking) return false;
  await db.execute(`INSERT IGNORE INTO constellation_bookings
    (session_hash, event_date, ticket_type, completed_at) VALUES (?, ?, ?, ?)`,
  [booking.hash, booking.day, booking.ticket, booking.completedAt]);
  return true;
}

export function inventoryFromRows(rows) {
  return Object.fromEntries(constellationDays.map(day => {
    const remaining = ticket => Math.max(0, constellationCapacity[ticket] - Number(
      rows.find(row => String(row.event_date).slice(0, 10) === day.id && row.ticket_type === ticket)?.booked || 0,
    ));
    const representative = remaining('representative'), own = remaining('own');
    return [day.id, { representative, own, total: representative + own }];
  }));
}

export async function getConstellationAvailability(db) {
  const [rows] = await db.execute(`SELECT DATE_FORMAT(event_date, '%Y-%m-%d') AS event_date,
    ticket_type, COUNT(*) AS booked FROM constellation_bookings GROUP BY event_date, ticket_type`);
  return inventoryFromRows(rows);
}
