const DEFAULT_TIME_ZONE = "Europe/Berlin";
const DEFAULT_SLOT_HOURS = "08:00,09:00,10:00,11:00,12:00,13:00,14:00,15:00,16:00,17:00,18:00,19:00,20:00,21:00,22:00";
const DEFAULT_DAYS_AHEAD = 7;
const DEFAULT_FIRST_DATE = "2026-09-03";
const DEFAULT_FIRST_DAY_START_TIME = "08:00";
const DEFAULT_MIN_LEAD_MINUTES = 15;
const DEFAULT_ACCESS_EARLY_MINUTES = 5;
const DEFAULT_ACCESS_WINDOW_MINUTES = 240;
const DEFAULT_VIDEO_URL = "https://vimeo.com/1223574981/ad820715ad";

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

const normalizeCalendarDate = (value) => {
    const candidate = String(value || DEFAULT_FIRST_DATE).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(candidate)) return DEFAULT_FIRST_DATE;
    const parsed = new Date(`${candidate}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== candidate
        ? DEFAULT_FIRST_DATE
        : candidate;
};

const calendarDateKey = (date) => [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
].join("-");

export const normalizeWebinarEmbedUrl = (value) => {
    if (!value) return "";
    try {
        const url = new URL(value);
        const hostname = url.hostname.toLowerCase();
        if (url.protocol === "https:" && (hostname === "vimeo.com" || hostname === "www.vimeo.com")) {
            const match = url.pathname.match(/^\/(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/u);
            if (!match) return "";
            const embedUrl = new URL(`https://player.vimeo.com/video/${match[1]}`);
            if (match[2]) embedUrl.searchParams.set("h", match[2]);
            embedUrl.searchParams.set("dnt", "1");
            embedUrl.searchParams.set("title", "0");
            embedUrl.searchParams.set("byline", "0");
            embedUrl.searchParams.set("portrait", "0");
            return embedUrl.toString();
        }
        const allowed = hostname === "player.vimeo.com"
            || hostname === "www.youtube-nocookie.com"
            || hostname === "www.youtube.com";
        return url.protocol === "https:" && allowed ? url.toString() : "";
    } catch {
        return "";
    }
};

export const getWebinarConfig = (environment = process.env) => {
    const slotHours = parseSlotHours(environment.WEBINAR_START_TIMES);
    return {
        eventKey: "zepter-13-webinar",
        title: "Wer schreibt dein inneres Drehbuch? – der Online-Vortrag",
        timeZone: environment.WEBINAR_TIME_ZONE || DEFAULT_TIME_ZONE,
        slotHours: slotHours.length > 0 ? slotHours : parseSlotHours(DEFAULT_SLOT_HOURS),
        daysAhead: clampInteger(environment.WEBINAR_DAYS_AHEAD, DEFAULT_DAYS_AHEAD, 1, 31),
        firstDate: normalizeCalendarDate(environment.WEBINAR_FIRST_DATE),
        firstDayStartTime: parseSlotHours(
            environment.WEBINAR_FIRST_DAY_START_TIME || DEFAULT_FIRST_DAY_START_TIME,
        )[0] || DEFAULT_FIRST_DAY_START_TIME,
        minLeadMinutes: clampInteger(
            environment.WEBINAR_MIN_LEAD_MINUTES,
            DEFAULT_MIN_LEAD_MINUTES,
            0,
            1440,
        ),
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
        embedUrl: normalizeWebinarEmbedUrl(environment.WEBINAR_VIDEO_EMBED_URL || DEFAULT_VIDEO_URL),
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
    const earliestStart = new Date(now.getTime() + config.minLeadMinutes * 60_000);
    let offeredDays = 0;

    for (let dayOffset = 0; offeredDays < config.daysAhead && dayOffset < 400; dayOffset += 1) {
        const calendarDate = new Date(Date.UTC(
            localToday.year,
            localToday.month - 1,
            localToday.day + dayOffset,
        ));
        const dateKey = calendarDateKey(calendarDate);
        if (dateKey < config.firstDate) continue;

        const daySlots = [];

        for (const slotHour of config.slotHours) {
            if (dateKey === config.firstDate && slotHour < config.firstDayStartTime) continue;
            const [hour, minute] = slotHour.split(":").map(Number);
            const startsAt = zonedDateTimeToUtc({
                year: calendarDate.getUTCFullYear(),
                month: calendarDate.getUTCMonth() + 1,
                day: calendarDate.getUTCDate(),
                hour,
                minute,
            }, config.timeZone);
            if (startsAt <= earliestStart) continue;
            daySlots.push(formatSlot(startsAt, config));
        }

        if (daySlots.length === 0) continue;
        slots.push(...daySlots);
        offeredDays += 1;
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
