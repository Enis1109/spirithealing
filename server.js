import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { database, initializeDatabase } from "./server/database.js";
import { sendContactNotification, sendMemberAccessEmail, sendMemberPasswordResetEmail } from "./server/mailer.js";
import {
    activateMemberAccess,
    authenticateMember,
    clearMemberSessionCookie,
    createMemberAccessRequest,
    createMemberPasswordReset,
    createMemberRegistration,
    endMemberSession,
    getMemberContentState,
    getMemberFromRequest,
    resetMemberPassword,
    setMemberSessionCookie,
    updateMemberContentState,
} from "./server/members.js";
import {
    acceptNewsletterOffer,
    confirmNewsletterSubscription,
    createNewsletterOfferUrl,
    registerNewsletterInterest,
    unsubscribeFromNewsletter,
} from "./server/newsletter.js";
import { prepareMemberMeditations, prepareMemberRecording, prepareMemberWorkbook } from "./server/recording.js";
import {
    getFunnelSummary,
    normalizeAttribution,
    normalizeFunnelEvent,
    recordFunnelEvent,
} from "./server/funnel.js";
import {
    ValidationError,
    validateContact,
    validateMemberAccess,
    validateMemberLogin,
    validateMemberPasswordRequest,
    validateMemberPasswordReset,
    validateMemberRegistration,
} from "./server/validation.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const productionOrigin = new URL(process.env.PUBLIC_BASE_URL || "https://www.spirit-healing.tr").origin;
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const distDirectory = path.join(currentDirectory, "dist");
const privacyConsentVersion = "privacy-2026-07";
const memberPrivacyConsentVersion = "members-privacy-2026-07";
let memberRecordingPath = "";
let memberRecordingEmbedUrl = "";
let memberWorkbookPath = "";
let memberLoslassenPath = "";
let memberWiedergeburtPath = "";
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

app.get("/robots.txt", (_request, response) => {
    response.type("text/plain").sendFile(path.join(currentDirectory, "public", "robots.txt"));
});

app.get("/sitemap.xml", (_request, response) => {
    response.type("application/xml").sendFile(path.join(currentDirectory, "public", "sitemap.xml"));
});

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

const authenticationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 12,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { ok: false, error: "rate_limit" },
});

const analyticsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { ok: false, error: "rate_limit" },
});

const sameOriginOnly = (request, response, next) => {
    const origin = request.get("origin");
    if (!origin || origin.replace("://www.", "://") === productionOrigin.replace("://www.", "://") || /^http:\/\/127\.0\.0\.1:\d+$/u.test(origin) || /^http:\/\/localhost:\d+$/u.test(origin)) {
        return next();
    }
    return response.status(403).json({ ok: false, error: "origin" });
};

const updateNotificationStatus = async (table, id, status) => {
    const allowedTables = new Set(["contact_submissions", "event_registrations"]);
    if (!allowedTables.has(table)) return;
    await database.execute(`UPDATE ${table} SET notification_status = ? WHERE id = ?`, [status, id]);
};

const protectedFileIsAvailable = async (filePath) => {
    if (!filePath) return false;
    try {
        const fileInfo = await fsPromises.stat(filePath);
        return fileInfo.isFile();
    } catch {
        return false;
    }
};

const normalizeRecordingEmbedUrl = (value) => {
    if (!value) return "";
    try {
        const url = new URL(value);
        const hostname = url.hostname.toLowerCase();
        const allowed = hostname === "www.youtube-nocookie.com"
            || hostname === "www.youtube.com"
            || hostname === "player.vimeo.com"
            || hostname === "iframe.mediadelivery.net"
            || hostname === "iframe.videodelivery.net"
            || hostname.endsWith(".cloudflarestream.com");
        return url.protocol === "https:" && allowed ? url.toString() : "";
    } catch {
        return "";
    }
};

const defaultMemberRecordingEmbedUrl = "https://player.vimeo.com/video/1214049496";
const normalizePremiumCheckoutUrl = (value) => {
    if (!value) return "";
    try {
        const url = new URL(value);
        return url.protocol === "https:" && url.hostname === "buy.stripe.com" ? url.toString() : "";
    } catch {
        return "";
    }
};
const memberPremiumCheckoutUrl = normalizePremiumCheckoutUrl(process.env.MEMBER_PREMIUM_CHECKOUT_URL);

const recordingIsAvailable = () => memberRecordingEmbedUrl
    ? Promise.resolve(true)
    : protectedFileIsAvailable(memberRecordingPath);
const workbookIsAvailable = () => protectedFileIsAvailable(memberWorkbookPath);
const loslassenIsAvailable = () => protectedFileIsAvailable(memberLoslassenPath);
const wiedergeburtIsAvailable = () => protectedFileIsAvailable(memberWiedergeburtPath);

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

