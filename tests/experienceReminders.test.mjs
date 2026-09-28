import assert from 'node:assert/strict';
import test from 'node:test';
import { experienceReminderCopy, createExperienceReminderService } from '../server/experienceReminders.js';

const now = new Date('2026-09-28T10:00:00Z');
const member = { member_id: 1, name: 'Sabine Test', email: 'member@example.test', plan: 'annual',
    status: 'active', member_status: 'active', starts_at: '2026-01-01 00:00:00.000',
    ends_at: '2026-10-28 18:00:00.000' };
const args = { name: member.name, endsAt: member.ends_at, days: 30, memberUrl: 'https://spirit-healing.tr/mitglieder' };

test('reminder uses first name, expiry date and explicitly no automatic renewal', () => {
    const copy = experienceReminderCopy(args);
    assert.match(copy.text, /^Hallo Sabine,/);
    assert.match(copy.text, /28. Oktober 2026/);
    assert.match(copy.text, /nichts erneut abgebucht/);
    assert.match(copy.html, /href="https:\/\/spirit-healing.tr\/mitglieder"/);
    assert.match(experienceReminderCopy({ ...args, days: 7 }).subject, /Woche/);
    assert.match(experienceReminderCopy({ ...args, days: 0 }).subject, /heute/);
});
test('reminder escapes names and rejects unsafe or nonexistent link targets', () => {
    assert.match(experienceReminderCopy({ ...args, name: '<img> Tester' }).html, /&lt;img&gt;/);
    for (const memberUrl of ['javascript:alert(1)', 'https://evil.test/mitglieder', 'https://spirit-healing.tr/broken',
        'https://spirit-healing.tr/mitglieder?redirect=evil', 'https://user@spirit-healing.tr/mitglieder']) {
        assert.throws(() => experienceReminderCopy({ ...args, memberUrl }));
    }
});

const harness = ({ current = member, lostClaim = false, failSend = false, failCommit = false } = {}) => {
    let jobs = []; let nextId = 1; let sends = 0; let commits = 0;
    const execute = async (query, values = []) => {
        const sql = typeof query === 'string' ? query : query.sql;
        if (sql.startsWith('UPDATE') && sql.includes("status='uncertain'")) return [{ affectedRows: 0 }];
        if (sql.includes('FROM experience_memberships e')) return [[member]];
        if (sql.startsWith('INSERT IGNORE')) {
            if (!jobs.some(j => j.dedupe_key === values[1])) jobs.push({ id: nextId++, member_id: values[0],
                dedupe_key: values[1], ends_at: values[2], days_before: values[3], status: 'pending' });
            return [{ affectedRows: 1 }];
        }
        if (sql.includes("SELECT id FROM")) return [jobs.filter(j => j.status === 'pending')];
        if (sql.includes("SET status='sending'")) {
            const job = jobs.find(j => j.id === values[2] && j.status === 'pending');
            if (!job || lostClaim) return [{ affectedRows: 0 }];
            job.status = 'sending'; job.claim_token = values[0]; return [{ affectedRows: 1 }];
        }
        if (sql.includes('FOR UPDATE')) {
            const job = jobs.find(j => j.id === values[0] && j.claim_token === values[1]);
            return [job && current ? [{ ...current, expected_end: job.ends_at,
                days_before: job.days_before, dedupe_key: job.dedupe_key }] : []];
        }
        if (sql.includes("SET status='skipped'")) { jobs.find(j => j.id === values[0]).status = 'skipped'; return [{}]; }
        if (sql.includes("SET status='sent'")) { jobs.find(j => j.id === values[1]).status = 'sent'; return [{}]; }
        if (sql.includes('SET status=?')) { jobs.find(j => j.id === values[1]).status = values[0]; return [{}]; }
        throw new Error('Unexpected SQL: ' + sql);
    };
    const db = { execute, async getConnection() { return { execute, async beginTransaction() {},
        async commit() { commits++; if (failCommit) throw new Error('db_commit_lost'); }, async rollback() {}, release() {} }; } };
    const sendMail = async mail => { sends++; assert.equal(mail.email, member.email);
        assert.match(mail.messageId, /^<experience\.[a-f0-9]{64}@spirit-healing.tr>$/);
        if (failSend) throw new Error('smtp_ack_lost'); };
    const service = createExperienceReminderService({ db, sendMail, enabled: true, clock: () => now });
    return { service, db, sends: () => sends, jobs: () => jobs, commits: () => commits };
};
test('disabled worker does not query, enqueue or send', async () => {
    const service = createExperienceReminderService({ db: {}, enabled: false });
    assert.deepEqual(await service.processMail(), { disabled: true, sent: 0 });
});
test('running reminder worker twice sends only once', async () => {
    const h = harness();
    assert.equal((await h.service.processMail()).sent, 1);
    assert.equal((await h.service.processMail()).sent, 0);
    assert.equal(h.sends(), 1); assert.equal(h.jobs().length, 1);
});
test('renewed, revoked, deactivated and removed members are rechecked before sending', async () => {
    for (const current of [{ ...member, ends_at: '2027-10-28 18:00:00' }, { ...member, status: 'revoked' },
        { ...member, member_status: 'disabled' }, null]) {
        const h = harness({ current }); await h.service.processMail();
        assert.equal(h.sends(), 0); assert.equal(h.jobs()[0].status, 'skipped');
    }
});
test('another worker owning the job prevents a second send', async () => {
    const h = harness({ lostClaim: true }); await h.service.processMail(); assert.equal(h.sends(), 0);
});
test('uncertain SMTP or database confirmation never retries automatically', async () => {
    for (const options of [{ failSend: true }, { failCommit: true }]) {
        const h = harness(options); await h.service.processMail(); await h.service.processMail();
        assert.equal(h.sends(), 1); assert.equal(h.jobs()[0].status, 'uncertain');
    }
});
