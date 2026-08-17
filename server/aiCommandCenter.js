import { database } from "./database.js";
import {
    aiAgentRegistry,
    aiWorkflowRegistry,
    buildMockWorkflowRun,
} from "./aiCommandCenterEngine.js";
import {
    estimateLiveWorkflowCostUsd,
    generateOpenAiImageDraft,
    getAiRuntimeConfig,
    runLiveWorkflow,
} from "./openAiCommandCenter.js";

export class AiCommandCenterExecutionError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = "AiCommandCenterExecutionError";
        this.code = code;
        Object.assign(this, details);
    }
}

const parseJson = (value, fallback) => {
    try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return parsed ?? fallback;
    } catch {
        return fallback;
    }
};

const toIsoString = (value) => value ? new Date(value).toISOString() : null;

const mapPilotWeek = (row) => ({
    id: Number(row.id),
    weekNumber: Number(row.week_number),
    participantCount: Number(row.participant_count),
    plannedFocus: row.planned_focus,
    actualFocus: row.actual_focus,
    commonQuestions: row.common_questions || "",
    helpfulExercises: row.helpful_exercises || "",
    challenges: row.challenges || "",
    observedChanges: row.observed_changes || "",
    professionalInsights: row.professional_insights || "",
    nextAdjustments: row.next_adjustments || "",
    anonymizationConfirmed: Boolean(row.anonymization_confirmed),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
});

const mapRun = (row) => ({
    id: Number(row.id),
    workflowId: row.workflow_id,
    workflowName: row.workflow_name,
    mode: row.execution_mode,
    status: row.status,
    sourcePilotWeekId: row.source_pilot_week_id ? Number(row.source_pilot_week_id) : null,
    steps: parseJson(row.steps_json, []),
    result: parseJson(row.result_json, {}),
    usage: parseJson(row.usage_json, []),
    estimatedCostUsd: Number(row.estimated_cost_usd),
    actualCostUsd: Number(row.actual_cost_usd),
    approvalStatus: row.approval_status,
    decisionNote: row.decision_note || "",
    errorMessage: row.error_message || "",
    decidedAt: toIsoString(row.decided_at),
    decidedBy: row.decided_by_name || "",
    createdAt: toIsoString(row.created_at),
    completedAt: toIsoString(row.completed_at),
});

const mapAsset = (row) => ({
    id: Number(row.id),
    sourceRunId: Number(row.source_run_id),
    briefIndex: Number(row.brief_index),
    provider: row.provider,
    model: row.model,
    mimeType: row.mime_type,
    size: row.image_size,
    quality: row.image_quality,
    status: row.status,
    estimatedCostUsd: Number(row.estimated_cost_usd),
    actualCostUsd: Number(row.actual_cost_usd),
    errorMessage: row.error_message || "",
    createdAt: toIsoString(row.created_at),
    completedAt: toIsoString(row.completed_at),
    imageUrl: row.status === "completed" ? `/api/admin/ai-command-center/assets/${row.id}/image` : "",
});

const getPilotWeeks = async () => {
    const [rows] = await database.execute(
        `SELECT id, week_number, participant_count, planned_focus, actual_focus,
                common_questions, helpful_exercises, challenges, observed_changes,
                professional_insights, next_adjustments, anonymization_confirmed,
                created_at, updated_at
         FROM ai_pilot_weeks
         ORDER BY week_number`,
    );
    return rows.map(mapPilotWeek);
};

const getRuns = async () => {
    const [rows] = await database.execute(
        `SELECT runs.id, runs.workflow_id, runs.workflow_name, runs.execution_mode,
                runs.status, runs.source_pilot_week_id, runs.steps_json, runs.result_json,
                runs.usage_json, runs.estimated_cost_usd, runs.actual_cost_usd,
                runs.approval_status, runs.decision_note, runs.error_message,
                runs.decided_at, runs.created_at, runs.completed_at,
                members.name AS decided_by_name
         FROM ai_workflow_runs AS runs
         LEFT JOIN members ON members.id = runs.decided_by
         ORDER BY runs.created_at DESC
         LIMIT 30`,
    );
    return rows.map(mapRun);
};

const getAssets = async () => {
    const [rows] = await database.execute(
        `SELECT id, source_run_id, brief_index, provider, model, mime_type, image_size,
                image_quality, status, estimated_cost_usd, actual_cost_usd, error_message,
                created_at, completed_at
         FROM ai_generated_assets
         ORDER BY created_at DESC
         LIMIT 60`,
    );
    return rows.map(mapAsset);
};

