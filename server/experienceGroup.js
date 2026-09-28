import { createHash } from 'node:crypto';
import { activeAccess, canReadSession, experiencePlans, instant, normalizeExperienceGrant,
    normalizeExperienceSession, ExperienceValidationError, renewalReminder, normalizeExperienceJoinUrl } from './experiencePolicy.js';

export const initializeExperienceGroup = async (db) => {
    for (const sql of [
        `CREATE TABLE IF NOT EXISTS experience_memberships (
          member_id BIGINT UNSIGNED PRIMARY KEY, plan VARCHAR(16) NOT NULL,
          status VARCHAR(16) NOT NULL, starts_at DATETIME(3) NOT NULL, ends_at DATETIME(3) NULL,
          content_from DATETIME(3) NOT NULL, full_archive TINYINT NOT NULL DEFAULT 0,
          updated_by BIGINT UNSIGNED NOT NULL, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT experience_member_fk FOREIGN KEY (member_id) REFERENCES members(id),
          INDEX experience_expiry (status, ends_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
        `CREATE TABLE IF NOT EXISTS experience_sessions (
          id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, title VARCHAR(180) NOT NULL,
          summary TEXT NOT NULL, occurred_at DATETIME(3) NOT NULL, status VARCHAR(16) NOT NULL DEFAULT 'draft',
          vimeo_id VARCHAR(20) NOT NULL DEFAULT '', vimeo_hash VARCHAR(64) NOT NULL DEFAULT '',
          published_at DATETIME(3) NULL, updated_by BIGINT UNSIGNED NOT NULL,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX experience_sessions_date (status, occurred_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
        `CREATE TABLE IF NOT EXISTS experience_handouts (
          id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, session_id BIGINT UNSIGNED NOT NULL,
          title VARCHAR(180) NOT NULL, file_bytes MEDIUMBLOB NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT experience_handout_session_fk FOREIGN KEY (session_id) REFERENCES experience_sessions(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
        `CREATE TABLE IF NOT EXISTS experience_access_audit (
          id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, member_id BIGINT UNSIGNED NOT NULL,
          actor_id BIGINT UNSIGNED NOT NULL, reason VARCHAR(500) NOT NULL,
          previous_json TEXT NULL, next_json TEXT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
        `CREATE TABLE IF NOT EXISTS experience_imports (
          source_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
          session_id BIGINT UNSIGNED NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT experience_import_session_fk FOREIGN KEY (session_id) REFERENCES experience_sessions(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
        `CREATE TABLE IF NOT EXISTS experience_handout_imports (
          session_id BIGINT UNSIGNED NOT NULL, file_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
          handout_id BIGINT UNSIGNED NULL, PRIMARY KEY (session_id, file_hash),
          CONSTRAINT experience_handout_import_session_fk FOREIGN KEY (session_id) REFERENCES experience_sessions(id),
          CONSTRAINT experience_handout_import_file_fk FOREIGN KEY (handout_id) REFERENCES experience_handouts(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    ]) await db.query(sql);
};

const sqlDate = value => value === null ? null : new Date(instant(value)).toISOString().slice(0, 23).replace('T', ' ');
const isoDate = value => value ? new Date(instant(value)).toISOString() : null;
const mapAccess = row => row ? ({
    plan: row.plan, status: row.status, startsAt: isoDate(row.starts_at), endsAt: isoDate(row.ends_at),
    contentFrom: isoDate(row.content_from), fullArchive: Boolean(row.full_archive),
}) : null;
export const experienceEmbedUrl = (session) => session.vimeo_id
    ? `https://player.vimeo.com/video/${session.vimeo_id}?dnt=1${session.vimeo_hash ? `&h=${session.vimeo_hash}` : ''}` : null;

export const createExperienceService = ({ db, clock = () => new Date(), joinUrl = null }) => {
    const liveUrl = normalizeExperienceJoinUrl(joinUrl);
    // DATETIME values in this feature are UTC, independent of the host timezone.
    const read = (sql, values = []) => db.execute({ sql, dateStrings: true }, values);
    const accessFor = async memberId => {
        const [rows] = await read('SELECT * FROM experience_memberships WHERE member_id = ?', [memberId]);
        return rows[0] || null;
    };
    const sessionFor = async id => {
        const [rows] = await read('SELECT * FROM experience_sessions WHERE id = ?', [id]);
        return rows[0] || null;
    };
    const authorizedSession = async (member, sessionId) => {
        const session = await sessionFor(sessionId);
        if (!session) return null;
        if (member.role === 'admin') return session;
        return canReadSession(await accessFor(member.id), session, clock()) ? session : null;
    };
    return {
        async importSessions(member, rows) {
            if (member.role !== 'admin') throw new ExperienceValidationError('role');
            if (!Array.isArray(rows) || !rows.length || rows.length > 200) throw new ExperienceValidationError('import');
            const entries = rows.map(row => {
                if (typeof row.uuid !== 'string' || !/^[A-Za-z0-9+/=_-]{8,100}$/.test(row.uuid)) throw new ExperienceValidationError('source');
                return { sourceKey: createHash('sha256').update(`zoom:${row.uuid}`).digest('hex'),
                    ...normalizeExperienceSession({ title: row.title, occurredAt: row.date, summary: '', status: 'draft' }) };
            });
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();
                const result = [];
                for (const entry of entries) {
                    await conn.execute('INSERT IGNORE INTO experience_imports (source_key) VALUES (?)', [entry.sourceKey]);
                    const [[existing]] = await conn.execute('SELECT session_id FROM experience_imports WHERE source_key=? FOR UPDATE', [entry.sourceKey]);
                    if (existing.session_id) {
                        result.push({ id: Number(existing.session_id), occurredAt: entry.occurredAt, created: false });
                        continue;
                    }
                    const [created] = await conn.execute(`INSERT INTO experience_sessions
                        (title, summary, occurred_at, status, vimeo_id, vimeo_hash, updated_by)
                        VALUES (?, '', ?, 'draft', '', '', ?)`, [entry.title, sqlDate(entry.occurredAt), member.id]);
                    await conn.execute('UPDATE experience_imports SET session_id=? WHERE source_key=?', [created.insertId, entry.sourceKey]);
                    result.push({ id: Number(created.insertId), occurredAt: entry.occurredAt, created: true });
                }
                await conn.commit();
                return result;
            } catch (error) { await conn.rollback(); throw error; }
            finally { conn.release(); }
        },
        async overview(member) {
            const access = await accessFor(member.id);
            const admin = member.role === 'admin';
            const active = activeAccess(access, clock());
            // Do not send locked titles, private video hashes or file links to clients.
            if (!active && !admin) return { active: false, access: mapAccess(access), sessions: [], plans: experiencePlans, liveAvailable: false };
            const [rows] = await read('SELECT * FROM experience_sessions ORDER BY occurred_at DESC, id DESC');
            const visible = rows.filter(row => admin || canReadSession(access, row, clock()));
            const sessions = [];
            for (const row of visible) {
                const [handouts] = await db.execute('SELECT id, title FROM experience_handouts WHERE session_id = ? ORDER BY id', [row.id]);
                sessions.push({ id: Number(row.id), title: row.title, summary: row.summary,
                    occurredAt: isoDate(row.occurred_at), status: row.status,
                    recordingAvailable: Boolean(row.vimeo_id),
                    handouts: handouts.map(item => ({ id: Number(item.id), title: item.title,
                        url: `/api/members/experience/handouts/${item.id}` })),
                    ...(admin ? { vimeoId: row.vimeo_id, vimeoHash: row.vimeo_hash } : {}),
                });
            }
            return { active, adminPreview: admin, access: mapAccess(access), sessions, plans: experiencePlans, liveAvailable: Boolean(liveUrl) };
        },
        async live(member) {
            if (!liveUrl) return null;
            return member.role === 'admin' || activeAccess(await accessFor(member.id), clock()) ? liveUrl : null;
        },
        async recording(member, id) {
            const session = await authorizedSession(member, id);
            return session ? experienceEmbedUrl(session) : null;
        },
        async handout(member, id) {
            const [rows] = await db.execute('SELECT id, session_id, title FROM experience_handouts WHERE id = ?', [id]);
            if (!rows[0] || !await authorizedSession(member, rows[0].session_id)) return null;
            const [files] = await db.execute('SELECT file_bytes FROM experience_handouts WHERE id = ?', [id]);
            return files[0]?.file_bytes || null;
        },
        async saveSession(member, id, body) {
            if (member.role !== 'admin') throw new ExperienceValidationError('role');
            const item = normalizeExperienceSession(body);
            const values = [item.title, item.summary, sqlDate(item.occurredAt), item.status,
                item.vimeoId, item.vimeoHash, item.status === 'published' ? sqlDate(clock()) : null, member.id];
            if (id) {
                const [result] = await db.execute(`UPDATE experience_sessions SET title=?, summary=?, occurred_at=?, status=?,
                    vimeo_id=?, vimeo_hash=?, published_at=?, updated_by=?, updated_at=UTC_TIMESTAMP() WHERE id=?`, [...values, id]);
                if (!result.affectedRows) throw new ExperienceValidationError('id');
                return id;
            }
            const [result] = await db.execute(`INSERT INTO experience_sessions
                (title, summary, occurred_at, status, vimeo_id, vimeo_hash, published_at, updated_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, values);
            return Number(result.insertId);
        },
        async uploadHandout(member, sessionId, title, bytes) {
            if (member.role !== 'admin' || !await sessionFor(sessionId)) throw new ExperienceValidationError('sessionId');
            if (!Buffer.isBuffer(bytes) || bytes.length < 8 || bytes.length > 8 * 1024 * 1024
                || bytes.subarray(0, 5).toString() !== '%PDF-') throw new ExperienceValidationError('pdf');
            if (!title || title.length > 180) throw new ExperienceValidationError('title');
            // Store bytes privately, never as a publicly reachable /uploads URL.
            const hash = createHash('sha256').update(bytes).digest('hex');
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();
                await conn.execute('INSERT IGNORE INTO experience_handout_imports (session_id, file_hash) VALUES (?, ?)', [sessionId, hash]);
                const [[existing]] = await conn.execute('SELECT handout_id FROM experience_handout_imports WHERE session_id=? AND file_hash=? FOR UPDATE', [sessionId, hash]);
                if (existing.handout_id) { await conn.commit(); return Number(existing.handout_id); }
                const [result] = await conn.execute('INSERT INTO experience_handouts (session_id, title, file_bytes) VALUES (?, ?, ?)', [sessionId, title, bytes]);
                await conn.execute('UPDATE experience_handout_imports SET handout_id=? WHERE session_id=? AND file_hash=?', [result.insertId, sessionId, hash]);
                await conn.commit(); return Number(result.insertId);
            } catch (error) { await conn.rollback(); throw error; }
            finally { conn.release(); }
        },
        async grant(member, body) {
            if (member.role !== 'admin') throw new ExperienceValidationError('role');
            const grant = normalizeExperienceGrant(body);
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();
                const [members] = await conn.execute("SELECT id FROM members WHERE email = ? AND status = 'active' FOR UPDATE", [grant.email]);
                if (!members[0]) throw new ExperienceValidationError('member_not_registered');
                const id = members[0].id;
                const [previous] = await conn.execute('SELECT * FROM experience_memberships WHERE member_id=? FOR UPDATE', [id]);
                await conn.execute(`INSERT INTO experience_memberships
                    (member_id, plan, status, starts_at, ends_at, content_from, full_archive, updated_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
                    plan=VALUES(plan), status=VALUES(status), starts_at=VALUES(starts_at), ends_at=VALUES(ends_at),
                    content_from=VALUES(content_from), full_archive=VALUES(full_archive), updated_by=VALUES(updated_by), updated_at=UTC_TIMESTAMP()`,
                [id, grant.plan, grant.status, sqlDate(grant.startsAt), sqlDate(grant.endsAt), sqlDate(grant.contentFrom), grant.fullArchive ? 1 : 0, member.id]);
                await conn.execute(`INSERT INTO experience_access_audit (member_id, actor_id, reason, previous_json, next_json)
                    VALUES (?, ?, ?, ?, ?)`, [id, member.id, grant.reason, JSON.stringify(previous[0] || null), JSON.stringify(grant)]);
                await conn.commit();
                return mapAccess({ plan: grant.plan, status: grant.status, starts_at: grant.startsAt,
                    ends_at: grant.endsAt, content_from: grant.contentFrom, full_archive: grant.fullArchive });
            } catch (error) { await conn.rollback(); throw error; }
            finally { conn.release(); }
        },
        async reminderPreview() {
            const [rows] = await read("SELECT * FROM experience_memberships WHERE plan='annual' AND status='active'");
            return rows.flatMap(row => {
                const reminder = renewalReminder(row, clock());
                return reminder ? [{ memberId: Number(row.member_id), endsAt: isoDate(row.ends_at), ...reminder }] : [];
            });
        },
    };
};
