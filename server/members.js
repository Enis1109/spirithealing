import crypto from "node:crypto";
import { database } from "./database.js";
import { hashPassword, verifyPassword } from "./passwords.js";

const sessionLifetimeDays = 30;
const sessionCookieName = "spirit_member_session";
const contentProgressStates = new Set(["new", "started", "completed"]);
const ownerEmails = new Set(
    [
        ...String(process.env.MEMBER_ADMIN_EMAILS || "info@spirit-healing.tr,selcan1975@gmx.de").split(","),
        "enisrespondek@icloud.com",
    ]
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
);

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const baseUrl = () => (process.env.PUBLIC_BASE_URL || "https://www.spirit-healing.tr").replace(/\/$/u, "");

const createSession = async (connection, memberId) => {
    const sessionToken = crypto.randomBytes(32).toString("base64url");
    await connection.execute(
        `INSERT INTO member_sessions (member_id, token_hash, expires_at)
         VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ${sessionLifetimeDays} DAY))`,
        [memberId, hashToken(sessionToken)],
    );
    return sessionToken;
};

const readCookie = (request, name) => {
    const header = request.get("cookie") || "";
    const cookie = header.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : "";
};

const resolveRole = (member) => (
    member.role === "admin" || ownerEmails.has(String(member.email || "").toLowerCase())
        ? "admin"
        : "member"
);

export const createMemberAccessRequest = async ({
    name,
    email,
    locale,
    privacyConsentVersion,
    attribution = {},
}) => {
    await database.execute(
        `INSERT INTO members (
            name, email, locale, status, privacy_consent_version, privacy_consent_at,
            acquisition_source, acquisition_medium, acquisition_campaign, acquisition_content,
            acquisition_term, acquisition_landing_path, acquisition_referrer_host, acquisition_session_id
        ) VALUES (?, ?, ?, 'pending', ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            locale = VALUES(locale),
            privacy_consent_version = VALUES(privacy_consent_version),
            privacy_consent_at = NOW(),
            acquisition_source = COALESCE(acquisition_source, VALUES(acquisition_source)),
            acquisition_medium = COALESCE(acquisition_medium, VALUES(acquisition_medium)),
            acquisition_campaign = COALESCE(acquisition_campaign, VALUES(acquisition_campaign)),
            acquisition_content = COALESCE(acquisition_content, VALUES(acquisition_content)),
            acquisition_term = COALESCE(acquisition_term, VALUES(acquisition_term)),
            acquisition_landing_path = COALESCE(acquisition_landing_path, VALUES(acquisition_landing_path)),
            acquisition_referrer_host = COALESCE(acquisition_referrer_host, VALUES(acquisition_referrer_host)),
            acquisition_session_id = COALESCE(acquisition_session_id, VALUES(acquisition_session_id))`,
        [
            name, email, locale, privacyConsentVersion,
            attribution.source, attribution.medium, attribution.campaign, attribution.content,
            attribution.term, attribution.landingPath, attribution.referrerHost, attribution.funnelSessionId,
        ],
    );

    const [memberRows] = await database.execute(
        "SELECT id FROM members WHERE email = ? LIMIT 1",
        [email],
    );
    const memberId = memberRows[0].id;
    const token = crypto.randomBytes(32).toString("base64url");

    await database.execute(
        `INSERT INTO member_access_tokens (member_id, token_hash, expires_at)
         VALUES (?, ?, '9999-12-31 23:59:59')`,
        [memberId, hashToken(token)],
    );

    return `${baseUrl()}/api/members/access?token=${encodeURIComponent(token)}`;
};

