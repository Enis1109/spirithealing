import assert from "node:assert/strict";
import test from "node:test";
import crypto from "node:crypto";
import fs from "node:fs";
import vm from "node:vm";
import { createMemberAccessResendService, normalizeAccessResend,
    registerMemberAccessResendRoutes, MemberAccessResendError } from "../server/memberAccessResend.js";

const admin = { id: 7, role: "admin" };
const secret = "synthetic-token-never-return-to-admin";
const email = "member@example.invalid";

function harness(options = {}) {
    const state = { sql: [], messages: [], committed: false, released: false, rolledBack: false };
    const member = options.missing ? null : { id: 42, name: "Funktionstest", email,
        locale: "de", status: options.status || "pending",
        privacy_consent_at: "2026-08-01", password_hash: null, verified_at: null };
    const before = structuredClone(member);
    const connection = {
        async beginTransaction() {},
        async execute(sql, values) {
            state.sql.push({ sql, values });
            if (/FROM members WHERE/u.test(sql)) return [member ? [member] : []];
            if (/SELECT id FROM member_access_tokens/u.test(sql)) return [options.recent ? [{ id: 99 }] : []];
            if (/SELECT pending_password_hash/u.test(sql)) return [options.pendingPassword ? [{ pending_password_hash: "synthetic-password-digest" }] : []];
            if (/INSERT INTO member_access_tokens/u.test(sql)) {
                if (options.databaseFailure) throw new Error("database_failure");
                return [{ insertId: 101 }];
            }
            throw new Error("unexpected_sql");
        },
        async commit() { state.committed = true; },
        async rollback() { state.rolledBack = true; },
        release() { state.released = true; },
    };
    const service = createMemberAccessResendService({
        db: { async getConnection() { state.connected = true; return connection; } },
        async sendEmail(message) {
            assert.equal(state.committed, true);
            assert.equal(state.released, true);
            state.messages.push(message);
            if (options.smtpFailure) throw new Error("private-smtp-detail-not-for-client");
            return options.delivery || { accepted: [email], rejected: [], sender: "Spirit Healing <website@example.invalid>" };
        },
        baseUrl: "https://example.invalid", tokenFactory: () => secret,
        now: () => new Date("2026-10-25T20:00:00Z"),
    });
    return { service, state, member, before };
}

test("admin resend only inserts a token and preserves pending status, consent and the chosen password", async () => {
    const h = harness({ pendingPassword: true });
    const result = await h.service.resend({ actor: admin, email });
    assert.deepEqual(h.member, h.before);
    assert.deepEqual(result, { email, sentAt: "2026-10-25T20:00:00.000Z", sender: "Spirit Healing <website@example.invalid>" });
    const writes = h.state.sql.filter(({ sql }) => /^\s*(?:INSERT|UPDATE|DELETE)/u.test(sql));
    assert.equal(writes.length, 1);
    assert.match(writes[0].sql, /INSERT INTO member_access_tokens/u);
    assert.deepEqual(writes[0].values, [42, crypto.createHash("sha256").update(secret).digest("hex"), "synthetic-password-digest"]);
    assert.match(writes[0].sql, /9999-12-31/u);
    assert.equal(h.state.messages.length, 1);
    const message = h.state.messages[0];
    assert.equal(message.email, email);
    assert.equal(new URL(message.accessUrl).searchParams.get("token"), secret);
    assert.equal(message.newsletterConsent, false);
    assert.equal(message.includeNewsletterOffer, false);
    assert.equal(message.privacyConsent, undefined);
    assert.doesNotMatch(JSON.stringify(result), /token|accessUrl|digest/u);
    assert.match(h.state.sql[0].sql, /FOR UPDATE/u);
});

test("active accounts retain status and never read or set a pending password", async () => {
    const h = harness({ status: "active" });
    await h.service.resend({ actor: admin, email });
    assert.deepEqual(h.member, h.before);
    assert.equal(h.state.sql.some(({ sql }) => /SELECT pending_password_hash/u.test(sql)), false);
    assert.equal(h.state.sql.find(({ sql }) => /INSERT/u.test(sql)).values[2], null);
});

for (const actor of [null, { id: 2, role: "member" }]) {
    test(`rejects ${actor ? "ordinary member" : "anonymous caller"} before database access`, async () => {
        const h = harness();
        await assert.rejects(h.service.resend({ actor, email }), (e) => [401, 403].includes(e.status));
        assert.equal(h.state.connected, undefined);
        assert.equal(h.state.messages.length, 0);
    });
}

for (const options of [{ missing: true }, { status: "blocked" }, { status: "deleted" }, { recent: true }]) {
    test(`does not create a credential or send mail for ${JSON.stringify(options)}`, async () => {
        const h = harness(options);
        await assert.rejects(h.service.resend({ actor: admin, email }), MemberAccessResendError);
        assert.equal(h.state.sql.some(({ sql }) => /^\s*INSERT/u.test(sql)), false);
        assert.equal(h.state.messages.length, 0);
        assert.equal(h.state.rolledBack, true);
        assert.equal(h.state.released, true);
    });
}

test("rolls back database failures without sending email", async () => {
    const h = harness({ databaseFailure: true });
    await assert.rejects(h.service.resend({ actor: admin, email }), /database_failure/u);
    assert.equal(h.state.messages.length, 0);
    assert.equal(h.state.committed, false);
    assert.equal(h.state.rolledBack, true);
});

