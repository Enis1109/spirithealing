import assert from "node:assert/strict";
import test from "node:test";
import {
    normalizeScheduleSurveySubmission,
    scheduleSurveyConsentVersion,
    ScheduleSurveyValidationError,
} from "../server/scheduleSurveyValidation.js";

const completeSubmission = {
    name: "  Test Person  ",
    availableSlots: ["mo_1000", "mi_1930", "mo_1000"],
    preferredSlot: "mi_1930",
    knownExceptions: " Am 19. August kann ich nicht. ",
    privacyConsent: true,
    company: "",
};

test("normalizes a complete schedule survey submission", () => {
    const result = normalizeScheduleSurveySubmission(completeSubmission);
    assert.equal(result.name, "Test Person");
    assert.deepEqual(result.availableSlots, ["mo_1000", "mi_1930"]);
    assert.equal(result.preferredSlot, "mi_1930");
    assert.equal(result.knownExceptions, "Am 19. August kann ich nicht.");
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
