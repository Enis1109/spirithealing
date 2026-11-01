import test from "node:test";
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import express from "express";
import { registerContactRoutes } from "../server/contactRequests.js";
import { createRequestOrigins } from "../server/requestOrigins.js";
import { validateContact } from "../server/validation.js";

export function contactTestDatabaseConfig(raw) {
    const url = new URL(raw);
    if (url.protocol !== "mysql:" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
        || !["", "/"].includes(url.pathname) || url.search || url.hash || !url.username) throw new Error("isolated_local_database_required");
    return { host: url.hostname.replace(/[\[\]]/g, ""), port: Number(url.port || 3306),
        user: decodeURIComponent(url.username), password: decodeURIComponent(url.password), multipleStatements: false };
}
test("contact MySQL fixture refuses remote hosts and existing database names", () => {
    for (const value of ["mysql://test@production.test/", "mysql://test@localhost/real", "mysql://test@localhost/?database=real"])
        assert.throws(() => contactTestDatabaseConfig(value));
});
test("MySQL migration and actual contact routes: concurrent retries, side effects, failed mail and crash-pending", {
    skip: !process.env.CONTACT_MYSQL_TEST_URL && "Requires isolated local MySQL; never uses DB_*", timeout: 30000,
}, async t => {
    const mysql = await import("mysql2/promise");
    const config = contactTestDatabaseConfig(process.env.CONTACT_MYSQL_TEST_URL);
    const name = "contact_test_" + randomUUID().replaceAll("-", "");
    const control = await mysql.createConnection(config);
    let db, created = false;
    t.after(async () => {
        if (db) await db.end();
        try { if (created) await control.query("DROP DATABASE `" + name + "`"); }
        finally { await control.end(); }
    });
    await control.query("CREATE DATABASE `" + name + "`"); created = true;
    db = mysql.createPool({ ...config, database: name, connectionLimit: 4 });
    const schema = await readFile(new URL("../database/schema.sql", import.meta.url), "utf8");
    await db.query(schema.slice(0, schema.indexOf(";") + 1));
    await db.execute("INSERT INTO contact_submissions (name,email,topic,message,privacy_consent_version) VALUES (?,?,?,?,?)",
        ["Synthetic legacy", "legacy@example.test", "Zepter transfer", "Synthetic", "test"]);
    const migration = await readFile(new URL("../database/migrations/20261028-contact-requests.sql", import.meta.url), "utf8");
    await db.query(migration);
    const [legacy] = await db.execute("SELECT request_kind, request_key FROM contact_submissions");
    assert.equal(legacy[0].request_kind, null); assert.equal(legacy[0].request_key, null);
    const key = randomUUID();
    const insert = () => db.execute("INSERT INTO contact_submissions (name,email,topic,message,privacy_consent_version,request_key) VALUES (?,?,?,?,?,?)",
        ["Synthetic", "test@example.test", "Test", "", "test", key]);
    const results = await Promise.allSettled([insert(), insert(), insert()]);
    assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
    assert.ok(results.filter(result => result.status === "rejected").every(result => result.reason.code === "ER_DUP_ENTRY"));
    const app = express(); app.use(express.json());
    let mails = 0, newsletters = 0, failMail = false, releaseMail, announce;
    let held = true;
    const started = new Promise(resolve => { announce = resolve; });
    registerContactRoutes(app, {
        database: db, submissionLimiter: (_req, _res, next) => next(),
        ...createRequestOrigins("https://www.spirit-healing.tr"),
        getAdminMember: async (req, res) => {
            res.set("Cache-Control", "no-store");
            if (req.get("authorization") === "synthetic-admin") return { id: 1, role: "admin" };
            res.status(401).json({ ok: false }); return null;
        },
        privacyConsentVersion: "test",
        registerNewsletterInterest: async () => { newsletters++; return "pending"; },
        sendContactNotification: async () => {
            mails++; announce();
            if (held) await new Promise(resolve => { releaseMail = resolve; });
            if (failMail) throw new Error("synthetic SMTP failure");
        },
    });
    const server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    t.after(() => { server.closeAllConnections(); server.close(); });
    const base = "http://127.0.0.1:" + server.address().port;
    const post = body => fetch(base + "/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:4174" },
        body: JSON.stringify(body),
    });
    const makeForm = extra => ({ name: "Synthetic", email: "test@example.test", privacyConsent: true,
        requestKind: "appointment", offerCode: "introSabine", requestKey: randomUUID(), ...extra });
    const form = makeForm({ newsletterConsent: true });
    const first = post(form);
    await started;
    const replays = await Promise.all(Array.from({ length: 12 }, () => post(form)));
    assert.ok(replays.every(response => response.status === 200));
    assert.equal(mails, 1); assert.equal(newsletters, 1);
    releaseMail(); held = false;
    assert.equal((await first).status, 201);
    const [saved] = await db.execute("SELECT COUNT(*) AS n, MAX(notification_status) AS status FROM contact_submissions WHERE request_key = ?", [form.requestKey]);
    assert.equal(Number(saved[0].n), 1); assert.equal(saved[0].status, "sent");
    const [[requestRow]] = await db.execute("SELECT id FROM contact_submissions WHERE request_key = ?", [form.requestKey]);
    const adminUrl = base + "/api/admin/contact-requests/" + requestRow.id;
    assert.equal((await fetch(adminUrl)).status, 401);
    const patchStatus = (status, from, version, origin = "http://localhost:4174") => fetch(adminUrl, {
        method: "PATCH", headers: { "Content-Type": "application/json", Authorization: "synthetic-admin", ...(origin ? { Origin: origin } : {}) },
        body: JSON.stringify({ status, from, version }),
    });
    assert.equal((await patchStatus("done", "new", 0, null)).status, 403);
    assert.equal((await patchStatus("done", "new", 0, "https://foreign.invalid")).status, 403);
    const updates = await Promise.all(Array.from({ length: 16 }, (_, i) => patchStatus(i % 2 ? "done" : "in_progress", "new", 0)));
    assert.equal(updates.filter(response => response.status === 200).length, 1);
    assert.equal(updates.filter(response => response.status === 409).length, 15);
    const [[changed]] = await db.execute("SELECT processing_status, processing_version FROM contact_submissions WHERE id = ?", [requestRow.id]);
    assert.equal(changed.processing_version, 1);
    const nextStatus = changed.processing_status === "done" ? "in_progress" : "done";
    assert.equal((await patchStatus(nextStatus, changed.processing_status, 1)).status, 200);
    assert.equal((await patchStatus(nextStatus, changed.processing_status, 1)).status, 409);
    const detail = await fetch(adminUrl, { headers: { Authorization: "synthetic-admin" } });
    assert.equal(detail.headers.get("cache-control"), "no-store");
    assert.equal((await detail.json()).request.processing_version, 2);
    const list = await fetch(base + "/api/admin/contact-requests", { headers: { Authorization: "synthetic-admin" } });
    const listed = (await list.json()).requests;
    assert.ok(listed.length > 0);
    for (const row of listed) for (const field of ["name", "email", "phone", "message", "topic"]) assert.equal(Object.hasOwn(row, field), false);
    assert.equal((await post({ ...form, message: "Different content" })).status, 409);
    failMail = true;
    const failed = makeForm();
    assert.equal((await post(failed)).status, 201);
    assert.equal((await post(failed)).status, 200);
    assert.equal(mails, 2); assert.equal(newsletters, 1);
    const [mailRow] = await db.execute("SELECT notification_status FROM contact_submissions WHERE request_key = ?", [failed.requestKey]);
    assert.equal(mailRow[0].notification_status, "failed");
    // Model a process crash immediately after a committed INSERT, before any mail.
    // A retry must not promise mail delivery or blindly replay side effects.
    const crashForm = makeForm();
    const normalized = validateContact(crashForm);
    const { requestKey: crashKey, ...content } = normalized;
    const hash = createHash("sha256").update(JSON.stringify(content)).digest("hex");
    await db.execute(`INSERT INTO contact_submissions
        (name,email,phone,topic,message,locale,privacy_consent_version,request_kind,offer_code,practitioner,
         request_key,request_hash,notification_status)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'pending')`,
    [content.name, content.email, content.phone, content.topic, content.message, content.locale, "test",
        content.requestKind, content.offerCode, content.practitioner, crashKey, hash]);
    assert.equal((await post(crashForm)).status, 200);
    assert.equal(mails, 2); assert.equal(newsletters, 1);
    const [crashed] = await db.execute("SELECT notification_status FROM contact_submissions WHERE request_key = ?", [crashKey]);
    assert.equal(crashed[0].notification_status, "pending");
});
