import assert from "node:assert/strict";
import test from "node:test";
import {
    buildWebinarSlots,
    getWebinarAccessState,
    getWebinarConfig,
    normalizeWebinarEmbedUrl,
} from "../server/webinarConfig.js";

test("creates configurable webinar times from the following day in Berlin time", () => {
    const config = getWebinarConfig({
        WEBINAR_TIME_ZONE: "Europe/Berlin",
        WEBINAR_SLOT_HOURS: "10:00,18:00",
        WEBINAR_DAYS_AHEAD: "2",
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
