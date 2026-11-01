// Reserved neutral link slots, NOT assigned to real posts. Never auto-generate IDs.
export const siteCampaigns = Object.freeze({
    s01: { source: 'instagram', campaign: 'c01', content: 'p01' },
    s02: { source: 'facebook', campaign: 'c01', content: 'p01' },
    s03: { source: 'youtube', campaign: 'c01', content: 'p01' },
    s04: { source: 'tiktok', campaign: 'c01', content: 'p01' },
    i01h: { source: 'instagram', campaign: 'c01', content: 'p01', target: 'p_home' },
    i01o: { source: 'instagram', campaign: 'c01', content: 'p01', target: 'p_offer' },
    i01b: { source: 'instagram', campaign: 'c01', content: 'p01', target: 'p_booking' },
    i01c: { source: 'instagram', campaign: 'c01', content: 'p01', target: 'p_contact' },
    f01h: { source: 'facebook', campaign: 'c01', content: 'p01', target: 'p_home' },
    f01o: { source: 'facebook', campaign: 'c01', content: 'p01', target: 'p_offer' },
    f01b: { source: 'facebook', campaign: 'c01', content: 'p01', target: 'p_booking' },
    f01c: { source: 'facebook', campaign: 'c01', content: 'p01', target: 'p_contact' },
    y01h: { source: 'youtube', campaign: 'c01', content: 'p01', target: 'p_home' },
    y01o: { source: 'youtube', campaign: 'c01', content: 'p01', target: 'p_offer' },
    y01b: { source: 'youtube', campaign: 'c01', content: 'p01', target: 'p_booking' },
    y01c: { source: 'youtube', campaign: 'c01', content: 'p01', target: 'p_contact' },
    t01h: { source: 'tiktok', campaign: 'c01', content: 'p01', target: 'p_home' },
    t01o: { source: 'tiktok', campaign: 'c01', content: 'p01', target: 'p_offer' },
    t01b: { source: 'tiktok', campaign: 'c01', content: 'p01', target: 'p_booking' },
    t01c: { source: 'tiktok', campaign: 'c01', content: 'p01', target: 'p_contact' },
});
export const SITE_CONSENT_VERSION = 'site-first-party-2026-11-01-v2';
export const SITE_SCHEMA_VERSION = 1;
export const SITE_CONSENT_KEY = 'sh-site-measurement-choice';
export const SITE_CONSENT_MS = 30 * 86400000;
export const SITE_FLOW_MS = 30 * 60000;
export const siteStages = Object.freeze({ landing_view: 1, offer_view: 2, cta_click: 4,
    inquiry_start: 8, form_error: 16, inquiry_success: 32 });
export const sitePage = path => path === '/' ? 'p_home' : path === '/prices' ? 'p_offer' : path === '/termin-buchen' ? 'p_booking'
    : path === '/kontakt' ? 'p_contact' : null;
export const siteCode = (search, entry) => {
    if (typeof search !== 'string' || search.length > 4096) return null;
    const codes = new URLSearchParams(search).getAll('sc');
    return codes.length === 1 && Object.hasOwn(siteCampaigns, codes[0])
        && (!entry || !siteCampaigns[codes[0]].target || siteCampaigns[codes[0]].target === entry) ? codes[0] : null;
};
export const validSiteReceipt = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
export const validSiteFlow = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
export const validSiteChoice = (value, now = Date.now()) => Boolean(value && value.version === SITE_CONSENT_VERSION
    && typeof value.enabled === 'boolean' && Number.isFinite(value.at) && value.at <= now && now-value.at < SITE_CONSENT_MS
    && (!value.enabled || validSiteReceipt(value.receipt)));
export function siteContext(value, now = Date.now()) {
    if (!value || typeof value !== 'object' || Array.isArray(value)
        || Object.keys(value).some(key => !['receipt', 'flow', 'code', 'entry', 'startedAt'].includes(key))
        || !validSiteReceipt(value.receipt) || !validSiteFlow(value.flow)
        || ![null, ...Object.keys(siteCampaigns)].includes(value.code)
        || !['p_home', 'p_offer', 'p_booking', 'p_contact'].includes(value.entry)
        || (value.code && siteCampaigns[value.code].target && siteCampaigns[value.code].target !== value.entry)
        || !Number.isFinite(value.startedAt) || value.startedAt > now || now-value.startedAt >= SITE_FLOW_MS) return null;
    return { receipt: value.receipt, flow: value.flow, code: value.code, entry: value.entry, startedAt: value.startedAt };
}
export function siteEvent(value, verified = false, now = Date.now()) {
    if (!value || Object.keys(value).some(key => !['context', 'event_name', 'error_class','schema_version','environment'].includes(key))
        || value.schema_version !== SITE_SCHEMA_VERSION || !['local','staging','production'].includes(value.environment)) return null;
    const context = siteContext(value.context, now);
    if (!context || !Object.hasOwn(siteStages, value.event_name) || (value.event_name === 'inquiry_success' && !verified)) return null;
    const kind = value.error_class ?? null;
    if (value.event_name === 'form_error' ? !['validation', 'technical'].includes(kind) : kind !== null) return null;
    return { context, event: value.event_name, bit: siteStages[value.event_name], kind };
}
export function siteSummary(rows) {
    return rows.filter(row => {
        const n = key => Number(row[key] || 0);
        const counts = ['flows','landing_views','offer_views','cta_clicks','inquiry_starts','form_errors',
            'validation_errors','technical_errors','inquiry_successes','started_and_saved'].map(n);
        const total = n('flows'), starts = n('inquiry_starts'), saved = n('inquiry_successes'), both = n('started_and_saved');
        const errors = n('form_errors'), validation = n('validation_errors'), technical = n('technical_errors');
        // Every published marginal and its complement must be safe. Also protect
        // all atoms of the two reconstructible 2x2 partitions: starts/saved
        // (intersection published) and validation/technical (union published).
        // Negative/non-integral atoms indicate inconsistent data: fail closed.
        const partitions = [both, starts-both, saved-both, total-starts-saved+both,
            validation+technical-errors, errors-technical, errors-validation, total-errors];
        const safe = value => Number.isSafeInteger(value) && value >= 0 && (value === 0 || value >= 5);
        return total >= 5 && counts.every(value => safe(value) && safe(total-value)) && partitions.every(safe);
    }).map(row => {
        const n = key => Number(row[key] || 0);
        return { day: String(row.day).slice(0,10), code: row.code || null,
            source: siteCampaigns[row.code]?.source || 'unassigned', campaign: siteCampaigns[row.code]?.campaign || null,
            content: siteCampaigns[row.code]?.content || null,
            flows: n('flows'), landingViews: n('landing_views'), offerViews: n('offer_views'), ctaClicks: n('cta_clicks'),
            inquiryStarts: n('inquiry_starts'), formErrors: n('form_errors'), validationErrors: n('validation_errors'),
            technicalErrors: n('technical_errors'), inquirySuccesses: n('inquiry_successes'),
            startedAndSaved: n('started_and_saved'),
            startToSavedRate: n('inquiry_starts') ? n('started_and_saved') / n('inquiry_starts') : null };
    });
}
