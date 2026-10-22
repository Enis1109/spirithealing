import assert from "node:assert/strict";
import test from "node:test";

import { octoberLibrary } from "../src/content/memberLibrary.js";

test("keeps the two October talks, workbook and meditation as one ordered gift", () => {
    const entries = Object.values(octoberLibrary);
    assert.equal(entries.length, 4);
    assert.equal(new Set(entries.map((entry) => entry.key)).size, 4);

    assert.match(octoberLibrary.firstTalk.meta.de, /Vortrag 1/u);
    assert.equal(octoberLibrary.firstTalk.workbookUrl, octoberLibrary.workbook.downloadUrl);
    assert.match(octoberLibrary.secondTalk.meta.de, /Vortrag 2/u);
    assert.match(octoberLibrary.meditation.meta.de, /Vortrag 2/u);
    assert.equal(octoberLibrary.meditation.image, "/images/meditations/das-geschenk-deines-anteils.jpg");
});

test("uses privacy-aware Vimeo players for the registered member view", () => {
    for (const entry of [octoberLibrary.firstTalk, octoberLibrary.secondTalk, octoberLibrary.meditation]) {
        const url = new URL(entry.embedUrl);
        assert.equal(url.protocol, "https:");
        assert.equal(url.hostname, "player.vimeo.com");
        assert.equal(url.searchParams.get("dnt"), "1");
    }
});
