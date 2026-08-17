import {
    aiAgentRegistry,
    aiWorkflowRegistry,
} from "./aiCommandCenterEngine.js";

const modelPricesUsdPerMillion = {
    "gpt-5.6-luna": { input: 0.2, cachedInput: 0.02, output: 1.2 },
    "gpt-5.6-terra": { input: 2, cachedInput: 0.2, output: 12 },
    "gpt-5.6-sol": { input: 5, cachedInput: 0.5, output: 30 },
};

const anthropicModelPricesUsdPerMillion = {
    "claude-sonnet-5": { input: 3, cacheWrite: 3.75, cacheRead: 0.3, output: 15 },
    "claude-opus-5": { input: 5, cacheWrite: 6.25, cacheRead: 0.5, output: 25 },
};

const anthropicPromotionalPrices = {
    "claude-sonnet-5": {
        expiresAt: Date.parse("2026-09-01T00:00:00Z"),
        prices: { input: 2, cacheWrite: 2.5, cacheRead: 0.2, output: 10 },
    },
};

const openAiImageOutputPricesUsd = {
    "gpt-image-2": {
        "1024x1024": { low: 0.006, medium: 0.053, high: 0.211 },
        "1024x1536": { low: 0.005, medium: 0.041, high: 0.165 },
        "1536x1024": { low: 0.005, medium: 0.041, high: 0.165 },
    },
};

const webSearchPriceUsd = 0.01;
const reviewAgentIds = new Set([
    "research-fact-check",
    "compliance-privacy",
    "independent-review",
    "quality-controller",
]);
const editorialAgentIds = new Set(["editorial-teaching"]);

const workflowMap = new Map(aiWorkflowRegistry.map((workflow) => [workflow.id, workflow]));
const agentMap = new Map(aiAgentRegistry.map((agent) => [agent.id, agent]));

export class AiProviderError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = "AiProviderError";
        this.code = code;
        Object.assign(this, details);
    }
}

const knownModel = (value, fallback, prices = modelPricesUsdPerMillion) => {
    const model = String(value || fallback).trim();
    if (!prices[model]) {
        throw new AiProviderError("AI_MODEL_NOT_PRICED", `Unsupported priced model: ${model}`);
    }
    return model;
};

export const getAiRuntimeConfig = () => {
    const mode = String(process.env.AI_COMMAND_CENTER_MODE || "mock").trim().toLowerCase() === "live"
        ? "live"
        : "mock";
    const routineModel = knownModel(process.env.OPENAI_ROUTINE_MODEL, "gpt-5.6-luna");
    const reviewModel = knownModel(process.env.OPENAI_REVIEW_MODEL, "gpt-5.6-terra");
    const editorialModel = knownModel(
        process.env.ANTHROPIC_EDITORIAL_MODEL,
        "claude-sonnet-5",
        anthropicModelPricesUsdPerMillion,
    );
    const apiKeyConfigured = Boolean(String(process.env.OPENAI_API_KEY || "").trim());
    const anthropicEnabled = String(process.env.ANTHROPIC_CONTENT_ENABLED ?? "false").trim().toLowerCase() === "true";
    const anthropicApiKeyConfigured = Boolean(String(process.env.ANTHROPIC_API_KEY || "").trim());
    const anthropicReady = anthropicEnabled && anthropicApiKeyConfigured;
    const imageModel = String(process.env.OPENAI_IMAGE_MODEL || "gpt-image-2").trim();
    const imageSize = String(process.env.OPENAI_IMAGE_SIZE || "1024x1536").trim();
    const imageDraftQuality = String(process.env.OPENAI_IMAGE_DRAFT_QUALITY || "low").trim();
    const imageFinalQuality = String(process.env.OPENAI_IMAGE_FINAL_QUALITY || "medium").trim();
    calculateOpenAiImageOutputCostUsd({ model: imageModel, size: imageSize, quality: imageDraftQuality });
    calculateOpenAiImageOutputCostUsd({ model: imageModel, size: imageSize, quality: imageFinalQuality });
    const imageGenerationEnabled = String(process.env.OPENAI_IMAGE_ENABLED ?? "false").trim().toLowerCase() === "true";
    return {
        mode,
        provider: anthropicReady ? "OpenAI + Anthropic" : "OpenAI",
        routineModel,
        reviewModel,
        editorialModel,
        apiKeyConfigured,
        anthropicEnabled,
        anthropicApiKeyConfigured,
        anthropicReady,
        editorialProvider: anthropicReady ? "Anthropic" : "OpenAI fallback",
        canvaWorkflowMode: "approval_handoff",
        imageGenerationEnabled,
        imageGenerationReady: imageGenerationEnabled && apiKeyConfigured,
        imageModel,
        imageSize,
        imageDraftQuality,
        imageFinalQuality,
        imageDraftOutputCostUsd: calculateOpenAiImageOutputCostUsd({ model: imageModel, size: imageSize, quality: imageDraftQuality }),
        imageFinalOutputCostUsd: calculateOpenAiImageOutputCostUsd({ model: imageModel, size: imageSize, quality: imageFinalQuality }),
        creativeWorkflowMode: "image_generation_then_canva_approval_handoff",
        ready: mode === "mock" || (apiKeyConfigured && (!anthropicEnabled || anthropicApiKeyConfigured)),
        webSearchEnabled: String(process.env.AI_COMMAND_CENTER_WEB_SEARCH ?? "true") !== "false",
    };
};

