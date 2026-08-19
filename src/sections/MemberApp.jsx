import { createElement, useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleUserRound,
    Crown,
    Download,
    ExternalLink,
    Facebook,
    FileText,
    Heart,
    Headphones,
    Home,
    Instagram,
    Library,
    LockKeyhole,
    LogOut,
    Mail,
    MessageCircle,
    PlayCircle,
    Sparkles,
    Star,
    UserRound,
    UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const bookingLinks = {
    introSabine: "https://calendly.com/spirit-healing/partner-einschreiben",
    introSelcan: "https://calendly.com/selcan1975/erstgesprach",
    firstSabine: "https://calendly.com/spirit-healing/einzelsitzung-sabine",
    firstSelcan: "https://calendly.com/selcan1975/erstsitzung-selcan",
    combinedFirst: "https://calendly.com/d/ct8z-zk5-7yc/gemeinsame-erstsitzung",
};

const appCopy = {
    de: {
        nav: {
            home: "Start",
            library: "Mediathek",
            events: "Termine",
            support: "Begleitung",
            account: "Konto",
        },
        greeting: "Schön, dass du da bist",
        programEyebrow: "Dein geschützter Programmraum",
        programStart: "Start",
        programProgress: "Fortschritt",
        programOpen: "Programm öffnen",
        programPreview: "Admin-Vorschau",
        freePlan: "Kostenloser Zugang",
        premiumPlan: "Premium-Mitgliedschaft",
        heroEyebrow: "Dein nächster Schritt",
        heroTitle: "Nimm dir heute Zeit für das, was in dir gehört werden möchte.",
        heroText: "Deine Inhalte bleiben an einem Ort. Du kannst jederzeit zurückkehren und in deinem eigenen Tempo weitergehen.",
        continue: "Vortrag weiter ansehen",
        begin: "Mit dem Vortrag beginnen",
        libraryTitle: "Deine Mediathek",
        libraryIntro: "Meditationen, Vorträge und Workbooks für deine persönliche Weiterarbeit.",
        showAll: "Alle Inhalte",
        favorites: "Favoriten",
        progress: "Dein Weg",
        completed: "abgeschlossen",
        openLibrary: "Mediathek öffnen",
        todayEyebrow: "Für deinen heutigen Moment",
        todayTitle: "Wie möchtest du dir heute begegnen?",
        todayText: "Wähle nicht nach Leistung, sondern danach, was sich gerade stimmig anfühlt.",
        all: "Alle",
        meditations: "Meditationen",
        talks: "Vorträge",
        workbooks: "Workbooks",
        ready: "Bereit",
        soon: "Demnächst",
        free: "Kostenlos",
        premium: "Premium",
        favoriteAdd: "Zu Favoriten hinzufügen",
        favoriteRemove: "Aus Favoriten entfernen",
        start: "Öffnen",
        unavailable: "Wird vorbereitet",
        markComplete: "Als abgeschlossen markieren",
        markedComplete: "Abgeschlossen",
        emptySelection: "Hier ist noch nichts gespeichert. Öffne einen Inhalt und markiere ihn als Favorit oder abgeschlossen.",
        reflectionTitle: "Was hat sich in dir gezeigt?",
        reflectionText: "Wenn du ein Thema nicht allein weitertragen möchtest, können wir es in einer persönlichen Sitzung gemeinsam vertiefen.",
        bookIntro: "Kostenlos kennenlernen",
        bookSession: "Persönliche Begleitung wählen",
        eventsTitle: "Vorträge & gemeinsame Räume",
        eventsIntro: "Hier findest du Aufzeichnungen und künftig alle neuen Live-Termine an einem Ort.",
        recording: "Jetzt verfügbar",
        eventArchive: "Aufzeichnung ansehen",
        futureEvent: "Nächste Live-Termine",
        futureEventText: "Neue Vorträge, Übungsgruppen und Seminare werden hier veröffentlicht. Auf Wunsch informieren wir dich per E-Mail.",
        eventPage: "Alle Veranstaltungen",
        contactForEvents: "Über neue Termine informieren",
        supportEyebrow: "Nicht allein weitergehen",
        supportTitle: "Wenn aus einem Impuls ein persönlicher Prozess wird",
        supportIntro: "Die Inhalte können etwas in Bewegung bringen. Wenn du tiefer gehen möchtest, begleiten wir dich persönlich – einzeln oder gemeinsam.",
        introTitle: "Kostenlos kennenlernen",
        introText: "15 Minuten für dein Anliegen, deine Fragen und ein erstes Gefühl für die Zusammenarbeit.",
        individualTitle: "Einzelsitzung",
        individualText: "Ein fundierter Einstieg in ein persönliches, emotionales oder beziehungsbezogenes Thema.",
        combinedTitle: "Gemeinsame Begleitung",
        combinedText: "Energiearbeit und systemische Anteilearbeit werden innerhalb einer Sitzung miteinander verbunden.",
        sabine: "Mit Sabine",
        selcan: "Mit Selcan",
        together: "Mit Sabine & Selcan",
        allBookings: "Alle Termine und Pakete",
        accountTitle: "Dein Konto",
        accountIntro: "Hier verwaltest du deinen Zugang und findest alle wichtigen Einstellungen.",
        plan: "Dein Zugang",
        email: "E-Mail-Adresse",
        installTitle: "Spirit Healing als App installieren",
        installText: "Lege den Mitgliederbereich auf deinem Startbildschirm ab. So öffnet er sich künftig wie eine eigene App.",
        installButton: "App installieren",
        installManual: "Öffne im Browser „Teilen“ und wähle „Zum Home-Bildschirm“.",
        premiumTitle: "Mehr Raum für deinen Prozess",
        premiumText: "Die Premium-Mediathek mit regelmäßig neuen Meditationen, Vertiefungen und exklusiven Live-Räumen wird vorbereitet.",
        premiumCta: "Premium wählen",
        premiumInterest: "Interesse vormerken",
        premiumIncluded: ["Neue Meditationen", "Vertiefende Vorträge", "Exklusive Live-Räume"],
        newsletter: "E-Mail-Impulse erhalten",
        privacy: "Datenschutz",
        imprint: "Impressum",
        logout: "Abmelden",
        adminTitle: "Inhalte verwalten",
        adminText: "Du hast einen Verwaltungszugang. Neue Vorträge kannst du im Vimeo-Bereich hochladen. Danach können sie geschützt in die Mediathek übernommen werden.",
        openVimeo: "Vimeo öffnen",
        funnelTitle: "Gratis-Funnel der letzten 7 Tage",
        funnelText: "So viele Menschen haben die Kampagnenseite gesehen und die einzelnen Schritte bis zum bestätigten Zugang abgeschlossen.",
        funnelLanding: "Seitenaufrufe",
        funnelStarted: "Registrierung begonnen",
        funnelRegistered: "Konten angelegt",
        funnelActivated: "Zugänge bestätigt",
        funnelRate: "Anmelderate",
        funnelSources: "Herkunft der Aufrufe",
        funnelSourceLegend: "Aufrufe · Konten · bestätigt",
        funnelEmpty: "Noch keine Kampagnendaten vorhanden.",
    },
    tr: {
        nav: {
            home: "Ana Sayfa",
            library: "İçerikler",
            events: "Etkinlikler",
            support: "Destek",
            account: "Hesap",
        },
        greeting: "Burada olman ne güzel",
        programEyebrow: "Korumalı program alanın",
        programStart: "Başlangıç",
        programProgress: "İlerleme",
        programOpen: "Programı aç",
        programPreview: "Yönetici önizlemesi",
        freePlan: "Ücretsiz erişim",
        premiumPlan: "Premium üyelik",
        heroEyebrow: "Bir sonraki adımın",
        heroTitle: "Bugün içinde duyulmak isteyen şeye alan aç.",
        heroText: "Tüm içeriklerin tek bir yerde. İstediğin zaman geri dönüp kendi hızında devam edebilirsin.",
        continue: "Seminere devam et",
        begin: "Seminere başla",
        libraryTitle: "İçerik alanın",
        libraryIntro: "Kişisel sürecin için meditasyonlar, seminerler ve çalışma kitapları.",
        showAll: "Tüm içerikler",
        favorites: "Favoriler",
        progress: "Sürecin",
        completed: "tamamlandı",
        openLibrary: "İçerikleri aç",
        todayEyebrow: "Bugünkü halin için",
        todayTitle: "Bugün kendinle nasıl buluşmak istersin?",
        todayText: "Başarıya göre değil, şu anda sana neyin iyi geldiğine göre seç.",
        all: "Tümü",
        meditations: "Meditasyonlar",
        talks: "Seminerler",
        workbooks: "Çalışma kitapları",
        ready: "Hazır",
        soon: "Yakında",
        free: "Ücretsiz",
        premium: "Premium",
        favoriteAdd: "Favorilere ekle",
        favoriteRemove: "Favorilerden çıkar",
        start: "Aç",
        unavailable: "Hazırlanıyor",
        markComplete: "Tamamlandı olarak işaretle",
        markedComplete: "Tamamlandı",
        emptySelection: "Burada henüz kayıtlı bir içerik yok. Bir içeriği açıp favori ya da tamamlandı olarak işaretleyebilirsin.",
        reflectionTitle: "İçinde ne görünür oldu?",
        reflectionText: "Bir konuyu tek başına taşımak istemiyorsan kişisel bir seansta birlikte derinleştirebiliriz.",
        bookIntro: "Ücretsiz tanış",
        bookSession: "Kişisel destek seç",
        eventsTitle: "Seminerler & ortak alanlar",
        eventsIntro: "Kayıtları ve gelecekteki tüm canlı etkinlikleri burada bulabilirsin.",
        recording: "Şimdi erişilebilir",
        eventArchive: "Kaydı izle",
        futureEvent: "Sonraki canlı etkinlikler",
        futureEventText: "Yeni seminerler, çalışma grupları ve eğitimler burada yayınlanacak. İstersen e-posta ile haber veririz.",
        eventPage: "Tüm etkinlikler",
        contactForEvents: "Yeni tarihleri bildir",
        supportEyebrow: "Tek başına devam etmek zorunda değilsin",
        supportTitle: "Bir ilham kişisel bir sürece dönüştüğünde",
        supportIntro: "İçerikler içinde bir şeyleri harekete geçirebilir. Daha derine inmek istersen sana bireysel ya da birlikte eşlik ederiz.",
        introTitle: "Ücretsiz tanışma",
        introText: "Konun, soruların ve birlikte çalışmayı hissetmen için 15 dakika.",
        individualTitle: "Bireysel seans",
        individualText: "Kişisel, duygusal veya ilişki odaklı bir konuya sağlam bir başlangıç.",
        combinedTitle: "Ortak çalışma",
        combinedText: "Enerji çalışması ve sistemik parça çalışması aynı seans içinde bir araya gelir.",
        sabine: "Sabine ile",
        selcan: "Selcan ile",
        together: "Sabine & Selcan ile",
        allBookings: "Tüm randevular ve paketler",
        accountTitle: "Hesabın",
        accountIntro: "Erişimini ve önemli ayarları burada yönetebilirsin.",
        plan: "Erişimin",
        email: "E-posta adresi",
        installTitle: "Spirit Healing'i uygulama olarak yükle",
        installText: "Üye alanını ana ekranına ekle ve bundan sonra kendi uygulaman gibi aç.",
        installButton: "Uygulamayı yükle",
        installManual: "Tarayıcıda “Paylaş” menüsünü aç ve “Ana Ekrana Ekle”yi seç.",
        premiumTitle: "Sürecin için daha fazla alan",
        premiumText: "Düzenli yeni meditasyonlar, derinleştirme içerikleri ve özel canlı buluşmalar içeren Premium alan hazırlanıyor.",
        premiumCta: "Premium seç",
        premiumInterest: "İlgimi bildir",
        premiumIncluded: ["Yeni meditasyonlar", "Derinleştirici seminerler", "Özel canlı buluşmalar"],
        newsletter: "E-posta ilhamları al",
        privacy: "Gizlilik",
        imprint: "Künye",
        logout: "Çıkış yap",
        adminTitle: "İçerikleri yönet",
        adminText: "Yönetim erişimin var. Yeni seminerleri Vimeo alanına yükleyebilir, ardından korumalı biçimde içerik alanına ekleyebilirsin.",
        openVimeo: "Vimeo'yu aç",
        funnelTitle: "Son 7 günün ücretsiz içerik hunisi",
        funnelText: "Kampanya sayfasını kaç kişinin gördüğünü ve doğrulanmış erişime kadar hangi adımları tamamladığını gösterir.",
        funnelLanding: "Sayfa görüntüleme",
        funnelStarted: "Kayda başladı",
        funnelRegistered: "Hesap oluşturdu",
        funnelActivated: "Erişimi doğruladı",
        funnelRate: "Kayıt oranı",
        funnelSources: "Görüntüleme kaynakları",
        funnelSourceLegend: "Görüntüleme · hesap · doğrulama",
        funnelEmpty: "Henüz kampanya verisi yok.",
    },
};

const contentDefinitions = {
    talk: {
        key: "vortrag-wer-entscheidet-dein-leben",
        type: "talk",
        access: "free",
        title: {
            de: "Wer entscheidet eigentlich dein Leben?",
            tr: "Hayatına aslında kim karar veriyor?",
        },
        description: {
            de: "Der vollständige Live-Vortrag über innere Anteile, Schutzlogiken und Selbstführung.",
            tr: "İçsel parçalar, korunma mantıkları ve öz liderlik üzerine canlı seminerin tamamı.",
        },
        meta: "61 Min.",
        image: "/breachright.jpeg",
        icon: PlayCircle,
    },
    loslassen: {
        key: "meditation-loslassen-reinigen",
        type: "meditation",
        access: "free",
        title: { de: "Loslassen & Reinigen", tr: "Bırakmak ve Arınmak" },
        description: {
            de: "Eine geführte Meditation zum bewussten Loslassen und inneren Reinigen.",
            tr: "Bilinçli bırakma ve içsel arınma için rehberli meditasyon.",
        },
        meta: { de: "Geführte Meditation", tr: "Rehberli meditasyon" },
        image: "/images/meditations/loslassen-reinigen.png?v=20260730",
        icon: Headphones,
    },
    wiedergeburt: {
        key: "meditation-wiedergeburt",
        type: "meditation",
        access: "free",
        title: { de: "Wiedergeburt", tr: "Yeniden Doğuş" },
        description: {
            de: "Für Übergang, Neuausrichtung und einen neuen inneren Beginn.",
            tr: "Geçiş, yeniden yönelme ve yeni bir içsel başlangıç için.",
        },
        meta: { de: "Geführte Meditation", tr: "Rehberli meditasyon" },
        image: "/images/meditations/wiedergeburt.png?v=20260730",
        icon: Headphones,
    },
    workbook: {
        key: "workbook-wer-entscheidet-dein-leben",
        type: "workbook",
        access: "free",
        title: {
            de: "Workbook: Wer entscheidet dein Leben?",
            tr: "Çalışma kitabı: Hayatına kim karar veriyor?",
        },
        description: {
            de: "Neun Seiten mit Reflexionsfragen und Übungen für deine Selbstführung.",
            tr: "Öz liderliğin için düşünme soruları ve egzersizlerden oluşan dokuz sayfa.",
        },
        meta: "PDF · 9 Seiten",
        icon: FileText,
    },
    premiumMeditations: {
        key: "premium-neue-meditationen",
        type: "meditation",
        access: "premium",
        status: "soon",
        title: { de: "Neue Prozess-Meditationen", tr: "Yeni süreç meditasyonları" },
        description: {
            de: "Regelmäßig neue geführte Räume für unterschiedliche Themen und Prozessphasen.",
            tr: "Farklı konular ve süreç aşamaları için düzenli yeni rehberli alanlar.",
        },
        meta: "Premium",
        icon: Sparkles,
    },
    premiumTalks: {
        key: "premium-vertiefungen",
        type: "talk",
        access: "premium",
        status: "soon",
        title: { de: "Vertiefende Vorträge & Live-Räume", tr: "Derinleştirici seminerler & canlı buluşmalar" },
        description: {
            de: "Neue fachliche Impulse, Übungen und ausgewählte Aufzeichnungen für Mitglieder.",
            tr: "Üyeler için yeni uzmanlık içerikleri, egzersizler ve seçilmiş kayıtlar.",
        },
        meta: "Premium",
        icon: Crown,
    },
};

const navIcons = {
    home: Home,
    library: Library,
    events: CalendarDays,
    support: UsersRound,
    account: CircleUserRound,
};

const typeLabels = (copy) => ({
    all: copy.all,
    favorites: copy.favorites,
    completed: copy.markedComplete,
    meditation: copy.meditations,
    talk: copy.talks,
    workbook: copy.workbooks,
});

const localized = (value, language) => typeof value === "string" ? value : value[language];
const formatProgramDate = (value, language) => value
    ? new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "de-DE", { dateStyle: "long" }).format(new Date(`${value}T12:00:00`))
    : "–";

