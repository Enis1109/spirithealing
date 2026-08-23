import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { database, initializeDatabase } from "./server/database.js";
import {
    sendContactNotification,
    sendMemberAccessEmail,
    sendMemberPasswordResetEmail,
    sendOnboardingConfirmation,
    sendOnboardingNotification,
    sendZepterBankTransferConfirmation,
} from "./server/mailer.js";
import {
    activateMemberAccess,
    authenticateMember,
    clearMemberSessionCookie,
    createMemberAccessRequest,
    createProgramDirectAccessLink,
    createMemberPasswordReset,
    createMemberRegistration,
    endMemberSession,
    getMemberContentState,
    getMemberFromRequest,
    resetMemberPassword,
    setMemberSessionCookie,
    updateMemberContentState,
} from "./server/members.js";
import { resolveMemberAccessRedirect } from "./server/memberAccessPaths.js";
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
    getAdminContent,
    getPublishedContent,
    publishContentDrafts,
    restoreContentRevision,
    saveContentDrafts,
} from "./server/content.js";
import {
    ContentValidationError,
    normalizeContentDraftItems,
    normalizeContentKeys,
    normalizeRevisionRequest,
} from "./server/contentValidation.js";
import {
    getAdminProgram,
    getMemberProgram,
    getProgramsForMember,
    initializeDefaultPrograms,
    prepareZepterProgramDraft,
    publishProgramWeek,
    saveProgramSettings,
    saveProgramWeekDraft,
    setProgramEnrollment,
    updateProgramTask,
    zepterProgramSlug,
} from "./server/programs.js";
import {
    getProgramAsset,
    getProgramAssetRule,
    ProgramAssetError,
} from "./server/programAssets.js";
import {
    getDatabaseProgramAsset,
    saveDatabaseProgramAsset,
} from "./server/programAssetDatabase.js";
import {
    normalizeProgramEnrollment,
    normalizeProgramSettings,
    normalizeProgramSlug,
    normalizeProgramTaskUpdate,
    normalizeProgramWeek,
    ProgramValidationError,
} from "./server/programValidation.js";
import {
    createOnboardingSubmission,
    getAdminOnboardingSubmissions,
    setOnboardingDeliveryStatus,
    updateOnboardingReview,
} from "./server/onboarding.js";
import {
    normalizeOnboardingReview,
    normalizeOnboardingSubmission,
    OnboardingValidationError,
} from "./server/onboardingValidation.js";
import {
    getAdminScheduleSurvey,
    saveScheduleSurveySubmission,
} from "./server/scheduleSurvey.js";
import {
    normalizeScheduleSurveySubmission,
    ScheduleSurveyValidationError,
} from "./server/scheduleSurveyValidation.js";
import {
    AiCommandCenterExecutionError,
    createAiImageDraft,
    decideAiWorkflowRun,
    getAiGeneratedAssetImage,
    getAiCommandCenterSnapshot,
    saveAiBudgetSettings,
    savePilotWeekAndRun,
    startAiWorkflow,
} from "./server/aiCommandCenter.js";
import {
    AiCommandCenterValidationError,
    normalizeBudgetSettings,
    normalizeImageDraftRequest,
    normalizePilotWeek,
    normalizeRunDecision,
    normalizeWorkflowRequest,
} from "./server/aiCommandCenterValidation.js";
import {
    ValidationError,
    validateContact,
    validateMemberAccess,
    validateMemberLogin,
    validateMemberPasswordRequest,
    validateMemberPasswordReset,
    validateMemberRegistration,
    validateZepterBankTransfer,
} from "./server/validation.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const productionOrigin = new URL(process.env.PUBLIC_BASE_URL || "https://www.spirit-healing.tr").origin;
const zepterLandingOrigins = new Set(
    String(process.env.ZEPTER_LANDING_ORIGINS || "https://spirit-healing-zepter.sschmidt78.chatgpt.site")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => new URL(value).origin),
);
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
let memberIchBinLichtPath = "";
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
app.use(express.json({ limit: "64kb", type: "application/json" }));

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

