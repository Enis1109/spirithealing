import crypto from "node:crypto";
import { database } from "./database.js";
import { sendWebinarConfirmation, sendWebinarReminder } from "./mailer.js";
import { registerNewsletterInterest } from "./newsletter.js";
import { buildWebinarSlots, getWebinarAccessState, getWebinarConfig } from "./webinarConfig.js";

const webinarPrivacyConsentVersion = "webinar-privacy-2026-09";
const tokenHash = (token) => crypto.createHash("sha256").update(token).digest("hex");
const toDatabaseDate = (date) => date.toISOString().slice(0, 19).replace("T", " ");
const publicBaseUrl = () => String(
    process.env.PUBLIC_BASE_URL || "https://www.spirit-healing.tr",
).replace(/\/$/u, "");

const getTokenSecret = () => {
    const secret = String(process.env.WEBINAR_TOKEN_SECRET || process.env.NEWSLETTER_TOKEN_SECRET || "");
    if (secret.length < 32) throw new Error("Missing or too short WEBINAR_TOKEN_SECRET");
    return secret;
};

const createAccessToken = ({ id, startsAt }) => {
    const identifier = Number(id).toString(36);
    const payload = `${identifier}:${new Date(startsAt).toISOString()}`;
    const signature = crypto.createHmac("sha256", getTokenSecret()).update(payload).digest("base64url");
    return `${identifier}.${signature}`;
};

const tokenMatches = ({ token, id, startsAt, expectedHash }) => {
    const expectedToken = createAccessToken({ id, startsAt });
    const supplied = Buffer.from(token);
    const expected = Buffer.from(expectedToken);
    return supplied.length === expected.length
        && crypto.timingSafeEqual(supplied, expected)
        && tokenHash(token) === expectedHash;
};

const findAvailableSlot = (slotId, now = new Date()) => {
    const config = getWebinarConfig();
    return buildWebinarSlots({ now, config }).find((slot) => slot.id === slotId) || null;
};

export const getAvailableWebinarSlots = (now = new Date()) => {
    const config = getWebinarConfig();
    return {
        title: config.title,
        timeZone: config.timeZone,
        slots: buildWebinarSlots({ now, config }),
    };
};

export const registerForWebinar = async (form, now = new Date()) => {
    const config = getWebinarConfig();
    const slot = findAvailableSlot(form.slotId, now);
    if (!slot) {
        const error = new Error("Webinar slot is no longer available");
        error.code = "SLOT_UNAVAILABLE";
        throw error;
    }

    const access = getWebinarAccessState({ startsAt: slot.startsAt, now, config });
    const expiresAt = access.closesAt;

    const [registration] = await database.execute(
        `INSERT INTO webinar_registrations (
            event_key, name, email, locale, selected_at, access_token_hash,
            token_expires_at, privacy_consent_version, newsletter_requested,
            newsletter_status, confirmation_status, reminder_status
        ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, 'pending', 'pending')
        ON DUPLICATE KEY UPDATE
            id = LAST_INSERT_ID(id),
            name = VALUES(name),
            locale = VALUES(locale),
            selected_at = VALUES(selected_at),
            access_token_hash = NULL,
            token_expires_at = VALUES(token_expires_at),
            privacy_consent_version = VALUES(privacy_consent_version),
            privacy_consent_at = UTC_TIMESTAMP(),
            newsletter_requested = VALUES(newsletter_requested),
            newsletter_status = VALUES(newsletter_status),
            confirmation_status = 'pending',
            confirmation_sent_at = NULL,
            reminder_status = 'pending',
            reminder_attempts = 0,
            reminder_attempted_at = NULL,
            reminder_sent_at = NULL`,
        [
            config.eventKey,
            form.name,
            form.email,
            form.locale,
            toDatabaseDate(new Date(slot.startsAt)),
            toDatabaseDate(expiresAt),
            webinarPrivacyConsentVersion,
            form.newsletterConsent ? 1 : 0,
            form.newsletterConsent ? "pending" : "not_requested",
        ],
    );
    const registrationId = registration.insertId;
    const token = createAccessToken({ id: registrationId, startsAt: slot.startsAt });
    await database.execute(
        "UPDATE webinar_registrations SET access_token_hash = ? WHERE id = ?",
        [tokenHash(token), registrationId],
    );
    const watchUrl = `${publicBaseUrl()}/vortrag-13-wochen-programm/ansehen?token=${encodeURIComponent(token)}`;

    let newsletterStatus = form.newsletterConsent ? "pending" : "not_requested";
    if (form.newsletterConsent) {
        try {
            newsletterStatus = await registerNewsletterInterest({
                name: form.name,
                email: form.email,
                locale: form.locale,
                source: "webinar_13_wochen_programm",
            });
        } catch (error) {
            console.error("Webinar newsletter confirmation could not be prepared", error);
            newsletterStatus = "confirmation_failed";
        }
        await database.execute(
            `UPDATE webinar_registrations SET newsletter_status = ?
             WHERE event_key = ? AND email = ?`,
            [newsletterStatus, config.eventKey, form.email],
        );
    }

    try {
        await sendWebinarConfirmation({
            name: form.name,
            email: form.email,
            slotLabel: slot.label,
            watchUrl,
        });
        await database.execute(
            `UPDATE webinar_registrations
             SET confirmation_status = 'sent', confirmation_sent_at = UTC_TIMESTAMP()
             WHERE event_key = ? AND email = ?`,
            [config.eventKey, form.email],
        );
    } catch (error) {
        await database.execute(
            `UPDATE webinar_registrations SET confirmation_status = 'failed'
             WHERE event_key = ? AND email = ?`,
            [config.eventKey, form.email],
        );
        error.code = "EMAIL_DELIVERY";
        throw error;
    }

    return { slot, watchUrl, newsletterStatus };
};

