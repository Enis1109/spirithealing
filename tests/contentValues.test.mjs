import assert from "node:assert/strict";
import test from "node:test";
import { getPublishedValue } from "../src/content/contentValues.js";

test("uses a published language value when present", () => {
    const content = { "home.hero.intro": { de: "Veröffentlichter Text", tr: "Yayınlanan metin" } };
    assert.equal(getPublishedValue(content, "home.hero.intro", "de", "Standard"), "Veröffentlichter Text");
    assert.equal(getPublishedValue(content, "home.hero.intro", "tr", "Varsayılan"), "Yayınlanan metin");
});

test("keeps the checked source text as a safe fallback", () => {
    assert.equal(getPublishedValue({}, "faq.intro", "de", "Geprüfter Standardtext"), "Geprüfter Standardtext");
    assert.equal(getPublishedValue({ "faq.intro": { de: null } }, "faq.intro", "de", "Standard"), "Standard");
});
