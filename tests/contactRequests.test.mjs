import { createRequestOrigins } from "../server/requestOrigins.js";
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import express from "express";
import { registerContactRoutes } from "../server/contactRequests.js";
import { validateContact, validateZepterBankTransfer } from "../server/validation.js";
import { contactOfferFromSearch, contactOffers } from "../src/lib/contactOffers.js";

const form = (extra = {}) => ({ name: "Synthetic Person", email: "synthetic@example.test", privacyConsent: true,
    requestKind: "appointment", offerCode: "introSabine", requestKey: randomUUID(), ...extra });

test("allowlisted offers, duplicate URL parameters and strict appointment validation", () => {
    for (const code of Object.keys(contactOffers)) {
        assert.equal(contactOfferFromSearch("?offer=" + code), code);
        assert.equal(validateContact(form({ offerCode: code })).practitioner, contactOffers[code].practitioner);
    }
    for (const search of ["?offer=bad", "?offer=__proto__", "?offer=introSabine&offer=firstSabine", "?offer=introSabine&offer=introSabine", "?offer[]=introSabine"]) assert.equal(contactOfferFromSearch(search), "");
    for (const patch of [{ offerCode: ["introSabine"] }, { offerCode: "__proto__" }, { requestKind: "booking" }, { requestKey: "bad" }, { requestKey: null }, { privacyConsent: false }, { message: "x".repeat(2001) }]) assert.throws(() => validateContact(form(patch)));
    assert.throws(() => validateContact(null));
    assert.equal(validateContact(form()).message, "");
    assert.equal(validateContact(form({ locale: "tr" })).topic, "Sabine ile tanışma görüşmesi");
    assert.equal(validateContact(form({ practitioner: "someone-else" })).practitioner, "sabine");
    const legacy = { name: "Test", email: "test@example.test", topic: "Question", message: "Hello", privacyConsent: true };
    assert.equal(validateContact(legacy).requestKey, null);
    assert.throws(() => validateContact({ ...legacy, message: "" }));
    assert.equal(validateZepterBankTransfer({ ...legacy, paymentPlan: "full" }).paymentPlan, "full");
});

function sqliteDatabase() {
    const raw = new DatabaseSync(":memory:");
    raw.exec(`CREATE TABLE contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, topic TEXT, message TEXT,
        locale TEXT, privacy_consent_version TEXT, privacy_consent_at TEXT DEFAULT CURRENT_TIMESTAMP,
        newsletter_requested INTEGER DEFAULT 0, newsletter_status TEXT DEFAULT 'not_requested',
        notification_status TEXT DEFAULT 'pending', created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        request_kind TEXT, offer_code TEXT, practitioner TEXT, request_key TEXT UNIQUE,
        request_hash TEXT, processing_status TEXT, processing_version INTEGER)`);
    return { raw, async execute(sql, args = []) {
        try {
            const stmt = raw.prepare(sql);
            if (/^\s*SELECT/i.test(sql)) return [stmt.all(...args)];
            const result = stmt.run(...args);
            return [{ insertId: Number(result.lastInsertRowid), affectedRows: Number(result.changes) }];
        } catch (error) {
            if (error.message.includes("UNIQUE constraint")) error.code = "ER_DUP_ENTRY";
            throw error;
        }
    } };
}

test("optional measurement sees only context after durable save/replay and cannot fail the contact response", async t => {
    const db = sqliteDatabase(); t.after(() => db.raw.close());
    const measured = [], app = express(); app.use(express.json());
    registerContactRoutes(app, { database: db, submissionLimiter: (_q,_r,next) => next(),
        ...createRequestOrigins('https://www.spirit-healing.tr'), getAdminMember: async () => null,
        privacyConsentVersion: 'test', registerNewsletterInterest: async () => 'not_requested', sendContactNotification: async () => {},
        recordInquiryMeasurement: async context => { measured.push(context); throw new Error('synthetic telemetry outage'); } });
    const server = app.listen(0,'127.0.0.1'); await new Promise(resolve => server.once('listening',resolve));
    t.after(() => { server.closeAllConnections(); server.close(); });
    const post = body => fetch('http://127.0.0.1:' + server.address().port + '/api/contact', {
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body) });
    const measurement = { receipt:'a'.repeat(64),flow:randomUUID(),code:'s01',entry:'p_contact',startedAt:Date.now() };
    const payload = form({ measurement });
    assert.equal((await post(payload)).status,201);assert.equal((await post(payload)).status,200);
    assert.equal((await post({...payload,message:'Different content'})).status,409);
    assert.equal((await post({...payload,privacyConsent:false})).status,400);
    await new Promise(resolve=>setImmediate(resolve));
    assert.deepEqual(measured,[measurement,measurement]);
    assert.equal(JSON.stringify(measured).includes('Synthetic'),false);
    const [rows] = await db.execute('SELECT COUNT(*) AS n FROM contact_submissions'); assert.equal(rows[0].n,1);
});

