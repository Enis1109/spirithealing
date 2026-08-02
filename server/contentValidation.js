const contentKeyPattern = /^[a-z0-9][a-z0-9._-]{2,159}$/u;
const maxContentLength = 16000;
const maxBatchSize = 80;

export class ContentValidationError extends Error {
    constructor(field) {
        super(`Invalid content field: ${field}`);
        this.name = "ContentValidationError";
        this.field = field;
    }
}

export const normalizeContentKey = (value) => {
    const key = String(value || "").trim().toLowerCase();
    if (!contentKeyPattern.test(key)) throw new ContentValidationError("key");
    return key;
};

const normalizeContentValue = (value, field) => {
    if (typeof value !== "string") throw new ContentValidationError(field);
    if ([...value].length > maxContentLength) throw new ContentValidationError(field);
    return value.replace(/\r\n?/gu, "\n");
};

export const normalizeContentDraftItems = (value) => {
    if (!Array.isArray(value) || value.length < 1 || value.length > maxBatchSize) {
        throw new ContentValidationError("items");
    }

    const keys = new Set();
    return value.map((item, index) => {
        const key = normalizeContentKey(item?.key);
        if (keys.has(key)) throw new ContentValidationError(`items.${index}.key`);
        keys.add(key);

        return {
            key,
            de: normalizeContentValue(item?.de, `items.${index}.de`),
            tr: normalizeContentValue(item?.tr, `items.${index}.tr`),
        };
    });
};

export const normalizeContentKeys = (value) => {
    if (!Array.isArray(value) || value.length < 1 || value.length > maxBatchSize) {
        throw new ContentValidationError("keys");
    }

    const keys = value.map(normalizeContentKey);
    if (new Set(keys).size !== keys.length) throw new ContentValidationError("keys");
    return keys;
};

export const normalizeRevisionRequest = (value) => {
    const key = normalizeContentKey(value?.key);
    const revisionId = Number(value?.revisionId);
    if (!Number.isSafeInteger(revisionId) || revisionId < 1) {
        throw new ContentValidationError("revisionId");
    }
    return { key, revisionId };
};
