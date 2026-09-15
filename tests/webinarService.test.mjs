import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

test("webinar registration and access work together with isolated database and email doubles", () => {
    const result = spawnSync(process.execPath, ["--experimental-vm-modules", fileURLToPath(new URL("./helpers/webinarService.cases.mjs", import.meta.url))], { encoding: "utf8", timeout: 10_000 });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /All webinar service scenarios passed/u);
});
