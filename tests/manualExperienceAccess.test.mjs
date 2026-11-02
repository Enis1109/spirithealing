import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import express from 'express';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createManualExperienceAccessService, initializeManualExperienceAccess,
    normalizeManualExperienceAccess, registerManualExperienceAccessRoutes } from '../server/manualExperienceAccess.js';

const admin = { id: 7, role: 'admin' };
const email = 'member@example.invalid';
const secret = 'a'.repeat(43);
const body = { email, plan: 'existing', status: 'active', startsAt: '2026-11-02T00:00:00.000Z',
    endsAt: null, contentFrom: '2026-11-02T00:00:00.000Z', fullArchive: true,
    reason: 'Personally verified existing participant; explicit administrator authorization.', identityConfirmed: true };
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

function harness(options = {}) {
    let now = new Date('2026-11-02T16:00:00Z');
    let mutex = Promise.resolve();
    let sequence = 0;
    const state = { member: options.missing ? null : { id: 42, email, name: 'Synthetic participant', role: options.role || 'member',
        status: options.status || 'pending', verified_at: null, password_hash: 'unchanged-password-digest',
        privacy_consent_at: '2026-08-01', newsletter_consent: false },
    membership: options.membership || null, tokens: [], sessions: [], audit: [], sql: [], connections: 0, commits: 0, rollbacks: 0 };
    const db = { async getConnection() {
        state.connections++;
        let unlock;
        let snapshot;
        return {
            async beginTransaction() {
                const waiting = mutex;
                mutex = new Promise(resolve => { unlock = resolve; });
                await waiting;
                snapshot = structuredClone({ member: state.member, membership: state.membership,
                    tokens: state.tokens, sessions: state.sessions, audit: state.audit });
            },
            async execute(query, values) {
                const sql = typeof query === 'string' ? query : query.sql;
                state.sql.push({ sql, values });
                if (sql.includes('SELECT id, name, email, status, role FROM members')) return [[...(state.member ? [structuredClone(state.member)] : [])]];
                if (sql.includes('SELECT * FROM experience_memberships')) return [[...(state.membership ? [structuredClone(state.membership)] : [])]];
                if (sql.startsWith('UPDATE members SET status')) { state.member.status = 'active'; return [{ affectedRows: 1 }]; }
                if (sql.includes('INSERT INTO experience_memberships')) {
                    state.membership = { member_id: values[0], plan: values[1], status: values[2], starts_at: values[3],
                        ends_at: values[4], content_from: values[5], full_archive: values[6], updated_by: values[7] };
                    return [{ affectedRows: 1 }];
                }
                if (sql.includes('SET revoked_at')) { for (const t of state.tokens) if (!t.used_at && !t.revoked_at) t.revoked_at = now.toISOString(); return [{ affectedRows: 1 }]; }
                if (sql.includes('INSERT INTO experience_manual_access_tokens')) {
                    if (options.insertFailure) throw new Error('synthetic insert failure');
                    state.tokens.push({ id: state.tokens.length + 1, member_id: values[0], issued_by: values[1],
                        token_hash: values[2], expires_at: values[3], used_at: null, revoked_at: null });
                    return [{ affectedRows: 1 }];
                }
                if (sql.includes('INSERT INTO experience_access_audit')) { state.audit.push(structuredClone(values)); return [{ affectedRows: 1 }]; }
                if (sql.includes('SELECT t.id AS access_token_id')) {
                    const t = state.tokens.find(row => row.token_hash === values[0]);
                    if (!t || !state.membership) return [[]];
                    return [[{ ...structuredClone(t), access_token_id: t.id, ...structuredClone(state.membership),
                        account_status: state.member.status, role: state.member.role, email: state.member.email }]];
                }
                if (sql.includes('SET used_at')) {
                    const t = state.tokens.find(row => row.id === values[0] && !row.used_at && !row.revoked_at);
                    if (!t || options.lostClaim) return [{ affectedRows: 0 }];
                    t.used_at = now.toISOString(); return [{ affectedRows: 1 }];
                }
                if (sql.startsWith('UPDATE members SET last_login_at')) { state.member.last_login_at = now.toISOString(); return [{ affectedRows: 1 }]; }
                throw new Error(`unexpected SQL: ${sql}`);
            },
            async commit() { state.commits++; },
            async rollback() { state.rollbacks++; Object.assign(state, snapshot); },
            release() { unlock?.(); },
        };
    } };
    const service = createManualExperienceAccessService({ db, baseUrl: 'https://example.invalid',
        clock: () => new Date(now), tokenFactory: () => options.randomTokens ? (++sequence).toString().padEnd(43, 'x') : secret,
        resolveRole: m => m.role === 'admin' || m.email === 'owner@example.invalid' ? 'admin' : 'member',
        createSession: async (_connection, id) => {
            if (options.sessionFailure) throw new Error('synthetic session failure');
            assert.equal(id, 42); state.sessions.push({ member_id: id }); return 'synthetic-session-token';
        },
    });
    return { state, service, setTime(value) { now = new Date(value); } };
}

