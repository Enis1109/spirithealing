const limits = Object.freeze({
    name: 100,
    email: 254,
    phone: 40,
    short: 800,
    long: 2500,
});

const topicChoices = new Set([
    "beziehungen",
    "selbstwert",
    "grenzen",
    "entscheidungen",
    "koerper",
    "beruf",
    "geld",
    "familie",
    "verlust",
    "anderes",
]);

const frequencyChoices = new Set(["selten", "monatlich", "woechentlich", "mehrmals_woechentlich", "taeglich"]);
const stabilityChoices = new Set(["ja", "unsicher", "nein"]);
const supportChoices = new Set(["ja", "nein", "keine_angabe"]);
const crisisContactChoices = new Set(["ja", "nein", "unsicher"]);
const reviewChoices = new Set(["neu", "vorbereitet", "rueckfrage", "abgeschlossen"]);

const cleanText = (value) => Array.from(String(value ?? ""))
    .filter((character) => {
        const code = character.charCodeAt(0);
        return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join("")
    .trim();

const characterLength = (value) => Array.from(value).length;

const requiredText = (value, field, maxLength = limits.long) => {
    const cleaned = cleanText(value);
    if (!cleaned || characterLength(cleaned) > maxLength) throw new OnboardingValidationError(field);
    return cleaned;
};

const optionalText = (value, field, maxLength = limits.long) => {
    const cleaned = cleanText(value);
    if (!cleaned) return null;
    if (characterLength(cleaned) > maxLength) throw new OnboardingValidationError(field);
    return cleaned;
};

const email = (value) => {
    const normalized = requiredText(value, "email", limits.email).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(normalized)) throw new OnboardingValidationError("email");
    return normalized;
};

const score = (value, field) => {
    const normalized = Number(value);
    if (!Number.isInteger(normalized) || normalized < 0 || normalized > 10) {
        throw new OnboardingValidationError(field);
    }
    return normalized;
};

const choice = (value, field, allowed) => {
    const normalized = requiredText(value, field, 32);
    if (!allowed.has(normalized)) throw new OnboardingValidationError(field);
    return normalized;
};

const topics = (value) => {
    if (!Array.isArray(value)) throw new OnboardingValidationError("topicAreas");
    const normalized = [...new Set(value.map((item) => cleanText(item)).filter((item) => topicChoices.has(item)))];
    if (normalized.length < 1 || normalized.length > 5) throw new OnboardingValidationError("topicAreas");
    return normalized;
};

export class OnboardingValidationError extends Error {
    constructor(field) {
        super(`Invalid onboarding field: ${field}`);
        this.name = "OnboardingValidationError";
        this.field = field;
    }
}

export const onboardingConsentVersion = "zepter-onboarding-2026-08-v1";

export const normalizeOnboardingSubmission = (body = {}) => {
    if (body.company) throw new OnboardingValidationError("form");
    if (body.privacyConsent !== true) throw new OnboardingValidationError("privacyConsent");
    if (body.nonMedicalAcknowledgement !== true) throw new OnboardingValidationError("nonMedicalAcknowledgement");

    return {
        name: requiredText(body.name, "name", limits.name),
        email: email(body.email),
        phone: optionalText(body.phone, "phone", limits.phone),
        topicAreas: topics(body.topicAreas),
        mainTopic: requiredText(body.mainTopic, "mainTopic"),
        recentScene: requiredText(body.recentScene, "recentScene"),
        desiredChange: requiredText(body.desiredChange, "desiredChange"),
        goalStatement: requiredText(body.goalStatement, "goalStatement", limits.short),
        goalScore: score(body.goalScore, "goalScore"),
        confidenceScore: score(body.confidenceScore, "confidenceScore"),
        trigger: requiredText(body.trigger, "trigger"),
        automaticMeaning: requiredText(body.automaticMeaning, "automaticMeaning"),
        feelings: requiredText(body.feelings, "feelings", limits.short),
        feelingIntensity: score(body.feelingIntensity, "feelingIntensity"),
        bodyResponse: optionalText(body.bodyResponse, "bodyResponse", limits.short),
        typicalResponse: requiredText(body.typicalResponse, "typicalResponse"),
        shortTermProtection: requiredText(body.shortTermProtection, "shortTermProtection"),
        longTermCost: requiredText(body.longTermCost, "longTermCost"),
        patternFrequency: choice(body.patternFrequency, "patternFrequency", frequencyChoices),
        fearedConsequence: requiredText(body.fearedConsequence, "fearedConsequence"),
        exceptions: optionalText(body.exceptions, "exceptions"),
        identityStatement: requiredText(body.identityStatement, "identityStatement", limits.short),
        othersStatement: requiredText(body.othersStatement, "othersStatement", limits.short),
        worldStatement: requiredText(body.worldStatement, "worldStatement", limits.short),
        mustStatement: requiredText(body.mustStatement, "mustStatement", limits.short),
        mustNotStatement: requiredText(body.mustNotStatement, "mustNotStatement", limits.short),
        earlyEcho: optionalText(body.earlyEcho, "earlyEcho"),
        h01: score(body.h01, "h01"),
        h02: score(body.h02, "h02"),
        h03: score(body.h03, "h03"),
        h04: score(body.h04, "h04"),
        h05: score(body.h05, "h05"),
        b01: score(body.b01, "b01"),
        b02: score(body.b02, "b02"),
        b03: score(body.b03, "b03"),
        stability: choice(body.stability, "stability", stabilityChoices),
        professionalSupport: choice(body.professionalSupport, "professionalSupport", supportChoices),
        safeSupport: optionalText(body.safeSupport, "safeSupport"),
        resources: requiredText(body.resources, "resources"),
        crisisContact: choice(body.crisisContact, "crisisContact", crisisContactChoices),
        privacyConsent: true,
        nonMedicalAcknowledgement: true,
        aggregateConsent: body.aggregateConsent === true,
        consentVersion: onboardingConsentVersion,
    };
};

export const normalizeOnboardingReview = (body = {}) => {
    const status = choice(body.status, "status", reviewChoices);
    return {
        status,
        note: optionalText(body.note, "note", limits.long),
    };
};
