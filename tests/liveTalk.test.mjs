import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import express from "express";
import { WebinarValidationError } from "../server/webinarValidation.js";
import { liveTalk, liveTalk2, liveTalk3, liveTalkFamily, liveMailSchedule, normalizeLiveRegistration, validateZoomJoinUrl, validateZoomPasscode,
    zoomMeetingIdFromJoinUrl, makeLiveToken, readLiveToken, liveCalendar, liveEmail } from "../server/liveTalkConfig.js";
import { createLiveTalkService, initializeLiveTalk } from "../server/liveTalk.js";
import { liveAttributionVersion, liveAttributionEvent, liveAttributionSources,
    readLiveSource, normalizeLiveAttribution, summarizeLiveAttribution } from "../shared/liveAttribution.js";

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
        assert.match(mail.text, /Deine Kamera darf gerne eingeschaltet sein\. Dein Mikrofon bleibt zunächst stumm\./);
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
function fixture(event = liveTalk) {
    const state = { regs: [], attribution: [], jobs: [], sent: [], newsletter: [], config: { join_url: joinUrl, passcode, enabled: 1 }, failures: [], rollback: false };
    const execute = async (raw, p = []) => {
        const q = raw.replace(/\s+/g, " ").trim();
        const result = value => [value];
        if (q.startsWith("CREATE TABLE") || q.startsWith("ALTER TABLE") || q.startsWith("INSERT IGNORE INTO live_talk_settings")) return result({ affectedRows: 0 });
        if (q.startsWith("SELECT join_url")) return result([state.config]);
        if (q.startsWith("INSERT INTO live_talk_attribution")) {
            if (state.failAttribution) throw new Error("Test insert failure");
            state.attribution.push({ registration_id: p[0], source_code: p[1], consent_version: p[2], consented_at: p[3] });
            return result({ affectedRows: 1 });
        }
        if (q.startsWith("SELECT registration_id FROM live_talk_attribution")) return result(state.attribution.filter(a => a.registration_id === p[0]));
        if (q.startsWith("DELETE FROM live_talk_attribution")) { state.attribution = state.attribution.filter(a => a.registration_id !== p[0]); return result({ affectedRows: 1 }); }
        if (q.startsWith("SELECT r.id, r.name")) return result(state.regs.flatMap(r => state.jobs.filter(j => j.registration_id === r.id).map(j => ({...r, kind:j.kind, mail_status:j.status}))));
        if (q.startsWith("SELECT r.id, r.status, a.source_code")) return result(state.regs.map(r => ({...r, source_code:state.attribution.find(a => a.registration_id === r.id)?.source_code})));
        if (q.startsWith("SELECT event_key FROM")) return result([{ event_key: liveTalk.key }]);
        if (q.startsWith("SELECT COUNT(*)")) return result([{ total: state.regs.filter(r => r.status === "active").length }]);
        if (q.startsWith("INSERT IGNORE INTO live_talk_registrations")) {
            if (state.regs.some(r => r.email === p[2])) return result({ affectedRows: 0 });
            state.regs.push({ id: state.regs.length + 1, name: p[1], email: p[2], status: "active", event_key:p[0], privacy_version:p[3], newsletter_requested:p[4], newsletter_status:p[5], created_at:p[6] });
            return result({ affectedRows: 1 });
        }
        if (q.startsWith("SELECT id, status FROM")) return result(state.regs.filter(r => r.email === p[1]));
        if (q.startsWith("INSERT IGNORE INTO live_talk_mail")) {
            for (const r of state.regs.filter(r => r.event_key === p[2] && r.status === "active" && r.created_at < p[3])) {
                if (state.jobs.some(j => j.registration_id === r.id && j.kind === p[0])) continue;
                state.jobs.push({ id:state.jobs.length+1,registration_id:r.id,kind:p[0],due:new Date(p[1].replace(" ","T")+"Z"),status:"pending",attempts:0 });
            }
            return result({affectedRows:0});
        }
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
        if (q.startsWith("DELETE FROM live_talk_registrations")) { state.regs = []; state.jobs = []; state.attribution = []; return result({ affectedRows: 1 }); }
        if (q.startsWith("UPDATE live_talk_settings")) { state.config = { join_url: p[0], passcode: p[1], enabled: p[2] }; return result({ affectedRows: 1 }); }
        throw new Error("Uncovered SQL: " + q);
    };
    let snapshot;
    const connection = { execute, beginTransaction: async () => { snapshot = structuredClone({ regs: state.regs, jobs: state.jobs, attribution: state.attribution }); }, commit: async () => {}, rollback: async () => { Object.assign(state, snapshot); state.rollback = true; }, release() {} };
    const db = { execute, getConnection: async () => connection };
    const service = createLiveTalkService({ db, secret, event, newsletter: async f => { state.newsletter.push(f); return "pending"; }, sendMail: async mail => { if (state.failures.length) throw state.failures.shift(); state.sent.push(mail); } });
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

test("second live accepts new registrations after the first event, sends once and uses its own access path", async () => {
    const { state, service } = fixture(liveTalk2);
    const october7 = new Date("2026-10-07T10:00:00Z");
    await service.register(form, october7);
    await service.register(form, october7);
    assert.equal(state.regs.length, 1); assert.equal(state.jobs.length, 5);
    await service.processMail(october7); await service.processMail(october7);
    assert.equal(state.sent.length, 1);
    assert.equal(state.sent[0].event.key, liveTalk2.key);
    assert.match(state.sent[0].manageUrl, /\/20-oktober\/zugang#token=/);
    assert.equal((await service.access(makeLiveToken(1, secret), october7)), null);
    const token = makeLiveToken(1, secret, liveTalk2);
    assert.equal((await service.access(token, october7)).key, liveTalk2.key);
    await service.processMail(new Date("2026-10-19T18:00Z"));
    await service.processMail(new Date("2026-10-20T17:00Z"));
    assert.deepEqual(state.sent.map(m => m.kind), ["confirmation", "day", "hour"]);
    assert.equal(await service.cancel(token), true);
    assert.equal((await service.access(token, october7)).joinUrl, null);
});

const attribution = { consent: true, version: liveAttributionVersion, sourceCode: "lt20-a01" };
test("source allowlist rejects free text, multiple identifiers and personal information", () => {
    for (const code of Object.keys(liveAttributionSources)) assert.equal(readLiveSource(`?sh_source=${code}&fbclid=not-stored`), code);
    for (const query of ["", "?utm_source=facebook", "?sh_source=test@example.test", "?sh_source=__proto__", "?sh_source=lt20-a01&sh_source=lt20-a02"])
        assert.equal(readLiveSource(query), null);
    for (const value of [null, {...attribution,consent:false}, {...attribution,consent:"true"}, {...attribution,version:"old"}, {...attribution,sourceCode:"unknown"}])
        assert.equal(normalizeLiveAttribution(value, liveAttributionEvent), null);
    assert.equal(normalizeLiveAttribution(attribution, liveTalk.key), null);
    assert.deepEqual(normalizeLiveAttribution({...attribution,email:"never-save",url:"never-save"},liveAttributionEvent),attribution);
    assert.deepEqual(normalizeLiveRegistration({...form,attribution},liveTalk2).attribution,attribution);
    assert.equal(normalizeLiveRegistration({...form,attribution}).attribution,null);
});
test("consented source is saved atomically once and never sent to newsletter or mail", async () => {
    const {state,service} = fixture(liveTalk2);
    const start = new Date("2026-10-16T12:00:00Z");
    await service.register({...form,newsletterConsent:true,attribution},start);
    await service.register({...form,attribution:{...attribution,sourceCode:"lt20-a02"}},start);
    assert.equal(state.regs.length,1); assert.equal(state.jobs.length,5);
    assert.deepEqual(state.attribution,[{registration_id:1,source_code:"lt20-a01",consent_version:liveAttributionVersion,consented_at:"2026-10-16 12:00:00"}]);
    assert.equal(state.newsletter[0].attribution,undefined);
    await service.processMail(start); assert.equal(state.sent[0].attribution,undefined);
    const admin = await service.adminInfo();
    assert.equal(admin.registrations.length,5);
    assert.equal(admin.attributionReport.active,1);
    assert.equal(admin.attributionReport.attributed,1);
    assert.equal(admin.attributionReport.sources[0].code,"lt20-a01");
    assert.ok(admin.registrations.every(row => row.source_code === "lt20-a01"));
});
test("admin contact sources join by registration ID, stay event-scoped and disappear after withdrawal", async () => {
    const {state,service}=fixture(liveTalk2);
    await service.register({...form,attribution},now);
    await service.register({...form,name:"Other test",email:"other@example.test"},now);
    state.attribution.reverse();
    let admin=await service.adminInfo();
    assert.equal(admin.registrations.length,10);
    assert.ok(admin.registrations.filter(row=>row.id===1).every(row=>row.source_code==="lt20-a01"));
    assert.ok(admin.registrations.filter(row=>row.id===2).every(row=>row.source_code===null));
    assert.equal((await service.publicInfo(now)).registrations,undefined);
    assert.equal((await service.access(makeLiveToken(1,secret,liveTalk2),now)).source_code,undefined);
    assert.equal(await service.withdrawAttribution(makeLiveToken(1,secret,liveTalk2),now),true);
    admin=await service.adminInfo();
    assert.ok(admin.registrations.every(row=>row.source_code===null));
    for (const invalid of ["fa27-c02","__proto__","unknown"]) {
        state.attribution=[{registration_id:1,source_code:invalid}];
        assert.ok((await service.adminInfo()).registrations.every(row=>row.source_code===null));
    }
    state.attribution=[{registration_id:2,source_code:"lt20-e08"},{registration_id:1,source_code:"lt20-a01"}];
    state.regs[0].status="cancelled";
    admin=await service.adminInfo();
    assert.equal(admin.attributionReport.active,1);
    assert.equal(admin.attributionReport.cancelled,1);
    assert.equal(admin.registrations.find(row=>row.id===1).source_code,"lt20-a01");
    assert.equal(admin.registrations.find(row=>row.id===2).source_code,"lt20-e08");
});
test("missing or declined consent stays unknown; repeat signup cannot rewrite history", async () => {
    const {state,service}=fixture(liveTalk2);
    await service.register(form,now);
    await service.register({...form,attribution},now);
    await service.register({...form,email:"second@example.test",attribution:{...attribution,consent:false}},now);
    assert.equal(state.attribution.length,0);
    assert.equal((await service.adminInfo()).attributionReport.sources[0].code,"unknown");
    assert.equal((await service.adminInfo()).attributionReport.active,2);
});
test("withdrawal is event-token scoped, idempotent and preserves participation and newsletter", async () => {
    const {state,service}=fixture(liveTalk2);
    await service.register({...form,newsletterConsent:true,attribution},now);
    const token=makeLiveToken(1,secret,liveTalk2);
    assert.equal((await service.access(token,now)).hasAttribution,true);
    assert.equal(await service.withdrawAttribution(makeLiveToken(1,secret),now),false);
    assert.equal(await service.withdrawAttribution("invalid",now),false);
    assert.equal(state.attribution.length,1);
    assert.equal(await service.withdrawAttribution(token,now),true);
    assert.equal(await service.withdrawAttribution(token,now),true);
    assert.equal((await service.access(token,now)).hasAttribution,false);
    assert.equal(state.regs[0].status,"active"); assert.equal(state.regs[0].newsletter_status,"pending");
    assert.equal(state.jobs.length,5);
    assert.equal((await service.adminInfo()).attributionReport.attributed,0);
    assert.equal(await service.withdrawAttribution(token,new Date(liveTalk2.deleteAfter)),false);
});
test("failed source insert rolls registration back and expiry removes source", async () => {
    const {state,service}=fixture(liveTalk2);
    state.failAttribution=true;
    await assert.rejects(()=>service.register({...form,attribution},now));
    assert.equal(state.regs.length,0); assert.equal(state.jobs.length,0); assert.equal(state.newsletter.length,0);
    state.failAttribution=false;
    await service.register({...form,attribution},now);
    await service.processMail(new Date(liveTalk2.deleteAfter));
    assert.equal(state.attribution.length,0);
});
test("source report counts registrations once and separates cancellations", () => {
    const rows=[{id:1,status:"active",source_code:"lt20-a01"},{id:1,status:"active",source_code:"lt20-a01"},{id:2,status:"active"},{id:3,status:"cancelled",source_code:"lt20-a01"}];
    assert.deepEqual(summarizeLiveAttribution(rows),{total:3,active:2,cancelled:1,attributed:1,sources:[{code:"lt20-a01",count:1,label:"Meta-Anzeige 1"},{code:"unknown",count:1,label:"Nicht zugeordnet"}]});
});

test("family lecture uses winter time, a separate calendar, recording acknowledgment and source allowlist", () => {
    const event = liveTalkFamily;
    const localTime = zone => new Intl.DateTimeFormat("de", {timeZone:zone,hour:"2-digit",minute:"2-digit"}).format(new Date(event.startsAt));
    assert.equal(localTime("Europe/Berlin"),"20:00");
    assert.equal(localTime("Europe/Istanbul"),"22:00");
    assert.equal(new Date(event.deleteAfter)-new Date(event.endsAt),90*86400000);
    assert.match(liveCalendar(joinUrl,event),/DTSTART:20261027T190000Z/);
    assert.doesNotMatch(liveCalendar(joinUrl,event),/DTEND/);
    assert.throws(()=>normalizeLiveRegistration(form,event),{field:"recordingNotice"});
    const accepted={...form,recordingNoticeAccepted:true,attribution:{...attribution,sourceCode:"fa27-b01"}};
    assert.equal(normalizeLiveRegistration(accepted,event).attribution.sourceCode,"fa27-b01");
    assert.equal(normalizeLiveRegistration({...accepted,attribution},event).attribution,null);
    assert.equal(readLiveSource("?sh_source=fa27-b01",event.key),"fa27-b01");
    assert.equal(readLiveSource("?sh_source=fa27-b01",liveTalk2.key),null);
    assert.equal(readLiveSource("?sh_source=lt20-a01",event.key),null);
    for(const kind of ["confirmation","day","hour"]) {
        const mail=liveEmail({name:"Test",kind,joinUrl,meetingId:"12345678901",passcode,manageUrl:"https://spirit-healing.tr/live-vortrag/familienaufstellung/zugang#token=test",event});
        assert.match(mail.text,/27\. Oktober 2026/);
        assert.match(mail.text,/Zoom-Cloud/);
        assert.match(mail.text,/Kamera und dein Mikrofon können ausgeschaltet bleiben/);
        assert.doesNotMatch(mail.text,/13.Wochen|Workbook|Replay ansehen|20\. Oktober/);
    }
});

test("family registration sends once with isolated access and its own consented attribution report", async () => {
    const {state,service}=fixture(liveTalkFamily);
    const start=new Date("2026-10-16T12:00:00Z");
    const accepted=normalizeLiveRegistration({...form,recordingNoticeAccepted:true,attribution:{...attribution,sourceCode:"fa27-b01"}},liveTalkFamily);
    await service.register(accepted,start); await service.register(accepted,start);
    await service.processMail(start); await service.processMail(start);
    assert.equal(state.regs.length,1); assert.equal(state.sent.length,1); assert.equal(state.jobs.length,3);
    assert.match(state.sent[0].manageUrl,/\/familienaufstellung\/zugang#token=/);
    assert.equal(state.sent[0].event.key,liveTalkFamily.key);
    assert.equal((await service.adminInfo()).attributionReport.sources[0].code,"fa27-b01");
    const token=makeLiveToken(1,secret,liveTalkFamily);
    assert.equal((await service.access(token,start)).joinUrl,joinUrl);
    assert.equal(await service.access(makeLiveToken(1,secret,liveTalk2),start),null);
    assert.equal(await service.withdrawAttribution(makeLiveToken(1,secret,liveTalk2),start),false);
    assert.equal(await service.withdrawAttribution(token,start),true);
    await service.processMail(new Date("2026-10-26T19:00Z"));
    await service.processMail(new Date("2026-10-27T18:00Z"));
    assert.deepEqual(state.sent.map(mail=>mail.kind),["confirmation","day","hour"]);
    assert.equal(await service.cancel(token),true);
    assert.equal((await service.access(token,start)).joinUrl,null);
});

test("family C02 source is event-scoped, optional, saved once and distinct from B01", async () => {
    const source={consent:true,version:liveAttributionVersion,sourceCode:"fa27-c02"};
    assert.equal(readLiveSource("?sh_source=fa27-c02",liveTalkFamily.key),"fa27-c02");
    assert.equal(readLiveSource("?sh_source=fa27-c02",liveTalk2.key),null);
    assert.equal(normalizeLiveAttribution({...source,consent:false},liveTalkFamily.key),null);
    const {state,service}=fixture(liveTalkFamily);
    const registration=normalizeLiveRegistration({...form,recordingNoticeAccepted:true,attribution:source},liveTalkFamily);
    await service.register(registration,now);
    await service.register(registration,now);
    assert.equal(state.attribution.length,1);
    assert.equal(state.attribution[0].source_code,"fa27-c02");
    assert.equal((await service.adminInfo()).attributionReport.sources[0].label,"Meta-Anzeige Familienaufstellung C02");
    assert.ok((await service.adminInfo()).registrations.every(row=>row.source_code==="fa27-c02"));
});

test("second live has four approved reminders in Berlin time and late signups only get future jobs", () => {
    const jobs = liveMailSchedule(new Date("2026-10-18T09:00Z"),liveTalk2);
    assert.deepEqual(jobs.map(j=>j.kind),["confirmation","two_days","day","morning","hour"]);
    const berlin = date => new Intl.DateTimeFormat("de-DE",{timeZone:"Europe/Berlin",dateStyle:"short",timeStyle:"short"}).format(date);
    assert.deepEqual(jobs.slice(1).map(j=>berlin(j.dueAt)),["18.10.26, 12:00","19.10.26, 20:00","20.10.26, 09:00","20.10.26, 19:00"]);
    assert.deepEqual(liveMailSchedule(new Date("2026-10-19T19:00Z"),liveTalk2).map(j=>j.kind),["confirmation","morning","hour"]);
    assert.deepEqual(liveMailSchedule(new Date("2026-10-20T08:00Z"),liveTalk2).map(j=>j.kind),["confirmation","hour"]);
    assert.deepEqual(liveMailSchedule(new Date("2026-10-20T17:30Z"),liveTalk2).map(j=>j.kind),["confirmation"]);
    assert.deepEqual(liveMailSchedule(new Date(liveTalk2.startsAt),liveTalk2),[]);
});

test("approved reminders backfill existing registrations once, preserve prior states and exclude other events/cancelled/late registrations", async () => {
    const {state,service,db}=fixture(liveTalk2);
    await service.register(form,new Date("2026-10-07T10:00Z"));
    state.jobs=state.jobs.filter(j=>!["two_days","morning"].includes(j.kind));
    state.jobs.forEach((j,i)=>j.id=i+1);
    state.jobs[0].status="sent"; state.jobs.find(j=>j.kind==="day").status="uncertain";
    state.regs.push({id:2,event_key:liveTalkFamily.key,status:"active",created_at:"2026-10-07 10:00:00"},
        {id:3,event_key:liveTalk2.key,status:"cancelled",created_at:"2026-10-07 10:00:00"});
    await initializeLiveTalk(db,liveTalk2,new Date("2026-10-18T11:00Z"));
    await initializeLiveTalk(db,liveTalk2,new Date("2026-10-18T11:00Z"));
    assert.equal(state.jobs.length,5);
    assert.ok(state.jobs.every(j=>j.registration_id===1));
    assert.equal(state.jobs.find(j=>j.kind==="day").status,"uncertain");
    await service.processMail(new Date("2026-10-18T11:00Z"));
    await initializeLiveTalk(db,liveTalk2,new Date("2026-10-18T11:00Z"));
    await service.processMail(new Date("2026-10-18T11:01Z"));
    assert.deepEqual(state.sent.map(m=>m.kind),["two_days"]);
    await service.register({...form,email:"late@example.test"},new Date("2026-10-18T11:02Z"));
    await initializeLiveTalk(db,liveTalk2,new Date("2026-10-18T11:03Z"));
    assert.equal(state.jobs.filter(j=>j.kind==="two_days").length,1);
});

test("four second-live reminders send once, have distinct copy, and cancellation prevents the remainder", async () => {
    const {state,service}=fixture(liveTalk2);
    await service.register(form,new Date("2026-10-07T10:00Z"));
    await service.processMail(new Date("2026-10-07T10:00Z"));
    for(const time of ["2026-10-18T10:00Z","2026-10-19T18:00Z","2026-10-20T07:00Z","2026-10-20T17:00Z"]){
        await service.processMail(new Date(time)); await service.processMail(new Date(time));
    }
    assert.deepEqual(state.sent.map(m=>m.kind),["confirmation","two_days","day","morning","hour"]);
    const copies=state.sent.slice(1).map(m=>liveEmail(m));
    assert.equal(new Set(copies.map(c=>c.subject)).size,4);
    for(const copy of copies){
        assert.match(copy.text,/Hallo Testperson,/); assert.ok(copy.text.includes(joinUrl));
        assert.match(copy.text,/20 Uhr deutscher Zeit/); assert.match(copy.text,/Anmeldung ansehen oder absagen/);
        assert.doesNotMatch(copy.text,/anmelden|Restplätze|13-Wochen-Programm buchen/);
    }
    const cancelled=fixture(liveTalk2);
    await cancelled.service.register(form,new Date("2026-10-07T10:00Z"));
    await cancelled.service.cancel(makeLiveToken(1,secret,liveTalk2));
    await cancelled.service.processMail(new Date("2026-10-20T17:00Z"));
    assert.equal(cancelled.state.sent.length,0);
});

test("expired two-day, tomorrow and morning messages are skipped, never sent together as catch-up", async () => {
    for(const [kind,time] of [["two_days","2026-10-18T22:00Z"],["day","2026-10-19T22:00Z"],["morning","2026-10-20T10:00Z"]]){
        const {state,service}=fixture(liveTalk2);
        await service.register(form,new Date("2026-10-07T10:00Z"));
        state.jobs=state.jobs.filter(j=>j.kind===kind);
        await service.processMail(new Date(time));
        assert.equal(state.jobs[0].status,"skipped"); assert.equal(state.sent.length,0);
    }
});

test("third live is scheduled for 3 November at 20:00 in Berlin and 22:00 in Istanbul", () => {
    const localTime = zone => new Intl.DateTimeFormat("de", { timeZone: zone, hour: "2-digit", minute: "2-digit" }).format(new Date(liveTalk3.startsAt));
    assert.equal(localTime("Europe/Berlin"), "20:00");
    assert.equal(localTime("Europe/Istanbul"), "22:00");
    assert.equal(liveTalk3.startsAt, "2026-11-03T19:00:00.000Z");
    assert.deepEqual(liveMailSchedule(new Date("2026-10-22T18:00:00Z"), liveTalk3).map(job => job.kind), ["confirmation", "two_days", "day", "morning", "hour"]);
    const calendar = liveCalendar(joinUrl, liveTalk3);
    assert.match(calendar, /DTSTART:20261103T190000Z/);
    assert.doesNotMatch(calendar, /DTEND/);
});

test("third-live reminders contain the direct and manual Zoom access", () => {
    for (const kind of ["two_days", "day", "morning", "hour"]) {
        const mail = liveEmail({ name: "Test", kind, joinUrl, meetingId: "12345678901", passcode, manageUrl: "https://spirit-healing.tr/live-vortrag/3-november/zugang#token=test", event: liveTalk3 });
        assert.match(mail.text, /3\. November/);
        assert.ok(mail.text.includes(joinUrl));
        assert.match(mail.text, /Meeting-ID: 12345678901/);
        assert.match(mail.text, /Kenncode: 084526/);
        assert.match(mail.text, /Anmeldung ansehen oder absagen/);
    }
});

test("third-live registration has isolated access and five scheduled messages", async () => {
    const { state, service } = fixture(liveTalk3);
    const registrationDate = new Date("2026-10-22T18:00:00Z");
    await service.register(form, registrationDate);
    await service.register(form, registrationDate);
    assert.equal(state.regs.length, 1);
    assert.equal(state.jobs.length, 5);
    await service.processMail(registrationDate);
    assert.equal(state.sent.length, 1);
    assert.equal(state.sent[0].event.key, liveTalk3.key);
    assert.match(state.sent[0].manageUrl, /\/3-november\/zugang#token=/);
    const token = makeLiveToken(1, secret, liveTalk3);
    assert.equal((await service.access(token, registrationDate)).key, liveTalk3.key);
    assert.equal(await service.access(makeLiveToken(1, secret, liveTalk2), registrationDate), null);
});


test("Nov3 service registration accepts only contact details without manufacturing consent", () => {
    const contact = { name: "  Neu  ", email: " NEW@example.test " };
    const result = normalizeLiveRegistration(contact, liveTalk3);
    assert.equal(result.name, "Neu");
    assert.equal(result.email, "new@example.test");
    for (const flag of ["privacyConsent", "recordingNoticeAccepted"]) assert.equal(Object.hasOwn(result, flag), false);
    assert.equal(result.newsletterConsent, false);
    assert.equal(normalizeLiveRegistration({ ...contact, privacyConsent: true, recordingNoticeAccepted: true, newsletterConsent: true }, liveTalk3).newsletterConsent, false);
    for (const invalid of [{ name: "" }, { email: "oops" }, { company: "bot" }, { name: "Hi\nBcc: spam" }]) {
        assert.throws(() => normalizeLiveRegistration({ ...contact, ...invalid }, liveTalk3));
    }
    for (const event of [liveTalk, liveTalk2, liveTalkFamily]) {
        assert.throws(() => normalizeLiveRegistration(contact, event), { field: "privacyConsent" });
    }
    assert.throws(() => normalizeLiveRegistration({ ...contact, privacyConsent: true }, liveTalkFamily), { field: "recordingNotice" });
});

test("Nov3 ignores forged newsletter requests at service boundary and preserves old rows on duplicate", async () => {
    const { state, service } = fixture(liveTalk3);
    const date = new Date("2026-10-31T12:00Z");
    await service.register({ name: "Neu", email: "new@example.test", newsletterConsent: true }, date);
    assert.equal(state.regs[0].newsletter_requested, 0);
    assert.equal(state.regs[0].newsletter_status, "not_requested");
    assert.equal(state.regs[0].privacy_version, "nov3-service-notice-2026-10-31");
    assert.equal(state.newsletter.length, 0);
    // An older registration's historical consent version and newsletter status stay intact.
    Object.assign(state.regs[0], { privacy_version: "live-vortrag-2026-09-22", newsletter_requested: 1, newsletter_status: "confirmed" });
    const original = structuredClone(state.regs[0]);
    await service.register({ name: "Changed", email: "new@example.test", newsletterConsent: true }, date);
    assert.deepEqual(state.regs[0], original);
    assert.equal(state.jobs.length, 5);
    assert.equal(state.newsletter.length, 0);
    await service.processMail(date);
    for (const time of ["2026-11-01T10:00Z", "2026-11-02T19:00Z", "2026-11-03T07:00Z", "2026-11-03T18:00Z"]) {
        await service.processMail(new Date(time));
        await service.processMail(new Date(time));
    }
    assert.deepEqual(state.sent.map(mail => mail.kind), ["confirmation", "two_days", "day", "morning", "hour"]);
});


test("Nov3 retains existing newsletter histories on duplicate and cancellation", async () => {
    for (const status of ["not_requested", "pending", "confirmed", "subscribed", "unsubscribed", "confirmation_failed"]) {
        const { state, service } = fixture(liveTalk3);
        const date = new Date("2026-11-03T17:30Z");
        await service.register(normalizeLiveRegistration({ name: "Alt", email: "existing@example.test" }, liveTalk3), date);
        Object.assign(state.regs[0], { newsletter_status: status, newsletter_requested: status === "not_requested" ? 0 : 1, privacy_version: "live-vortrag-2026-09-22" });
        const original = structuredClone(state.regs[0]);
        await service.register({ name: "Overwrite", email: "existing@example.test", newsletterConsent: true }, date);
        assert.deepEqual(state.regs[0], original);
        assert.deepEqual(state.jobs.map(job => job.kind), ["confirmation", "hour"]);
        await service.cancel(makeLiveToken(1, secret, liveTalk3), date);
        await service.processMail(new Date("2026-11-03T18:00Z"));
        assert.equal(state.sent.length, 0);
        assert.equal(state.regs[0].newsletter_status, status);
        assert.equal(state.newsletter.length, 0);
    }
});

test("Nov3 still enforces readiness, cutoff and capacity", async () => {
    const { state, service } = fixture(liveTalk3);
    const contact = normalizeLiveRegistration({ name: "Neu", email: "new@example.test" }, liveTalk3);
    const date = new Date("2026-10-31T12:00Z");
    state.config.enabled = 0;
    await assert.rejects(() => service.register(contact, date), { code: "closed" });
    state.config.enabled = 1;
    await assert.rejects(() => service.register(contact, new Date(liveTalk3.startsAt)), { code: "closed" });
    state.regs = Array.from({ length: liveTalk3.capacity }, (_, id) => ({ id: id + 1, email: `full${id}@example.test`, status: "active" }));
    await assert.rejects(() => service.register(contact, date), { code: "full" });
    assert.equal(state.newsletter.length, 0);
    assert.equal(state.jobs.length, 0);
});


test("actual Nov3 HTTP registration route accepts minimal payload and preserves service safeguards", async () => {
    // Execute the exact inline production route, without starting the production app,
    // initializing other features, or connecting to its database/SMTP transport.
    const source = readFileSync(new URL("../server.js", import.meta.url), "utf8");
    const start = source.indexOf('app.post("/api/live-talk-3/register",');
    const end = source.indexOf('app.post("/api/live-talk-3/access",', start);
    assert.ok(start > 0 && end > start);
    const { state, service } = fixture(liveTalk3);
    const date = new Date("2026-10-31T12:00Z");
    const app = express(); app.use(express.json());
    const next = (_request, _response, proceed) => proceed();
    runInNewContext(source.slice(start, end), {
        app, submissionLimiter: next, sameOriginOnly: next,
        normalizeLiveRegistration, liveTalk3, WebinarValidationError,
        liveTalk3Service: { register: form => service.register(form, date) },
    });
    const server = await new Promise((resolve, reject) => {
        const handle = app.listen(0, "127.0.0.1", () => resolve(handle));
        handle.on("error", reject);
    });
    const endpoint = `http://127.0.0.1:${server.address().port}/api/live-talk-3/register`;
    const post = body => fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const minimal = { name: "HTTP Test", email: "http@example.test" };
    try {
        const accepted = await post(minimal);
        assert.equal(accepted.status, 202);
        assert.equal(accepted.headers.get("cache-control"), "no-store");
        assert.deepEqual(await accepted.json(), { ok: true, accepted: true });
        assert.equal(state.regs.length, 1);
        assert.equal(state.regs[0].newsletter_requested, 0);
        assert.equal(state.regs[0].newsletter_status, "not_requested");
        assert.equal(state.regs[0].privacy_version, "nov3-service-notice-2026-10-31");
        assert.deepEqual(state.jobs.map(job => job.kind), ["confirmation", "two_days", "day", "morning", "hour"]);
        const original = structuredClone(state.regs[0]);
        const duplicate = await post({ ...minimal, name: "Overwrite", privacyConsent: true, recordingNoticeAccepted: true, newsletterConsent: true });
        assert.equal(duplicate.status, 202);
        assert.deepEqual(state.regs[0], original);
        assert.equal(state.jobs.length, 5);
        assert.equal(state.newsletter.length, 0);
        for (const invalid of [{ ...minimal, email: "invalid" }, { ...minimal, name: "" }, { ...minimal, company: "bot" }, { ...minimal, name: "Hi\nBcc: spam" }]) {
            const rejected = await post(invalid);
            assert.equal(rejected.status, 400);
            assert.equal((await rejected.json()).error, "validation");
        }
        state.config.enabled = 0;
        const closed = await post({ name: "Other", email: "other@example.test" });
        assert.equal(closed.status, 409);
        assert.equal((await closed.json()).error, "closed");
        state.config.enabled = 1;
        for (let id = 2; id <= liveTalk3.capacity; id++) state.regs.push({ id, email: `full${id}@example.test`, status: "active" });
        const full = await post({ name: "Other", email: "other@example.test" });
        assert.equal(full.status, 409);
        assert.equal((await full.json()).error, "full");
        assert.equal(state.sent.length, 0);
        assert.equal(state.newsletter.length, 0);
        await service.processMail(date);
        await service.processMail(date);
        assert.equal(state.sent.length, 1);
        assert.equal(state.sent[0].email, minimal.email);
    } finally {
        server.closeAllConnections();
        await new Promise(resolve => server.close(resolve));
    }
});
