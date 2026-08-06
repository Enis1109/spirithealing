import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, LockKeyhole, MailCheck, Send } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { submitForm } from "@/lib/submissions";
import { MemberApp } from "@/sections/MemberApp";
import { ProgramArea } from "@/sections/ProgramArea";
import { readAttribution, trackFunnelEvent } from "@/lib/funnelTracking";

const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-primary/35 bg-white/90 px-4 py-3 text-base text-muted-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/25";

const content = {
    de: {
        eyebrow: "Kostenloser Mitgliederbereich",
        campaignEyebrow: "0 € · kein Abo · sofort verfügbar",
        title: "Deine kostenlose Spirit-Healing-Mediathek",
        intro: "Melde dich mit E-Mail-Adresse und Passwort an. Wenn du bereits einen persönlichen Direktlink von uns hast, kannst du ihn unverändert weiterverwenden.",
        campaignIntro: "Erstelle jetzt dein kostenloses Konto. Nach der Bestätigung kannst du beide Meditationen, den vollständigen Vortrag und das Workbook direkt öffnen.",
        campaignTrust: "Dein Zugang bleibt kostenlos. Du kannst jederzeit zurückkehren und in deinem eigenen Tempo weitergehen.",
        benefitTitle: "Das erwartet dich",
        benefits: [
            "Zwei geführte Meditationen: „Loslassen & Reinigen“ und „Wiedergeburt“",
            "Die Aufzeichnung des Vortrags „Wer entscheidet eigentlich dein Leben?“",
            "Das Workbook zum Vortrag mit Reflexionsfragen und Übungen",
            "Ein persönliches Konto – bestehende Direktlinks bleiben dauerhaft gültig",
        ],
        formTitle: "Kostenlosen Zugang anfordern",
        name: "Vor- und Nachname",
        namePlaceholder: "Wie dürfen wir dich ansprechen?",
        email: "E-Mail-Adresse",
        emailPlaceholder: "deine@email.de",
        emailFormat: "Bitte gib eine vollständige E-Mail-Adresse mit @ und Domain ein, zum Beispiel name@email.de.",
        privacyStart: "Ich habe die ",
        privacyLink: "Datenschutzerklärung",
        privacyEnd: " gelesen und bin mit der Speicherung meiner Angaben für den kostenlosen Mitgliederzugang einverstanden.",
        newsletter: "Ja, ich möchte per E-Mail über neue Meditationen, Vorträge, Seminare und Aufzeichnungen informiert werden.",
        newsletterHint: "Freiwillig. Du bestätigst die Newsletter-Anmeldung über einen separaten Link. Der Mitgliederzugang ist davon unabhängig.",
        submit: "Zugangslink senden",
        submitting: "Zugangslink wird gesendet …",
        sentTitle: "Bitte prüfe dein E-Mail-Postfach",
        sentText: "Wir haben dir einen persönlichen Zugangslink gesendet. Er bleibt dauerhaft gültig und kann jederzeit erneut verwendet werden. Prüfe bei Bedarf auch deinen Spam-Ordner.",
        newsletterSent: "Für den Newsletter folgt zusätzlich eine eigene Bestätigungs-E-Mail.",
        resend: "Andere E-Mail-Adresse verwenden",
        invalid: "Dieser Zugangslink konnte nicht erkannt werden. Fordere bitte einen neuen persönlichen Link an.",
        error: "Der Zugangslink konnte gerade nicht versendet werden. Bitte versuche es erneut oder schreibe an info@spirit-healing.tr.",
        rateError: "Es wurden zu viele Zugangslinks in kurzer Zeit angefordert. Bitte versuche es in einigen Minuten erneut.",
        loginTitle: "Im Mitgliederbereich anmelden",
        registerTitle: "Kostenloses Konto erstellen",
        loginTab: "Anmelden",
        registerTab: "Neu registrieren",
        password: "Passwort",
        newPassword: "Neues Passwort",
        confirmPassword: "Passwort wiederholen",
        passwordHint: "Mindestens 10 Zeichen.",
        loginSubmit: "Jetzt anmelden",
        registering: "Konto wird eingerichtet …",
        registerSubmit: "Kostenlos registrieren",
        forgotLink: "Passwort vergessen?",
        forgotTitle: "Neues Passwort anfordern",
        forgotText: "Gib deine E-Mail-Adresse ein. Wenn dazu ein Konto besteht, erhältst du gleich einen Link für ein neues Passwort.",
        forgotSubmit: "Link per E-Mail senden",
        forgotSentTitle: "Schau bitte in dein E-Mail-Postfach",
        forgotSentText: "Wenn unter dieser Adresse ein Konto besteht, haben wir dir einen Link zum Festlegen eines neuen Passworts geschickt.",
        adminRecoveryEyebrow: "Admin-Zugang",
        adminRecoveryTitle: "Passwort für den Admin-Bereich zurücksetzen",
        adminRecoveryIntro: "Die freigegebene Admin-Adresse ist bereits eingetragen. Fordere den Link an und lege anschließend dein neues Passwort fest.",
        resetTitle: "Neues Passwort festlegen",
        resetSubmit: "Passwort speichern",
        resetSuccess: "Dein neues Passwort ist gespeichert. Du kannst dich jetzt anmelden.",
        resetInvalid: "Dieser Link ist nicht mehr gültig. Fordere bitte einen neuen Link an.",
        passwordsMismatch: "Die beiden Passwörter stimmen nicht überein.",
        loginError: "E-Mail-Adresse oder Passwort stimmen nicht. Wenn du bisher nur einen Direktlink nutzt, kannst du über „Passwort vergessen“ ein Passwort anlegen.",
        authError: "Das hat gerade nicht geklappt. Bitte versuche es erneut oder schreibe an info@spirit-healing.tr.",
        directLinkTitle: "Lieber mit deinem persönlichen Direktlink?",
        directLinkText: "Deine bisherigen Direktlinks bleiben gültig. Wenn du einen neuen Link benötigst, kannst du ihn hier anfordern.",
        directLinkButton: "Neuen Direktlink anfordern",
        backToLogin: "Zurück zur Anmeldung",
        memberEyebrow: "Dein Mitgliederbereich",
        welcome: "Schön, dass du da bist",
        recordingTitle: "Wer entscheidet eigentlich dein Leben?",
        recordingText: "Die Aufzeichnung des Live-Vortrags vom 26. Juli 2026.",
        workbookEyebrow: "Workbook zum Vortrag",
        workbookTitle: "Deine Fragen und Übungen zum Weiterarbeiten",
        workbookText: "Neun gestaltete Seiten, mit denen du deine inneren Anteile, ihre Schutzabsichten und deine Selbstführung vertiefen kannst.",
        workbookDownload: "Workbook herunterladen",
        meditationEyebrow: "Spirit Healing Meditationen",
        meditationTitle: "Geführte Meditationen für deinen Prozess",
        meditationIntro: "Nimm dir einen geschützten Moment für dich. Du kannst beide Meditationen direkt anhören oder für später herunterladen.",
        loslassenTitle: "Loslassen & Reinigen",
        loslassenText: "Eine geführte Meditation zum bewussten Loslassen und inneren Reinigen.",
        wiedergeburtTitle: "Wiedergeburt",
        wiedergeburtText: "Eine geführte Meditation für Übergang, Neuausrichtung und einen neuen inneren Beginn.",
        meditationDownload: "MP3 herunterladen",
        meditationProcessing: "Die beiden Meditationen werden gerade für die Wiedergabe vorbereitet. Sobald sie bereitstehen, erscheinen die Abspielknöpfe hier automatisch.",
        processingTitle: "Die Aufzeichnung wird gerade vorbereitet",
        processingText: "Wir schneiden die Wortbeiträge der Teilnehmenden und unnötige Pausen sorgfältig heraus. Sobald die fertige Fassung bereitsteht, erscheint sie hier automatisch.",
        socialTitle: "Auch nach dem Vortrag mit uns verbunden bleiben",
        logout: "Abmelden",
        back: "Zur Vortragsseite",
    },
    tr: {
        eyebrow: "Ücretsiz üye alanı",
        campaignEyebrow: "0 € · abonelik yok · hemen erişim",
        title: "Ücretsiz Spirit Healing içerik alanın",
        intro: "E-posta adresin ve şifrenle giriş yap. Daha önce aldığın kişisel erişim bağlantısı varsa onu aynı şekilde kullanmaya devam edebilirsin.",
        campaignIntro: "Ücretsiz hesabını şimdi oluştur. Onaydan sonra iki meditasyonu, seminer kaydının tamamını ve çalışma kitabını doğrudan açabilirsin.",
        campaignTrust: "Erişimin ücretsiz kalır. İstediğin zaman geri dönüp kendi hızında devam edebilirsin.",
        benefitTitle: "Seni neler bekliyor?",
        benefits: [
            "İki rehberli meditasyon: “Bırakmak ve Arınmak” ve “Yeniden Doğuş”",
            "“Hayatına aslında kim karar veriyor?” seminerinin kaydı",
            "Seminere eşlik eden düşünme soruları ve egzersizlerden oluşan çalışma kitabı",
            "Kişisel hesabın – mevcut erişim bağlantıların kalıcı olarak geçerli kalır",
        ],
        formTitle: "Ücretsiz erişim bağlantısı iste",
        name: "Ad ve soyad",
        namePlaceholder: "Sana nasıl hitap edelim?",
        email: "E-posta adresi",
        emailPlaceholder: "adiniz@email.com",
        emailFormat: "Lütfen @ işareti ve alan adı içeren tam bir e-posta adresi gir, örneğin ad@email.com.",
        privacyStart: "",
        privacyLink: "Gizlilik bildirimini",
        privacyEnd: " okudum ve bilgilerimin ücretsiz üye erişimi için saklanmasını kabul ediyorum.",
        newsletter: "Evet, yeni meditasyonlar, seminerler, eğitimler ve kayıtlar hakkında e-posta almak istiyorum.",
        newsletterHint: "İsteğe bağlıdır. Bülten aboneliğini ayrı bir bağlantıyla onaylarsın; üye erişimin bundan bağımsızdır.",
        submit: "Erişim bağlantısını gönder",
        submitting: "Erişim bağlantısı gönderiliyor …",
        sentTitle: "Lütfen e-posta kutunu kontrol et",
        sentText: "Kişisel erişim bağlantını gönderdik. Bağlantı kalıcıdır ve istediğin zaman yeniden kullanılabilir. Gerekirse spam klasörünü de kontrol et.",
        newsletterSent: "Bülten için ayrıca bir onay e-postası gönderilir.",
        resend: "Başka bir e-posta adresi kullan",
        invalid: "Bu erişim bağlantısı tanınamadı. Lütfen yeni bir kişisel bağlantı iste.",
        error: "Erişim bağlantısı şu anda gönderilemedi. Lütfen yeniden dene veya info@spirit-healing.tr adresine yaz.",
        rateError: "Kısa süre içinde çok fazla erişim bağlantısı istendi. Lütfen birkaç dakika sonra yeniden dene.",
        loginTitle: "Üye alanına giriş yap",
        registerTitle: "Ücretsiz hesap oluştur",
        loginTab: "Giriş yap",
        registerTab: "Yeni kayıt",
        password: "Şifre",
        newPassword: "Yeni şifre",
        confirmPassword: "Şifreyi tekrarla",
        passwordHint: "En az 10 karakter.",
        loginSubmit: "Giriş yap",
        registering: "Hesap hazırlanıyor …",
        registerSubmit: "Ücretsiz kayıt ol",
        forgotLink: "Şifreni mi unuttun?",
        forgotTitle: "Yeni şifre bağlantısı iste",
        forgotText: "E-posta adresini gir. Bu adrese ait bir hesap varsa yeni şifre belirlemen için sana bir bağlantı göndereceğiz.",
        forgotSubmit: "Bağlantıyı e-postayla gönder",
        forgotSentTitle: "Lütfen e-posta kutunu kontrol et",
        forgotSentText: "Bu adrese ait bir hesap varsa yeni şifre belirleme bağlantısını gönderdik.",
        adminRecoveryEyebrow: "Yönetici erişimi",
        adminRecoveryTitle: "Yönetici alanı şifresini yenile",
        adminRecoveryIntro: "Yetkili yönetici e-posta adresi hazır. Bağlantıyı iste ve ardından yeni şifreni belirle.",
        resetTitle: "Yeni şifre belirle",
        resetSubmit: "Şifreyi kaydet",
        resetSuccess: "Yeni şifren kaydedildi. Şimdi giriş yapabilirsin.",
        resetInvalid: "Bu bağlantı artık geçerli değil. Lütfen yeni bir bağlantı iste.",
        passwordsMismatch: "Girdiğin şifreler aynı değil.",
        loginError: "E-posta adresi veya şifre doğru değil. Şimdiye kadar yalnızca kişisel bağlantı kullandıysan “Şifreni mi unuttun?” üzerinden şifre oluşturabilirsin.",
        authError: "İşlem şu anda tamamlanamadı. Lütfen yeniden dene veya info@spirit-healing.tr adresine yaz.",
        directLinkTitle: "Kişisel erişim bağlantını mı kullanmak istiyorsun?",
        directLinkText: "Mevcut erişim bağlantıların geçerli kalır. Yeni bir bağlantıya ihtiyacın varsa buradan isteyebilirsin.",
        directLinkButton: "Yeni erişim bağlantısı iste",
        backToLogin: "Giriş sayfasına dön",
        memberEyebrow: "Üye alanın",
        welcome: "Aramıza hoş geldin",
        recordingTitle: "Hayatına aslında kim karar veriyor?",
        recordingText: "26 Temmuz 2026 tarihli canlı seminerin kaydı.",
        workbookEyebrow: "Seminer çalışma kitabı",
        workbookTitle: "Çalışmaya devam etmek için sorular ve egzersizler",
        workbookText: "İçsel parçalarını, koruma amaçlarını ve öz liderliğini daha derin keşfetmen için hazırlanmış dokuz sayfa.",
        workbookDownload: "Çalışma kitabını indir",
        meditationEyebrow: "Spirit Healing Meditasyonları",
        meditationTitle: "Sürecin için rehberli meditasyonlar",
        meditationIntro: "Kendine korunaklı bir an ayır. Her iki meditasyonu da doğrudan dinleyebilir veya daha sonrası için indirebilirsin.",
        loslassenTitle: "Bırakmak ve Arınmak",
        loslassenText: "Bilinçli bırakma ve içsel arınma için rehberli bir meditasyon.",
        wiedergeburtTitle: "Yeniden Doğuş",
        wiedergeburtText: "Geçiş, yeniden yönelme ve yeni bir içsel başlangıç için rehberli bir meditasyon.",
        meditationDownload: "MP3 indir",
        meditationProcessing: "İki meditasyon şu anda dinlemeye hazırlanıyor. Hazır olduklarında oynatma düğmeleri burada otomatik olarak görünecek.",
        processingTitle: "Kayıt hazırlanıyor",
        processingText: "Katılımcıların konuşmalarını ve gereksiz araları dikkatle çıkarıyoruz. Tamamlanan sürüm hazır olduğunda burada otomatik olarak görünecek.",
        socialTitle: "Seminerden sonra da bizimle bağlantıda kal",
        logout: "Çıkış yap",
        back: "Seminer sayfasına dön",
    },
};

