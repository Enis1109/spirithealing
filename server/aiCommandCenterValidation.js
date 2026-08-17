const workflowIds = new Set(["core-product-development"]);

const directIdentifierPatterns = [
    { type: "email", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu },
    { type: "iban", pattern: /\b[A-Z]{2}\s?\d{2}(?:\s?[A-Z0-9]){11,30}\b/iu },
    { type: "phone", pattern: /(?:(?:\+|00)\d{1,3}[\s()./-]*(?:\d[\s()./-]*){7,14}|\b0\d{2,4}[\s/-]+(?:\d[\s/-]*){6,10})\b/u },
];

export class AiCommandCenterValidationError extends Error {
    constructor(field, reason = "invalid") {
        super(`${field}:${reason}`);
        this.name = "AiCommandCenterValidationError";
        this.field = field;
        this.reason = reason;
    }
}

const textValue = (value, field, { required = false, maxLength = 8000 } = {}) => {
    const normalized = String(value || "").trim();
    if (required && !normalized) throw new AiCommandCenterValidationError(field, "required");
    if (normalized.length > maxLength) throw new AiCommandCenterValidationError(field, "too_long");
    return normalized;
};

const assertAnonymized = (fields) => {
    for (const [field, value] of Object.entries(fields)) {
        const match = directIdentifierPatterns.find(({ pattern }) => pattern.test(value));
        if (match) throw new AiCommandCenterValidationError(field, `personal_data_${match.type}`);
    }
};

export const normalizePilotWeek = (body = {}) => {
    const weekNumber = Number(body.weekNumber);
    const participantCount = Number(body.participantCount);
    if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 8) {
        throw new AiCommandCenterValidationError("weekNumber");
    }
    if (!Number.isInteger(participantCount) || participantCount < 1 || participantCount > 500) {
        throw new AiCommandCenterValidationError("participantCount");
    }
    if (body.anonymizationConfirmed !== true) {
        throw new AiCommandCenterValidationError("anonymizationConfirmed", "required");
    }

    const textFields = {
        plannedFocus: textValue(body.plannedFocus, "plannedFocus", { required: true, maxLength: 800 }),
        actualFocus: textValue(body.actualFocus, "actualFocus", { required: true, maxLength: 800 }),
        commonQuestions: textValue(body.commonQuestions, "commonQuestions"),
        helpfulExercises: textValue(body.helpfulExercises, "helpfulExercises"),
        challenges: textValue(body.challenges, "challenges"),
        observedChanges: textValue(body.observedChanges, "observedChanges"),
        professionalInsights: textValue(body.professionalInsights, "professionalInsights"),
        nextAdjustments: textValue(body.nextAdjustments, "nextAdjustments"),
    };
    if (Object.values(textFields).reduce((total, value) => total + value.length, 0) > 30000) {
        throw new AiCommandCenterValidationError("form", "too_long");
    }
    assertAnonymized(textFields);

    return {
        weekNumber,
        participantCount,
        ...textFields,
        anonymizationConfirmed: true,
    };
};

export const normalizeWorkflowRequest = (body = {}) => {
    const workflowId = String(body.workflowId || "").trim().toLowerCase();
    if (!workflowIds.has(workflowId)) throw new AiCommandCenterValidationError("workflowId");
    return { workflowId };
};

export const normalizeRunDecision = (body = {}) => {
    if (typeof body.approved !== "boolean") throw new AiCommandCenterValidationError("approved");
    const note = textValue(body.note, "note", { required: !body.approved, maxLength: 2000 });
    return { approved: body.approved, note };
};

export const normalizeBudgetSettings = (body = {}) => {
    const monthlyBudgetUsd = Number(body.monthlyBudgetUsd);
    const perRunBudgetUsd = Number(body.perRunBudgetUsd);
    if (!Number.isFinite(monthlyBudgetUsd) || monthlyBudgetUsd < 0 || monthlyBudgetUsd > 5000) {
        throw new AiCommandCenterValidationError("monthlyBudgetUsd");
    }
    if (!Number.isFinite(perRunBudgetUsd) || perRunBudgetUsd < 0 || perRunBudgetUsd > 500) {
        throw new AiCommandCenterValidationError("perRunBudgetUsd");
    }
    if (perRunBudgetUsd > monthlyBudgetUsd) {
        throw new AiCommandCenterValidationError("perRunBudgetUsd", "exceeds_monthly_budget");
    }
    return {
        monthlyBudgetUsd: Math.round(monthlyBudgetUsd * 100) / 100,
        perRunBudgetUsd: Math.round(perRunBudgetUsd * 100) / 100,
    };
};
