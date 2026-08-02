import assert from "node:assert/strict";
import test from "node:test";
import {
    ContentValidationError,
    normalizeContentDraftItems,
    normalizeContentKeys,
    normalizeRevisionRequest,
} from "../server/contentValidation.js";

test("normalizes a batch of German and Turkish content drafts", () => {
    assert.deepEqual(normalizeContentDraftItems([
        { key: "Home.Hero.Intro", de: "Zeile 1\r\nZeile 2", tr: "Satır 1\rSatır 2" },
    ]), [{
        key: "home.hero.intro",
        de: "Zeile 1\nZeile 2",
        tr: "Satır 1\nSatır 2",
    }]);
});

test("rejects unsafe keys and duplicate batch entries", () => {
    assert.throws(
        () => normalizeContentDraftItems([{ key: "../secret", de: "x", tr: "y" }]),
        ContentValidationError,
    );
    assert.throws(
        () => normalizeContentDraftItems([
            { key: "faq.intro", de: "x", tr: "y" },
            { key: "faq.intro", de: "x", tr: "y" },
        ]),
        ContentValidationError,
    );
});

test("accepts only bounded, unique publish keys", () => {
    assert.deepEqual(normalizeContentKeys(["faq.intro", "assistant.booking.answer"]), [
        "faq.intro",
        "assistant.booking.answer",
    ]);
    assert.throws(() => normalizeContentKeys(["faq.intro", "faq.intro"]), ContentValidationError);
    assert.throws(() => normalizeContentKeys([]), ContentValidationError);
});

test("validates revision restoration requests", () => {
    assert.deepEqual(normalizeRevisionRequest({ key: "faq.intro", revisionId: "42" }), {
        key: "faq.intro",
        revisionId: 42,
    });
    assert.throws(
        () => normalizeRevisionRequest({ key: "faq.intro", revisionId: 0 }),
        ContentValidationError,
    );
});
