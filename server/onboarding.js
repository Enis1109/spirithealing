import crypto from "node:crypto";
import { database } from "./database.js";

const participantReference = () => `SH-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

const booleanValue = (value) => Boolean(Number(value));

const mapSubmission = (row) => ({
    id: Number(row.id),
    reference: row.reference_code,
    name: row.name,
    email: row.email,
    phone: row.phone,
    topicAreas: JSON.parse(row.topic_areas || "[]"),
    mainTopic: row.main_topic,
    recentScene: row.recent_scene,
    desiredChange: row.desired_change,
    goalStatement: row.goal_statement,
    goalScore: Number(row.goal_score),
    confidenceScore: Number(row.confidence_score),
    trigger: row.trigger_description,
    automaticMeaning: row.automatic_meaning,
    feelings: row.feelings,
    feelingIntensity: Number(row.feeling_intensity),
    bodyResponse: row.body_response,
    typicalResponse: row.typical_response,
    shortTermProtection: row.short_term_protection,
    longTermCost: row.long_term_cost,
    patternFrequency: row.pattern_frequency,
    fearedConsequence: row.feared_consequence,
    exceptions: row.exceptions_text,
    identityStatement: row.identity_statement,
    othersStatement: row.others_statement,
    worldStatement: row.world_statement,
    mustStatement: row.must_statement,
    mustNotStatement: row.must_not_statement,
    earlyEcho: row.early_echo,
    h01: Number(row.h01),
    h02: Number(row.h02),
    h03: Number(row.h03),
    h04: Number(row.h04),
    h05: Number(row.h05),
    b01: Number(row.b01),
    b02: Number(row.b02),
    b03: Number(row.b03),
    stability: row.stability,
    professionalSupport: row.professional_support,
    safeSupport: row.safe_support,
    resources: row.resources_text,
    crisisContact: row.crisis_contact,
    aggregateConsent: booleanValue(row.aggregate_consent),
    consentVersion: row.consent_version,
    consentAt: row.consent_at,
    reviewStatus: row.review_status,
    reviewNote: row.review_note,
    reviewedBy: row.reviewed_by_name,
    reviewedAt: row.reviewed_at,
    confirmationStatus: row.confirmation_status,
    notificationStatus: row.notification_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

export const createOnboardingSubmission = async (form) => {
    const reference = participantReference();
    const values = [
        reference, form.name, form.email, form.phone, JSON.stringify(form.topicAreas), form.mainTopic,
        form.recentScene, form.desiredChange, form.goalStatement, form.goalScore, form.confidenceScore,
        form.trigger, form.automaticMeaning, form.feelings, form.feelingIntensity, form.bodyResponse,
        form.typicalResponse, form.shortTermProtection, form.longTermCost, form.patternFrequency,
        form.fearedConsequence, form.exceptions, form.identityStatement, form.othersStatement,
        form.worldStatement, form.mustStatement, form.mustNotStatement, form.earlyEcho,
        form.h01, form.h02, form.h03, form.h04, form.h05, form.b01, form.b02, form.b03,
        form.stability, form.professionalSupport, form.safeSupport, form.resources, form.crisisContact,
        form.consentVersion, form.aggregateConsent ? 1 : 0,
    ];
    const [result] = await database.execute(
        `INSERT INTO zepter_onboarding_submissions (
            reference_code, name, email, phone, topic_areas, main_topic,
            recent_scene, desired_change, goal_statement, goal_score, confidence_score,
            trigger_description, automatic_meaning, feelings, feeling_intensity, body_response,
            typical_response, short_term_protection, long_term_cost, pattern_frequency,
            feared_consequence, exceptions_text, identity_statement, others_statement,
            world_statement, must_statement, must_not_statement, early_echo,
            h01, h02, h03, h04, h05, b01, b02, b03,
            stability, professional_support, safe_support, resources_text, crisis_contact,
            consent_version, aggregate_consent
        ) VALUES (${values.map(() => "?").join(", ")})`,
        values,
    );
    return { id: Number(result.insertId), reference };
};

export const setOnboardingDeliveryStatus = async ({ id, confirmationStatus, notificationStatus }) => {
    const updates = [];
    const values = [];
    if (confirmationStatus) {
        updates.push("confirmation_status = ?");
        values.push(confirmationStatus);
    }
    if (notificationStatus) {
        updates.push("notification_status = ?");
        values.push(notificationStatus);
    }
    if (updates.length === 0) return;
    values.push(id);
    await database.execute(`UPDATE zepter_onboarding_submissions SET ${updates.join(", ")} WHERE id = ?`, values);
};

export const getAdminOnboardingSubmissions = async () => {
    const [rows] = await database.execute(
        `SELECT submission.*, reviewer.name AS reviewed_by_name
         FROM zepter_onboarding_submissions submission
         LEFT JOIN members reviewer ON reviewer.id = submission.reviewed_by
         ORDER BY submission.created_at DESC
         LIMIT 500`,
    );
    return rows.map(mapSubmission);
};

export const updateOnboardingReview = async ({ id, status, note, memberId }) => {
    const [result] = await database.execute(
        `UPDATE zepter_onboarding_submissions
         SET review_status = ?, review_note = ?, reviewed_by = ?, reviewed_at = UTC_TIMESTAMP()
         WHERE id = ?`,
        [status, note, memberId, id],
    );
    return result.affectedRows > 0;
};
