import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { replayFunnel, publicEvents, programLiveEvents, berlinDate, eventIsPast, monthCells, eventsOnDay, eventsInMonth } from "../src/content/replayFunnel.js";
import { metadataForPath } from "../src/seo/pageMeta.js";
import { liveTalk, liveTalk2, makeLiveToken, readLiveToken, liveMailSchedule, liveCalendar, liveEmail } from "../server/liveTalkConfig.js";
import { createLiveTalkService, initializeLiveTalk } from "../server/liveTalk.js";

test("calendar uses Berlin day boundaries and spans both Berlin seminar days", () => {
    assert.equal(berlinDate(new Date("2026-10-06T22:30:00Z")), "2026-10-07");
    const cells = monthCells(2026, 9); assert.equal(cells[3], "2026-10-01"); assert.equal(cells.filter(Boolean).length, 31); assert.equal(cells.length % 7, 0);
    assert.ok(eventsOnDay("2026-10-09").some(e => e.id === "berlin"));
    assert.ok(eventsOnDay("2026-10-10").some(e => e.id === "berlin"));
    assert.equal(eventsOnDay("2026-10-11").some(e => e.id === "berlin"), false);
    assert.equal(eventsOnDay("2026-10-06")[0].href, replayFunnel.path);
    assert.equal(eventIsPast(eventsOnDay("2026-10-06")[0], new Date("2026-10-07T10:00Z")), true);
});
test("weekly group appears every Sunday in grid and month list, including after DST changes", () => {
    const october = eventsInMonth("2026-10");
    const groups = october.filter(e => e.id.startsWith("experience-"));
    assert.deepEqual(groups.map(e => e.date), ["2026-10-04", "2026-10-11", "2026-10-18", "2026-10-25"]);
    for (const event of groups) {
        assert.equal(event.time, "19:00–21:30");
        assert.equal(event.href, "/mitglieder?tab=experience");
        assert.ok(eventsOnDay(event.date).some(e => e.id === event.id));
    }
    assert.equal(eventsOnDay("2026-10-12").length, 0);
    assert.equal(new Set(october.map(e => e.id)).size, october.length);
    assert.deepEqual(october.map(e => e.date), october.map(e => e.date).sort());
    assert.deepEqual(eventsInMonth("2026-11").filter(e => e.id.startsWith("experience-")).map(e => e.date), ["2026-11-01", "2026-11-08", "2026-11-15", "2026-11-22", "2026-11-29"]);
});
test("calendar targets and private access routes are known to production SEO router", () => {
    for (const event of publicEvents) assert.equal(metadataForPath(event.href).notFound, false, event.href);
    assert.equal(metadataForPath("/live-vortrag/20-oktober/zugang").noindex, true);
    assert.equal(metadataForPath("/admin/live-vortrag-2").noindex, true);
});
test("thirteen Wednesday evenings appear once in both calendar views through 3 February", () => {
    assert.deepEqual(programLiveEvents.map(event => event.date), ["2026-11-11", "2026-11-18", "2026-11-25", "2026-12-02", "2026-12-09", "2026-12-16", "2026-12-23", "2026-12-30", "2027-01-06", "2027-01-13", "2027-01-20", "2027-01-27", "2027-02-03"]);
    for (const event of programLiveEvents) {
        assert.equal(new Date(`${event.date}T12:00Z`).getUTCDay(), 3);
        assert.equal(event.time, "19:30–21:00");
        assert.equal(eventsOnDay(event.date).filter(item => item.id === event.id).length, 1);
        assert.equal(eventsInMonth(event.date.slice(0, 7)).filter(item => item.id === event.id).length, 1);
    }
    assert.equal(eventsOnDay("2026-11-04").some(event => event.id.startsWith("program-live-")), false);
    assert.equal(eventsOnDay("2027-02-10").some(event => event.id.startsWith("program-live-")), false);
    assert.equal(eventsOnDay("2026-11-11").length, 1);
});
test("workbook and photo exist; approved Vimeo recording uses privacy mode", () => {
    assert.equal(readFileSync(new URL(`../public${replayFunnel.workbook}`, import.meta.url)).subarray(0, 5).toString(), "%PDF-");
    assert.ok(readFileSync(new URL(`../public${replayFunnel.image}`, import.meta.url)).length > 1000);
    assert.equal(replayFunnel.videoUrl, "https://player.vimeo.com/video/1233482544?dnt=1");
    const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
    assert.match(app, /location.pathname === "\/"/);
    assert.match(app, /live-vortrag\/aufzeichnung\$\{location.search\}/);
});
test("second event has independent tokens, correct time and reminders", () => {
    const secret = "isolated-testing-secret-with-at-least-32-characters";
    const token = makeLiveToken(5, secret, liveTalk2);
    assert.equal(readLiveToken(token, secret, liveTalk2), 5);
    assert.equal(readLiveToken(token, secret, liveTalk), null);
    assert.equal(readLiveToken(makeLiveToken(5, secret), secret, liveTalk2), null);
    const schedule = liveMailSchedule(new Date("2026-10-07T10:00Z"), liveTalk2);
    assert.equal(schedule[1].dueAt.toISOString(), "2026-10-19T18:00:00.000Z");
    assert.equal(schedule[2].dueAt.toISOString(), "2026-10-20T17:00:00.000Z");
    assert.deepEqual(liveMailSchedule(new Date(liveTalk2.startsAt), liveTalk2), []);
    const url = "https://us06web.zoom.us/j/12345678901?pwd=test";
    const calendar = liveCalendar(url, liveTalk2);
    assert.match(calendar, /DTSTART:20261020T180000Z/); assert.doesNotMatch(calendar, /DTEND|20261006T173000/);
    const mail = liveEmail({ name: "Test", kind: "confirmation", joinUrl: url, meetingId: "12345678901", passcode: "test", manageUrl: "https://example.test", event: liveTalk2 });
    assert.match(mail.subject, /20. Oktober/); assert.match(mail.text, /20 Uhr deutscher Zeit/); assert.doesNotMatch(mail.text, /6. Oktober|60 Minuten/);
});
test("new event initializes disabled and does not expose Zoom credentials", async () => {
    const queries = [];
    const db = { execute: async (sql, args = []) => { queries.push({ sql, args }); return [[{ enabled: 0, join_url: null, passcode: null }]]; } };
    await initializeLiveTalk(db, liveTalk2);
    assert.ok(queries.some(q => q.sql.startsWith("INSERT IGNORE") && q.args[0] === liveTalk2.key));
    const service = createLiveTalkService({ db, event: liveTalk2, secret: "test-secret-with-at-least-thirty-two-characters" });
    const info = await service.publicInfo(new Date("2026-10-07T10:00Z"));
    assert.equal(info.ready, false); assert.equal(info.joinUrl, undefined); assert.equal(info.passcode, undefined);
    await assert.rejects(() => service.register({}, new Date("2026-10-07T10:00Z")), { code: "closed" });
});
