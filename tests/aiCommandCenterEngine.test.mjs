import assert from "node:assert/strict";
import test from "node:test";
import {
    aiAgentRegistry,
    buildMockWorkflowRun,
} from "../server/aiCommandCenterEngine.js";

const pilotWeek = {
    id: 1,
    weekNumber: 1,
    participantCount: 8,
    plannedFocus: "Wahrnehmen",
    actualFocus: "Automatische Reaktionen erkennen",
    commonQuestions: "Wie merke ich den Beginn einer Reaktion?",
    helpfulExercises: "Kurze Pause und Körperwahrnehmung",
    challenges: "Im Alltag wurde die Pause oft vergessen.",
    observedChanges: "Reaktionen wurden teilweise früher bemerkt.",
    professionalInsights: "Kurze Beispiele helfen beim Transfer.",
    nextAdjustments: "Ein Alltagsbeispiel ergänzen.\nErinnerungshilfe vorbereiten.",
};

test("defines separate agent roles with explicit provider routes", () => {
    assert.equal(aiAgentRegistry.length, 17);
    assert.equal(new Set(aiAgentRegistry.map((agent) => agent.id)).size, 17);
    assert.ok(aiAgentRegistry.every((agent) => agent.purpose
        && agent.provider
        && agent.providerRoute
        && agent.capabilities.length > 0
        && agent.access.length > 0
        && agent.guardrail));
    assert.equal(aiAgentRegistry.find((agent) => agent.id === "editorial-teaching")?.providerRoute, "anthropic-editorial");
    assert.equal(aiAgentRegistry.find((agent) => agent.id === "visual-design")?.providerRoute, "openai-image-canva-handoff");
    assert.ok(aiAgentRegistry.find((agent) => agent.id === "content-studio")?.capabilities.includes("Bildbriefings für GPT Image 2"));
});

test("runs the pilot workflow as an ordered, zero-cost mock chain", () => {
    const run = buildMockWorkflowRun({ workflowId: "pilot-week-learning", pilotWeek });
    assert.equal(run.mode, "mock");
    assert.equal(run.actualCostUsd, 0);
    assert.equal(run.approvalStatus, "pending");
    assert.equal(run.result.externalActions.length, 0);
    assert.equal(run.steps[0].inputFrom.length, 0);
    assert.deepEqual(run.steps[1].inputFrom, ["step-1"]);
    assert.ok(run.steps.every((step) => step.status === "completed"));
});

test("keeps pilot data, missing weeks and extension hypotheses visibly separate", () => {
    const run = buildMockWorkflowRun({ workflowId: "core-product-development", pilotWeeks: [pilotWeek] });
    assert.equal(run.steps.find((step) => step.agentId === "editorial-teaching")?.provider, "Anthropic · Claude Sonnet 5");
    assert.equal(run.result.programBlueprint.length, 12);
    assert.equal(run.result.programBlueprint[0].sourceStatus, "pilot-data");
    assert.equal(run.result.programBlueprint[1].sourceStatus, "missing");
    assert.equal(run.result.programBlueprint[8].sourceStatus, "hypothesis");
    assert.deepEqual(run.result.sourceWeeks, [1]);
});

test("creates a content project with text and image handoff but no external action", () => {
    const contentBrief = {
        projectName: "Herbstprojekt",
        goal: "Eine neue Gruppe vorstellen",
        audience: "Interessierte Erwachsene",
        coreMessage: "Kleine Schritte sind erlaubt.",
        offer: "Informationsseite",
        callToAction: "Mehr erfahren",
        tone: "warm und klar",
        constraints: "Keine Heilversprechen",
        channels: ["instagram", "facebook"],
    };
    const run = buildMockWorkflowRun({ workflowId: "content-project", contentBrief });
    assert.equal(run.result.contentPackage.pieces.length, 2);
    assert.equal(run.result.contentPackage.imageBriefs.length, 1);
    assert.deepEqual(run.result.externalActions, []);
    assert.ok(run.steps.some((step) => step.agentId === "brand-review"));
});
