import assert from "node:assert/strict";
import test from "node:test";
import {
    buildWebinarSlots,
    createOnDemandWebinarSlot,
    getWebinarAccessState,
    getWebinarConfig,
    normalizeWebinarEmbedUrl,
} from "../server/webinarConfig.js";

test("on-demand access starts immediately and lasts seven days at database precision", () => {
    const now = new Date("2026-09-15T12:34:56.789Z");
    const config = getWebinarConfig({ WEBINAR_ACCESS_WINDOW_MINUTES: "240" });
    const slot = createOnDemandWebinarSlot(now, config);
    assert.equal(slot.id, "on-demand");
    assert.equal(slot.startsAt, "2026-09-15T12:34:56.000Z");
    assert.equal(slot.closesAt, "2026-09-22T12:34:56.000Z");
    assert.equal(config.accessDays, 7);
    assert.equal(getWebinarAccessState({ startsAt: slot.startsAt, expiresAt: slot.closesAt, now, config }).state, "open");
    assert.equal(getWebinarAccessState({ startsAt: slot.startsAt, expiresAt: slot.closesAt, now: new Date("2026-09-22T12:34:56.001Z"), config }).state, "expired");
});

test("recorded expiry preserves a previous scheduled invitation", () => {
    const config = getWebinarConfig({ WEBINAR_ACCESS_WINDOW_MINUTES: "1440" });
    const access = getWebinarAccessState({
        startsAt: "2026-09-16T08:00:00.000Z", expiresAt: "2026-09-16T12:00:00.000Z",
        now: new Date("2026-09-16T12:00:01.000Z"), config,
    });
    assert.equal(access.state, "expired");
    assert.equal(access.closesAt.toISOString(), "2026-09-16T12:00:00.000Z");
});

test("on-demand duration remains seven full days across the Berlin clock change", () => {
    const slot = createOnDemandWebinarSlot(new Date("2026-10-24T12:00:00.000Z"), getWebinarConfig({}));
    assert.equal(new Date(slot.closesAt) - new Date(slot.startsAt), 7 * 86_400_000);
});

test("does not offer webinar dates before Thursday, 3 September 2026 by default", () => {
    const config = getWebinarConfig({
        WEBINAR_TIME_ZONE: "Europe/Berlin",
        WEBINAR_START_TIMES: "08:00,20:00",
        WEBINAR_DAYS_AHEAD: "1",
    });
    const slots = buildWebinarSlots({
        now: new Date("2026-09-02T06:00:00.000Z"),
        config,
    });

    assert.equal(slots.length, 2);
    assert.equal(slots[0].startsAt, "2026-09-03T06:00:00.000Z");
    assert.match(slots[0].dateLabel, /Donnerstag, 03\.09\.2026/u);
});

test("creates flexible webinar times from the first available date in Berlin time", () => {
    const config = getWebinarConfig({
        WEBINAR_TIME_ZONE: "Europe/Berlin",
        WEBINAR_START_TIMES: "10:00,18:00",
        WEBINAR_DAYS_AHEAD: "2",
        WEBINAR_FIRST_DATE: "2026-09-02",
        WEBINAR_FIRST_DAY_START_TIME: "10:00",
        WEBINAR_MIN_LEAD_MINUTES: "15",
    });
    const slots = buildWebinarSlots({
        now: new Date("2026-09-01T06:00:00.000Z"),
        config,
    });

    assert.equal(slots.length, 4);
    assert.equal(slots[0].startsAt, "2026-09-02T08:00:00.000Z");
    assert.equal(slots[0].timeLabel, "10:00");
    assert.equal(slots[2].startsAt, "2026-09-03T08:00:00.000Z");
});

test("offers remaining start times on the same day and keeps seven available days", () => {
    const config = getWebinarConfig({
        WEBINAR_TIME_ZONE: "Europe/Berlin",
        WEBINAR_START_TIMES: "10:00,11:00,12:00",
        WEBINAR_DAYS_AHEAD: "7",
        WEBINAR_FIRST_DATE: "2026-09-02",
        WEBINAR_FIRST_DAY_START_TIME: "10:00",
        WEBINAR_MIN_LEAD_MINUTES: "15",
    });
    const slots = buildWebinarSlots({
        now: new Date("2026-09-02T08:10:00.000Z"),
        config,
    });

    assert.equal(slots[0].startsAt, "2026-09-02T09:00:00.000Z");
    assert.equal(new Set(slots.map((slot) => slot.dateLabel)).size, 7);
});

test("starts the launch day at 16:00 and offers the full schedule afterwards", () => {
    const config = getWebinarConfig({
        WEBINAR_TIME_ZONE: "Europe/Berlin",
        WEBINAR_START_TIMES: "08:00,15:00,16:00,22:00",
        WEBINAR_DAYS_AHEAD: "2",
        WEBINAR_FIRST_DATE: "2026-09-02",
        WEBINAR_FIRST_DAY_START_TIME: "16:00",
        WEBINAR_MIN_LEAD_MINUTES: "15",
    });
    const slots = buildWebinarSlots({
        now: new Date("2026-09-01T06:00:00.000Z"),
        config,
    });

    assert.deepEqual(slots.map((slot) => slot.timeLabel), ["16:00", "22:00", "08:00", "15:00", "16:00", "22:00"]);
});
test("opens access shortly before the chosen time and expires after the viewing window", () => {
    const config = getWebinarConfig({
        WEBINAR_ACCESS_EARLY_MINUTES: "5",
        WEBINAR_ACCESS_WINDOW_MINUTES: "240",
    });
    const startsAt = "2026-09-02T18:00:00.000Z";

    assert.equal(getWebinarAccessState({ startsAt, now: new Date("2026-09-02T17:54:59.000Z"), config }).state, "scheduled");
    assert.equal(getWebinarAccessState({ startsAt, now: new Date("2026-09-02T17:55:00.000Z"), config }).state, "open");
    assert.equal(getWebinarAccessState({ startsAt, now: new Date("2026-09-02T22:00:01.000Z"), config }).state, "expired");
});

test("accepts only supported secure video embeds", () => {
    assert.equal(
        normalizeWebinarEmbedUrl("https://player.vimeo.com/video/123456"),
        "https://player.vimeo.com/video/123456",
    );
    assert.equal(normalizeWebinarEmbedUrl("https://example.com/video/123456"), "");
    assert.equal(normalizeWebinarEmbedUrl("http://player.vimeo.com/video/123456"), "");
});

test("turns the supplied private Vimeo link into the protected player URL", () => {
    const config = getWebinarConfig({});

    assert.equal(
        config.embedUrl,
        "https://player.vimeo.com/video/1223574981?h=ad820715ad&dnt=1&title=0&byline=0&portrait=0",
    );
});
