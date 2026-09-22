import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { liveCampaignDrafts } from "../server/liveCampaignDrafts.js";
import { initializeNewsletterCampaigns, newsletterCampaignOverview } from "../server/newsletterCampaigns.js";

test("ten draft messages, no Turkish time, no reply-LIVE CTA or Zoom credentials", () => {
    assert.equal(liveCampaignDrafts.length, 10);
    assert.equal(new Set(liveCampaignDrafts.map(d => d.key)).size, 10);
    for (const d of liveCampaignDrafts) {
        assert.equal(d.status, "draft");
        assert.ok(d.subject && d.preheader && d.body);
        assert.doesNotMatch(d.body, /Türkei|21:45|20:45|75 Minuten|zoom\.us|antworte.*„LIVE“/u);
        if (Number(d.key.slice(1)) < 4) {
            assert.match(d.body, /https:\/\/spirit-healing\.tr\/live-vortrag/u);
            assert.match(d.body, /20:30/u);
        }
        if (d.plannedDate >= "2026-10-09") assert.doesNotMatch(d.body, /Restplätze/u);
    }
});

test("initialization preserves existing drafts and has no send or schedule state", async () => {
    const calls = [];
    await initializeNewsletterCampaigns({ execute: async (sql, values) => { calls.push({ sql, values }); return [{}]; } });
    assert.equal(calls.length, 11);
    for (const c of calls.slice(1)) {
        assert.match(c.sql, /INSERT IGNORE/u);
        assert.match(c.sql, /'draft'/u);
        assert.equal(c.values.length, 6);
    }
});

test("overview counts only confirmed active German contacts, without exporting contact data", async () => {
    const db = { execute: async sql => sql.includes("GROUP BY") ? [[
        { status: "active", locale: "de", total: 28, confirmed: 27 },
        { status: "active", locale: "tr", total: 2, confirmed: 2 },
        { status: "pending", locale: "de", total: 12, confirmed: 0 },
        { status: "unsubscribed", locale: "de", total: 3, confirmed: 0 },
    ]] : [[{ campaign_key: "herbst-2026-E0", status: "draft" }]] };
    const result = await newsletterCampaignOverview(db);
    assert.equal(result.activeGerman, 27);
    assert.equal(result.pending, 12);
    assert.equal(result.sendingEnabled, false);
});

test("homepage uses inline live notice and does not automatically open the old popup", () => {
    const home = readFileSync(new URL("../src/sections/Herotest.jsx", import.meta.url), "utf8");
    const notice = readFileSync(new URL("../src/components/LiveTalkHomeNotice.jsx", import.meta.url), "utf8");
    assert.match(home, /<LiveTalkHomeNotice \/>/u);
    assert.doesNotMatch(home, /MemberWelcomeModal|memberModalOpen|spirit-member-popup-dismissed/u);
    assert.match(notice, /19:30–20:30 Uhr deutscher Zeit/u);
    assert.match(notice, /\/vortrag-13-wochen-programm/u);
    assert.match(notice, /\/gratis-meditationen/u);
    assert.doesNotMatch(notice, /Türkei|role="dialog"/u);
});