export const createMemberRegistration = async ({
    name,
    email,
    password,
    locale,
    privacyConsentVersion,
    attribution = {},
}) => {
    const pendingPasswordHash = await hashPassword(password);
    const connection = await database.getConnection();

    try {
        await connection.beginTransaction();
        await connection.execute(
            `INSERT INTO members (
                name, email, locale, status, privacy_consent_version, privacy_consent_at,
                acquisition_source, acquisition_medium, acquisition_campaign, acquisition_content,
                acquisition_term, acquisition_landing_path, acquisition_referrer_host, acquisition_session_id
            ) VALUES (?, ?, ?, 'pending', ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                locale = VALUES(locale),
                privacy_consent_version = VALUES(privacy_consent_version),
                privacy_consent_at = NOW(),
                acquisition_source = COALESCE(acquisition_source, VALUES(acquisition_source)),
                acquisition_medium = COALESCE(acquisition_medium, VALUES(acquisition_medium)),
                acquisition_campaign = COALESCE(acquisition_campaign, VALUES(acquisition_campaign)),
                acquisition_content = COALESCE(acquisition_content, VALUES(acquisition_content)),
                acquisition_term = COALESCE(acquisition_term, VALUES(acquisition_term)),
                acquisition_landing_path = COALESCE(acquisition_landing_path, VALUES(acquisition_landing_path)),
                acquisition_referrer_host = COALESCE(acquisition_referrer_host, VALUES(acquisition_referrer_host)),
                acquisition_session_id = COALESCE(acquisition_session_id, VALUES(acquisition_session_id))`,
            [
                name, email, locale, privacyConsentVersion,
                attribution.source, attribution.medium, attribution.campaign, attribution.content,
                attribution.term, attribution.landingPath, attribution.referrerHost, attribution.funnelSessionId,
            ],
        );

        const [memberRows] = await connection.execute(
            "SELECT id, password_hash FROM members WHERE email = ? LIMIT 1 FOR UPDATE",
            [email],
        );
        const member = memberRows[0];
        const token = crypto.randomBytes(32).toString("base64url");

        await connection.execute(
            `INSERT INTO member_access_tokens (member_id, token_hash, pending_password_hash, expires_at)
             VALUES (?, ?, ?, '9999-12-31 23:59:59')`,
            [member.id, hashToken(token), member.password_hash ? null : pendingPasswordHash],
        );
        await connection.commit();

        return `${baseUrl()}/api/members/access?token=${encodeURIComponent(token)}`;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const activateMemberAccess = async (token) => {
    if (!token || token.length > 128) return null;

    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        const [rows] = await connection.execute(
            `SELECT access_tokens.id AS access_token_id, members.id AS member_id,
                    access_tokens.pending_password_hash, members.name, members.email, members.locale,
                    members.acquisition_source, members.acquisition_medium,
                    members.acquisition_campaign, members.acquisition_content,
                    members.acquisition_term, members.acquisition_landing_path,
                    members.acquisition_referrer_host, members.acquisition_session_id
             FROM member_access_tokens AS access_tokens
             INNER JOIN members ON members.id = access_tokens.member_id
             WHERE access_tokens.token_hash = ?
             LIMIT 1 FOR UPDATE`,
            [hashToken(token)],
        );

        if (!rows[0]) {
            await connection.rollback();
            return null;
        }

        const member = rows[0];
        const sessionToken = await createSession(connection, member.member_id);

        await connection.execute(
            "UPDATE member_access_tokens SET used_at = COALESCE(used_at, UTC_TIMESTAMP()) WHERE id = ?",
            [member.access_token_id],
        );
        await connection.execute(
            `UPDATE members
             SET status = 'active',
                 verified_at = COALESCE(verified_at, NOW()),
                 last_login_at = NOW(),
                 password_set_at = CASE
                     WHEN password_hash IS NULL AND ? IS NOT NULL THEN NOW()
                     ELSE password_set_at
                 END,
                 password_hash = COALESCE(password_hash, ?)
             WHERE id = ?`,
            [member.pending_password_hash, member.pending_password_hash, member.member_id],
        );
        await connection.commit();

        return { member, sessionToken };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const authenticateMember = async ({ email, password }) => {
    const [rows] = await database.execute(
        `SELECT id, name, email, locale, password_hash
         FROM members
         WHERE email = ? AND status = 'active'
         LIMIT 1`,
        [email],
    );
    const member = rows[0];
    if (!member || !await verifyPassword(password, member.password_hash)) return null;

    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        const sessionToken = await createSession(connection, member.id);
        await connection.execute("UPDATE members SET last_login_at = NOW() WHERE id = ?", [member.id]);
        await connection.commit();
        return { member, sessionToken };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const createMemberPasswordReset = async ({ email }) => {
    const [rows] = await database.execute(
        "SELECT id, name, email, locale FROM members WHERE email = ? LIMIT 1",
        [email],
    );
    const member = rows[0];
    if (!member) return null;

    const token = crypto.randomBytes(32).toString("base64url");
    await database.execute(
        "UPDATE member_password_reset_tokens SET used_at = COALESCE(used_at, UTC_TIMESTAMP()) WHERE member_id = ? AND used_at IS NULL",
        [member.id],
    );
    await database.execute(
        `INSERT INTO member_password_reset_tokens (member_id, token_hash, expires_at)
         VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR))`,
        [member.id, hashToken(token)],
    );

    return {
        member,
        resetUrl: `${baseUrl()}/mitglieder?reset=${encodeURIComponent(token)}`,
    };
};

export const resetMemberPassword = async ({ token, password }) => {
    if (!token || token.length > 128) return false;

    const passwordHash = await hashPassword(password);
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        const [rows] = await connection.execute(
            `SELECT reset_tokens.id AS reset_token_id, reset_tokens.member_id
             FROM member_password_reset_tokens AS reset_tokens
             WHERE reset_tokens.token_hash = ?
               AND reset_tokens.used_at IS NULL
               AND reset_tokens.expires_at > UTC_TIMESTAMP()
             LIMIT 1 FOR UPDATE`,
            [hashToken(token)],
        );
        const resetToken = rows[0];
        if (!resetToken) {
            await connection.rollback();
            return false;
        }

        await connection.execute(
            "UPDATE member_password_reset_tokens SET used_at = UTC_TIMESTAMP() WHERE id = ?",
            [resetToken.reset_token_id],
        );
        await connection.execute(
            `UPDATE members
             SET password_hash = ?, password_set_at = NOW(), status = 'active', verified_at = COALESCE(verified_at, NOW())
             WHERE id = ?`,
            [passwordHash, resetToken.member_id],
        );
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const setMemberSessionCookie = (response, sessionToken) => {
    response.cookie(sessionCookieName, sessionToken, {
        httpOnly: true,
        secure: String(process.env.COOKIE_SECURE ?? "true") !== "false",
        sameSite: "lax",
        maxAge: sessionLifetimeDays * 24 * 60 * 60 * 1000,
        path: "/",
    });
};

export const clearMemberSessionCookie = (response) => {
    response.clearCookie(sessionCookieName, {
        httpOnly: true,
        secure: String(process.env.COOKIE_SECURE ?? "true") !== "false",
        sameSite: "lax",
        path: "/",
    });
};

export const getMemberFromRequest = async (request) => {
    const sessionToken = readCookie(request, sessionCookieName);
    if (!sessionToken || sessionToken.length > 128) return null;

    const [rows] = await database.execute(
        `SELECT sessions.id AS session_id, members.id, members.name, members.email, members.locale,
                members.role, members.membership_tier, members.premium_expires_at
         FROM member_sessions AS sessions
         INNER JOIN members ON members.id = sessions.member_id
         WHERE sessions.token_hash = ? AND sessions.expires_at > UTC_TIMESTAMP()
           AND members.status = 'active'
         LIMIT 1`,
        [hashToken(sessionToken)],
    );

    if (!rows[0]) return null;
    await database.execute(
        "UPDATE member_sessions SET last_seen_at = NOW() WHERE id = ?",
        [rows[0].session_id],
    );

    return {
        ...rows[0],
        role: resolveRole(rows[0]),
        membership_tier: rows[0].membership_tier || "free",
    };
};

export const getMemberContentState = async (memberId) => {
    const [rows] = await database.execute(
        `SELECT content_key, is_favorite, progress_state, last_opened_at, completed_at
         FROM member_content_state
         WHERE member_id = ?
         ORDER BY updated_at DESC`,
        [memberId],
    );

    return rows.map((row) => ({
        contentKey: row.content_key,
        favorite: Boolean(row.is_favorite),
        progress: row.progress_state,
        lastOpenedAt: row.last_opened_at,
        completedAt: row.completed_at,
    }));
};

export const updateMemberContentState = async ({
    memberId,
    contentKey,
    favorite,
    progress,
}) => {
    if (!/^[a-z0-9-]{3,80}$/u.test(contentKey)) return null;
    if (progress !== undefined && !contentProgressStates.has(progress)) return null;

    const [rows] = await database.execute(
        `SELECT is_favorite, progress_state
         FROM member_content_state
         WHERE member_id = ? AND content_key = ?
         LIMIT 1`,
        [memberId, contentKey],
    );
    const current = rows[0] || { is_favorite: 0, progress_state: "new" };
    const nextFavorite = favorite === undefined ? Boolean(current.is_favorite) : Boolean(favorite);
    const nextProgress = progress === undefined ? current.progress_state : progress;

    await database.execute(
        `INSERT INTO member_content_state (
            member_id, content_key, is_favorite, progress_state, last_opened_at, completed_at
         ) VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            is_favorite = VALUES(is_favorite),
            progress_state = VALUES(progress_state),
            last_opened_at = VALUES(last_opened_at),
            completed_at = VALUES(completed_at)`,
        [
            memberId,
            contentKey,
            nextFavorite ? 1 : 0,
            nextProgress,
            nextProgress === "new" ? null : new Date(),
            nextProgress === "completed" ? new Date() : null,
        ],
    );

    return {
        contentKey,
        favorite: nextFavorite,
        progress: nextProgress,
    };
};

export const endMemberSession = async (request) => {
    const sessionToken = readCookie(request, sessionCookieName);
    if (!sessionToken || sessionToken.length > 128) return;

    await database.execute(
        "DELETE FROM member_sessions WHERE token_hash = ?",
        [hashToken(sessionToken)],
    );
};
