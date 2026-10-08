import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { createExperienceService } from '../server/experienceGroup.js';
import { registerExperienceRoutes } from '../server/experienceRoutes.js';

const admin = { id: 2, role: 'admin' };
const member = { id: 1, role: 'member' };
const now = new Date('2026-10-08T10:00:00Z');
const session = { id: 36, title: 'Synthetic meeting', summary: '', occurred_at: '2026-10-04 17:00:00',
    status: 'published', published_at: '2026-10-04 17:00:00', vimeo_id: '123456789', vimeo_hash: '' };
const access = { status: 'active', plan: 'existing', starts_at: '2026-01-01 00:00:00', ends_at: null,
    content_from: '2026-01-01 00:00:00', full_archive: 1 };

const harness = () => {
    const files = new Map([[23, { id: 23, session_id: 36, title: 'Old PDF', bytes: Buffer.from('%PDF-1.7 old') }],
        [24, { id: 24, session_id: 36, title: 'Current PDF with Dropbox link', bytes: Buffer.from('%PDF-1.7 current') }]]);
    const removed = new Map(); const writes = []; const calls = [];
    let rolledBack = 0; let failWrite = false;
    const execute = async (query, p = []) => {
        const sql = typeof query === 'string' ? query : query.sql;
        calls.push({ sql, p });
        if (sql.includes('FROM experience_memberships')) return [[access]];
        if (sql.includes('FROM experience_sessions')) return [[session]];
        if (sql.startsWith('SELECT id, title FROM experience_handouts WHERE id')) {
            const file = files.get(p[0]); return [[file].filter(f => f && f.session_id === p[1])];
        }
        if (sql.startsWith('SELECT id, title,')) return [[...files.values()].filter(f => f.session_id === p[0])
            .map(f => ({ id: f.id, title: f.title, removed: removed.has(f.id) ? 1 : 0 }))];
        if (sql.startsWith('SELECT id, session_id, title')) return [[files.get(p[0])].filter(f => f && !removed.has(f.id))];
        if (sql.startsWith('SELECT file_bytes')) return [[{ file_bytes: files.get(p[0])?.bytes }]];
        if (sql.startsWith('INSERT IGNORE INTO experience_removed_handouts')) {
            if (failWrite) throw new Error('synthetic_write_failure');
            if (!removed.has(p[0])) removed.set(p[0], p[1]);
            writes.push({ sql, p }); return [{ affectedRows: 1 }];
        }
        if (sql.startsWith('DELETE FROM experience_removed_handouts')) {
            removed.delete(p[0]); writes.push({ sql, p }); return [{ affectedRows: 1 }];
        }
        throw new Error(`Unexpected SQL: ${sql}`);
    };
    const db = { execute, async getConnection() { return { execute, async beginTransaction() {},
        async commit() {}, async rollback() { rolledBack++; }, release() {} }; } };
    return { service: createExperienceService({ db, clock: () => now }), files, removed, writes, calls,
        get rolledBack() { return rolledBack; }, failNextWrite() { failWrite = true; } };
};

test('removal affects only the selected PDF, preserves original bytes, and is reversible', async () => {
    const h = harness(); const original = h.files.get(23).bytes;
    assert.deepEqual(await h.service.setHandoutVisibility(admin, 36, 23, { title: 'Old PDF', visible: false }), { id: 23, visible: false });
    await h.service.setHandoutVisibility(admin, 36, 23, { title: 'Old PDF', visible: false });
    assert.equal(h.removed.size, 1);
    assert.equal(h.removed.get(23), admin.id);
    assert.deepEqual(h.files.get(23).bytes, original);
    const overview = await h.service.overview(member);
    assert.deepEqual(overview.sessions[0].handouts.map(f => f.id), [24]);
    assert.equal(overview.sessions[0].removedHandouts, undefined);
    assert.equal(JSON.stringify(overview).includes('Old PDF'), false);
    assert.equal(await h.service.handout(member, 23), null);
    assert.equal(await h.service.handout(admin, 23), null);
    assert.deepEqual(await h.service.handout(member, 24), h.files.get(24).bytes);
    assert.deepEqual((await h.service.overview(admin)).sessions[0].removedHandouts.map(f => f.id), [23]);
    await h.service.setHandoutVisibility(admin, 36, 23, { title: 'Old PDF', visible: true });
    assert.deepEqual(await h.service.handout(member, 23), original);
    assert.deepEqual((await h.service.overview(member)).sessions[0].handouts.map(f => f.id), [23, 24]);
    assert.equal(h.writes.some(w => /DELETE FROM experience_handouts\b/.test(w.sql)), false);
});

