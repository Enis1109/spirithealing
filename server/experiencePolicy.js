// These rules are independent of payments. Payment adapters must pass verified
// payment events, never client-supplied dates or Checkout success redirects.
export const experiencePlans = Object.freeze({
    monthly: Object.freeze({ amount: 6900, currency: 'eur', months: 1, recurring: true }),
    annual: Object.freeze({ amount: 59900, currency: 'eur', months: 12, recurring: false }),
});

// Keep the private recurring-meeting link in server configuration, never in a
// public bundle or in the overview returned to people without group access.
export const normalizeExperienceJoinUrl = value => {
    if (!value) return null;
    let url;
    try { url = new URL(value); } catch { throw new Error('invalid_experience_zoom_url'); }
    if (url.protocol !== 'https:' || !(url.hostname === 'zoom.us' || url.hostname.endsWith('.zoom.us'))
        || !/^\/j\/\d{9,11}$/.test(url.pathname) || url.username || url.password || url.port || url.hash)
        throw new Error('invalid_experience_zoom_url');
    return url.href;
};

export const instant = (value) => {
    if (!value) return NaN;
    // MySQL DATETIME strings are explicitly UTC in this feature.
    return new Date(typeof value === 'string' && /^\d{4}-\d\d-\d\d \d\d:/.test(value)
        ? value.replace(' ', 'T') + 'Z' : value).getTime();
};

export const activeAccess = (access, now = new Date()) => Boolean(access
    && access.status === 'active'
    && instant(access.starts_at) <= instant(now)
    && ((access.plan === 'existing' && access.ends_at === null)
        || instant(now) < instant(access.ends_at)));

export const canReadSession = (access, session, now = new Date()) => Boolean(
    activeAccess(access, now) && session.status === 'published'
    && instant(session.published_at) <= instant(now)
    && instant(session.occurred_at) <= instant(now)
    && (access.full_archive === true || access.full_archive === 1
        || instant(session.occurred_at) >= instant(access.content_from)));

export const addCalendarMonths = (value, months) => {
    const result = new Date(instant(value));
    if (!Number.isFinite(result.getTime())) throw new Error('invalid_date');
    const day = result.getUTCDate();
    result.setUTCDate(1);
    result.setUTCMonth(result.getUTCMonth() + months);
    const last = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
    result.setUTCDate(Math.min(day, last));
    return result.toISOString();
};

export const annualRenewal = (access, paidAt) => {
    const paymentTime = instant(paidAt);
    if (!Number.isFinite(paymentTime)) throw new Error('invalid_payment_time');
    const continuous = access?.status === 'active' && instant(access.ends_at) >= paymentTime;
    const startsAt = continuous ? new Date(instant(access.ends_at)).toISOString() : new Date(paymentTime).toISOString();
    return {
        // Keep access active during an early renewal; only the end moves forward.
        startsAt: continuous ? new Date(instant(access.starts_at)).toISOString() : startsAt,
        endsAt: addCalendarMonths(startsAt, 12),
        // A break in membership must not silently grant access to the gap.
        // Returning members need an explicit decision before activation.
        requiresReview: Boolean(access && !continuous),
        contentFrom: continuous ? access.content_from : new Date(paymentTime).toISOString(),
        fullArchive: continuous && Boolean(access.full_archive),
    };
};

const berlinDay = (value) => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(instant(value)));

export const renewalReminder = (access, now = new Date()) => {
    if (access?.plan !== 'annual' || !activeAccess(access, now)) return null;
    // Date-based scheduling is unaffected by 23/25-hour DST days.
    const days = Math.round((Date.parse(berlinDay(access.ends_at)) - Date.parse(berlinDay(now))) / 86400000);
    if (![30, 7, 0].includes(days)) return null;
    return { days, key: `${access.member_id}:${new Date(instant(access.ends_at)).toISOString()}:${days}` };
};

export class ExperienceValidationError extends Error {
    constructor(field) { super(field); this.field = field; }
}
const text = (value, field, max, required = true) => {
    const result = String(value ?? '').trim();
    if ((required && !result) || result.length > max) throw new ExperienceValidationError(field);
    return result;
};
export const utcInput = (value, field) => {
    const raw = String(value || '');
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?Z$/.test(raw)
        || !Number.isFinite(instant(raw))) throw new ExperienceValidationError(field);
    const normalized = new Date(raw).toISOString();
    if (normalized.slice(0, 16) !== raw.slice(0, 16)) throw new ExperienceValidationError(field);
    return normalized;
};
export const normalizeExperienceSession = (body) => {
    const status = body?.status;
    if (!['draft', 'published', 'archived'].includes(status)) throw new ExperienceValidationError('status');
    const vimeoId = text(body?.vimeoId, 'vimeoId', 20, false);
    const vimeoHash = text(body?.vimeoHash, 'vimeoHash', 64, false);
    if (vimeoId && !/^\d{5,20}$/.test(vimeoId)) throw new ExperienceValidationError('vimeoId');
    if (vimeoHash && !/^[a-zA-Z0-9]{6,64}$/.test(vimeoHash)) throw new ExperienceValidationError('vimeoHash');
    if (status === 'published' && body?.reviewed !== true) throw new ExperienceValidationError('reviewed');
    return {
        title: text(body?.title, 'title', 180), summary: text(body?.summary, 'summary', 4000, false),
        occurredAt: utcInput(body?.occurredAt, 'occurredAt'), status, vimeoId, vimeoHash,
    };
};
export const normalizeExperienceGrant = (body) => {
    const email = text(body?.email, 'email', 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ExperienceValidationError('email');
    if (!['monthly', 'annual', 'existing'].includes(body?.plan)) throw new ExperienceValidationError('plan');
    if (!['active', 'revoked'].includes(body?.status)) throw new ExperienceValidationError('status');
    if (typeof body?.fullArchive !== 'boolean') throw new ExperienceValidationError('fullArchive');
    const startsAt = utcInput(body.startsAt, 'startsAt');
    // Existing monthly members remain active until a later manual reconciliation.
    // A missing end must never grant unlimited access to new monthly/annual sales.
    const endsAt = body.plan === 'existing' && (body.endsAt === null || body.endsAt === '')
        ? null : utcInput(body.endsAt, 'endsAt');
    const contentFrom = utcInput(body.contentFrom, 'contentFrom');
    if (endsAt !== null && instant(endsAt) <= instant(startsAt)) throw new ExperienceValidationError('endsAt');
    return { email, plan: body.plan, status: body.status, fullArchive: body.fullArchive,
        startsAt, endsAt, contentFrom, reason: text(body?.reason, 'reason', 500) };
};
