import assert from "node:assert/strict";
import test from "node:test";
import {
    calculateOpenAiCostUsd,
    estimateLiveWorkflowCostUsd,
    runLiveWorkflow,
} from "../server/openAiCommandCenter.js";

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
    nextAdjustments: "Ein Alltagsbeispiel ergänzen.",
};

const result = {
    title: "Interne Auswertung",
    executiveSummary: "Ein prüfbarer Arbeitsstand.",
    signals: ["Eine dokumentierte Beobachtung"],
    recommendedAdjustments: ["Eine Anpassung prüfen"],
    contentIdeas: ["Ein interner Entwurf"],
    reviewNotes: ["Kein Wirksamkeitsnachweis"],
    openDecisions: ["Fachlich prüfen"],
    programBlueprint: [],
    sourceWeeks: [1],
    sources: [],
    externalActions: [],
};

const providerPayload = ({ model, agentIds, usage, webSearch = false }) => ({
    id: `resp-${model}`,
    model,
    usage,
    output: [
        ...(webSearch ? [{ type: "web_search_call" }] : []),
        {
            type: "message",
            content: [{
                type: "output_text",
                text: JSON.stringify({
                    stepSummaries: agentIds.map((agentId) => ({ agentId, summary: `${agentId} abgeschlossen` })),
                    result,
                }),
            }],
        },
    ],
});

test("calculates token, cache and web-search costs from recorded usage", () => {
    assert.equal(calculateOpenAiCostUsd({
        model: "gpt-5.6-terra",
        inputTokens: 10_000,
        cachedInputTokens: 2_000,
        outputTokens: 3_000,
        webSearchCalls: 2,
    }), 0.0724);
});

test("estimates a live run below the default per-run budget", () => {
    const previous = {
        mode: process.env.AI_COMMAND_CENTER_MODE,
        routine: process.env.OPENAI_ROUTINE_MODEL,
        review: process.env.OPENAI_REVIEW_MODEL,
    };
    process.env.AI_COMMAND_CENTER_MODE = "live";
    process.env.OPENAI_ROUTINE_MODEL = "gpt-5.6-luna";
    process.env.OPENAI_REVIEW_MODEL = "gpt-5.6-terra";
    try {
        const estimate = estimateLiveWorkflowCostUsd({ workflowId: "pilot-week-learning", pilotWeek });
        assert.ok(estimate >= 0.05);
        assert.ok(estimate < 2);
    } finally {
        if (previous.mode === undefined) delete process.env.AI_COMMAND_CENTER_MODE;
        else process.env.AI_COMMAND_CENTER_MODE = previous.mode;
        if (previous.routine === undefined) delete process.env.OPENAI_ROUTINE_MODEL;
        else process.env.OPENAI_ROUTINE_MODEL = previous.routine;
        if (previous.review === undefined) delete process.env.OPENAI_REVIEW_MODEL;
        else process.env.OPENAI_REVIEW_MODEL = previous.review;
    }
});

test("runs separate draft and review calls without external actions", async () => {
    const previous = {
        mode: process.env.AI_COMMAND_CENTER_MODE,
        key: process.env.OPENAI_API_KEY,
        routine: process.env.OPENAI_ROUTINE_MODEL,
        review: process.env.OPENAI_REVIEW_MODEL,
        search: process.env.AI_COMMAND_CENTER_WEB_SEARCH,
    };
    process.env.AI_COMMAND_CENTER_MODE = "live";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_ROUTINE_MODEL = "gpt-5.6-luna";
    process.env.OPENAI_REVIEW_MODEL = "gpt-5.6-terra";
    process.env.AI_COMMAND_CENTER_WEB_SEARCH = "true";
    const requests = [];
    const fetchImpl = async (_url, options) => {
        const request = JSON.parse(options.body);
        requests.push(request);
        const draftAgentIds = ["sh-director", "knowledge-curator", "analytics-learning", "program-development", "content-studio"];
        const reviewAgentIds = ["research-fact-check", "compliance-privacy", "independent-review", "quality-controller"];
        const payload = requests.length === 1
            ? providerPayload({
                model: "gpt-5.6-luna",
                agentIds: draftAgentIds,
                usage: { input_tokens: 1000, output_tokens: 500, input_tokens_details: { cached_tokens: 0 } },
            })
            : providerPayload({
                model: "gpt-5.6-terra",
                agentIds: reviewAgentIds,
                usage: { input_tokens: 2000, output_tokens: 1000, input_tokens_details: { cached_tokens: 0 } },
                webSearch: true,
            });
        return { ok: true, json: async () => payload };
    };

    try {
        const liveRun = await runLiveWorkflow({
            workflowId: "pilot-week-learning",
            pilotWeek,
            estimatedCostUsd: 0.2,
            fetchImpl,
        });
        assert.equal(requests.length, 2);
        assert.equal(requests[0].store, false);
        assert.equal(requests[0].tools, undefined);
        assert.deepEqual(requests[1].tools, [{ type: "web_search" }]);
        assert.equal(liveRun.mode, "live");
        assert.equal(liveRun.steps.length, 9);
        assert.equal(liveRun.actualCostUsd, 0.0268);
        assert.deepEqual(liveRun.result.externalActions, []);
        assert.deepEqual(liveRun.result.sourceWeeks, [1]);
    } finally {
        for (const [key, value] of Object.entries({
            AI_COMMAND_CENTER_MODE: previous.mode,
            OPENAI_API_KEY: previous.key,
            OPENAI_ROUTINE_MODEL: previous.routine,
            OPENAI_REVIEW_MODEL: previous.review,
            AI_COMMAND_CENTER_WEB_SEARCH: previous.search,
        })) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
});