app.post("/api/members/register", submissionLimiter, sameOriginOnly, async (request, response) => {
    try {
        const form = validateMemberRegistration(request.body);
        const attribution = normalizeAttribution(form.attribution);
        let newsletterStatus = form.newsletterConsent ? "pending" : "not_requested";
        const accessUrl = await createMemberRegistration({
            ...form,
            attribution,
            privacyConsentVersion: memberPrivacyConsentVersion,
        });

        try {
            await recordFunnelEvent({
                eventName: "registration_created",
                eventKey: "member_registration",
                attribution,
                locale: form.locale,
            });
        } catch (error) {
            console.error("Registration attribution could not be recorded", error);
        }

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
            await sendMemberAccessEmail({ ...form, accessUrl, newsletterOfferUrl });
        } catch (error) {
            console.error("Member registration email could not be sent", error);
            return response.status(502).json({ ok: false, error: "email_delivery" });
        }

        return response.status(201).json({ ok: true, newsletterStatus });
    } catch (error) {
        if (error instanceof ValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Member registration failed", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/members/login", authenticationLimiter, sameOriginOnly, async (request, response) => {
    try {
        const credentials = validateMemberLogin(request.body);
        const access = await authenticateMember(credentials);
        if (!access) return response.status(401).json({ ok: false, error: "invalid_credentials" });

        setMemberSessionCookie(response, access.sessionToken);
        return response.json({
            ok: true,
            member: { name: access.member.name, email: access.member.email, locale: access.member.locale },
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Member login failed", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/members/password/forgot", authenticationLimiter, sameOriginOnly, async (request, response) => {
    try {
        const form = validateMemberPasswordRequest(request.body);
        const reset = await createMemberPasswordReset(form);
        if (reset) {
            try {
                await sendMemberPasswordResetEmail({
                    ...reset.member,
                    resetUrl: reset.resetUrl,
                });
            } catch (error) {
                console.error("Member password reset email could not be sent", error);
            }
        }

        return response.status(202).json({ ok: true });
    } catch (error) {
        if (error instanceof ValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Member password reset request failed", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/members/password/reset", authenticationLimiter, sameOriginOnly, async (request, response) => {
    try {
        const form = validateMemberPasswordReset(request.body);
        const updated = await resetMemberPassword(form);
        if (!updated) return response.status(400).json({ ok: false, error: "invalid_reset_token" });
        return response.json({ ok: true });
    } catch (error) {
        if (error instanceof ValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Member password reset failed", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/members/request-access", submissionLimiter, sameOriginOnly, async (request, response) => {
    try {
        const form = validateMemberAccess(request.body);
        const attribution = normalizeAttribution(form.attribution);
        let newsletterStatus = form.newsletterConsent ? "pending" : "not_requested";
        const accessUrl = await createMemberAccessRequest({
            ...form,
            attribution,
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

        try {
            await recordFunnelEvent({
                eventName: "registration_activated",
                eventKey: "member_email_confirmation",
                attribution: {
                    funnelSessionId: access.member.acquisition_session_id,
                    source: access.member.acquisition_source,
                    medium: access.member.acquisition_medium,
                    campaign: access.member.acquisition_campaign,
                    content: access.member.acquisition_content,
                    term: access.member.acquisition_term,
                    landingPath: access.member.acquisition_landing_path,
                    referrerHost: access.member.acquisition_referrer_host,
                },
                locale: access.member.locale,
            });
        } catch (error) {
            console.error("Member activation attribution could not be recorded", error);
        }

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
    const premiumActive = member.membership_tier === "premium"
        && (!member.premium_expires_at || new Date(member.premium_expires_at) > new Date());

    return response.json({
        ok: true,
        member: {
            name: member.name,
            email: member.email,
            locale: member.locale,
            role: member.role,
            membershipTier: premiumActive ? "premium" : "free",
        },
        contentState: await getMemberContentState(member.id),
        premiumCheckoutUrl: memberPremiumCheckoutUrl || null,
        recordingAvailable: await recordingIsAvailable(),
        recordingEmbedUrl: memberRecordingEmbedUrl || null,
        workbookAvailable: await workbookIsAvailable(),
        meditations: {
            loslassenAvailable: await loslassenIsAvailable(),
            wiedergeburtAvailable: await wiedergeburtIsAvailable(),
        },
    });
});

app.post("/api/analytics/funnel", analyticsLimiter, sameOriginOnly, async (request, response) => {
    const event = normalizeFunnelEvent(request.body);
    if (!event) return response.status(400).json({ ok: false, error: "validation" });

    try {
        await recordFunnelEvent(event);
        response.set("Cache-Control", "no-store");
        return response.status(202).json({ ok: true });
    } catch (error) {
        console.error("Funnel event could not be recorded", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/admin/funnel-summary", async (request, response) => {
    const member = await getMemberFromRequest(request);
    response.set("Cache-Control", "no-store");
    if (!member || member.role !== "admin") return response.status(403).json({ ok: false, error: "forbidden" });

    try {
        return response.json({ ok: true, summary: await getFunnelSummary(request.query.days) });
    } catch (error) {
        console.error("Funnel summary could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/members/content-state", sameOriginOnly, async (request, response) => {
    const member = await getMemberFromRequest(request);
    response.set("Cache-Control", "no-store");
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });

    const contentKey = String(request.body?.contentKey || "").trim();
    const favorite = typeof request.body?.favorite === "boolean" ? request.body.favorite : undefined;
    const progress = request.body?.progress === undefined
        ? undefined
        : String(request.body.progress || "").trim();

    try {
        const contentState = await updateMemberContentState({
            memberId: member.id,
            contentKey,
            favorite,
            progress,
        });
        if (!contentState) return response.status(400).json({ ok: false, error: "validation" });
        return response.json({ ok: true, contentState });
    } catch (error) {
        console.error("Member content state could not be updated", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/members/logout", sameOriginOnly, async (request, response) => {
    await endMemberSession(request);
    clearMemberSessionCookie(response);
    return response.json({ ok: true });
});

app.get("/api/members/recording", async (request, response) => {
    const member = await getMemberFromRequest(request);
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });
    if (memberRecordingEmbedUrl) {
        return response.status(404).json({ ok: false, error: "external_video_delivery" });
    }
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

app.get("/api/members/workbook", async (request, response) => {
    const member = await getMemberFromRequest(request);
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });
    if (!await workbookIsAvailable()) {
        return response.status(404).json({ ok: false, error: "workbook_processing" });
    }

    const fileInfo = await fsPromises.stat(memberWorkbookPath);
    response.set({
        "Cache-Control": "private, max-age=3600",
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"Spirit-Healing-Workbook-Wer-entscheidet-dein-Leben.pdf\"",
        "Content-Length": String(fileInfo.size),
    });
    return fs.createReadStream(memberWorkbookPath).pipe(response);
});

const streamMemberAudio = async ({ request, response, filePath, filename, available }) => {
    const member = await getMemberFromRequest(request);
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });
    if (!await available()) return response.status(404).json({ ok: false, error: "meditation_processing" });

    const fileInfo = await fsPromises.stat(filePath);
    const range = request.get("range");
    response.set({
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=3600",
        "Content-Type": "audio/mpeg",
        "Content-Disposition": request.query.download === "1" ? `attachment; filename="${filename}"` : "inline",
    });
    if (!range) {
        response.set("Content-Length", String(fileInfo.size));
        return fs.createReadStream(filePath).pipe(response);
    }
    const match = /^bytes=(\d+)-(\d*)$/u.exec(range);
    if (!match) return response.status(416).end();
    const start = Number(match[1]);
    const requestedEnd = match[2] ? Number(match[2]) : fileInfo.size - 1;
    const end = Math.min(requestedEnd, fileInfo.size - 1);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start > end) return response.status(416).end();
    response.status(206).set({
        "Content-Range": `bytes ${start}-${end}/${fileInfo.size}`,
        "Content-Length": String(end - start + 1),
    });
    return fs.createReadStream(filePath, { start, end }).pipe(response);
};

app.get("/api/members/meditations/loslassen", (request, response) => streamMemberAudio({
    request,
    response,
    filePath: memberLoslassenPath,
    filename: "Spirit-Healing-Meditation-Loslassen-und-Reinigen.mp3",
    available: loslassenIsAvailable,
}));

app.get("/api/members/meditations/wiedergeburt", (request, response) => streamMemberAudio({
    request,
    response,
    filePath: memberWiedergeburtPath,
    filename: "Spirit-Healing-Meditation-Wiedergeburt.mp3",
    available: wiedergeburtIsAvailable,
}));

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
    try {
        return response
            .type("html")
            .send(fs.readFileSync(path.join(distDirectory, "index.html"), "utf8"));
    } catch (error) {
        console.error("Frontend index could not be read", error);
        return next(error);
    }
});

app.use((_request, response) => response.status(404).json({ ok: false, error: "not_found" }));

const initializeServices = async () => {
    memberRecordingEmbedUrl = normalizeRecordingEmbedUrl(
        process.env.MEMBER_RECORDING_EMBED_URL || defaultMemberRecordingEmbedUrl,
    );
    if (process.env.MEMBER_RECORDING_EMBED_URL && !memberRecordingEmbedUrl) {
        throw new Error("Invalid MEMBER_RECORDING_EMBED_URL");
    }
    const [recordingPath, workbookPath, meditations] = await Promise.all([
        memberRecordingEmbedUrl ? Promise.resolve("") : prepareMemberRecording(),
        prepareMemberWorkbook(),
        prepareMemberMeditations(),
    ]);
    memberRecordingPath = recordingPath;
    memberWorkbookPath = workbookPath;
    memberLoslassenPath = meditations.loslassen;
    memberWiedergeburtPath = meditations.wiedergeburt;
    await initializeDatabase();
};

startupPromise = initializeServices().catch((error) => {
    startupError = error;
    console.error("Spirit Healing services could not be initialized", error);
});

app.listen(port, () => {
    console.log(`Spirit Healing server listening on port ${port}`);
});
