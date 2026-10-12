import assert from "node:assert/strict";
import test from "node:test";
import { memberEvents, getUpcomingMemberEvents } from "../src/content/memberEvents.js";

test("members have four separate constellation days and thirteen live evenings, with German and Turkish copy", () => {
    assert.equal(getUpcomingMemberEvents(new Date("2026-09-27T10:00:00Z")).length, 20);
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
    assert.equal(memberEvents[5].href, "/13-wochen-programm");
    assert.match(memberEvents[5].de.date, /Onboarding ab 21\. Oktober 2026/);
    assert.match(memberEvents[5].de.time, /11\. November 2026/);
    assert.match(memberEvents[5].de.date, /3\. Februar 2027/);
});

test("Berlin location is district only and the group uses the confirmed Sunday time", () => {
    for (const event of memberEvents.filter(event => event.id.startsWith("constellation-"))) {
        assert.equal(event.de.place, "Berlin-Kreuzberg");
        assert.equal(event.tr.place, "Berlin-Kreuzberg");
        assert.match(event.de.time, /10:00–19:00/);
    }
    assert.doesNotMatch(JSON.stringify(memberEvents), /Manoa|Urbanstraße|10967/);
    assert.equal(memberEvents[6].de.date, "Jeden Sonntag");
    assert.equal(memberEvents[6].de.time, "19:00–21:30 Uhr · deutsche Zeit");
    assert.equal(memberEvents[6].tr.date, "Her pazar");
    assert.equal(memberEvents[6].tr.time, "19:00–21:30 · Almanya saati");
    assert.equal(memberEvents[6].href, "/kontakt");
});

test("past dated events disappear while the weekly group remains", () => {
    const ids = getUpcomingMemberEvents(new Date("2026-10-11T10:00:00Z")).map(e => e.id);
    assert.deepEqual(ids, ["constellation-2026-12-12", "constellation-2026-12-13", "constellation-2027-01-30", "constellation-2027-01-31", "zepter-13-2026", "weekly-experience-group", ...Array.from({ length: 13 }, (_, index) => `program-live-${index + 1}`)]);
    assert.deepEqual(getUpcomingMemberEvents(new Date("2027-02-04T00:00:00Z")).map(e => e.id), ["weekly-experience-group"]);
});

test("live evening expires at 21:00 German winter time", () => {
    assert.ok(getUpcomingMemberEvents(new Date("2026-11-11T19:59:59Z")).some(event => event.id === "program-live-1"));
    assert.equal(getUpcomingMemberEvents(new Date("2026-11-11T20:00:00Z")).some(event => event.id === "program-live-1"), false);
});
