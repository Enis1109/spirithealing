import { database } from "./database.js";

const eventNames = new Set([
    "landing_view",
    "registration_start",
    "registration_submit",
    "registration_created",
    "registration_activated",
]);

const clean = (value, maxLength) => {
    const normalized = String(value || "").trim();
    return normalized ? normalized.slice(0, maxLength) : null;
};

const cleanSessionId = (value) => {
    const normalized = clean(value, 36);
    return normalized && /^[a-z0-9-]{8,36}$/iu.test(normalized) ? normalized : null;
};

const normalizeLocale = (value) => value === "tr" ? "tr" : "de";

export const normalizeAttribution = (value = {}) => ({
    funnelSessionId: cleanSessionId(value.funnelSessionId),
    source: clean(value.source, 80),
    medium: clean(value.medium, 80),
    campaign: clean(value.campaign, 120),
    content: clean(value.content, 120),
    term: clean(value.term, 120),
    landingPath: clean(value.landingPath, 255),
    referrerHost: clean(value.referrerHost, 160),
});

export const normalizeFunnelEvent = (body = {}) => {
    const eventName = clean(body.eventName, 48);
    const eventKey = clean(body.eventKey, 120) || "default";
    const attribution = normalizeAttribution(body.attribution);

    if (!eventNames.has(eventName) || !attribution.funnelSessionId) return null;

    return {
        eventName,
        eventKey,
        attribution,
        locale: normalizeLocale(body.locale),
    };
};

export const recordFunnelEvent = async ({ eventName, eventKey = "default", attribution, locale = "de" }) => {
    const normalized = normalizeFunnelEvent({ eventName, eventKey, attribution, locale });
    if (!normalized) return false;

    const { attribution: source } = normalized;
    await database.execute(
        `INSERT INTO funnel_events (
            funnel_session_id, event_name, event_key, pathname, locale,
            utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer_host
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [
            source.funnelSessionId,
            normalized.eventName,
            normalized.eventKey,
            source.landingPath,
            normalized.locale,
            source.source,
            source.medium,
            source.campaign,
            source.content,
            source.term,
            source.referrerHost,
        ],
    );
    return true;
};

export const getFunnelSummary = async (days = 7) => {
    const boundedDays = Math.min(90, Math.max(1, Number(days) || 7));
    const [eventRows] = await database.query(
        `SELECT event_name, COUNT(*) AS total
         FROM funnel_events
         WHERE created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL ${boundedDays} DAY)
         GROUP BY event_name`,
    );
    const [sourceRows] = await database.query(
        `SELECT COALESCE(NULLIF(utm_source, ''), 'direct') AS source,
                COUNT(*) AS events,
                SUM(event_name = 'landing_view') AS landing_views,
                SUM(event_name = 'registration_created') AS registrations,
                SUM(event_name = 'registration_activated') AS activations
         FROM funnel_events
         WHERE created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL ${boundedDays} DAY)
         GROUP BY COALESCE(NULLIF(utm_source, ''), 'direct')
         ORDER BY landing_views DESC, events DESC
         LIMIT 12`,
    );
    const [memberRows] = await database.query(
        `SELECT COUNT(*) AS registrations,
                SUM(status = 'active') AS activations
         FROM members
         WHERE created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL ${boundedDays} DAY)`,
    );

    const events = Object.fromEntries(eventRows.map((row) => [row.event_name, Number(row.total)]));
    const landingViews = events.landing_view || 0;
    const registrations = Number(memberRows[0]?.registrations || events.registration_created || 0);
    const activations = Number(memberRows[0]?.activations || events.registration_activated || 0);

    return {
        days: boundedDays,
        landingViews,
        registrationStarts: events.registration_start || 0,
        registrationSubmits: events.registration_submit || 0,
        registrations,
        activations,
        registrationRate: landingViews > 0 ? Math.round((registrations / landingViews) * 1000) / 10 : null,
        sources: sourceRows.map((row) => ({
            source: row.source,
            events: Number(row.events),
            landingViews: Number(row.landing_views),
            registrations: Number(row.registrations),
            activations: Number(row.activations),
        })),
    };
};
