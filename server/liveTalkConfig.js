import crypto from "node:crypto";
import { normalizeWebinarRegistration, WebinarValidationError } from "./webinarValidation.js";
import { normalizeLiveAttribution } from "../shared/liveAttribution.js";
import { familyLecture } from "../shared/familyLecture.js";

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

export const liveTalk2 = Object.freeze({
    key: "live-drehbuch-2026-10-20", title: "Eine Stufe tiefer: Deine Erfahrungen mit Anteilen",
    startsAt: "2026-10-20T18:00:00.000Z",
    // Access cutoff, not an advertised duration. No end time has been promised.
    endsAt: "2026-10-20T22:00:00.000Z", timeZone: "Europe/Berlin", capacity: 98,
    label: "Dienstag, 20. Oktober 2026, um 20 Uhr deutscher Zeit",
    privacyVersion: "live-vortrag-2026-09-22", deleteAfter: "2027-01-18T22:00:00.000Z",
    accessPath: "/live-vortrag/20-oktober/zugang", confirmationSubject: "Deine Anmeldung: zweites Live am 20. Oktober",
    openEnd: true,
    // Explicitly approved on 18 October. Reuse the existing day/hour jobs.
    reminders: Object.freeze([
        { kind: "two_days", dueAt: "2026-10-18T10:00:00.000Z", expiresAt: "2026-10-18T22:00:00.000Z" },
        { kind: "day", dueAt: "2026-10-19T18:00:00.000Z", expiresAt: "2026-10-19T22:00:00.000Z" },
        { kind: "morning", dueAt: "2026-10-20T07:00:00.000Z", expiresAt: "2026-10-20T10:00:00.000Z" },
        { kind: "hour", dueAt: "2026-10-20T17:00:00.000Z", expiresAt: "2026-10-20T18:00:00.000Z" },
    ]),
});

export const liveTalkFamily = Object.freeze({
    ...familyLecture, capacity: 98, openEnd: true,
    privacyVersion: "family-live-2026-10-16", requiresRecordingNotice: true,
    accessPath: `${familyLecture.path}/zugang`,
    confirmationSubject: "Deine Anmeldung: Familienaufstellung am 27. Oktober",
});

