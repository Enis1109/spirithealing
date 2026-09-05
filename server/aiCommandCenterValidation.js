const workflowIds = new Set(["core-product-development", "content-project", "team-meeting"]);
const contentChannels = new Set(["instagram", "facebook", "linkedin", "newsletter", "blog"]);
const knowledgeCategories = new Set(["unternehmen", "marke", "angebote", "zielgruppen", "prozesse", "kennzahlen", "termine"]);

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
    if (workflowId === "team-meeting") {
        if (body.anonymizationConfirmed !== true) {
            throw new AiCommandCenterValidationError("anonymizationConfirmed", "required");
        }
        const teamMeeting = {
            meetingDate: textValue(body.meetingDate, "meetingDate", { required: true, maxLength: 10 }),
            dayPriorities: textValue(body.dayPriorities, "dayPriorities", { required: true, maxLength: 6000 }),
            weekPriorities: textValue(body.weekPriorities, "weekPriorities", { maxLength: 6000 }),
            monthPriorities: textValue(body.monthPriorities, "monthPriorities", { maxLength: 6000 }),
            currentSignals: textValue(body.currentSignals, "currentSignals", { maxLength: 6000 }),
            openDecisions: textValue(body.openDecisions, "openDecisions", { maxLength: 6000 }),
            constraints: textValue(body.constraints, "constraints", { maxLength: 6000 }),
            anonymizationConfirmed: true,
        };
        if (!/^\d{4}-\d{2}-\d{2}$/u.test(teamMeeting.meetingDate)) {
            throw new AiCommandCenterValidationError("meetingDate");
        }
        assertAnonymized(teamMeeting);
        return { workflowId, teamMeeting };
    }
    if (workflowId !== "content-project") return { workflowId };

    if (body.anonymizationConfirmed !== true) {
        throw new AiCommandCenterValidationError("anonymizationConfirmed", "required");
    }
    const channels = [...new Set((Array.isArray(body.channels) ? body.channels : [])
        .map((channel) => String(channel || "").trim().toLowerCase()))];
    if (channels.length < 1 || channels.length > 5 || channels.some((channel) => !contentChannels.has(channel))) {
        throw new AiCommandCenterValidationError("channels");
    }
    const contentBrief = {
        projectName: textValue(body.projectName, "projectName", { required: true, maxLength: 160 }),
        goal: textValue(body.goal, "goal", { required: true, maxLength: 1200 }),
        audience: textValue(body.audience, "audience", { required: true, maxLength: 1200 }),
        coreMessage: textValue(body.coreMessage, "coreMessage", { required: true, maxLength: 2000 }),
        offer: textValue(body.offer, "offer", { maxLength: 1200 }),
        callToAction: textValue(body.callToAction, "callToAction", { required: true, maxLength: 800 }),
        tone: textValue(body.tone, "tone", { required: true, maxLength: 800 }),
        constraints: textValue(body.constraints, "constraints", { maxLength: 2000 }),
        channels,
        anonymizationConfirmed: true,
    };
    assertAnonymized(contentBrief);
    return { workflowId, contentBrief };
};

export const normalizeKnowledgeEntry = (body = {}) => {
    const category = String(body.category || "").trim().toLowerCase();
    if (!knowledgeCategories.has(category)) throw new AiCommandCenterValidationError("category");
    if (body.confirmed !== true) throw new AiCommandCenterValidationError("confirmed", "required");
    const entry = {
        category,
        title: textValue(body.title, "title", { required: true, maxLength: 180 }),
        content: textValue(body.content, "content", { required: true, maxLength: 12000 }),
        sourceNote: textValue(body.sourceNote, "sourceNote", { required: true, maxLength: 500 }),
    };
    assertAnonymized(entry);
    return entry;
};

export const normalizeLearningDecision = (body = {}) => {
    if (typeof body.approved !== "boolean") throw new AiCommandCenterValidationError("approved");
    return { approved: body.approved };
};

export const normalizeImageDraftRequest = (body = {}) => {
    const briefIndex = Number(body.briefIndex);
    if (!Number.isInteger(briefIndex) || briefIndex < 0 || briefIndex > 5) {
        throw new AiCommandCenterValidationError("briefIndex");
    }
    if (body.confirmCost !== true) throw new AiCommandCenterValidationError("confirmCost", "required");
    return { briefIndex, confirmCost: true };
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
