import crypto from "node:crypto";
import { normalizeWebinarRegistration, WebinarValidationError } from "./webinarValidation.js";

export const liveTalk = Object.freeze({
    key: "live-drehbuch-2026-10-06",
    title: "Wer schreibt dein inneres Drehbuch?",
    startsAt: "2026-10-06T17:30:00.000Z",
    endsAt: "2026-10-06T18:30:00.000Z",
    timeZone: "Europe/Berlin",
    capacity: 98,
    label: "Dienstag, 6. Oktober 2026, 19:30–20:30 Uhr deutscher Zeit",
    privacyVersion: "live-vortrag-2026-09-22",
    deleteAfter: "2027-01-04T18:30:00.000Z",
});

export const normalizeLiveRegistration = (body) => {
    const result = normalizeWebinarRegistration({ ...body, slotId: "on-demand", locale: "de" });
    if (/[\r\n]/u.test(result.name)) throw new WebinarValidationError("name");
    return result;
};

export const validateZoomJoinUrl = (value) => {
    try {
        const url = new URL(String(value || "").trim());
        if (url.protocol !== "https:" || url.username || url.password || url.port
            || !/(^|\.)zoom\.us$/u.test(url.hostname) || !/^\/j\/\d{9,11}$/u.test(url.pathname)
            || !url.searchParams.get("pwd") || url.searchParams.has("zak")) return null;
        for (const key of [...url.searchParams.keys()]) if (key !== "pwd") url.searchParams.delete(key);
        url.hash = "";
        return url.href;
    } catch { return null; }
};

export const makeLiveToken = (id, secret) => {
    if (String(secret || "").length < 32) throw new Error("Live talk token secret missing");
    const payload = `${liveTalk.key}:${id}`;
    return `${id}.${crypto.createHmac("sha256", secret).update(payload).digest("base64url")}`;
};
export const readLiveToken = (token, secret) => {
    if (!/^\d{1,15}\.[\w-]{43}$/u.test(String(token || ""))) return null;
    const id = Number(token.split(".")[0]);
    if (!Number.isSafeInteger(id) || id < 1) return null;
    const expected = Buffer.from(makeLiveToken(id, secret));
    const supplied = Buffer.from(token);
    return expected.length === supplied.length && crypto.timingSafeEqual(expected, supplied) ? id : null;
};

export const liveMailSchedule = (now = new Date()) => {
    const start = new Date(liveTalk.startsAt).getTime();
    if (now.getTime() >= start) return [];
    return [
        { kind: "confirmation", dueAt: now },
        ...[["day", 24], ["hour", 1]].flatMap(([kind, hours]) => {
            const dueAt = new Date(start - hours * 3600000);
            return dueAt > now ? [{ kind, dueAt }] : [];
        }),
    ];
};

const escapeIcs = (s) => String(s).replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
const foldIcs = (line) => {
    let result = "", size = 0;
    for (const char of line) {
        const bytes = Buffer.byteLength(char);
        if (size + bytes > 74) { result += "\r\n "; size = 1; }
        result += char; size += bytes;
    }
    return result;
};
export const liveCalendar = (joinUrl) => [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Spirit Healing//Live Vortrag//DE", "METHOD:PUBLISH",
    "BEGIN:VEVENT", `UID:${liveTalk.key}@spirit-healing.tr`, "DTSTAMP:20260922T000000Z",
    "DTSTART:20261006T173000Z", "DTEND:20261006T183000Z",
    `SUMMARY:${escapeIcs(liveTalk.title)}`, `LOCATION:${escapeIcs(joinUrl)}`,
    `DESCRIPTION:${escapeIcs("Mit Sabine und Selcan. Auf Deutsch. Dein Zoom-Zugang: " + joinUrl)}`,
    "END:VEVENT", "END:VCALENDAR", "",
].map(foldIcs).join("\r\n");

export const liveEmail = ({ name, kind, joinUrl, manageUrl }) => {
    const subject = kind === "day" ? "Morgen: dein Live-Vortrag mit Sabine & Selcan"
        : kind === "hour" ? "In einer Stunde beginnt unser Live-Vortrag"
            : "Deine Anmeldung: Live-Vortrag am 6. Oktober";
    const intro = kind === "confirmation" ? "Du bist für unseren kostenlosen Live-Vortrag angemeldet."
        : kind === "day" ? "Morgen treffen wir uns live. Hier findest du deinen Zugang noch einmal."
            : "Um 19:30 Uhr deutscher Zeit beginnt unser gemeinsamer Abend. Hier ist dein Zugang.";
    return { subject, text: [
        `Hallo ${name},`, "", intro, "", liveTalk.title, liveTalk.label,
        "auf Deutsch · kostenlos", "",
        "Zum Live-Vortrag in Zoom:", joinUrl, "",
        "Plane etwa 60 Minuten ein. Wir lassen dich zum Beginn aus dem Warteraum herein. Kamera und Mikrofon kannst du zunächst ausgeschaltet lassen.",
        "", "Du brauchst keine Vorkenntnisse und musst den aufgezeichneten Vortrag vorher nicht gesehen haben.",
        "", "Falls die Schaltfläche nicht funktioniert, kopiere den vollständigen Zoom-Link in deinen Browser. Bitte gib deinen Zugang nicht öffentlich weiter.",
        "", "Von Herzen", "Sabine & Selcan", "Spirit Healing", "",
        "Anmeldung ansehen oder absagen:", manageUrl,
        "", "Du erhältst diese Nachricht zu deiner Vortragsanmeldung. Eine Newsletter-Anmeldung ist dafür nicht nötig.",
        "Bei Fragen: info@spirit-healing.tr",
    ].join("\n") };
};