export const calculateOpenAiImageOutputCostUsd = ({ model, size, quality, count = 1 }) => {
    const unitPrice = openAiImageOutputPricesUsd[model]?.[size]?.[quality];
    if (unitPrice === undefined) {
        throw new AiProviderError("AI_IMAGE_PRICE_UNKNOWN", `Unsupported priced image configuration: ${model}/${size}/${quality}`);
    }
    const safeCount = Number(count);
    if (!Number.isInteger(safeCount) || safeCount < 1 || safeCount > 20) {
        throw new AiProviderError("AI_IMAGE_COUNT_INVALID", "Image count must be between 1 and 20");
    }
    return roundCost(unitPrice * safeCount);
};

const pricingForModel = (model) => {
    const alias = Object.keys(modelPricesUsdPerMillion).find((name) => model === name || model.startsWith(`${name}-`));
    if (!alias) throw new AiProviderError("AI_MODEL_NOT_PRICED", `Missing price for model: ${model}`);
    return modelPricesUsdPerMillion[alias];
};

const anthropicPricingForModel = (model, pricedAt = Date.now()) => {
    const alias = Object.keys(anthropicModelPricesUsdPerMillion)
        .find((name) => model === name || model.startsWith(`${name}-`));
    if (!alias) throw new AiProviderError("AI_MODEL_NOT_PRICED", `Missing Anthropic price for model: ${model}`);
    const promotion = anthropicPromotionalPrices[alias];
    const pricedAtMs = new Date(pricedAt).getTime();
    if (promotion && Number.isFinite(pricedAtMs) && pricedAtMs < promotion.expiresAt) {
        return promotion.prices;
    }
    return anthropicModelPricesUsdPerMillion[alias];
};

const roundCost = (value) => Math.round(value * 10000) / 10000;

export const calculateOpenAiCostUsd = ({
    model,
    inputTokens = 0,
    cachedInputTokens = 0,
    outputTokens = 0,
    webSearchCalls = 0,
}) => {
    const price = pricingForModel(model);
    const cached = Math.min(Math.max(Number(cachedInputTokens) || 0, 0), Math.max(Number(inputTokens) || 0, 0));
    const uncached = Math.max((Number(inputTokens) || 0) - cached, 0);
    return roundCost(
        (uncached * price.input + cached * price.cachedInput + (Number(outputTokens) || 0) * price.output) / 1_000_000
        + Math.max(Number(webSearchCalls) || 0, 0) * webSearchPriceUsd,
    );
};

export const calculateAnthropicCostUsd = ({
    model,
    inputTokens = 0,
    cacheWriteTokens = 0,
    cacheReadTokens = 0,
    outputTokens = 0,
    pricedAt = Date.now(),
}) => {
    const price = anthropicPricingForModel(model, pricedAt);
    return roundCost((
        Math.max(Number(inputTokens) || 0, 0) * price.input
        + Math.max(Number(cacheWriteTokens) || 0, 0) * price.cacheWrite
        + Math.max(Number(cacheReadTokens) || 0, 0) * price.cacheRead
        + Math.max(Number(outputTokens) || 0, 0) * price.output
    ) / 1_000_000);
};