const AppLogo = ({ compact = false }) => (
    <Link to="/" className="inline-flex items-center gap-3" aria-label="Spirit Healing">
        <img
            src="/Logo-tuerkis.jpeg?v=20260730"
            alt=""
            className={`${compact ? "h-11 w-11" : "h-14 w-14"} rounded-full object-cover shadow-md ring-2 ring-[#d3b461]/65`}
        />
        {!compact && (
            <span className="font-serif text-xl font-bold tracking-tight text-[#123e3d]">
                Spirit Healing
            </span>
        )}
    </Link>
);

const ContentCard = ({
    item,
    language,
    copy,
    state,
    isPremiumMember,
    onOpen,
    onFavorite,
}) => {
    const Icon = item.icon;
    const favorite = Boolean(state?.favorite);
    const locked = item.access === "premium" && !isPremiumMember;
    const available = item.available && item.status !== "soon";

    return (
        <article className="group overflow-hidden rounded-[1.7rem] border border-[#b8d9d4] bg-white shadow-[0_18px_50px_rgba(28,96,91,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(28,96,91,0.13)]">
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#dff3ef,#f8f0df)]">
                {item.image ? (
                    <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                ) : (
                    <Icon className="h-16 w-16 text-[#187f7d]/55" aria-hidden="true" />
                )}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${item.access === "premium" ? "bg-[#123e3d] text-[#f3d884]" : "bg-white/90 text-[#176f6d]"}`}>
                        {item.access === "premium" ? copy.premium : copy.free}
                    </span>
                    <button
                        type="button"
                        onClick={() => onFavorite(item.key)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#176f6d] shadow-sm transition hover:bg-white"
                        aria-label={favorite ? copy.favoriteRemove : copy.favoriteAdd}
                    >
                        <Heart className={`h-5 w-5 ${favorite ? "fill-[#d3a831] text-[#d3a831]" : ""}`} aria-hidden="true" />
                    </button>
                </div>
                {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#123e3d]/58 backdrop-blur-[2px]">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white">
                            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
                        </span>
                    </div>
                )}
            </div>
            <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[#5a8581]">
                    <span>{localized(item.meta, language)}</span>
                    <span>{available ? copy.ready : copy.soon}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold leading-snug text-[#123e3d]">{localized(item.title, language)}</h3>
                <p className="mt-2 min-h-20 text-sm leading-6 text-[#456b68]">{localized(item.description, language)}</p>
                <button
                    type="button"
                    onClick={() => onOpen(item)}
                    disabled={!available && !locked}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#168e91] px-5 py-2.5 font-bold text-white transition hover:bg-[#0c7476] disabled:cursor-not-allowed disabled:bg-[#a9c3c0]"
                >
                    {locked ? copy.premium : (available ? copy.start : copy.unavailable)}
                    {locked ? <Crown className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </button>
            </div>
        </article>
    );
};

export const MemberApp = ({
    language,
    member,
    recordingAvailable,
    recordingEmbedUrl,
    workbookAvailable,
    meditations,
    initialContentState,
    premiumCheckoutUrl,
    programs = [],
    onLogout,
}) => {
    const copy = appCopy[language];
    const allowedViews = new Set(["home", "library", "events", "support", "account"]);
    const requestedView = new URLSearchParams(window.location.search).get("tab");
    const [activeView, setActiveView] = useState(allowedViews.has(requestedView) ? requestedView : "home");
    const [activeFilter, setActiveFilter] = useState("all");
    const [activeItem, setActiveItem] = useState(null);
    const [installPrompt, setInstallPrompt] = useState(null);
    const [funnelSummary, setFunnelSummary] = useState(null);
    const [contentState, setContentState] = useState(() => Object.fromEntries(
        (initialContentState || []).map((entry) => [entry.contentKey, entry]),
    ));
    const isPremiumMember = member?.membershipTier === "premium";
    const activeProgram = programs[0] || null;

    useEffect(() => {
        const handleInstallPrompt = (event) => {
            event.preventDefault();
            setInstallPrompt(event);
        };
        window.addEventListener("beforeinstallprompt", handleInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    }, []);

    useEffect(() => {
        if (member?.role !== "admin") return undefined;
        let active = true;
        fetch("/api/admin/funnel-summary?days=7", { headers: { Accept: "application/json" } })
            .then((response) => response.ok ? response.json() : null)
            .then((result) => active && result?.ok && setFunnelSummary(result.summary))
            .catch(() => undefined);
        return () => { active = false; };
    }, [member?.role]);

    const items = useMemo(() => ([
        { ...contentDefinitions.talk, available: recordingAvailable, mediaUrl: recordingEmbedUrl || "/api/members/recording" },
        { ...contentDefinitions.loslassen, available: meditations.loslassenAvailable, mediaUrl: "/api/members/meditations/loslassen", downloadUrl: "/api/members/meditations/loslassen?download=1" },
        { ...contentDefinitions.wiedergeburt, available: meditations.wiedergeburtAvailable, mediaUrl: "/api/members/meditations/wiedergeburt", downloadUrl: "/api/members/meditations/wiedergeburt?download=1" },
        { ...contentDefinitions.workbook, available: workbookAvailable, downloadUrl: "/api/members/workbook" },
        { ...contentDefinitions.premiumMeditations, available: false },
        { ...contentDefinitions.premiumTalks, available: false },
    ]), [meditations, recordingAvailable, recordingEmbedUrl, workbookAvailable]);

    const availableItems = items.filter((item) => item.available);
    const favoriteCount = Object.values(contentState).filter((entry) => entry.favorite).length;
    const completedCount = Object.values(contentState).filter((entry) => entry.progress === "completed").length;
    const filteredItems = items.filter((item) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "favorites") return Boolean(contentState[item.key]?.favorite);
        if (activeFilter === "completed") return contentState[item.key]?.progress === "completed";
        return item.type === activeFilter;
    });
    const continueItem = availableItems.find((item) => contentState[item.key]?.progress === "started")
        || availableItems[0]
        || items[0];

    const navigate = (view) => {
        setActiveView(view);
        setActiveItem(null);
        const nextUrl = view === "home" ? "/mitglieder" : `/mitglieder?tab=${view}`;
        window.history.replaceState({}, "", nextUrl);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const updateContent = async (contentKey, patch) => {
        const previous = contentState[contentKey] || { contentKey, favorite: false, progress: "new" };
        const next = { ...previous, ...patch };
        setContentState((current) => ({ ...current, [contentKey]: next }));

        try {
            const response = await fetch("/api/members/content-state", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ contentKey, ...patch }),
            });
            if (!response.ok) throw new Error("state");
        } catch {
            setContentState((current) => ({ ...current, [contentKey]: previous }));
        }
    };

    const toggleFavorite = (contentKey) => {
        updateContent(contentKey, { favorite: !contentState[contentKey]?.favorite });
    };

    const openItem = (item) => {
        const locked = item.access === "premium" && !isPremiumMember;
        if (locked) {
            navigate("account");
            return;
        }
        if (!item.available) return;
        setActiveItem(item);
        setActiveView("library");
        window.history.replaceState({}, "", "/mitglieder?tab=library");
        updateContent(item.key, { progress: contentState[item.key]?.progress === "completed" ? "completed" : "started" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const installApp = async () => {
        if (!installPrompt) return;
        await installPrompt.prompt();
        setInstallPrompt(null);
    };

    const navEntries = Object.keys(copy.nav);

    const sidebar = (
        <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#c6e0dc] bg-[#f7fbfa] px-5 py-7 lg:flex lg:flex-col">
            <AppLogo />
            <nav className="mt-10 space-y-2" aria-label="App Navigation">
                {navEntries.map((view) => {
                    const Icon = navIcons[view];
                    return (
                        <button
                            key={view}
                            type="button"
                            onClick={() => navigate(view)}
                            className={`flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-semibold transition ${activeView === view ? "bg-[#168e91] text-white shadow-lg shadow-[#168e91]/20" : "text-[#315b58] hover:bg-[#e3f2ef]"}`}
                        >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            {copy.nav[view]}
                        </button>
                    );
                })}
            </nav>
            <div className="mt-auto rounded-3xl bg-[linear-gradient(145deg,#153f3d,#1a716f)] p-5 text-white">
                <Crown className="h-6 w-6 text-[#f1d277]" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold">{copy.premiumTitle}</p>
                <p className="mt-2 text-xs leading-5 text-white/72">{copy.premiumText}</p>
                <button type="button" onClick={() => navigate("account")} className="mt-4 text-sm font-bold text-[#f1d277]">
                    {premiumCheckoutUrl ? copy.premiumCta : copy.premiumInterest} →
                </button>
            </div>
        </aside>
    );

    const mobileHeader = (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#c6e0dc]/80 bg-[#edf8f6]/92 px-4 py-3 backdrop-blur-xl lg:hidden">
            <AppLogo compact />
            <div className="text-right">
                <p className="text-sm font-bold text-[#123e3d]">{member?.name}</p>
                <p className="text-xs text-[#57807d]">{isPremiumMember ? copy.premiumPlan : copy.freePlan}</p>
            </div>
        </header>
    );

    const mobileNavigation = (
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#bddbd6] bg-white/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(32,89,84,0.08)] backdrop-blur-xl lg:hidden" aria-label="App Navigation">
            {navEntries.map((view) => {
                const Icon = navIcons[view];
                return (
                    <button
                        key={view}
                        type="button"
                        onClick={() => navigate(view)}
                        className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold ${activeView === view ? "text-[#168e91]" : "text-[#688b88]"}`}
                    >
                        <Icon className={`h-5 w-5 ${activeView === view ? "fill-[#168e91]/10" : ""}`} aria-hidden="true" />
                        {copy.nav[view]}
                    </button>
                );
            })}
        </nav>
    );

    const homeView = (
        <>
            <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">{isPremiumMember ? copy.premiumPlan : copy.freePlan}</p>
                    <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-[#123e3d] sm:text-5xl">{copy.greeting}, {member?.name?.split(" ")[0]}.</h1>
                </div>
                <button type="button" onClick={() => navigate("account")} className="inline-flex items-center gap-2 self-start rounded-full border border-[#b8d9d4] bg-white px-4 py-2 text-sm font-bold text-[#315b58]">
                    <CircleUserRound className="h-4 w-4" />{copy.nav.account}
                </button>
            </section>

            {activeProgram && (
                <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#d7bd66]/50 bg-[radial-gradient(circle_at_90%_10%,rgba(241,210,119,0.32),transparent_30%),linear-gradient(135deg,#123e3d,#176f6d)] text-white shadow-[0_24px_70px_rgba(18,62,61,0.2)]">
                    <div className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f1d277]">{copy.programEyebrow}</p>
                            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">{activeProgram.title}</h2>
                            <p className="mt-3 max-w-2xl leading-7 text-white/76">{activeProgram.subtitle}</p>
                            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-white/82">
                                <span className="rounded-full bg-white/10 px-3 py-1.5"><CalendarDays className="mr-1.5 inline h-4 w-4" />{copy.programStart}: {formatProgramDate(activeProgram.startDate, language)}</span>
                                <span className="rounded-full bg-white/10 px-3 py-1.5"><CheckCircle2 className="mr-1.5 inline h-4 w-4" />{copy.programProgress}: {activeProgram.progress.percent} %</span>
                                {activeProgram.adminPreview && <span className="rounded-full bg-[#f1d277] px-3 py-1.5 font-bold text-[#123e3d]">{copy.programPreview}</span>}
                            </div>
                        </div>
                        <Link to="/mitglieder/programme/zepter" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1d277] px-6 py-3 font-bold text-[#123e3d] transition hover:bg-white">{copy.programOpen}<ArrowRight className="h-5 w-5" /></Link>
                    </div>
                </section>
            )}

            <section className="mt-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#114845_0%,#168e91_62%,#6fc1b7_130%)] text-white shadow-[0_28px_80px_rgba(18,82,78,0.22)]">
                <div className="grid lg:grid-cols-[1fr_0.68fr]">
                    <div className="p-7 sm:p-10 lg:p-12">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f0d784]">{copy.heroEyebrow}</p>
                        <h2 className="mt-4 max-w-3xl font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{copy.heroTitle}</h2>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">{copy.heroText}</p>
                        <button type="button" onClick={() => openItem(continueItem)} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1d277] px-6 py-3 font-bold text-[#123e3d] transition hover:bg-white">
                            {contentState[continueItem.key]?.progress === "started" ? copy.continue : copy.begin}
                            <PlayCircle className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="relative min-h-64 overflow-hidden bg-[#0e3937]">
                        {continueItem.image ? (
                            <img src={continueItem.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
                        ) : (
                            <PlayCircle className="absolute inset-0 m-auto h-24 w-24 text-white/35" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#103e3c]/80 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6">
                            <p className="text-sm font-bold text-[#f1d277]">{localized(continueItem.meta, language)}</p>
                            <p className="mt-1 text-xl font-bold">{localized(continueItem.title, language)}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                    [Library, availableItems.length, copy.showAll, "all"],
                    [Heart, favoriteCount, copy.favorites, "favorites"],
                    [CheckCircle2, completedCount, copy.completed, "completed"],
                ].map(([Icon, value, label, filter]) => (
                    <button key={label} type="button" onClick={() => { setActiveFilter(filter); navigate("library"); }} className="flex items-center gap-4 rounded-3xl border border-[#c3ded9] bg-white p-5 text-left shadow-sm transition hover:border-[#7abdb5]">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e2f4f0] text-[#168e91]">{createElement(Icon, { className: "h-6 w-6", "aria-hidden": true })}</span>
                        <span><strong className="block text-2xl text-[#123e3d]">{value}</strong><span className="text-sm font-semibold text-[#5b7e7b]">{label}</span></span>
                    </button>
                ))}
            </section>

            <section className="mt-12">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">{copy.todayEyebrow}</p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-[#123e3d]">{copy.todayTitle}</h2>
                        <p className="mt-2 max-w-2xl text-[#547875]">{copy.todayText}</p>
                    </div>
                    <button type="button" onClick={() => navigate("library")} className="inline-flex items-center gap-2 self-start font-bold text-[#168e91]">
                        {copy.openLibrary}<ArrowRight className="h-4 w-4" />
                    </button>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {items.slice(1, 4).map((item) => (
                        <ContentCard
                            key={item.key}
                            item={item}
                            language={language}
                            copy={copy}
                            state={contentState[item.key]}
                            isPremiumMember={isPremiumMember}
                            onOpen={openItem}
                            onFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            </section>
        </>
    );

    const libraryView = (
        <>
            <section>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">{copy.nav.library}</p>
                <h1 className="mt-2 font-serif text-4xl font-bold text-[#123e3d] sm:text-5xl">{copy.libraryTitle}</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-[#547875]">{copy.libraryIntro}</p>
            </section>

            {activeItem && (
                <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#b8d9d4] bg-white shadow-[0_22px_65px_rgba(28,96,91,0.12)]">
                    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">{localized(activeItem.meta, language)}</p>
                            <h2 className="mt-2 font-serif text-3xl font-bold text-[#123e3d]">{localized(activeItem.title, language)}</h2>
                            <p className="mt-3 max-w-3xl leading-7 text-[#547875]">{localized(activeItem.description, language)}</p>
                        </div>
                        <button type="button" onClick={() => toggleFavorite(activeItem.key)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b8d9d4] text-[#168e91]" aria-label={contentState[activeItem.key]?.favorite ? copy.favoriteRemove : copy.favoriteAdd}>
                            <Heart className={`h-5 w-5 ${contentState[activeItem.key]?.favorite ? "fill-[#d3a831] text-[#d3a831]" : ""}`} />
                        </button>
                    </div>
                    {activeItem.type === "talk" && recordingEmbedUrl && (
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                className="h-full w-full"
                                src={recordingEmbedUrl}
                                title={localized(activeItem.title, language)}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                        </div>
                    )}
                    {activeItem.type === "talk" && !recordingEmbedUrl && (
                        <video className="aspect-video w-full bg-black" controls playsInline preload="metadata" controlsList="nodownload" src={activeItem.mediaUrl}>
                            <track kind="captions" />
                        </video>
                    )}
                    {activeItem.type === "meditation" && (
                        <div className="border-t border-[#c7dfdb] bg-[#f3faf8] p-6 sm:p-8">
                            <audio className="w-full" controls autoPlay preload="metadata" src={activeItem.mediaUrl} />
                            {activeItem.downloadUrl && (
                                <a href={activeItem.downloadUrl} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#168e91] px-5 py-2.5 font-bold text-[#176f6d]">
                                    <Download className="h-4 w-4" />Download
                                </a>
                            )}
                        </div>
                    )}
                    {activeItem.type === "workbook" && (
                        <div className="border-t border-[#c7dfdb] bg-[#f3faf8] p-6 sm:p-8">
                            <a href={activeItem.downloadUrl} download onClick={() => updateContent(activeItem.key, { progress: "completed" })} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#168e91] px-6 py-3 font-bold text-white">
                                <Download className="h-5 w-5" />Download
                            </a>
                        </div>
                    )}
                    <div className="grid gap-5 border-t border-[#c7dfdb] bg-[#fffaf0] p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-[#123e3d]">{copy.reflectionTitle}</h3>
                            <p className="mt-2 max-w-2xl leading-7 text-[#5b7471]">{copy.reflectionText}</p>
                        </div>
                        <div className="flex flex-col gap-2 sm:items-end">
                            <Link to="/termin-buchen" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#123e3d] px-5 py-2.5 font-bold text-white">
                                {copy.bookSession}<ArrowRight className="h-4 w-4" />
                            </Link>
                            <button type="button" onClick={() => updateContent(activeItem.key, { progress: "completed" })} className="text-sm font-bold text-[#168e91]">
                                {contentState[activeItem.key]?.progress === "completed" ? copy.markedComplete : copy.markComplete}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
                {Object.entries(typeLabels(copy)).map(([type, label]) => (
                    <button key={type} type="button" onClick={() => setActiveFilter(type)} className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-bold ${activeFilter === type ? "bg-[#168e91] text-white" : "border border-[#b8d9d4] bg-white text-[#456b68]"}`}>
                        {label}
                    </button>
                ))}
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                    <ContentCard
                        key={item.key}
                        item={item}
                        language={language}
                        copy={copy}
                        state={contentState[item.key]}
                        isPremiumMember={isPremiumMember}
                        onOpen={openItem}
                        onFavorite={toggleFavorite}
                    />
                ))}
            </div>
            {filteredItems.length === 0 && (
                <div className="mt-5 rounded-[2rem] border border-dashed border-[#9bcac3] bg-white/65 p-8 text-center text-[#547875]">
                    {copy.emptySelection}
                </div>
            )}
        </>
    );

    const eventsView = (
        <>
            <section>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">{copy.nav.events}</p>
                <h1 className="mt-2 font-serif text-4xl font-bold text-[#123e3d] sm:text-5xl">{copy.eventsTitle}</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-[#547875]">{copy.eventsIntro}</p>
            </section>
            <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <article className="overflow-hidden rounded-[2rem] bg-[#123e3d] text-white shadow-xl">
                    <div className="relative aspect-[16/8] overflow-hidden">
                        <img src="/breachright.jpeg" alt="" className="h-full w-full object-cover opacity-70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#123e3d] via-transparent to-transparent" />
                        <span className="absolute left-5 top-5 rounded-full bg-[#f1d277] px-3 py-1 text-xs font-bold text-[#123e3d]">{copy.recording}</span>
                    </div>
                    <div className="p-6 sm:p-8">
                        <p className="text-sm font-bold text-[#f1d277]">26. Juli 2026 · 61 Min.</p>
                        <h2 className="mt-2 font-serif text-3xl font-bold">{localized(contentDefinitions.talk.title, language)}</h2>
                        <button type="button" onClick={() => openItem(items[0])} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold text-[#123e3d]">
                            {copy.eventArchive}<PlayCircle className="h-5 w-5" />
                        </button>
                    </div>
                </article>
                <article className="flex flex-col rounded-[2rem] border border-[#b8d9d4] bg-white p-7 shadow-sm sm:p-8">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3f4f0] text-[#168e91]"><CalendarDays className="h-6 w-6" /></span>
                    <h2 className="mt-6 font-serif text-3xl font-bold text-[#123e3d]">{copy.futureEvent}</h2>
                    <p className="mt-4 flex-1 leading-7 text-[#547875]">{copy.futureEventText}</p>
                    <div className="mt-7 space-y-3">
                        <Link to="/vortraege-seminare" className="flex min-h-11 items-center justify-between rounded-full bg-[#168e91] px-5 py-2.5 font-bold text-white">
                            {copy.eventPage}<ChevronRight className="h-5 w-5" />
                        </Link>
                        <Link to="/kontakt" className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#b8d9d4] px-5 py-2.5 font-bold text-[#315b58]">
                            <Mail className="h-4 w-4" />{copy.contactForEvents}
                        </Link>
                    </div>
                </article>
            </section>
        </>
    );

    const supportCards = [
        {
            icon: MessageCircle,
            title: copy.introTitle,
            text: copy.introText,
            price: "Kostenfrei · 15 Min.",
            links: [[copy.sabine, bookingLinks.introSabine], [copy.selcan, bookingLinks.introSelcan]],
        },
        {
            icon: UserRound,
            title: copy.individualTitle,
            text: copy.individualText,
            price: "222 € · 60 Min.",
            links: [[copy.sabine, bookingLinks.firstSabine], [copy.selcan, bookingLinks.firstSelcan]],
        },
        {
            icon: UsersRound,
            title: copy.combinedTitle,
            text: copy.combinedText,
            price: "333 € · 60 Min.",
            links: [[copy.together, bookingLinks.combinedFirst]],
        },
    ];

    const supportView = (
        <>
            <section className="max-w-4xl">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">{copy.supportEyebrow}</p>
                <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-[#123e3d] sm:text-5xl">{copy.supportTitle}</h1>
                <p className="mt-4 text-lg leading-8 text-[#547875]">{copy.supportIntro}</p>
            </section>
            <section className="mt-9 grid gap-5 lg:grid-cols-3">
                {supportCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <article key={card.title} className="flex flex-col rounded-[2rem] border border-[#b8d9d4] bg-white p-6 shadow-[0_18px_50px_rgba(28,96,91,0.08)]">
                            <div className="flex items-start justify-between gap-4">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e2f4f0] text-[#168e91]"><Icon className="h-6 w-6" /></span>
                                <span className="rounded-full bg-[#fff6dc] px-3 py-1 text-xs font-bold text-[#80651b]">{card.price}</span>
                            </div>
                            <h2 className="mt-6 font-serif text-2xl font-bold text-[#123e3d]">{card.title}</h2>
                            <p className="mt-3 flex-1 leading-7 text-[#547875]">{card.text}</p>
                            <div className="mt-6 space-y-2 border-t border-[#d3e6e2] pt-5">
                                {card.links.map(([label, url]) => (
                                    <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-between rounded-full bg-[#168e91] px-5 py-2.5 font-bold text-white">
                                        {label}<ExternalLink className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </article>
                    );
                })}
            </section>
            <Link to="/termin-buchen" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#123e3d] px-6 py-3 font-bold text-white">
                {copy.allBookings}<ArrowRight className="h-5 w-5" />
            </Link>
        </>
    );

    const accountView = (
        <>
            <section>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">{copy.nav.account}</p>
                <h1 className="mt-2 font-serif text-4xl font-bold text-[#123e3d] sm:text-5xl">{copy.accountTitle}</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-[#547875]">{copy.accountIntro}</p>
            </section>
            <section className="mt-8 grid gap-6 lg:grid-cols-2">
                <article className="rounded-[2rem] border border-[#b8d9d4] bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e2f4f0] text-xl font-bold text-[#168e91]">{member?.name?.slice(0, 1)}</span>
                        <div>
                            <h2 className="text-xl font-bold text-[#123e3d]">{member?.name}</h2>
                            <p className="text-sm text-[#668986]">{member?.email}</p>
                        </div>
                    </div>
                    <dl className="mt-7 space-y-4 border-t border-[#d3e6e2] pt-6">
                        <div className="flex items-center justify-between gap-4"><dt className="text-[#688885]">{copy.plan}</dt><dd className="font-bold text-[#123e3d]">{isPremiumMember ? copy.premiumPlan : copy.freePlan}</dd></div>
                        <div className="flex items-center justify-between gap-4"><dt className="text-[#688885]">{copy.email}</dt><dd className="truncate font-semibold text-[#315b58]">{member?.email}</dd></div>
                    </dl>
                    <button type="button" onClick={onLogout} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#c8dedb] px-5 py-2.5 font-bold text-[#315b58]">
                        <LogOut className="h-4 w-4" />{copy.logout}
                    </button>
                </article>

                <article className="rounded-[2rem] bg-[linear-gradient(145deg,#123e3d,#187f7d)] p-6 text-white shadow-xl sm:p-8">
                    <Crown className="h-8 w-8 text-[#f1d277]" />
                    <h2 className="mt-5 font-serif text-3xl font-bold">{copy.premiumTitle}</h2>
                    <p className="mt-3 leading-7 text-white/76">{copy.premiumText}</p>
                    <ul className="mt-5 space-y-3">
                        {copy.premiumIncluded.map((benefit) => <li key={benefit} className="flex items-center gap-3 text-sm font-semibold"><CheckCircle2 className="h-5 w-5 text-[#f1d277]" />{benefit}</li>)}
                    </ul>
                    {premiumCheckoutUrl ? (
                        <a href={premiumCheckoutUrl} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f1d277] px-5 py-2.5 font-bold text-[#123e3d]">{copy.premiumCta}<ArrowRight className="h-4 w-4" /></a>
                    ) : (
                        <Link to="/kontakt" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f1d277] px-5 py-2.5 font-bold text-[#123e3d]">{copy.premiumInterest}<ArrowRight className="h-4 w-4" /></Link>
                    )}
                </article>

                <article className="rounded-[2rem] border border-[#b8d9d4] bg-white p-6 shadow-sm sm:p-8">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e2f4f0] text-[#168e91]"><Star className="h-6 w-6" /></span>
                    <h2 className="mt-5 font-serif text-2xl font-bold text-[#123e3d]">{copy.installTitle}</h2>
                    <p className="mt-3 leading-7 text-[#547875]">{copy.installText}</p>
                    {installPrompt ? (
                        <button type="button" onClick={installApp} className="mt-6 min-h-11 rounded-full bg-[#168e91] px-5 py-2.5 font-bold text-white">{copy.installButton}</button>
                    ) : (
                        <p className="mt-5 rounded-2xl bg-[#edf8f6] p-4 text-sm font-semibold leading-6 text-[#456b68]">{copy.installManual}</p>
                    )}
                </article>

                <article className="rounded-[2rem] border border-[#b8d9d4] bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="font-serif text-2xl font-bold text-[#123e3d]">Spirit Healing</h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Link to="/kontakt" className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#edf8f6] px-4 py-3 font-bold text-[#315b58]"><Mail className="h-4 w-4" />{copy.newsletter}</Link>
                        <Link to="/datenschutz" className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#edf8f6] px-4 py-3 font-bold text-[#315b58]"><LockKeyhole className="h-4 w-4" />{copy.privacy}</Link>
                        <Link to="/impressum" className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#edf8f6] px-4 py-3 font-bold text-[#315b58]"><BookOpen className="h-4 w-4" />{copy.imprint}</Link>
                        <a href="https://www.instagram.com/spirit4healing/" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#edf8f6] px-4 py-3 font-bold text-[#315b58]"><Instagram className="h-4 w-4" />Instagram</a>
                    </div>
                    <div className="mt-5 flex gap-2">
                        <a href="https://www.facebook.com/profile.php?id=61588723230682" target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b8d9d4] text-[#168e91]" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
                        <a href="https://www.instagram.com/spirit4healing/" target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b8d9d4] text-[#168e91]" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                    </div>
                </article>

                {member?.role === "admin" && (
                    <article className="rounded-[2rem] border border-[#d8bf74] bg-[#fff9e8] p-6 shadow-sm sm:p-8 lg:col-span-2">
                        <Crown className="h-7 w-7 text-[#9a7720]" />
                        <h2 className="mt-4 font-serif text-2xl font-bold text-[#123e3d]">{copy.adminTitle}</h2>
                        <p className="mt-3 max-w-3xl leading-7 text-[#5d706d]">{copy.adminText}</p>
                        <a href="https://vimeo.com/manage/videos" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#123e3d] px-5 py-2.5 font-bold text-white">{copy.openVimeo}<ExternalLink className="h-4 w-4" /></a>

                        <div className="mt-8 border-t border-[#d8bf74]/55 pt-7">
                            <h3 className="font-serif text-2xl font-bold text-[#123e3d]">{copy.funnelTitle}</h3>
                            <p className="mt-2 max-w-3xl leading-7 text-[#5d706d]">{copy.funnelText}</p>
                            {funnelSummary ? (
                                <>
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                        {[
                                            [copy.funnelLanding, funnelSummary.landingViews],
                                            [copy.funnelStarted, funnelSummary.registrationStarts],
                                            [copy.funnelRegistered, funnelSummary.registrations],
                                            [copy.funnelActivated, funnelSummary.activations],
                                            [copy.funnelRate, funnelSummary.registrationRate === null ? "–" : `${funnelSummary.registrationRate} %`],
                                        ].map(([label, value]) => (
                                            <div key={label} className="rounded-2xl bg-white/80 p-4 shadow-sm">
                                                <p className="text-2xl font-bold text-[#08777a]">{value}</p>
                                                <p className="mt-1 text-xs font-semibold leading-5 text-[#5d706d]">{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-5 rounded-2xl bg-white/70 p-4">
                                        <p className="text-sm font-bold text-[#123e3d]">{copy.funnelSources}</p>
                                        {funnelSummary.sources?.length ? (
                                            <>
                                                <p className="mt-2 text-xs text-[#6a7b78]">{copy.funnelSourceLegend}</p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {funnelSummary.sources.map((source) => (
                                                        <span key={source.source} className="rounded-full border border-[#b8d9d4] bg-[#edf8f6] px-3 py-1.5 text-xs font-semibold text-[#315b58]">
                                                            {source.source}: {source.landingViews} · {source.registrations} · {source.activations}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        ) : <p className="mt-2 text-sm text-[#5d706d]">{copy.funnelEmpty}</p>}
                                    </div>
                                </>
                            ) : <p className="mt-5 text-sm text-[#5d706d]">{copy.funnelEmpty}</p>}
                        </div>
                    </article>
                )}
            </section>
        </>
    );

    const currentView = {
        home: homeView,
        library: libraryView,
        events: eventsView,
        support: supportView,
        account: accountView,
    }[activeView];

    return (
        <main data-no-translate className="min-h-screen bg-[#edf8f6] text-[#123e3d]">
            <div className="flex min-h-screen">
                {sidebar}
                <div className="min-w-0 flex-1">
                    {mobileHeader}
                    <div className="mx-auto w-full max-w-[1320px] px-4 pb-28 pt-7 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 xl:px-12">
                        {currentView}
                    </div>
                </div>
            </div>
            {mobileNavigation}
        </main>
    );
};
