import assert from "node:assert/strict";
import test from "node:test";
import { getWebinarEmailCopy } from "../server/webinarEmailCopy.js";

test("immediate confirmation gives expiry, instant access and no reservation claim", () => {
    const copy = getWebinarEmailCopy({ onDemand: true, closesAt: "2026-09-22T12:00:00.000Z" });
    assert.match(copy.intro, /sieben Tage/u);
    assert.match(copy.accessLabel, /22\. September 2026.*14:00/u);
    assert.equal(copy.button, "Vortrag jetzt ansehen");
    assert.match(copy.note, /Newsletter-Anmeldung.*nicht erforderlich/u);
    assert.doesNotMatch(Object.values(copy).join(" "), /reserviert|In einer Stunde/u);
});

test("previous scheduled invitations and reminders retain their wording", () => {
    const slotLabel = "Mittwoch um 19:00 Uhr";
    assert.equal(getWebinarEmailCopy({ slotLabel }).accessLabel, slotLabel);
    assert.equal(getWebinarEmailCopy({ slotLabel }).headline, "Dein Termin ist reserviert");
    assert.equal(getWebinarEmailCopy({ slotLabel, reminder: true }).headline, "In einer Stunde beginnt dein Vortrag");
});