const getSettings = async () => {
    const [rows] = await database.execute(
        `SELECT monthly_budget_usd, per_run_budget_usd, external_actions_enabled, updated_at
         FROM ai_command_center_settings WHERE id = 1 LIMIT 1`,
    );
    const settings = rows[0] || {};
    const [costRows] = await database.execute(
        `SELECT
            COALESCE(SUM(actual_cost_usd), 0) AS spent,
            COALESCE(SUM(CASE WHEN status = 'running' THEN estimated_cost_usd ELSE 0 END), 0) AS reserved
         FROM ai_workflow_runs
         WHERE created_at >= DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-01')`,
    );
    const [assetCostRows] = await database.execute(
        `SELECT
            COALESCE(SUM(actual_cost_usd), 0) AS spent,
            COALESCE(SUM(CASE WHEN status = 'running' THEN estimated_cost_usd ELSE 0 END), 0) AS reserved
         FROM ai_generated_assets
         WHERE created_at >= DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-01')`,
    );
    const runtime = getAiRuntimeConfig();
    const monthlyBudgetUsd = Number(settings.monthly_budget_usd ?? 15);
    const spentThisMonthUsd = Number(costRows[0]?.spent || 0) + Number(assetCostRows[0]?.spent || 0);
    const reservedThisMonthUsd = Number(costRows[0]?.reserved || 0) + Number(assetCostRows[0]?.reserved || 0);
    return {
        mode: runtime.mode,
        configurationStatus: runtime.mode === "mock"
            ? "mock"
            : runtime.ready
                ? "ready"
                : !runtime.apiKeyConfigured
                    ? "missing_openai_key"
                    : "missing_anthropic_key",
        provider: runtime.provider,
        routineModel: runtime.routineModel,
        reviewModel: runtime.reviewModel,
        editorialModel: runtime.editorialModel,
        editorialProvider: runtime.editorialProvider,
        anthropicEnabled: runtime.anthropicEnabled,
        anthropicConfigured: runtime.anthropicApiKeyConfigured,
        canvaWorkflowMode: runtime.canvaWorkflowMode,
        imageGenerationEnabled: runtime.imageGenerationEnabled,
        imageGenerationReady: runtime.imageGenerationReady,
        imageModel: runtime.imageModel,
        imageSize: runtime.imageSize,
        imageDraftQuality: runtime.imageDraftQuality,
        imageFinalQuality: runtime.imageFinalQuality,
        imageDraftOutputCostUsd: runtime.imageDraftOutputCostUsd,
        imageFinalOutputCostUsd: runtime.imageFinalOutputCostUsd,
        creativeWorkflowMode: runtime.creativeWorkflowMode,
        webSearchEnabled: runtime.webSearchEnabled,
        monthlyBudgetUsd,
        perRunBudgetUsd: Number(settings.per_run_budget_usd ?? 2),
        spentThisMonthUsd,
        reservedThisMonthUsd,
        remainingThisMonthUsd: Math.max(0, Math.round((monthlyBudgetUsd - spentThisMonthUsd - reservedThisMonthUsd) * 10000) / 10000),
        typicalRunCostUsd: { min: 0.05, max: runtime.anthropicReady ? 0.7 : 0.5 },
        externalActionsEnabled: false,
        updatedAt: toIsoString(settings.updated_at),
    };
};

export const getAiCommandCenterSnapshot = async () => {
    const [pilotWeeks, runs, assets, settings] = await Promise.all([
        getPilotWeeks(),
        getRuns(),
        getAssets(),
        getSettings(),
    ]);
    return {
        agents: aiAgentRegistry,
        workflows: aiWorkflowRegistry,
        settings,
        pilotWeeks,
        runs,
        assets,
    };
};

const insertMockRun = async ({ workflowRun, sourcePilotWeekId = null, input, memberId }) => {
    const [result] = await database.execute(
        `INSERT INTO ai_workflow_runs (
            workflow_id, workflow_name, execution_mode, status, source_pilot_week_id,
            input_json, steps_json, result_json, usage_json, estimated_cost_usd, actual_cost_usd,
            approval_status, created_by, completed_at
         ) VALUES (?, ?, 'mock', 'completed', ?, ?, ?, ?, '[]', 0, 0, 'pending', ?, UTC_TIMESTAMP())`,
        [
            workflowRun.workflowId,
            workflowRun.workflowName,
            sourcePilotWeekId,
            JSON.stringify(input),
            JSON.stringify(workflowRun.steps),
            JSON.stringify(workflowRun.result),
            memberId,
        ],
    );
    return Number(result.insertId);
};