export const MemberArea = () => {
    const { language } = useLanguage();
    const copy = content[language];
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const campaignLanding = location.pathname === "/gratis-meditationen";
    const recoveryEmail = searchParams.get("email") || "";
    const returnTo = searchParams.get("returnTo") === "/admin" ? "/admin" : "";
    const attribution = useMemo(
        () => readAttribution({ searchParams, pathname: location.pathname }),
        [location.pathname, searchParams],
    );
    const registrationStarted = useRef(false);
    const [sessionState, setSessionState] = useState("loading");
    const [member, setMember] = useState(null);
    const [recordingAvailable, setRecordingAvailable] = useState(false);
    const [recordingEmbedUrl, setRecordingEmbedUrl] = useState("");
    const [workbookAvailable, setWorkbookAvailable] = useState(false);
    const [meditations, setMeditations] = useState({ loslassenAvailable: false, wiedergeburtAvailable: false });
    const [contentState, setContentState] = useState([]);
    const [premiumCheckoutUrl, setPremiumCheckoutUrl] = useState("");
    const [programs, setPrograms] = useState([]);
    const [submitState, setSubmitState] = useState("idle");
    const [newsletterStatus, setNewsletterStatus] = useState("not_requested");
    const [errorMessage, setErrorMessage] = useState("");
    const [mode, setMode] = useState(() => {
        if (searchParams.get("reset")) return "reset";
        const requestedMode = searchParams.get("mode");
        if (["login", "register", "forgot", "access"].includes(requestedMode)) return requestedMode;
        return campaignLanding ? "register" : "login";
    });

    useEffect(() => {
        trackFunnelEvent({
            eventName: "landing_view",
            eventKey: campaignLanding ? "gratis_meditationen" : "member_area",
            attribution,
            locale: language,
        });
    }, [attribution, campaignLanding, language]);

    useEffect(() => {
        const robots = document.querySelector('meta[name="robots"]');
        const description = document.querySelector('meta[name="description"]');
        const previousRobots = robots?.getAttribute("content");
        const previousDescription = description?.getAttribute("content");
        const previousTitle = document.title;

        robots?.setAttribute("content", campaignLanding ? "index, follow" : "noindex, nofollow");
        if (campaignLanding) {
            document.title = language === "tr"
                ? "2 ücretsiz meditasyon, seminer ve çalışma kitabı | Spirit Healing"
                : "2 kostenlose Meditationen, Vortrag & Workbook | Spirit Healing";
            description?.setAttribute("content", language === "tr"
                ? "İki rehberli meditasyona, Spirit Healing seminerine ve çalışma kitabına ücretsiz erişim oluştur."
                : "Sichere dir kostenlosen Zugang zu zwei geführten Meditationen, dem Spirit-Healing-Vortrag und dem begleitenden Workbook.");
        }

        return () => {
            if (previousRobots) robots?.setAttribute("content", previousRobots);
            if (previousDescription) description?.setAttribute("content", previousDescription);
            document.title = previousTitle;
        };
    }, [campaignLanding, language]);

    useEffect(() => {
        let active = true;
        fetch("/api/members/session", { headers: { Accept: "application/json" } })
            .then(async (response) => response.ok ? response.json() : null)
            .then((result) => {
                if (!active) return;
                if (result?.ok) {
                    setMember(result.member);
                    setRecordingAvailable(result.recordingAvailable);
                    setRecordingEmbedUrl(result.recordingEmbedUrl || "");
                    setWorkbookAvailable(result.workbookAvailable);
                    setMeditations(result.meditations || { loslassenAvailable: false, wiedergeburtAvailable: false });
                    setContentState(result.contentState || []);
                    setPremiumCheckoutUrl(result.premiumCheckoutUrl || "");
                    setPrograms(result.programs || []);
                    setSessionState("member");
                } else {
                    setSessionState("guest");
                }
            })
            .catch(() => active && setSessionState("guest"));
        return () => { active = false; };
    }, []);

    const changeMode = (nextMode) => {
        setMode(nextMode);
        setSubmitState("idle");
        setNewsletterStatus("not_requested");
        setErrorMessage("");
        if (nextMode === "register") {
            trackFunnelEvent({ eventName: "registration_start", eventKey: "member_area", attribution, locale: language });
        }
    };

    const markRegistrationStart = () => {
        if (registrationStarted.current) return;
        registrationStarted.current = true;
        trackFunnelEvent({ eventName: "registration_start", eventKey: "member_area", attribution, locale: language });
    };

    const handleAccessSubmit = async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setErrorMessage("");
        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const result = await submitForm("/api/members/request-access", {
                name: formData.get("name"),
                email: formData.get("email"),
                privacyConsent: formData.get("privacy") === "on",
                newsletterConsent: formData.get("newsletter") === "on",
                company: formData.get("company"),
                locale: language,
                attribution,
            });
            setNewsletterStatus(result.newsletterStatus);
            setSubmitState("sent");
            form.reset();
        } catch (error) {
            setErrorMessage(error.code === "rate_limit" ? copy.rateError : copy.error);
            setSubmitState("error");
        }
    };

    const handleRegistration = async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setErrorMessage("");
        const form = event.currentTarget;
        const formData = new FormData(form);
        await trackFunnelEvent({ eventName: "registration_submit", eventKey: "member_area", attribution, locale: language });

        try {
            const result = await submitForm("/api/members/register", {
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password"),
                privacyConsent: formData.get("privacy") === "on",
                newsletterConsent: formData.get("newsletter") === "on",
                company: formData.get("company"),
                locale: language,
                attribution,
            });
            setNewsletterStatus(result.newsletterStatus);
            setSubmitState("sent");
            form.reset();
        } catch (error) {
            setErrorMessage(error.code === "rate_limit" ? copy.rateError : copy.authError);
            setSubmitState("error");
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setErrorMessage("");
        const formData = new FormData(event.currentTarget);

        try {
            await submitForm("/api/members/login", {
                email: formData.get("email"),
                password: formData.get("password"),
            });
            window.location.assign("/mitglieder");
        } catch (error) {
            setErrorMessage(error.code === "invalid_credentials" ? copy.loginError : (error.code === "rate_limit" ? copy.rateError : copy.authError));
            setSubmitState("error");
        }
    };

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setErrorMessage("");
        const formData = new FormData(event.currentTarget);

        try {
            await submitForm("/api/members/password/forgot", {
                email: formData.get("email"),
                locale: language,
                returnTo,
            });
            setSubmitState("sent");
        } catch (error) {
            setErrorMessage(error.code === "rate_limit" ? copy.rateError : copy.authError);
            setSubmitState("error");
        }
    };

    const handlePasswordReset = async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setErrorMessage("");
        const formData = new FormData(event.currentTarget);
        const password = String(formData.get("password") || "");

        if (password !== String(formData.get("passwordConfirm") || "")) {
            setErrorMessage(copy.passwordsMismatch);
            setSubmitState("error");
            return;
        }

        try {
            await submitForm("/api/members/password/reset", {
                token: searchParams.get("reset"),
                password,
            });
            if (returnTo) {
                window.location.assign(returnTo);
            } else {
                window.history.replaceState({}, "", "/mitglieder?mode=login");
                setMode("login");
                setSubmitState("reset_complete");
            }
        } catch (error) {
            setErrorMessage(error.code === "invalid_reset_token" ? copy.resetInvalid : (error.code === "rate_limit" ? copy.rateError : copy.authError));
            setSubmitState("error");
        }
    };

    const logout = async () => {
        await fetch("/api/members/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
        setMember(null);
        setSessionState("guest");
    };

    if (sessionState === "loading") {
        return <main className="flex min-h-screen items-center justify-center bg-card text-primary"><LoaderCircle className="h-10 w-10 animate-spin" aria-label="Loading" /></main>;
    }
    const credentialFlow = mode === "forgot" || mode === "reset";

    if (sessionState === "member" && !credentialFlow) {
        if (location.pathname.startsWith("/mitglieder/programme/zepter")) {
            return <ProgramArea member={member} />;
        }
        return (
            <MemberApp
                language={language}
                member={member}
                recordingAvailable={recordingAvailable}
                recordingEmbedUrl={recordingEmbedUrl}
                workbookAvailable={workbookAvailable}
                meditations={meditations}
                initialContentState={contentState}
                premiumCheckoutUrl={premiumCheckoutUrl}
                programs={programs}
                onLogout={logout}
            />
        );
    }

    return (
        <main data-no-translate className="min-h-screen bg-card px-4 pb-16 pt-7 text-white sm:px-6">
            <div className="mx-auto mb-10 flex w-full max-w-6xl items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-3" aria-label="Spirit Healing Startseite">
                    <img src="/Logo-tuerkis.jpeg?v=20260730" alt="" className="h-14 w-14 rounded-full object-cover shadow-lg ring-2 ring-primary/75" />
                    <span className="font-serif text-xl font-bold">Spirit Healing</span>
                </Link>
                <Link to="/" className="rounded-full border border-white/25 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10">
                    {language === "tr" ? "Web sitesine dön" : "Zur Website"}
                </Link>
            </div>
            <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <section className="lg:sticky lg:top-28">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary"><LockKeyhole className="h-7 w-7" /></div>
                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary">{returnTo ? copy.adminRecoveryEyebrow : campaignLanding ? copy.campaignEyebrow : copy.eyebrow}</p>
                    <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{returnTo ? copy.adminRecoveryTitle : copy.title}</h1>
                    <p className="mt-5 text-lg leading-8 text-white/80">{returnTo ? copy.adminRecoveryIntro : campaignLanding ? copy.campaignIntro : copy.intro}</p>
                    {!returnTo && (
                        <>
                            <h2 className="mt-8 text-xl font-bold">{copy.benefitTitle}</h2>
                            <div className="mt-4 space-y-3">
                                {copy.benefits.map((benefit) => <p key={benefit} className="flex gap-3 text-white/80"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />{benefit}</p>)}
                            </div>
                            {campaignLanding && <p className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm font-semibold leading-6 text-white/85">{copy.campaignTrust}</p>}
                        </>
                    )}
                </section>

                <section className="rounded-[2rem] bg-[#f7f1e7] p-6 text-muted-foreground shadow-2xl sm:p-9">
                    {searchParams.get("state") === "invalid" && <p role="alert" className="mb-5 rounded-2xl border border-amber-400/50 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{copy.invalid}</p>}

                    {submitState === "sent" ? (
                        <div className="py-6 text-center">
                            <MailCheck className="mx-auto h-16 w-16 text-primary" />
                            <h2 className="mt-5 text-3xl font-bold">{mode === "forgot" ? copy.forgotSentTitle : copy.sentTitle}</h2>
                            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground/75">{mode === "forgot" ? copy.forgotSentText : copy.sentText}</p>
                            {newsletterStatus === "pending" && <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-primary/10 p-4 text-sm">{copy.newsletterSent}</p>}
                            <button type="button" onClick={() => changeMode("login")} className="mt-7 rounded-full border border-primary/45 px-5 py-3 font-bold text-primary">{copy.backToLogin}</button>
                        </div>
                    ) : (
                        <>
                            {mode !== "reset" && mode !== "forgot" && mode !== "access" && (
                                <div className="mb-7 grid grid-cols-2 rounded-full bg-primary/[0.08] p-1.5">
                                    <button type="button" onClick={() => changeMode("login")} className={`min-h-11 rounded-full px-4 py-2 font-bold transition ${mode === "login" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground/70"}`}>{copy.loginTab}</button>
                                    <button type="button" onClick={() => changeMode("register")} className={`min-h-11 rounded-full px-4 py-2 font-bold transition ${mode === "register" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground/70"}`}>{copy.registerTab}</button>
                                </div>
                            )}

                            {mode === "login" && (
                                <>
                                    <h2 className="text-3xl font-bold">{copy.loginTitle}</h2>
                                    {submitState === "reset_complete" && <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">{copy.resetSuccess}</p>}
                                    <form onSubmit={handleLogin} className="mt-6">
                                        <label className="block text-sm font-semibold">{copy.email} *<input className={fieldClass} name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} placeholder={copy.emailPlaceholder} defaultValue={recoveryEmail} required /></label>
                                        <label className="mt-5 block text-sm font-semibold">{copy.password} *<input className={fieldClass} name="password" type="password" autoComplete="current-password" minLength={10} maxLength={128} required /></label>
                                        {errorMessage && <p role="alert" className="mt-5 rounded-2xl border border-red-400/40 bg-red-50 p-4 text-sm leading-6 text-red-800">{errorMessage}</p>}
                                        <button type="submit" disabled={submitState === "submitting"} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface disabled:cursor-wait disabled:opacity-65">{submitState === "submitting" && <LoaderCircle className="h-5 w-5 animate-spin" />}{copy.loginSubmit}</button>
                                        <button type="button" onClick={() => changeMode("forgot")} className="mt-4 w-full text-center text-sm font-bold text-primary underline underline-offset-4">{copy.forgotLink}</button>
                                    </form>
                                </>
                            )}

                            {mode === "register" && (
                                <>
                                    <h2 className="text-3xl font-bold">{copy.registerTitle}</h2>
                                    <form onSubmit={handleRegistration} onFocusCapture={markRegistrationStart} className="mt-6">
                                        <div className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label></div>
                                        <label className="block text-sm font-semibold">{copy.name} *<input className={fieldClass} name="name" type="text" autoComplete="name" maxLength={100} placeholder={copy.namePlaceholder} required /></label>
                                        <label className="mt-5 block text-sm font-semibold">{copy.email} *<input className={fieldClass} name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} placeholder={copy.emailPlaceholder} required /></label>
                                        <label className="mt-5 block text-sm font-semibold">{copy.password} *<input className={fieldClass} name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /><span className="mt-1.5 block text-xs font-normal text-muted-foreground/60">{copy.passwordHint}</span></label>
                                        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6"><input className="mt-1.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="privacy" required /><span>{copy.privacyStart}<Link to="/datenschutz" target="_blank" className="font-semibold text-primary underline underline-offset-2">{copy.privacyLink}</Link>{copy.privacyEnd}</span></label>
                                        <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/[0.07] p-4"><label className="flex cursor-pointer items-start gap-3 text-sm font-semibold leading-6"><input className="mt-1.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="newsletter" /><span>{copy.newsletter}</span></label><p className="ml-7 mt-2 text-xs leading-5 text-muted-foreground/70">{copy.newsletterHint}</p></div>
                                        {errorMessage && <p role="alert" className="mt-5 rounded-2xl border border-red-400/40 bg-red-50 p-4 text-sm leading-6 text-red-800">{errorMessage}</p>}
                                        <button type="submit" disabled={submitState === "submitting"} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface disabled:cursor-wait disabled:opacity-65">{submitState === "submitting" ? copy.registering : copy.registerSubmit}<Send className="h-5 w-5" /></button>
                                    </form>
                                </>
                            )}

                            {mode === "forgot" && (
                                <>
                                    <h2 className="text-3xl font-bold">{copy.forgotTitle}</h2>
                                    <p className="mt-3 leading-7 text-muted-foreground/70">{copy.forgotText}</p>
                                    <form onSubmit={handleForgotPassword} className="mt-6">
                                        <label className="block text-sm font-semibold">{copy.email} *<input className={fieldClass} name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} placeholder={copy.emailPlaceholder} defaultValue={recoveryEmail} required /></label>
                                        {errorMessage && <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-800">{errorMessage}</p>}
                                        <button type="submit" disabled={submitState === "submitting"} className="mt-7 min-h-12 w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-65">{submitState === "submitting" ? copy.submitting : copy.forgotSubmit}</button>
                                        <button type="button" onClick={() => changeMode("login")} className="mt-4 w-full text-center text-sm font-bold text-primary underline underline-offset-4">{copy.backToLogin}</button>
                                    </form>
                                </>
                            )}

                            {mode === "reset" && (
                                <>
                                    <h2 className="text-3xl font-bold">{copy.resetTitle}</h2>
                                    <form onSubmit={handlePasswordReset} className="mt-6">
                                        <label className="block text-sm font-semibold">{copy.newPassword} *<input className={fieldClass} name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /><span className="mt-1.5 block text-xs font-normal text-muted-foreground/60">{copy.passwordHint}</span></label>
                                        <label className="mt-5 block text-sm font-semibold">{copy.confirmPassword} *<input className={fieldClass} name="passwordConfirm" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></label>
                                        {errorMessage && <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-800">{errorMessage}</p>}
                                        <button type="submit" disabled={submitState === "submitting"} className="mt-7 min-h-12 w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-65">{submitState === "submitting" ? copy.submitting : copy.resetSubmit}</button>
                                    </form>
                                </>
                            )}

                            {mode === "access" && (
                                <>
                                    <h2 className="text-3xl font-bold">{copy.formTitle}</h2>
                                    <form onSubmit={handleAccessSubmit} className="mt-6">
                                        <div className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label></div>
                                        <label className="block text-sm font-semibold">{copy.name} *<input className={fieldClass} name="name" type="text" autoComplete="name" maxLength={100} placeholder={copy.namePlaceholder} required /></label>
                                        <label className="mt-5 block text-sm font-semibold">{copy.email} *<input className={fieldClass} name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} placeholder={copy.emailPlaceholder} required /></label>
                                        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6"><input className="mt-1.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="privacy" required /><span>{copy.privacyStart}<Link to="/datenschutz" target="_blank" className="font-semibold text-primary underline underline-offset-2">{copy.privacyLink}</Link>{copy.privacyEnd}</span></label>
                                        {errorMessage && <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-800">{errorMessage}</p>}
                                        <button type="submit" disabled={submitState === "submitting"} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-65">{submitState === "submitting" ? copy.submitting : copy.submit}<Send className="h-5 w-5" /></button>
                                        <button type="button" onClick={() => changeMode("login")} className="mt-4 w-full text-center text-sm font-bold text-primary underline underline-offset-4">{copy.backToLogin}</button>
                                    </form>
                                </>
                            )}

                            {(mode === "login" || mode === "register") && (
                                <div className="mt-7 border-t border-primary/20 pt-6 text-center">
                                    <h3 className="font-bold">{copy.directLinkTitle}</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground/65">{copy.directLinkText}</p>
                                    <button type="button" onClick={() => changeMode("access")} className="mt-3 text-sm font-bold text-primary underline underline-offset-4">{copy.directLinkButton}</button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </main>
    );
};
