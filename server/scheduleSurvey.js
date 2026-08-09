import crypto from "node:crypto";
import { database } from "./database.js";
import { scheduleSlots } from "./scheduleSurveyValidation.js";

const participantKey = (name) => crypto
    .createHash("sha256")
    .update(name.normalize("NFKC").toLocaleLowerCase("de-DE").replace(/\s+/gu, " "))
    .digest("hex");

const referenceCode = () => `TZ-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

const parseSlots = (value) => {
    try {
        const parsed = JSON.parse(value || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const mapSubmission = (row) => ({
    id: Number(row.id),
    reference: row.reference_code,
    name: row.name,
    availableSlots: parseSlots(row.available_slots),
    preferredSlot: row.preferred_slot,
    knownExceptions: row.known_exceptions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

export const saveScheduleSurveySubmission = async (form) => {
    const key = participantKey(form.name);
    const reference = referenceCode();
    const [result] = await database.execute(
        `INSERT INTO zepter_schedule_surveys (
            participant_key, reference_code, name, available_slots, preferred_slot,
            known_exceptions, consent_version
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            id = LAST_INSERT_ID(id),
            name = VALUES(name),
            available_slots = VALUES(available_slots),
            preferred_slot = VALUES(preferred_slot),
            known_exceptions = VALUES(known_exceptions),
            consent_version = VALUES(consent_version),
            consent_at = UTC_TIMESTAMP(),
            updated_at = UTC_TIMESTAMP()`,
        [
            key,
            reference,
            form.name,
            JSON.stringify(form.availableSlots),
            form.preferredSlot,
            form.knownExceptions,
            form.consentVersion,
        ],
    );
    return { id: Number(result.insertId), updated: result.affectedRows > 1 };
};

export const getAdminScheduleSurvey = async () => {
    const [rows] = await database.execute(
        `SELECT id, reference_code, name, available_slots, preferred_slot,
                known_exceptions, created_at, updated_at
         FROM zepter_schedule_surveys
         ORDER BY updated_at DESC
         LIMIT 500`,
    );
    const submissions = rows.map(mapSubmission);
    const summary = scheduleSlots.map((slot) => ({
        ...slot,
        availableCount: submissions.filter((item) => item.availableSlots.includes(slot.id)).length,
        preferredCount: submissions.filter((item) => item.preferredSlot === slot.id).length,
        availableNames: submissions.filter((item) => item.availableSlots.includes(slot.id)).map((item) => item.name),
        preferredNames: submissions.filter((item) => item.preferredSlot === slot.id).map((item) => item.name),
    }));
    return { submissions, summary, total: submissions.length };
};
