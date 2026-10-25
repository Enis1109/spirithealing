import crypto from "node:crypto";

export class MemberAccessResendError extends Error {
    constructor(code, status = 400) {
        super(code);
        this.code = code;
        this.status = status;
    }
}

export function normalizeAccessResend(body) {
    if (!body || Array.isArray(body) || typeof body !== "object"
        || Object.keys(body).some((key) => key !== "email")
        || typeof body.email !== "string") {
        throw new MemberAccessResendError("validation");
    }
    const email = body.email.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
        throw new MemberAccessResendError("validation");
    }
    return { email };
}

// This is deliberately separate from registration/request-access. The only
// database write is a new access token for an already existing account. In
// particular, no consent timestamp, password, status or enrollment is updated.
export function createMemberAccessResendService({ db, sendEmail, baseUrl,
    tokenFactory = () => crypto.randomBytes(32).toString("base64url"),
    now = () => new Date() }) {
    const accessBase = new URL("/api/members/access", baseUrl);
    if (accessBase.protocol !== "https:" && !(accessBase.protocol === "http:"
        && ["localhost", "127.0.0.1", "[::1]"].includes(accessBase.hostname))) {
        throw new Error("access_email_requires_https");
    }

    return {
        async resend({ actor, email }) {
            if (!actor) throw new MemberAccessResendError("unauthorized", 401);
            if (actor.role !== "admin") throw new MemberAccessResendError("forbidden", 403);
            const normalized = normalizeAccessResend({ email });
            const connection = await db.getConnection();
            let member;
            let token;
            try {
                await connection.beginTransaction();
                const [[account]] = await connection.execute(
                    "SELECT id, name, email, locale, status FROM members WHERE email = ? LIMIT 1 FOR UPDATE",
                    [normalized.email],
                );
                if (!account) throw new MemberAccessResendError("member_not_found", 404);
                if (!["pending", "active"].includes(account.status)) {
                    throw new MemberAccessResendError("account_unavailable", 409);
                }
                member = account;
                // The member-row lock serializes concurrent requests across
                // workers. A recent request is not called a successful delivery.
                const [[recent]] = await connection.execute(
                    `SELECT id FROM member_access_tokens WHERE member_id = ?
                     AND created_at > DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 MINUTE) LIMIT 1`,
                    [member.id],
                );
                if (recent) throw new MemberAccessResendError("recent_access_request", 429);

                // Preserve a password chosen during an unconfirmed registration.
                // The digest stays server-side; the resend does not set it.
                let pendingPasswordHash = null;
                if (member.status === "pending") {
                    const [[pending]] = await connection.execute(
                        `SELECT pending_password_hash FROM member_access_tokens
                         WHERE member_id = ? AND pending_password_hash IS NOT NULL
                         ORDER BY id DESC LIMIT 1`, [member.id],
                    );
                    pendingPasswordHash = pending?.pending_password_hash || null;
                }
                token = tokenFactory();
                await connection.execute(
                    `INSERT INTO member_access_tokens (member_id, token_hash, pending_password_hash, expires_at)
                     VALUES (?, ?, ?, '9999-12-31 23:59:59')`,
                    [member.id, crypto.createHash("sha256").update(token).digest("hex"), pendingPasswordHash],
                );
                await connection.commit();
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }

            // Never return the sign-in link to the admin or log it. SMTP is
            // attempted once, after the token transaction has committed. Keep
            // the token on ambiguous SMTP failure; do not invalidate a possibly
            // delivered link or automatically send another message.
            const accessUrl = new URL(accessBase);
            accessUrl.searchParams.set("token", token);
            let delivery;
            try {
                delivery = await sendEmail({ name: member.name, email: member.email,
                    locale: member.locale, accessUrl: accessUrl.href,
                    newsletterConsent: false, includeNewsletterOffer: false });
            } catch {
                throw new MemberAccessResendError("delivery_unconfirmed", 502);
            }
            if (!delivery?.accepted?.some((address) => String(address).toLowerCase() === member.email.toLowerCase())
                || delivery.rejected?.length) {
                throw new MemberAccessResendError("delivery_unconfirmed", 502);
            }
            return { email: member.email, sentAt: now().toISOString(),
                sender: String(delivery.sender || "").replace(/[\r\n]/gu, "").slice(0, 320) };
        },
    };
}

export function registerMemberAccessResendRoutes(app, { service, getMember, sameOrigin, limiter }) {
    app.post("/api/admin/members/access-email/resend", sameOrigin, limiter, async (request, response) => {
        response.set("Cache-Control", "no-store");
        try {
            const actor = await getMember(request);
            if (!actor) return response.status(401).json({ ok: false, error: "unauthorized" });
            if (actor.role !== "admin") return response.status(403).json({ ok: false, error: "forbidden" });
            const form = normalizeAccessResend(request.body);
            const delivery = await service.resend({ actor, ...form });
            return response.status(201).json({ ok: true, delivery });
        } catch (error) {
            if (error instanceof MemberAccessResendError) {
                if (error.status === 429) response.set("Retry-After", "300");
                return response.status(error.status).json({ ok: false, error: error.code });
            }
            // SMTP errors and links can contain private data. Do not log them.
            console.error("Admin access email resend could not be completed");
            return response.status(500).json({ ok: false, error: "server" });
        }
    });
}
