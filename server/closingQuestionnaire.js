import crypto from 'node:crypto';
import { closingVersion, closingScaleKeys, closingQuestions, normalizeClosingSubmission, ClosingValidationError, compareClosingScores, displayAnswer } from '../shared/closingQuestionnaire.js';

export async function initializeClosingQuestionnaire(db) {
  // Separate, additive table: start questionnaires and the earlier draft remain intact.
  await db.execute(`CREATE TABLE IF NOT EXISTS zepter_closing_responses (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    request_id CHAR(36) NOT NULL UNIQUE,
    member_id BIGINT UNSIGNED NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    questionnaire_version VARCHAR(64) NOT NULL,
    reference_code VARCHAR(48) NOT NULL UNIQUE,
    answers_json JSON NOT NULL,
    baseline_json JSON NULL,
    baseline_status VARCHAR(24) NOT NULL,
    consent_version VARCHAR(48) NOT NULL,
    consent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    contact_requested TINYINT(1) NOT NULL DEFAULT 0,
    notification_status VARCHAR(24) NOT NULL DEFAULT 'pending',
    confirmation_status VARCHAR(24) NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX closing_email_idx (email),
    INDEX closing_created_idx (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}
const parse = value => typeof value === 'string' ? JSON.parse(value) : value;
export function createClosingService({ db, sendNotification, sendConfirmation }) {
  const existing = async requestId => {
    const [rows] = await db.execute('SELECT reference_code, email FROM zepter_closing_responses WHERE request_id = ?', [requestId]);
    return rows[0] || null;
  };
  return {
    async submit(member, body) {
      const form = normalizeClosingSubmission(body);
      const previous = await existing(form.requestId);
      if (previous) {
        if (previous.email !== form.email) throw new ClosingValidationError('requestId');
        return { reference: previous.reference_code, duplicate: true };
      }
      const [baselines] = await db.execute(`SELECT id, reference_code, created_at, main_topic, goal_statement, h01, h02, h03, h04, h05, b01, b02, b03
        FROM zepter_onboarding_submissions WHERE LOWER(TRIM(email)) = ? ORDER BY created_at DESC LIMIT 2`, [form.email]);
      const baselineStatus = baselines.length === 1 ? 'matched' : baselines.length ? 'ambiguous' : 'missing';
      const baseline = baselines.length === 1 ? { ...baselines[0] } : null;
      if (baseline) for (const key of closingScaleKeys) {
        const raw = baseline[key];
        const number = raw === null || raw === undefined || raw === '' ? null : Number(raw);
        baseline[key] = Number.isInteger(number) && number >= 0 && number <= 10 ? number : null;
      }
      const reference = `SH-ABS-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
      // A typed email is only an internal matching suggestion, never authentication.
      const memberId = member?.email?.trim().toLowerCase() === form.email ? member.id : null;
      let result;
      try {
        [result] = await db.execute(`INSERT INTO zepter_closing_responses (request_id, member_id, name, email, questionnaire_version, reference_code, answers_json, baseline_json, baseline_status, consent_version, contact_requested) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [form.requestId, memberId, form.name, form.email, closingVersion, reference, JSON.stringify(form.answers), baseline ? JSON.stringify(baseline) : null, baselineStatus, form.consentVersion, Number(form.contactRequested)]);
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') throw error;
        const saved = await existing(form.requestId);
        if (!saved || saved.email !== form.email) throw error;
        return { reference: saved.reference_code, duplicate: true };
      }
      const deliver = async (column, send) => {
        let status = 'sent';
        try { await send({ name: form.name, email: form.email, reference }); }
        catch { status = 'failed'; }
        // Once stored, the response is successful even if SMTP or its status update fails.
        try { await db.execute(`UPDATE zepter_closing_responses SET ${column} = ? WHERE id = ?`, [status, result.insertId]); }
        catch { status = 'unknown'; }
        return status;
      };
      const [notificationStatus, confirmationStatus] = await Promise.all([
        deliver('notification_status', sendNotification),
        deliver('confirmation_status', sendConfirmation),
      ]);
      return { reference, notificationStatus, confirmationStatus, duplicate: false };
    },
    async list() {
      const [rows] = await db.execute('SELECT * FROM zepter_closing_responses ORDER BY created_at DESC LIMIT 1000');
      return rows.map(row => {
        const answers = parse(row.answers_json), baseline = parse(row.baseline_json);
        return { reference: row.reference_code, name: row.name, email: row.email, version: row.questionnaire_version, createdAt: row.created_at, answers, baseline, baselineStatus: row.baseline_status,
          identityVerified: row.member_id !== null && row.member_id !== undefined,
          contactRequested: !!Number(row.contact_requested), notificationStatus: row.notification_status, confirmationStatus: row.confirmation_status,
          comparison: compareClosingScores(answers, baseline) };
      });
    },
  };
}

// Spreadsheet applications must not evaluate submitted answers as formulas.
const csvCell = value => {
  const text = String(value ?? '');
  return `"${(/^[\s]*[=+\-@\t\r]/u.test(text) ? "'" : '') + text.replaceAll('"', '""')}"`;
};
export function closingCsv(items) {
  const headings = ['Referenz', 'Name', 'E-Mail', 'Eingang', 'Version', 'Startzuordnung', 'Kontakt gewünscht', ...closingQuestions.map(q => q.label), ...closingScaleKeys.flatMap(k => [`${k} Beginn`, `${k} Änderung`])];
  const rows = items.map(item => [item.reference, item.name, item.email, String(item.createdAt), item.version, item.baselineStatus, item.contactRequested ? 'Ja' : 'Nein',
    ...closingQuestions.map(q => displayAnswer(q, item.answers[q.key])), ...item.comparison.flatMap(r => [r.before, r.difference])]);
  return '\uFEFF' + [headings, ...rows].map(row => row.map(csvCell).join(';')).join('\r\n');
}

export function registerClosingRoutes(app, { service, getMember, sameOrigin, limiter, enabled }) {
  const availability = (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (!enabled) return res.status(404).json({ ok: false, error: 'not_available' });
    next();
  };
  const admin = async (req, res, next) => {
    try {
      const member = await getMember(req);
      if (!member) return res.status(401).json({ ok: false, error: 'unauthorized' });
      if (member.role !== 'admin') return res.status(403).json({ ok: false, error: 'forbidden' });
      next();
    } catch { res.status(500).json({ ok: false, error: 'server' }); }
  };
  app.get('/api/zepter/closing', availability, (_req, res) => res.json({ ok: true, version: closingVersion }));
  app.post('/api/zepter/closing', availability, limiter, sameOrigin, async (req, res) => {
    try {
      if (req.body?.company) return res.status(400).json({ ok: false, error: 'validation', field: 'form' });
      const member = await getMember(req);
      const result = await service.submit(member, req.body);
      res.status(result.duplicate ? 200 : 201).json({ ok: true, ...result });
    } catch (error) {
      const validation = error instanceof ClosingValidationError;
      res.status(validation ? 400 : 500).json({ ok: false, error: validation ? 'validation' : 'server', ...(validation ? { field: error.field } : {}) });
    }
  });
  app.get('/api/admin/closing', availability, admin, async (_req, res) => {
    try { res.json({ ok: true, submissions: await service.list() }); }
    catch { res.status(500).json({ ok: false, error: 'server' }); }
  });
  app.get('/api/admin/closing/export', availability, admin, async (req, res) => {
    try {
      const items = await service.list();
      res.set('Content-Disposition', `attachment; filename="Spirit-Healing-Abschlussboegen.${req.query.format === 'json' ? 'json' : 'csv'}"`);
      if (req.query.format === 'json') return res.json({ version: closingVersion, submissions: items });
      res.type('text/csv; charset=utf-8').send(closingCsv(items));
    } catch { res.status(500).json({ ok: false, error: 'server' }); }
  });
}
