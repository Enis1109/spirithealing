import {
    aiAgentRegistry,
    aiWorkflowRegistry,
} from "./aiCommandCenterEngine.js";

const modelPricesUsdPerMillion = {
    "gpt-5.6-luna": { input: 0.2, cachedInput: 0.02, output: 1.2 },
    "gpt-5.6-terra": { input: 2, cachedInput: 0.2, output: 12 },
    "gpt-5.6-sol": { input: 5, cachedInput: 0.5, output: 30 },
};

const webSearchPriceUsd = 0.01;
const reviewAgentIds = new Set([
    "research-fact-check",
    "compliance-privacy",
    "independent-review",
    "quality-controller",
]);

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

const knownModel = (value, fallback) => {
    const model = String(value || fallback).trim();
    if (!modelPricesUsdPerMillion[model]) {
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
    const apiKeyConfigured = Boolean(String(process.env.OPENAI_API_KEY || "").trim());
    return {
        mode,
        provider: "OpenAI",
        routineModel,
        reviewModel,
        apiKeyConfigured,
        ready: mode === "mock" || apiKeyConfigured,
        webSearchEnabled: String(process.env.AI_COMMAND_CENTER_WEB_SEARCH ?? "true") !== "false",
    };
};

const pricingForModel = (model) => {
    const alias = Object.keys(modelPricesUsdPerMillion).find((name) => model === name || model.startsWith(`${name}-`));
    if (!alias) throw new AiProviderError("AI_MODEL_NOT_PRICED", `Missing price for model: ${model}`);
    return modelPricesUsdPerMillion[alias];
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

const estimatedTokens = (text) => Math.max(1, Math.ceil(String(text || "").length / 3));

const estimateCallCost = ({ model, inputText, maxOutputTokens, webSearchCalls = 0 }) => calculateOpenAiCostUsd({
    model,
    inputTokens: estimatedTokens(inputText),
    outputTokens: maxOutputTokens,
    webSearchCalls,
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
    const reviewInput = `${source}\n${"x".repeat(draftMaxOutputTokens * 3)}`;
    const reviewCost = estimateCallCost({
        model: config.reviewModel,
        inputText: reviewInput,
        maxOutputTokens: reviewMaxOutputTokens,
        webSearchCalls: config.webSearchEnabled ? 2 : 0,
    });
    return Math.max(0.05, roundCost((draftCost + reviewCost) * 1.25));
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

const completedSteps = ({ workflow, draft, review, config }) => {
    const summaries = new Map([
        ...(draft.stepSummaries || []).map((item) => [item.agentId, item.summary]),
        ...(review.stepSummaries || []).map((item) => [item.agentId, item.summary]),
    ]);
    return workflow.steps.map((agentId, index) => {
        const isReview = reviewAgentIds.has(agentId);
        const model = isReview ? config.reviewModel : config.routineModel;
        return {
            id: `step-${index + 1}`,
            agentId,
            agentName: agentMap.get(agentId)?.name || agentId,
            provider: `OpenAI · ${model}`,
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
    const draftAgentIds = workflow.steps.filter((agentId) => !reviewAgentIds.has(agentId));
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
    let review;
    try {
        review = await requestOpenAi({
            apiKey: process.env.OPENAI_API_KEY,
            model: config.reviewModel,
            instructions: `${commonInstructions}\nPrüfe den Entwurf unabhängig für die Rollen ${reviewAgentIdsForWorkflow.join(", ")}.
Nutze höchstens zwei Websuchen und nur für allgemeine fachliche Aussagen. Sende niemals Pilotdaten, Teilnehmerzahlen oder Beobachtungen als Suchanfrage. Quellen müssen direkt zur geprüften Aussage passen.`,
            input: JSON.stringify({ workflow: workflow.name, source, draft: draft.data }),
            schema: responseSchema(reviewAgentIdsForWorkflow),
            maxOutputTokens: 4800,
            webSearchEnabled: config.webSearchEnabled,
            fetchImpl,
        });
    } catch (error) {
        error.actualCostUsd = draft.usage.costUsd;
        error.usage = [{ phase: "draft", ...draft.usage }];
        throw error;
    }
    const usage = [
        { phase: "draft", ...draft.usage },
        { phase: "review", ...review.usage },
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
        steps: completedSteps({ workflow, draft: draft.data, review: review.data, config }),
        result: normalizedResult({
            workflowId,
            pilotWeek,
            pilotWeeks,
            result: { ...review.data.result, sources: review.sources },
        }),
        usage,
    };
};
