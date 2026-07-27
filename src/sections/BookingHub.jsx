import { ArrowRight, CalendarDays, CalendarRange, HeartHandshake, MessageCircle, UserRound, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const bookingLinks = {
    intro: "https://spirit4healing.simplybook.me/v2/#book/service/2/count/1/",
    single: "https://spirit4healing.simplybook.me/v2/#book/service/3/count/1/",
    combined: "https://spirit4healing.simplybook.me/v2/#book/service/4/count/1/",
    packages: "https://spirit4healing.simplybook.me/v2/#packages",
};

const copy = {
    de: {
        eyebrow: "Termin buchen",
        title: "Was ist für dich der passende nächste Schritt?",
        intro: "Wähle zuerst die Art des Termins. Anschließend kannst du direkt einen freien Zeitpunkt auswählen.",
        choose: "Termin auswählen",
        rescheduling: "Kostenfreie Umbuchung bis 48 Stunden vor dem Termin",
        options: [
            {
                icon: MessageCircle,
                title: "Kostenfrei kennenlernen",
                text: "15 Minuten für dein Anliegen, deine Fragen und ein erstes Gefühl für die Zusammenarbeit.",
                price: "Kostenfrei · 15 Min.",
                people: [
                    ["Mit Sabine", bookingLinks.intro],
                    ["Mit Selcan", bookingLinks.intro],
                ],
            },
            {
                icon: UserRound,
                title: "Einzelsitzung beginnen",
                text: "Ein fundierter Einstieg in ein persönliches, emotionales oder beziehungsbezogenes Thema.",
                price: "222 € · 60 Min.",
                people: [
                    ["Erstsitzung mit Sabine", bookingLinks.single],
                    ["Erstsitzung mit Selcan", bookingLinks.single],
                ],
            },
            {
                icon: UsersRound,
                title: "Gemeinsame Begleitung",
                text: "Sabine und Selcan begleiten dein Thema gemeinsam aus mehreren fachlichen Perspektiven.",
                price: "333 € · 60 Min.",
                people: [
                    ["Gemeinsame Erstsitzung", bookingLinks.combined],
                ],
            },
        ],
        moreTitle: "Folgesitzung oder Intensivtermin?",
        moreText: "Alle weiteren Terminarten, Preise und Details findest du in der vollständigen Übersicht.",
        moreLink: "Alle Preise & Termine",
        unsure: "Du bist noch unsicher? Schreib uns kurz – wir empfehlen dir persönlich den passenden Einstieg.",
        contact: "Nachricht senden",
        programsEyebrow: "Längerfristige Begleitung",
        programsTitle: "Veränderung braucht manchmal einen verlässlichen Rahmen",
        programsIntro: "Unsere Begleitprogramme werden gerade ausgearbeitet. Du kannst dich bereits unverbindlich vormerken lassen; Umfang, Rhythmus und Preis stimmen wir anschließend persönlich mit dir ab.",
        programs: [
            {
                icon: CalendarRange,
                title: "3-monatige Begleitung",
                text: "Ein überschaubarer, verbindlicher Zeitraum für ein konkretes Thema und die Integration neuer Schritte in den Alltag.",
                status: "Ablauf & Preis in Vorbereitung",
            },
            {
                icon: HeartHandshake,
                title: "6-monatige Begleitung",
                text: "Ein stabiler Prozessraum für tieferliegende Muster, nachhaltige Entwicklung und kontinuierliche persönliche Begleitung.",
                status: "Ablauf & Preis in Vorbereitung",
            },
        ],
        programsCta: "Interesse unverbindlich vormerken",
        packagesEyebrow: "Sitzungspakete",
        packagesTitle: "Mehrere Sitzungen verbindlich planen",
        packagesIntro: "Buche mehrere Sitzungen gemeinsam und sichere dir je nach Paket 10 % oder 15 % Preisvorteil.",
        packages: [
            { title: "3er-Paket Einzelsitzungen", basis: "599,40 €", discount: "10 % Rabatt", text: "Drei persönliche Sitzungen mit Sabine oder Selcan statt 666 €." },
            { title: "5er-Paket Einzelsitzungen", basis: "943,50 €", discount: "15 % Rabatt", text: "Fünf persönliche Sitzungen mit Sabine oder Selcan statt 1.110 €." },
            { title: "3er-Paket Kombisitzungen", basis: "899,10 €", discount: "10 % Rabatt", text: "Drei gemeinsame Sitzungen mit Sabine und Selcan statt 999 €." },
            { title: "5er-Paket Kombisitzungen", basis: "1.415,25 €", discount: "15 % Rabatt", text: "Fünf gemeinsame Sitzungen mit Sabine und Selcan statt 1.665 €." },
        ],
        packageCta: "Paket buchen",
    },
    tr: {
        eyebrow: "Randevu al",
        title: "Senin için uygun bir sonraki adım hangisi?",
        intro: "Önce görüşme türünü seç. Ardından doğrudan uygun bir zaman belirleyebilirsin.",
        choose: "Randevu seç",
        rescheduling: "Randevudan 48 saat öncesine kadar ücretsiz tarih değişikliği",
        options: [
            {
                icon: MessageCircle,
                title: "Ücretsiz tanışma",
                text: "Konun, soruların ve birlikte çalışmanın sana uygun olup olmadığını hissetmek için 15 dakika.",
                price: "Ücretsiz · 15 dk.",
                people: [
                    ["Sabine ile", bookingLinks.intro],
                    ["Selcan ile", bookingLinks.intro],
                ],
            },
            {
                icon: UserRound,
                title: "Bireysel seansa başla",
                text: "Kişisel, duygusal veya ilişki odaklı bir konuya sağlam bir başlangıç.",
                price: "222 € · 60 dk.",
                people: [
                    ["Sabine ile ilk seans", bookingLinks.single],
                    ["Selcan ile ilk seans", bookingLinks.single],
                ],
            },
            {
                icon: UsersRound,
                title: "Ortak çalışma",
                text: "Sabine ve Selcan konuna farklı uzmanlık perspektiflerinden birlikte eşlik eder.",
                price: "333 € · 60 dk.",
                people: [
                    ["Ortak ilk seans", bookingLinks.combined],
                ],
            },
        ],
        moreTitle: "Devam seansı veya yoğun çalışma mı?",
        moreText: "Diğer tüm randevu türlerini, ücretleri ve ayrıntıları tam genel bakışta bulabilirsin.",
        moreLink: "Tüm ücretler ve randevular",
        unsure: "Emin değil misin? Bize kısaca yaz; sana uygun başlangıcı kişisel olarak önerelim.",
        contact: "Mesaj gönder",
        programsEyebrow: "Uzun süreli destek",
        programsTitle: "Değişim bazen güvenilir bir çerçeveye ihtiyaç duyar",
        programsIntro: "Destek programlarımız şu anda hazırlanıyor. Şimdiden bağlayıcı olmadan ilgini bildirebilirsin; kapsamı, görüşme sıklığını ve ücreti daha sonra seninle birlikte netleştiririz.",
        programs: [
            {
                icon: CalendarRange,
                title: "3 aylık destek",
                text: "Belirli bir konuya odaklanmak ve yeni adımları günlük yaşama yerleştirmek için yönetilebilir, güvenilir bir süreç.",
                status: "İçerik ve ücret hazırlanıyor",
            },
            {
                icon: HeartHandshake,
                title: "6 aylık destek",
                text: "Daha derin örüntüler, kalıcı gelişim ve sürekli kişisel destek için istikrarlı bir süreç alanı.",
                status: "İçerik ve ücret hazırlanıyor",
            },
        ],
        programsCta: "Bağlayıcı olmadan ilgini bildir",
        packagesEyebrow: "Seans paketleri",
        packagesTitle: "Birden fazla seansı planlı şekilde ilerlet",
        packagesIntro: "Birden fazla seansı birlikte al ve pakete göre %10 veya %15 fiyat avantajından yararlan.",
        packages: [
            { title: "3'lü bireysel seans paketi", basis: "599,40 €", discount: "%10 indirim", text: "Sabine veya Selcan ile üç bireysel seans; 666 € yerine." },
            { title: "5'li bireysel seans paketi", basis: "943,50 €", discount: "%15 indirim", text: "Sabine veya Selcan ile beş bireysel seans; 1.110 € yerine." },
            { title: "3'lü ortak seans paketi", basis: "899,10 €", discount: "%10 indirim", text: "Sabine ve Selcan ile üç ortak seans; 999 € yerine." },
            { title: "5'li ortak seans paketi", basis: "1.415,25 €", discount: "%15 indirim", text: "Sabine ve Selcan ile beş ortak seans; 1.665 € yerine." },
        ],
        packageCta: "Paketi al",
    },
};

export const BookingHub = () => {
    const { language } = useLanguage();
    const content = copy[language];

    return (
        <main data-no-translate className="min-h-screen bg-card pb-16 pt-24 text-white sm:pt-28">
            <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_42%)]">
                <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                        <CalendarDays className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <p className="mt-6 font-semibold uppercase tracking-[0.2em] text-primary">{content.eyebrow}</p>
                    <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">{content.title}</h1>
                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">{content.intro}</p>
                    <p className="mx-auto mt-5 inline-flex rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{content.rescheduling}</p>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
                {content.options.map((option) => {
                    const Icon = option.icon;
                    return (
                        <article key={option.title} className="glass-strong flex flex-col rounded-3xl p-6 shadow-xl shadow-black/10">
                            <div className="flex items-start justify-between gap-4">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                                    <Icon className="h-6 w-6" aria-hidden="true" />
                                </span>
                                <span className="rounded-full bg-muted/10 px-3 py-1 text-sm font-bold text-muted-foreground">{option.price}</span>
                            </div>
                            <h2 className="mt-6 text-2xl font-bold text-muted-foreground">{option.title}</h2>
                            <p className="mt-3 flex-1 leading-7 text-muted-foreground/80">{option.text}</p>
                            <div className="mt-6 space-y-3 border-t border-muted-foreground/15 pt-5">
                                {option.people.map(([label, url]) => (
                                    <a
                                        key={url}
                                        href={url}
                                        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                        {label} – {content.choose}
                                    </a>
                                ))}
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8" aria-labelledby="packages-title">
                <div className="mb-8 max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{content.packagesEyebrow}</p>
                    <h2 id="packages-title" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{content.packagesTitle}</h2>
                    <p className="mt-4 text-lg leading-8 text-white/80">{content.packagesIntro}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {content.packages.map((item) => (
                        <article key={item.title} className="rounded-3xl border border-white/15 bg-white/[0.05] p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-bold text-primary">{item.basis}</span>
                            </div>
                            <p className="mt-3 leading-7 text-white/75">{item.text}</p>
                            <p className="mt-4 text-sm font-semibold text-primary">{item.discount}</p>
                            <a
                                href={bookingLinks.packages}
                                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/50 px-5 py-2.5 font-bold text-white transition hover:bg-primary hover:text-primary-foreground"
                            >
                                {content.packageCta}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8" aria-labelledby="programs-title">
                <div className="mb-8 max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{content.programsEyebrow}</p>
                    <h2 id="programs-title" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{content.programsTitle}</h2>
                    <p className="mt-4 text-lg leading-8 text-white/80">{content.programsIntro}</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                    {content.programs.map((program) => {
                        const Icon = program.icon;
                        return (
                            <article key={program.title} className="rounded-3xl border border-primary/25 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-8">
                                <div className="flex items-start gap-4">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h3 className="text-2xl font-bold">{program.title}</h3>
                                        <p className="mt-2 text-sm font-semibold text-primary">{program.status}</p>
                                    </div>
                                </div>
                                <p className="mt-5 leading-7 text-white/80">{program.text}</p>
                                <Link to="/kontakt" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/50 px-5 py-3 font-bold text-white transition hover:bg-primary hover:text-primary-foreground">
                                    {content.programsCta}<ArrowRight className="h-5 w-5" aria-hidden="true" />
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 sm:px-6">
                <div className="rounded-[2rem] border border-primary/30 bg-[#0B777A] p-6 sm:p-10">
                    <h2 className="text-2xl font-bold sm:text-3xl">{content.moreTitle}</h2>
                    <p className="mt-3 text-lg leading-8 text-white/80">{content.moreText}</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link to="/prices" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                            {content.moreLink}<ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        <Link to="/kontakt" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:border-primary hover:text-primary">
                            {content.contact}
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-white/70">{content.unsure}</p>
                </div>
            </section>
        </main>
    );
};
