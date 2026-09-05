import assert from "node:assert/strict";
import test from "node:test";
import {
    calculateAnthropicCostUsd,
    calculateOpenAiImageOutputCostUsd,
    calculateOpenAiCostUsd,
    estimateLiveWorkflowCostUsd,
    generateOpenAiImageDraft,
    runLiveWorkflow,
} from "../server/openAiCommandCenter.js";

test("prices image drafts and finals before activation", () => {
    assert.equal(calculateOpenAiImageOutputCostUsd({ model: "gpt-image-2", size: "1024x1536", quality: "low" }), 0.005);
    assert.equal(calculateOpenAiImageOutputCostUsd({ model: "gpt-image-2", size: "1024x1536", quality: "medium", count: 3 }), 0.123);
});

test("generates one low-cost image draft only when image access is enabled", async () => {
    const previous = Object.fromEntries([
        "AI_COMMAND_CENTER_MODE",
        "OPENAI_API_KEY",
        "OPENAI_IMAGE_ENABLED",
        "OPENAI_IMAGE_MODEL",
        "OPENAI_IMAGE_SIZE",
        "OPENAI_IMAGE_DRAFT_QUALITY",
    ].map((key) => [key, process.env[key]]));
    process.env.AI_COMMAND_CENTER_MODE = "live";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_IMAGE_ENABLED = "true";
    process.env.OPENAI_IMAGE_MODEL = "gpt-image-2";
    process.env.OPENAI_IMAGE_SIZE = "1024x1536";
    process.env.OPENAI_IMAGE_DRAFT_QUALITY = "low";
    let request;
    try {
        const generated = await generateOpenAiImageDraft({
            prompt: "Ein ruhiges abstraktes Motiv",
            fetchImpl: async (_url, options) => {
                request = JSON.parse(options.body);
                return { ok: true, json: async () => ({ data: [{ b64_json: Buffer.from("image").toString("base64") }] }) };
            },
        });
        assert.equal(request.model, "gpt-image-2");
        assert.equal(request.quality, "low");
        assert.equal(request.n, 1);
        assert.equal(generated.image.toString(), "image");
        assert.equal(generated.costUsd, 0.005);
    } finally {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
});

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

test("calculates Anthropic input, cache and output costs from recorded usage", () => {
    assert.equal(calculateAnthropicCostUsd({
        model: "claude-sonnet-5",
        inputTokens: 10_000,
        cacheWriteTokens: 2_000,
        cacheReadTokens: 1_000,
        outputTokens: 5_000,
        pricedAt: "2026-08-17T00:00:00Z",
    }), 0.0752);
});

test("uses Claude Sonnet 5 standard pricing after the launch promotion", () => {
    assert.equal(calculateAnthropicCostUsd({
        model: "claude-sonnet-5",
        inputTokens: 10_000,
        cacheWriteTokens: 2_000,
        cacheReadTokens: 1_000,
        outputTokens: 5_000,
        pricedAt: "2026-09-01T00:00:00Z",
    }), 0.1128);
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
        anthropicEnabled: process.env.ANTHROPIC_CONTENT_ENABLED,
    };
    process.env.AI_COMMAND_CENTER_MODE = "live";
    process.env.OPENAI_ROUTINE_MODEL = "gpt-5.6-luna";
    process.env.OPENAI_REVIEW_MODEL = "gpt-5.6-terra";
    process.env.ANTHROPIC_CONTENT_ENABLED = "false";
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
        if (previous.anthropicEnabled === undefined) delete process.env.ANTHROPIC_CONTENT_ENABLED;
        else process.env.ANTHROPIC_CONTENT_ENABLED = previous.anthropicEnabled;
    }
});

test("runs separate draft and review calls without external actions", async () => {
    const previous = {
        mode: process.env.AI_COMMAND_CENTER_MODE,
        key: process.env.OPENAI_API_KEY,
        routine: process.env.OPENAI_ROUTINE_MODEL,
        review: process.env.OPENAI_REVIEW_MODEL,
        search: process.env.AI_COMMAND_CENTER_WEB_SEARCH,
        anthropicEnabled: process.env.ANTHROPIC_CONTENT_ENABLED,
    };
    process.env.AI_COMMAND_CENTER_MODE = "live";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_ROUTINE_MODEL = "gpt-5.6-luna";
    process.env.OPENAI_REVIEW_MODEL = "gpt-5.6-terra";
    process.env.AI_COMMAND_CENTER_WEB_SEARCH = "true";
    process.env.ANTHROPIC_CONTENT_ENABLED = "false";
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
        assert.equal(liveRun.steps.length, 10);
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
            ANTHROPIC_CONTENT_ENABLED: previous.anthropicEnabled,
        })) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
});

