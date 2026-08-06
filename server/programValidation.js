export class ProgramValidationError extends Error {
    constructor(field, message = "Invalid program value") {
        super(message);
        this.name = "ProgramValidationError";
        this.field = field;
    }
}

const normalizeText = (value, field, { maxLength, required = true } = {}) => {
    const normalized = String(value ?? "").replace(/\r\n?/gu, "\n").trim();
    if (required && !normalized) throw new ProgramValidationError(field);
    if (normalized.length > maxLength) throw new ProgramValidationError(field);
    return normalized;
};

const normalizeUrl = (value, field) => {
    const normalized = String(value ?? "").trim();
    if (!normalized) return "";
    const hasControlCharacter = [...normalized].some((character) => {
        const codePoint = character.codePointAt(0);
        return codePoint <= 31 || codePoint === 127;
    });
    if (normalized.length > 500 || hasControlCharacter) throw new ProgramValidationError(field);
    if (normalized.startsWith("/") && !normalized.startsWith("//")) return normalized;

    try {
        const parsed = new URL(normalized);
        if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.toString().length > 500) throw new Error("unsafe_url");
        return parsed.toString();
    } catch {
        throw new ProgramValidationError(field);
    }
};

const normalizeDate = (value, field) => {
    const normalized = String(value ?? "").trim();
    const parsed = new Date(`${normalized}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(normalized)
        || Number.isNaN(parsed.getTime())
        || parsed.toISOString().slice(0, 10) !== normalized) {
        throw new ProgramValidationError(field);
    }
    return normalized;
};

const normalizeOptionalDateTime = (value, field) => {
    const normalized = String(value ?? "").trim();
    if (!normalized) return "";
    if (normalized.length > 40
        || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?$/u.test(normalized)
        || Number.isNaN(Date.parse(normalized))) throw new ProgramValidationError(field);
    return normalized;
};

export const normalizeProgramSlug = (value) => {
    const slug = String(value ?? "").trim().toLowerCase();
    if (!/^[a-z0-9-]{1,80}$/u.test(slug)) throw new ProgramValidationError("slug");
    return slug;
};

export const normalizeProgramSettings = (body) => {
    if (!["draft", "active", "archived"].includes(body?.status)) throw new ProgramValidationError("status");
    return {
        title: normalizeText(body?.title, "title", { maxLength: 160 }),
        subtitle: normalizeText(body?.subtitle, "subtitle", { maxLength: 600 }),
        startDate: normalizeDate(body?.startDate, "startDate"),
        whatsappUrl: normalizeUrl(body?.whatsappUrl, "whatsappUrl"),
        status: body.status,
    };
};

export const normalizeProgramWeek = (body, expectedWeekNumber) => {
    const weekNumber = Number(expectedWeekNumber);
    if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 24) {
        throw new ProgramValidationError("weekNumber");
    }

    const rawTasks = Array.isArray(body?.tasks) ? body.tasks : [];
    if (rawTasks.length < 1 || rawTasks.length > 8) throw new ProgramValidationError("tasks");
    const taskKeys = new Set();
    const tasks = rawTasks.map((task, index) => {
        const key = String(task?.key || `task-${index + 1}`).trim().toLowerCase();
        if (!/^[a-z0-9-]{1,60}$/u.test(key) || taskKeys.has(key)) throw new ProgramValidationError("tasks");
        taskKeys.add(key);
        return {
            key,
            label: normalizeText(task?.label, "tasks", { maxLength: 180 }),
        };
    });

    return {
        weekNumber,
        title: normalizeText(body?.title, "title", { maxLength: 160 }),
        focus: normalizeText(body?.focus, "focus", { maxLength: 280 }),
        intro: normalizeText(body?.intro, "intro", { maxLength: 4000 }),
        releaseOn: normalizeDate(body?.releaseOn, "releaseOn"),
        liveAt: normalizeOptionalDateTime(body?.liveAt, "liveAt"),
        zoomUrl: normalizeUrl(body?.zoomUrl, "zoomUrl"),
        meditationTitle: normalizeText(body?.meditationTitle, "meditationTitle", { maxLength: 180 }),
        meditationUrl: normalizeUrl(body?.meditationUrl, "meditationUrl"),
        workbookLabel: normalizeText(body?.workbookLabel, "workbookLabel", { maxLength: 180 }),
        workbookUrl: normalizeUrl(body?.workbookUrl, "workbookUrl"),
        recordingUrl: normalizeUrl(body?.recordingUrl, "recordingUrl"),
        tasks,
    };
};

export const normalizeProgramEnrollment = (body) => {
    const email = String(body?.email ?? "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/u.test(email) || email.length > 254) throw new ProgramValidationError("email");
    if (typeof body?.active !== "boolean") throw new ProgramValidationError("active");
    return { email, active: body.active };
};

export const normalizeProgramTaskUpdate = (body) => {
    const weekNumber = Number(body?.weekNumber);
    const taskKey = String(body?.taskKey ?? "").trim().toLowerCase();
    if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 24) throw new ProgramValidationError("weekNumber");
    if (!/^[a-z0-9-]{1,60}$/u.test(taskKey)) throw new ProgramValidationError("taskKey");
    if (typeof body?.completed !== "boolean") throw new ProgramValidationError("completed");
    return { weekNumber, taskKey, completed: body.completed };
};
