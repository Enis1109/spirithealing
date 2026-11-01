import { createHash } from "node:crypto";
import { validateContact, ValidationError } from "./validation.js";

export const contactTransitions = Object.freeze({
    new: ["in_progress", "done"], in_progress: ["new", "done"], done: ["in_progress"],
});
const idPattern = /^[1-9][0-9]{0,15}$/;
const metadata = "id, created_at, request_kind, offer_code, practitioner, locale, notification_status, newsletter_status, COALESCE(processing_status, 'new') AS processing_status, COALESCE(processing_version, 0) AS processing_version";

export function registerContactRoutes(app, { database, submissionLimiter, sameOriginOnly, adminSameOriginOnly,
    getAdminMember, privacyConsentVersion, sendContactNotification, registerNewsletterInterest, recordInquiryMeasurement = async () => {} }) {
    app.post("/api/contact", submissionLimiter, sameOriginOnly, async (request, response) => {
        const savedResponse = (status, data) => {
            const sent = response.status(status).json(data);
            // Operational response never waits for optional measurement. Never pass form fields or database IDs.
            void Promise.resolve().then(() => recordInquiryMeasurement(request.body?.measurement)).catch(() => {});
            return sent;
        };
        response.set("Cache-Control", "no-store");
        let saved = false;
        let newsletterStatus = "not_requested";
        try {
            const form = validateContact(request.body);
            const { requestKey, ...content } = form;
            const hash = createHash("sha256").update(JSON.stringify(content)).digest("hex");
            newsletterStatus = form.newsletterConsent ? "pending" : "not_requested";
            let result;
            try {
                [result] = await database.execute(
                    `INSERT INTO contact_submissions (name, email, phone, topic, message, locale, privacy_consent_version,
                        newsletter_requested, newsletter_status, notification_status, request_kind, offer_code,
                        practitioner, request_key, request_hash, processing_status, processing_version)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, 'new', 0)`,
                    [form.name, form.email, form.phone, form.topic, form.message, form.locale, privacyConsentVersion,
                        form.newsletterConsent ? 1 : 0, newsletterStatus, form.requestKind, form.offerCode,
                        form.practitioner, requestKey, requestKey ? hash : null]);
            } catch (error) {
                if (error.code !== "ER_DUP_ENTRY" || !requestKey) throw error;
                const [rows] = await database.execute(
                    "SELECT request_hash, newsletter_status FROM contact_submissions WHERE request_key = ?", [requestKey]);
                if (!rows[0] || rows[0].request_hash !== hash) return response.status(409).json({ ok: false, error: "request_conflict" });
                return savedResponse(200, { ok: true, newsletterStatus: rows[0].newsletter_status });
            }
            saved = true;
            // Only the successful INSERT owner performs side effects. A replay never sends mail.
            if (form.newsletterConsent) {
                try {
                    newsletterStatus = await registerNewsletterInterest({ name: form.name, email: form.email,
                        locale: form.locale, source: "contact_form" });
                } catch {
                    newsletterStatus = "confirmation_failed";
                }
                try {
                    await database.execute("UPDATE contact_submissions SET newsletter_status = ? WHERE id = ?", [newsletterStatus, result.insertId]);
                } catch { /* The saved request remains visible; no automatic side-effect retries. */ }
            }
            let mailStatus = "sent";
            try { await sendContactNotification({ id: result.insertId, ...form }); }
            catch { mailStatus = "failed"; }
            try {
                await database.execute("UPDATE contact_submissions SET notification_status = ? WHERE id = ?", [mailStatus, result.insertId]);
            } catch { /* pending means the outcome must be checked manually, never re-send blindly. */ }
            return savedResponse(201, { ok: true, newsletterStatus });
        } catch (error) {
            if (saved) return savedResponse(201, { ok: true, newsletterStatus });
            if (error instanceof ValidationError) return response.status(400).json({ ok: false, error: "validation", field: error.field });
            return response.status(500).json({ ok: false, error: "server" });
        }
    });

    app.get("/api/admin/contact-requests", async (request, response) => {
        if (!await getAdminMember(request, response)) return;
        const before = request.query.before;
        if (before != null && (typeof before !== "string" || !idPattern.test(before))) return response.status(400).json({ ok: false, error: "validation" });
        try {
            const [rows] = await database.execute(`SELECT ${metadata} FROM contact_submissions
                ${before ? "WHERE id < ?" : ""} ORDER BY id DESC LIMIT 51`, before ? [before] : []);
            return response.json({ ok: true, requests: rows.slice(0, 50), next: rows.length > 50 ? String(rows[49].id) : null });
        } catch { return response.status(500).json({ ok: false, error: "server" }); }
    });
    app.get("/api/admin/contact-requests/:id", async (request, response) => {
        if (!await getAdminMember(request, response)) return;
        if (!idPattern.test(request.params.id)) return response.status(400).json({ ok: false, error: "validation" });
        try {
            const [rows] = await database.execute(`SELECT ${metadata}, name, email, phone, topic, message,
                privacy_consent_version, privacy_consent_at, newsletter_requested
                FROM contact_submissions WHERE id = ?`, [request.params.id]);
            return rows[0] ? response.json({ ok: true, request: rows[0] }) : response.status(404).json({ ok: false, error: "not_found" });
        } catch { return response.status(500).json({ ok: false, error: "server" }); }
    });
    app.patch("/api/admin/contact-requests/:id", adminSameOriginOnly, async (request, response) => {
        if (!await getAdminMember(request, response)) return;
        const { status, from, version } = request.body ?? {};
        if (!idPattern.test(request.params.id) || !Object.hasOwn(contactTransitions, from ?? "")
            || !contactTransitions[from].includes(status) || !Number.isSafeInteger(version) || version < 0) {
            return response.status(400).json({ ok: false, error: "validation" });
        }
        try {
            const [result] = await database.execute(`UPDATE contact_submissions SET processing_status = ?, processing_version = ?
                WHERE id = ? AND COALESCE(processing_status, 'new') = ? AND COALESCE(processing_version, 0) = ?`,
            [status, version + 1, request.params.id, from, version]);
            return result.affectedRows === 1 ? response.json({ ok: true })
                : response.status(409).json({ ok: false, error: "status_conflict" });
        } catch { return response.status(500).json({ ok: false, error: "server" }); }
    });
}
