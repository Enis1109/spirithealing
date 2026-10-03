import assert from 'node:assert/strict';
import test from 'node:test';
import { activeAccess, canReadSession, canReadRecording, addCalendarMonths, annualRenewal, renewalReminder,
    normalizeExperienceSession, normalizeExperienceGrant, normalizeExperienceJoinUrl, utcInput, experiencePlans } from '../server/experiencePolicy.js';
import { createExperienceService } from '../server/experienceGroup.js';
import { registerExperienceRoutes } from '../server/experienceRoutes.js';
import express from 'express';
import { writeExperienceDescription } from '../src/lib/experienceDescription.js';

const now = new Date('2026-09-28T10:00:00Z');
const access = { member_id: 1, plan: 'annual', status: 'active', starts_at: '2026-09-20 00:00:00.000',
    ends_at: '2027-09-20 00:00:00.000', content_from: '2026-09-20 00:00:00.000', full_archive: 0 };
const meeting = { id: 1, title: 'Testtreffen', summary: '', occurred_at: '2026-09-27 17:00:00.000',
    status: 'published', published_at: '2026-09-28 08:00:00.000', vimeo_id: '123456789', vimeo_hash: 'abcdef12' };
const member = { id: 1, role: 'member' };
const admin = { id: 2, role: 'admin' };

