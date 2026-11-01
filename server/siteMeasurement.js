import { createHash } from 'node:crypto';
import { SITE_CONSENT_VERSION, SITE_CONSENT_MS, SITE_FLOW_MS, validSiteReceipt, validSiteChoice,
    siteEvent, siteSummary } from '../shared/siteMeasurement.js';
import { siteReleaseSchema, releaseSiteMeasurements } from './siteMeasurementRelease.js';
import { normalizeSiteActivity, activityAdvances, siteActivityReport } from '../shared/siteActivity.js';
import { withBerlinLock } from './berlinErasure.js';
const stamp = value => new Date(value).toISOString().slice(0,23).replace('T',' ');
const digest = (scope, value) => createHash('sha256').update(scope + ':' + value).digest('hex');
export const siteMeasurementSchema = [
    siteReleaseSchema,
    `CREATE TABLE IF NOT EXISTS site_measurement_consents (
        receipt_hash CHAR(64) PRIMARY KEY, consent_at DATETIME(3) NOT NULL, expires_at DATETIME(3) NOT NULL,
        revoked_at DATETIME(3) NULL, version VARCHAR(64) NOT NULL, environment VARCHAR(12) NOT NULL, INDEX site_consent_expiry(expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS site_measurement_flows (
        receipt_hash CHAR(64) NOT NULL, flow_hash CHAR(64) NOT NULL, code VARCHAR(8) NULL, entry_class VARCHAR(12) NOT NULL,
        flags INT UNSIGNED NOT NULL DEFAULT 0, validation_error TINYINT NOT NULL DEFAULT 0, technical_error TINYINT NOT NULL DEFAULT 0,
        created_at DATETIME(3) NOT NULL, flow_expires_at DATETIME(3) NOT NULL,
        PRIMARY KEY(receipt_hash,flow_hash), INDEX site_flow_created(created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS site_measurement_activity (
        receipt_hash CHAR(64) NOT NULL, flow_hash CHAR(64) NOT NULL, revision INT UNSIGNED NOT NULL,
        state_json JSON NOT NULL, PRIMARY KEY(receipt_hash,flow_hash)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];
export async function initializeSiteMeasurement(db) {
    if(!await siteMeasurementTableExists(db,'site_measurement_releases')
        && await siteMeasurementTableExists(db,'site_measurement_flows') && await siteMeasurementTableExists(db,'site_measurement_consents')){
        const [existing]=await db.execute(`SELECT 1 FROM site_measurement_flows f INNER JOIN site_measurement_consents c ON c.receipt_hash=f.receipt_hash WHERE c.version=? LIMIT 1`,[SITE_CONSENT_VERSION]);
        if(existing.length)throw new Error('Release history missing; do not recreate over retained cohorts');
    }
    for (const sql of siteMeasurementSchema) await db.query(sql);
    await cleanSiteMeasurement(db);
}
export async function cleanSiteMeasurement(db) {
    const flows = await siteMeasurementTableExists(db, 'site_measurement_flows');
    const consents = await siteMeasurementTableExists(db, 'site_measurement_consents');
    if (flows && consents) {
        await db.execute(`DELETE f FROM site_measurement_flows f LEFT JOIN site_measurement_consents c ON c.receipt_hash=f.receipt_hash
            WHERE f.created_at<=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 7 DAY) OR c.receipt_hash IS NULL
            OR c.revoked_at IS NOT NULL OR c.expires_at<=UTC_TIMESTAMP()`);
    } else if (flows) {
        // No authoritative grant table: every remaining flow is orphaned.
        await db.execute('DELETE FROM site_measurement_flows');
    }
    const activity = await siteMeasurementTableExists(db, 'site_measurement_activity');
    if (activity && flows && consents) await db.execute(`DELETE a FROM site_measurement_activity a
        LEFT JOIN site_measurement_flows f ON a.receipt_hash=f.receipt_hash AND a.flow_hash=f.flow_hash
        LEFT JOIN site_measurement_consents c ON a.receipt_hash=c.receipt_hash
        WHERE f.receipt_hash IS NULL OR f.created_at<=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 7 DAY)
        OR c.receipt_hash IS NULL OR c.revoked_at IS NOT NULL OR c.expires_at<=UTC_TIMESTAMP()`);
    else if(activity) await db.execute('DELETE FROM site_measurement_activity');
    const releases=await siteMeasurementTableExists(db,'site_measurement_releases');
    if(releases)await db.execute('DELETE FROM site_measurement_releases WHERE expires_at<=UTC_TIMESTAMP()');
    if (consents) await db.execute('DELETE FROM site_measurement_consents WHERE expires_at<=UTC_TIMESTAMP()');
}
async function siteMeasurementTableExists(db, table) {
    if (!['site_measurement_flows','site_measurement_consents','site_measurement_activity','site_measurement_releases'].includes(table)) throw new TypeError('Unknown measurement table');
    try { await db.execute('SELECT 1 FROM ' + table + ' LIMIT 0'); return true; }
    catch (error) { if (error.code === 'ER_NO_SUCH_TABLE') return false; throw error; }
}
export function startSiteMeasurementCleanup(db) {
    let running = false;
    const timer = setInterval(async () => {
        if (running) return; running = true;
        try { await cleanSiteMeasurement(db); } catch { console.error('Site measurement cleanup failed'); }
        finally { running = false; }
    }, 3600000);
    timer.unref?.(); return () => clearInterval(timer);
}
export function createSiteMeasurement({ db, enabled = false, environment = 'local', clock = () => Date.now(), lock = withBerlinLock }) {
    if (!['local','staging','production'].includes(environment)) throw new TypeError('Unknown measurement environment');
    let activeEnabled = enabled;
    const locked = (hash, task) => lock(db, 'sm:' + hash.slice(0, 60), task);
    const active = async (connection, hash, now) => {
        const [rows] = await connection.execute(`SELECT receipt_hash FROM site_measurement_consents
            WHERE receipt_hash=? AND version=? AND environment=? AND revoked_at IS NULL AND expires_at>? AND consent_at<=?`,
        [hash, SITE_CONSENT_VERSION, environment, stamp(now), stamp(now)]);
        return Boolean(rows[0]);
    };
    return {
        get enabled() { return activeEnabled; },
        set enabled(value) { activeEnabled = value === true; },
        environment,
        async grant(input) {
            const now = clock();
            if (!activeEnabled || !validSiteChoice(input, now) || !input.enabled
                || input.schema_version !== 1 || input.environment !== environment
                || Object.keys(input).some(key => !['receipt','at','enabled','version','schema_version','environment'].includes(key))) return false;
            const hash = digest('site-consent:' + environment, input.receipt);
            return locked(hash, async connection => {
                await connection.execute(`INSERT INTO site_measurement_consents (receipt_hash,consent_at,expires_at,version,environment)
                    VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE receipt_hash=VALUES(receipt_hash)`,
                [hash, stamp(input.at), stamp(input.at + SITE_CONSENT_MS), SITE_CONSENT_VERSION, environment]);
                return active(connection, hash, now);
            });
        },
        async revoke(receipt) {
            if (!validSiteReceipt(receipt)) return false;
            const now = clock(), hash = digest('site-consent:' + environment, receipt);
            return locked(hash, async connection => {
                const hasFlows = await siteMeasurementTableExists(connection, 'site_measurement_flows');
                const hasConsents = await siteMeasurementTableExists(connection, 'site_measurement_consents');
                const hasActivity = await siteMeasurementTableExists(connection, 'site_measurement_activity');
                const hasReleases=await siteMeasurementTableExists(connection,'site_measurement_releases');
                if (!hasFlows || !hasConsents || !hasReleases) activeEnabled = false;
                if (!hasFlows && !hasConsents && !hasActivity) return true; // Both absences were independently confirmed.
                await connection.query('START TRANSACTION');
                try {
                    if (hasConsents) await connection.execute(`INSERT INTO site_measurement_consents (receipt_hash,consent_at,expires_at,revoked_at,version,environment)
                        VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE revoked_at=VALUES(revoked_at)`,
                    [hash, stamp(now), stamp(now + SITE_CONSENT_MS), stamp(now), SITE_CONSENT_VERSION, environment]);
                    if(hasFlows&&hasReleases)await connection.execute(`INSERT INTO site_measurement_releases (cohort_day,code,fingerprint,blocked,expires_at)
                        SELECT DISTINCT DATE(created_at),COALESCE(code,'-'),REPEAT('0',64),1,DATE_ADD(DATE(created_at),INTERVAL 8 DAY)
                        FROM site_measurement_flows WHERE receipt_hash=?
                        ON DUPLICATE KEY UPDATE blocked=1`,[hash]);
                    if(hasActivity){
                        await connection.execute('DELETE FROM site_measurement_activity WHERE receipt_hash=?',[hash]);
                        const [remaining]=await connection.execute('SELECT receipt_hash FROM site_measurement_activity WHERE receipt_hash=? LIMIT 1',[hash]);
                        if(remaining.length)throw new Error('Activity withdrawal not complete');
                    }
                    if (hasFlows) {
                        await connection.execute('DELETE FROM site_measurement_flows WHERE receipt_hash=?', [hash]);
                        const [remaining] = await connection.execute('SELECT receipt_hash FROM site_measurement_flows WHERE receipt_hash=? LIMIT 1', [hash]);
                        if (remaining.length) throw new Error('Withdrawal not complete');
                    }
                    if (hasConsents) {
                        const [markers] = await connection.execute('SELECT receipt_hash FROM site_measurement_consents WHERE receipt_hash=? AND revoked_at IS NOT NULL', [hash]);
                        if (!markers.length) throw new Error('Withdrawal not durable');
                    }
                    await connection.query('COMMIT');
                    // If only flows existed, data was removed but no durable tombstone
                    // could be written. Keep the client's receipt pending until repair.
                    return hasConsents;
                } catch (error) { await connection.query('ROLLBACK'); throw error; }
            });
        },
        async record(input, verified = false) {
            const now = clock(), normalized = siteEvent(input, verified, now); if (!activeEnabled || !normalized || input.environment !== environment) return false;
            const { context: c, bit, kind } = normalized;
            const hash = digest('site-consent:' + environment, c.receipt), flow = digest('site-flow', c.receipt + ':' + c.flow);
            return locked(hash, async connection => {
                if (!await active(connection, hash, now)) return false;
                await connection.execute(`INSERT INTO site_measurement_flows
                    (receipt_hash,flow_hash,code,entry_class,created_at,flow_expires_at) VALUES (?,?,?,?,?,?)
                    ON DUPLICATE KEY UPDATE flow_hash=VALUES(flow_hash)`,
                [hash, flow, c.code, c.entry, stamp(Math.floor(c.startedAt/60000)*60000), stamp(Math.floor(c.startedAt/60000)*60000 + SITE_FLOW_MS)]);
                const [result] = await connection.execute(`UPDATE site_measurement_flows SET flags=flags | ?,
                    validation_error=GREATEST(validation_error,?), technical_error=GREATEST(technical_error,?)
                    WHERE receipt_hash=? AND flow_hash=? AND flow_expires_at>?`,
                [bit, kind === 'validation' ? 1 : 0, kind === 'technical' ? 1 : 0, hash, flow, stamp(now)]);
                return result.affectedRows > 0;
            });
        },
        async activity(input) {
            const now=clock();
            if(!activeEnabled || !input || Object.keys(input).sort().join(',')!=='context,environment,schema_version,state'
                || input.schema_version!==1 || input.environment!==environment)return false;
            const normalized=siteEvent({context:input.context,event_name:'landing_view',schema_version:1,environment},false,now);
            const state=normalizeSiteActivity(input.state);if(!normalized || !state)return false;
            const c=normalized.context;
            if(Math.floor(c.startedAt/60000)*60000+SITE_FLOW_MS<=now)return false;
            if(state.pages.reduce((sum,p)=>sum+p.active_seconds,0)>Math.ceil((now-c.startedAt)/1000)+1)return false;
            const hash=digest('site-consent:'+environment,c.receipt),flow=digest('site-flow',c.receipt+':'+c.flow);
            return locked(hash,async connection=>{
                if(!await active(connection,hash,now))return false;
                // Activity never fabricates a landing flag. The explicit landing event owns that.
                await connection.execute(`INSERT INTO site_measurement_flows
                    (receipt_hash,flow_hash,code,entry_class,created_at,flow_expires_at) VALUES (?,?,?,?,?,?)
                    ON DUPLICATE KEY UPDATE flow_hash=VALUES(flow_hash)`,
                    [hash,flow,c.code,c.entry,stamp(Math.floor(c.startedAt/60000)*60000),stamp(Math.floor(c.startedAt/60000)*60000+SITE_FLOW_MS)]);
                const [existing]=await connection.execute(`SELECT 1 AS active_flow FROM site_measurement_flows
                    WHERE receipt_hash=? AND flow_hash=? AND flow_expires_at>? AND created_at=? AND code <=> ? AND entry_class=?`,
                    [hash,flow,stamp(now),stamp(Math.floor(c.startedAt/60000)*60000),c.code,c.entry]);
                if(!existing[0])return false;
                const [rows]=await connection.execute('SELECT revision,state_json FROM site_measurement_activity WHERE receipt_hash=? AND flow_hash=?',[hash,flow]);
                let previous=null;if(rows[0])previous=normalizeSiteActivity(typeof rows[0].state_json==='string'?JSON.parse(rows[0].state_json):rows[0].state_json);
                // Retry/late cumulative snapshots cannot restore earlier or smaller state.
                if(previous && state.revision<=previous.revision)return true;
                if(!activityAdvances(previous,state))return false;
                await connection.execute(`INSERT INTO site_measurement_activity (receipt_hash,flow_hash,revision,state_json) VALUES (?,?,?,?)
                    ON DUPLICATE KEY UPDATE state_json=IF(revision<VALUES(revision),VALUES(state_json),state_json),revision=GREATEST(revision,VALUES(revision))`,
                    [hash,flow,state.revision,JSON.stringify(state)]);
                return true;
            });
        },
        async summary() {
            if (!activeEnabled) return { enabled: false, environment, rows: [], booking: 'not_instrumented' };
            const [rows] = await db.execute(`SELECT DATE_FORMAT(f.created_at,'%Y-%m-%d') AS day,f.code,COUNT(*) AS flows,
                SUM((flags & 1)>0) AS landing_views,SUM((flags & 2)>0) AS offer_views,SUM((flags & 4)>0) AS cta_clicks,
                SUM((flags & 8)>0) AS inquiry_starts,SUM((flags & 16)>0) AS form_errors,SUM((flags & 32)>0) AS inquiry_successes,
                SUM(validation_error>0) AS validation_errors,SUM(technical_error>0) AS technical_errors,
                SUM((flags & 8)>0 AND (flags & 32)>0) AS started_and_saved
                FROM site_measurement_flows f INNER JOIN site_measurement_consents c ON c.receipt_hash=f.receipt_hash
                WHERE c.revoked_at IS NULL AND c.expires_at>UTC_TIMESTAMP() AND c.version=? AND c.environment=?
                AND f.created_at>DATE_SUB(UTC_TIMESTAMP(),INTERVAL 7 DAY)
                GROUP BY DATE_FORMAT(f.created_at,'%Y-%m-%d'),f.code ORDER BY day DESC,f.code`, [SITE_CONSENT_VERSION, environment]);
            const allowed=siteSummary(rows);
            const [activityRows]=await db.execute(`SELECT DATE_FORMAT(f.created_at,'%Y-%m-%d') AS day,f.code,f.entry_class,
                (f.flags & 1)>0 AS landed,(f.flow_expires_at<=UTC_TIMESTAMP()) AS expired,a.state_json FROM site_measurement_flows f
                INNER JOIN site_measurement_consents c ON c.receipt_hash=f.receipt_hash
                LEFT JOIN site_measurement_activity a ON a.receipt_hash=f.receipt_hash AND a.flow_hash=f.flow_hash
                WHERE c.revoked_at IS NULL AND c.expires_at>UTC_TIMESTAMP() AND c.version=? AND c.environment=?
                AND f.created_at>DATE_SUB(UTC_TIMESTAMP(),INTERVAL 7 DAY) LIMIT 5001`,[SITE_CONSENT_VERSION,environment]);
            const activity=activityRows.length>5000?null:siteActivityReport(activityRows,rows,allowed);
            const publication=await releaseSiteMeasurements({db,lock,now:clock(),cohorts:rows,rows:allowed,activity});
            return { enabled: true, environment, ...publication, activityStatus:activity===null?'capacity_unavailable':'available', booking: 'not_instrumented', counting: 'consented_30_minute_memory_flows', retentionDays: 7, smallCellThreshold: 5 };
        },
    };
}
export function registerSiteMeasurementRoutes(app, { service, sameOrigin, limiter, revokeLimiter = limiter, getAdminMember }) {
    for (const action of ['consent','revoke','event','activity']) app.post('/api/site-measurement/' + action, action === 'revoke' ? revokeLimiter : limiter, sameOrigin, async (req, res) => {
        res.set('Cache-Control', 'no-store');
        if (action !== 'revoke' && !service.enabled) return res.status(404).json({ ok: false });
        try {
            const ok = action === 'consent' ? await service.grant(req.body) : action === 'revoke'
                ? Object.keys(req.body || {}).length === 3 && req.body.schema_version === 1
                    && req.body.environment === service.environment && await service.revoke(req.body.receipt) : action === 'activity' ? await service.activity(req.body) : await service.record(req.body);
            return res.status(ok ? 202 : 400).json({ ok: Boolean(ok) });
        } catch { return res.status(503).json({ ok: false }); }
    });
    app.get('/api/admin/site-measurement', async (req, res) => {
        if (!await getAdminMember(req, res)) return;
        res.set('Cache-Control', 'no-store');
        try { return res.json({ ok: true, ...await service.summary() }); }
        catch { return res.status(503).json({ ok: false }); }
    });
}
