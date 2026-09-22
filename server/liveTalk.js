import crypto from "node:crypto";
import { liveTalk, liveMailSchedule, makeLiveToken, readLiveToken, validateZoomJoinUrl } from "./liveTalkConfig.js";

const sqlDate = (date) => new Date(date).toISOString().slice(0, 19).replace("T", " ");

// Separate tables keep the existing seven-day recording access untouched.
export const initializeLiveTalk = async (db) => {
    await db.execute(`CREATE TABLE IF NOT EXISTS live_talk_settings (
        event_key VARCHAR(80) PRIMARY KEY, join_url VARCHAR(1024) NULL,
        enabled BOOLEAN NOT NULL DEFAULT FALSE, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    await db.execute(`CREATE TABLE IF NOT EXISTS live_talk_registrations (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, event_key VARCHAR(80) NOT NULL,
        name VARCHAR(100) NOT NULL, email VARCHAR(254) NOT NULL,
        privacy_version VARCHAR(48) NOT NULL, newsletter_requested BOOLEAN NOT NULL DEFAULT FALSE,
        newsletter_status VARCHAR(32) NOT NULL DEFAULT 'not_requested',
        status VARCHAR(16) NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL, cancelled_at DATETIME NULL,
        UNIQUE KEY live_email (event_key, email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    await db.execute(`CREATE TABLE IF NOT EXISTS live_talk_mail (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, registration_id BIGINT UNSIGNED NOT NULL,
        kind VARCHAR(24) NOT NULL, due_at DATETIME NOT NULL,
        status VARCHAR(16) NOT NULL DEFAULT 'pending', attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
        attempted_at DATETIME NULL, claim_token CHAR(36) NULL, sent_at DATETIME NULL,
        UNIQUE KEY live_mail_once (registration_id, kind), INDEX live_due (status, due_at),
        CONSTRAINT live_mail_registration FOREIGN KEY (registration_id) REFERENCES live_talk_registrations(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    await db.execute("INSERT IGNORE INTO live_talk_settings (event_key) VALUES (?)", [liveTalk.key]);
};

export const createLiveTalkService = ({ db, sendMail, newsletter, secret, baseUrl = "https://spirit-healing.tr" }) => {
    const settings = async () => {
        const [rows] = await db.execute("SELECT join_url, enabled FROM live_talk_settings WHERE event_key = ?", [liveTalk.key]);
        return { joinUrl: validateZoomJoinUrl(rows[0]?.join_url), enabled: Boolean(rows[0]?.enabled) };
    };
    const publicInfo = async (now = new Date()) => {
        const config = await settings();
        return { ...liveTalk, ready: config.enabled && Boolean(config.joinUrl) && now < new Date(liveTalk.startsAt) };
    };
    const register = async (form, now = new Date()) => {
        if (!(await publicInfo(now)).ready) throw Object.assign(new Error("Registration closed"), { code: "closed" });
        // Also validate the signing configuration before accepting registrations.
        makeLiveToken(1, secret);
        const connection = await db.getConnection();
        let id, isNew = false;
        try {
            await connection.beginTransaction();
            await connection.execute("SELECT event_key FROM live_talk_settings WHERE event_key = ? FOR UPDATE", [liveTalk.key]);
            const [existing] = await connection.execute("SELECT id, status FROM live_talk_registrations WHERE event_key = ? AND email = ? FOR UPDATE", [liveTalk.key, form.email]);
            if (!existing.length) {
                const [[count]] = await connection.execute("SELECT COUNT(*) AS total FROM live_talk_registrations WHERE event_key = ? AND status = 'active'", [liveTalk.key]);
                if (Number(count.total) >= liveTalk.capacity) throw Object.assign(new Error("Registration full"), { code: "full" });
            }
            const [insert] = await connection.execute(`INSERT IGNORE INTO live_talk_registrations
                (event_key, name, email, privacy_version, newsletter_requested, newsletter_status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`, [liveTalk.key, form.name, form.email, liveTalk.privacyVersion,
                form.newsletterConsent ? 1 : 0, form.newsletterConsent ? "pending" : "not_requested", sqlDate(now)]);
            isNew = insert.affectedRows === 1;
            const [rows] = await connection.execute("SELECT id, status FROM live_talk_registrations WHERE event_key = ? AND email = ? FOR UPDATE", [liveTalk.key, form.email]);
            id = rows[0].id;
            if (isNew) for (const mail of liveMailSchedule(now)) {
                await connection.execute("INSERT INTO live_talk_mail (registration_id, kind, due_at) VALUES (?, ?, ?)", [id, mail.kind, sqlDate(mail.dueAt)]);
            }
            await connection.commit();
        } catch (error) { await connection.rollback(); throw error; }
        finally { connection.release(); }
        // Repeat submissions neither change an existing person's data nor generate duplicate emails.
        if (isNew && form.newsletterConsent) {
            let status;
            try { status = await newsletter({ ...form, locale: "de", source: liveTalk.key }); }
            catch { status = "confirmation_failed"; }
            await db.execute("UPDATE live_talk_registrations SET newsletter_status = ? WHERE id = ?", [status, id]);
        }
        return { accepted: true };
    };
    const access = async (token, now = new Date()) => {
        const id = readLiveToken(token, secret);
        if (!id || now >= new Date(liveTalk.deleteAfter)) return null;
        const [rows] = await db.execute("SELECT id, name, status FROM live_talk_registrations WHERE id = ? AND event_key = ?", [id, liveTalk.key]);
        if (!rows.length) return null;
        const config = await settings();
        return { name: rows[0].name, status: rows[0].status, ...liveTalk,
            joinUrl: rows[0].status === "active" && config.enabled && now < new Date(liveTalk.endsAt) ? config.joinUrl : null };
    };
    const cancel = async (token) => {
        const id = readLiveToken(token, secret);
        if (!id) return false;
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [rows] = await connection.execute("SELECT id FROM live_talk_registrations WHERE id = ? AND event_key = ? FOR UPDATE", [id, liveTalk.key]);
            if (!rows.length) { await connection.rollback(); return false; }
            await connection.execute("UPDATE live_talk_registrations SET status = 'cancelled', cancelled_at = UTC_TIMESTAMP() WHERE id = ?", [id]);
            await connection.execute("UPDATE live_talk_mail SET status = 'cancelled' WHERE registration_id = ? AND status IN ('pending', 'failed')", [id]);
            await connection.commit(); return true;
        } catch (error) { await connection.rollback(); throw error; }
        finally { connection.release(); }
    };
    const processMail = async (now = new Date()) => {
        if (now >= new Date(liveTalk.deleteAfter)) {
            await db.execute("DELETE FROM live_talk_registrations WHERE event_key = ?", [liveTalk.key]);
            return;
        }
        // A killed process may have delivered mail before losing the DB update. Mark for
        // manual review rather than automatically sending uncertain deliveries twice.
        await db.execute(`UPDATE live_talk_mail SET status = 'uncertain' WHERE status = 'sending'
            AND attempted_at < DATE_SUB(?, INTERVAL 10 MINUTE)`, [sqlDate(now)]);
        if (now >= new Date(liveTalk.startsAt)) return;
        const config = await settings();
        if (!config.enabled || !config.joinUrl) return;
        const [jobs] = await db.execute(`SELECT m.id FROM live_talk_mail m
            JOIN live_talk_registrations r ON r.id = m.registration_id
            WHERE r.event_key = ? AND r.status = 'active' AND m.status IN ('pending','failed')
            AND m.attempts < 3 AND m.due_at <= ?
            AND (m.attempted_at IS NULL OR m.attempted_at < DATE_SUB(?, INTERVAL 5 MINUTE))
            ORDER BY m.due_at, m.id LIMIT 25`, [liveTalk.key, sqlDate(now), sqlDate(now)]);
        for (const job of jobs) {
            const claim = crypto.randomUUID();
            const [claimed] = await db.execute(`UPDATE live_talk_mail m JOIN live_talk_registrations r ON r.id = m.registration_id
                SET m.status = 'sending', m.attempts = m.attempts + 1, m.attempted_at = ?, m.claim_token = ?
                WHERE m.id = ? AND r.status = 'active' AND m.status IN ('pending','failed') AND m.attempts < 3`, [sqlDate(now), claim, job.id]);
            if (!claimed.affectedRows) continue;
            const [rows] = await db.execute(`SELECT m.kind, r.id, r.name, r.email, r.status FROM live_talk_mail m
                JOIN live_talk_registrations r ON r.id = m.registration_id WHERE m.id = ? AND m.claim_token = ?`, [job.id, claim]);
            const row = rows[0];
            if (!row || row.status !== "active") {
                await db.execute("UPDATE live_talk_mail SET status = 'cancelled' WHERE id = ? AND claim_token = ?", [job.id, claim]);
                continue;
            }
            // Do not send a delayed 'tomorrow' message on the day of the event.
            const stale = row.kind === "day" && now >= new Date(new Date(liveTalk.startsAt).getTime() - 12 * 3600000);
            if (stale) {
                await db.execute("UPDATE live_talk_mail SET status = 'skipped' WHERE id = ? AND claim_token = ?", [job.id, claim]);
                continue;
            }
            try {
                const token = makeLiveToken(row.id, secret);
                await sendMail({ ...row, joinUrl: config.joinUrl,
                    manageUrl: `${baseUrl.replace(/\/$/u, "")}/live-vortrag/zugang#token=${token}`,
                    messageId: `<${liveTalk.key}.${row.id}.${row.kind}@spirit-healing.tr>` });
            } catch (error) {
                // Only definite SMTP rejections are retried; network uncertainty is surfaced to owners.
                const definiteFailure = Number(error?.responseCode) >= 400 || error?.code === "EAUTH" || error?.code === "EENVELOPE";
                await db.execute("UPDATE live_talk_mail SET status = ? WHERE id = ? AND claim_token = ?", [definiteFailure ? "failed" : "uncertain", job.id, claim]);
                console.error("Live talk mail needs attention", { jobId: job.id, status: definiteFailure ? "failed" : "uncertain" });
                continue;
            }
            await db.execute("UPDATE live_talk_mail SET status = 'sent', sent_at = UTC_TIMESTAMP() WHERE id = ? AND claim_token = ?", [job.id, claim]);
        }
    };
    const adminInfo = async () => {
        const config = await settings();
        const [registrations] = await db.execute(`SELECT r.id, r.name, r.email, r.status, r.newsletter_status, r.created_at,
            m.kind, m.status AS mail_status, m.attempts, m.sent_at FROM live_talk_registrations r
            LEFT JOIN live_talk_mail m ON m.registration_id = r.id WHERE r.event_key = ? ORDER BY r.created_at DESC, m.id`, [liveTalk.key]);
        return { ...liveTalk, ...config, registrations };
    };
    const configure = async ({ joinUrl, enabled }) => {
        const validated = validateZoomJoinUrl(joinUrl);
        if (!validated || typeof enabled !== "boolean") throw Object.assign(new Error("Invalid configuration"), { code: "validation" });
        await db.execute("UPDATE live_talk_settings SET join_url = ?, enabled = ? WHERE event_key = ?", [validated, enabled ? 1 : 0, liveTalk.key]);
    };
    return { publicInfo, register, access, cancel, processMail, adminInfo, configure };
};

export const startLiveTalkWorker = (service) => {
    let busy = false;
    const tick = async () => {
        if (busy) return;
        busy = true;
        try { await service.processMail(); } catch { console.error("Live talk worker failed; check administration"); }
        finally { busy = false; }
    };
    void tick();
    const timer = setInterval(tick, 30000);
    timer.unref();
    return timer;
};