test('exact prices and annual non-recurring configuration', () => {
    assert.equal(experiencePlans.monthly.amount, 8800);
    assert.equal(experiencePlans.annual.amount, 88800);
    assert.equal(experiencePlans.monthly.recurring, true);
    assert.equal(experiencePlans.annual.months, 12);
    assert.equal(experiencePlans.annual.recurring, false);
});
test('access starts inclusive, expires exclusive and fails closed', () => {
    assert.equal(activeAccess(access, now), true);
    assert.equal(activeAccess(access, new Date(access.starts_at.replace(' ', 'T') + 'Z')), true);
    assert.equal(activeAccess(access, new Date('2027-09-20T00:00:00Z')), false);
    assert.equal(activeAccess({ ...access, status: 'revoked' }, now), false);
    assert.equal(activeAccess({ ...access, ends_at: 'broken' }, now), false);
    assert.equal(activeAccess(null, now), false);
});
test('new member sees only meetings since activation, even when old ones are uploaded later', () => {
    assert.equal(canReadSession(access, meeting, now), true);
    assert.equal(canReadSession(access, { ...meeting, occurred_at: '2026-09-13 17:00:00' }, now), false);
    assert.equal(canReadSession(access, { ...meeting, occurred_at: access.content_from }, now), true);
});
test('legacy access includes historical approved meetings, not drafts or future releases', () => {
    const legacy = { ...access, full_archive: 1 };
    assert.equal(canReadSession(legacy, { ...meeting, occurred_at: '2025-01-01 17:00:00' }, now), true);
    for (const change of [{ status: 'draft' }, { status: 'archived' }, { published_at: null },
        { published_at: '2026-09-29 00:00:00' }, { occurred_at: '2026-10-04 17:00:00' }]) {
        assert.equal(canReadSession(legacy, { ...meeting, ...change }, now), false);
    }
});
test('explicit preview releases a published future topic and handouts, not recordings', () => {
    const upcoming = { ...meeting, occurred_at: '2026-10-04 17:00:00.000',
        summary: writeExperienceDescription('Testthema', 'Beschreibung.', true) };
    assert.equal(canReadSession(access, upcoming, now), true);
    assert.equal(canReadRecording(access, upcoming, now), false);
    assert.equal(canReadRecording(access, upcoming, new Date('2026-10-04T17:00:00Z')), true);
    assert.equal(canReadSession(access, { ...upcoming, summary: 'Beschreibung.' }, now), false);
    for (const change of [{ status: 'draft' }, { status: 'archived' }, { published_at: null },
        { published_at: '2026-10-05 00:00:00' }, { occurred_at: 'broken' }]) {
        assert.equal(canReadSession({ ...access, full_archive: 1 }, { ...upcoming, ...change }, now), false);
    }
    for (const invalidAccess of [null, { ...access, status: 'revoked' }, { ...access, ends_at: now.toISOString() },
        { ...access, starts_at: '2026-10-01 00:00:00' }, { ...access, content_from: '2026-10-05 00:00:00' }]) {
        assert.equal(canReadSession(invalidAccess, upcoming, now), false);
    }
});
test('existing monthly group may remain open-ended pending manual payment reconciliation', () => {
    const legacy = { ...access, plan: 'existing', ends_at: null, full_archive: 1 };
    assert.equal(activeAccess(legacy, now), true);
    assert.equal(canReadSession(legacy, { ...meeting, occurred_at: '2025-01-01 17:00:00' }, now), true);
    assert.equal(activeAccess({ ...legacy, status: 'revoked' }, now), false);
    assert.equal(activeAccess({ ...legacy, starts_at: '2026-10-01 00:00:00' }, now), false);
    assert.equal(activeAccess({ ...legacy, ends_at: 'broken' }, now), false);
    assert.equal(activeAccess({ ...legacy, ends_at: undefined }, now), false);
    for (const plan of ['monthly', 'annual']) assert.equal(activeAccess({ ...legacy, plan }, now), false);
    assert.equal(renewalReminder(legacy, now), null);
});
test('calendar renewal handles leap day and month end', () => {
    assert.equal(addCalendarMonths('2028-02-29T19:00:00Z', 12), '2029-02-28T19:00:00.000Z');
    assert.equal(addCalendarMonths('2026-01-31T19:00:00Z', 1), '2026-02-28T19:00:00.000Z');
});
test('early renewal extends the old end without temporarily suspending current access', () => {
    const renewal = annualRenewal({ ...access, full_archive: 1 }, now);
    assert.equal(renewal.startsAt, '2026-09-20T00:00:00.000Z');
    assert.equal(renewal.endsAt, '2028-09-20T00:00:00.000Z');
    assert.equal(renewal.contentFrom, access.content_from);
    assert.equal(renewal.fullArchive, true);
    assert.equal(renewal.requiresReview, false);
});
test('membership gaps are not silently filled with archive access', () => {
    const renewal = annualRenewal({ ...access, ends_at: '2026-09-01 00:00:00', full_archive: 1 }, now);
    assert.equal(renewal.requiresReview, true);
    assert.equal(renewal.fullArchive, false);
    assert.equal(renewal.contentFrom, now.toISOString());
});
test('reminders use Berlin calendar days, stable dedupe keys, and stop after extension', () => {
    const a = { ...access, ends_at: '2026-10-28 18:00:00' };
    assert.equal(renewalReminder(a, now).days, 30);
    assert.equal(renewalReminder(a, now).key, renewalReminder(a, new Date('2026-09-28T20:00:00Z')).key);
    assert.equal(renewalReminder(a, new Date('2026-10-21T09:00:00Z')).days, 7);
    assert.equal(renewalReminder(a, new Date('2026-10-28T09:00:00Z')).days, 0);
    assert.equal(renewalReminder(a, new Date('2026-10-28T18:00:00Z')), null);
    assert.equal(renewalReminder({ ...a, ends_at: '2027-10-28 18:00:00' }, now), null);
    assert.equal(renewalReminder({ ...a, plan: 'monthly' }, now), null);
});
test('date validation rejects impossible or ambiguous inputs', () => {
    for (const value of ['2026-02-30T10:00:00Z', '2026-09-28T25:00:00Z', '2026-09-28T10:00', 'bad'])
        assert.throws(() => utcInput(value, 'date'));
    assert.equal(utcInput('2026-09-28T10:00Z', 'date'), now.toISOString());
});
test('session publication requires approval; video URLs cannot be injected', () => {
    const body = { title: 'Treffen', status: 'draft', occurredAt: now.toISOString() };
    assert.equal(normalizeExperienceSession(body).status, 'draft');
    assert.throws(() => normalizeExperienceSession({ ...body, status: 'published' }));
    assert.equal(normalizeExperienceSession({ ...body, status: 'published', reviewed: true }).status, 'published');
    assert.throws(() => normalizeExperienceSession({ ...body, vimeoId: 'https://example.org' }));
    assert.throws(() => normalizeExperienceSession({ ...body, vimeoHash: 'abc&bad=true' }));
});
test('manual grants require explicit archive choice, dates and audit reason', () => {
    const body = { email: 'member@example.test', plan: 'existing', status: 'active', fullArchive: false,
        startsAt: '2026-09-01T00:00:00Z', endsAt: '2026-10-01T00:00:00Z', contentFrom: '2026-09-01T00:00:00Z', reason: 'Test' };
    assert.equal(normalizeExperienceGrant(body).fullArchive, false);
    for (const change of [{ reason: '' }, { fullArchive: 'true' }, { endsAt: body.startsAt }, { plan: 'unknown' }])
        assert.throws(() => normalizeExperienceGrant({ ...body, ...change }));
});
test('only explicitly chosen existing-member grants accept an empty end date', () => {
    const body = { email: 'member@example.test', plan: 'existing', status: 'active', fullArchive: true,
        startsAt: '2026-09-28T10:00:00Z', endsAt: null, contentFrom: '2026-09-28T10:00:00Z',
        reason: 'Bestandsgruppe laut Freigabe; Zahlungsabgleich folgt' };
    assert.equal(normalizeExperienceGrant(body).endsAt, null);
    assert.equal(normalizeExperienceGrant({ ...body, endsAt: '' }).endsAt, null);
    for (const plan of ['monthly', 'annual']) assert.throws(() => normalizeExperienceGrant({ ...body, plan }));
    assert.throws(() => normalizeExperienceGrant({ ...body, endsAt: 'bad' }));
});