test('non-admin, stale title, wrong session, missing file and malformed actions cannot remove PDFs', async () => {
    const h = harness();
    await assert.rejects(h.service.setHandoutVisibility(member, 36, 23, { title: 'Old PDF', visible: false }));
    assert.equal(h.calls.length, 0);
    for (const [sessionId, id, body] of [[99, 23, { title: 'Old PDF', visible: false }],
        [36, 999, { title: 'Old PDF', visible: false }], [36, 23, { title: 'Different PDF', visible: false }],
        [36, 23, { title: 'Old PDF', visible: 'false' }], [36, 23, { visible: false }]]) {
        await assert.rejects(h.service.setHandoutVisibility(admin, sessionId, id, body));
    }
    assert.equal(h.writes.length, 0);
    assert.equal(h.removed.size, 0);
});

test('failed removal rolls back without deleting the original PDF', async () => {
    const h = harness(); h.failNextWrite();
    await assert.rejects(h.service.setHandoutVisibility(admin, 36, 23, { title: 'Old PDF', visible: false }));
    assert.equal(h.rolledBack, 1);
    assert.equal(h.removed.size, 0);
    assert.match((await h.service.handout(member, 23)).toString(), /^%PDF-/);
});

test('visibility HTTP route enforces login, admin role, same origin, feature flag and exact IDs', async t => {
    const h = harness(); const app = express(); app.use(express.json());
    registerExperienceRoutes(app, { service: h.service, enabled: true,
        getMember: async req => req.headers['x-test-role'] === 'admin' ? admin : req.headers['x-test-role'] === 'member' ? member : null,
        sameOrigin: (req, res, next) => req.headers.origin === 'http://localhost' ? next() : res.sendStatus(403) });
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
    const base = `http://127.0.0.1:${server.address().port}`;
    const path = '/api/admin/experience/sessions/36/handouts/23/visibility';
    const send = (role, origin = 'http://localhost', target = path, body = { title: 'Old PDF', visible: false }) => fetch(base + target, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-test-role': role, origin }, body: JSON.stringify(body) });
    assert.equal((await send('')).status, 401);
    assert.equal((await send('member')).status, 403);
    assert.equal((await send('admin', 'https://other.test')).status, 403);
    assert.equal((await send('admin', undefined, path.replace('/23/', '/bad/'))).status, 400);
    assert.equal((await send('admin', undefined, path.replace('/36/', '/99/'))).status, 400);
    assert.equal(h.removed.size, 0);
    const removed = await send('admin');
    assert.equal(removed.status, 200); assert.equal(removed.headers.get('cache-control'), 'no-store');
    assert.equal((await removed.json()).visible, false);
    assert.equal((await fetch(base + '/api/members/experience/handouts/23', { headers: { 'x-test-role': 'member' } })).status, 404);
    assert.equal((await send('admin', undefined, path, { title: 'Old PDF', visible: true })).status, 200);
    assert.equal((await fetch(base + '/api/members/experience/handouts/23', { headers: { 'x-test-role': 'member' } })).status, 200);

    const disabled = express(); disabled.use(express.json());
    registerExperienceRoutes(disabled, { service: {}, enabled: false, getMember: async () => admin,
        sameOrigin: (_req, _res, next) => next() });
    const disabledServer = disabled.listen(0, '127.0.0.1');
    await new Promise(resolve => disabledServer.once('listening', resolve));
    t.after(() => new Promise(resolve => { disabledServer.closeAllConnections(); disabledServer.close(resolve); }));
    assert.equal((await fetch(`http://127.0.0.1:${disabledServer.address().port}` + path, { method: 'POST' })).status, 404);
});
