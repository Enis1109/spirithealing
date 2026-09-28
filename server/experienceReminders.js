import { createHash, randomUUID } from 'node:crypto';
import { renewalReminder, instant } from './experiencePolicy.js';

const sqlDate = value => new Date(instant(value)).toISOString().slice(0, 23).replace('T', ' ');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const experienceReminderCopy = ({ name, endsAt, days, memberUrl }) => {
    if (![30, 7, 0].includes(days)) throw new Error('invalid_reminder');
    const url = new URL(memberUrl);
    if (url.protocol !== 'https:' || !['spirit-healing.tr', 'www.spirit-healing.tr'].includes(url.hostname)
        || url.pathname !== '/mitglieder' || url.username || url.password || url.port || url.search || url.hash) throw new Error('invalid_member_url');
    const end = new Intl.DateTimeFormat('de-DE', { dateStyle: 'long', timeZone: 'Europe/Berlin' }).format(new Date(instant(endsAt)));
    const firstName = String(name || '').trim().split(/\s+/)[0];
    const subject = days === 0 ? 'Dein Jahreszugang zur Erfahrungsgruppe endet heute'
        : days === 7 ? 'Deine Erfahrungsgruppe: Noch eine Woche bis zum Zugangsende'
            : 'Deine Erfahrungsgruppe: Möchtest du weiter dabei sein?';
    const text = [firstName ? `Hallo ${firstName},` : 'Hallo,', '',
        days === 0 ? `dein Jahreszugang zu unserer Erfahrungsgruppe endet heute, am ${end}.`
            : `dein Jahreszugang zu unserer Erfahrungsgruppe endet am ${end}.`, '',
        'Wir freuen uns, wenn du weiter mit uns dabei bist. Wenn du verlängern möchtest, antworte uns einfach auf diese E-Mail. Dann kümmern wir uns gemeinsam um deinen weiteren Zugang.', '',
        'Dein Jahreszugang endet automatisch. Ohne deine Entscheidung wird nichts verlängert und nichts erneut abgebucht.', '',
        'Zu deinem Mitgliederbereich:', url.href, '', 'Von Herzen', 'Sabine & Selcan', 'Spirit Healing'].join('\n');
    const html = `<div style="background:#edf8f6;padding:28px 12px;font-family:Arial,sans-serif;color:#123e3d"><div style="max-width:620px;margin:auto;background:#fffaf2;padding:32px;border-radius:20px"><p style="color:#806519;letter-spacing:2px">SPIRIT HEALING</p><h1 style="font-family:Georgia,serif;font-size:28px">${escape(subject)}</h1><div style="white-space:pre-wrap;line-height:1.7">${escape(text)}</div><p><a href="${escape(url.href)}" style="display:inline-block;background:#168e91;color:white;padding:14px 24px;border-radius:24px;text-decoration:none">Mitgliederbereich öffnen</a></p></div></div>`;
    return { subject, text, html };
};

