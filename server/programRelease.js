export const zepterFirstReleaseAt = "2026-08-19T23:00:00.000Z";

export const isProgramWeekLocked = ({
    published,
    weekNumber,
    releaseOn,
    participantAccessEnabled = true,
    now = new Date(),
}) => {
    if (!published) return true;
    if (weekNumber === 1) return now.getTime() < Date.parse(zepterFirstReleaseAt);
    if (!participantAccessEnabled) return true;

    const todayInIstanbul = new Intl.DateTimeFormat("en", {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(now);
    const values = Object.fromEntries(todayInIstanbul.map((part) => [part.type, part.value]));
    const today = `${values.year}-${values.month}-${values.day}`;
    return releaseOn > today;
};
