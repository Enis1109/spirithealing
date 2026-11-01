import {
    ArrowRight,
    CalendarDays,
    Clock3,
    MessageCircle,
    Sparkles,
    UserRound,
    UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";


const bookingLinks = {
    introSabine: "https://calendly.com/spirit-healing/partner-einschreiben",
    introSelcan: "https://calendly.com/selcan1975/erstgesprach",
    firstSabine: "https://calendly.com/spirit-healing/einzelsitzung-sabine",
    firstSelcan: "https://calendly.com/selcan1975/erstsitzung-selcan",
    followSabine: "https://calendly.com/spirit-healing/folgesitzung-sabine",
    followSelcan: "https://calendly.com/selcan1975/folgesitzung-selcan",
    combinedFirst: "https://calendly.com/d/ct8z-zk5-7yc/gemeinsame-erstsitzung",
    combinedFollow: "https://calendly.com/d/cvrv-kgh-zvr/gemeinsame-folgesitzung",
    intensiveSelcan: "https://calendly.com/selcan1975/aufstellungsarbeit-selcan",
};

const packageCheckoutLinks = [
    "https://buy.stripe.com/aFa7sN3FwbSB6p52Bh83C03",
    "https://buy.stripe.com/eVq28t0tk1dXdRx1xd83C02",
    "https://buy.stripe.com/8x25kF6RIg8ReVB8ZF83C01",
    "https://buy.stripe.com/28EbJ36RIaOxdRx3Fl83C00",
];

const packageImages = [
    "/images/packages/3er-einzelsitzungen.jpg?v=20260730",
    "/images/packages/5er-einzelsitzungen.jpg?v=20260730",
    "/images/packages/3er-kombisitzungen.jpg?v=20260730",
    "/images/packages/5er-kombisitzungen.jpg?v=20260730",
];

const content = {
    de: {
        eyebrow: "Preise & Termine",
        title: "Wähle den Rahmen, der zu deinem Anliegen passt",
        intro: "Du kannst mit einem kostenfreien Kennenlernen beginnen oder direkt eine Sitzung buchen. Wenn du noch unsicher bist, klären wir gemeinsam, welche Form der Begleitung für dich sinnvoll ist.",
        facts: ["Telefonisch, online oder persönlich in Berlin", "Deutsch und Türkisch", "Vertraulich und persönlich"],
        book: "Termin wählen",
        request: "Termin anfragen",
        duration: "Dauer",
        price: "Preis",
        sections: [
            {
                eyebrow: "Unverbindlich kennenlernen",
                title: "Kostenfreies Erstgespräch",
                intro: "Ein unverbindliches Telefonat für dein Anliegen und deine Fragen. In 15 Minuten klären wir, ob und wie wir dich begleiten können.",
                kind: "intro",
                items: [
                    {
                        title: "Kennenlernen mit Sabine",
                        duration: "15 Minuten",
                        description: "In einem kostenfreien Telefonat mit Sabine klärst du, was dich beschäftigt und ob eine Zusammenarbeit für dich stimmig ist.",
                        price: "Kostenfrei",
                        link: bookingLinks.introSabine,
                    },
                    {
                        title: "Kennenlernen mit Selcan",
                        duration: "15 Minuten",
                        description: "In einem kostenfreien Telefonat mit Selcan klärst du, was dich beschäftigt und ob eine Zusammenarbeit für dich stimmig ist.",
                        price: "Kostenfrei",
                        link: bookingLinks.introSelcan,
                    },
                ],
            },
            {
                eyebrow: "Individuelle Begleitung",
                title: "Einzelsitzungen",
                intro: "Für Themen, die mehr Raum brauchen: emotionale Muster, Beziehungserfahrungen, innere Anspannung oder der Wunsch nach einer nachhaltigen Veränderung.",
                kind: "single",
                items: [
                    {
                        title: "Erstsitzung mit Sabine",
                        duration: "60 Minuten",
                        description: "Für deine erste Sitzung mit Sabine: Wir schauen auf dein Anliegen und deine innere Dynamik. Sabine begleitet dich mit systemischer Anteilearbeit.",
                        price: "222 €",
                        link: bookingLinks.firstSabine,
                    },
                    {
                        title: "Erstsitzung mit Selcan",
                        duration: "60 Minuten",
                        description: "Für deine erste Sitzung mit Selcan: Wir nehmen uns Zeit für dein Anliegen. Selcan verbindet systemische Anteilearbeit und Energiearbeit.",
                        price: "222 €",
                        link: bookingLinks.firstSelcan,
                    },
                    {
                        title: "Folgesitzung mit Sabine",
                        duration: "60 Minuten",
                        description: "Wenn du bereits eine Sitzung mit Sabine hattest: Wir greifen auf, was sich seitdem verändert oder neu gezeigt hat, und führen deinen Prozess weiter.",
                        price: "222 €",
                        link: bookingLinks.followSabine,
                    },
                    {
                        title: "Folgesitzung mit Selcan",
                        duration: "60 Minuten",
                        description: "Wenn du bereits eine Sitzung mit Selcan hattest: Wir führen deinen Prozess mit systemischer Anteilearbeit und Energiearbeit weiter.",
                        price: "222 €",
                        link: bookingLinks.followSelcan,
                    },
                ],
            },
            {
                eyebrow: "Mehrperspektivisch & intensiv",
                title: "Gemeinsame und vertiefende Sitzungen",
                intro: "Wenn ein Thema aus mehreren Blickwinkeln begleitet werden soll oder ein längerer, konzentrierter Prozess sinnvoll ist.",
                kind: "intensive",
                items: [
                    {
                        title: "Erstsitzung mit Sabine & Selcan",
                        duration: "60 Minuten",
                        description: "Deine erste Sitzung mit Sabine und Selcan gemeinsam. Wir verbinden systemische Anteilearbeit und Energiearbeit und arbeiten gleichzeitig mit dir.",
                        price: "333 €",
                        link: bookingLinks.combinedFirst,
                    },
                    {
                        title: "Folgesitzung mit Sabine & Selcan",
                        duration: "60 Minuten",
                        description: "Wenn du bereits eine gemeinsame Sitzung hattest: Sabine und Selcan knüpfen mit Anteilearbeit und Energiearbeit an euren begonnenen Prozess an.",
                        price: "333 €",
                        link: bookingLinks.combinedFollow,
                    },
                    {
                        title: "Intensivsitzung mit Selcan",
                        duration: "150 Minuten",
                        description: "150 Minuten mit Selcan für systemische Aufstellungsarbeit, schamanische Prozessbegleitung oder Seelenanteilsarbeit. Der Ablauf richtet sich nach deinem Anliegen.",
                        price: "333 €",
                        link: bookingLinks.intensiveSelcan,
                    },
                ],
            },
        ],
        packagesEyebrow: "Sitzungspakete",
        packagesTitle: "Mehrere Sitzungen mit Preisvorteil buchen",
        packagesIntro: "Wähle einen verbindlichen Rahmen für deinen Prozess und spare je nach Paket 10 % oder 15 % gegenüber der Einzelbuchung.",
        packageCta: "Paket kaufen",
        packages: [
            { title: "3er-Paket Einzelsitzungen", price: "599,40 €", discount: "10 % Rabatt", text: "Drei Einzelsitzungen mit Sabine oder Selcan statt 666 €." },
            { title: "5er-Paket Einzelsitzungen", price: "943,50 €", discount: "15 % Rabatt", text: "Fünf Einzelsitzungen mit Sabine oder Selcan statt 1.110 €." },
            { title: "3er-Paket Kombisitzungen", price: "899,10 €", discount: "10 % Rabatt", text: "Drei gemeinsame Sitzungen mit Sabine und Selcan statt 999 €." },
            { title: "5er-Paket Kombisitzungen", price: "1.415,25 €", discount: "15 % Rabatt", text: "Fünf gemeinsame Sitzungen mit Sabine und Selcan statt 1.665 €." },
        ],
        customEyebrow: "Noch nicht sicher?",
        customTitle: "Wir finden gemeinsam den passenden Einstieg",
        customText: "Nicht jedes Anliegen passt in eine feste Kategorie. Schreib uns kurz, worum es geht. Wir melden uns persönlich und empfehlen dir einen sinnvollen nächsten Schritt.",
        contact: "Nachricht senden",
        legal: { imprint: "Impressum", privacy: "Datenschutz" },
    },
    tr: {
        eyebrow: "Ücretler & Randevu",
        title: "İhtiyacına uygun çalışma biçimini seç",
        intro: "Ücretsiz bir tanışma görüşmesiyle başlayabilir veya doğrudan seans randevusu alabilirsin. Hangisinin sana uygun olduğundan emin değilsen, birlikte netleştiririz.",
        facts: ["Telefonla, çevrim içi veya Berlin’de yüz yüze", "Türkçe ve Almanca", "Gizli ve kişiye özel"],
        book: "Randevu seç",
        request: "Randevu talep et",
        duration: "Süre",
        price: "Ücret",
        sections: [
            {
                eyebrow: "Önce tanışalım",
                title: "Ücretsiz tanışma görüşmesi",
                intro: "Konunu ve sorularını paylaşabileceğin, hiçbir taahhüt gerektirmeyen bir telefon görüşmesi. 15 dakikada sana nasıl eşlik edebileceğimizi birlikte netleştiririz.",
                kind: "intro",
                items: [
                    {
                        title: "Sabine ile tanışma",
                        duration: "15 dakika",
                        description: "Sabine ile ücretsiz bir telefon görüşmesinde seni meşgul eden konuyu ve birlikte çalışmanın sana uygun olup olmadığını konuşursun.",
                        price: "Ücretsiz",
                        link: bookingLinks.introSabine,
                    },
                    {
                        title: "Selcan ile tanışma",
                        duration: "15 dakika",
                        description: "Selcan ile ücretsiz bir telefon görüşmesinde seni meşgul eden konuyu ve birlikte çalışmanın sana uygun olup olmadığını konuşursun.",
                        price: "Ücretsiz",
                        link: bookingLinks.introSelcan,
                    },
                ],
            },
            {
                eyebrow: "Bireysel çalışma",
                title: "Bireysel seanslar",
                intro: "Daha fazla alan isteyen konular için: duygusal örüntüler, ilişki deneyimleri, içsel gerginlik veya kalıcı bir değişim arzusu.",
                kind: "single",
                items: [
                    {
                        title: "Sabine ile ilk seans",
                        duration: "60 dakika",
                        description: "Sabine ile ilk seansın için: Konuna ve içsel dinamiklerine birlikte bakarız. Sabine, sistemik içsel parçalar çalışmasıyla sana eşlik eder.",
                        price: "222 €",
                        link: bookingLinks.firstSabine,
                    },
                    {
                        title: "Selcan ile ilk seans",
                        duration: "60 dakika",
                        description: "Selcan ile ilk seansın için: Konuna zaman ayırırız. Selcan, sistemik içsel parçalar çalışması ile enerji çalışmasını bir araya getirir.",
                        price: "222 €",
                        link: bookingLinks.firstSelcan,
                    },
                    {
                        title: "Sabine ile devam seansı",
                        duration: "60 dakika",
                        description: "Sabine ile daha önce bir seans yaptıysan: O zamandan beri değişenleri ve yeni ortaya çıkanları ele alarak sürecine devam ederiz.",
                        price: "222 €",
                        link: bookingLinks.followSabine,
                    },
                    {
                        title: "Selcan ile devam seansı",
                        duration: "60 dakika",
                        description: "Selcan ile daha önce bir seans yaptıysan: Sistemik içsel parçalar çalışması ve enerji çalışmasıyla sürecine devam ederiz.",
                        price: "222 €",
                        link: bookingLinks.followSelcan,
                    },
                ],
            },
            {
                eyebrow: "Çok yönlü & yoğun",
                title: "Ortak ve derinleştirici seanslar",
                intro: "Bir konunun birden fazla bakış açısıyla ele alınması ya da daha uzun ve odaklı bir çalışma gerekmesi durumunda.",
                kind: "intensive",
                items: [
                    {
                        title: "Sabine & Selcan ile ilk seans",
                        duration: "60 dakika",
                        description: "Sabine ve Selcan ile birlikte ilk seansın. Sistemik içsel parçalar çalışması ve enerji çalışmasını birleştirerek seninle aynı anda çalışırız.",
                        price: "333 €",
                        link: bookingLinks.combinedFirst,
                    },
                    {
                        title: "Sabine & Selcan ile devam seansı",
                        duration: "60 dakika",
                        description: "Daha önce ortak bir seans yaptıysan: Sabine ve Selcan, içsel parçalar çalışması ve enerji çalışmasıyla başladığınız süreci sürdürür.",
                        price: "333 €",
                        link: bookingLinks.combinedFollow,
                    },
                    {
                        title: "Selcan ile yoğun seans",
                        duration: "150 dakika",
                        description: "Selcan ile sistemik dizim, şamanik süreç çalışması veya ruh parçaları çalışması için 150 dakika. Seansın akışı senin konuna göre şekillenir.",
                        price: "333 €",
                        link: bookingLinks.intensiveSelcan,
                    },
                ],
            },
        ],
        packagesEyebrow: "Seans paketleri",
        packagesTitle: "Birden fazla seansı avantajlı fiyatla al",
        packagesIntro: "Sürecin için güvenilir bir çerçeve seç ve tek tek randevu almaya göre pakete bağlı olarak %10 veya %15 tasarruf et.",
        packageCta: "Paketi satın al",
        packages: [
            { title: "3'lü bireysel seans paketi", price: "599,40 €", discount: "%10 indirim", text: "Sabine veya Selcan ile üç bireysel seans; 666 € yerine." },
            { title: "5'li bireysel seans paketi", price: "943,50 €", discount: "%15 indirim", text: "Sabine veya Selcan ile beş bireysel seans; 1.110 € yerine." },
            { title: "3'lü ortak seans paketi", price: "899,10 €", discount: "%10 indirim", text: "Sabine ve Selcan ile üç ortak seans; 999 € yerine." },
            { title: "5'li ortak seans paketi", price: "1.415,25 €", discount: "%15 indirim", text: "Sabine ve Selcan ile beş ortak seans; 1.665 € yerine." },
        ],
        customEyebrow: "Emin değil misin?",
        customTitle: "Sana uygun başlangıcı birlikte belirleyelim",
        customText: "Her konu sabit bir kategoriye sığmaz. Bize kısaca neyle ilgili olduğunu yazabilirsin. Sana kişisel olarak geri döner ve anlamlı bir sonraki adım öneririz.",
        contact: "Mesaj gönder",
        legal: { imprint: "Künye", privacy: "Gizlilik" },
    },
};

const sectionIcons = {
    intro: MessageCircle,
    single: UserRound,
    intensive: UsersRound,
};

const BookingCard = ({ item, labels, icon }) => {
    const CardIcon = icon;
    const internal = item.link.startsWith('/kontakt?offer=');
    const BookingLink = internal ? Link : 'a';

    return (
        <article className="glass-strong group flex h-full flex-col rounded-3xl p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                    <CardIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-muted/10 px-3 py-1 text-sm font-semibold text-muted-foreground">{item.price}</span>
            </div>

            <div className="mt-5 flex flex-1 flex-col">
                <h3 className="text-xl font-bold leading-snug text-muted-foreground">{item.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-muted-foreground/80">{item.description}</p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-muted-foreground/15 pt-5">
                <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">{labels.duration}</dt>
                    <dd className="mt-1 flex items-center gap-2 font-semibold text-muted-foreground">
                        <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                        {item.duration}
                    </dd>
                </div>
                <div className="text-right">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">{labels.price}</dt>
                    <dd className="mt-1 font-bold text-muted-foreground">{item.price}</dd>
                </div>
            </dl>

            <BookingLink
                {...(internal ? { to: item.link } : { href: item.link })}
                className="mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-3 text-base font-bold text-primary-foreground transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                {item.link.startsWith("/kontakt?offer=") ? labels.request : labels.book}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </BookingLink>
        </article>
    );
};

export const Pricing = () => {
    const { language } = useLanguage();
    const copy = content[language];

    return (
        <main data-no-translate className="min-h-screen overflow-hidden bg-card pb-8 pt-24 text-white sm:pt-28">
            <section className="relative border-b border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_38%)]" aria-hidden="true" />
                <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:px-8">
                    <div className="max-w-3xl">
                        <p className="font-semibold uppercase tracking-[0.2em] text-primary">{copy.eyebrow}</p>
                        <h1 className="mt-4 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{copy.title}</h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">{copy.intro}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        {copy.facts.map((fact) => (
                            <div key={fact} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3.5 backdrop-blur-sm">
                                <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                                <span className="text-sm font-medium text-white/90">{fact}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="mx-auto w-full max-w-6xl space-y-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                {copy.sections.map((section) => {
                    const Icon = sectionIcons[section.kind];
                    const gridClass = section.items.length === 4
                        ? "md:grid-cols-2 xl:grid-cols-4"
                        : section.items.length === 3
                            ? "md:grid-cols-2 xl:grid-cols-3"
                            : "md:grid-cols-2";

                    return (
                        <section key={section.title} aria-labelledby={`pricing-${section.kind}`}>
                            <div className="max-w-3xl">
                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</p>
                                <h2 id={`pricing-${section.kind}`} className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{section.title}</h2>
                                <p className="mt-4 text-lg leading-8 text-white/80">{section.intro}</p>
                            </div>
                            <div className={`mt-8 grid items-stretch gap-5 ${gridClass}`}>
                                {section.items.map((item) => (
                                    <BookingCard
                                        key={item.title}
                                        item={item}
                                        labels={copy}
                                        icon={Icon}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}

                <section aria-labelledby="pricing-packages">
                    <div className="max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.packagesEyebrow}</p>
                        <h2 id="pricing-packages" className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{copy.packagesTitle}</h2>
                        <p className="mt-4 text-lg leading-8 text-white/80">{copy.packagesIntro}</p>
                    </div>
                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        {copy.packages.map((item, index) => (
                            <article key={item.title} className="glass-strong rounded-3xl p-6 shadow-lg shadow-black/10">
                                <img
                                    src={packageImages[index]}
                                    alt={item.title}
                                    className="mb-5 aspect-square w-full rounded-2xl object-cover"
                                    loading="lazy"
                                />
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <h3 className="text-xl font-bold text-muted-foreground">{item.title}</h3>
                                    <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-bold text-primary">{item.price}</span>
                                </div>
                                <p className="mt-4 leading-7 text-muted-foreground/80">{item.text}</p>
                                <p className="mt-4 text-sm font-semibold text-primary">{item.discount}</p>
                                <a href={packageCheckoutLinks[index]} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                                    {copy.packageCta}<ArrowRight className="h-5 w-5" aria-hidden="true" />
                                </a>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="overflow-hidden rounded-[2rem] border border-primary/35 bg-[#0B777A] shadow-2xl shadow-black/15">
                    <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
                        <div className="flex min-h-56 items-center justify-center bg-primary/10 p-8">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-primary/40 bg-card/45 text-primary shadow-inner sm:h-36 sm:w-36">
                                <CalendarDays className="h-14 w-14 sm:h-16 sm:w-16" aria-hidden="true" />
                            </div>
                        </div>
                        <div className="p-6 sm:p-10 lg:p-12">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.customEyebrow}</p>
                            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{copy.customTitle}</h2>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{copy.customText}</p>
                            <Link to="/kontakt" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                                {copy.contact}
                                <ArrowRight className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="flex items-center justify-center gap-2 px-4 pt-2 text-sm text-white/75">
                <Link to="/impressum" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{copy.legal.imprint}</Link>
                <Link to="/datenschutz" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{copy.legal.privacy}</Link>
            </footer>
        </main>
    );
};