export const initializeExperienceReminders = db => db.query(`CREATE TABLE IF NOT EXISTS experience_reminder_mail (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, member_id BIGINT UNSIGNED NOT NULL,
    dedupe_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
    ends_at DATETIME(3) NOT NULL, days_before TINYINT UNSIGNED NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'pending', claim_token CHAR(36) NULL,
    attempted_at DATETIME(3) NULL, sent_at DATETIME(3) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX experience_mail_status (status),
    CONSTRAINT experience_mail_member_fk FOREIGN KEY (member_id) REFERENCES members(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

export const createExperienceReminderService = ({ db, sendMail, enabled = false,
    memberUrl = 'https://spirit-healing.tr/mitglieder', clock = () => new Date() }) => {
    const read = (sql, values = []) => db.execute({ sql, dateStrings: true }, values);
    const overview = async () => {
        const [jobs] = await read(`SELECT id, member_id, days_before, ends_at, status, sent_at
            FROM experience_reminder_mail ORDER BY id DESC LIMIT 100`);
        return { sendingEnabled: enabled, jobs };
    };
    const processMail = async () => {
        if (!enabled) return { disabled: true, sent: 0 };
        const now = clock();
        // A lost SMTP acknowledgement must never trigger an automatic duplicate.
        await db.execute(`UPDATE experience_reminder_mail SET status='uncertain'
            WHERE status='sending' AND attempted_at < DATE_SUB(?, INTERVAL 15 MINUTE)`, [sqlDate(now)]);
        const [members] = await read(`SELECT e.*, m.name, m.email FROM experience_memberships e
            JOIN members m ON m.id=e.member_id WHERE e.status='active' AND e.plan='annual' AND m.status='active'`);
        for (const member of members) {
            const due = renewalReminder(member, now);
            if (!due) continue;
            await db.execute(`INSERT IGNORE INTO experience_reminder_mail (member_id, dedupe_key, ends_at, days_before)
                VALUES (?, ?, ?, ?)`, [member.member_id, createHash('sha256').update(due.key).digest('hex'), sqlDate(member.ends_at), due.days]);
        }
        const [jobs] = await read("SELECT id FROM experience_reminder_mail WHERE status='pending' ORDER BY id LIMIT 25");
        let sent = 0;
        for (const job of jobs) {
            const claim = randomUUID();
            const [claimed] = await db.execute(`UPDATE experience_reminder_mail SET status='sending', claim_token=?, attempted_at=?
                WHERE id=? AND status='pending'`, [claim, sqlDate(clock()), job.id]);
            if (!claimed.affectedRows) continue;
            const conn = await db.getConnection();
            let smtpStarted = false;
            try {
                await conn.beginTransaction();
                // Lock membership through SMTP handoff so a concurrent extension cannot
                // commit between this last validity check and the actual send.
                const [rows] = await conn.execute({ sql: `SELECT e.*, m.name, m.email, m.status AS member_status,
                    j.ends_at AS expected_end, j.days_before, j.dedupe_key FROM experience_reminder_mail j
                    JOIN experience_memberships e ON e.member_id=j.member_id JOIN members m ON m.id=e.member_id
                    WHERE j.id=? AND j.claim_token=? FOR UPDATE`, dateStrings: true }, [job.id, claim]);
                const row = rows[0];
                const due = row && renewalReminder(row, clock());
                if (!due || row.member_status !== 'active' || instant(row.ends_at) !== instant(row.expected_end)
                    || due.days !== Number(row.days_before)) {
                    await conn.execute("UPDATE experience_reminder_mail SET status='skipped' WHERE id=? AND claim_token=?", [job.id, claim]);
                    await conn.commit();
                    continue;
                }
                const copy = experienceReminderCopy({ name: row.name, endsAt: row.ends_at, days: due.days, memberUrl });
                smtpStarted = true;
                await sendMail({ ...copy, email: row.email,
                    messageId: `<experience.${row.dedupe_key}@spirit-healing.tr>` });
                await conn.execute("UPDATE experience_reminder_mail SET status='sent', sent_at=? WHERE id=? AND claim_token=?",
                    [sqlDate(clock()), job.id, claim]);
                await conn.commit(); sent++;
            } catch (error) {
                await conn.rollback();
                const status = smtpStarted ? 'uncertain' : 'failed';
                await db.execute('UPDATE experience_reminder_mail SET status=? WHERE id=? AND claim_token=?', [status, job.id, claim]);
                // Deliberately do not log message content or recipient details.
                console.error('Experience reminder needs review', { jobId: job.id, status, code: error?.code || error?.name });
            } finally { conn.release(); }
        }
        return { sent };
    };
    return { processMail, overview };
};

export const startExperienceReminderWorker = service => {
    let busy = false;
    const tick = async () => {
        if (busy) return;
        busy = true;
        try { await service.processMail(); }
        catch { console.error('Experience reminder worker failed; check administration'); }
        finally { busy = false; }
    };
    void tick();
    const timer = setInterval(tick, 300000);
    timer.unref();
    return timer;
};
