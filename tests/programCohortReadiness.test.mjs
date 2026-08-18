import assert from "node:assert/strict";
import test from "node:test";

import { summarizeZepterCohortReadiness } from "../server/programCohort.js";

test("separates ready, active, unconfirmed and missing cohort accounts", () => {
    const result = summarizeZepterCohortReadiness([
        {
            survey_name: "Bereit",
            survey_email: "bereit@example.com",
            member_email: "bereit@example.com",
            member_status: "active",
            enrollment_status: null,
        },
        {
            survey_name: "Aktiv",
            survey_email: "aktiv@example.com",
            member_email: "aktiv@example.com",
            member_status: "active",
            enrollment_status: "active",
        },
        {
            survey_name: "Offen",
            survey_email: "offen@example.com",
            member_email: "offen@example.com",
            member_status: "pending",
            enrollment_status: null,
        },
        {
            survey_name: "Fehlt",
            survey_email: "fehlt@example.com",
            member_email: null,
            member_status: null,
            enrollment_status: null,
        },
    ]);

    assert.equal(result.total, 4);
    assert.equal(result.readyCount, 1);
    assert.equal(result.activeCount, 1);
    assert.equal(result.confirmationPendingCount, 1);
    assert.equal(result.missingAccountCount, 1);
    assert.deepEqual(result.participants.map((participant) => participant.readiness), [
        "ready",
        "active",
        "confirmation_pending",
        "missing_account",
    ]);
});
