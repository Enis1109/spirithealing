const cleanText = (value) => Array.from(String(value ?? ""))
    .filter((character) => {
        const code = character.charCodeAt(0);
        return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join("")
    .trim();

const requiredText = (value, field, maximumLength) => {
    const cleaned = cleanText(value);
    if (!cleaned || Array.from(cleaned).length > maximumLength) {
        throw new WebinarValidationError(field);
    }
    return cleaned;
};

export class WebinarValidationError extends Error {
    constructor(field) {
        super(`Invalid webinar field: ${field}`);
        this.name = "WebinarValidationError";
        this.field = field;
    }
}

export const normalizeWebinarRegistration = (body = {}) => {
    if (body.company) throw new WebinarValidationError("form");
    if (body.privacyConsent !== true) throw new WebinarValidationError("privacyConsent");

    const email = requiredText(body.email, "email", 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)) {
        throw new WebinarValidationError("email");
    }

    const slotId = requiredText(body.slotId, "slotId", 40);
    const slotDate = new Date(slotId);
    if (!Number.isFinite(slotDate.getTime()) || slotDate.toISOString() !== slotId) {
        throw new WebinarValidationError("slotId");
    }

    return {
        name: requiredText(body.name, "name", 100),
        email,
        slotId,
        locale: body.locale === "tr" ? "tr" : "de",
        newsletterConsent: body.newsletterConsent === true,
    };
};

export const normalizeWebinarToken = (value) => {
    const token = cleanText(value);
    if (!/^[a-z0-9]+\.[A-Za-z0-9_-]{43}$/u.test(token)) throw new WebinarValidationError("token");
    return token;
};
