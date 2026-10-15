import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import express from 'express';
import { closingQuestions, closingScaleKeys, normalizeClosingSubmission, compareClosingScores, questionVisible } from '../shared/closingQuestionnaire.js';
import { createClosingService, registerClosingRoutes, closingCsv } from '../server/closingQuestionnaire.js';

const form = () => ({ name: 'Funktionstest', email: 'test@example.invalid', requestId: '12345678-1234-4123-8123-123456789abc', privacyConsent: true, contactRequested: false,
  answers: Object.fromEntries(closingQuestions.filter(q => q.required && !q.when).map(q => [q.key, q.type === 'scale' ? 0 : q.key === 'directions' ? ['integration'] : 'Meine eigene Erfahrung.'])) });

test('all eight baseline questions have exactly the original wording and zero is valid', () => {
  const original = fs.readFileSync(new URL('../src/sections/OnboardingQuestionnaire.jsx', import.meta.url), 'utf8');
  assert.equal(closingQuestions.filter(q => q.type === 'scale').length, 8);
  for (const key of closingScaleKeys) {
    const q = closingQuestions.find(q => q.key === key);
    assert.ok(original.includes(`name="${key}" label="${q.label}"`));
    assert.equal(normalizeClosingSubmission(form()).answers[key], 0);
  }
  for (const bad of ['', '5', null, false, undefined, -1, 11, 1.5, NaN]) { const f = form(); f.answers.h01 = bad; assert.throws(() => normalizeClosingSubmission(f)); }
});
test('identity, consent, text limits, enums and exclusive choices are checked server-side', () => {
  assert.throws(() => normalizeClosingSubmission({ ...form(), privacyConsent: false }));
  for (const changes of [{ email: 'bad' }, { name: 'a\nb' }, { requestId: 'not-a-request' }]) assert.throws(() => normalizeClosingSubmission({ ...form(), ...changes }));
  const f = form(); f.answers.scene = ' '; assert.throws(() => normalizeClosingSubmission(f));
  f.answers.scene = 'x'.repeat(3001); assert.throws(() => normalizeClosingSubmission(f));
  f.answers.scene = 'Ein Beispiel.'; f.answers.directions = ['integration', 'none']; assert.throws(() => normalizeClosingSubmission(f));
  f.answers.directions = ['integration']; f.answers.duration = '12'; assert.throws(() => normalizeClosingSubmission(f));
});
test('continuation allows 1, 2, 3 months, projects, other support and an unanchored budget', () => {
  for (const duration of ['1', '2', '3', 'other', 'undecided']) {
    const f = form(); Object.assign(f.answers, { directions: ['integration', 'project', 'other'], duration, budgetState: 'amount', budgetAmount: 0, budgetBasis: 'monthly' });
    assert.equal(normalizeClosingSubmission(f).answers.budgetAmount, 0);
  }
  for (const amount of [-1, '150', Infinity, NaN, 1.234]) {
    const f = form(); Object.assign(f.answers, { budgetState: 'amount', budgetAmount: amount, budgetBasis: 'total' });
    assert.throws(() => normalizeClosingSubmission(f));
  }
  const f = form(); Object.assign(f.answers, { budgetState: 'amount', budgetAmount: 155.55, budgetBasis: 'total' });
  assert.equal(normalizeClosingSubmission(f).answers.budgetAmount, 155.55);
  f.answers.budgetBasis = ''; assert.throws(() => normalizeClosingSubmission(f));
});
test('switching direction strips hidden project, duration and budget answers', () => {
  const f = form(); Object.assign(f.answers, { directions: ['none'], project: 'Old project', duration: 'other', durationOther: 'Old duration', budgetState: 'amount', budgetAmount: 500, budgetBasis: 'monthly' });
  const result = normalizeClosingSubmission(f);
  for (const key of ['project','duration','durationOther','budgetState','budgetAmount','budgetBasis']) assert.ok(!Object.hasOwn(result.answers, key));
  assert.equal(questionVisible(closingQuestions.find(q => q.key === 'project'), { directions: ['integration'] }), false);
});
test('missing baselines and unanswered optional questions are not fabricated', () => {
  const a = normalizeClosingSubmission(form()).answers;
  assert.equal(a.parts, null);
  const rows = compareClosingScores(a, null); assert.ok(rows.every(r => r.before === null && r.difference === null));
  const burden = compareClosingScores({ ...a, b03: 3 }, { b03: 7 }).find(r => r.key === 'b03');
  assert.equal(burden.difference, -4); assert.equal(burden.lowerIsLessBurden, true);
});