const adminSameOriginOnly = (request, response, next) => {
    const origin = request.get("origin");
    const normalizedOrigin = String(origin || "").replace("://www.", "://");
    const normalizedProductionOrigin = productionOrigin.replace("://www.", "://");
    const isLocal = /^http:\/\/(127\.0\.0\.1|localhost):\d+$/u.test(origin || "");
    if (origin && (normalizedOrigin === normalizedProductionOrigin || isLocal)) return next();
    return response.status(403).json({ ok: false, error: "origin" });
};

const getAdminMember = async (request, response) => {
    const member = await getMemberFromRequest(request);
    response.set("Cache-Control", "no-store");
    if (!member) {
        response.status(401).json({ ok: false, error: "unauthorized" });
        return null;
    }
    if (member.role !== "admin") {
        response.status(403).json({ ok: false, error: "forbidden" });
        return null;
    }
    return member;
};

const zepterLandingOnly = (request, response, next) => {
    const origin = request.get("origin");
    const isLocal = /^http:\/\/(127\.0\.0\.1|localhost):\d+$/u.test(origin || "");
    if (!origin || (!zepterLandingOrigins.has(origin) && !isLocal)) {
        return response.status(403).json({ ok: false, error: "origin" });
    }

    response.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
    });
    if (request.method === "OPTIONS") return response.status(204).end();
    return next();
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
const ichBinLichtIsAvailable = () => protectedFileIsAvailable(memberIchBinLichtPath);

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

app.options("/api/zepter/bank-transfer", zepterLandingOnly);

