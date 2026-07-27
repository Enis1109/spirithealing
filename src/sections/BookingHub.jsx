import { ArrowRight, CalendarDays, CalendarRange, HeartHandshake, MessageCircle, UserRound, UsersRound } from "lucide-react";
import { PopupButton } from "react-calendly";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

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
                    ["Mit Sabine", "https://calendly.com/spirit-healing/partner-einschreiben"],
                    ["Mit Selcan", "https://calendly.com/selcan1975/erstgesprach"],
                ],
            },
            {
                icon: UserRound,
                title: "Einzelsitzung beginnen",
                text: "Ein fundierter Einstieg in ein persönliches, emotionales oder beziehungsbezogenes Thema.",
                price: "222 € · 60 Min.",
                people: [
                    ["Erstsitzung mit Sabine", "https://calendly.com/spirit-healing/einzelsitzung-sabine"],
                    ["Erstsitzung mit Selcan", "https://calendly.com/selcan1975/erstsitzung-selcan"],
                ],
            },
            {
                icon: UsersRound,
                title: "Gemeinsame Begleitung",
                text: "Sabine und Selcan begleiten dein Thema gemeinsam aus mehreren fachlichen Perspektiven.",
                price: "333 € · 60 Min.",
                people: [
                    ["Gemeinsame Erstsitzung", "https://calendly.com/d/ct8z-zk5-7yc/gemeinsame-erstsitzung"],
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
        packagesIntro: "Die Paketpreise und Rabatte werden noch kalkuliert. Bereits vorgesehen sind diese vier Varianten:",
        packages: [
            { title: "3er-Paket Einzelsitzungen", basis: "3 × 222 €", text: "Drei persönliche Sitzungen mit Sabine oder Selcan." },
            { title: "5er-Paket Einzelsitzungen", basis: "5 × 222 €", text: "Fünf persönliche Sitzungen mit Sabine oder Selcan." },
            { title: "3er-Paket Kombisitzungen", basis: "3 × 333 €", text: "Drei gemeinsame Sitzungen mit Sabine und Selcan." },
            { title: "5er-Paket Kombisitzungen", basis: "5 × 333 €", text: "Fünf gemeinsame Sitzungen mit Sabine und Selcan." },
        ],
        packageStatus: "Paketpreis & Rabatt folgen",
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
                    ["Sabine ile", "https://calendly.com/spirit-healing/partner-einschreiben"],
                    ["Selcan ile", "https://calendly.com/selcan1975/erstgesprach"],
                ],
            },
            {
                icon: UserRound,
                title: "Bireysel seansa başla",
                text: "Kişisel, duygusal veya ilişki odaklı bir konuya sağlam bir başlangıç.",
                price: "222 € · 60 dk.",
                people: [
                    ["Sabine ile ilk seans", "https://calendly.com/spirit-healing/einzelsitzung-sabine"],
                    ["Selcan ile ilk seans", "https://calendly.com/selcan1975/erstsitzung-selcan"],
                ],
            },
            {
                icon: UsersRound,
                title: "Ortak çalışma",
                text: "Sabine ve Selcan konuna farklı uzmanlık perspektiflerinden birlikte eşlik eder.",
                price: "333 € · 60 dk.",
                people: [
                    ["Ortak ilk seans", "https://calendly.com/d/ct8z-zk5-7yc/gemeinsame-erstsitzung"],
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
        packagesIntro: "Paket ücretleri ve indirimler henüz hesaplanıyor. Şimdiden planlanan dört seçenek şunlardır:",
        packages: [
            { title: "3'lü bireysel seans paketi", basis: "3 × 222 €", text: "Sabine veya Selcan ile üç bireysel seans." },
            { title: "5'li bireysel seans paketi", basis: "5 × 222 €", text: "Sabine veya Selcan ile beş bireysel seans." },
            { title: "3'lü ortak seans paketi", basis: "3 × 333 €", text: "Sabine ve Selcan ile üç ortak seans." },
            { title: "5'li ortak seans paketi", basis: "5 × 333 €", text: "Sabine ve Selcan ile beş ortak seans." },
        ],
        packageStatus: "Paket ücreti ve indirim hazırlanıyor",
    },
};

export const BookingHub = () => {
    const { language } = useLanguage();
    const content = copy[language];
    const rootElement = typeof document !== "undefined" ? document.getElementById("root") : null;

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
                                    <PopupButton
                                        key={url}
                                        url={url}
                                        rootElement={rootElement}
                                        text={`${label} – ${content.choose}`}
                                        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    />
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
                            <p className="mt-4 text-sm font-semibold text-primary">{content.packageStatus}</p>
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