test("isolated SQLite route integration with fake mail: persistence, concurrency, access and CAS", async t => {
    const db = sqliteDatabase();
    t.after(() => db.raw.close());
    let mails = 0, newsletters = 0, failMail = false, failNewsletter = false, releaseMail, mailStarted;
    let waitMail = false;
    const started = () => new Promise(resolve => { mailStarted = resolve; });
    const app = express(); app.use(express.json());
    const { sameOriginOnly, adminSameOriginOnly } = createRequestOrigins("https://www.spirit-healing.tr");
    registerContactRoutes(app, {
        database: db, submissionLimiter: (_req, _res, next) => next(), sameOriginOnly, adminSameOriginOnly,
        getAdminMember: async (req, res) => {
            res.set("Cache-Control", "no-store");
            if (req.get("x-test-role") === "admin") return { id: 1, role: "admin" };
            res.status(req.get("x-test-role") ? 403 : 401).json({ ok: false }); return null;
        },
        privacyConsentVersion: "test-only", registerNewsletterInterest: async () => { newsletters++; if (failNewsletter) throw new Error("synthetic"); return "pending"; },
        sendContactNotification: async () => {
            mails++; mailStarted?.();
            if (waitMail) await new Promise(resolve => { releaseMail = resolve; });
            if (failMail) throw new Error("synthetic SMTP failure");
        },
    });
    const server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    t.after(() => { server.closeAllConnections(); server.close(); });
    const base = "http://127.0.0.1:" + server.address().port;
    const call = (path, body, options = {}) => fetch(base + path, {
        method: body ? "POST" : "GET", ...options,
        headers: { "Content-Type": "application/json", Origin: "http://localhost:3000", ...options.headers },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const admin = { headers: { "x-test-role": "admin" } };
    for (const path of ["/api/admin/contact-requests", "/api/admin/contact-requests/1"]) {
        assert.equal((await call(path)).status, 401);
        assert.equal((await call(path, null, { headers: { "x-test-role": "member" } })).status, 403);
    }
    assert.equal((await call("/api/contact", form(), { headers: { Origin: "https://evil.test" } })).status, 403);
    const a = form({ newsletterConsent: true, message: "Sensitive synthetic text" });
    waitMail = true;
    const firstStarted = started();
    const first = call("/api/contact", a);
    await firstStarted;
    const repeats = await Promise.all(Array.from({ length: 12 }, () => call("/api/contact", a)));
    assert.ok(repeats.every(r => r.status === 200));
    assert.equal(mails, 1); assert.equal(newsletters, 1);
    releaseMail(); waitMail = false;
    assert.equal((await first).status, 201);
    assert.equal((await call("/api/contact", { ...a, message: "changed" })).status, 409);
    assert.equal(db.raw.prepare("SELECT count(*) n FROM contact_submissions").get().n, 1);
    failMail = true;
    const b = form();
    assert.equal((await call("/api/contact", b)).status, 201);
    assert.equal((await call("/api/contact", b)).status, 200);
    assert.equal(mails, 2);
    assert.equal(db.raw.prepare("SELECT notification_status FROM contact_submissions WHERE id=2").get().notification_status, "failed");
    await db.execute("INSERT INTO contact_submissions (name, email, topic, message) VALUES (?, ?, ?, ?)", ["Legacy", "legacy@example.test", "Zepter bank transfer", "Legacy private"]);
    const listResponse = await call("/api/admin/contact-requests", null, admin);
    assert.equal(listResponse.headers.get("cache-control"), "no-store");
    const list = await listResponse.json();
    assert.equal(list.requests.length, 3);
    assert.equal(list.requests[0].request_kind, null);
    assert.ok(list.requests.every(row => !("message" in row) && !("email" in row) && !("name" in row) && !("topic" in row)));
    assert.equal((await (await call("/api/admin/contact-requests/1", null, admin)).json()).request.message, a.message);
    const change = { status: "in_progress", from: "new", version: 0 };
    assert.equal((await call("/api/admin/contact-requests/1", change, { method: "PATCH" })).status, 401);
    assert.equal((await call("/api/admin/contact-requests/1", change, { method: "PATCH", headers: { "x-test-role": "admin", Origin: "https://evil.test" } })).status, 403);
    const changes = await Promise.all([1, 2].map(() => call("/api/admin/contact-requests/1", change, { ...admin, method: "PATCH" })));
    assert.deepEqual(changes.map(r => r.status).sort(), [200, 409]);
    assert.equal((await call("/api/admin/contact-requests/1", { status: "new", from: "done", version: 1 }, { ...admin, method: "PATCH" })).status, 400);
    assert.equal((await call("/api/admin/contact-requests?before=1&before=2", null, admin)).status, 400);
    assert.equal((await call("/api/admin/contact-requests/999", null, admin)).status, 404);
    assert.equal((await call("/api/admin/contact-requests/1", change, { method: "PATCH", headers: { "x-test-role": "admin", Origin: "" } })).status, 403);
    failNewsletter = true;
    const consentFailure = form({ newsletterConsent: true });
    assert.equal((await (await call("/api/contact", consentFailure)).json()).newsletterStatus, "confirmation_failed");
    const originalExecute = db.execute.bind(db);
    db.execute = (sql, args) => {
        if (sql.startsWith("UPDATE contact_submissions SET notification_status")) throw new Error("synthetic status write failure");
        return originalExecute(sql, args);
    };
    const uncertain = form();
    assert.equal((await call("/api/contact", uncertain)).status, 201);
    const beforeReplay = mails;
    assert.equal((await call("/api/contact", uncertain)).status, 200);
    assert.equal(mails, beforeReplay);
    assert.equal(db.raw.prepare("SELECT notification_status FROM contact_submissions WHERE request_key=?").get(uncertain.requestKey).notification_status, "pending");
    // Actual public policy permits an absent Origin; admin mutations do not.
    assert.equal((await call("/api/contact", form(), { headers: { Origin: "" } })).status, 201);
    const count = db.raw.prepare("SELECT count(*) n FROM contact_submissions").get().n;
    for (let i = count; i < 51; i++) await db.execute(
        "INSERT INTO contact_submissions (name, email, topic, message) VALUES (?, ?, ?, ?)",
        ["Synthetic page", "page@example.test", "Test", ""]);
    const firstPage = await (await call("/api/admin/contact-requests", null, admin)).json();
    assert.equal(firstPage.requests.length, 50);
    assert.equal(firstPage.next, "2");
    assert.deepEqual(firstPage.requests.map(row => row.id), Array.from({ length: 50 }, (_, i) => 51 - i));
    const lastPage = await (await call("/api/admin/contact-requests?before=" + firstPage.next, null, admin)).json();
    assert.deepEqual(lastPage.requests.map(row => row.id), [1]); assert.equal(lastPage.next, null);
    const emptyPage = await (await call("/api/admin/contact-requests?before=1", null, admin)).json();
    assert.deepEqual(emptyPage.requests, []); assert.equal(emptyPage.next, null);
});

test("production Origin policies retain missing-Origin and localhost behavior", () => {
    const { sameOriginOnly, adminSameOriginOnly } = createRequestOrigins("https://www.spirit-healing.tr");
    const check = (middleware, origin) => {
        let result;
        middleware({ get: () => origin }, { status(code) { result = code; return this; }, json() {} }, () => { result = 200; });
        return result;
    };
    for (const origin of [undefined, ""]) {
        assert.equal(check(sameOriginOnly, origin), 200);
        assert.equal(check(adminSameOriginOnly, origin), 403);
    }
    for (const origin of ["https://www.spirit-healing.tr", "https://spirit-healing.tr", "http://localhost:4174", "http://127.0.0.1:1234"])
        for (const middleware of [sameOriginOnly, adminSameOriginOnly]) assert.equal(check(middleware, origin), 200);
    for (const origin of ["null", "https://evil.test", "https://spirit-healing.tr.evil.test", "http://localhost.evil.test:4174"])
        for (const middleware of [sameOriginOnly, adminSameOriginOnly]) assert.equal(check(middleware, origin), 403);
});

test('client retry key survives reload with no persisted form fields', async () => {
    const memory = new Map();
    const previous = globalThis.sessionStorage;
    globalThis.sessionStorage = { getItem: key => memory.get(key), setItem: (key, value) => memory.set(key, value) };
    try {
        const first = await import('../src/lib/contactRequestKey.js?first');
        const payload = { name: 'Synthetic Private Name', email: 'synthetic@example.test', message: 'Sensitive test' };
        const key = await first.contactRequestKey(payload);
        const reloaded = await import('../src/lib/contactRequestKey.js?reload');
        assert.equal(await reloaded.contactRequestKey(payload), key);
        assert.notEqual(await reloaded.contactRequestKey({ ...payload, message: 'Changed' }), key);
        const stored = Array.from(memory.values()).join('');
        assert.ok(!stored.includes(payload.name) && !stored.includes(payload.email) && !stored.includes(payload.message));
        globalThis.sessionStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
        assert.equal(await reloaded.contactRequestKey(payload), key);
    } finally {
        if (previous === undefined) delete globalThis.sessionStorage; else globalThis.sessionStorage = previous;
    }
});