for (const options of [{ smtpFailure: true }, { delivery: { accepted: ["other@example.invalid"], rejected: [] } },
    { delivery: { accepted: [email], rejected: [email] } }]) {
    test(`never reports delivery success or retries SMTP for ${JSON.stringify(options)}`, async () => {
        const h = harness(options);
        await assert.rejects(h.service.resend({ actor: admin, email }), (e) => e.code === "delivery_unconfirmed" && e.status === 502);
        assert.equal(h.state.messages.length, 1);
        assert.equal(h.state.committed, true);
        assert.equal(h.state.sql.some(({ sql }) => /^\s*(?:DELETE|UPDATE)/u.test(sql)), false);
    });
}

test("request accepts only an email, never new consent, passwords, status or recipient overrides", () => {
    assert.deepEqual(normalizeAccessResend({ email: " MEMBER@example.invalid " }), { email });
    for (const body of [null, [], {}, { email: "bad" }, { email, privacyConsent: true },
        { email, name: "different" }, { email, status: "active" }, { email, to: "other@example.invalid" }, { email, password: "new" }]) {
        assert.throws(() => normalizeAccessResend(body), MemberAccessResendError);
    }
});

function routeHarness(actor, service) {
    let route;
    const origin = () => {};
    const limiter = () => {};
    registerMemberAccessResendRoutes({ post(path, ...handlers) { route = { path, handlers }; } }, {
        service, getMember: async () => actor, sameOrigin: origin, limiter,
    });
    assert.deepEqual(route.handlers.slice(0, 2), [origin, limiter]);
    const response = { headers: {}, statusCode: 200,
        set(k, v) { this.headers[k] = v; return this; }, status(v) { this.statusCode = v; return this; },
        json(v) { this.body = v; return this; } };
    return { route, response, run: (body) => route.handlers.at(-1)({ body }, response) };
}

test("HTTP handler enforces admin auth and does not return a sign-in link", async () => {
    for (const actor of [null, { role: "member" }, admin]) {
        const h = harness();
        const r = routeHarness(actor, h.service);
        await r.run({ email });
        assert.equal(r.response.statusCode, actor === admin ? 201 : actor ? 403 : 401);
        assert.equal(r.response.headers["Cache-Control"], "no-store");
        assert.doesNotMatch(JSON.stringify(r.response.body), /synthetic-token|accessUrl|password|digest/u);
    }
});

test("HTTP handler rejects consent fields and gives a bounded cooldown", async () => {
    const h = harness({ recent: true });
    const invalid = routeHarness(admin, h.service);
    await invalid.run({ email, privacyConsent: true });
    assert.equal(invalid.response.statusCode, 400);
    assert.equal(h.state.connected, undefined);
    const recent = routeHarness(admin, h.service);
    await recent.run({ email });
    assert.equal(recent.response.statusCode, 429);
    assert.equal(recent.response.headers["Retry-After"], "300");
});

function mailHarness() {
    const source = fs.readFileSync(new URL("../server/mailer.js", import.meta.url), "utf8");
    const fn = source.slice(source.indexOf("export const sendMemberAccessEmail ="), source.indexOf("export const sendMemberPasswordResetEmail ="));
    const messages = [];
    const transport = { async sendMail(message) { messages.push(message); return { accepted: [message.to], rejected: [] }; } };
    const ctx = vm.createContext({ process: { env: { SMTP_FROM: "website@example.invalid" } },
        escapeHtml: (s) => String(s), notificationRecipient: "team@example.invalid",
        transporter: transport, accessResendTransporter: transport });
    vm.runInContext(fn.replace("export const sendMemberAccessEmail =", "globalThis.sendMemberAccessEmail ="), ctx);
    return { messages, send: ctx.sendMemberAccessEmail };
}

test("actual mail template omits newsletter/consent offers only for admin resends", async () => {
    const h = mailHarness();
    const form = { name: "Test", email, locale: "de", accessUrl: "https://example.invalid/private-sign-in",
        newsletterConsent: false, newsletterOfferUrl: "https://example.invalid/newsletter-offer" };
    const result = await h.send({ ...form, includeNewsletterOffer: false });
    assert.equal(result.sender, "website@example.invalid");
    assert.equal(h.messages[0].subject, "Dein Zugang zum Spirit Healing Mitgliederbereich");
    assert.match(h.messages[0].html, /Mitgliederbereich öffnen/u);
    assert.doesNotMatch(h.messages[0].html + h.messages[0].text, /Newsletter|newsletter-offer|undefined/u);
    await h.send(form);
    assert.match(h.messages[1].text, /newsletter-offer/u);
    assert.match(h.messages[1].html, /Newsletter abonnieren/u);
});

test("production wiring keeps same-origin, admin authentication and an independent rate limit", () => {
    const source = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
    assert.match(source, /registerMemberAccessResendRoutes\(app,[\s\S]*?getMember: getMemberFromRequest, sameOrigin: adminSameOriginOnly, limiter: memberAccessEmailLimiter/u);
    const ui = fs.readFileSync(new URL("../src/sections/AdminPrograms.jsx", import.meta.url), "utf8");
    assert.match(ui, /Zugangs-E-Mail neu senden/u);
    assert.match(ui, /body: JSON\.stringify\(\{ email: member\.email \}\)/u);
    assert.match(ui, /window\.confirm\(`Zugangs-E-Mail erneut an/u);
});