const estimatedTokens = (text) => Math.max(1, Math.ceil(String(text || "").length / 3));

const estimateCallCost = ({ model, inputText, maxOutputTokens, webSearchCalls = 0 }) => calculateOpenAiCostUsd({
    model,
    inputTokens: estimatedTokens(inputText),
    outputTokens: maxOutputTokens,
    webSearchCalls,
});

const estimateAnthropicCallCost = ({ model, inputText, maxOutputTokens }) => calculateAnthropicCostUsd({
    model,
    inputTokens: estimatedTokens(inputText),
    outputTokens: maxOutputTokens,
});

const sourcePayload = ({ workflowId, pilotWeek, pilotWeeks }) => workflowId === "pilot-week-learning"
    ? { workflowId, pilotWeek }
    : { workflowId, pilotWeeks };

export const estimateLiveWorkflowCostUsd = ({ workflowId, pilotWeek = null, pilotWeeks = [] }) => {
    const config = getAiRuntimeConfig();
    const source = JSON.stringify(sourcePayload({ workflowId, pilotWeek, pilotWeeks }));
    const draftMaxOutputTokens = 3200;
    const reviewMaxOutputTokens = 4800;
    const draftCost = estimateCallCost({
        model: config.routineModel,
        inputText: source,
        maxOutputTokens: draftMaxOutputTokens,
    });
    const editorialMaxOutputTokens = config.anthropicReady && workflowId === "core-product-development" ? 6000 : 0;
    const editorialInput = `${source}\n${"x".repeat(draftMaxOutputTokens * 3)}`;
    const editorialCost = editorialMaxOutputTokens > 0 ? estimateAnthropicCallCost({
        model: config.editorialModel,
        inputText: editorialInput,
        maxOutputTokens: editorialMaxOutputTokens,
    }) : 0;
    const reviewInput = `${editorialInput}\n${"x".repeat(editorialMaxOutputTokens * 3)}`;
    const reviewCost = estimateCallCost({
        model: config.reviewModel,
        inputText: reviewInput,
        maxOutputTokens: reviewMaxOutputTokens,
        webSearchCalls: config.webSearchEnabled ? 2 : 0,
    });
    return Math.max(0.05, roundCost((draftCost + editorialCost + reviewCost) * 1.25));
};

const commonInstructions = `Du arbeitest intern für Spirit Healing. Schreibe auf Deutsch, klar und ohne Werbesprache.
Die Eingaben sind anonymisierte Arbeitsdaten. Versuche niemals, Personen zu identifizieren. Erfinde keine Namen, Zitate, Zahlen, Quellen oder Beobachtungen.
Trenne dokumentierte Beobachtungen, fachliche Ableitungen, Hypothesen und fehlende Informationen. Pilotbeobachtungen sind kein Wirksamkeitsnachweis.
Formuliere keine Diagnose, Behandlungsempfehlung oder unbelegte Gesundheitswirkung. Markiere Aussagen, die fachliche oder rechtliche Prüfung brauchen.
Du darfst nichts veröffentlichen, versenden, abbuchen oder technisch verändern. Das Feld externalActions muss leer bleiben.
Jedes Ergebnis bleibt ein interner Arbeitsstand und braucht eine menschliche Entscheidung.`;

const resultSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        title: { type: "string" },
        executiveSummary: { type: "string" },
        signals: { type: "array", items: { type: "string" } },
        recommendedAdjustments: { type: "array", items: { type: "string" } },
        contentIdeas: { type: "array", items: { type: "string" } },
        reviewNotes: { type: "array", items: { type: "string" } },
        openDecisions: { type: "array", items: { type: "string" } },
        programBlueprint: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                properties: {
                    weekNumber: { type: "integer" },
                    title: { type: "string" },
                    basis: { type: "string" },
                    sourceStatus: { type: "string", enum: ["pilot-data", "missing", "hypothesis"] },
                },
                required: ["weekNumber", "title", "basis", "sourceStatus"],
            },
        },
        sourceWeeks: { type: "array", items: { type: "integer" } },
        sources: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                properties: {
                    title: { type: "string" },
                    url: { type: "string" },
                    note: { type: "string" },
                },
                required: ["title", "url", "note"],
            },
        },
        externalActions: { type: "array", items: { type: "string" }, maxItems: 0 },
    },
    required: [
        "title",
        "executiveSummary",
        "signals",
        "recommendedAdjustments",
        "contentIdeas",
        "reviewNotes",
        "openDecisions",
        "programBlueprint",
        "sourceWeeks",
        "sources",
        "externalActions",
    ],
};

