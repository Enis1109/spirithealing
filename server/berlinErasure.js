import { createHash } from 'node:crypto';

export const berlinErasureSchema = `CREATE TABLE IF NOT EXISTS berlin_measurement_erasures (
  payment_hash CHAR(64) PRIMARY KEY, erased_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL, INDEX berlin_erasures_expiry(expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

export function berlinPaymentHash(id) {
  if (typeof id !== 'string' || !/^pi_[A-Za-z0-9]{1,250}$/.test(id)) throw new TypeError('Invalid payment reference');
  return createHash('sha256').update(`berlin-payment:${id}`).digest('hex');
}

// A pool connection must stay pinned from GET_LOCK through RELEASE_LOCK.
// Both deletion and webhook writes use this lock, including concurrent workers.
export async function withBerlinPaymentLock(db, paymentIntent, task) {
  const hash = berlinPaymentHash(paymentIntent);
  return withBerlinLock(db, `bl26:${hash.slice(0, 58)}`, connection => task(connection, hash));
}

export async function withBerlinLock(db, name, task) {
  const connection = typeof db.getConnection === 'function' ? await db.getConnection() : db;
  let locked = false;
  let discarded = false;
  try {
    const [rows] = await connection.query('SELECT GET_LOCK(?, 5) AS acquired', [name]);
    if (Number(rows[0]?.acquired) !== 1) throw new Error('Berlin payment lock unavailable');
    locked = true;
    return await task(connection);
  } finally {
    try {
      if (locked) {
        try { await connection.query('SELECT RELEASE_LOCK(?) AS released', [name]); }
        catch {
          discarded = true;
          connection.destroy();
          throw new Error('Berlin payment lock release failed');
        }
      }
    } finally { if (connection !== db && !discarded) connection.release(); }
  }
}

export async function berlinPaymentErased(db, hash) {
  const [rows] = await db.execute('SELECT payment_hash FROM berlin_measurement_erasures WHERE payment_hash=? AND expires_at>UTC_TIMESTAMP()', [hash]);
  return rows.length > 0;
}

// This never calls Stripe, changes a booking, or removes accounting records.
// The marker is kept for 90 days after the request; payment replays older than
// 90 days are independently rejected by the webhook's original-time cutoff.
export async function eraseBerlinPayment(db, paymentIntent) {
  return withBerlinPaymentLock(db, paymentIntent, async (connection, hash) => {
    await connection.query('START TRANSACTION');
    try {
      await connection.execute(`INSERT INTO berlin_measurement_erasures (payment_hash,expires_at)
        VALUES (?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 90 DAY))
        ON DUPLICATE KEY UPDATE expires_at=GREATEST(expires_at,VALUES(expires_at))`, [hash]);
      const [result] = await connection.execute('DELETE FROM berlin_payments WHERE payment_intent=?', [paymentIntent]);
      await connection.execute('DELETE FROM berlin_payment_adjustments WHERE payment_intent=?', [paymentIntent]);
      await connection.query('COMMIT');
      return { erased: Number(result.affectedRows), replayBlocked: true };
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    }
  });
}
