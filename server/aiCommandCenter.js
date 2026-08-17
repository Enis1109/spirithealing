import { database } from "./database.js";
import {
    aiAgentRegistry,
    aiWorkflowRegistry,
    buildMockWorkflowRun,
} from "./aiCommandCenterEngine.js";

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
    estimatedCostUsd: Number(row.estimated_cost_usd),
    actualCostUsd: Number(row.actual_cost_usd),
    approvalStatus: row.approval_status,
    decisionNote: row.decision_note || "",
    decidedAt: toIsoString(row.decided_at),
    decidedBy: row.decided_by_name || "",
    createdAt: toIsoString(row.created_at),
    completedAt: toIsoString(row.completed_at),
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
                runs.estimated_cost_usd, runs.actual_cost_usd, runs.approval_status,
                runs.decision_note, runs.decided_at, runs.created_at, runs.completed_at,
                members.name AS decided_by_name
         FROM ai_workflow_runs AS runs
         LEFT JOIN members ON members.id = runs.decided_by
         ORDER BY runs.created_at DESC
         LIMIT 30`,
    );
    return rows.map(mapRun);
};

const getSettings = async () => {
    const [rows] = await database.execute(
        `SELECT monthly_budget_usd, per_run_budget_usd, external_actions_enabled, updated_at
         FROM ai_command_center_settings WHERE id = 1 LIMIT 1`,
    );
    const settings = rows[0] || {};
    const [costRows] = await database.execute(
        `SELECT COALESCE(SUM(actual_cost_usd), 0) AS spent
         FROM ai_workflow_runs
         WHERE created_at >= DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-01')`,
    );
    return {
        mode: "mock",
        monthlyBudgetUsd: Number(settings.monthly_budget_usd || 15),
        perRunBudgetUsd: Number(settings.per_run_budget_usd || 2),
        spentThisMonthUsd: Number(costRows[0]?.spent || 0),
        externalActionsEnabled: false,
        updatedAt: toIsoString(settings.updated_at),
    };
};

export const getAiCommandCenterSnapshot = async () => {
    const [pilotWeeks, runs, settings] = await Promise.all([
        getPilotWeeks(),
        getRuns(),
        getSettings(),
    ]);
    return {
        agents: aiAgentRegistry,
        workflows: aiWorkflowRegistry,
        settings,
        pilotWeeks,
        runs,
    };
};

const insertRun = async ({ workflowRun, sourcePilotWeekId = null, input, memberId, executor = database }) => {
    const [result] = await executor.execute(
        `INSERT INTO ai_workflow_runs (
            workflow_id, workflow_name, execution_mode, status, source_pilot_week_id,
            input_json, steps_json, result_json, estimated_cost_usd, actual_cost_usd,
            approval_status, created_by, completed_at
         ) VALUES (?, ?, 'mock', 'completed', ?, ?, ?, ?, 0, 0, 'pending', ?, UTC_TIMESTAMP())`,
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

export const savePilotWeekAndRun = async ({ pilotWeek, memberId }) => {
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.execute(
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
        const pilotWeekId = Number(result.insertId);
        const workflowRun = buildMockWorkflowRun({ workflowId: "pilot-week-learning", pilotWeek });
        const runId = await insertRun({
            workflowRun,
            sourcePilotWeekId: pilotWeekId,
            input: { pilotWeekId, weekNumber: pilotWeek.weekNumber },
            memberId,
            executor: connection,
        });
        await connection.commit();
        return { pilotWeekId, runId };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const startAiWorkflow = async ({ workflowId, memberId }) => {
    const pilotWeeks = await getPilotWeeks();
    if (pilotWeeks.length === 0) {
        const error = new Error("Pilot weeks are required");
        error.code = "PILOT_WEEKS_REQUIRED";
        throw error;
    }
    const workflowRun = buildMockWorkflowRun({ workflowId, pilotWeeks });
    return insertRun({
        workflowRun,
        input: { pilotWeekIds: pilotWeeks.map((week) => week.id) },
        memberId,
    });
};

export const decideAiWorkflowRun = async ({ runId, approved, note, memberId }) => {
    const [result] = await database.execute(
        `UPDATE ai_workflow_runs
         SET approval_status = ?, decision_note = ?, decided_by = ?, decided_at = UTC_TIMESTAMP()
         WHERE id = ? AND approval_status = 'pending'`,
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