const responseSchema = (agentIds) => ({
    type: "object",
    additionalProperties: false,
    properties: {
        stepSummaries: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                properties: {
                    agentId: { type: "string", enum: agentIds },
                    summary: { type: "string" },
                },
                required: ["agentId", "summary"],
            },
        },
        result: resultSchema,
    },
    required: ["stepSummaries", "result"],
});

const extractOutputText = (response) => {
    if (typeof response.output_text === "string" && response.output_text.trim()) return response.output_text;
    return (response.output || [])
        .flatMap((item) => item.type === "message" ? item.content || [] : [])
        .filter((item) => item.type === "output_text")
        .map((item) => item.text || "")
        .join("");
};

const countWebSearchCalls = (response) => (response.output || [])
    .filter((item) => item.type === "web_search_call")
    .length;

const extractWebSearchSources = (response) => (response.output || []).flatMap((item) => {
    if (item.type !== "web_search_call" || !Array.isArray(item.action?.sources)) return [];
    return item.action.sources.map((source) => ({
        title: String(source.title || "Externe Quelle"),
        url: String(source.url || ""),
        note: "Von der OpenAI-Websuche für die fachliche Prüfung verwendet.",
    }));
});

const parseProviderResult = (response) => {
    const text = extractOutputText(response);
    if (!text) throw new AiProviderError("AI_PROVIDER_INVALID_RESPONSE", "OpenAI returned no output text");
    try {
        return JSON.parse(text);
    } catch {
        throw new AiProviderError("AI_PROVIDER_INVALID_RESPONSE", "OpenAI returned invalid structured output");
    }
};

const requestOpenAi = async ({
    apiKey,
    model,
    instructions,
    input,
    schema,
    maxOutputTokens,
    webSearchEnabled = false,
    fetchImpl = globalThis.fetch,
}) => {
    if (typeof fetchImpl !== "function") throw new AiProviderError("AI_PROVIDER_UNAVAILABLE", "Fetch is unavailable");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);
    try {
        const body = {
            model,
            store: false,
            instructions,
            input,
            reasoning: { effort: model === "gpt-5.6-luna" ? "low" : "medium" },
            max_output_tokens: maxOutputTokens,
            text: {
                verbosity: "low",
                format: {
                    type: "json_schema",
                    name: "spirit_healing_command_center",
                    strict: true,
                    schema,
                },
            },
        };
        if (webSearchEnabled) {
            body.tools = [{ type: "web_search" }];
            body.include = ["web_search_call.action.sources"];
        }
        const response = await fetchImpl("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            const providerMessage = String(payload?.error?.message || `OpenAI request failed with ${response.status}`).slice(0, 300);
            throw new AiProviderError("AI_PROVIDER_UNAVAILABLE", providerMessage);
        }
        const usage = payload.usage || {};
        const cachedInputTokens = Number(usage.input_tokens_details?.cached_tokens || 0);
        const webSearchCalls = countWebSearchCalls(payload);
        const usedModel = String(payload.model || model);
        return {
            data: parseProviderResult(payload),
            sources: extractWebSearchSources(payload),
            usage: {
                model: usedModel,
                responseId: String(payload.id || ""),
                inputTokens: Number(usage.input_tokens || 0),
                cachedInputTokens,
                outputTokens: Number(usage.output_tokens || 0),
                webSearchCalls,
                costUsd: calculateOpenAiCostUsd({
                    model: usedModel,
                    inputTokens: Number(usage.input_tokens || 0),
                    cachedInputTokens,
                    outputTokens: Number(usage.output_tokens || 0),
                    webSearchCalls,
                }),
            },
        };
    } catch (error) {
        if (error instanceof AiProviderError) throw error;
        if (error?.name === "AbortError") {
            throw new AiProviderError("AI_PROVIDER_TIMEOUT", "OpenAI request timed out");
        }
        throw new AiProviderError("AI_PROVIDER_UNAVAILABLE", String(error?.message || error).slice(0, 300));
    } finally {
        clearTimeout(timeout);
    }
};

