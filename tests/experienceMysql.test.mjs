import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import { initializeExperienceGroup, createExperienceService } from '../server/experienceGroup.js';
import { initializeExperienceReminders, createExperienceReminderService } from '../server/experienceReminders.js';

// Deliberately independent of production DB_* values and environment files.
export const isolatedExperienceMysqlConfig = raw => {
    let url;
    try { url = new URL(raw); } catch { throw new Error('invalid_test_database'); }
    if (url.protocol !== 'mysql:' || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
        || !['', '/'].includes(url.pathname) || url.search || url.hash || !url.username)
        throw new Error('Use only a local test server without an existing database name');
    return { host: url.hostname.replace(/^\[|\]$/g, ''), port: Number(url.port || 3306),
        user: decodeURIComponent(url.username), password: decodeURIComponent(url.password),
        timezone: 'Z', connectionLimit: 4, connectTimeout: 5000, multipleStatements: false };
};

test('experience MySQL test cannot select a remote or existing member database', () => {
    for (const raw of ['mysql://test@production.invalid', 'mysql://test@127.0.0.1/members',
        'mysql://test@localhost/?database=members', 'https://test@localhost/', 'bad'])
        assert.throws(() => isolatedExperienceMysqlConfig(raw));
    assert.equal(isolatedExperienceMysqlConfig('mysql://test@127.0.0.1:3307/').port, 3307);
});

test('real MySQL: group archive, private files, audited grants and reminder deduplication', {
    skip: !process.env.EXPERIENCE_MYSQL_TEST_URL && 'Requires an isolated local MySQL server', timeout: 30000,
}, async t => {
    const { default: mysql } = await import('mysql2/promise');
    const config = isolatedExperienceMysqlConfig(process.env.EXPERIENCE_MYSQL_TEST_URL);
    const name = `experience_test_${randomUUID().replaceAll('-', '')}`;
    assert.match(name, /^experience_test_[a-f0-9]{32}$/);
    const control = await mysql.createConnection(config);
    let created = false;
    let db;
    t.after(async () => {
        if (db) await db.end();
        try { if (created) await control.query(`DROP DATABASE \`${name}\``); }
        finally { await control.end(); }
    });
    await control.query(`CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4`);
    created = true;
    db = mysql.createPool({ ...config, database: name });
    await db.query(`CREATE TABLE members (id BIGINT UNSIGNED PRIMARY KEY, name VARCHAR(100),
        email VARCHAR(254) UNIQUE, role VARCHAR(24), status VARCHAR(24)) ENGINE=InnoDB`);
    await db.execute(`INSERT INTO members VALUES
        (1, 'Archiv Test', 'archive@example.test', 'member', 'active'),
        (2, 'Admin Test', 'admin@example.test', 'admin', 'active'),
        (3, 'Neu Test', 'new@example.test', 'member', 'active')`);
    await initializeExperienceGroup(db);
    await initializeExperienceReminders(db);
    await initializeExperienceGroup(db);
    await initializeExperienceReminders(db);
    const now = new Date('2026-09-28T10:00:00Z');
    const service = createExperienceService({ db, clock: () => now });
    const admin = { id: 2, role: 'admin' };
    const legacy = { id: 1, role: 'member' };
    const newcomer = { id: 3, role: 'member' };
    const rows = [
        { uuid: 'synthetic_old_recording', title: 'Archivtreffen', date: '2026-08-02T17:00:00Z' },
        { uuid: 'synthetic_new_recording', title: 'Neues Treffen', date: '2026-09-27T17:00:00Z' },
    ];
    const imported = await service.importSessions(admin, rows);
    assert.equal(imported.filter(row => row.created).length, 2);
    assert.equal((await service.importSessions(admin, rows)).filter(row => row.created).length, 0);
    for (const [i, row] of rows.entries()) await service.saveSession(admin, imported[i].id,
        { title: row.title, occurredAt: row.date, status: 'published', reviewed: true, vimeoId: '123456789' });
    const base = { status: 'active', startsAt: '2026-09-20T00:00:00Z', contentFrom: '2026-09-20T00:00:00Z', reason: 'Synthetic integration test' };
    await service.grant(admin, { ...base, email: 'archive@example.test', plan: 'existing', endsAt: null, fullArchive: true });
    await service.grant(admin, { ...base, email: 'new@example.test', plan: 'annual', endsAt: '2026-10-28T18:00:00Z', fullArchive: false });
    assert.equal((await service.overview(legacy)).sessions.length, 2);
    assert.equal((await service.overview(newcomer)).sessions.length, 1);
    assert.equal((await service.overview(legacy)).access.endsAt, null);
    const pdf = Buffer.from('%PDF-1.7 synthetic test file');
    const handout = await service.uploadHandout(admin, imported[0].id, 'Archiv-Handout', pdf);
    assert.equal(await service.uploadHandout(admin, imported[0].id, 'Archiv-Handout', pdf), handout);
    assert.deepEqual(await service.handout(legacy, handout), pdf);
    assert.equal(await service.handout(newcomer, handout), null);
    assert.equal(await service.recording(newcomer, imported[0].id), null);
    const replacement = await service.uploadHandout(admin, imported[0].id, 'Current handout', Buffer.from('%PDF-1.7 replacement'));
    await service.setHandoutVisibility(admin, imported[0].id, handout, { title: 'Archiv-Handout', visible: false });
    assert.equal(await service.handout(legacy, handout), null);
    assert.deepEqual((await service.overview(legacy)).sessions.find(s => s.id === imported[0].id).handouts.map(h => h.id), [replacement]);
    assert.equal((await service.overview(legacy)).sessions[0].removedHandouts, undefined);
    assert.deepEqual((await service.overview(admin)).sessions.find(s => s.id === imported[0].id).removedHandouts.map(h => h.id), [handout]);
    assert.equal(await service.uploadHandout(admin, imported[0].id, 'Archiv-Handout', pdf), handout);
    assert.equal(await service.handout(legacy, handout), null);
    await service.setHandoutVisibility(admin, imported[0].id, handout, { title: 'Archiv-Handout', visible: true });
    assert.deepEqual(await service.handout(legacy, handout), pdf);
    const [[audit]] = await db.execute('SELECT COUNT(*) AS n FROM experience_access_audit');
    assert.equal(audit.n, 2);
    const sent = [];
    const reminders = createExperienceReminderService({ db, enabled: true, clock: () => now,
        sendMail: async message => sent.push(message) });
    await reminders.processMail();
    await reminders.processMail();
    assert.equal(sent.length, 1);
    assert.equal(sent[0].email, 'new@example.test');
    const [[job]] = await db.execute('SELECT status FROM experience_reminder_mail');
    assert.equal(job.status, 'sent');
    await service.grant(admin, { ...base, email: 'archive@example.test', plan: 'existing', endsAt: null, fullArchive: true, status: 'revoked' });
    assert.equal((await service.overview(legacy)).active, false);
    assert.equal(await service.handout(legacy, handout), null);
});
