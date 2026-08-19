import assert from "node:assert/strict";
import test from "node:test";

const {
    getDatabaseProgramAsset,
    saveDatabaseProgramAsset,
} = await import("../server/programAssetDatabase.js");

test("stores a program asset in database-backed storage", async () => {
    const content = Buffer.from("%PDF-1.4 current workbook");
    const calls = [];
    const databaseClient = {
        execute: async (statement, parameters) => {
            calls.push({ statement, parameters });
            if (/SELECT id FROM programs/u.test(statement)) return [[{ id: 7 }]];
            return [{ affectedRows: 1 }];
        },
    };

    const saved = await saveDatabaseProgramAsset({
        slug: "zepter-acht-wochen",
        weekNumber: 1,
        kind: "workbook",
        contentType: "application/pdf",
        buffer: content,
        databaseClient,
    });

    assert.equal(saved.url, "/api/members/programs/zepter-acht-wochen/assets/1/workbook");
    assert.equal(saved.size, content.length);
    assert.deepEqual(saved.buffer, content);
    assert.match(calls[1].statement, /INSERT INTO program_assets/u);
    assert.deepEqual(calls[1].parameters.slice(0, 6), [
        7,
        1,
        "workbook",
        "workbook.pdf",
        "application/pdf",
        content.length,
    ]);
});

test("resolves a program asset from database-backed storage", async () => {
    const content = Buffer.from("%PDF-1.4 current workbook");
    const databaseClient = {
        execute: async () => [[{
            stored_name: "workbook.pdf",
            content_type: "application/pdf",
            content_size: content.length,
            content,
        }]],
    };

    const asset = await getDatabaseProgramAsset({
        slug: "zepter-acht-wochen",
        weekNumber: 1,
        kind: "workbook",
        databaseClient,
    });

    assert.equal(asset.contentType, "application/pdf");
    assert.equal(asset.disposition, "attachment");
    assert.deepEqual(asset.buffer, content);
});
