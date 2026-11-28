import { raunaechteOfferEndsAt } from '../shared/raunaechteOffer.js';

const program = 'raunaechte_welcome_2026_27';
export const raunaechtePayment = Object.freeze({
  sale: { url: 'https://buy.stripe.com/9B628t7VM4q94gXdfV83C1b', id: 'plink_1UfNkYQ90vf7AvfHM52gDiAf', amount: 8800 },
  regular: { url: 'https://buy.stripe.com/6oU6oJekaaOx6p52Bh83C1a', id: 'plink_1UfNa1Q90vf7AvfH0Nr6uMCv', amount: 11100 },
});

export function raunaechteCheckoutFor({ price, payment = raunaechtePayment, now = Date.now() }) {
  const offer = now < raunaechteOfferEndsAt ? payment.sale : payment.regular;
  if (price !== String(offer.amount / 100)) return null;
  try {
    const url = new URL(offer.url);
    if (url.protocol !== 'https:' || !['book.stripe.com', 'buy.stripe.com'].includes(url.hostname)
      || url.username || url.password) return null;
    url.searchParams.delete('prefilled_promo_code');
    return url.href;
  } catch {
    return null;
  }
}

export async function initializeRaunaechteWelcome(db) {
  await db.execute(`CREATE TABLE IF NOT EXISTS raunaechte_deliveries (
    stripe_id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    invoice_url VARCHAR(2048) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    welcome_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    welcome_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    welcome_updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX raunaechte_welcome_queue (welcome_status, welcome_updated_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}

export async function recordRaunaechtePurchase(db, event) {
  const object = event.data?.object;
  if (event.livemode !== true || object?.metadata?.fulfillment !== program) return false;
  const isInvoice = event.type === 'invoice.paid' && object.object === 'invoice';
  const checkoutOffer = Object.values(raunaechtePayment).find(offer => offer.id === object.payment_link);
  const isCheckout = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)
    && object.object === 'checkout.session' && object.mode === 'payment'
    && checkoutOffer;
  if (!isInvoice && !isCheckout) return false;
  if (!isInvoice && object.payment_status !== 'paid') return true;

  const email = (isInvoice ? object.customer_email : object.customer_details?.email)?.trim();
  const amount = isInvoice ? object.amount_paid : object.amount_total;
  const idPattern = isInvoice ? /^in_[a-z0-9]+$/i : /^cs_live_[a-z0-9]+$/i;
  const invoiceUrl = isInvoice ? stripeInvoiceUrl(object.invoice_pdf) : null;
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || !idPattern.test(object.id) || object.currency !== 'eur'
    || (isInvoice ? ![8800, 11100].includes(amount) : amount !== checkoutOffer.amount)
    || (isInvoice && (object.status !== 'paid' || !invoiceUrl))) {
    console.error('Raunächte: paid checkout needs review', event.id);
    throw new Error('raunaechte_invalid_paid_checkout');
  }

  await db.execute(`INSERT INTO raunaechte_deliveries (stripe_id, email, invoice_url) VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE stripe_id = stripe_id`, [object.id, email, invoiceUrl]);
  return true;
}

function stripeInvoiceUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password
      && ['pay.stripe.com', 'invoice.stripe.com'].includes(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
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

Dein Workbook und die Zoom-Informationen schicken wir dir vor der Eröffnung. Vom 25. Dezember bis zum 5. Januar bekommst du die Meditation und den Impuls für die jeweilige Nacht an diese E-Mail-Adresse. Deine Rechnung bekommst du in einer separaten E-Mail.

Wenn du vorab etwas fragen möchtest, antworte einfach auf diese E-Mail. Wir freuen uns, dich durch diese Zeit zu begleiten.

Von Herzen
Selcan & Sabine · Spirit Healing`,
  };
}

function raunaechteInvoiceCopy(invoiceUrl) {
  return {
    subject: 'Deine Rechnung für die Raunächte 2026/27',
    text: 'Vielen Dank für deine Buchung bei Spirit Healing. Deine Zahlung für die Raunächte-Begleitung ist eingegangen. Über diesen Link kannst du deine Rechnung als PDF herunterladen.\n\nVon Herzen\nSelcan & Sabine · Spirit Healing',
    invoiceUrl,
  };
}

export async function deliverRaunaechteWelcomes(db, sendMail) {
  const [rows] = await db.execute(`SELECT stripe_id, email, invoice_url, welcome_attempts
    FROM raunaechte_deliveries
    WHERE welcome_status = 'pending'
      AND (welcome_attempts = 0 OR welcome_updated_at < CURRENT_TIMESTAMP - INTERVAL 2 MINUTE)
    ORDER BY created_at LIMIT 8`);
  for (const row of rows) {
    const id = row.stripe_id;
    const [claim] = await db.execute(`UPDATE raunaechte_deliveries
      SET welcome_status = 'sending', welcome_attempts = welcome_attempts + 1
      WHERE stripe_id = ? AND welcome_status = 'pending' AND welcome_attempts = ?`,
    [id, row.welcome_attempts]);
    if (claim.affectedRows !== 1) continue;

    let status = 'sent';
    try {
      const copy = row.invoice_url ? raunaechteInvoiceCopy(row.invoice_url) : raunaechteWelcomeCopy();
      await sendMail({ ...copy, email: row.email, messageId: `<raunaechte-${id}@spirit-healing.tr>` });
    } catch (error) {
      // Retry only failures known to precede handoff. An ambiguous SMTP result must not produce a duplicate.
      const preHandoff = ['CONN', 'EHLO', 'AUTH', 'MAIL FROM', 'RCPT TO'].includes(error?.command);
      status = preHandoff && row.welcome_attempts < 3 ? 'pending' : 'needs_review';
      console.error('Raunächte: welcome delivery delayed or needs review', id, status);
    }
    await db.execute('UPDATE raunaechte_deliveries SET welcome_status = ? WHERE stripe_id = ?', [status, id]);
  }
}

export function startRaunaechteWelcomeWorker(db, sendMail) {
  let running = false;
  const timer = setInterval(async () => {
    if (running) return;
    running = true;
    try {
      await deliverRaunaechteWelcomes(db, sendMail);
      const [stalled] = await db.execute(`UPDATE raunaechte_deliveries
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
