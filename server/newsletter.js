import crypto from "node:crypto";
import { database } from "./database.js";
import { sendNewsletterConfirmation } from "./mailer.js";

const consentVersion = "newsletter-2026-07";
const emailOfferConsentVersion = "newsletter-event-email-2026-07";
const confirmationLifetimeHours = 24;
const emailOfferLifetimeDays = 14;
const unsubscribeSecret = process.env.NEWSLETTER_TOKEN_SECRET;

if (!unsubscribeSecret) {
    throw new Error("Missing newsletter configuration: NEWSLETTER_TOKEN_SECRET");
}

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const baseUrl = () => (process.env.PUBLIC_BASE_URL || "https://www.spirit-healing.tr").replace(/\/$/u, "");

const signatureFor = (payload) => crypto
    .createHmac("sha256", unsubscribeSecret)
    .update(payload)
    .digest("base64url");

const hasValidSignature = (payload, providedSignature) => {
    const expectedSignature = signatureFor(payload);
    const expectedBuffer = Buffer.from(expectedSignature);
    const providedBuffer = Buffer.from(providedSignature || "");

    return expectedBuffer.length === providedBuffer.length
        && crypto.timingSafeEqual(expectedBuffer, providedBuffer);
};

export const createUnsubscribeUrl = (email) => {
    const payload = Buffer.from(email, "utf8").toString("base64url");
    return `${baseUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(`${payload}.${signatureFor(payload)}`)}`;
};

export const createNewsletterOfferUrl = ({ name, email, locale, source }) => {
    const payload = Buffer.from(JSON.stringify({
        name,
        email,
        locale,
        source,
        expiresAt: Date.now() + emailOfferLifetimeDays * 24 * 60 * 60 * 1000,
    }), "utf8").toString("base64url");

    return `${baseUrl()}/api/newsletter/accept-offer?token=${encodeURIComponent(`${payload}.${signatureFor(payload)}`)}`;
};

export const registerNewsletterInterest = async ({ name, email, locale, source }) => {
    const [existingRows] = await database.execute(
        "SELECT status FROM newsletter_subscribers WHERE email = ? LIMIT 1",
        [email],
    );

    if (existingRows[0]?.status === "active") return "active";

    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = hashToken(token);

    await database.execute(
        `INSERT INTO newsletter_subscribers (
            name, email, locale, status, source, consent_text_version,
            requested_at, confirmation_token_hash, confirmation_expires_at,
            confirmed_at, unsubscribed_at
        ) VALUES (?, ?, ?, 'pending', ?, ?, UTC_TIMESTAMP(), ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ${confirmationLifetimeHours} HOUR), NULL, NULL)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            locale = VALUES(locale),
            status = 'pending',
            source = VALUES(source),
            consent_text_version = VALUES(consent_text_version),
            requested_at = UTC_TIMESTAMP(),
            confirmation_token_hash = VALUES(confirmation_token_hash),
            confirmation_expires_at = VALUES(confirmation_expires_at),
            confirmed_at = NULL,
            unsubscribed_at = NULL`,
        [name, email, locale, source, consentVersion, tokenHash],
    );

    const confirmationUrl = `${baseUrl()}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
    await sendNewsletterConfirmation({ name, email, locale, confirmationUrl });
    return "pending";
};

export const confirmNewsletterSubscription = async (token) => {
    if (!token || token.length > 128) return false;

    const tokenHash = hashToken(token);
    const [result] = await database.execute(
        `UPDATE newsletter_subscribers
         SET status = 'active', confirmed_at = UTC_TIMESTAMP(), confirmation_token_hash = NULL,
             confirmation_expires_at = NULL, unsubscribed_at = NULL
         WHERE confirmation_token_hash = ? AND status = 'pending'
           AND confirmation_expires_at > UTC_TIMESTAMP()`,
        [tokenHash],
    );

    return result.affectedRows === 1;
};

export const acceptNewsletterOffer = async (token) => {
    if (!token || token.length > 2048) return false;

    const [payload, providedSignature] = token.split(".");
    if (!payload || !hasValidSignature(payload, providedSignature)) return false;

    let offer;
    try {
        offer = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    } catch {
        return false;
    }

    const name = String(offer.name || "").trim();
    const email = String(offer.email || "").trim().toLowerCase();
    const locale = offer.locale === "tr" ? "tr" : "de";
    const source = String(offer.source || "event_email").slice(0, 80);
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email);

    if (!name || name.length > 100 || !validEmail || email.length > 254) return false;
    if (!Number.isFinite(offer.expiresAt) || offer.expiresAt < Date.now()) return false;

    await database.execute(
        `INSERT INTO newsletter_subscribers (
            name, email, locale, status, source, consent_text_version,
            requested_at, confirmation_token_hash, confirmation_expires_at,
            confirmed_at, unsubscribed_at
        ) VALUES (?, ?, ?, 'active', ?, ?, NOW(), NULL, NULL, NOW(), NULL)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            locale = VALUES(locale),
            status = 'active',
            source = VALUES(source),
            consent_text_version = VALUES(consent_text_version),
            requested_at = NOW(),
            confirmation_token_hash = NULL,
            confirmation_expires_at = NULL,
            confirmed_at = NOW(),
            unsubscribed_at = NULL`,
        [name, email, locale, source, emailOfferConsentVersion],
    );

    return true;
};

export const unsubscribeFromNewsletter = async (token) => {
    if (!token || token.length > 512) return false;

    const [payload, providedSignature] = token.split(".");
    if (!payload || !providedSignature) return false;

    if (!hasValidSignature(payload, providedSignature)) return false;

    let email;
    try {
        email = Buffer.from(payload, "base64url").toString("utf8").toLowerCase();
    } catch {
        return false;
    }

    const [result] = await database.execute(
        `UPDATE newsletter_subscribers
         SET status = 'unsubscribed', unsubscribed_at = NOW(), confirmation_token_hash = NULL,
             confirmation_expires_at = NULL
         WHERE email = ? AND status IN ('active', 'pending')`,
        [email],
    );

    return result.affectedRows === 1;
};
