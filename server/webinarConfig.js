const DEFAULT_TIME_ZONE = "Europe/Berlin";
const DEFAULT_SLOT_HOURS = "10:00,14:00,18:00,20:00";
const DEFAULT_DAYS_AHEAD = 7;
const DEFAULT_ACCESS_EARLY_MINUTES = 5;
const DEFAULT_ACCESS_WINDOW_MINUTES = 240;

const dateTimeFormatter = (timeZone) => new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
});

const getZonedParts = (date, timeZone) => Object.fromEntries(
    dateTimeFormatter(timeZone)
        .formatToParts(date)
        .filter(({ type }) => type !== "literal")
        .map(({ type, value }) => [type, Number(value)]),
);

const zonedDateTimeToUtc = ({ year, month, day, hour, minute }, timeZone) => {
    const desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    let candidate = desiredAsUtc;

    for (let attempt = 0; attempt < 4; attempt += 1) {
        const parts = getZonedParts(new Date(candidate), timeZone);
        const representedAsUtc = Date.UTC(
            parts.year,
            parts.month - 1,
            parts.day,
            parts.hour,
            parts.minute,
            parts.second,
        );
        const correction = desiredAsUtc - representedAsUtc;
        candidate += correction;
        if (correction === 0) break;
    }

    return new Date(candidate);
};
const parseSlotHours = (value) => {
    const seen = new Set();
    return String(value || DEFAULT_SLOT_HOURS)
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => /^([01]\d|2[0-3]):[0-5]\d$/u.test(entry))
        .filter((entry) => {
            if (seen.has(entry)) return false;
            seen.add(entry);
            return true;
        })
        .sort();
};

const clampInteger = (value, fallback, minimum, maximum) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) return fallback;
    return Math.min(maximum, Math.max(minimum, parsed));
};

export const normalizeWebinarEmbedUrl = (value) => {
    if (!value) return "";
    try {
        const url = new URL(value);
        const hostname = url.hostname.toLowerCase();
        const allowed = hostname === "player.vimeo.com"
            || hostname === "www.youtube-nocookie.com"
            || hostname === "www.youtube.com";
        return url.protocol === "https:" && allowed ? url.toString() : "";
    } catch {
        return "";
    }
};

export const getWebinarConfig = (environment = process.env) => {
    const slotHours = parseSlotHours(environment.WEBINAR_SLOT_HOURS);
    return {
        eventKey: "zepter-13-webinar",
        title: "Das Zepter wieder übernehmen – der Online-Vortrag",
        timeZone: environment.WEBINAR_TIME_ZONE || DEFAULT_TIME_ZONE,
        slotHours: slotHours.length > 0 ? slotHours : parseSlotHours(DEFAULT_SLOT_HOURS),
        daysAhead: clampInteger(environment.WEBINAR_DAYS_AHEAD, DEFAULT_DAYS_AHEAD, 1, 31),
        accessEarlyMinutes: clampInteger(
            environment.WEBINAR_ACCESS_EARLY_MINUTES,
            DEFAULT_ACCESS_EARLY_MINUTES,
            0,
            60,
        ),
        accessWindowMinutes: clampInteger(
            environment.WEBINAR_ACCESS_WINDOW_MINUTES,
            DEFAULT_ACCESS_WINDOW_MINUTES,
            30,
            1440,
        ),
        embedUrl: normalizeWebinarEmbedUrl(environment.WEBINAR_VIDEO_EMBED_URL),
    };
};

const formatSlot = (startsAt, config) => {
    const dateLabel = new Intl.DateTimeFormat("de-DE", {
        timeZone: config.timeZone,
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(startsAt);
    const timeLabel = new Intl.DateTimeFormat("de-DE", {
        timeZone: config.timeZone,
        hour: "2-digit",
        minute: "2-digit",
    }).format(startsAt);

    return {
        id: startsAt.toISOString(),
        startsAt: startsAt.toISOString(),
        dateLabel,
        timeLabel,
        label: `${dateLabel} um ${timeLabel} Uhr`,
    };
};

export const buildWebinarSlots = ({
    now = new Date(),
    config = getWebinarConfig(),
} = {}) => {
    const localToday = getZonedParts(now, config.timeZone);
    const slots = [];

    for (let dayOffset = 1; dayOffset <= config.daysAhead; dayOffset += 1) {
        const calendarDate = new Date(Date.UTC(
            localToday.year,
            localToday.month - 1,
            localToday.day + dayOffset,
        ));

        for (const slotHour of config.slotHours) {
            const [hour, minute] = slotHour.split(":").map(Number);
            const startsAt = zonedDateTimeToUtc({
                year: calendarDate.getUTCFullYear(),
                month: calendarDate.getUTCMonth() + 1,
                day: calendarDate.getUTCDate(),
                hour,
                minute,
            }, config.timeZone);
            slots.push(formatSlot(startsAt, config));
        }
    }

    return slots;
};

export const getWebinarAccessState = ({ startsAt, now = new Date(), config = getWebinarConfig() }) => {
    const start = new Date(startsAt);
    const opensAt = new Date(start.getTime() - config.accessEarlyMinutes * 60_000);
    const closesAt = new Date(start.getTime() + config.accessWindowMinutes * 60_000);

    if (now < opensAt) return { state: "scheduled", opensAt, closesAt };
    if (now <= closesAt) return { state: "open", opensAt, closesAt };
    return { state: "expired", opensAt, closesAt };
};
