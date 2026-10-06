import assert from "node:assert/strict";
import test from "node:test";
import { memberEvents, getUpcomingMemberEvents } from "../src/content/memberEvents.js";

test("members have all four current events, with German and Turkish copy", () => {
    assert.equal(getUpcomingMemberEvents(new Date("2026-09-27T10:00:00Z")).length, 4);
    for (const event of memberEvents) {
        assert.ok(event.href.startsWith("/"));
        for (const language of ["de", "tr"]) {
            for (const key of ["kind", "title", "date", "time", "place", "text", "action"]) {
                assert.ok(event[language][key], `${event.id}/${language}/${key}`);
            }
        }
    }
});

test("live introduction, onboarding and programme are separate dates and destinations", () => {
    assert.equal(memberEvents[0].href, "/live-vortrag");
    assert.match(memberEvents[0].de.date, /6\. Oktober 2026/);
    assert.equal(memberEvents[2].href, "/13-wochen-programm");
    assert.match(memberEvents[2].de.date, /Onboarding ab 21\. Oktober 2026/);
    assert.match(memberEvents[2].de.time, /11\. November 2026/);
    assert.match(memberEvents[2].de.date, /3\. Februar 2027/);
});

test("Berlin location is district only and the group uses the confirmed Sunday time", () => {
    assert.match(memberEvents[1].de.place, /^Berlin-Kreuzberg/);
    assert.match(memberEvents[1].tr.place, /^Berlin-Kreuzberg/);
    assert.doesNotMatch(JSON.stringify(memberEvents), /Manoa|Urbanstraße|10967/);
    assert.equal(memberEvents[3].de.date, "Jeden Sonntag");
    assert.equal(memberEvents[3].de.time, "19:00–21:30 Uhr · deutsche Zeit");
    assert.equal(memberEvents[3].tr.date, "Her pazar");
    assert.equal(memberEvents[3].tr.time, "19:00–21:30 · Almanya saati");
    assert.equal(memberEvents[3].href, "/kontakt");
});

test("past dated events disappear while the weekly group remains", () => {
    const ids = getUpcomingMemberEvents(new Date("2026-10-11T10:00:00Z")).map(e => e.id);
    assert.deepEqual(ids, ["zepter-13-2026", "weekly-experience-group"]);
    assert.deepEqual(getUpcomingMemberEvents(new Date("2027-02-04T00:00:00Z")).map(e => e.id), ["weekly-experience-group"]);
});