function fakeDb(baselines = []) {
  const saved = [], writes = [];
  return { saved, writes, async execute(sql, values = []) {
    writes.push({ sql, values });
    if (sql.startsWith('SELECT reference_code')) return [saved.filter(r => r.request_id === values[0])];
    if (sql.includes('FROM zepter_onboarding_submissions')) return [baselines];
    if (sql.startsWith('INSERT')) {
      if (saved.some(r => r.request_id === values[0])) { const e = new Error('duplicate'); e.code = 'ER_DUP_ENTRY'; throw e; }
      saved.push({ request_id: values[0], email: values[3], reference_code: values[5] }); return [{ insertId: saved.length }];
    }
    if (sql.startsWith('UPDATE')) return [{ affectedRows: 1 }];
    throw new Error('Unexpected SQL in test');
  }};
}
test('public form is saved before email; repeated requests do not duplicate or send again', async () => {
  const db = fakeDb([{ id: 1, h01: 0, b03: '7' }]); let sent = 0;
  const service = createClosingService({ db, sendNotification: async () => { assert.equal(db.saved.length, 1); sent++; }, sendConfirmation: async () => sent++ });
  const first = await service.submit(null, form()), again = await service.submit(null, form());
  assert.equal(first.reference, again.reference); assert.equal(again.duplicate, true); assert.equal(sent, 2);
  const insert = db.writes.find(x => x.sql.startsWith('INSERT'));
  assert.equal(insert.values[1], null); assert.equal(insert.values[8], 'matched');
  assert.equal(JSON.parse(insert.values[7]).b03, 7);
  assert.ok(!db.writes.some(x => /^(INSERT|UPDATE|DELETE).*zepter_onboarding/u.test(x.sql)));
});
test('ambiguous baselines stay unassigned and an email mismatch is not a member link', async () => {
  const db = fakeDb([{ id: 1 }, { id: 2 }]);
  const service = createClosingService({ db, sendNotification: async () => {}, sendConfirmation: async () => {} });
  await service.submit({ id: 4, email: 'other@example.invalid' }, form());
  const insert = db.writes.find(x => x.sql.startsWith('INSERT'));
  assert.equal(insert.values[1], null); assert.equal(insert.values[7], null); assert.equal(insert.values[8], 'ambiguous');
});
test('concurrent retries create one record and deliver one pair of emails', async () => {
  const db = fakeDb(); let sent = 0;
  const service = createClosingService({ db, sendNotification: async () => sent++, sendConfirmation: async () => sent++ });
  const result = await Promise.all([service.submit(null, form()), service.submit(null, form())]);
  assert.equal(db.saved.length, 1); assert.equal(sent, 2); assert.equal(result[0].reference, result[1].reference);
});
test('SMTP failure does not erase a saved answer or cause repeated delivery', async () => {
  const db = fakeDb(); let sent = 0;
  const service = createClosingService({ db, sendNotification: async () => { sent++; throw new Error('smtp'); }, sendConfirmation: async () => {} });
  const result = await service.submit(null, form());
  assert.equal(db.saved.length, 1); assert.equal(result.notificationStatus, 'failed');
  await service.submit(null, form()); assert.equal(sent, 1);
});
test('CSV quotes and formula injection are handled without losing zero values', () => {
  const csv = closingCsv([{ reference: 'r', name: '=1+1', email: 'e', createdAt: 'd', version: 'v', baselineStatus: 'missing', answers: { h01: 0 }, comparison: [] }]);
  assert.ok(csv.includes('"\'=1+1"')); assert.ok(csv.includes('"0"'));
});

test('public endpoints disclose no previous answers; admin list and exports require admin', async () => {
  const app = express(); app.use(express.json()); let saved = 0;
  const service = { list: async () => [], submit: async () => { saved++; return { reference: 'test' }; } };
  registerClosingRoutes(app, { enabled: true, service, getMember: async req => req.get('x-test-role') ? { id: 1, role: req.get('x-test-role') } : null,
    limiter: (_req,_res,next) => next(), sameOrigin: (req,res,next) => req.get('origin') === 'https://example.invalid' ? next() : res.status(403).end() });
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const pub = await fetch(base + '/api/zepter/closing?email=someone@example.invalid');
    assert.equal(pub.status, 200); assert.deepEqual(Object.keys(await pub.json()).sort(), ['ok','version']);
    for (const endpoint of ['/api/admin/closing','/api/admin/closing/export','/api/admin/closing/export?format=json']) {
      assert.equal((await fetch(base + endpoint)).status, 401);
      assert.equal((await fetch(base + endpoint, { headers: { 'x-test-role': 'member' } })).status, 403);
      assert.equal((await fetch(base + endpoint, { headers: { 'x-test-role': 'admin' } })).status, 200);
    }
    assert.equal((await fetch(base + '/api/zepter/closing', { method: 'POST' })).status, 403);
    assert.equal((await fetch(base + '/api/zepter/closing', { method: 'POST', headers: { origin: 'https://example.invalid' } })).status, 201);
    assert.equal(saved, 1);
    assert.equal((await fetch(base + '/api/zepter/closing', { method: 'POST', headers: { origin: 'https://example.invalid', 'Content-Type': 'application/json' }, body: JSON.stringify({ company: 'bot' }) })).status, 400);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