const extractAnthropicText = (response) => (response.content || [])
    .filter((item) => item.type === "text")
    .map((item) => item.text || "")
    .join("");

const anthropicCompatibleSchema = (value) => {
    if (Array.isArray(value)) return value.map(anthropicCompatibleSchema);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value)
        .filter(([key]) => key !== "maxItems")
        .map(([key, item]) => [key, anthropicCompatibleSchema(item)]));
};

const requestAnthropic = async ({
    apiKey,
    model,
    instructions,
    input,
    schema,
    maxOutputTokens,
    fetchImpl = globalThis.fetch,
}) => {
    if (typeof fetchImpl !== "function") throw new AiProviderError("AI_PROVIDER_UNAVAILABLE", "Fetch is unavailable");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);
    try {
        const response = await fetchImpl("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                max_tokens: maxOutputTokens,
                system: instructions,
                messages: [{ role: "user", content: input }],
                output_config: {
                    format: {
                        type: "json_schema",
                        schema: anthropicCompatibleSchema(schema),
                    },
                },
            }),
            signal: controller.signal,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            const providerMessage = String(payload?.error?.message || `Anthropic request failed with ${response.status}`).slice(0, 300);
            throw new AiProviderError("AI_PROVIDER_UNAVAILABLE", providerMessage, { provider: "Anthropic" });
        }
        const usage = payload.usage || {};
        const usedModel = String(payload.model || model);
        const usageRecord = {
            model: usedModel,
            responseId: String(payload.id || ""),
            inputTokens: Number(usage.input_tokens || 0),
            cacheWriteTokens: Number(usage.cache_creation_input_tokens || 0),
            cacheReadTokens: Number(usage.cache_read_input_tokens || 0),
            outputTokens: Number(usage.output_tokens || 0),
            webSearchCalls: 0,
            costUsd: calculateAnthropicCostUsd({
                model: usedModel,
                inputTokens: Number(usage.input_tokens || 0),
                cacheWriteTokens: Number(usage.cache_creation_input_tokens || 0),
                cacheReadTokens: Number(usage.cache_read_input_tokens || 0),
                outputTokens: Number(usage.output_tokens || 0),
            }),
        };
        const text = extractAnthropicText(payload);
        if (payload.stop_reason === "refusal" || payload.stop_reason === "max_tokens" || !text) {
            throw new AiProviderError("AI_PROVIDER_INVALID_RESPONSE", "Anthropic returned an incomplete structured result", {
                provider: "Anthropic",
                actualCostUsd: usageRecord.costUsd,
                usage: [{ phase: "editorial", provider: "Anthropic", ...usageRecord }],
            });
        }
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            throw new AiProviderError("AI_PROVIDER_INVALID_RESPONSE", "Anthropic returned invalid structured output", {
                provider: "Anthropic",
                actualCostUsd: usageRecord.costUsd,
                usage: [{ phase: "editorial", provider: "Anthropic", ...usageRecord }],
            });
        }
        return { data, usage: usageRecord };
    } catch (error) {
        if (error instanceof AiProviderError) throw error;
        if (error?.name === "AbortError") {
            throw new AiProviderError("AI_PROVIDER_TIMEOUT", "Anthropic request timed out", { provider: "Anthropic" });
        }
        throw new AiProviderError("AI_PROVIDER_UNAVAILABLE", String(error?.message || error).slice(0, 300), { provider: "Anthropic" });
    } finally {
        clearTimeout(timeout);
    }
};

const clippedText = (value, fallback, maxLength = 1200) => {
    const text = String(value || "").replace(/\s+/gu, " ").trim();
    if (!text) return fallback;
    return text.slice(0, maxLength);
};

const clippedList = (items, maxItems = 10) => Array.isArray(items)
    ? items.map((item) => clippedText(item, "", 800)).filter(Boolean).slice(0, maxItems)
    : [];

const safeSources = (sources) => Array.isArray(sources) ? sources.flatMap((source) => {
    try {
        const url = new URL(String(source?.url || ""));
        if (url.protocol !== "https:") return [];
        return [{
            title: clippedText(source.title, url.hostname, 300),
            url: url.toString(),
            note: clippedText(source.note, "Zur fachlichen Prüfung", 600),
        }];
    } catch {
        return [];
    }
}).slice(0, 10) : [];

