import assert from "node:assert/strict";
import test from "node:test";

import { isProgramWeekLocked, zepterFirstReleaseAt } from "../server/programRelease.js";

test("keeps week one locked until 02:00 in Istanbul", () => {
    assert.equal(zepterFirstReleaseAt, "2026-08-19T23:00:00.000Z");
    assert.equal(isProgramWeekLocked({
        published: true,
        weekNumber: 1,
        releaseOn: "2026-08-20",
        now: new Date("2026-08-19T22:59:59.999Z"),
    }), true);
    assert.equal(isProgramWeekLocked({
        published: true,
        weekNumber: 1,
        releaseOn: "2026-08-20",
        now: new Date("2026-08-19T23:00:00.000Z"),
    }), false);
});

test("keeps unpublished weeks locked", () => {
    assert.equal(isProgramWeekLocked({
        published: false,
        weekNumber: 1,
        releaseOn: "2026-08-20",
        now: new Date("2026-08-20T09:00:00.000Z"),
    }), true);
});

test("continues to release later weeks by Istanbul calendar date", () => {
    assert.equal(isProgramWeekLocked({
        published: true,
        weekNumber: 2,
        releaseOn: "2026-08-27",
        now: new Date("2026-08-26T20:59:59.999Z"),
    }), true);
    assert.equal(isProgramWeekLocked({
        published: true,
        weekNumber: 2,
        releaseOn: "2026-08-27",
        now: new Date("2026-08-26T21:00:00.000Z"),
    }), false);
});

test("keeps later weeks locked until participant access is enabled", () => {
    assert.equal(isProgramWeekLocked({
        published: true,
        weekNumber: 2,
        releaseOn: "2026-08-20",
        participantAccessEnabled: false,
        now: new Date("2026-08-23T09:00:00.000Z"),
    }), true);
    assert.equal(isProgramWeekLocked({
        published: true,
        weekNumber: 2,
        releaseOn: "2026-08-20",
        participantAccessEnabled: true,
        now: new Date("2026-08-23T09:00:00.000Z"),
    }), false);
});
