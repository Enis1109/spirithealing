import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { database, initializeDatabase } from "./server/database.js";
import { sendContactNotification, sendEventNotification } from "./server/mailer.js";
import {
    confirmNewsletterSubscription,
    registerNewsletterInterest,
    unsubscribeFromNewsletter,
} from "./server/newsletter.js";
import {
    ValidationError,
    validateContact,
    validateEventRegistration,
} from "./server/validation.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const productionOrigin = new URL(process.env.PUBLIC_BASE_URL || "https://www.spirit-healing.tr").origin;
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const distDirectory = path.join(currentDirectory, "dist");
const privacyConsentVersion = "privacy-2026-07";

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((request, response, next) => {
    response.set({
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    });
    next();
});
app.use(express.json({ limit: "16kb", type: "application/json" }));

const submissionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { ok: false, error: "rate_limit" },
});

const sameOriginOnly = (request, response, next) => {
    const origin = request.get("origin");
    if (!origin || origin === productionOrigin || /^http:\/\/127\.0\.0\.1:\d+$/u.test(origin) || /^http:\/\/localhost:\d+$/u.test(origin)) {
        return next();
    }
    return response.status(403).json({ ok: false, error: "origin" });
};

const updateNotificationStatus = async (table, id, status) => {
    const allowedTables = new Set(["contact_submissions", "event_registrations"]);
    if (!allowedTables.has(table)) return;
    await database.execute(`UPDATE ${table} SET notification_status = ? WHERE id = ?`, [status, id]);
};

app.post("/api/contact", submissionLimiter, sameOriginOnly, async (request, response) => {
    try {
        const form = validateContact(request.body);
        let newsletterStatus = form.newsletterConsent ? "pending" : "not_requested";

        const [result] = await database.execute(
            `INSERT INTO contact_submissions (
                name, email, phone, topic, message, locale, privacy_consent_version,
                newsletter_requested, newsletter_status, notification_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                form.name,
                form.email,
                form.phone,
                form.topic,
                form.message,
                form.locale,
                privacyConsentVersion,
                form.newsletterConsent ? 1 : 0,
                newsletterStatus,
            ],
        );

        if (form.newsletterConsent) {
            try {
                newsletterStatus = await registerNewsletterInterest({
                    name: form.name,
                    email: form.email,
                    locale: form.locale,
                    source: "contact_form",
                });
            } catch (error) {
                console.error("Newsletter confirmation could not be prepared", error);
                newsletterStatus = "confirmation_failed";
            }
            await database.execute(
                "UPDATE contact_submissions SET newsletter_status = ? WHERE id = ?",
                [newsletterStatus, result.insertId],
            );
        }

        try {
            await sendContactNotification({ id: result.insertId, ...form });
            await updateNotificationStatus("contact_submissions", result.insertId, "sent");
        } catch (error) {
            console.error("Contact notification could not be sent", error);
            await updateNotificationStatus("contact_submissions", result.insertId, "failed");
        }

        return response.status(201).json({ ok: true, newsletterStatus });
    } catch (error) {
        if (error instanceof ValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Contact submission failed", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/event-registration", submissionLimiter, sameOriginOnly, async (request, response) => {
    try {
        const form = validateEventRegistration(request.body);
        let newsletterStatus = form.newsletterConsent ? "pending" : "not_requested";

        await database.execute(
            `INSERT INTO event_registrations (
                event_key, name, email, locale, privacy_consent_version,
                newsletter_requested, newsletter_status, notification_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                locale = VALUES(locale),
                privacy_consent_version = VALUES(privacy_consent_version),
                privacy_consent_at = NOW(),
                newsletter_requested = VALUES(newsletter_requested),
                newsletter_status = VALUES(newsletter_status),
                notification_status = 'pending'`,
            [
                form.eventKey,
                form.name,
                form.email,
                form.locale,
                privacyConsentVersion,
                form.newsletterConsent ? 1 : 0,
                newsletterStatus,
            ],
        );

        const [registrationRows] = await database.execute(
            "SELECT id FROM event_registrations WHERE event_key = ? AND email = ? LIMIT 1",
            [form.eventKey, form.email],
        );
        const registrationId = registrationRows[0].id;

        if (form.newsletterConsent) {
            try {
                newsletterStatus = await registerNewsletterInterest({
                    name: form.name,
                    email: form.email,
                    locale: form.locale,
                    source: `event:${form.eventKey}`,
                });
            } catch (error) {
                console.error("Newsletter confirmation could not be prepared", error);
                newsletterStatus = "confirmation_failed";
            }
            await database.execute(
                "UPDATE event_registrations SET newsletter_status = ? WHERE id = ?",
                [newsletterStatus, registrationId],
            );
        }

        try {
            await sendEventNotification({ id: registrationId, ...form });
            await updateNotificationStatus("event_registrations", registrationId, "sent");
        } catch (error) {
            console.error("Event notification could not be sent", error);
            await updateNotificationStatus("event_registrations", registrationId, "failed");
        }

        return response.status(201).json({ ok: true, newsletterStatus });
    } catch (error) {
        if (error instanceof ValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Event registration failed", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/newsletter/confirm", async (request, response) => {
    try {
        const confirmed = await confirmNewsletterSubscription(String(request.query.token || ""));
        return response.redirect(303, `/newsletter/status?state=${confirmed ? "confirmed" : "invalid"}`);
    } catch (error) {
        console.error("Newsletter confirmation failed", error);
        return response.redirect(303, "/newsletter/status?state=error");
    }
});

app.get("/api/newsletter/unsubscribe", async (request, response) => {
    try {
        const unsubscribed = await unsubscribeFromNewsletter(String(request.query.token || ""));
        return response.redirect(303, `/newsletter/status?state=${unsubscribed ? "unsubscribed" : "invalid"}`);
    } catch (error) {
        console.error("Newsletter unsubscribe failed", error);
        return response.redirect(303, "/newsletter/status?state=error");
    }
});

app.get("/api/health", async (_request, response) => {
    try {
        await database.query("SELECT 1");
        return response.json({ ok: true });
    } catch {
        return response.status(503).json({ ok: false });
    }
});

app.use(express.static(distDirectory, {
    index: false,
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
}));

app.use((request, response, next) => {
    if (request.method !== "GET" || request.path.startsWith("/api/")) return next();
    return response.sendFile(path.join(distDirectory, "index.html"));
});

app.use((_request, response) => response.status(404).json({ ok: false, error: "not_found" }));

await initializeDatabase();
app.listen(port, () => {
    console.log(`Spirit Healing server listening on port ${port}`);
});
