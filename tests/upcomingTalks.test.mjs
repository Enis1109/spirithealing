import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { upcomingTalks } from "../src/content/upcomingTalks.js";
import { liveTalk3, liveTalkFamily, normalizeLiveRegistration } from "../server/liveTalkConfig.js";
import { publicEvents } from "../src/content/replayFunnel.js";

test("popup dates match registration services and German winter time", () => {
    assert.equal(upcomingTalks[0].startsAt, liveTalkFamily.startsAt);
    assert.equal(upcomingTalks[1].startsAt, liveTalk3.startsAt);
    for (const talk of upcomingTalks) {
        assert.equal(new Intl.DateTimeFormat("de", {timeZone:"Europe/Berlin", hour:"2-digit",minute:"2-digit"}).format(new Date(talk.startsAt)), "20:00");
        assert.ok(talk.path.endsWith("#anmeldung"));
    }
});
test("past invitations expire individually and none remain after the last start", () => {
    const active = date => upcomingTalks.filter(t => Date.parse(date) < Date.parse(t.startsAt));
    assert.equal(active("2026-10-25T12:00:00Z").length, 2);
    assert.deepEqual(active("2026-10-27T19:00:00Z").map(t => t.id), ["third-2026-11-03"]);
    assert.equal(active("2026-11-03T19:00:00Z").length, 0);
});
test("third registration requires recording acknowledgement and newsletter remains optional", () => {
    const data = {name:"Test",email:"test@example.com",privacyConsent:true,newsletterConsent:false,company:""};
    assert.throws(() => normalizeLiveRegistration(data, liveTalk3));
    assert.equal(normalizeLiveRegistration({...data,recordingNoticeAccepted:true},liveTalk3).newsletterConsent,false);
});
test("calendar, page and popup use the same published registration route", () => {
    assert.equal(publicEvents.find(e => e.id === "third-live").href, "/live-vortrag/3-november");
    const app = readFileSync(new URL("../src/App.jsx", import.meta.url),"utf8");
    for (const talk of upcomingTalks) assert.ok(app.includes('path="' + talk.path.split("#")[0] + '"'));
    const page = readFileSync(new URL("../src/sections/LiveTalkThird.jsx",import.meta.url),"utf8");
    assert.ok(page.includes('id="anmeldung"'));
    assert.ok(page.includes('disabled={!info?.ready'));
});
