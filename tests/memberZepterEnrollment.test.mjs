import assert from "node:assert/strict";
import test from "node:test";

import { enrollZepterParticipantIfEligible } from "../server/programEnrollment.js";

test("activates Zepter access for a matching questionnaire email", async () => {
    const calls = [];
    const connection = {
        execute: async (sql, values) => {
            calls.push({ sql, values });
            return [{ affectedRows: 1 }];
        },
    };

    const enrolled = await enrollZepterParticipantIfEligible({
        connection,
        memberId: 42,
        email: "teilnehmerin@example.com",
    });

    assert.equal(enrolled, true);
    assert.equal(calls.length, 1);
    assert.match(calls[0].sql, /zepter_onboarding_submissions/u);
    assert.match(calls[0].sql, /programs\.slug = 'zepter-acht-wochen'/u);
    assert.match(calls[0].sql, /ON DUPLICATE KEY UPDATE/u);
    assert.deepEqual(calls[0].values, [42, "teilnehmerin@example.com"]);
});

test("leaves access unchanged when the email is not part of the cohort", async () => {
    const connection = {
        execute: async () => [{ affectedRows: 0 }],
    };

    const enrolled = await enrollZepterParticipantIfEligible({
        connection,
        memberId: 84,
        email: "nicht-dabei@example.com",
    });

    assert.equal(enrolled, false);
});
