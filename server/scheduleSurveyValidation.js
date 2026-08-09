export const scheduleSlots = Object.freeze([
    { id: "mo_1000", label: "Montag, 10:00 Uhr" },
    { id: "mo_1930", label: "Montag, 19:30 Uhr" },
    { id: "mi_1000", label: "Mittwoch, 10:00 Uhr" },
    { id: "mi_1930", label: "Mittwoch, 19:30 Uhr" },
    { id: "fr_1930", label: "Freitag, 19:30 Uhr" },
    { id: "sa_1100", label: "Samstag, 11:00 Uhr" },
    { id: "so_1100", label: "Sonntag, 11:00 Uhr" },
]);

const allowedSlots = new Set(scheduleSlots.map((slot) => slot.id));
const allowedPaymentChoices = new Set(["already_paid", "full", "two_installments", "custom_installment"]);

const cleanText = (value) => Array.from(String(value ?? ""))
    .filter((character) => {
        const code = character.charCodeAt(0);
        return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join("")
    .trim();

const requiredText = (value, field, maxLength) => {
    const cleaned = cleanText(value);
    if (!cleaned || Array.from(cleaned).length > maxLength) throw new ScheduleSurveyValidationError(field);
    return cleaned;
};

const optionalText = (value, field, maxLength) => {
    const cleaned = cleanText(value);
    if (!cleaned) return null;
    if (Array.from(cleaned).length > maxLength) throw new ScheduleSurveyValidationError(field);
    return cleaned;
};

const requiredEmail = (value) => {
    const email = requiredText(value, "email", 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)) throw new ScheduleSurveyValidationError("email");
    return email;
};

export class ScheduleSurveyValidationError extends Error {
    constructor(field) {
        super(`Invalid schedule survey field: ${field}`);
        this.name = "ScheduleSurveyValidationError";
        this.field = field;
    }
}

export const scheduleSurveyConsentVersion = "schedule-survey-2026-08-v2";

export const normalizeScheduleSurveySubmission = (body = {}) => {
    if (body.company) throw new ScheduleSurveyValidationError("form");
    if (body.privacyConsent !== true) throw new ScheduleSurveyValidationError("privacyConsent");
    if (!Array.isArray(body.availableSlots)) throw new ScheduleSurveyValidationError("availableSlots");

    const availableSlots = [...new Set(body.availableSlots.map((value) => cleanText(value)))]
        .filter((value) => allowedSlots.has(value));
    if (availableSlots.length < 1 || availableSlots.length > scheduleSlots.length) {
        throw new ScheduleSurveyValidationError("availableSlots");
    }

    const preferredSlot = requiredText(body.preferredSlot, "preferredSlot", 32);
    if (!allowedSlots.has(preferredSlot) || !availableSlots.includes(preferredSlot)) {
        throw new ScheduleSurveyValidationError("preferredSlot");
    }

    const paymentChoice = requiredText(body.paymentChoice, "paymentChoice", 32);
    if (!allowedPaymentChoices.has(paymentChoice)) throw new ScheduleSurveyValidationError("paymentChoice");

    let desiredInstallment = null;
    if (paymentChoice === "custom_installment") {
        desiredInstallment = Number(body.desiredInstallment);
        if (!Number.isInteger(desiredInstallment) || desiredInstallment < 90 || desiredInstallment > 690) {
            throw new ScheduleSurveyValidationError("desiredInstallment");
        }
    }

    return {
        name: requiredText(body.name, "name", 100),
        email: requiredEmail(body.email),
        invoiceAddress: requiredText(body.invoiceAddress, "invoiceAddress", 500),
        availableSlots,
        preferredSlot,
        knownExceptions: optionalText(body.knownExceptions, "knownExceptions", 800),
        paymentChoice,
        desiredInstallment,
        consentVersion: scheduleSurveyConsentVersion,
    };
};