test('manual activation and group grant are atomic, audited, and return only the intended expiring link', async () => {
    const h = harness(); const before = structuredClone(h.state.member);
    const result = await h.service.issue(admin, body);
    assert.deepEqual(h.state.member, { ...before, status: 'active' });
    assert.equal(h.state.membership.plan, 'existing'); assert.equal(h.state.membership.full_archive, 1);
    assert.equal(h.state.sessions.length, 0); assert.equal(h.state.commits, 1);
    assert.equal(result.email, email); assert.equal(result.expiresAt, '2026-11-03T16:00:00.000Z');
    assert.equal(new URL(result.url).pathname, '/api/members/experience/manual-access');
    assert.equal(new URL(result.url).searchParams.get('token'), secret);
    assert.equal(h.state.tokens[0].token_hash, digest(secret));
    assert.doesNotMatch(JSON.stringify(h.state), new RegExp(secret));
    assert.equal(JSON.parse(h.state.audit[0][3]).accountStatus, 'pending');
    assert.equal(JSON.parse(h.state.audit[0][4]).method, 'admin_manual_telegram');
    assert.equal(h.state.sql.some(q => /UPDATE.*(?:password|consent|verified_at|newsletter|program_enrollments)/u.test(q.sql)), false);
});

test('one deliberate redemption creates a normal session; replay cannot create another', async () => {
    const h = harness(); await h.service.issue(admin, body);
    assert.deepEqual(await h.service.consume(secret), { sessionToken: 'synthetic-session-token' });
    assert.equal(h.state.sessions.length, 1); assert.ok(h.state.tokens[0].used_at);
    assert.equal(await h.service.consume(secret), null); assert.equal(h.state.sessions.length, 1);
    assert.equal(h.state.member.verified_at, null);
    assert.match(h.state.sql.find(q => q.sql.includes('SELECT t.id')).sql, /FOR UPDATE/u);
    assert.match(h.state.sql.find(q => q.sql.includes('SELECT t.id')).sql, /expires_at > \?/u);
});

test('concurrent redemptions serialize and only one can create a session', async () => {
    const h = harness(); await h.service.issue(admin, body);
    const result = await Promise.all([h.service.consume(secret), h.service.consume(secret)]);
    assert.equal(result.filter(Boolean).length, 1); assert.equal(h.state.sessions.length, 1);
});

test('new issuance revokes only previous manual links, not existing email credentials', async () => {
    const h = harness({ randomTokens: true });
    const first = await h.service.issue(admin, body); const next = await h.service.issue(admin, body);
    assert.notEqual(first.url, next.url); assert.ok(h.state.tokens[0].revoked_at);
    assert.equal(await h.service.consume(new URL(first.url).searchParams.get('token')), null);
    assert.ok(await h.service.consume(new URL(next.url).searchParams.get('token')));
    assert.equal(h.state.sql.some(q => /(?:UPDATE|DELETE).*\bmember_access_tokens\b/u.test(q.sql)), false);
});

for (const offset of [24, 25]) test(`link is rejected ${offset} hours after issuance`, async () => {
    const h = harness(); await h.service.issue(admin, body);
    h.setTime(`2026-11-03T${offset === 24 ? '16' : '17'}:00:00Z`);
    assert.equal(await h.service.consume(secret), null); assert.equal(h.state.sessions.length, 0);
});

