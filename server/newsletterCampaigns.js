import { liveCampaignDrafts } from "./liveCampaignDrafts.js";

// Deliberately no send, schedule or recipient-export operation in this module.
export const initializeNewsletterCampaigns = async (db) => {
    await db.execute(`CREATE TABLE IF NOT EXISTS newsletter_campaign_drafts (
        campaign_key VARCHAR(80) PRIMARY KEY, planned_date DATE NOT NULL,
        subject VARCHAR(255) NOT NULL, preheader VARCHAR(500) NOT NULL,
        body MEDIUMTEXT NOT NULL, segment VARCHAR(64) NOT NULL,
        status VARCHAR(16) NOT NULL DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    for (const draft of liveCampaignDrafts) {
        // Repeated deployments must not overwrite reviewed drafts.
        await db.execute(`INSERT IGNORE INTO newsletter_campaign_drafts
            (campaign_key, planned_date, subject, preheader, body, segment, status)
            VALUES (?, ?, ?, ?, ?, ?, 'draft')`,
        [`herbst-2026-${draft.key}`, draft.plannedDate, draft.subject, draft.preheader, draft.body, draft.segment]);
    }
};

export const newsletterCampaignOverview = async (db) => {
    const [counts] = await db.execute(`SELECT status, locale, COUNT(*) AS total,
        SUM(confirmed_at IS NOT NULL AND unsubscribed_at IS NULL) AS confirmed
        FROM newsletter_subscribers GROUP BY status, locale`);
    const [drafts] = await db.execute(`SELECT campaign_key, DATE_FORMAT(planned_date, '%Y-%m-%d') AS planned_date,
        subject, preheader, body, segment, status FROM newsletter_campaign_drafts
        WHERE campaign_key LIKE 'herbst-2026-E%' ORDER BY planned_date`);
    return {
        activeGerman: counts.filter(r => r.status === "active" && r.locale === "de").reduce((n, r) => n + Number(r.confirmed), 0),
        pending: counts.filter(r => r.status === "pending").reduce((n, r) => n + Number(r.total), 0),
        drafts,
        sendingEnabled: false,
    };
};
