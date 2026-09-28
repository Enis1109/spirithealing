import assert from 'node:assert/strict';
import test from 'node:test';
import { createExperienceService } from '../server/experienceGroup.js';

const admin = { id: 2, role: 'admin' };
const item = { uuid: 'synthetic_recording_20260927', title: 'Erfahrungsgruppe', date: '2026-09-27T17:00:35Z',
    status: 'published', vimeoId: '123456789', download_url: 'https://example.test/not-to-save' };
const harness = () => {
    const sources = new Map(); const files = new Map(); const inserts = [];
    const execute = async (query, p = []) => {
        const sql = typeof query === 'string' ? query : query.sql;
        if (sql.includes('SELECT * FROM experience_sessions')) return [[{ id: 1 }]];
        if (sql.startsWith('INSERT IGNORE INTO experience_imports')) { if (!sources.has(p[0])) sources.set(p[0], null); return [{}]; }
        if (sql.startsWith('SELECT session_id')) return [[{ session_id: sources.get(p[0]) }]];
        if (sql.startsWith('INSERT INTO experience_sessions')) { inserts.push({ sql, p }); return [{ insertId: inserts.length }]; }
        if (sql.startsWith('UPDATE experience_imports')) { sources.set(p[1], p[0]); return [{}]; }
        if (sql.startsWith('INSERT IGNORE INTO experience_handout_imports')) { if (!files.has(p.join(':'))) files.set(p.join(':'), null); return [{}]; }
        if (sql.startsWith('SELECT handout_id')) return [[{ handout_id: files.get(p.join(':')) }]];
        if (sql.startsWith('INSERT INTO experience_handouts')) { inserts.push({ sql, p }); return [{ insertId: inserts.length }]; }
        if (sql.startsWith('UPDATE experience_handout_imports')) { files.set(p.slice(1).join(':'), p[0]); return [{}]; }
        throw new Error('Unexpected SQL');
    };
    const db = { execute, async getConnection() { return { execute,
        async beginTransaction() {}, async commit() {}, async rollback() {}, release() {} }; } };
    return { service: createExperienceService({ db }), inserts };
};
test('repeated catalog imports create one draft and preserve existing entries', async () => {
    const h = harness();
    const first = await h.service.importSessions(admin, [item]);
    const second = await h.service.importSessions(admin, [{ ...item, title: 'Changed' }]);
    assert.equal(first[0].created, true); assert.equal(second[0].created, false);
    assert.equal(first[0].id, second[0].id); assert.equal(h.inserts.length, 1);
    assert.match(h.inserts[0].sql, /'draft'/);
    assert.equal(JSON.stringify(h.inserts).includes('example.test'), false);
    assert.equal(JSON.stringify(h.inserts).includes('123456789'), false);
});
test('catalog imports validate all entries and reject non-admin access', async () => {
    const h = harness();
    await assert.rejects(h.service.importSessions({ role: 'member' }, [item]));
    for (const rows of [[], [item, { ...item, date: '2026-02-30T00:00:00Z' }], [{ ...item, uuid: 'https://example.test' }]])
        await assert.rejects(h.service.importSessions(admin, rows));
    assert.equal(h.inserts.length, 0);
});
test('identical handout uploaded twice to the same meeting does not duplicate bytes', async () => {
    const h = harness(); const bytes = Buffer.from('%PDF-1.7 test');
    const first = await h.service.uploadHandout(admin, 1, 'Handout', bytes);
    assert.equal(await h.service.uploadHandout(admin, 1, 'Handout', bytes), first);
    assert.equal(h.inserts.length, 1);
    await h.service.uploadHandout(admin, 2, 'Handout', bytes);
    assert.equal(h.inserts.length, 2);
});
