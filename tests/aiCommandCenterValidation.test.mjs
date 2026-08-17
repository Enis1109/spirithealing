import assert from "node:assert/strict";
import test from "node:test";
import {
    AiCommandCenterValidationError,
    normalizeBudgetSettings,
    normalizePilotWeek,
    normalizeRunDecision,
} from "../server/aiCommandCenterValidation.js";

const validPilotWeek = {
    weekNumber: 3,
    participantCount: 8,
    plannedFocus: "Schutzmuster erkennen",
    actualFocus: "Grenzen im Alltag wahrnehmen",
    commonQuestions: "Wie erkenne ich eine Grenze?",
    helpfulExercises: "Kurze Körperwahrnehmung",
    challenges: "Die Übung wurde im Alltag teilweise vergessen.",
    observedChanges: "Bedürfnisse wurden früher benannt.",
    professionalInsights: "Die Einleitung braucht mehr Zeit.",
    nextAdjustments: "Beispiel für den Alltag ergänzen.",
    anonymizationConfirmed: true,
};

test("accepts an anonymized pilot week and normalizes numeric input", () => {
    const result = normalizePilotWeek({ ...validPilotWeek, weekNumber: "3", participantCount: "8" });
    assert.equal(result.weekNumber, 3);
    assert.equal(result.participantCount, 8);
    assert.equal(result.anonymizationConfirmed, true);
});

test("requires explicit anonymization confirmation", () => {
    assert.throws(
        () => normalizePilotWeek({ ...validPilotWeek, anonymizationConfirmed: false }),
        (error) => error instanceof AiCommandCenterValidationError
            && error.field === "anonymizationConfirmed",
    );
});

test("blocks direct contact and bank identifiers", () => {
    for (const commonQuestions of [
        "Bitte an person@example.com senden",
        "Rückruf unter +49 176 12345678",
        "Rückruf unter 0176 12345678",
        "Überweisung an DE89 3704 0044 0532 0130 00",
    ]) {
        assert.throws(
            () => normalizePilotWeek({ ...validPilotWeek, commonQuestions }),
            (error) => error instanceof AiCommandCenterValidationError
                && error.field === "commonQuestions"
                && error.reason.startsWith("personal_data_"),
        );
    }
});

test("validates budget limits and requires a note for rejection", () => {
    assert.deepEqual(normalizeBudgetSettings({ monthlyBudgetUsd: "15", perRunBudgetUsd: "2.25" }), {
        monthlyBudgetUsd: 15,
        perRunBudgetUsd: 2.25,
    });
    assert.throws(() => normalizeBudgetSettings({ monthlyBudgetUsd: 10, perRunBudgetUsd: 11 }), AiCommandCenterValidationError);
    assert.throws(() => normalizeRunDecision({ approved: false, note: "" }), AiCommandCenterValidationError);
    assert.deepEqual(normalizeRunDecision({ approved: true }), { approved: true, note: "" });
});
