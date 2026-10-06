import test from "node:test";
import assert from "node:assert/strict";
import { liveTalk, liveMailSchedule, normalizeLiveRegistration, validateZoomJoinUrl, validateZoomPasscode,
    zoomMeetingIdFromJoinUrl, makeLiveToken, readLiveToken, liveCalendar, liveEmail } from "../server/liveTalkConfig.js";
import { createLiveTalkService, initializeLiveTalk } from "../server/liveTalk.js";

const joinUrl = "https://us06web.zoom.us/j/12345678901?pwd=test-only";
const passcode = "084526";
const secret = "test-only-secret-at-least-thirty-two-characters";
const form = { name: "Testperson", email: "test@example.test", privacyConsent: true, newsletterConsent: false };
const now = new Date("2026-09-22T12:00:00Z");

test("German time, sixty-minute duration and registration cutoffs", () => {
    assert.equal(new Intl.DateTimeFormat("de", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" }).format(new Date(liveTalk.startsAt)), "19:30");
    assert.equal(new Intl.DateTimeFormat("de", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" }).format(new Date(liveTalk.endsAt)), "20:30");
    assert.equal(new Date(liveTalk.endsAt) - new Date(liveTalk.startsAt), 60 * 60000);
    assert.equal(new Date(liveTalk.deleteAfter) - new Date(liveTalk.endsAt), 90 * 86400000);
    assert.deepEqual(liveMailSchedule(now).map(j => j.kind), ["confirmation", "day", "hour"]);
    assert.deepEqual(liveMailSchedule(new Date("2026-10-06T12:00:00Z")).map(j => j.kind), ["confirmation", "hour"]);
    assert.deepEqual(liveMailSchedule(new Date("2026-10-06T17:00:00Z")).map(j => j.kind), ["confirmation"]);
    assert.deepEqual(liveMailSchedule(new Date(liveTalk.startsAt)), []);
});
test("validation rejects missing consent, bad email, honeypot and header injection", () => {
    assert.equal(normalizeLiveRegistration({ ...form, email: " TEST@example.test " }).email, "test@example.test");
    for (const invalid of [{ privacyConsent: false }, { email: "oops" }, { company: "spam" }, { name: "Hello\nBcc: x" }]) assert.throws(() => normalizeLiveRegistration({ ...form, ...invalid }));
});
test("Zoom URL allows only HTTPS participant links, never host or spoofed URLs", () => {
    assert.equal(validateZoomJoinUrl(joinUrl), joinUrl);
    assert.equal(zoomMeetingIdFromJoinUrl(joinUrl), "12345678901");
    assert.equal(validateZoomPasscode(passcode), passcode);
    assert.equal(validateZoomPasscode("bad code"), null);
    for (const bad of ["http://zoom.us/j/12345678901?pwd=x", "https://zoom.us.evil.test/j/12345678901?pwd=x", "https://zoom.us/s/12345678901?zak=x", "https://zoom.us/j/12345678901?pwd=x&zak=y", "https://evil@zoom.us/j/12345678901?pwd=x", "https://zoom.us/j/12345678901"]) assert.equal(validateZoomJoinUrl(bad), null);
});
test("personal tokens cannot be changed or signed with another secret", () => {
    const token = makeLiveToken(12, secret);
    assert.equal(readLiveToken(token, secret), 12);
    assert.equal(readLiveToken(token.replace("12.", "13."), secret), null);
    assert.equal(readLiveToken(token, "other-test-secret-at-least-thirty-two-characters"), null);
    assert.equal(readLiveToken(undefined, secret), null);
    assert.throws(() => makeLiveToken(1, "short"));
});
test("calendar uses correct UTC and folding; mail contains no marketing or fake replay", () => {
    const calendar = liveCalendar(joinUrl);
    assert.match(calendar, /DTSTART:20261006T173000Z/);
    assert.match(calendar, /DTEND:20261006T183000Z/);
    assert.ok(calendar.split("\r\n").every(line => Buffer.byteLength(line) <= 74));
    for (const kind of ["confirmation", "day", "hour"]) {
        const mail = liveEmail({ name: "Test", kind, joinUrl, meetingId: "12345678901", passcode, manageUrl: "https://spirit-healing.tr/live-vortrag/zugang#token=test" });
        assert.ok(mail.text.includes(joinUrl));
        assert.match(mail.text, /Meeting-ID: 12345678901/);
        assert.match(mail.text, /Kenncode: 084526/);
        assert.match(mail.text, /absagen/);
        assert.doesNotMatch(mail.text, /Restplätze|1555|Replay ansehen|Türkei|20:45|21:45/);
        if (kind === "hour") {
            assert.equal(mail.subject, "Gleich ist es so weit – wir freuen uns auf dich");
            assert.match(mail.text, /Komm genauso, wie du gerade bist/);
            assert.match(mail.text, /gleich im Raum zu begrüßen/);
        }
    }
});

// Isolated repository double exercises the service branches without real contacts or mail.
function fixture() {
    const state = { regs: [], jobs: [], sent: [], newsletter: [], config: { join_url: joinUrl, passcode, enabled: 1 }, failures: [], rollback: false };
    const execute = async (raw, p = []) => {
        const q = raw.replace(/\s+/g, " ").trim();
        const result = value => [value];
        if (q.startsWith("CREATE TABLE") || q.startsWith("ALTER TABLE") || q.startsWith("INSERT IGNORE INTO live_talk_settings")) return result({ affectedRows: 0 });
        if (q.startsWith("SELECT join_url")) return result([state.config]);
        if (q.startsWith("SELECT event_key FROM")) return result([{ event_key: liveTalk.key }]);
        if (q.startsWith("SELECT COUNT(*)")) return result([{ total: state.regs.filter(r => r.status === "active").length }]);
        if (q.startsWith("INSERT IGNORE INTO live_talk_registrations")) {
            if (state.regs.some(r => r.email === p[2])) return result({ affectedRows: 0 });
            state.regs.push({ id: state.regs.length + 1, name: p[1], email: p[2], status: "active" });
            return result({ affectedRows: 1 });
        }
        if (q.startsWith("SELECT id, status FROM")) return result(state.regs.filter(r => r.email === p[1]));
        if (q.startsWith("INSERT INTO live_talk_mail")) {
            state.jobs.push({ id: state.jobs.length + 1, registration_id: p[0], kind: p[1], due: new Date(p[2].replace(" ", "T") + "Z"), status: "pending", attempts: 0 }); return result({ affectedRows: 1 });
        }
        if (q.startsWith("UPDATE live_talk_registrations SET newsletter_status")) { state.regs.find(r => r.id === p[1]).newsletter_status = p[0]; return result({ affectedRows: 1 }); }
        if (q.startsWith("SELECT id, name, status") || q.startsWith("SELECT id FROM live_talk_registrations")) return result(state.regs.filter(r => r.id === p[0]));
        if (q.startsWith("UPDATE live_talk_registrations SET status")) { state.regs.find(r => r.id === p[0]).status = "cancelled"; return result({ affectedRows: 1 }); }
        if (q.includes("SET status = 'cancelled' WHERE registration_id")) { state.jobs.filter(j => j.registration_id === p[0] && ["pending", "failed"].includes(j.status)).forEach(j => { j.status = "cancelled"; }); return result({ affectedRows: 1 }); }
        if (q.startsWith("UPDATE live_talk_mail SET status = 'uncertain' WHERE status")) return result({ affectedRows: 0 });
        if (q.startsWith("SELECT m.id FROM")) return result(state.jobs.filter(j => ["pending", "failed"].includes(j.status) && j.attempts < 3 && j.due <= new Date(p[1].replace(" ", "T") + "Z") && state.regs.find(r => r.id === j.registration_id).status === "active").map(j => ({ id: j.id })));
        if (q.startsWith("UPDATE live_talk_mail m JOIN")) {
            const j = state.jobs.find(j => j.id === p[2]);
            if (!["pending", "failed"].includes(j.status)) return result({ affectedRows: 0 });
            j.status = "sending"; j.claim_token = p[1]; j.attempts++; return result({ affectedRows: 1 });
        }
        if (q.startsWith("SELECT m.kind")) { const j = state.jobs.find(j => j.id === p[0]); return result([{ ...state.regs.find(r => r.id === j.registration_id), kind: j.kind }]); }
        if (q.startsWith("UPDATE live_talk_mail SET status = ?")) { state.jobs.find(j => j.id === p[1]).status = p[0]; return result({ affectedRows: 1 }); }
        if (q.startsWith("UPDATE live_talk_mail SET status = 'sent'")) { state.jobs.find(j => j.id === p[0]).status = "sent"; return result({ affectedRows: 1 }); }
        if (q.startsWith("UPDATE live_talk_mail SET status = 'skipped'")) { state.jobs.find(j => j.id === p[0]).status = "skipped"; return result({ affectedRows: 1 }); }
        if (q.startsWith("DELETE FROM live_talk_registrations")) { state.regs = []; state.jobs = []; return result({ affectedRows: 1 }); }
        if (q.startsWith("UPDATE live_talk_settings")) { state.config = { join_url: p[0], passcode: p[1], enabled: p[2] }; return result({ affectedRows: 1 }); }
        throw new Error("Uncovered SQL: " + q);
    };
    const connection = { execute, beginTransaction: async () => {}, commit: async () => {}, rollback: async () => { state.rollback = true; }, release() {} };
    const db = { execute, getConnection: async () => connection };
    const service = createLiveTalkService({ db, secret, newsletter: async f => { state.newsletter.push(f); return "pending"; }, sendMail: async mail => { if (state.failures.length) throw state.failures.shift(); state.sent.push(mail); } });
    return { state, service, db };
}
test("schema initializes disabled; registrations queue once and mail worker does not repeat", async () => {
    const { state, service, db } = fixture(); await initializeLiveTalk(db);
    await service.register(form, now); await service.register({ ...form, name: "Overwrite attempt", newsletterConsent: true }, now);
    assert.equal(state.regs.length, 1); assert.equal(state.regs[0].name, form.name);
    assert.equal(state.jobs.length, 3); assert.equal(state.newsletter.length, 0);
    await Promise.all([service.processMail(now), service.processMail(now)]);
    assert.equal(state.sent.length, 1);
    await service.processMail(now); assert.equal(state.sent.length, 1);
    assert.match(state.sent[0].manageUrl, /#token=/);
    assert.equal(state.sent[0].joinUrl, joinUrl);
    assert.equal(state.sent[0].meetingId, "12345678901");
    assert.equal(state.sent[0].passcode, passcode);
    await service.processMail(new Date("2026-10-05T17:30:00Z"));
    await service.processMail(new Date("2026-10-06T16:30:00Z"));
    assert.deepEqual(state.sent.map(m => m.kind), ["confirmation", "day", "hour"]);
});
test("newsletter opt-in is separate and optional, disabled/ended events reject signup", async () => {
    const { state, service } = fixture();
    await service.register({ ...form, newsletterConsent: true }, now);
    assert.equal(state.newsletter.length, 1); assert.equal(state.regs[0].newsletter_status, "pending");
    await service.configure({ joinUrl, passcode, enabled: false });
    await assert.rejects(() => service.register(form, now), { code: "closed" });
    await service.configure({ joinUrl, passcode, enabled: true });
    await assert.rejects(() => service.register(form, new Date(liveTalk.startsAt)), { code: "closed" });
    assert.equal((await service.publicInfo(now)).joinUrl, undefined);
});
test("cancellation blocks reminders and access; deletion removes event records", async () => {
    const { state, service } = fixture(); await service.register(form, now);
    const token = makeLiveToken(1, secret);
    assert.equal((await service.access(token, now)).joinUrl, joinUrl);
    assert.equal(await service.cancel("bad"), false);
    assert.equal(await service.cancel(token), true);
    assert.equal((await service.access(token, now)).joinUrl, null);
    await service.processMail(new Date("2026-10-06T16:30:00Z")); assert.equal(state.sent.length, 0);
    await service.processMail(new Date(liveTalk.deleteAfter)); assert.equal(state.regs.length, 0);
});
test("uncertain SMTP result is not auto-retried; definite rejection is retried", async () => {
    const { state, service } = fixture(); await service.register(form, now);
    state.failures.push(Object.assign(new Error("SMTP rejection"), { responseCode: 451 }));
    await service.processMail(now); assert.equal(state.jobs[0].status, "failed");
    state.failures.push(Object.assign(new Error("Connection lost"), { code: "ECONNRESET" }));
    await service.processMail(new Date(now.getTime() + 6 * 60000)); assert.equal(state.jobs[0].status, "uncertain");
    await service.processMail(new Date(now.getTime() + 12 * 60000)); assert.equal(state.jobs[0].attempts, 2);
});
test("delayed day-before reminder is skipped and expired access hides Zoom", async () => {
    const { state, service } = fixture(); await service.register(form, now);
    await service.processMail(new Date("2026-10-06T15:00:00Z"));
    assert.equal(state.jobs.find(j => j.kind === "day").status, "skipped");
    assert.equal((await service.access(makeLiveToken(1, secret), new Date(liveTalk.endsAt))).joinUrl, null);
});
test("capacity keeps two host places free and rejects overbooking", async () => {
    const { state, service } = fixture();
    state.regs = Array.from({length:98}, (_,i) => ({id:i+1,name:"Test",email:`test${i}@example.test`,status:"active"}));
    await assert.rejects(() => service.register(form, now), {code:"full"});
    assert.equal(state.jobs.length, 0);
    assert.equal(state.rollback, true);
});