app.post("/api/zepter/bank-transfer", submissionLimiter, zepterLandingOnly, async (request, response) => {
    try {
        const form = validateZepterBankTransfer(request.body);
        const paymentDescription = form.paymentPlan === "installments"
            ? "Ratenzahlung – erste Rate 360 €, zweite Rate 360 € nach 30 Tagen"
            : "Einmalzahlung – 690 €";
        const [result] = await database.execute(
            `INSERT INTO contact_submissions (
                name, email, phone, topic, message, locale, privacy_consent_version,
                newsletter_requested, newsletter_status, notification_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'not_requested', 'pending')`,
            [
                form.name,
                form.email,
                form.phone,
                "Zepter – Buchung per Überweisung",
                paymentDescription,
                "de",
                privacyConsentVersion,
            ],
        );

        try {
            await sendZepterBankTransferConfirmation(form);
        } catch (error) {
            console.error("Zepter bank transfer email could not be sent", error);
            await updateNotificationStatus("contact_submissions", result.insertId, "confirmation_failed");
            return response.status(502).json({ ok: false, error: "email_delivery" });
        }

        try {
            await sendContactNotification({
                id: result.insertId,
                name: form.name,
                email: form.email,
                phone: form.phone,
                topic: "Zepter – Buchung per Überweisung",
                message: paymentDescription,
                newsletterConsent: false,
            });
            await updateNotificationStatus("contact_submissions", result.insertId, "sent");
        } catch (error) {
            console.error("Zepter booking notification could not be sent", error);
            await updateNotificationStatus("contact_submissions", result.insertId, "notification_failed");
        }

        return response.status(201).json({ ok: true });
    } catch (error) {
        if (error instanceof ValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Zepter bank transfer booking failed", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/zepter/onboarding", submissionLimiter, sameOriginOnly, async (request, response) => {
    try {
        const form = normalizeOnboardingSubmission(request.body);
        const submission = await createOnboardingSubmission(form);

        try {
            await sendOnboardingConfirmation({ ...form, reference: submission.reference });
            await setOnboardingDeliveryStatus({ id: submission.id, confirmationStatus: "sent" });
        } catch (error) {
            console.error("Onboarding confirmation could not be sent", error);
            await setOnboardingDeliveryStatus({ id: submission.id, confirmationStatus: "failed" });
        }

        try {
            await sendOnboardingNotification({ ...form, reference: submission.reference });
            await setOnboardingDeliveryStatus({ id: submission.id, notificationStatus: "sent" });
        } catch (error) {
            console.error("Onboarding notification could not be sent", error);
            await setOnboardingDeliveryStatus({ id: submission.id, notificationStatus: "failed" });
        }

        return response.status(201).json({ ok: true, reference: submission.reference });
    } catch (error) {
        if (error instanceof OnboardingValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Onboarding submission failed", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/zepter/schedule-survey", submissionLimiter, sameOriginOnly, async (request, response) => {
    try {
        const form = normalizeScheduleSurveySubmission(request.body);
        const submission = await saveScheduleSurveySubmission(form);
        return response.status(submission.updated ? 200 : 201).json({ ok: true, updated: submission.updated });
    } catch (error) {
        if (error instanceof ScheduleSurveyValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Schedule survey submission failed", error);
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
        return response.redirect(303, resolveMemberAccessRedirect(request.query.next));
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
            ichBinLichtAvailable: await ichBinLichtIsAvailable(),
        },
        programs: await getProgramsForMember(member),
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

app.get("/api/content", async (_request, response) => {
    response.set("Cache-Control", "no-store");
    try {
        return response.json({ ok: true, content: await getPublishedContent() });
    } catch (error) {
        console.error("Published content could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/admin/content", async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        return response.json({ ok: true, content: await getAdminContent() });
    } catch (error) {
        console.error("Admin content could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.put("/api/admin/content", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        const items = normalizeContentDraftItems(request.body?.items);
        await saveContentDrafts({ items, memberId: member.id });
        return response.json({ ok: true, content: await getAdminContent() });
    } catch (error) {
        if (error instanceof ContentValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Content draft could not be saved", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/admin/content/publish", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        const keys = normalizeContentKeys(request.body?.keys);
        await publishContentDrafts({ keys, memberId: member.id });
        return response.json({ ok: true, content: await getAdminContent() });
    } catch (error) {
        if (error instanceof ContentValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        if (error?.code === "MISSING_DRAFT") {
            return response.status(409).json({ ok: false, error: "missing_draft" });
        }
        console.error("Content draft could not be published", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/admin/content/restore", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        const revision = normalizeRevisionRequest(request.body);
        const restored = await restoreContentRevision({ ...revision, memberId: member.id });
        if (!restored) return response.status(404).json({ ok: false, error: "not_found" });
        return response.json({ ok: true, content: await getAdminContent() });
    } catch (error) {
        if (error instanceof ContentValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Content revision could not be restored", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

const sendAiExecutionError = (response, error, extra = {}) => {
    if (!(error instanceof AiCommandCenterExecutionError)) return false;
    if (["AI_RUN_BUDGET_EXCEEDED", "AI_MONTHLY_BUDGET_EXCEEDED"].includes(error.code)) {
        response.status(409).json({ ok: false, error: "ai_budget_exceeded", ...extra });
        return true;
    }
    if (["AI_NOT_CONFIGURED", "AI_MODEL_NOT_PRICED", "AI_IMAGE_NOT_CONFIGURED"].includes(error.code)) {
        response.status(503).json({ ok: false, error: "ai_not_configured", ...extra });
        return true;
    }
    if (String(error.code || "").startsWith("AI_PROVIDER_")) {
        response.status(502).json({ ok: false, error: "ai_provider_unavailable", ...extra });
        return true;
    }
    return false;
};

app.get("/api/admin/ai-command-center", async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        return response.json({ ok: true, commandCenter: await getAiCommandCenterSnapshot() });
    } catch (error) {
        console.error("AI command center could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/admin/ai-command-center/pilot-weeks", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        const pilotWeek = normalizePilotWeek(request.body);
        await savePilotWeekAndRun({ pilotWeek, memberId: member.id });
        return response.status(201).json({ ok: true, commandCenter: await getAiCommandCenterSnapshot() });
    } catch (error) {
        if (error instanceof AiCommandCenterValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field, reason: error.reason });
        }
        if (sendAiExecutionError(response, error, { pilotWeekSaved: true })) return undefined;
        console.error("Pilot week could not be saved", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/admin/ai-command-center/runs", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        const { workflowId, contentBrief } = normalizeWorkflowRequest(request.body);
        await startAiWorkflow({ workflowId, contentBrief, memberId: member.id });
        return response.status(201).json({ ok: true, commandCenter: await getAiCommandCenterSnapshot() });
    } catch (error) {
        if (error instanceof AiCommandCenterValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field, reason: error.reason });
        }
        if (error?.code === "PILOT_WEEKS_REQUIRED") {
            return response.status(409).json({ ok: false, error: "pilot_weeks_required" });
        }
        if (sendAiExecutionError(response, error)) return undefined;
        console.error("AI workflow could not be started", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/admin/ai-command-center/runs/:id/image-drafts", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        const sourceRunId = Number(request.params.id);
        if (!Number.isSafeInteger(sourceRunId) || sourceRunId < 1) throw new AiCommandCenterValidationError("id");
        const { briefIndex } = normalizeImageDraftRequest(request.body);
        await createAiImageDraft({ sourceRunId, briefIndex, memberId: member.id });
        return response.status(201).json({ ok: true, commandCenter: await getAiCommandCenterSnapshot() });
    } catch (error) {
        if (error instanceof AiCommandCenterValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field, reason: error.reason });
        }
        if (error instanceof AiCommandCenterExecutionError && ["AI_CONTENT_RUN_INVALID", "AI_CONTENT_APPROVAL_REQUIRED", "AI_IMAGE_BRIEF_MISSING"].includes(error.code)) {
            return response.status(409).json({ ok: false, error: error.code.toLowerCase() });
        }
        if (sendAiExecutionError(response, error)) return undefined;
        console.error("AI image draft could not be generated", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/admin/ai-command-center/assets/:id/image", async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    const assetId = Number(request.params.id);
    if (!Number.isSafeInteger(assetId) || assetId < 1) return response.status(400).end();
    const asset = await getAiGeneratedAssetImage({ assetId });
    if (!asset) return response.status(404).end();
    response.set("Cache-Control", "private, max-age=3600");
    response.type(asset.mimeType);
    return response.send(asset.image);
});

app.put("/api/admin/ai-command-center/runs/:id/decision", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        const runId = Number(request.params.id);
        if (!Number.isSafeInteger(runId) || runId < 1) throw new AiCommandCenterValidationError("id");
        const decision = normalizeRunDecision(request.body);
        const decided = await decideAiWorkflowRun({ runId, ...decision, memberId: member.id });
        if (!decided) return response.status(409).json({ ok: false, error: "already_decided_or_missing" });
        return response.json({ ok: true, commandCenter: await getAiCommandCenterSnapshot() });
    } catch (error) {
        if (error instanceof AiCommandCenterValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field, reason: error.reason });
        }
        console.error("AI workflow decision could not be saved", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.put("/api/admin/ai-command-center/settings", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        const settings = normalizeBudgetSettings(request.body);
        await saveAiBudgetSettings({ ...settings, memberId: member.id });
        return response.json({ ok: true, commandCenter: await getAiCommandCenterSnapshot() });
    } catch (error) {
        if (error instanceof AiCommandCenterValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field, reason: error.reason });
        }
        console.error("AI command center settings could not be saved", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/admin/funnel-summary", async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        return response.json({ ok: true, summary: await getFunnelSummary(request.query.days) });
    } catch (error) {
        console.error("Funnel summary could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/admin/onboarding", async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        return response.json({ ok: true, submissions: await getAdminOnboardingSubmissions() });
    } catch (error) {
        console.error("Admin onboarding submissions could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/admin/schedule-surveys", async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        return response.json({ ok: true, ...(await getAdminScheduleSurvey()) });
    } catch (error) {
        console.error("Admin schedule survey could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.put("/api/admin/onboarding/:id", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;

    try {
        const id = Number(request.params.id);
        if (!Number.isSafeInteger(id) || id < 1) throw new OnboardingValidationError("id");
        const review = normalizeOnboardingReview(request.body);
        const updated = await updateOnboardingReview({ id, ...review, memberId: member.id });
        if (!updated) return response.status(404).json({ ok: false, error: "not_found" });
        return response.json({ ok: true, submissions: await getAdminOnboardingSubmissions() });
    } catch (error) {
        if (error instanceof OnboardingValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Onboarding review could not be updated", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/members/programs/:slug", async (request, response) => {
    const member = await getMemberFromRequest(request);
    response.set("Cache-Control", "no-store");
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });

    try {
        const slug = normalizeProgramSlug(request.params.slug);
        const program = await getMemberProgram({ slug, member });
        if (program === false) return response.status(403).json({ ok: false, error: "forbidden" });
        if (!program) return response.status(404).json({ ok: false, error: "not_found" });
        return response.json({ ok: true, program });
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Member program could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/members/programs/:slug/assets/:weekNumber/:kind", async (request, response) => {
    const member = await getMemberFromRequest(request);
    response.set("Cache-Control", "private, max-age=3600");
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });

    try {
        const slug = normalizeProgramSlug(request.params.slug);
        const weekNumber = Number(request.params.weekNumber);
        const kind = String(request.params.kind || "");
        if (!Number.isSafeInteger(weekNumber) || weekNumber < 1 || !getProgramAssetRule(kind)) {
            throw new ProgramValidationError("asset");
        }
        const program = await getMemberProgram({ slug, member });
        if (program === false) return response.status(403).json({ ok: false, error: "forbidden" });
        if (!program) return response.status(404).json({ ok: false, error: "not_found" });
        const week = program.weeks.find((item) => item.weekNumber === weekNumber);
        if (!week || week.locked) return response.status(403).json({ ok: false, error: "locked" });

        const asset = await getDatabaseProgramAsset({ slug, weekNumber, kind, databaseClient: database })
            || await getProgramAsset({ slug, weekNumber, kind });
        if (!asset) return response.status(404).json({ ok: false, error: "asset_processing" });
        const disposition = `${asset.disposition}; filename="${asset.downloadName}"`;
        response.set({
            "Accept-Ranges": getProgramAssetRule(kind)?.rangeRequests ? "bytes" : "none",
            "Content-Type": asset.contentType,
            "Content-Disposition": disposition,
        });

        const range = getProgramAssetRule(kind)?.rangeRequests ? request.get("range") : "";
        if (!range) {
            response.set("Content-Length", String(asset.size));
            if (asset.buffer) return response.end(asset.buffer);
            return fs.createReadStream(asset.path).pipe(response);
        }
        const match = /^bytes=(\d+)-(\d*)$/u.exec(range);
        if (!match) return response.status(416).end();
        const start = Number(match[1]);
        const requestedEnd = match[2] ? Number(match[2]) : asset.size - 1;
        const end = Math.min(requestedEnd, asset.size - 1);
        if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start > end) {
            return response.status(416).end();
        }
        response.status(206).set({
            "Content-Range": `bytes ${start}-${end}/${asset.size}`,
            "Content-Length": String(end - start + 1),
        });
        if (asset.buffer) return response.end(asset.buffer.subarray(start, end + 1));
        return fs.createReadStream(asset.path, { start, end }).pipe(response);
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Program asset could not be delivered", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/members/programs/:slug/tasks", sameOriginOnly, async (request, response) => {
    const member = await getMemberFromRequest(request);
    response.set("Cache-Control", "no-store");
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });

    try {
        const slug = normalizeProgramSlug(request.params.slug);
        const task = normalizeProgramTaskUpdate(request.body);
        const program = await updateProgramTask({ slug, member, ...task });
        if (program === null) return response.status(404).json({ ok: false, error: "not_found" });
        if (program === false) return response.status(403).json({ ok: false, error: "forbidden" });
        return response.json({ ok: true, program });
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Program task could not be updated", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.get("/api/admin/programs/:slug", async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;
    try {
        const slug = normalizeProgramSlug(request.params.slug);
        const program = await getAdminProgram(slug);
        if (!program) return response.status(404).json({ ok: false, error: "not_found" });
        return response.json({ ok: true, program });
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Admin program could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/admin/programs/:slug/prepare", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;
    try {
        const slug = normalizeProgramSlug(request.params.slug);
        if (slug !== "zepter-acht-wochen") return response.status(404).json({ ok: false, error: "not_found" });
        const prepared = await prepareZepterProgramDraft();
        if (!prepared) return response.status(404).json({ ok: false, error: "not_found" });
        return response.json({ ok: true, program: await getAdminProgram(slug) });
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Zepter program draft could not be prepared", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.put(
    "/api/admin/programs/:slug/weeks/:weekNumber/assets/:kind",
    adminSameOriginOnly,
    express.raw({ type: ["application/pdf", "audio/*", "image/jpeg", "image/png", "image/webp"], limit: "80mb" }),
    async (request, response) => {
        const member = await getAdminMember(request, response);
        if (!member) return undefined;
        try {
            const slug = normalizeProgramSlug(request.params.slug);
            const weekNumber = Number(request.params.weekNumber);
            const kind = String(request.params.kind || "");
            if (!Number.isSafeInteger(weekNumber) || weekNumber < 1 || !getProgramAssetRule(kind)) {
                throw new ProgramValidationError("asset");
            }
            const program = await getAdminProgram(slug);
            if (!program?.weeks.some((week) => week.weekNumber === weekNumber)) {
                return response.status(404).json({ ok: false, error: "not_found" });
            }
            const asset = await saveDatabaseProgramAsset({
                slug,
                weekNumber,
                kind,
                contentType: String(request.get("content-type") || "").split(";", 1)[0].toLowerCase(),
                buffer: request.body,
                databaseClient: database,
            });
            if (!asset) return response.status(404).json({ ok: false, error: "not_found" });
            return response.status(201).json({ ok: true, asset: { url: asset.url, size: asset.size } });
        } catch (error) {
            if (error instanceof ProgramValidationError) {
                return response.status(400).json({ ok: false, error: "validation", field: error.field });
            }
            if (error instanceof ProgramAssetError) {
                const status = error.code === "asset_too_large" ? 413 : 400;
                return response.status(status).json({ ok: false, error: error.code });
            }
            console.error("Program asset could not be uploaded", error);
            return response.status(500).json({ ok: false, error: "server" });
        }
    },
);

app.put("/api/admin/programs/:slug", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;
    try {
        const slug = normalizeProgramSlug(request.params.slug);
        const settings = normalizeProgramSettings(request.body);
        if (!await saveProgramSettings({ slug, settings })) {
            return response.status(404).json({ ok: false, error: "not_found" });
        }
        return response.json({ ok: true, program: await getAdminProgram(slug) });
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Program settings could not be saved", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.put("/api/admin/programs/:slug/weeks/:weekNumber", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;
    try {
        const slug = normalizeProgramSlug(request.params.slug);
        const week = normalizeProgramWeek(request.body, request.params.weekNumber);
        if (!await saveProgramWeekDraft({ slug, week })) {
            return response.status(404).json({ ok: false, error: "not_found" });
        }
        return response.json({ ok: true, program: await getAdminProgram(slug) });
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Program week draft could not be saved", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/admin/programs/:slug/weeks/:weekNumber/publish", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;
    try {
        const slug = normalizeProgramSlug(request.params.slug);
        const weekNumber = Number(request.params.weekNumber);
        if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 24) {
            throw new ProgramValidationError("weekNumber");
        }
        if (!await publishProgramWeek({ slug, weekNumber, memberId: member.id })) {
            return response.status(404).json({ ok: false, error: "not_found" });
        }
        return response.json({ ok: true, program: await getAdminProgram(slug) });
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Program week could not be published", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.put("/api/admin/programs/:slug/enrollments", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;
    try {
        const slug = normalizeProgramSlug(request.params.slug);
        const enrollment = normalizeProgramEnrollment(request.body);
        const updated = await setProgramEnrollment({ slug, ...enrollment, memberId: member.id });
        if (updated === null) return response.status(404).json({ ok: false, error: "not_found" });
        if (updated === false) return response.status(404).json({ ok: false, error: "member_not_found" });
        return response.json({ ok: true, program: await getAdminProgram(slug) });
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Program enrollment could not be updated", error);
        return response.status(500).json({ ok: false, error: "server" });
    }
});

app.post("/api/admin/programs/:slug/direct-access", adminSameOriginOnly, async (request, response) => {
    const member = await getAdminMember(request, response);
    if (!member) return undefined;
    try {
        const slug = normalizeProgramSlug(request.params.slug);
        const { email } = normalizeProgramEnrollment({ email: request.body?.email, active: true });
        const accessUrl = await createProgramDirectAccessLink({ email, slug });
        if (!accessUrl) return response.status(404).json({ ok: false, error: "active_enrollment_not_found" });
        response.set("Cache-Control", "no-store");
        return response.status(201).json({ ok: true, accessUrl });
    } catch (error) {
        if (error instanceof ProgramValidationError) {
            return response.status(400).json({ ok: false, error: "validation", field: error.field });
        }
        console.error("Program direct access link could not be created", error);
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

const streamMemberAudio = async ({ request, response, filePath, filename, available, authorize }) => {
    const member = await getMemberFromRequest(request);
    if (!member) return response.status(401).json({ ok: false, error: "unauthorized" });
    if (authorize && !await authorize(member)) return response.status(403).json({ ok: false, error: "forbidden" });
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

app.get("/api/members/meditations/ich-bin-licht", (request, response) => streamMemberAudio({
    request,
    response,
    filePath: memberIchBinLichtPath,
    filename: "Spirit-Healing-Meditation-Ich-bin-Licht.mp3",
    available: ichBinLichtIsAvailable,
    authorize: async (member) => Boolean(await getMemberProgram({ slug: zepterProgramSlug, member })),
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

app.get("/", (request, response, next) => {
    const source = String(request.query.utm_source || "").trim().toLowerCase();
    const content = String(request.query.utm_content || "").trim().toLowerCase();
    if (!["ig", "instagram"].includes(source) || content !== "link_in_bio") return next();

    const campaignParams = new URLSearchParams();
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
        const value = String(request.query[key] || "").trim();
        if (value) campaignParams.set(key, value.slice(0, 120));
    }
    if (!campaignParams.has("utm_campaign")) campaignParams.set("utm_campaign", "free_member_funnel");
    return response.redirect(302, `/gratis-meditationen?${campaignParams.toString()}`);
});

app.use(express.static(distDirectory, {
    index: false,
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
}));

app.use((request, response, next) => {
    if (request.method !== "GET" || request.path.startsWith("/api/")) return next();
    try {
        if (request.path.startsWith("/admin") || request.path.startsWith("/startfragebogen") || request.path.startsWith("/terminumfrage")) {
            response.set("X-Robots-Tag", "noindex, nofollow");
        }
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
    memberIchBinLichtPath = meditations.ichBinLicht;
    await initializeDatabase();
    await initializeDefaultPrograms();
};

startupPromise = initializeServices().catch((error) => {
    startupError = error;
    console.error("Spirit Healing services could not be initialized", error);
});

app.listen(port, () => {
    console.log(`Spirit Healing server listening on port ${port}`);
});
