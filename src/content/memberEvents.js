// Dates and wording match the published Berlin and live-talk pages (27 September 2026).
// Weekly group: Sunday 19:00–21:30 German time, confirmed by Sabine on 6 October 2026.
export const memberEvents = [
    {
        id: "live-talk-2026-10-06",
        endsAt: "2026-10-06T18:30:00Z",
        href: "/live-vortrag",
        de: {
            kind: "Kostenloser Live-Vortrag",
            title: "Wer schreibt dein inneres Drehbuch?",
            date: "Dienstag, 6. Oktober 2026",
            time: "19:30–20:30 Uhr · deutsche Zeit",
            place: "Online über Zoom · auf Deutsch",
            text: "Deine persönliche Matrix erkennen. Deinem Selbst das Zepter zurückgeben. Mit einer kurzen freiwilligen Übung, Zeit für Fragen und einem Einblick in unser 13-Wochen-Programm.",
            action: "Kostenlos zum Live-Vortrag anmelden",
        },
        tr: {
            kind: "Ücretsiz canlı seminer",
            title: "İçindeki senaryoyu kim yazıyor?",
            date: "6 Ekim 2026 Salı",
            time: "19:30–20:30 · Almanya saati",
            place: "Zoom üzerinden · Almanca",
            text: "Kişisel matrisini fark et. Asayı yeniden Öz Benliğine ver. Kısa ve gönüllü bir çalışma, soruların için zaman ve 13 haftalık programımıza bir giriş.",
            action: "Ücretsiz canlı seminere kaydol",
        },
    },
    {
        id: "berlin-2026-10",
        endsAt: "2026-10-10T17:00:00Z",
        href: "/berlin-live",
        de: {
            kind: "Zweitägiges Intensivseminar",
            title: "Familienaufstellung in Berlin-Kreuzberg",
            date: "9. und 10. Oktober 2026",
            time: "Jeweils 10–19 Uhr · deutsche Zeit",
            place: "Berlin-Kreuzberg · auf Deutsch",
            text: "Wir verbinden familiensystemische Aufstellungsarbeit mit Anteilearbeit und Energiearbeit. Sabine und Selcan begleiten jede Aufstellung gemeinsam. Du kannst mit eigener Aufstellung oder als Stellvertretung teilnehmen.",
            action: "Seminar und Teilnahme ansehen",
        },
        tr: {
            kind: "İki günlük yoğun seminer",
            title: "Berlin-Kreuzberg’de aile dizimi",
            date: "9 ve 10 Ekim 2026",
            time: "Her iki gün 10:00–19:00 · Almanya saati",
            place: "Berlin-Kreuzberg · Almanca",
            text: "Aile dizimini içsel parçalar çalışması ve enerji çalışmasıyla birleştiriyoruz. Sabine ve Selcan her dizime birlikte rehberlik ediyor. Kendi diziminle veya temsilci olarak katılabilirsin.",
            action: "Semineri ve katılım seçeneklerini incele",
        },
    },
    {
        id: "zepter-13-2026",
        endsAt: "2027-02-03T22:59:59Z",
        href: "/13-wochen-programm",
        de: {
            kind: "13-Wochen-Programm",
            title: "Du spielst die Hauptrolle. Doch wer schreibt dein Drehbuch?",
            date: "Onboarding ab 21. Oktober 2026 · Programm bis 3. Februar 2027",
            time: "13 Wochen ab 11. November 2026",
            place: "Mit Sabine & Selcan",
            text: "Erkenne, welche unbewusste Matrix deine Rollen, Beziehungen und Entscheidungen lenkt. Mit persönlichem Matrix-Gespräch, täglicher energetischer Begleitung und vollständigem Rauhnachtsprogramm.",
            action: "13-Wochen-Programm entdecken",
        },
        tr: {
            kind: "13 haftalık program",
            title: "Başrolde sensin. Peki senaryonu kim yazıyor?",
            date: "Başlangıç süreci 21 Ekim 2026 · Ana program 3 Şubat 2027’ye kadar",
            time: "13 hafta, 11 Kasım 2026’dan itibaren",
            place: "Sabine ve Selcan ile",
            text: "Rollerini, ilişkilerini ve kararlarını yönlendiren bilinçdışı matrisi fark et. Kişisel matris görüşmesi, günlük enerjetik eşlik ve eksiksiz Rauhnächte programıyla.",
            action: "13 haftalık programı keşfet",
        },
    },
    {
        id: "weekly-experience-group",
        href: "/kontakt",
        de: {
            kind: "Wöchentlich gemeinsam",
            title: "Unsere Erfahrungsgruppe",
            date: "Jeden Sonntag",
            time: "19:00–21:30 Uhr · deutsche Zeit",
            place: "Online über Zoom",
            text: "Ein gemeinsamer Raum für angeleitete Selbsterfahrung, Anteilearbeit und Austausch. Wir kommen an, widmen uns dem Thema des Abends und vertiefen es in Übungen und gemeinsamer Reflexion.",
            action: "Teilnahme erfragen",
        },
        tr: {
            kind: "Her hafta birlikte",
            title: "Deneyim grubumuz",
            date: "Her pazar",
            time: "19:00–21:30 · Almanya saati",
            place: "Zoom üzerinden",
            text: "Rehberli öz deneyim, içsel parçalar çalışması ve paylaşım için ortak bir alan. Birlikte akşamın konusuna yöneliyor, çalışmalar ve ortak değerlendirmeyle derinleşiyoruz.",
            action: "Katılım bilgilerini sor",
        },
    },
];

export const getUpcomingMemberEvents = (now = new Date()) => memberEvents.filter(
    (event) => !event.endsAt || Date.parse(event.endsAt) > now.getTime(),
);
