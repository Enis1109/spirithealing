import assert from "node:assert/strict";
import test from "node:test";
import {
    normalizeWebinarRegistration,
    normalizeWebinarToken,
    WebinarValidationError,
} from "../server/webinarValidation.js";

test("normalizes a complete webinar registration", () => {
    assert.deepEqual(normalizeWebinarRegistration({
        name: "  Sabine Schmidt ",
        email: " SABINE@EXAMPLE.DE ",
        slotId: "2026-09-02T08:00:00.000Z",
        privacyConsent: true,
        newsletterConsent: true,
        locale: "de",
    }), {
        name: "Sabine Schmidt",
        email: "sabine@example.de",
        slotId: "2026-09-02T08:00:00.000Z",
        locale: "de",
        newsletterConsent: true,
    });
});

test("keeps newsletter consent voluntary", () => {
    assert.equal(normalizeWebinarRegistration({
        name: "Sabine Schmidt",
        email: "sabine@example.de",
        slotId: "2026-09-02T08:00:00.000Z",
        privacyConsent: true,
    }).newsletterConsent, false);
});

test("accepts immediate access without newsletter consent", () => {
    const form = normalizeWebinarRegistration({
        name: "Test Person", email: "test@example.com", slotId: "on-demand", privacyConsent: true,
    });
    assert.equal(form.slotId, "on-demand");
    assert.equal(form.newsletterConsent, false);
});

test("rejects malformed slots and honeypot submissions", () => {
    const form = { name: "Test", email: "test@example.com", slotId: "on-demand", privacyConsent: true };
    for (const slotId of ["now", "", "2026-09-15", "not-a-date"]) {
        assert.throws(() => normalizeWebinarRegistration({ ...form, slotId }), WebinarValidationError);
    }
    assert.throws(() => normalizeWebinarRegistration({ ...form, company: "spam" }), WebinarValidationError);
});

test("requires explicit privacy consent", () => {
    assert.throws(() => normalizeWebinarRegistration({
        name: "Sabine Schmidt",
        email: "sabine@example.de",
        slotId: "2026-09-02T08:00:00.000Z",
        privacyConsent: false,
    }), (error) => error instanceof WebinarValidationError && error.field === "privacyConsent");
});

test("accepts the signed access token shape", () => {
    const token = `1.${"a".repeat(43)}`;
    assert.equal(normalizeWebinarToken(token), token);
    assert.throws(() => normalizeWebinarToken("unsafe-token"), WebinarValidationError);
});
