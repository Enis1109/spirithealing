import test from "node:test";
import assert from "node:assert/strict";
import { protectedVimeoEmbed, readExtraMemberMedia } from "../server/extraMemberMedia.js";
import { additionalTalks, beiMirBleiben } from "../src/content/memberLibrary.js";

test("unlisted URLs are validated and the approved recording is selected", () => {
    const id = "1243361262";
    const good = `https://vimeo.com/${id}/a123456789`;
    assert.equal(protectedVimeoEmbed(good, id), `https://player.vimeo.com/video/${id}?h=a123456789&dnt=1`);
    for (const bad of [undefined, `https://vimeo.com/${id}`, `${good}?autoplay=1`, good.replace("https:", "http:"), good.replace("vimeo.com", "vimeo.com.example.test"), good.replace(id, "1243007402")]) {
        assert.equal(protectedVimeoEmbed(bad, id), "");
    }
});

test("only the four intended catalogue entries are enabled, with no embedded media in source", () => {
    const config = {
        familienaufstellung: "https://vimeo.com/1239995801/a123456789",
        bindungsmuster: "https://vimeo.com/1243361262/b123456789",
        beziehung: "https://vimeo.com/1247779335/c123456789",
        uebung: "https://vimeo.com/9999999999/d123456789",
        weitererInhalt: "https://vimeo.com/1247895851/a123456789",
    };
    const items = [...additionalTalks, beiMirBleiben];
    const result = readExtraMemberMedia(JSON.stringify(config));
    assert.deepEqual(Object.keys(result).sort(), items.map((item) => item.key).sort());
    assert.equal(beiMirBleiben.type, "meditation");
    assert.equal(beiMirBleiben.access, "free");
    assert.ok(items.every((item) => !item.embedUrl && !item.watchUrl));
    for (const absent of [undefined, "", "{", "[]", "null", "true", "{}", '{"beziehung":"https://vimeo.com/1234567890/a123456789"}']) {
        assert.deepEqual(readExtraMemberMedia(absent), {});
    }
});