for (const scenario of ['revoked group', 'blocked account', 'privileged account', 'expired membership', 'missing membership']) {
    test(`redemption fails closed for ${scenario}`, async () => {
        const h = harness(); await h.service.issue(admin, body);
        if (scenario === 'revoked group') h.state.membership.status = 'revoked';
        if (scenario === 'blocked account') h.state.member.status = 'blocked';
        if (scenario === 'privileged account') h.state.member.email = 'owner@example.invalid';
        if (scenario === 'expired membership') h.state.membership.ends_at = '2026-11-02 15:00:00.000';
        if (scenario === 'missing membership') h.state.membership = null;
        assert.equal(await h.service.consume(secret), null); assert.equal(h.state.sessions.length, 0);
    });
}

for (const actor of [null, { id: 1, role: 'member' }, { role: 'admin' }]) test('unauthorized issuer rejected before database access', async () => {
    const h = harness(); await assert.rejects(h.service.issue(actor, body)); assert.equal(h.state.connections, 0);
});

for (const options of [{ missing: true }, { status: 'blocked' }, { role: 'admin' },
    { membership: { plan: 'annual', status: 'active' } }]) test(`issuer rejects protected or incompatible target ${JSON.stringify(options)}`, async () => {
    const h = harness(options); const before = structuredClone(h.state.member);
    await assert.rejects(h.service.issue(admin, body)); assert.deepEqual(h.state.member, before);
    assert.equal(h.state.tokens.length, 0); assert.equal(h.state.commits, 0);
});

test('resolved owner privileges and administrator self-activation are protected', async () => {
    for (const scenario of ['owner', 'self']) {
        const h = harness();
        if (scenario === 'owner') h.state.member.email = 'owner@example.invalid'; else h.state.member.id = 7;
        await assert.rejects(h.service.issue(admin, body), e => e.code === 'account_unavailable');
        assert.equal(h.state.tokens.length, 0);
    }
});

for (const addition of [{ identityConfirmed: false }, { identityConfirmed: undefined }, { plan: 'annual' },
    { status: 'revoked' }, { password: 'new' }, { privacyConsent: true }, { verified_at: 'now' },
    { to: 'other@example.invalid' }, { role: 'admin' }, { next: 'https://other.invalid' }]) {
    test(`rejects unconfirmed or out-of-scope input ${JSON.stringify(addition)}`, async () => {
        const h = harness(); await assert.rejects(h.service.issue(admin, { ...body, ...addition }));
        assert.equal(h.state.connections, 0);
    });
}

test('future access and invalid dates never activate accounts', async () => {
    const h = harness();
    await assert.rejects(h.service.issue(admin, { ...body, startsAt: '2026-11-03T00:00:00.000Z' }));
    await assert.rejects(h.service.issue(admin, { ...body, startsAt: 'invalid' }));
    assert.equal(h.state.connections, 0);
});

test('invalid tokens never enter the database', async () => {
    const h = harness();
    for (const token of [null, {}, [], '', '<script>', 'a'.repeat(44), 'a'.repeat(42)]) assert.equal(await h.service.consume(token), null);
    assert.equal(h.state.connections, 0);
});

test('issuance failure rolls back activation, membership and credential changes together', async () => {
    const h = harness({ insertFailure: true }); const before = structuredClone(h.state.member);
    await assert.rejects(h.service.issue(admin, body)); assert.deepEqual(h.state.member, before);
    assert.equal(h.state.membership, null); assert.equal(h.state.tokens.length, 0); assert.equal(h.state.audit.length, 0);
});

test('failed session creation rolls back consumption so the credential is not burned', async () => {
    const h = harness({ sessionFailure: true }); await h.service.issue(admin, body);
    await assert.rejects(h.service.consume(secret)); assert.equal(h.state.tokens[0].used_at, null);
});

test('lost compare-and-set claim cannot create a session', async () => {
    const h = harness({ lostClaim: true }); await h.service.issue(admin, body);
    assert.equal(await h.service.consume(secret), null); assert.equal(h.state.sessions.length, 0);
});