export const getWebinarAccess = async (rawToken, now = new Date()) => {
    const config = getWebinarConfig();
    const identifier = rawToken.split(".", 1)[0];
    const registrationId = Number.parseInt(identifier, 36);
    if (!Number.isSafeInteger(registrationId) || registrationId < 1) return null;
    const [rows] = await database.execute(
        `SELECT id, name, access_token_hash,
                DATE_FORMAT(selected_at, '%Y-%m-%dT%H:%i:%s.000Z') AS selected_at_iso
         FROM webinar_registrations
         WHERE event_key = ? AND id = ?
         LIMIT 1`,
        [config.eventKey, registrationId],
    );
    if (rows.length === 0) return null;

    const registration = rows[0];
    const startsAt = new Date(registration.selected_at_iso);
    if (!registration.access_token_hash || !tokenMatches({
        token: rawToken,
        id: registration.id,
        startsAt,
        expectedHash: registration.access_token_hash,
    })) return null;
    const access = getWebinarAccessState({ startsAt, now, config });

    return {
        name: registration.name,
        state: access.state,
        serverNow: now.toISOString(),
        startsAt: startsAt.toISOString(),
        opensAt: access.opensAt.toISOString(),
        closesAt: access.closesAt.toISOString(),
        videoReady: Boolean(config.embedUrl),
        embedUrl: access.state === "open" && config.embedUrl ? config.embedUrl : null,
    };
};

export const getAdminWebinarRegistrations = async () => {
    const config = getWebinarConfig();
    const [rows] = await database.execute(
        `SELECT id, name, email, locale, selected_at, newsletter_requested,
                newsletter_status, confirmation_status, reminder_status, created_at, updated_at
         FROM webinar_registrations
         WHERE event_key = ?
         ORDER BY selected_at ASC, created_at ASC`,
        [config.eventKey],
    );
    return rows;
};

export const processWebinarReminders = async (now = new Date()) => {
    const config = getWebinarConfig();
    const [rows] = await database.execute(
        `SELECT id, name, email,
                DATE_FORMAT(selected_at, '%Y-%m-%dT%H:%i:%s.000Z') AS selected_at_iso,
                access_token_hash
         FROM webinar_registrations
         WHERE event_key = ?
           AND selected_at > DATE_ADD(?, INTERVAL 5 MINUTE)
           AND selected_at <= DATE_ADD(?, INTERVAL 65 MINUTE)
           AND (
               reminder_status = 'pending'
               OR (
                   reminder_status = 'failed'
                   AND reminder_attempts < 3
                   AND reminder_attempted_at < DATE_SUB(?, INTERVAL 5 MINUTE)
               )
           )
         ORDER BY selected_at ASC
         LIMIT 50`,
        [config.eventKey, toDatabaseDate(now), toDatabaseDate(now), toDatabaseDate(now)],
    );

    for (const registration of rows) {
        const [claim] = await database.execute(
            `UPDATE webinar_registrations
             SET reminder_status = 'sending', reminder_attempts = reminder_attempts + 1,
                 reminder_attempted_at = UTC_TIMESTAMP()
             WHERE id = ? AND reminder_status IN ('pending', 'failed')`,
            [registration.id],
        );
        if (claim.affectedRows !== 1) continue;

        const startsAt = new Date(registration.selected_at_iso);
        const token = createAccessToken({ id: registration.id, startsAt });
        if (!registration.access_token_hash || tokenHash(token) !== registration.access_token_hash) {
            await database.execute(
                "UPDATE webinar_registrations SET reminder_status = 'failed' WHERE id = ?",
                [registration.id],
            );
            continue;
        }

        const slotLabel = new Intl.DateTimeFormat("de-DE", {
            timeZone: config.timeZone,
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(startsAt);
        const watchUrl = `${publicBaseUrl()}/vortrag-13-wochen-programm/ansehen?token=${encodeURIComponent(token)}`;

        try {
            await sendWebinarReminder({
                name: registration.name,
                email: registration.email,
                slotLabel: `${slotLabel} Uhr`,
                watchUrl,
            });
            await database.execute(
                `UPDATE webinar_registrations
                 SET reminder_status = 'sent', reminder_sent_at = UTC_TIMESTAMP()
                 WHERE id = ?`,
                [registration.id],
            );
        } catch (error) {
            console.error("Webinar reminder could not be sent", error);
            await database.execute(
                "UPDATE webinar_registrations SET reminder_status = 'failed' WHERE id = ?",
                [registration.id],
            );
        }
    }

    return rows.length;
};

export const startWebinarReminderWorker = () => {
    const run = () => processWebinarReminders().catch((error) => {
        console.error("Webinar reminders could not be processed", error);
    });
    const initialTimer = setTimeout(run, 10_000);
    initialTimer.unref?.();
    const interval = setInterval(run, 60_000);
    interval.unref?.();
};