const normalizedResult = ({ workflowId, pilotWeek, pilotWeeks, result }) => {
    const common = {
        title: clippedText(result?.title, workflowId === "pilot-week-learning" ? "Interne Pilot-Auswertung" : "Interner 12-Wochen-Arbeitsentwurf"),
        executiveSummary: clippedText(result?.executiveSummary, "Der KI-Arbeitsstand wartet auf menschliche Prüfung.", 2000),
        signals: clippedList(result?.signals),
        recommendedAdjustments: clippedList(result?.recommendedAdjustments),
        contentIdeas: clippedList(result?.contentIdeas),
        reviewNotes: clippedList(result?.reviewNotes),
        openDecisions: clippedList(result?.openDecisions),
        sources: safeSources(result?.sources),
        externalActions: [],
    };

    if (workflowId === "pilot-week-learning") {
        return {
            ...common,
            programBlueprint: [],
            sourceWeeks: [pilotWeek.weekNumber],
        };
    }

    const recordedWeeks = new Set(pilotWeeks.map((week) => Number(week.weekNumber)));
    const generatedWeeks = new Map((Array.isArray(result?.programBlueprint) ? result.programBlueprint : [])
        .map((week) => [Number(week.weekNumber), week]));
    const programBlueprint = Array.from({ length: 12 }, (_item, index) => {
        const weekNumber = index + 1;
        const generated = generatedWeeks.get(weekNumber) || {};
        const sourceStatus = weekNumber > 8 ? "hypothesis" : recordedWeeks.has(weekNumber) ? "pilot-data" : "missing";
        return {
            weekNumber,
            title: clippedText(generated.title, `Woche ${weekNumber}`),
            basis: clippedText(generated.basis, sourceStatus === "missing"
                ? "Für diese Pilotwoche liegen noch keine anonymisierten Angaben vor."
                : "Interner Arbeitsstand zur fachlichen Prüfung."),
            sourceStatus,
        };
    });
    return {
        ...common,
        programBlueprint,
        sourceWeeks: [...recordedWeeks].sort((left, right) => left - right),
    };
};

const completedSteps = ({ workflow, draft, editorial = null, review, config }) => {
    const summaries = new Map([
        ...(draft.stepSummaries || []).map((item) => [item.agentId, item.summary]),
        ...(editorial?.stepSummaries || []).map((item) => [item.agentId, item.summary]),
        ...(review.stepSummaries || []).map((item) => [item.agentId, item.summary]),
    ]);
    return workflow.steps.map((agentId, index) => {
        const isReview = reviewAgentIds.has(agentId);
        const isAnthropicEditorial = editorialAgentIds.has(agentId) && Boolean(editorial);
        const provider = isReview
            ? `OpenAI · ${config.reviewModel}`
            : isAnthropicEditorial
                ? `Anthropic · ${config.editorialModel}`
                : `OpenAI · ${config.routineModel}`;
        return {
            id: `step-${index + 1}`,
            agentId,
            agentName: agentMap.get(agentId)?.name || agentId,
            provider,
            status: "completed",
            inputFrom: index === 0 ? [] : [`step-${index}`],
            summary: clippedText(summaries.get(agentId), "KI-Arbeitsschritt abgeschlossen.", 800),
        };
    });
};