const reserveLiveRun = async ({ workflow, sourcePilotWeekId, input, estimatedCostUsd, memberId }) => {
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        const [settingsRows] = await connection.execute(
            `SELECT monthly_budget_usd, per_run_budget_usd
             FROM ai_command_center_settings WHERE id = 1 FOR UPDATE`,
        );
        const settings = settingsRows[0] || {};
        const perRunBudgetUsd = Number(settings.per_run_budget_usd ?? 0);
        const monthlyBudgetUsd = Number(settings.monthly_budget_usd ?? 0);
        if (estimatedCostUsd > perRunBudgetUsd) {
            throw new AiCommandCenterExecutionError("AI_RUN_BUDGET_EXCEEDED", "Estimated run cost exceeds the per-run budget", {
                estimatedCostUsd,
                budgetUsd: perRunBudgetUsd,
            });
        }
        const [costRows] = await connection.execute(
            `SELECT COALESCE(SUM(
                CASE WHEN status = 'running' THEN estimated_cost_usd ELSE actual_cost_usd END
             ), 0) AS committed
             FROM ai_workflow_runs
             WHERE created_at >= DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-01')`,
        );
        const committed = Number(costRows[0]?.committed || 0);
        const [assetCostRows] = await connection.execute(
            `SELECT COALESCE(SUM(
                CASE WHEN status = 'running' THEN estimated_cost_usd ELSE actual_cost_usd END
             ), 0) AS committed
             FROM ai_generated_assets
             WHERE created_at >= DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-01')`,
        );
        const totalCommitted = committed + Number(assetCostRows[0]?.committed || 0);
        if (totalCommitted + estimatedCostUsd > monthlyBudgetUsd) {
            throw new AiCommandCenterExecutionError("AI_MONTHLY_BUDGET_EXCEEDED", "Estimated run cost exceeds the monthly budget", {
                estimatedCostUsd,
                budgetUsd: monthlyBudgetUsd,
                committedUsd: totalCommitted,
            });
        }
        const [result] = await connection.execute(
            `INSERT INTO ai_workflow_runs (
                workflow_id, workflow_name, execution_mode, status, source_pilot_week_id,
                input_json, steps_json, result_json, usage_json, estimated_cost_usd,
                actual_cost_usd, approval_status, created_by, completed_at
             ) VALUES (?, ?, 'live', 'running', ?, ?, '[]', '{}', '[]', ?, 0, 'pending', ?, UTC_TIMESTAMP())`,
            [workflow.id, workflow.name, sourcePilotWeekId, JSON.stringify(input), estimatedCostUsd, memberId],
        );
        await connection.commit();
        return Number(result.insertId);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const completeLiveRun = async ({ runId, workflowRun }) => {
    await database.execute(
        `UPDATE ai_workflow_runs
         SET status = 'completed', steps_json = ?, result_json = ?, usage_json = ?,
             actual_cost_usd = ?, approval_status = 'pending', error_message = NULL,
             completed_at = UTC_TIMESTAMP()
         WHERE id = ? AND status = 'running'`,
        [
            JSON.stringify(workflowRun.steps),
            JSON.stringify(workflowRun.result),
            JSON.stringify(workflowRun.usage),
            workflowRun.actualCostUsd,
            runId,
        ],
    );
};

const failLiveRun = async ({ runId, error }) => {
    const actualCostUsd = Number(error?.actualCostUsd || 0);
    const usage = Array.isArray(error?.usage) ? error.usage : [];
    await database.execute(
        `UPDATE ai_workflow_runs
         SET status = 'failed', usage_json = ?, actual_cost_usd = ?,
             approval_status = 'not_applicable', error_message = ?, completed_at = UTC_TIMESTAMP()
         WHERE id = ? AND status = 'running'`,
        [JSON.stringify(usage), actualCostUsd, String(error?.message || "AI run failed").slice(0, 500), runId],
    );
};

const executeWorkflow = async ({ workflowId, sourcePilotWeekId = null, pilotWeek = null, pilotWeeks = [], contentBrief = null, memberId }) => {
    const runtime = getAiRuntimeConfig();
    const workflow = aiWorkflowRegistry.find((item) => item.id === workflowId);
    if (!workflow) throw new AiCommandCenterExecutionError("AI_WORKFLOW_UNKNOWN", `Unknown workflow: ${workflowId}`);
    const input = workflowId === "pilot-week-learning"
        ? { pilotWeekId: sourcePilotWeekId, weekNumber: pilotWeek.weekNumber }
        : workflowId === "content-project"
            ? { contentBrief }
            : { pilotWeekIds: pilotWeeks.map((week) => week.id) };

    if (runtime.mode === "mock") {
        const workflowRun = buildMockWorkflowRun({ workflowId, pilotWeek, pilotWeeks, contentBrief });
        return insertMockRun({ workflowRun, sourcePilotWeekId, input, memberId });
    }
    if (!runtime.ready) {
        throw new AiCommandCenterExecutionError("AI_NOT_CONFIGURED", "A required AI provider key is missing");
    }

    const estimatedCostUsd = estimateLiveWorkflowCostUsd({ workflowId, pilotWeek, pilotWeeks, contentBrief });
    const runId = await reserveLiveRun({ workflow, sourcePilotWeekId, input, estimatedCostUsd, memberId });
    try {
        const workflowRun = await runLiveWorkflow({
            workflowId,
            pilotWeek,
            pilotWeeks,
            contentBrief,
            estimatedCostUsd,
        });
        await completeLiveRun({ runId, workflowRun });
        return runId;
    } catch (error) {
        await failLiveRun({ runId, error });
        throw new AiCommandCenterExecutionError(error?.code || "AI_PROVIDER_UNAVAILABLE", error?.message || "AI run failed", {
            runId,
        });
    }
};

const savePilotWeek = async ({ pilotWeek, memberId }) => {
    const [result] = await database.execute(
        `INSERT INTO ai_pilot_weeks (
            week_number, participant_count, planned_focus, actual_focus, common_questions,
            helpful_exercises, challenges, observed_changes, professional_insights,
            next_adjustments, anonymization_confirmed, created_by
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
         ON DUPLICATE KEY UPDATE
            id = LAST_INSERT_ID(id),
            participant_count = VALUES(participant_count),
            planned_focus = VALUES(planned_focus),
            actual_focus = VALUES(actual_focus),
            common_questions = VALUES(common_questions),
            helpful_exercises = VALUES(helpful_exercises),
            challenges = VALUES(challenges),
            observed_changes = VALUES(observed_changes),
            professional_insights = VALUES(professional_insights),
            next_adjustments = VALUES(next_adjustments),
            anonymization_confirmed = 1,
            created_by = VALUES(created_by)`,
        [
            pilotWeek.weekNumber,
            pilotWeek.participantCount,
            pilotWeek.plannedFocus,
            pilotWeek.actualFocus,
            pilotWeek.commonQuestions,
            pilotWeek.helpfulExercises,
            pilotWeek.challenges,
            pilotWeek.observedChanges,
            pilotWeek.professionalInsights,
            pilotWeek.nextAdjustments,
            memberId,
        ],
    );
    return Number(result.insertId);
};

export const savePilotWeekAndRun = async ({ pilotWeek, memberId }) => {
    const pilotWeekId = await savePilotWeek({ pilotWeek, memberId });
    const runId = await executeWorkflow({
        workflowId: "pilot-week-learning",
        sourcePilotWeekId: pilotWeekId,
        pilotWeek: { ...pilotWeek, id: pilotWeekId },
        memberId,
    });
    return { pilotWeekId, runId };
};

export const startAiWorkflow = async ({ workflowId, contentBrief = null, memberId }) => {
    if (workflowId === "content-project") {
        return executeWorkflow({ workflowId, contentBrief, memberId });
    }
    const pilotWeeks = await getPilotWeeks();
    if (pilotWeeks.length === 0) {
        const error = new AiCommandCenterExecutionError("PILOT_WEEKS_REQUIRED", "Pilot weeks are required");
        throw error;
    }
    return executeWorkflow({ workflowId, pilotWeeks, memberId });
};

export const createAiImageDraft = async ({ sourceRunId, briefIndex, memberId }) => {
    const runtime = getAiRuntimeConfig();
    if (!runtime.imageGenerationReady) {
        throw new AiCommandCenterExecutionError("AI_IMAGE_NOT_CONFIGURED", "Image generation is not configured");
    }
    const connection = await database.getConnection();
    let assetId;
    let prompt;
    const estimatedCostUsd = runtime.imageDraftOutputCostUsd;
    try {
        await connection.beginTransaction();
        const [runRows] = await connection.execute(
            `SELECT workflow_id, status, approval_status, result_json
             FROM ai_workflow_runs WHERE id = ? FOR UPDATE`,
            [sourceRunId],
        );
        const run = runRows[0];
        if (!run || run.workflow_id !== "content-project" || run.status !== "completed") {
            throw new AiCommandCenterExecutionError("AI_CONTENT_RUN_INVALID", "A completed content project is required");
        }
        if (run.approval_status !== "approved") {
            throw new AiCommandCenterExecutionError("AI_CONTENT_APPROVAL_REQUIRED", "The content project must be approved first");
        }
        const result = parseJson(run.result_json, {});
        prompt = result?.contentPackage?.imageBriefs?.[briefIndex]?.prompt;
        if (!prompt) throw new AiCommandCenterExecutionError("AI_IMAGE_BRIEF_MISSING", "Image brief is missing");

        const [settingsRows] = await connection.execute(
            `SELECT monthly_budget_usd, per_run_budget_usd
             FROM ai_command_center_settings WHERE id = 1 FOR UPDATE`,
        );
        const settings = settingsRows[0] || {};
        if (estimatedCostUsd > Number(settings.per_run_budget_usd || 0)) {
            throw new AiCommandCenterExecutionError("AI_RUN_BUDGET_EXCEEDED", "Estimated image cost exceeds the per-run budget");
        }
        const [runCostRows] = await connection.execute(
            `SELECT COALESCE(SUM(CASE WHEN status = 'running' THEN estimated_cost_usd ELSE actual_cost_usd END), 0) AS committed
             FROM ai_workflow_runs WHERE created_at >= DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-01')`,
        );
        const [assetCostRows] = await connection.execute(
            `SELECT COALESCE(SUM(CASE WHEN status = 'running' THEN estimated_cost_usd ELSE actual_cost_usd END), 0) AS committed
             FROM ai_generated_assets WHERE created_at >= DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-01')`,
        );
        const committed = Number(runCostRows[0]?.committed || 0) + Number(assetCostRows[0]?.committed || 0);
        if (committed + estimatedCostUsd > Number(settings.monthly_budget_usd || 0)) {
            throw new AiCommandCenterExecutionError("AI_MONTHLY_BUDGET_EXCEEDED", "Estimated image cost exceeds the monthly budget");
        }
        const [insertResult] = await connection.execute(
            `INSERT INTO ai_generated_assets (
                source_run_id, brief_index, model, prompt, image_size, image_quality,
                status, estimated_cost_usd, created_by
             ) VALUES (?, ?, ?, ?, ?, ?, 'running', ?, ?)`,
            [sourceRunId, briefIndex, runtime.imageModel, prompt, runtime.imageSize, runtime.imageDraftQuality, estimatedCostUsd, memberId],
        );
        assetId = Number(insertResult.insertId);
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    try {
        const generated = await generateOpenAiImageDraft({ prompt });
        await database.execute(
            `UPDATE ai_generated_assets
             SET status = 'completed', image_data = ?, mime_type = ?, model = ?, image_size = ?,
                 image_quality = ?, actual_cost_usd = ?, completed_at = UTC_TIMESTAMP()
             WHERE id = ? AND status = 'running'`,
            [generated.image, generated.mimeType, generated.model, generated.size, generated.quality, generated.costUsd, assetId],
        );
        return assetId;
    } catch (error) {
        await database.execute(
            `UPDATE ai_generated_assets
             SET status = 'failed', error_message = ?, completed_at = UTC_TIMESTAMP()
             WHERE id = ? AND status = 'running'`,
            [String(error?.message || "Image generation failed").slice(0, 500), assetId],
        );
        throw new AiCommandCenterExecutionError(error?.code || "AI_PROVIDER_UNAVAILABLE", error?.message || "Image generation failed", { assetId });
    }
};

export const getAiGeneratedAssetImage = async ({ assetId }) => {
    const [rows] = await database.execute(
        `SELECT mime_type, image_data FROM ai_generated_assets WHERE id = ? AND status = 'completed' LIMIT 1`,
        [assetId],
    );
    if (!rows[0]?.image_data) return null;
    return { mimeType: rows[0].mime_type, image: rows[0].image_data };
};

export const decideAiWorkflowRun = async ({ runId, approved, note, memberId }) => {
    const [result] = await database.execute(
        `UPDATE ai_workflow_runs
         SET approval_status = ?, decision_note = ?, decided_by = ?, decided_at = UTC_TIMESTAMP()
         WHERE id = ? AND status = 'completed' AND approval_status = 'pending'`,
        [approved ? "approved" : "rejected", note || null, memberId, runId],
    );
    return result.affectedRows > 0;
};

export const saveAiBudgetSettings = async ({ monthlyBudgetUsd, perRunBudgetUsd, memberId }) => {
    await database.execute(
        `UPDATE ai_command_center_settings
         SET monthly_budget_usd = ?, per_run_budget_usd = ?,
             external_actions_enabled = 0, updated_by = ?
         WHERE id = 1`,
        [monthlyBudgetUsd, perRunBudgetUsd, memberId],
    );
};