function routeHarness(service, enabled = true, actor = admin) {
    const routes = new Map(); const sameOrigin = () => {}; const limiter = () => {}; const formParser = () => {};
    let cookies = 0;
    registerManualExperienceAccessRoutes({ get(path, ...handlers) { routes.set(`GET ${path}`, handlers); },
        post(path, ...handlers) { routes.set(`POST ${path}`, handlers); } }, {
        service, enabled, sameOrigin, limiter, formParser, getMember: async () => actor,
        setSessionCookie(res, value) { cookies++; res.cookie = value; },
    });
    return { routes, sameOrigin, limiter, formParser, cookies: () => cookies,
        response() { return { headers: {}, statusCode: 200,
            set(k, v) { if (typeof k === 'object') Object.assign(this.headers, k); else this.headers[k] = v; return this; },
            status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; },
            type(value) { this.contentType = value; return this; }, send(value) { this.body = value; return this; },
            redirect(code, url) { this.statusCode = code; this.location = url; return this; } }; } };
}

test('GET landing previews never call the service, create sessions or consume credentials', async () => {
    const r = routeHarness({ consume() { throw new Error('GET must not consume'); } }); const res = r.response();
    await r.routes.get('GET /api/members/experience/manual-access').at(-1)({ query: { token: secret } }, res);
    assert.equal(r.cookies(), 0); assert.match(res.body, /method="post"/u);
    assert.match(res.body, /Meinen Mitgliederbereich öffnen/u);
    assert.doesNotMatch(res.body, /<script|<img|https?:\/\//u);
    assert.equal(res.headers['Cache-Control'], 'no-store'); assert.equal(res.headers['Referrer-Policy'], 'no-referrer');
    assert.match(res.headers['Content-Security-Policy'], /frame-ancestors 'none'/u);
});

test('landing rejects injected tokens and disabled feature without reflecting input', async () => {
    for (const [enabled, token] of [[true, '<script>'], [false, secret], [true, [secret]]]) {
        const r = routeHarness({}, enabled); const res = r.response();
        await r.routes.get('GET /api/members/experience/manual-access').at(-1)({ query: { token } }, res);
        assert.equal(res.location, '/mitglieder?state=invalid'); assert.equal(res.body, undefined);
    }
});

test('POST-only sign-in keeps origin checks, rate limit, body bound and fixed redirect', async () => {
    const r = routeHarness({ consume: async token => token === secret ? { sessionToken: 'session' } : null });
    const handlers = r.routes.get('POST /api/members/experience/manual-access/consume');
    assert.deepEqual(handlers.slice(0, 3), [r.sameOrigin, r.limiter, r.formParser]);
    const res = r.response(); await handlers.at(-1)({ body: { token: secret, next: 'https://other.invalid' } }, res);
    assert.equal(res.cookie, 'session'); assert.equal(res.location, '/mitglieder?tab=experience');
    assert.equal(res.headers['Cache-Control'], 'no-store');
    const invalid = r.response(); await handlers.at(-1)({ body: { token: 'bad' } }, invalid);
    assert.equal(invalid.location, '/mitglieder?state=invalid'); assert.equal(invalid.cookie, undefined);
});

test('admin endpoint retains authentication and never creates a session for its issuer', async () => {
    const h = harness(); const r = routeHarness(h.service); const res = r.response();
    const handlers = r.routes.get('POST /api/admin/experience/manual-access');
    assert.deepEqual(handlers.slice(0, 2), [r.sameOrigin, r.limiter]);
    await handlers.at(-1)({ body }, res); assert.equal(res.statusCode, 201);
    assert.equal(r.cookies(), 0); assert.equal(h.state.sessions.length, 0);
    const denied = routeHarness(h.service, true, { id: 1, role: 'member' }); const no = denied.response();
    await denied.routes.get('POST /api/admin/experience/manual-access').at(-1)({ body }, no);
    assert.equal(no.statusCode, 403);
});

test('schema is additive and dedicated to manual experience links', async () => {
    const sql = []; await initializeManualExperienceAccess({ query: async value => sql.push(value) });
    assert.equal(sql.length, 1); assert.match(sql[0], /CREATE TABLE IF NOT EXISTS experience_manual_access_tokens/u);
    assert.match(sql[0], /token_hash CHAR\(64\)/u); assert.doesNotMatch(sql[0], /ALTER|DROP/u);
});

test('production wiring uses existing session security and resolved owner privileges', () => {
    const server = fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8');
    assert.match(server, /baseUrl: productionOrigin, createSession, resolveRole/u);
    assert.match(server, /sameOrigin: adminSameOriginOnly, limiter: manualExperienceAccessLimiter/u);
    assert.match(server, /express.urlencoded\(\{ extended: false, limit: '2kb' \}\)/u);
    assert.match(server, /setSessionCookie: setMemberSessionCookie/u);
    assert.match(server, /await initializeManualExperienceAccess\(database\)/u);
    const ui = fs.readFileSync(new URL('../src/sections/ExperienceGroup.jsx', import.meta.url), 'utf8');
    assert.match(ui, /window.confirm\(`Mitgliederkonto/u); assert.match(ui, /identityConfirmed: identityConfirmed === 'on'/u);
    assert.match(ui, /Persönlicher Zugangslink/u); assert.doesNotMatch(ui, /href=\{personalAccess.url\}/u);
});

test('normalization keeps the established grant validation', () => {
    assert.equal(normalizeManualExperienceAccess(body).email, email);
    assert.throws(() => normalizeManualExperienceAccess({ ...body, reason: '' }));
    assert.throws(() => normalizeManualExperienceAccess({ ...body, fullArchive: 'true' }));
});

test('real HTTP: admin-only issue, harmless preview, deliberate form sign-in and denied replay', async t => {
    const h = harness(); const app = express();
    app.use(express.json({ limit: '2kb' }));
    let base;
    registerManualExperienceAccessRoutes(app, { service: h.service, enabled: true,
        getMember: async req => req.get('x-test-role') ? { id: 7, role: req.get('x-test-role') } : null,
        sameOrigin(req, res, next) { if (req.get('origin') === base) return next(); res.status(403).json({ ok: false }); },
        limiter(_req, _res, next) { next(); }, formParser: express.urlencoded({ extended: false, limit: '2kb' }),
        setSessionCookie(res, token) { res.cookie('spirit_member_session', token, { httpOnly: true, secure: true, sameSite: 'lax' }); },
    });
    app.use((error, _req, res, _next) => res.status(error.status || 500).json({ ok: false }));
    const server = createServer(app); server.listen(0, '127.0.0.1'); await once(server, 'listening');
    t.after(() => new Promise(resolve => server.close(resolve)));
    base = `http://127.0.0.1:${server.address().port}`;
    const post = (role, origin = base, fields = body) => fetch(`${base}/api/admin/experience/manual-access`, {
        method: 'POST', headers: { 'content-type': 'application/json', origin, ...(role ? { 'x-test-role': role } : {}) },
        body: JSON.stringify(fields),
    });
    assert.equal((await post(null)).status, 401);
    assert.equal((await post('member')).status, 403);
    assert.equal((await post('admin', 'https://wrong.invalid')).status, 403);
    assert.equal((await post('admin', base, { ...body, password: 'forbidden' })).status, 400);
    assert.equal(h.state.connections, 0);
    const issued = await post('admin'); assert.equal(issued.status, 201);
    assert.equal(issued.headers.get('set-cookie'), null); assert.equal(issued.headers.get('cache-control'), 'no-store');
    const token = new URL((await issued.json()).access.url).searchParams.get('token');
    const page = await fetch(`${base}/api/members/experience/manual-access?token=${token}`);
    assert.equal(page.status, 200); assert.equal(page.headers.get('set-cookie'), null);
    assert.match(await page.text(), /Meinen Mitgliederbereich öffnen/u);
    assert.equal(h.state.tokens[0].used_at, null);
    const redeem = origin => fetch(`${base}/api/members/experience/manual-access/consume`, {
        method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded', origin },
        body: new URLSearchParams({ token, next: 'https://wrong.invalid' }),
    });
    assert.equal((await redeem('https://wrong.invalid')).status, 403);
    const opened = await redeem(base); assert.equal(opened.status, 303);
    assert.equal(opened.headers.get('location'), '/mitglieder?tab=experience');
    assert.match(opened.headers.get('set-cookie'), /HttpOnly/u);
    assert.match(opened.headers.get('set-cookie'), /Secure/u);
    assert.match(opened.headers.get('set-cookie'), /SameSite=Lax/u);
    const replay = await redeem(base); assert.equal(replay.headers.get('set-cookie'), null);
    assert.equal(replay.headers.get('location'), '/mitglieder?state=invalid');
    assert.equal(h.state.sessions.length, 1);
});
