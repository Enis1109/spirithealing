import crypto from 'node:crypto';
import { activeAccess, instant, normalizeExperienceGrant, ExperienceValidationError } from './experiencePolicy.js';

const tokenPattern = /^[A-Za-z0-9_-]{43}$/u;
const tokenHash = value => crypto.createHash('sha256').update(value).digest('hex');
const sqlDate = value => new Date(value).toISOString().slice(0, 23).replace('T', ' ');
const grantKeys = new Set(['email', 'plan', 'status', 'startsAt', 'endsAt', 'contentFrom',
    'fullArchive', 'reason', 'identityConfirmed']);

export class ManualExperienceAccessError extends Error {
    constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}

export function normalizeManualExperienceAccess(body) {
    if (!body || Array.isArray(body) || typeof body !== 'object'
        || Object.keys(body).some(key => !grantKeys.has(key))
        || body.identityConfirmed !== true || body.plan !== 'existing' || body.status !== 'active') {
        throw new ManualExperienceAccessError('manual_confirmation_required');
    }
    return normalizeExperienceGrant(body);
}

export async function initializeManualExperienceAccess(db) {
    await db.query(`CREATE TABLE IF NOT EXISTS experience_manual_access_tokens (
        id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        member_id BIGINT UNSIGNED NOT NULL, issued_by BIGINT UNSIGNED NOT NULL,
        token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
        expires_at DATETIME(3) NOT NULL, used_at DATETIME(3) NULL, revoked_at DATETIME(3) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT experience_manual_token_member_fk FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        INDEX experience_manual_token_member (member_id), INDEX experience_manual_token_expiry (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

export function createManualExperienceAccessService({ db, baseUrl, createSession, resolveRole,
    clock = () => new Date(), tokenFactory = () => crypto.randomBytes(32).toString('base64url') }) {
    const landing = new URL('/api/members/experience/manual-access', baseUrl);
    if (landing.protocol !== 'https:' && !(landing.protocol === 'http:'
        && ['localhost', '127.0.0.1', '[::1]'].includes(landing.hostname))) {
        throw new Error('manual_access_requires_https');
    }
    if (typeof createSession !== 'function' || typeof resolveRole !== 'function') {
        throw new Error('manual_access_authentication_dependencies_required');
    }
    return {
        async issue(actor, body) {
            if (!actor) throw new ManualExperienceAccessError('unauthorized', 401);
            if (actor.role !== 'admin' || !/^[1-9]\d{0,19}$/u.test(String(actor.id))) {
                throw new ManualExperienceAccessError('forbidden', 403);
            }
            const grant = normalizeManualExperienceAccess(body);
            const now = clock();
            if (!activeAccess({ status: grant.status, plan: grant.plan,
                starts_at: grant.startsAt, ends_at: grant.endsAt }, now)) {
                throw new ManualExperienceAccessError('access_not_current');
            }
            const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
            const connection = await db.getConnection();
            let member;
            let token;
            try {
                await connection.beginTransaction();
                const [[account]] = await connection.execute(
                    'SELECT id, name, email, status, role FROM members WHERE email = ? LIMIT 1 FOR UPDATE', [grant.email]);
                if (!account) throw new ManualExperienceAccessError('member_not_found', 404);
                if (!['pending', 'active'].includes(account.status)
                    || resolveRole(account) === 'admin' || String(account.id) === String(actor.id)) {
                    throw new ManualExperienceAccessError('account_unavailable', 409);
                }
                member = account;
                const [[previous]] = await connection.execute({ sql:
                    'SELECT * FROM experience_memberships WHERE member_id = ? FOR UPDATE', dateStrings: true }, [member.id]);
                // Paid plans require their ordinary review; this path is only for existing agreements.
                if (previous && previous.plan !== 'existing') {
                    throw new ManualExperienceAccessError('existing_plan_conflict', 409);
                }
                token = tokenFactory();
                if (!tokenPattern.test(token)) throw new Error('invalid_manual_token_factory');
                // This is an administrator activation, not proof of ownership of an email address.
                // Do not touch verified_at, consent, newsletter, password or other enrollments.
                await connection.execute("UPDATE members SET status = 'active' WHERE id = ? AND status = 'pending'", [member.id]);
                await connection.execute(`INSERT INTO experience_memberships
                    (member_id, plan, status, starts_at, ends_at, content_from, full_archive, updated_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
                    plan=VALUES(plan), status=VALUES(status), starts_at=VALUES(starts_at), ends_at=VALUES(ends_at),
                    content_from=VALUES(content_from), full_archive=VALUES(full_archive), updated_by=VALUES(updated_by), updated_at=UTC_TIMESTAMP()`,
                [member.id, grant.plan, grant.status, sqlDate(grant.startsAt), grant.endsAt ? sqlDate(grant.endsAt) : null,
                    sqlDate(grant.contentFrom), grant.fullArchive ? 1 : 0, actor.id]);
                await connection.execute(`UPDATE experience_manual_access_tokens SET revoked_at = UTC_TIMESTAMP(3)
                    WHERE member_id = ? AND used_at IS NULL AND revoked_at IS NULL`, [member.id]);
                await connection.execute(`INSERT INTO experience_manual_access_tokens
                    (member_id, issued_by, token_hash, expires_at) VALUES (?, ?, ?, ?)`,
                [member.id, actor.id, tokenHash(token), sqlDate(expiresAt)]);
                await connection.execute(`INSERT INTO experience_access_audit
                    (member_id, actor_id, reason, previous_json, next_json) VALUES (?, ?, ?, ?, ?)`,
                [member.id, actor.id, grant.reason,
                    JSON.stringify({ accountStatus: member.status, access: previous || null }),
                    JSON.stringify({ accountStatus: 'active', access: grant,
                        method: 'admin_manual_telegram', linkExpiresAt: expiresAt })]);
                await connection.commit();
            } catch (error) { await connection.rollback(); throw error; }
            finally { connection.release(); }
            const url = new URL(landing);
            url.searchParams.set('token', token);
            return { email: member.email, name: member.name, url: url.href, expiresAt };
        },
        async consume(token) {
            if (typeof token !== 'string' || !tokenPattern.test(token)) return null;
            const now = clock();
            const connection = await db.getConnection();
            try {
                await connection.beginTransaction();
                const [[entry]] = await connection.execute({ sql: `SELECT t.id AS access_token_id,
                    t.member_id, t.expires_at, t.used_at, t.revoked_at,
                    m.status AS account_status, m.role, m.email,
                    a.plan, a.status, a.starts_at, a.ends_at
                    FROM experience_manual_access_tokens t
                    INNER JOIN members m ON m.id = t.member_id
                    INNER JOIN experience_memberships a ON a.member_id = m.id
                    WHERE t.token_hash = ? AND t.used_at IS NULL AND t.revoked_at IS NULL
                        AND t.expires_at > ? LIMIT 1 FOR UPDATE`, dateStrings: true },
                [tokenHash(token), sqlDate(now)]);
                if (!entry || entry.used_at || entry.revoked_at || !Number.isFinite(instant(entry.expires_at))
                    || instant(entry.expires_at) <= now.getTime()
                    || entry.account_status !== 'active' || resolveRole(entry) === 'admin'
                    || !activeAccess(entry, now)) {
                    await connection.rollback(); return null;
                }
                const [used] = await connection.execute(`UPDATE experience_manual_access_tokens
                    SET used_at = UTC_TIMESTAMP(3) WHERE id = ? AND used_at IS NULL AND revoked_at IS NULL`, [entry.access_token_id]);
                if (used.affectedRows !== 1) { await connection.rollback(); return null; }
                const sessionToken = await createSession(connection, entry.member_id);
                await connection.execute('UPDATE members SET last_login_at = UTC_TIMESTAMP() WHERE id = ?', [entry.member_id]);
                await connection.commit();
                return { sessionToken };
            } catch (error) { await connection.rollback(); throw error; }
            finally { connection.release(); }
        },
    };
}

const landingPage = token => `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Dein persönlicher Zugang | Spirit Healing</title><style>
body{margin:0;background:#f6f3eb;color:#123e3d;font:18px/1.6 system-ui,sans-serif}
main{max-width:620px;margin:10vh auto;padding:32px;background:white;border-radius:24px}
button{padding:16px 24px;border:0;border-radius:28px;background:#168e91;color:white;font:inherit;cursor:pointer}
</style></head><body><main><p>Spirit Healing</p><h1>Deine Erfahrungsgruppe wartet auf dich</h1>
<p>Öffne deinen persönlichen Mitgliederbereich mit der Schaltfläche unten. Du brauchst dafür keine weitere E-Mail.</p>
<p>Dieser Link gilt einmalig für 24 Stunden. Bitte nutze ihn nur selbst und gib ihn nicht weiter.</p>
<form method="post" action="/api/members/experience/manual-access/consume">
<input type="hidden" name="token" value="${token}"><button type="submit">Meinen Mitgliederbereich öffnen</button>
</form></main></body></html>`;

export function registerManualExperienceAccessRoutes(app, { service, enabled, getMember,
    sameOrigin, limiter, formParser, setSessionCookie }) {
    const privateResponse = res => res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
        'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' });
    app.post('/api/admin/experience/manual-access', sameOrigin, limiter, async (req, res) => {
        privateResponse(res);
        if (!enabled) return res.status(404).json({ ok: false, error: 'not_available' });
        try {
            const actor = await getMember(req);
            const access = await service.issue(actor, req.body);
            return res.status(201).json({ ok: true, access });
        } catch (error) {
            if (error instanceof ManualExperienceAccessError) return res.status(error.status).json({ ok: false, error: error.code });
            // Input validation from the existing grant policy contains field names only.
            if (error instanceof ExperienceValidationError) return res.status(400).json({ ok: false, error: error.field });
            console.error('Manual experience access could not be issued');
            return res.status(500).json({ ok: false, error: 'server' });
        }
    });
    // GET never signs in or consumes a credential. Telegram previews and link scanners are harmless.
    app.get('/api/members/experience/manual-access', (req, res) => {
        privateResponse(res);
        res.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
        const token = req.query.token;
        if (!enabled || typeof token !== 'string' || !tokenPattern.test(token)) {
            return res.redirect(303, '/mitglieder?state=invalid');
        }
        return res.type('html').send(landingPage(token));
    });
    app.post('/api/members/experience/manual-access/consume', sameOrigin, limiter, formParser, async (req, res) => {
        privateResponse(res);
        if (!enabled) return res.redirect(303, '/mitglieder?state=invalid');
        try {
            const access = await service.consume(req.body?.token);
            if (!access) return res.redirect(303, '/mitglieder?state=invalid');
            setSessionCookie(res, access.sessionToken);
            return res.redirect(303, '/mitglieder?tab=experience');
        } catch {
            console.error('Manual experience sign-in could not be completed');
            return res.redirect(303, '/mitglieder?state=error');
        }
    });
}
