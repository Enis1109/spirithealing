export const getWebinarEmailCopy = ({ reminder = false, onDemand = false, slotLabel, closesAt }) => {
    if (onDemand) {
        const expiry = new Intl.DateTimeFormat("de-DE", {
            timeZone: "Europe/Berlin", dateStyle: "full", timeStyle: "short",
        }).format(new Date(closesAt));
        return {
            subject: "Dein Zugang: Wer schreibt dein inneres Drehbuch?",
            headline: "Dein Vortrag ist freigeschaltet",
            intro: "Du kannst den aufgezeichneten Online-Vortrag „Wer schreibt dein inneres Drehbuch?“ jetzt ansehen. Dein persönlicher Zugang gilt sieben Tage ab der Anmeldung.",
            accessLabel: `Zugang bis ${expiry} Uhr (deutsche Zeit)`,
            button: "Vortrag jetzt ansehen",
            note: "Bewahre diese E-Mail auf. Über denselben Link kannst du den Vortrag während dieser sieben Tage erneut öffnen. Die Aufnahme dauert etwa 36 Minuten. Eine Newsletter-Anmeldung ist für den Zugang nicht erforderlich.",
        };
    }
    return {
        subject: reminder ? "In einer Stunde: Wer schreibt dein inneres Drehbuch?" : "Dein Zugang: Wer schreibt dein inneres Drehbuch?",
        headline: reminder ? "In einer Stunde beginnt dein Vortrag" : "Dein Termin ist reserviert",
        intro: reminder
            ? "Über deinen persönlichen Link kommst du direkt zum Vortrag „Wer schreibt dein inneres Drehbuch?“. Du kannst die Seite schon jetzt öffnen."
            : "Dein Termin für den Online-Vortrag „Wer schreibt dein inneres Drehbuch?“ ist reserviert:",
        accessLabel: slotLabel,
        button: reminder ? "Zum Vortrag" : "Persönlichen Zugang öffnen",
        note: "Der Link führt dich zu deiner persönlichen Vortragsseite und gilt für den von dir gewählten Termin.",
    };
};
