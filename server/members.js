import crypto from "node:crypto";
import { database } from "./database.js";

const sessionLifetimeDays = 30;
const sessionCookieName = "spirit_member_session";

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const baseUrl = () => (process.env.PUBLIC_BASE_URL || "https://www.spirit-healing.tr").replace(/\/$/u, "");

const readCookie = (request, name) => {
    const header = request.get("cookie") || "";
    const cookie = header.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : "";
};

export const createMemberAccessRequest = async ({
    name,
    email,
    locale,
    privacyConsentVersion,
}) => {
    await database.execute(
        `INSERT INTO members (
            name, email, locale, status, privacy_consent_version, privacy_consent_at
        ) VALUES (?, ?, ?, 'pending', ?, NOW())
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            locale = VALUES(locale),
            privacy_consent_version = VALUES(privacy_consent_version),
            privacy_consent_at = NOW()`,
        [name, email, locale, privacyConsentVersion],
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

export const activateMemberAccess = async (token) => {
    if (!token || token.length > 128) return null;

    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        const [rows] = await connection.execute(
            `SELECT access_tokens.id AS access_token_id, members.id AS member_id,
                    members.name, members.email, members.locale
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
        const sessionToken = crypto.randomBytes(32).toString("base64url");

        await connection.execute(
            "UPDATE member_access_tokens SET used_at = COALESCE(used_at, UTC_TIMESTAMP()) WHERE id = ?",
            [member.access_token_id],
        );
        await connection.execute(
            `UPDATE members
             SET status = 'active', verified_at = COALESCE(verified_at, NOW()), last_login_at = NOW()
             WHERE id = ?`,
            [member.member_id],
        );
        await connection.execute(
            `INSERT INTO member_sessions (member_id, token_hash, expires_at)
             VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ${sessionLifetimeDays} DAY))`,
            [member.member_id, hashToken(sessionToken)],
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
        `SELECT sessions.id AS session_id, members.id, members.name, members.email, members.locale
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

    return rows[0];
};

export const endMemberSession = async (request) => {
    const sessionToken = readCookie(request, sessionCookieName);
    if (!sessionToken || sessionToken.length > 128) return;

    await database.execute(
        "DELETE FROM member_sessions WHERE token_hash = ?",
        [hashToken(sessionToken)],
    );
};
