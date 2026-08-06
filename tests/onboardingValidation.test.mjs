import assert from "node:assert/strict";
import test from "node:test";
import {
    normalizeOnboardingReview,
    normalizeOnboardingSubmission,
    onboardingConsentVersion,
    OnboardingValidationError,
} from "../server/onboardingValidation.js";

const completeSubmission = {
    name: " Test Person ",
    email: "TEST@example.com ",
    phone: "",
    topicAreas: ["selbstwert", "grenzen"],
    mainTopic: "Ich möchte mein wiederkehrendes Muster verstehen.",
    recentScene: "In einem Gespräch habe ich meine eigenen Bedürfnisse zurückgestellt.",
    desiredChange: "Ich möchte ruhig sagen können, was ich brauche.",
    goalStatement: "Ich vertrete meine Bedürfnisse klar und respektvoll.",
    goalScore: 3,
    confidenceScore: 7,
    trigger: "Eine andere Person wirkt enttäuscht.",
    automaticMeaning: "Ich bin verantwortlich, dass es ihr gut geht.",
    feelings: "Schuld und Unruhe",
    feelingIntensity: 8,
    bodyResponse: "Druck im Brustkorb",
    typicalResponse: "Ich sage schnell zu und ärgere mich später.",
    shortTermProtection: "Ich vermeide einen möglichen Konflikt.",
    longTermCost: "Ich verliere den Kontakt zu meinen Bedürfnissen.",
    patternFrequency: "woechentlich",
    fearedConsequence: "Die andere Person könnte sich abwenden.",
    exceptions: "Bei vertrauten Menschen gelingt es manchmal.",
    identityStatement: "für andere verantwortlich",
    othersStatement: "schnell enttäuscht",
    worldStatement: "nur sicher, wenn alle zufrieden sind",
    mustStatement: "es allen recht machen",
    mustNotStatement: "jemanden enttäuschen",
    earlyEcho: "Das kenne ich aus meiner Familie.",
    h01: 4,
    h02: 5,
    h03: 3,
    h04: 4,
    h05: 3,
    b01: 8,
    b02: 7,
    b03: 6,
    stability: "ja",
    professionalSupport: "keine_angabe",
    safeSupport: "Bitte Pausen ermöglichen.",
    resources: "Spaziergänge und Gespräche mit einer Freundin.",
    crisisContact: "ja",
    privacyConsent: true,
    nonMedicalAcknowledgement: true,
    aggregateConsent: true,
    company: "",
};

test("normalizes a complete onboarding submission", () => {
    const result = normalizeOnboardingSubmission(completeSubmission);
    assert.equal(result.name, "Test Person");
    assert.equal(result.email, "test@example.com");
    assert.equal(result.phone, null);
    assert.deepEqual(result.topicAreas, ["selbstwert", "grenzen"]);
    assert.equal(result.consentVersion, onboardingConsentVersion);
    assert.equal(result.aggregateConsent, true);
});

test("rejects missing explicit consent, invalid scores and honeypot content", () => {
    assert.throws(() => normalizeOnboardingSubmission({ ...completeSubmission, privacyConsent: false }), OnboardingValidationError);
    assert.throws(() => normalizeOnboardingSubmission({ ...completeSubmission, h01: 11 }), OnboardingValidationError);
    assert.throws(() => normalizeOnboardingSubmission({ ...completeSubmission, company: "Spam GmbH" }), OnboardingValidationError);
});

test("rejects unsupported topics and missing required matrix answers", () => {
    assert.throws(() => normalizeOnboardingSubmission({ ...completeSubmission, topicAreas: ["unbekannt"] }), OnboardingValidationError);
    assert.throws(() => normalizeOnboardingSubmission({ ...completeSubmission, fearedConsequence: "" }), OnboardingValidationError);
});

test("normalizes only supported admin review states", () => {
    assert.deepEqual(normalizeOnboardingReview({ status: "vorbereitet", note: " Gesprächsfrage prüfen. " }), {
        status: "vorbereitet",
        note: "Gesprächsfrage prüfen.",
    });
    assert.throws(() => normalizeOnboardingReview({ status: "geloescht" }), OnboardingValidationError);
});