export const runLiveWorkflow = async ({
    workflowId,
    pilotWeek = null,
    pilotWeeks = [],
    estimatedCostUsd,
    fetchImpl = globalThis.fetch,
}) => {
    const config = getAiRuntimeConfig();
    if (config.mode !== "live" || !config.apiKeyConfigured) {
        throw new AiProviderError("AI_NOT_CONFIGURED", "Live AI is not configured");
    }
    const workflow = workflowMap.get(workflowId);
    if (!workflow) throw new AiProviderError("AI_WORKFLOW_UNKNOWN", `Unknown workflow: ${workflowId}`);
    const useAnthropicEditorial = config.anthropicReady
        && workflow.steps.some((agentId) => editorialAgentIds.has(agentId));
    const draftAgentIds = workflow.steps.filter((agentId) => !reviewAgentIds.has(agentId)
        && (!useAnthropicEditorial || !editorialAgentIds.has(agentId)));
    const editorialAgentIdsForWorkflow = useAnthropicEditorial
        ? workflow.steps.filter((agentId) => editorialAgentIds.has(agentId))
        : [];
    const reviewAgentIdsForWorkflow = workflow.steps.filter((agentId) => reviewAgentIds.has(agentId));
    const source = sourcePayload({ workflowId, pilotWeek, pilotWeeks });
    const draft = await requestOpenAi({
        apiKey: process.env.OPENAI_API_KEY,
        model: config.routineModel,
        instructions: `${commonInstructions}\nErstelle den ersten Arbeitsentwurf für die Rollen ${draftAgentIds.join(", ")}.`,
        input: JSON.stringify({ workflow: workflow.name, source }),
        schema: responseSchema(draftAgentIds),
        maxOutputTokens: 3200,
        fetchImpl,
    });
    let editorial = null;
    if (useAnthropicEditorial) {
        try {
            editorial = await requestAnthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
                model: config.editorialModel,
                instructions: `${commonInstructions}\nBearbeite ausschließlich Langform, Lehrlogik und Erzählbogen für die Rollen ${editorialAgentIdsForWorkflow.join(", ")}.
Erhalte die dokumentierte Bedeutung. Erfinde keine Geschichten über reale Teilnehmende. Formuliere längere Texte als interne Entwürfe und kennzeichne fachlich zu prüfende Aussagen.`,
                input: JSON.stringify({ workflow: workflow.name, source, draft: draft.data }),
                schema: responseSchema(editorialAgentIdsForWorkflow),
                maxOutputTokens: 6000,
                fetchImpl,
            });
        } catch (error) {
            const partialUsage = Array.isArray(error?.usage) ? error.usage : [];
            error.actualCostUsd = roundCost(draft.usage.costUsd + Number(error?.actualCostUsd || 0));
            error.usage = [
                { phase: "draft", provider: "OpenAI", ...draft.usage },
                ...partialUsage,
            ];
            throw error;
        }
    }
    let review;
    try {
        review = await requestOpenAi({
            apiKey: process.env.OPENAI_API_KEY,
            model: config.reviewModel,
            instructions: `${commonInstructions}\nPrüfe den OpenAI-Erstentwurf und einen vorhandenen Claude-Langformentwurf unabhängig für die Rollen ${reviewAgentIdsForWorkflow.join(", ")}.
Übernimm aus dem Claude-Entwurf nur Inhalte, die durch die Quellenbasis getragen und für den internen Arbeitsstand geeignet sind.
Nutze höchstens zwei Websuchen und nur für allgemeine fachliche Aussagen. Sende niemals Pilotdaten, Teilnehmerzahlen oder Beobachtungen als Suchanfrage. Quellen müssen direkt zur geprüften Aussage passen.`,
            input: JSON.stringify({
                workflow: workflow.name,
                source,
                draft: draft.data,
                editorial: editorial?.data || null,
            }),
            schema: responseSchema(reviewAgentIdsForWorkflow),
            maxOutputTokens: 4800,
            webSearchEnabled: config.webSearchEnabled,
            fetchImpl,
        });
    } catch (error) {
        const editorialCostUsd = Number(editorial?.usage?.costUsd || 0);
        error.actualCostUsd = roundCost(draft.usage.costUsd + editorialCostUsd);
        error.usage = [
            { phase: "draft", provider: "OpenAI", ...draft.usage },
            ...(editorial ? [{ phase: "editorial", provider: "Anthropic", ...editorial.usage }] : []),
        ];
        throw error;
    }
    const usage = [
        { phase: "draft", provider: "OpenAI", ...draft.usage },
        ...(editorial ? [{ phase: "editorial", provider: "Anthropic", ...editorial.usage }] : []),
        { phase: "review", provider: "OpenAI", ...review.usage },
    ];
    const actualCostUsd = roundCost(usage.reduce((total, item) => total + item.costUsd, 0));
    return {
        workflowId,
        workflowName: workflow.name,
        mode: "live",
        status: "completed",
        estimatedCostUsd,
        actualCostUsd,
        approvalStatus: "pending",
        steps: completedSteps({
            workflow,
            draft: draft.data,
            editorial: editorial?.data || null,
            review: review.data,
            config,
        }),
        result: normalizedResult({
            workflowId,
            pilotWeek,
            pilotWeeks,
            result: { ...review.data.result, sources: review.sources },
        }),
        usage,
    };
};
