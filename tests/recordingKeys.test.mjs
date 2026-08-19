import assert from "node:assert/strict";
import test from "node:test";

import { selectIchBinLichtKey } from "../server/recording.js";

test("Ich bin Licht is skipped until its own key is configured", () => {
    assert.equal(selectIchBinLichtKey({ MEMBER_MEDITATION_KEY: "existing-key" }), "");
});

test("Ich bin Licht uses only its dedicated key", () => {
    assert.equal(selectIchBinLichtKey({ MEMBER_ICH_BIN_LICHT_KEY: "dedicated-key" }), "dedicated-key");
});
