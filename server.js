import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { database, initializeDatabase } from "./server/database.js";
import { sendContactNotification, sendMemberAccessEmail } from "./server/mailer.js";
import {
    activateMemberAccess,
    clearMemberSessionCookie,
    createMemberAccessRequest,
    endMemberSession,
    getMemberFromRequest,
    setMemberSessionCookie,
} from "./server/members.js";
import {
    acceptNewsletterOffer,
    confirmNewsletterSubscription,
    createNewsletterOfferUrl,
    registerNewsletterInterest,
    unsubscribeFromNewsletter,
} from "./server/newsletter.js";
import { prepareMemberRecording } from "./server/recording.js";
import { ValidationError, validateContact, validateMemberAccess } from "./server/validation.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const productionOrigin = new URL(process.env.PUBLIC_BASE_URL || "https://www.spirit-healing.tr").origin;
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const distDirectory = path.join(currentDirectory, "dist");
const privacyConsentVersion = "privacy-2026-07";
const memberPrivacyConsentVersion = "members-privacy-2026-07";
let memberRecordingPath = "";
let startupError = null;
let startupPromise = Promise.resolve();

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
app.use("/api", async (_request, response, next) => {
    await startupPromise;
    if (startupError) {
        return response.status(503).json({ ok: false, error: "service_starting" });
    }
    return next();
});

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

const recordingIsAvailable = async () => {
    if (!memberRecordingPath) return false;
    try {
        const fileInfo = await fsPromises.stat(memberRecordingPath);
        return fileInfo.isFile();
    } catch {
        return false;
    }
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

app.post("/api/members/request-access", submissionLimiter, sameOriginOnly, async (request, response) => {
    try {
        const form = validateMemberAccess(request.body);
        let newsletterStatus = form.newsletterConsent ? "pending" : "not_requested";
        const accessUrl = await createMemberAccessRequest({
            ...form,
            privacyConsentVersion: memberPrivacyConsentVersion,
        });

        if (form.newsletterConsent) {
            try {
                newsletterStatus = await registerNewsletterInterest({
                    name: form.name,
                    email: form.email,
                    locale: form.locale,
                    source: "member_registration",
                });
            } catch (error) {
                console.error("Member newsletter confirmation could not be prepared", error);
                newsletterStatus = "confirmation_failed";
            }
        }

        const newsletterOfferUrl = createNewsletterOfferUrl({
            name: form.name,
            email: form.email,
            locale: form.locale,
            source: "member_access_email",
        });

        try {
            await sendMemberAccessEmail({
                ...form,
                accessUrl,
                newsletterOfferUrl,
            });
        } catch (error) {
            console.error("Member access email could not be sent", error);
            return response.status(502).json({ ok: false, error: "email_delivery" });
        }

        return response.status(201).json({ ok: true, newsletterStatus });
    } catch (error) {
        if (error instanceof ValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Member access request failed", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/members/access", async (request, response) => {
    try {
        const access = await activateMemberAccess(String(request.query.token || ""));
        if (!access) return response.redirect(303, "/mitglieder?state=invalid");

        setMemberSessionCookie(response, access.sessionToken);
        return response.redirect(303, "/mitglieder?state=verified");
    } catch (error) {
        console.error("Member access activation failed", error);
        return response.redirect(303, "/mitglieder?state=error");
    }
});

app.get("/api/members/session", async (request, response) => {
    const member = await getMemberFromRequest(request);
    response.set("Cache-Control", "no-store");
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });

    return response.json({
        ok: true,
        member: { name: member.name, email: member.email, locale: member.locale },
        recordingAvailable: await recordingIsAvailable(),
    });
});

app.post("/api/members/logout", sameOriginOnly, async (request, response) => {
    await endMemberSession(request);
    clearMemberSessionCookie(response);
    return response.json({ ok: true });
});

app.get("/api/members/recording", async (request, response) => {
    const member = await getMemberFromRequest(request);
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });
    if (!await recordingIsAvailable()) {
        return response.status(404).json({ ok: false, error: "recording_processing" });
    }

    const fileInfo = await fsPromises.stat(memberRecordingPath);
    const range = request.get("range");
    response.set({
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=3600",
        "Content-Type": "video/mp4",
        "Content-Disposition": "inline",
    });

    if (!range) {
        response.set("Content-Length", String(fileInfo.size));
        return fs.createReadStream(memberRecordingPath).pipe(response);
    }

    const match = /^bytes=(\d+)-(\d*)$/u.exec(range);
    if (!match) return response.status(416).end();
    const start = Number(match[1]);
    const requestedEnd = match[2] ? Number(match[2]) : fileInfo.size - 1;
    const end = Math.min(requestedEnd, fileInfo.size - 1);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start > end) {
        return response.status(416).end();
    }

    response.status(206).set({
        "Content-Range": `bytes ${start}-${end}/${fileInfo.size}`,
        "Content-Length": String(end - start + 1),
    });
    return fs.createReadStream(memberRecordingPath, { start, end }).pipe(response);
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

app.get("/api/newsletter/accept-offer", async (request, response) => {
    try {
        const confirmed = await acceptNewsletterOffer(String(request.query.token || ""));
        return response.redirect(303, `/newsletter/status?state=${confirmed ? "confirmed" : "invalid"}`);
    } catch (error) {
        console.error("Newsletter email offer could not be accepted", error);
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

const initializeServices = async () => {
    memberRecordingPath = await prepareMemberRecording();
    await initializeDatabase();
};

startupPromise = initializeServices().catch((error) => {
    startupError = error;
    console.error("Spirit Healing services could not be initialized", error);
});

app.listen(port, () => {
    console.log(`Spirit Healing server listening on port ${port}`);
});
