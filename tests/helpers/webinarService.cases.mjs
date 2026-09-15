import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import { createContext, SourceTextModule, SyntheticModule } from "node:vm";
import * as config from "../../server/webinarConfig.js";

// Evaluate the unchanged service source with no real SMTP or database imports.
let row;
let failMail = false;
let sent = [];
const database = { execute: async (sql, values) => {
    if (sql.includes("INSERT INTO webinar_registrations")) {
        row = { id: 1, name: values[1], selected_at_iso: values[4].replace(" ", "T") + ".000Z", token_expires_at_iso: values[5].replace(" ", "T") + ".000Z", access_token_hash: null };
        return [{ insertId: 1 }];
    }
    if (sql.includes("SET access_token_hash")) { row.access_token_hash = values[0]; return [{ affectedRows: 1 }]; }
    if (sql.includes("SET confirmation_status")) return [{ affectedRows: 1 }];
    if (sql.includes("SELECT id, name, access_token_hash")) return [[row]];
    throw new Error("Unexpected database statement in isolated test");
} };
const sendWebinarConfirmation = async (mail) => {
    if (failMail) throw new Error("Simulated email outage");
    sent.push(mail);
};
const dependencies = {
    "node:crypto": { default: crypto },
    "./database.js": { database },
    "./mailer.js": { sendWebinarConfirmation, sendWebinarReminder: async () => { throw new Error("Unexpected reminder"); } },
    "./newsletter.js": { registerNewsletterInterest: async () => { throw new Error("Newsletter requires separate consent"); } },
    "./webinarConfig.js": config,
};
const context = createContext({ Buffer, URL, console: { error() {} }, process: { env: {
    WEBINAR_TOKEN_SECRET: "isolated-test-secret-not-used-in-production-123456", PUBLIC_BASE_URL: "https://example.com",
} } });
const source = await readFile(new URL("../../server/webinar.js", import.meta.url), "utf8");
const service = new SourceTextModule(source, { context });
await service.link(async (specifier) => {
    const exports = dependencies[specifier];
    assert.ok(exports, `No network dependency is allowed: ${specifier}`);
    return new SyntheticModule(Object.keys(exports), function () {
        for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    }, { context });
});
await service.evaluate();
const { registerForWebinar, getWebinarAccess } = service.namespace;
const form = { name: "Test Person", email: "test@example.com", locale: "de", slotId: "on-demand", newsletterConsent: false };
const tokenFrom = (result) => new URL(result.watchUrl).searchParams.get("token");

{
    const now = new Date("2026-09-15T12:00:00.789Z");
    const result = await registerForWebinar(form, now);
    assert.equal(result.newsletterStatus, "not_requested");
    assert.equal(result.confirmationStatus, "sent");
    assert.equal(sent.length, 1);
    assert.equal(sent[0].onDemand, true);
    assert.equal(sent[0].closesAt, "2026-09-22T12:00:00.000Z");
    const access = await getWebinarAccess(tokenFrom(result), now);
    assert.equal(access.state, "open");
    assert.equal(access.closesAt, "2026-09-22T12:00:00.000Z");
    assert.ok(access.embedUrl);
    const expired = await getWebinarAccess(tokenFrom(result), new Date("2026-09-22T12:00:01.000Z"));
    assert.equal(expired.state, "expired");
    assert.equal(expired.embedUrl, null);
    assert.equal(await getWebinarAccess(`1.${"x".repeat(43)}`, now), null);
}
{
    failMail = true;
    const now = new Date("2026-09-15T13:00:00.333Z");
    const result = await registerForWebinar(form, now);
    assert.equal(result.confirmationStatus, "failed");
    assert.equal((await getWebinarAccess(tokenFrom(result), now)).state, "open");
    failMail = false;
}
{
    const now = new Date("2026-09-15T12:00:00.000Z");
    const result = await registerForWebinar({ ...form, slotId: "2026-09-16T06:00:00.000Z" }, now);
    assert.equal(result.onDemand, false);
    const token = tokenFrom(result);
    assert.equal((await getWebinarAccess(token, now)).state, "scheduled");
    assert.equal((await getWebinarAccess(token, new Date("2026-09-16T06:00:00.000Z"))).state, "open");
    assert.equal(result.closesAt, "2026-09-16T10:00:00.000Z");
    assert.equal((await getWebinarAccess(token, new Date("2026-09-16T10:00:01.000Z"))).embedUrl, null);
}
console.log("All webinar service scenarios passed");
