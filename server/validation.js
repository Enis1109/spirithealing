import { getContactOffer } from "../src/lib/contactOffers.js";
export const limits = Object.freeze({
    name: 100,
    email: 254,
    phone: 40,
    topic: 120,
    message: 2000,
    password: 128,
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

const normalizePassword = (value) => {
    const password = String(value ?? "");
    const length = characterLength(password);
    if (length < 10 || length > limits.password) throw new ValidationError("password");
    return password;
};

const normalizeAttributionInput = (value) => (
    value && typeof value === "object" && !Array.isArray(value) ? value : {}
);

export class ValidationError extends Error {
    constructor(field) {
        super(`Invalid field: ${field}`);
        this.name = "ValidationError";
        this.field = field;
    }
}

const commonFields = (body) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new ValidationError("form");
    if (body.company) throw new ValidationError("form");
    if (body.privacyConsent !== true) throw new ValidationError("privacyConsent");

    return {
        name: requiredText(body.name, "name", limits.name),
        email: normalizeEmail(body.email),
        locale: normalizeLocale(body.locale),
        newsletterConsent: body.newsletterConsent === true,
    };
};

export const validateContact = (body) => {
    const common = commonFields(body);
    const requestKind = body.requestKind ?? "general";
    if (!["general", "appointment"].includes(requestKind)) throw new ValidationError("requestKind");
    const offer = getContactOffer(body.offerCode);
    if (requestKind === "appointment" && !offer) throw new ValidationError("offerCode");
    if (requestKind === "appointment" && !body.requestKey) throw new ValidationError("requestKey");
    if (requestKind === "general" && body.offerCode) throw new ValidationError("offerCode");
    if (body.requestKey != null && (typeof body.requestKey !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestKey))) throw new ValidationError("requestKey");
    return {
        ...common,
        phone: optionalText(body.phone, "phone", limits.phone),
        requestKind,
        offerCode: offer ? body.offerCode : null,
        practitioner: offer?.practitioner ?? null,
        requestKey: body.requestKey?.toLowerCase() ?? null,
        topic: offer ? offer[common.locale] : requiredText(body.topic, "topic", limits.topic),
        message: requestKind === "appointment" ? optionalText(body.message, "message", limits.message) ?? "" : requiredText(body.message, "message", limits.message),
    };
};

export const validateZepterBankTransfer = (body) => {
    const paymentPlan = requiredText(body.paymentPlan, "paymentPlan", 24);
    if (!["full", "installments"].includes(paymentPlan)) {
        throw new ValidationError("paymentPlan");
    }

    return {
        ...commonFields(body),
        phone: optionalText(body.phone, "phone", limits.phone),
        paymentPlan,
    };
};

export const validateEventRegistration = (body) => ({
    ...commonFields(body),
    eventKey: requiredText(body.eventKey, "eventKey", 80),
});

export const validateMemberAccess = (body) => ({
    ...commonFields(body),
    attribution: normalizeAttributionInput(body.attribution),
});

export const validateMemberRegistration = (body) => ({
    ...commonFields(body),
    password: normalizePassword(body.password),
    attribution: normalizeAttributionInput(body.attribution),
});

export const validateMemberLogin = (body) => ({
    email: normalizeEmail(body.email),
    password: normalizePassword(body.password),
});

export const validateMemberPasswordRequest = (body) => ({
    email: normalizeEmail(body.email),
    locale: normalizeLocale(body.locale),
    returnTo: body.returnTo === "/admin" ? "/admin" : "",
});

export const validateMemberPasswordReset = (body) => ({
    token: requiredText(body.token, "token", 128),
    password: normalizePassword(body.password),
});
