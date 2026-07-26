export const limits = Object.freeze({
    name: 100,
    email: 254,
    phone: 40,
    topic: 120,
    message: 2000,
});

const cleanText = (value) => Array.from(String(value ?? ""))
    .filter((character) => {
        const code = character.charCodeAt(0);
        return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join("")
    .trim();

const characterLength = (value) => Array.from(value).length;

const requiredText = (value, field, maxLength) => {
    const cleaned = cleanText(value);
    if (!cleaned) throw new ValidationError(field);
    if (characterLength(cleaned) > maxLength) throw new ValidationError(field);
    return cleaned;
};

const optionalText = (value, field, maxLength) => {
    const cleaned = cleanText(value);
    if (!cleaned) return null;
    if (characterLength(cleaned) > maxLength) throw new ValidationError(field);
    return cleaned;
};

const normalizeEmail = (value) => {
    const email = requiredText(value, "email", limits.email).toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
    if (!emailPattern.test(email)) throw new ValidationError("email");
    return email;
};

const normalizeLocale = (value) => value === "tr" ? "tr" : "de";

export class ValidationError extends Error {
    constructor(field) {
        super(`Invalid field: ${field}`);
        this.name = "ValidationError";
        this.field = field;
    }
}

const commonFields = (body) => {
    if (body.company) throw new ValidationError("form");
    if (body.privacyConsent !== true) throw new ValidationError("privacyConsent");

    return {
        name: requiredText(body.name, "name", limits.name),
        email: normalizeEmail(body.email),
        locale: normalizeLocale(body.locale),
        newsletterConsent: body.newsletterConsent === true,
    };
};

export const validateContact = (body) => ({
    ...commonFields(body),
    phone: optionalText(body.phone, "phone", limits.phone),
    topic: requiredText(body.topic, "topic", limits.topic),
    message: requiredText(body.message, "message", limits.message),
});

export const validateEventRegistration = (body) => ({
    ...commonFields(body),
    eventKey: requiredText(body.eventKey, "eventKey", 80),
});