export const normalizeLiveRegistration = (body, event = liveTalk) => {
    const result = normalizeWebinarRegistration({ ...body, slotId: "on-demand", locale: "de" });
    if (/[\r\n]/u.test(result.name)) throw new WebinarValidationError("name");
    if (event.requiresRecordingNotice && body?.recordingNoticeAccepted !== true) throw new WebinarValidationError("recordingNotice");
    return { ...result, attribution: normalizeLiveAttribution(body?.attribution, event.key) };
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

export const zoomMeetingIdFromJoinUrl = (value) => {
    const joinUrl = validateZoomJoinUrl(value);
    return joinUrl ? new URL(joinUrl).pathname.split("/").pop() : null;
};

export const validateZoomPasscode = (value) => {
    const passcode = String(value || "").trim();
    return /^[A-Za-z0-9@*_-]{1,32}$/u.test(passcode) ? passcode : null;
};

export const makeLiveToken = (id, secret, event = liveTalk) => {
    if (String(secret || "").length < 32) throw new Error("Live talk token secret missing");
    const payload = `${event.key}:${id}`;
    return `${id}.${crypto.createHmac("sha256", secret).update(payload).digest("base64url")}`;
};
export const readLiveToken = (token, secret, event = liveTalk) => {
    if (!/^\d{1,15}\.[\w-]{43}$/u.test(String(token || ""))) return null;
    const id = Number(token.split(".")[0]);
    if (!Number.isSafeInteger(id) || id < 1) return null;
    const expected = Buffer.from(makeLiveToken(id, secret, event));
    const supplied = Buffer.from(token);
    return expected.length === supplied.length && crypto.timingSafeEqual(expected, supplied) ? id : null;
};

export const liveMailSchedule = (now = new Date(), event = liveTalk) => {
    const start = new Date(event.startsAt).getTime();
    if (now.getTime() >= start) return [];
    return [
        { kind: "confirmation", dueAt: now },
        ...(event.reminders || [["day", 24], ["hour", 1]].map(([kind, hours]) => ({ kind, dueAt: new Date(start - hours * 3600000) }))).flatMap(({ kind, dueAt: date }) => {
            const dueAt = new Date(date);
            return dueAt > now ? [{ kind, dueAt }] : [];
        }),
    ];
};

export const liveReminderExpired = (kind, now, event = liveTalk) => {
    const reminder = event.reminders?.find(item => item.kind === kind);
    if (reminder) return now >= new Date(reminder.expiresAt);
    return kind === "day" && now >= new Date(new Date(event.startsAt).getTime() - 12 * 3600000);
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
const icsDate = value => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
export const liveCalendar = (joinUrl, event = liveTalk) => [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Spirit Healing//Live Vortrag//DE", "METHOD:PUBLISH",
    "BEGIN:VEVENT", `UID:${event.key}@spirit-healing.tr`, "DTSTAMP:20261006T000000Z",
    `DTSTART:${icsDate(event.startsAt)}`, ...(!event.openEnd ? [`DTEND:${icsDate(event.endsAt)}`] : []),
    `SUMMARY:${escapeIcs(event.title)}`, `LOCATION:${escapeIcs(joinUrl)}`,
    `DESCRIPTION:${escapeIcs("Mit Sabine und Selcan. Auf Deutsch. Dein Zoom-Zugang: " + joinUrl)}`,
    "END:VEVENT", "END:VCALENDAR", "",
].map(foldIcs).join("\r\n");

export const liveEmail = ({ name, kind, joinUrl, meetingId, passcode, manageUrl, event = liveTalk }) => {
    if (event.key === liveTalk2.key && kind !== "confirmation") {
        const variants = {
            two_days: { subject: "Am Dienstag sehen wir uns: dein zweiter Live-Abend", paragraphs: [
                "am Dienstag, 20. Oktober, um 20 Uhr deutscher Zeit treffen wir uns zu unserem zweiten Live-Abend. Du bist bereits angemeldet, und wir freuen uns auf dich.",
                "Seit unserem ersten Abend war unsere Einladung, die Anteile im Alltag zu beobachten. Vielleicht hast du eine vertraute Rolle bemerkt oder dich gefragt, warum du in einer Situation so reagiert hast. Genau dort knüpfen wir am Dienstag an und gehen gemeinsam eine Stufe tiefer.",
                "Wenn du magst, notiere dir bis dahin eine Beobachtung und eine Frage. Du musst nichts fertig bearbeitet haben. Auch wenn du gerade erst anfängst, diese Möglichkeit für dich zuzulassen, bist du willkommen.",
            ] },
            day: { subject: "Morgen um 20 Uhr: Wir freuen uns auf dich", paragraphs: [
                "morgen Abend um 20 Uhr deutscher Zeit sehen wir uns zu unserem zweiten Live.",
                "Nimm dir gern dein Workbook und wähle eine Situation aus: Was hast du bei dir beobachtet? Welche Rolle war dir vertraut? Was möchtest du besser verstehen? Bring deine Frage mit. Wir greifen eure Erfahrungen auf und schauen gemeinsam weiter.",
                "Du brauchst nichts vorzubereiten, was sich gerade nicht stimmig anfühlt. Du darfst auch einfach zuhören und erleben, was sich für dich zeigt.",
            ] },
            morning: { subject: "Heute Abend ist es so weit: um 20 Uhr sind wir live", paragraphs: [
                "heute Abend um 20 Uhr deutscher Zeit beginnt unser zweiter Live-Abend. Schön, dass du dabei bist.",
                "Leg dir für heute Abend gern dein Workbook und etwas zum Schreiben bereit. Deine Beobachtungen und Fragen dürfen mit in den Raum. Du musst keine fertigen Antworten mitbringen.",
                "Hier findest du deinen Zoom-Zugang für heute Abend. Eine Stunde vor Beginn erinnern wir dich noch einmal.",
            ] },
            hour: { subject: "In einer Stunde geht es los: dein Zoom-Zugang", paragraphs: [
                "in einer Stunde, um 20 Uhr deutscher Zeit, beginnt unser zweites Live. Wir freuen uns darauf, dich gleich zu sehen.",
                "Leg dir gern dein Workbook und etwas zum Schreiben bereit. Bring die Beobachtung oder Frage mit, die dich gerade beschäftigt. Wir greifen eure Erfahrungen auf und gehen gemeinsam eine Stufe tiefer.",
                "Über den folgenden Link kommst du direkt in unseren Zoom-Raum. Wir lassen dich zum Beginn aus dem Warteraum herein.",
            ] },
        };
        const copy = variants[kind];
        if (!copy) throw new Error("Unknown second-live reminder kind");
        return { subject: copy.subject, text: [
            `Hallo ${name},`, "", ...copy.paragraphs.flatMap(p => [p, ""]),
            event.title, event.label, "auf Deutsch · kostenlos", "",
            "Dein Zoom-Zugang:", joinUrl, "",
            "Wenn du Zoom lieber manuell öffnest:", `Meeting-ID: ${meetingId}`, `Kenncode: ${passcode}`, "",
            "Dein Mikrofon bleibt zunächst stumm. Du brauchst keine Vorkenntnisse und musst den ersten Vortrag nicht gesehen haben.", "",
            ...(kind === "two_days" || kind === "day" ? ["Falls du die Aufzeichnung oder dein Workbook noch einmal öffnen möchtest:", "https://spirit-healing.tr/live-vortrag/aufzeichnung", ""] : []),
            "Bitte gib deinen Zoom-Zugang nicht öffentlich weiter.", "", "Von Herzen", "Sabine & Selcan", "Spirit Healing", "",
            "Anmeldung ansehen oder absagen:", manageUrl, "",
            "Du erhältst diese Erinnerung zu deiner Vortragsanmeldung. Eine Newsletter-Anmeldung ist dafür nicht nötig.",
            "Bei Fragen: info@spirit-healing.tr",
        ].join("\n") };
    }
    const subject = kind === "day" ? "Morgen: dein Live-Vortrag mit Sabine & Selcan"
        : kind === "hour" ? "Gleich ist es so weit – wir freuen uns auf dich"
            : event.confirmationSubject || "Deine Anmeldung: Live-Vortrag am 6. Oktober";
    const intro = kind === "confirmation" ? "Du bist für unseren kostenlosen Live-Vortrag angemeldet."
        : kind === "day" ? "Morgen treffen wir uns live. Hier findest du deinen Zugang noch einmal."
            : "Gleich ist es so weit. In einer Stunde öffnen wir den Raum für unseren gemeinsamen Live-Abend.";
    const personalInvitation = kind === "hour" && event.key === liveTalkFamily.key ? [
        "Heute lernst du uns und unsere Aufstellungsarbeit kennen. Gemeinsam schauen wir auf familiäre Rollen, Verantwortung und den eigenen Platz. Du brauchst keine Vorkenntnisse.", "",
    ] : kind === "hour" && event.key === liveTalk2.key ? [
        "Leg dir gern dein Workbook und etwas zum Schreiben bereit. Bring eine Beobachtung oder Frage mit, die dich seit unserem ersten Vortrag beschäftigt. Wir greifen eure Erfahrungen auf und gehen gemeinsam eine Stufe tiefer.", "",
    ] : kind === "hour" ? [
        "Wir freuen uns sehr darauf, diesen Abend mit dir zu verbringen. Gemeinsam schauen wir auf deine persönliche Matrix, auf die Rollen und inneren Drehbücher, die dein Leben unbewusst mitgestalten, und auf den Weg zurück zu deinem Selbst und deiner Schöpferkraft.",
        "",
        "Vielleicht bringst du eine Frage mit, die dich gerade nicht loslässt. Vielleicht möchtest du einfach erleben, was geschieht, wenn du dein inneres Drehbuch aus einer neuen Perspektive betrachtest. Du musst nichts vorbereiten und keine Vorkenntnisse mitbringen. Komm genauso, wie du gerade bist.",
        "",
    ] : [];
    return { subject, text: [
        `Hallo ${name},`, "", intro, "", ...personalInvitation, event.title, event.label,
        "auf Deutsch · kostenlos", "",
        "Hier kommst du direkt in unseren Zoom-Raum:", joinUrl, "",
        "Wenn du Zoom lieber manuell öffnest:",
        `Meeting-ID: ${meetingId}`,
        `Kenncode: ${passcode}`, "",
        `${event.openEnd ? "" : "Plane etwa 60 Minuten ein. "}Wir lassen dich zum Beginn aus dem Warteraum herein. ${event.recordingNotice ? "Deine Kamera kann ausgeschaltet bleiben." : "Deine Kamera darf gerne eingeschaltet sein."} Dein Mikrofon bleibt zunächst stumm.`,
        ...(event.recordingNotice ? ["", event.recordingNotice] : []),
        "", ...(kind === "hour" ? ["Wir sind gespannt auf diesen gemeinsamen Abend und freuen uns darauf, dich gleich im Raum zu begrüßen."] : [event.key === liveTalkFamily.key ? "Du brauchst keine Vorkenntnisse und musst nichts vorbereiten." : "Du brauchst keine Vorkenntnisse und musst den aufgezeichneten Vortrag vorher nicht gesehen haben."]),
        "", "Falls die Schaltfläche nicht funktioniert, kopiere den vollständigen Zoom-Link in deinen Browser. Bitte gib deinen Zugang nicht öffentlich weiter.",
        "", "Von Herzen", "Sabine & Selcan", "Spirit Healing", "",
        "Anmeldung ansehen oder absagen:", manageUrl,
        "", "Du erhältst diese Nachricht zu deiner Vortragsanmeldung. Eine Newsletter-Anmeldung ist dafür nicht nötig.",
        "Bei Fragen: info@spirit-healing.tr",
    ].join("\n") };
};