const serviceFor = (membership = access, sessions = [meeting], joinUrl = null, at = now) => {
    const calls = [];
    const db = { async execute(query, params) {
        const sql = typeof query === 'string' ? query : query.sql; calls.push(sql);
        if (sql.includes('experience_memberships')) return [[membership].filter(Boolean)];
        if (sql.includes('experience_sessions')) return [sql.includes('WHERE id') ? sessions.filter(s => s.id === params[0]) : sessions];
        if (sql.includes('file_bytes FROM')) return [[{ file_bytes: Buffer.from('%PDF-1.7 test') }]];
        if (sql.includes('WHERE id')) return [[{ id: 8, session_id: 1, title: 'Handout' }]];
        if (sql.includes('experience_handouts')) return [[{ id: 8, title: 'Handout' }]];
        throw new Error('unexpected_query');
    } };
    return { service: createExperienceService({ db, clock: () => at, joinUrl }), calls };
};

test('live link accepts only HTTPS Zoom meeting links and rejects lookalike hosts', () => {
    assert.equal(normalizeExperienceJoinUrl('https://us06web.zoom.us/j/12345678901?pwd=synthetic'),
        'https://us06web.zoom.us/j/12345678901?pwd=synthetic');
    assert.equal(normalizeExperienceJoinUrl(null), null);
    for (const url of ['javascript:alert(1)', 'http://zoom.us/j/12345678901',
        'https://zoom.us.evil.test/j/12345678901', 'https://evilzoom.us/j/12345678901',
        'https://user@zoom.us/j/12345678901', 'https://zoom.us:8443/j/12345678901',
        'https://zoom.us/rec/play/private', 'https://zoom.us/j/12345678901#private'])
        assert.throws(() => normalizeExperienceJoinUrl(url));
});
test('live link is available only to current group members and never included in overview', async () => {
    const joinUrl = 'https://us06web.zoom.us/j/12345678901?pwd=synthetic';
    for (const membership of [null, { ...access, status: 'revoked' }, { ...access, ends_at: now.toISOString() }]) {
        const { service } = serviceFor(membership, [meeting], joinUrl);
        assert.equal(await service.live(member), null);
        const data = await service.overview(member);
        assert.equal(data.liveAvailable, false);
        assert.equal(JSON.stringify(data).includes('synthetic'), false);
    }
    const { service } = serviceFor({ ...access, plan: 'existing', ends_at: null }, [meeting], joinUrl);
    assert.equal(await service.live(member), joinUrl);
    assert.equal((await service.overview(member)).liveAvailable, true);
    assert.equal(JSON.stringify(await service.overview(member)).includes(joinUrl), false);
    assert.equal(await serviceFor().service.live(admin), null);
});
test('live redirect checks login and access, prevents caching and does not leak denied links', async t => {
    const app = express();
    const joinUrl = 'https://us06web.zoom.us/j/12345678901?pwd=synthetic';
    const { service } = serviceFor(null, [meeting], joinUrl);
    registerExperienceRoutes(app, { service, enabled: true,
        getMember: async req => req.headers['x-test-role'] === 'admin' ? admin : req.headers['x-test-role'] === 'member' ? member : null,
        sameOrigin: (_req, _res, next) => next() });
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
    const url = `http://127.0.0.1:${server.address().port}/api/members/experience/live`;
    for (const role of ['', 'member']) {
        const response = await fetch(url, { headers: { 'x-test-role': role }, redirect: 'manual' });
        assert.equal(response.status, role ? 404 : 401);
        assert.equal(response.headers.get('location'), null);
    }
    const response = await fetch(url, { headers: { 'x-test-role': 'admin' }, redirect: 'manual' });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), joinUrl);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
});
test('inactive overview never returns private titles, hashes, or handout URLs', async () => {
    const { service, calls } = serviceFor(null);
    const result = await service.overview(member);
    assert.deepEqual(result.sessions, []);
    assert.equal(calls.length, 1);
});
test('active overview excludes old meetings and video hashes', async () => {
    const { service } = serviceFor(access, [meeting, { ...meeting, id: 2, occurred_at: '2026-09-13 17:00:00' }]);
    const result = await service.overview(member);
    assert.equal(result.sessions.length, 1);
    assert.equal(result.sessions[0].vimeoHash, undefined);
    assert.equal(result.sessions[0].handouts[0].url, '/api/members/experience/handouts/8');
});
test('open-ended existing access survives serialization without leaking video hashes', async () => {
    const { service } = serviceFor({ ...access, plan: 'existing', ends_at: null, full_archive: 1 });
    const result = await service.overview(member);
    assert.equal(result.active, true);
    assert.equal(result.access.endsAt, null);
    assert.equal(result.sessions.length, 1);
    assert.equal(result.sessions[0].vimeoHash, undefined);
});
test('existing grant stores a NULL end and retains the administrative audit trail', async () => {
    const writes = [];
    let committed = false;
    const conn = { async beginTransaction() {}, async commit() { committed = true; },
        async rollback() {}, release() {}, async execute(sql, values) {
            if (sql.startsWith('SELECT id FROM members')) return [[{ id: 7 }]];
            if (sql.startsWith('SELECT * FROM experience_memberships')) return [[]];
            writes.push({ sql, values }); return [{ affectedRows: 1 }];
        } };
    const service = createExperienceService({ db: { getConnection: async () => conn } });
    const result = await service.grant(admin, { email: 'member@example.test', plan: 'existing',
        status: 'active', fullArchive: true, startsAt: now.toISOString(), endsAt: null,
        contentFrom: now.toISOString(), reason: 'Bestandsgruppe; Zahlungsabgleich später' });
    assert.equal(result.endsAt, null);
    assert.equal(result.fullArchive, true);
    assert.equal(writes[0].values[4], null);
    assert.match(writes[1].sql, /experience_access_audit/);
    assert.equal(committed, true);
});
test('direct recording and handout requests cannot bypass old-meeting restrictions', async () => {
    const { service, calls } = serviceFor(access, [{ ...meeting, occurred_at: '2026-09-13 17:00:00' }]);
    assert.equal(await service.recording(member, 1), null);
    assert.equal(await service.handout(member, 8), null);
    assert.equal(calls.some(sql => sql.includes('file_bytes FROM')), false);
    assert.match(await service.recording(admin, 1), /^https:\/\/player.vimeo.com\/video\/123456789\?dnt=1&h=abcdef12$/);
});
test('future preview appears once with a downloadable PDF and never exposes a premature video', async () => {
    const upcoming = { ...meeting, occurred_at: '2026-10-04 17:00:00.000',
        summary: writeExperienceDescription('Testthema', 'Beschreibung.', true) };
    const { service } = serviceFor(access, [upcoming]);
    const overview = await service.overview(member);
    assert.equal(overview.sessions.length, 1);
    assert.equal(overview.sessions[0].occurredAt, '2026-10-04T17:00:00.000Z');
    assert.equal(overview.sessions[0].recordingAvailable, false);
    assert.equal(overview.sessions[0].vimeoHash, undefined);
    assert.equal(overview.sessions[0].handouts[0].url, '/api/members/experience/handouts/8');
    assert.match((await service.handout(member, 8)).toString(), /^%PDF-/);
    assert.equal(await service.recording(member, 1), null);
    const after = serviceFor(access, [upcoming], null, new Date('2026-10-04T17:00:00Z')).service;
    assert.equal((await after.overview(member)).sessions[0].recordingAvailable, true);
    assert.match(await after.recording(member, 1), /^https:\/\/player\.vimeo\.com\//);
    for (const membership of [null, { ...access, status: 'revoked' }, { ...access, ends_at: now.toISOString() }]) {
        const blocked = serviceFor(membership, [upcoming]).service;
        assert.deepEqual((await blocked.overview(member)).sessions, []);
        assert.equal(await blocked.handout(member, 8), null);
        assert.equal(await blocked.recording(member, 1), null);
    }
    const archived = serviceFor(access, [{ ...upcoming, status: 'archived' }]).service;
    assert.deepEqual((await archived.overview(member)).sessions, []);
    assert.equal(await archived.handout(member, 8), null);
});
test('HTTP preview permits the protected PDF but denies future recording and anonymous requests', async t => {
    const upcoming = { ...meeting, occurred_at: '2026-10-04 17:00:00.000',
        summary: writeExperienceDescription('Testthema', 'Beschreibung.', true) };
    const { service } = serviceFor(access, [upcoming]);
    const app = express();
    registerExperienceRoutes(app, { service, enabled: true,
        getMember: async req => req.headers['x-test-role'] === 'admin' ? admin : req.headers['x-test-role'] === 'member' ? member : null,
        sameOrigin: (_req, _res, next) => next() });
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
    const base = `http://127.0.0.1:${server.address().port}`;
    const headers = { 'x-test-role': 'member' };
    const overview = await fetch(base + '/api/members/experience', { headers });
    assert.equal(overview.status, 200);
    assert.equal((await overview.json()).sessions[0].recordingAvailable, false);
    const pdf = await fetch(base + '/api/members/experience/handouts/8', { headers });
    assert.equal(pdf.status, 200);
    assert.match(await pdf.text(), /^%PDF-/);
    assert.equal(pdf.headers.get('cache-control'), 'no-store');
    const videoPath = '/api/members/experience/sessions/1/recording';
    assert.equal((await fetch(base + videoPath, { headers })).status, 404);
    for (const path of ['/api/members/experience', '/api/members/experience/handouts/8', videoPath])
        assert.equal((await fetch(base + path)).status, 401);
    assert.equal((await fetch(base + videoPath, { headers: { 'x-test-role': 'admin' } })).status, 200);
});
test('expired members cannot download handouts or obtain video URLs', async () => {
    const { service } = serviceFor({ ...access, ends_at: now.toISOString() });
    assert.equal(await service.recording(member, 1), null);
    assert.equal(await service.handout(member, 8), null);
});
test('service refuses non-admin writes and invalid PDF content', async () => {
    const { service } = serviceFor();
    await assert.rejects(service.saveSession(member, null, {}));
    await assert.rejects(service.grant(member, {}));
    await assert.rejects(service.uploadHandout(member, 1, 'Title', Buffer.from('%PDF-1.7 test')));
    await assert.rejects(service.uploadHandout(admin, 1, 'Title', Buffer.from('<html>notpdf')));
});
test('HTTP routes enforce feature flag, login, admin and same-origin writes', async t => {
    const app = express(); app.use(express.json());
    const { service } = serviceFor();
    registerExperienceRoutes(app, { service, enabled: true,
        getMember: async req => req.headers['x-test-role'] === 'admin' ? admin : req.headers['x-test-role'] === 'member' ? member : null,
        sameOrigin: (req, res, next) => req.headers.origin === 'http://localhost' ? next() : res.sendStatus(403),
    });
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
    const base = `http://127.0.0.1:${server.address().port}`;
    assert.equal((await fetch(base + '/api/members/experience')).status, 401);
    assert.equal((await fetch(base + '/api/admin/experience/reminders', { headers: { 'x-test-role': 'member' } })).status, 403);
    assert.equal((await fetch(base + '/api/admin/experience/sessions', { method: 'POST', headers: { 'x-test-role': 'admin' } })).status, 403);
    assert.equal((await fetch(base + '/api/members/experience/sessions/bad/recording', { headers: { 'x-test-role': 'member' } })).status, 400);
    const download = await fetch(base + '/api/members/experience/handouts/8', { headers: { 'x-test-role': 'member' } });
    assert.equal(download.status, 200); assert.equal(download.headers.get('cache-control'), 'no-store');
    assert.match(download.headers.get('content-disposition'), /attachment/);
    assert.match(download.headers.get('content-security-policy'), /sandbox/);
});
test('disabled feature blocks all experience reads and writes, including admins', async t => {
    const app = express(); app.use(express.json());
    registerExperienceRoutes(app, { service: {}, enabled: false, getMember: async () => admin,
        sameOrigin: (_req, _res, next) => next() });
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const path of ['/api/members/experience', '/api/members/experience/live', '/api/members/experience/handouts/1',
        '/api/members/experience/sessions/1/recording', '/api/admin/experience/reminders']) {
        assert.equal((await fetch(base + path)).status, 404);
    }
    assert.equal((await fetch(base + '/api/admin/experience/import', { method: 'POST' })).status, 404);
});
