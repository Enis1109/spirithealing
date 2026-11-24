const program = 'raunaechte_welcome_2026_27';
const offerEnds = Date.parse('2026-11-28T00:00:00+01:00');

export function raunaechteCheckoutFor({ price, paymentLink, promoCode, now = Date.now() }) {
  const inPromotion = now < offerEnds;
  if (price !== (inPromotion ? '88' : '111') || !paymentLink || (inPromotion && !promoCode)) return null;
  try {
    const url = new URL(paymentLink);
    if (url.protocol !== 'https:' || !['book.stripe.com', 'buy.stripe.com'].includes(url.hostname)
      || url.username || url.password) return null;
    url.searchParams.delete('prefilled_promo_code');
    if (inPromotion) url.searchParams.set('prefilled_promo_code', promoCode);
    return url.href;
  } catch {
    return null;
  }
}

export async function initializeRaunaechteWelcome(db) {
  await db.execute(`CREATE TABLE IF NOT EXISTS raunaechte_registrations (
    stripe_session_id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    welcome_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    welcome_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    welcome_updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX raunaechte_welcome_queue (welcome_status, welcome_updated_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}

export async function recordRaunaechtePurchase(db, event) {
  const session = event.data?.object;
  if (event.livemode !== true || session?.metadata?.fulfillment !== program
    || !['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) return false;
  if (session.payment_status !== 'paid') return true;

  const email = session.customer_details?.email?.trim();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || !/^cs_live_[a-z0-9]+$/i.test(session.id) || !/^plink_[a-z0-9]+$/i.test(session.payment_link)
    || session.currency !== 'eur' || ![8800, 11100].includes(session.amount_total)) {
    console.error('Raunächte: paid checkout needs review', event.id);
    throw new Error('raunaechte_invalid_paid_checkout');
  }

  await db.execute(`INSERT INTO raunaechte_registrations (stripe_session_id, email) VALUES (?, ?)
    ON DUPLICATE KEY UPDATE stripe_session_id = stripe_session_id`, [session.id, email]);
  return true;
}

export function raunaechteWelcomeCopy() {
  return {
    subject: 'Von Herzen willkommen zu deinen Raunächten',
    text: `Wie schön, dass du diese zwölf Nächte mit uns verbringst. Deine Buchung ist bestätigt.

Am Mittwoch, 23. Dezember 2026, öffnen wir um 19 Uhr deutscher Zeit gemeinsam den Raum. In der ersten Meditation nehmen wir uns Zeit für das, was du aus diesem Jahr mitbringst, und stimmen uns auf die 13 Wünsche ein. Für den Anfang reichen ein ruhiger Platz, ein Stift und ein wenig Zeit für dich.

Unsere gemeinsamen Abende finden online statt, jeweils um 19 Uhr deutscher Zeit:
23. Dezember · Eröffnung und Meditation
30. Dezember · Zwischenreflexion und Meditation
6. Januar · Abschluss und Meditation

Dein Workbook und die Zoom-Informationen schicken wir dir vor der Eröffnung. Vom 25. Dezember bis zum 5. Januar bekommst du die Meditation und den Impuls für die jeweilige Nacht an diese E-Mail-Adresse. Deine Rechnung kommt separat von Stripe.

Wenn du vorab etwas fragen möchtest, antworte einfach auf diese E-Mail. Wir freuen uns, dich durch diese Zeit zu begleiten.

Von Herzen
Selcan & Sabine · Spirit Healing`,
  };
}

export async function deliverRaunaechteWelcomes(db, sendMail) {
  const [rows] = await db.execute(`SELECT stripe_session_id, email, welcome_attempts
    FROM raunaechte_registrations
    WHERE welcome_status = 'pending'
      AND (welcome_attempts = 0 OR welcome_updated_at < CURRENT_TIMESTAMP - INTERVAL 2 MINUTE)
    ORDER BY created_at LIMIT 8`);
  for (const row of rows) {
    const id = row.stripe_session_id;
    const [claim] = await db.execute(`UPDATE raunaechte_registrations
      SET welcome_status = 'sending', welcome_attempts = welcome_attempts + 1
      WHERE stripe_session_id = ? AND welcome_status = 'pending' AND welcome_attempts = ?`,
    [id, row.welcome_attempts]);
    if (claim.affectedRows !== 1) continue;

    let status = 'sent';
    try {
      await sendMail({ ...raunaechteWelcomeCopy(), email: row.email, messageId: `<raunaechte-${id}@spirit-healing.tr>` });
    } catch (error) {
      // Retry only failures known to precede handoff. An ambiguous SMTP result must not produce a duplicate.
      const preHandoff = ['CONN', 'EHLO', 'AUTH', 'MAIL FROM', 'RCPT TO'].includes(error?.command);
      status = preHandoff && row.welcome_attempts < 3 ? 'pending' : 'needs_review';
      console.error('Raunächte: welcome delivery delayed or needs review', id, status);
    }
    await db.execute('UPDATE raunaechte_registrations SET welcome_status = ? WHERE stripe_session_id = ?', [status, id]);
  }
}

export function startRaunaechteWelcomeWorker(db, sendMail) {
  let running = false;
  const timer = setInterval(async () => {
    if (running) return;
    running = true;
    try {
      await deliverRaunaechteWelcomes(db, sendMail);
      const [stalled] = await db.execute(`UPDATE raunaechte_registrations
        SET welcome_status = 'needs_review'
        WHERE welcome_status = 'sending' AND welcome_updated_at < CURRENT_TIMESTAMP - INTERVAL 5 MINUTE`);
      if (stalled.affectedRows) console.error('Raunächte: interrupted welcome deliveries need review', stalled.affectedRows);
    } catch {
      console.error('Raunächte: welcome queue unavailable');
    } finally {
      running = false;
    }
  }, 15000);
  timer.unref();
}