test("routes long-form work through Claude and then through the OpenAI review", async () => {
    const previous = Object.fromEntries([
        "AI_COMMAND_CENTER_MODE",
        "OPENAI_API_KEY",
        "OPENAI_ROUTINE_MODEL",
        "OPENAI_REVIEW_MODEL",
        "AI_COMMAND_CENTER_WEB_SEARCH",
        "ANTHROPIC_CONTENT_ENABLED",
        "ANTHROPIC_API_KEY",
        "ANTHROPIC_EDITORIAL_MODEL",
    ].map((key) => [key, process.env[key]]));
    process.env.AI_COMMAND_CENTER_MODE = "live";
    process.env.OPENAI_API_KEY = "openai-test-key";
    process.env.OPENAI_ROUTINE_MODEL = "gpt-5.6-luna";
    process.env.OPENAI_REVIEW_MODEL = "gpt-5.6-terra";
    process.env.AI_COMMAND_CENTER_WEB_SEARCH = "true";
    process.env.ANTHROPIC_CONTENT_ENABLED = "true";
    process.env.ANTHROPIC_API_KEY = "anthropic-test-key";
    process.env.ANTHROPIC_EDITORIAL_MODEL = "claude-sonnet-5";

    const requests = [];
    const fetchImpl = async (url, options) => {
        const request = JSON.parse(options.body);
        requests.push({ url, request, headers: options.headers });
        if (url.includes("anthropic.com")) {
            return {
                ok: true,
                json: async () => ({
                    id: "msg-editorial",
                    model: "claude-sonnet-5",
                    stop_reason: "end_turn",
                    usage: { input_tokens: 1500, output_tokens: 1000 },
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            stepSummaries: [{ agentId: "editorial-teaching", summary: "Langformentwurf erstellt" }],
                            result,
                        }),
                    }],
                }),
            };
        }
        const openAiCalls = requests.filter((item) => item.url.includes("openai.com")).length;
        const agentIds = openAiCalls === 1
            ? ["sh-director", "knowledge-curator", "analytics-learning", "program-development", "strategy-growth"]
            : ["research-fact-check", "compliance-privacy", "independent-review", "quality-controller"];
        return {
            ok: true,
            json: async () => providerPayload({
                model: openAiCalls === 1 ? "gpt-5.6-luna" : "gpt-5.6-terra",
                agentIds,
                usage: openAiCalls === 1
                    ? { input_tokens: 1000, output_tokens: 500, input_tokens_details: { cached_tokens: 0 } }
                    : { input_tokens: 2000, output_tokens: 1000, input_tokens_details: { cached_tokens: 0 } },
                webSearch: openAiCalls === 2,
            }),
        };
    };

    try {
        const liveRun = await runLiveWorkflow({
            workflowId: "core-product-development",
            pilotWeeks: [pilotWeek],
            estimatedCostUsd: 0.3,
            fetchImpl,
        });
        assert.equal(requests.length, 3);
        assert.match(requests[0].url, /api\.openai\.com/u);
        assert.match(requests[1].url, /api\.anthropic\.com/u);
        assert.match(requests[2].url, /api\.openai\.com/u);
        assert.equal(requests[1].request.output_config.format.type, "json_schema");
        assert.equal(requests[1].request.max_tokens, 6000);
        assert.equal(liveRun.usage[1].provider, "Anthropic");
        assert.equal(liveRun.steps.find((step) => step.agentId === "editorial-teaching")?.provider, "Anthropic · claude-sonnet-5");
        assert.equal(liveRun.steps.length, 11);
        assert.equal(liveRun.result.externalActions.length, 0);
        assert.ok(liveRun.actualCostUsd > 0);
        assert.ok(liveRun.actualCostUsd < 2);
    } finally {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
});
