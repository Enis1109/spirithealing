import assert from "node:assert/strict";
import test from "node:test";
import {
    normalizeScheduleSurveySubmission,
    scheduleSurveyConsentVersion,
    ScheduleSurveyValidationError,
} from "../server/scheduleSurveyValidation.js";

const completeSubmission = {
    name: "  Test Person  ",
    email: " TEST@EXAMPLE.COM ",
    invoiceAddress: "Musterstraße 1\n12345 Musterstadt",
    availableSlots: ["mo_1000", "mi_1930", "mo_1000"],
    preferredSlot: "mi_1930",
    knownExceptions: " Am 19. August kann ich nicht. ",
    paymentChoice: "two_installments",
    desiredInstallment: "",
    privacyConsent: true,
    company: "",
};

test("normalizes a complete schedule survey submission", () => {
    const result = normalizeScheduleSurveySubmission(completeSubmission);
    assert.equal(result.name, "Test Person");
    assert.equal(result.email, "test@example.com");
    assert.equal(result.invoiceAddress, "Musterstraße 1\n12345 Musterstadt");
    assert.deepEqual(result.availableSlots, ["mo_1000", "mi_1930"]);
    assert.equal(result.preferredSlot, "mi_1930");
    assert.equal(result.knownExceptions, "Am 19. August kann ich nicht.");
    assert.equal(result.paymentChoice, "two_installments");
    assert.equal(result.desiredInstallment, null);
    assert.equal(result.consentVersion, scheduleSurveyConsentVersion);
});

test("requires at least one valid slot and a favorite from that selection", () => {
    assert.throws(() => normalizeScheduleSurveySubmission({ ...completeSubmission, availableSlots: [] }), ScheduleSurveyValidationError);
    assert.throws(() => normalizeScheduleSurveySubmission({ ...completeSubmission, preferredSlot: "fr_1930" }), ScheduleSurveyValidationError);
    assert.throws(() => normalizeScheduleSurveySubmission({ ...completeSubmission, availableSlots: ["unbekannt"] }), ScheduleSurveyValidationError);
});

test("rejects missing privacy consent and honeypot content", () => {
    assert.throws(() => normalizeScheduleSurveySubmission({ ...completeSubmission, privacyConsent: false }), ScheduleSurveyValidationError);
    assert.throws(() => normalizeScheduleSurveySubmission({ ...completeSubmission, company: "Spam GmbH" }), ScheduleSurveyValidationError);
});

test("validates payment choice and an individual installment from 90 euros", () => {
    const result = normalizeScheduleSurveySubmission({
        ...completeSubmission,
        paymentChoice: "custom_installment",
        desiredInstallment: "125",
    });
    assert.equal(result.desiredInstallment, 125);
    const localizedResult = normalizeScheduleSurveySubmission({
        ...completeSubmission,
        paymentChoice: "custom_installment",
        desiredInstallment: "240,00",
    });
    assert.equal(localizedResult.desiredInstallment, 240);
    assert.throws(() => normalizeScheduleSurveySubmission({ ...completeSubmission, paymentChoice: "unknown" }), ScheduleSurveyValidationError);
    assert.throws(() => normalizeScheduleSurveySubmission({ ...completeSubmission, paymentChoice: "custom_installment", desiredInstallment: 89 }), ScheduleSurveyValidationError);
});
