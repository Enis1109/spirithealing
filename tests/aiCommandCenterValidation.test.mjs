import assert from "node:assert/strict";
import test from "node:test";
import {
    AiCommandCenterValidationError,
    normalizeBudgetSettings,
    normalizeImageDraftRequest,
    normalizeKnowledgeEntry,
    normalizeLearningDecision,
    normalizePilotWeek,
    normalizeRunDecision,
    normalizeWorkflowRequest,
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

test("normalizes a content project and blocks direct identifiers", () => {
    const input = {
        workflowId: "content-project",
        projectName: "Herbstprojekt",
        goal: "Eine neue Gruppe verständlich vorstellen",
        audience: "Erwachsene, die sich über das Angebot informieren möchten",
        coreMessage: "Veränderung darf in kleinen Schritten beginnen.",
        offer: "Unverbindliches Erstgespräch",
        callToAction: "Mehr über die Gruppe erfahren",
        tone: "warm und klar",
        constraints: "Keine Heilversprechen",
        channels: ["instagram", "facebook", "tiktok", "whatsapp", "youtube", "linkedin", "newsletter", "blog", "instagram"],
        anonymizationConfirmed: true,
    };
    const normalized = normalizeWorkflowRequest(input);
    assert.equal(normalized.workflowId, "content-project");
    assert.deepEqual(normalized.contentBrief.channels, ["instagram", "facebook", "tiktok", "whatsapp", "youtube", "linkedin", "newsletter", "blog"]);
    assert.throws(
        () => normalizeWorkflowRequest({ ...input, channels: ["instagram", "telegram"] }),
        (error) => error instanceof AiCommandCenterValidationError && error.field === "channels",
    );
    assert.throws(
        () => normalizeWorkflowRequest({ ...input, coreMessage: "Bitte an person@example.com senden" }),
        (error) => error instanceof AiCommandCenterValidationError && error.reason === "personal_data_email",
    );
});

test("requires a bounded image brief and explicit cost confirmation", () => {
    assert.deepEqual(normalizeImageDraftRequest({ briefIndex: "2", confirmCost: true }), { briefIndex: 2, confirmCost: true });
    assert.throws(() => normalizeImageDraftRequest({ briefIndex: 0, confirmCost: false }), AiCommandCenterValidationError);
    assert.throws(() => normalizeImageDraftRequest({ briefIndex: 8, confirmCost: true }), AiCommandCenterValidationError);
});

test("normalizes a morning team meeting", () => {
    const normalized = normalizeWorkflowRequest({
        workflowId: "team-meeting",
        meetingDate: "2026-09-05",
        dayPriorities: "Webinar prüfen",
        weekPriorities: "Berlin-Kampagne",
        monthPriorities: "",
        currentSignals: "Eine neue Anfrage",
        openDecisions: "",
        constraints: "Keine Veröffentlichung ohne Freigabe",
        anonymizationConfirmed: true,
    });
    assert.equal(normalized.teamMeeting.meetingDate, "2026-09-05");
    assert.equal(normalized.teamMeeting.dayPriorities, "Webinar prüfen");
});

test("requires confirmed, sourced company knowledge and a valid learning decision", () => {
    assert.deepEqual(normalizeKnowledgeEntry({
        category: "marke",
        title: "Linkstandard",
        content: "Für kostenlose Inhalte gilt die freigegebene Gratis-Seite.",
        sourceNote: "Team-Beschluss vom 05.09.2026",
        confirmed: true,
    }).category, "marke");
    assert.throws(() => normalizeKnowledgeEntry({ category: "marke", title: "X", content: "Y", sourceNote: "Z", confirmed: false }), AiCommandCenterValidationError);
    assert.deepEqual(normalizeLearningDecision({ approved: true }), { approved: true });
});
