import assert from "node:assert/strict";
import test from "node:test";
import { memberEvents, getUpcomingMemberEvents } from "../src/content/memberEvents.js";

test("members have four constellation days and an undated programme conversation phase, with German and Turkish copy", () => {
    assert.equal(getUpcomingMemberEvents(new Date("2026-09-27T10:00:00Z")).length, 8);
    for (const event of memberEvents) {
        assert.ok(event.href.startsWith("/"));
        for (const language of ["de", "tr"]) {
            for (const key of ["kind", "title", "date", "time", "place", "text", "action"]) {
                assert.ok(event[language][key], `${event.id}/${language}/${key}`);
            }
        }
    }
});

test("live introduction and open programme conversation phase remain separate", () => {
    const introduction = memberEvents.find(event => event.href === "/live-vortrag");
    const programme = memberEvents.find(event => event.id === "zepter-13-2026");
    assert.match(introduction.de.date, /6\. Oktober 2026/);
    assert.equal(programme.href, "/13-wochen-programm");
    assert.match(programme.de.date, /Gesprächsphase seit 21\. Oktober 2026/);
    assert.match(programme.de.time, /Kostenfreies Kennenlernen · 30 Minuten/);
    assert.match(programme.de.time, /Programmstart wird bekannt gegeben/);
    assert.equal(programme.endsAt, undefined);
    assert.match(programme.de.text, /späteren Programmbegleitung/);
});

test("Berlin location is district only and the group uses the confirmed Sunday time", () => {
    for (const event of memberEvents.filter(event => event.id.startsWith("constellation-"))) {
        assert.equal(event.de.place, "Berlin-Kreuzberg");
        assert.equal(event.tr.place, "Berlin-Kreuzberg");
        assert.match(event.de.time, /10:00–19:00/);
    }
    assert.doesNotMatch(JSON.stringify(memberEvents), /Manoa|Urbanstraße|10967/);
    const group = memberEvents.find(event => event.id === "weekly-experience-group");
    assert.equal(group.de.date, "Jeden Sonntag");
    assert.equal(group.de.time, "19:00–21:30 Uhr · deutsche Zeit");
    assert.equal(group.tr.date, "Her pazar");
    assert.equal(group.tr.time, "19:00–21:30 · Almanya saati");
    assert.equal(group.href, "/kontakt");
});

test("past dated events disappear while the weekly group remains", () => {
    const ids = getUpcomingMemberEvents(new Date("2026-10-11T10:00:00Z")).map(e => e.id);
    assert.deepEqual(ids, ["family-constellation-2026-10-27", "constellation-2026-12-12", "constellation-2026-12-13", "constellation-2027-01-30", "constellation-2027-01-31", "zepter-13-2026", "weekly-experience-group"]);
    assert.deepEqual(getUpcomingMemberEvents(new Date("2027-02-04T00:00:00Z")).map(e => e.id), ["zepter-13-2026", "weekly-experience-group"]);
});

test("unconfirmed programme evenings are not listed in the member calendar", () => {
    assert.equal(memberEvents.some(event => event.id.startsWith("program-live-")), false);
    const programme = memberEvents.find(event => event.id === "zepter-13-2026");
    assert.doesNotMatch(JSON.stringify(programme), /2026-11-11|2027-02-03|11\. November|3\. Februar|11 Kasım|3 Şubat/);
});
