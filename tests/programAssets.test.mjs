import assert from "node:assert/strict";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const assetDirectory = await fsPromises.mkdtemp(path.join(os.tmpdir(), "spirit-program-assets-"));
process.env.PROGRAM_ASSET_DIRECTORY = assetDirectory;

const {
    getProgramAsset,
    ProgramAssetError,
    saveProgramAsset,
} = await import("../server/programAssets.js");

test.after(async () => {
    await fsPromises.rm(assetDirectory, { recursive: true, force: true });
});

test("stores and resolves a protected workbook asset", async () => {
    const content = Buffer.from("%PDF-1.4 protected workbook");
    const saved = await saveProgramAsset({
        slug: "zepter-acht-wochen",
        weekNumber: 1,
        kind: "workbook",
        contentType: "application/pdf",
        buffer: content,
    });

    assert.equal(saved.url, "/api/members/programs/zepter-acht-wochen/assets/1/workbook");
    assert.equal(saved.size, content.length);
    const resolved = await getProgramAsset({ slug: "zepter-acht-wochen", weekNumber: 1, kind: "workbook" });
    assert.equal(resolved.contentType, "application/pdf");
    assert.equal(resolved.disposition, "attachment");
    assert.deepEqual(await fsPromises.readFile(resolved.path), content);
});

test("rejects unsupported or empty program files", async () => {
    await assert.rejects(() => saveProgramAsset({
        slug: "zepter-acht-wochen",
        weekNumber: 1,
        kind: "workbook",
        contentType: "text/plain",
        buffer: Buffer.from("not a pdf"),
    }), (error) => error instanceof ProgramAssetError && error.code === "unsupported_asset");

    await assert.rejects(() => saveProgramAsset({
        slug: "zepter-acht-wochen",
        weekNumber: 1,
        kind: "meditation",
        contentType: "audio/mp4",
        buffer: Buffer.alloc(0),
    }), (error) => error instanceof ProgramAssetError && error.code === "empty_asset");
});
