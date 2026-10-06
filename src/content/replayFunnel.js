// Hosts-only replacement and new thumbnail confirmed in the video task on 6 October.
export const replayFunnel = Object.freeze({
    path: "/live-vortrag/aufzeichnung", title: "Wer schreibt dein inneres Drehbuch?",
    image: "/images/live-drehbuch-2026-10-06.jpg",
    workbook: "/downloads/Spirit-Healing-Workbook-Eine-neue-Perspektive.pdf",
    videoUrl: "https://player.vimeo.com/video/1233482544?dnt=1", nextLivePath: "/live-vortrag/20-oktober", nextLiveStartsAt: "2026-10-20T18:00:00Z",
});
export const berlinDate = (now = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
export const publicEvents = [
    { id: "july-recording", date: "2026-07-26", title: "Wer entscheidet eigentlich dein Leben?", detail: "Vortrag mit Workbook im kostenlosen Mitgliederbereich", href: "/gratis-meditationen", replay: true },
    { id: "october-recording", date: "2026-10-06", time: "19:30", title: replayFunnel.title, detail: "Erster Live-Abend mit Sabine & Selcan · Aufzeichnungsbereich und Workbook", href: replayFunnel.path, replay: true },
    { id: "berlin", date: "2026-10-09", lastDate: "2026-10-10", time: "10–19", title: "Intensivseminar für Familienaufstellung", detail: "9. und 10. Oktober · Berlin-Kreuzberg", href: "/berlin-live" },
    { id: "second-live", date: "2026-10-20", time: "20:00", title: "Eine Stufe tiefer: Deine Erfahrungen mit Anteilen", detail: "Zweiter Live-Abend mit Sabine & Selcan · online", href: replayFunnel.nextLivePath },
    { id: "onboarding", date: "2026-10-21", title: "Dein Einstieg ins 13-Wochen-Programm", detail: "Beginn des Onboardings und der persönlichen Matrix-Gespräche", href: "/13-wochen-programm" },
    { id: "program-start", date: "2026-11-11", title: "Gemeinsamer Start des 13-Wochen-Programms", detail: "Begleiteter Prozess bis zum 3. Februar 2027", href: "/13-wochen-programm" },
    { id: "rauhnaechte", date: "2026-12-23", lastDate: "2027-01-06", title: "Rauhnächte mit Sabine & Selcan", detail: "23. Dezember 2026 bis 6. Januar 2027", href: "/rauhnaechte" },
];
const weeklyGroupOnDay = day => new Date(`${day}T12:00:00Z`).getUTCDay() === 0 ? [{
    id: `experience-${day}`, date: day, time: "19:00–21:30", title: "Erfahrungsgruppe",
    detail: "Jeden Sonntag · Online über Zoom", href: "/mitglieder?tab=experience", action: "Zur Erfahrungsgruppe",
}] : [];
export const eventsOnDay = day => [...publicEvents.filter(event => event.date <= day && (event.lastDate || event.date) >= day), ...weeklyGroupOnDay(day)];
export const eventsInMonth = month => {
    const [year, monthNumber] = month.split("-").map(Number);
    const days = monthCells(year, monthNumber - 1).filter(Boolean);
    return [...publicEvents.filter(event => event.date <= days.at(-1) && (event.lastDate || event.date) >= days[0]), ...days.flatMap(weeklyGroupOnDay)]
        .sort((a, b) => a.date.localeCompare(b.date));
};
export const eventIsPast = (event, now = new Date()) => (event.lastDate || event.date) < berlinDate(now);
export const monthCells = (year, month) => {
    const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = Array(offset).fill(null);
    for (let day = 1; day <= count; day++) cells.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    while (cells.length % 7) cells.push(null);
    return cells;
};
