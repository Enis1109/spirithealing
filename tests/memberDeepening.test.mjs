import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { getAssistantAnswer } from "../src/components/assistantKnowledge.js";

const source = readFileSync(new URL("../src/sections/MemberApp.jsx", import.meta.url), "utf8");
const definitions = source.slice(source.indexOf("const appCopy ="), source.indexOf("const navIcons ="));
const { appCopy, contentDefinitions } = runInNewContext(`${definitions}; ({ appCopy, contentDefinitions });`, {
    PlayCircle: "play", Headphones: "audio", FileText: "file", Sparkles: "sparkles",
});

test("member-facing German and Turkish copy contains no Premium wording", () => {
    assert.doesNotMatch(JSON.stringify(Object.values(appCopy).flatMap((copy) => Object.values(copy))), /premium/i);
    assert.equal(appCopy.de.premium, "Vertiefung");
    assert.equal(appCopy.tr.premium, "Derinleşme");
});

test("one upcoming deepening card covers both meditation and talk filters", () => {
    const upcoming = Object.values(contentDefinitions).filter((item) => item.status === "soon");
    assert.equal(upcoming.length, 1);
    assert.equal(upcoming[0].title.de, "Vertiefung");
    assert.deepEqual(Array.from(upcoming[0].types), ["meditation", "talk"]);
    assert.doesNotMatch(JSON.stringify([upcoming[0].title, upcoming[0].description, upcoming[0].meta]), /premium/i);
    assert.equal((source.match(/\.\.\.contentDefinitions\.deepening/g) || []).length, 1);
    assert.match(source, /item\.types\?\.includes\(activeFilter\)/);
    assert.match(source, /item\.status !== "soon" && item\.access === "premium"/);
    assert.match(source, /member\?\.membershipTier === "premium"/);
});

test("website assistant uses the new name in both languages", () => {
    for (const [query, language, expected] of [["Was kommt zur Vertiefung?", "de", "Vertiefung"], ["Derinleşme", "tr", "Derinleşme"]]) {
        const answer = getAssistantAnswer(query, language);
        assert.equal(answer.intent, "member_details");
        assert.ok(answer.text.includes(expected));
        assert.doesNotMatch(answer.text, /premium/i);
    }
});
