import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../src/sections/Events.jsx", import.meta.url), "utf8");

test("public live talk and weekly group use the member calendar's shared source", () => {
    assert.match(source, /import \{ getUpcomingMemberEvents \} from "@\/content\/memberEvents"/);
    assert.match(source, /getUpcomingMemberEvents\(\)/);
    assert.match(source, /event\.id === "live-talk-2026-10-06"/);
    assert.match(source, /event\.id === "weekly-experience-group"/);
    assert.match(source, /UpcomingEventCard event=\{liveTalk\}/);
    assert.match(source, /UpcomingEventCard event=\{experienceGroup\}/);
});

test("public Berlin location is district-only in both languages", () => {
    assert.equal((source.match(/place: "Berlin-Kreuzberg"/g) || []).length, 2);
    assert.doesNotMatch(source, /Raum folgt|Mekân daha sonra|Manoa|Urbanstraße|10967/);
});
