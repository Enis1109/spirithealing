import { useEffect, useState } from "react";
import { CheckCircle2, Download, Facebook, FileText, Instagram, LoaderCircle, LockKeyhole, LogOut, MailCheck, PlayCircle, Send } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { submitForm } from "@/lib/submissions";

const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-primary/35 bg-white/90 px-4 py-3 text-base text-muted-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/25";

const content = {
    de: {
        eyebrow: "Kostenloser Mitgliederbereich",
        title: "Die Aufzeichnung in deinem geschützten Bereich",
        intro: "Registriere dich einmalig mit deiner E-Mail-Adresse. Wir senden dir einen sicheren Zugangslink – ganz ohne Passwort.",
        benefitTitle: "Das erwartet dich",
        benefits: [
            "Die geschnittene Aufzeichnung des Vortrags „Wer entscheidet eigentlich dein Leben?“",
            "Das Workbook zum Vortrag mit Reflexionsfragen und Übungen",
            "Ein dauerhaft gültiger persönlicher Zugangslink, den du jederzeit wiederverwenden kannst",
        ],
        formTitle: "Zugang anfordern",
        name: "Vor- und Nachname",
        namePlaceholder: "Wie dürfen wir dich ansprechen?",
        email: "E-Mail-Adresse",
        emailPlaceholder: "deine@email.de",
        emailFormat: "Bitte gib eine vollständige E-Mail-Adresse mit @ und Domain ein, zum Beispiel name@email.de.",
        privacyStart: "Ich habe die ",
        privacyLink: "Datenschutzerklärung",
        privacyEnd: " gelesen und bin mit der Speicherung meiner Angaben für den kostenlosen Mitgliederzugang einverstanden.",
        newsletter: "Ja, ich möchte per E-Mail über neue Vorträge, Seminare und Aufzeichnungen informiert werden.",
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
        processingTitle: "Die Aufzeichnung wird gerade vorbereitet",
        processingText: "Wir schneiden die Wortbeiträge der Teilnehmenden und unnötige Pausen sorgfältig heraus. Sobald die fertige Fassung bereitsteht, erscheint sie hier automatisch.",
        socialTitle: "Auch nach dem Vortrag mit uns verbunden bleiben",
        logout: "Abmelden",
        back: "Zur Vortragsseite",
    },
    tr: {
        eyebrow: "Ücretsiz üye alanı",
        title: "Seminer kaydı korumalı alanında",
        intro: "E-posta adresinle bir kez kayıt ol. Sana şifresiz ve güvenli bir erişim bağlantısı gönderelim.",
        benefitTitle: "Seni neler bekliyor?",
        benefits: [
            "“Hayatına aslında kim karar veriyor?” seminerinin düzenlenmiş kaydı",
            "Seminere eşlik eden düşünme soruları ve egzersizlerden oluşan çalışma kitabı",
            "İstediğin zaman yeniden kullanabileceğin kalıcı kişisel erişim bağlantısı",
        ],
        formTitle: "Erişim bağlantısı iste",
        name: "Ad ve soyad",
        namePlaceholder: "Sana nasıl hitap edelim?",
        email: "E-posta adresi",
        emailPlaceholder: "adiniz@email.com",
        emailFormat: "Lütfen @ işareti ve alan adı içeren tam bir e-posta adresi gir, örneğin ad@email.com.",
        privacyStart: "",
        privacyLink: "Gizlilik bildirimini",
        privacyEnd: " okudum ve bilgilerimin ücretsiz üye erişimi için saklanmasını kabul ediyorum.",
        newsletter: "Evet, yeni seminerler, eğitimler ve kayıtlar hakkında e-posta almak istiyorum.",
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
    const [sessionState, setSessionState] = useState("loading");
    const [member, setMember] = useState(null);
    const [recordingAvailable, setRecordingAvailable] = useState(false);
    const [workbookAvailable, setWorkbookAvailable] = useState(false);
    const [meditations, setMeditations] = useState({ loslassenAvailable: false, wiedergeburtAvailable: false });
    const [submitState, setSubmitState] = useState("idle");
    const [newsletterStatus, setNewsletterStatus] = useState("not_requested");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let active = true;
        fetch("/api/members/session", { headers: { Accept: "application/json" } })
            .then(async (response) => response.ok ? response.json() : null)
            .then((result) => {
                if (!active) return;
                if (result?.ok) {
                    setMember(result.member);
                    setRecordingAvailable(result.recordingAvailable);
                    setWorkbookAvailable(result.workbookAvailable);
                    setMeditations(result.meditations || { loslassenAvailable: false, wiedergeburtAvailable: false });
                    setSessionState("member");
                } else {
                    setSessionState("guest");
                }
            })
            .catch(() => active && setSessionState("guest"));
        return () => { active = false; };
    }, []);

    const handleSubmit = async (event) => {
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
            });
            setNewsletterStatus(result.newsletterStatus);
            setSubmitState("sent");
            form.reset();
        } catch (error) {
            setErrorMessage(error.code === "rate_limit" ? copy.rateError : copy.error);
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

    if (sessionState === "member") {
        return (
            <main data-no-translate className="min-h-screen bg-card px-4 pb-14 pt-28 text-white sm:px-6">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.memberEyebrow}</p>
                            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{copy.welcome}, {member?.name}</h1>
                        </div>
                        <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 py-2 font-semibold text-white/85 transition hover:bg-white/10">
                            <LogOut className="h-4 w-4" aria-hidden="true" />{copy.logout}
                        </button>
                    </div>

                    <section className="mt-9 overflow-hidden rounded-[2rem] bg-[#f7f1e7] text-muted-foreground shadow-2xl">
                        <div className="p-6 sm:p-9">
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Aufzeichnung · Kayıt</p>
                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{copy.recordingTitle}</h2>
                            <p className="mt-3 text-lg leading-8 text-muted-foreground/75">{copy.recordingText}</p>
                        </div>
                        {recordingAvailable ? (
                            <video className="aspect-video w-full bg-black" controls playsInline preload="metadata" controlsList="nodownload" src="/api/members/recording">
                                <track kind="captions" />
                            </video>
                        ) : (
                            <div className="border-t border-primary/20 bg-primary/[0.08] p-7 sm:p-10">
                                <PlayCircle className="h-14 w-14 text-primary" aria-hidden="true" />
                                <h3 className="mt-5 text-2xl font-bold">{copy.processingTitle}</h3>
                                <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground/75">{copy.processingText}</p>
                            </div>
                        )}
                        {workbookAvailable && (
                            <div className="flex flex-col gap-5 border-t border-primary/20 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9">
                                <div className="flex max-w-2xl gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary"><FileText className="h-6 w-6" aria-hidden="true" /></div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{copy.workbookEyebrow}</p>
                                        <h3 className="mt-1 text-xl font-bold sm:text-2xl">{copy.workbookTitle}</h3>
                                        <p className="mt-2 leading-7 text-muted-foreground/75">{copy.workbookText}</p>
                                    </div>
                                </div>
                                <a href="/api/members/workbook" download className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                                    <Download className="h-5 w-5" aria-hidden="true" />{copy.workbookDownload}
                                </a>
                            </div>
                        )}
                    </section>

                    {(meditations.loslassenAvailable || meditations.wiedergeburtAvailable) && (
                        <section className="mt-8 rounded-[2rem] bg-[#f7f1e7] p-6 text-muted-foreground shadow-2xl sm:p-9">
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{copy.meditationEyebrow}</p>
                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{copy.meditationTitle}</h2>
                            <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground/75">{copy.meditationIntro}</p>
                            <div className="mt-7 grid gap-6 md:grid-cols-2">
                                {meditations.loslassenAvailable && (
                                    <article className="overflow-hidden rounded-3xl border border-primary/20 bg-white/70">
                                        <img src="/images/meditations/loslassen-reinigen.png" alt="Spirit Healing Meditation Loslassen und Reinigen" className="aspect-square w-full object-cover" />
                                        <div className="p-5">
                                            <h3 className="text-2xl font-bold">{copy.loslassenTitle}</h3>
                                            <p className="mt-2 min-h-14 leading-7 text-muted-foreground/75">{copy.loslassenText}</p>
                                            <audio className="mt-4 w-full" controls preload="metadata" src="/api/members/meditations/loslassen" />
                                            <a href="/api/members/meditations/loslassen?download=1" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground"><Download className="h-5 w-5" />{copy.meditationDownload}</a>
                                        </div>
                                    </article>
                                )}
                                {meditations.wiedergeburtAvailable && (
                                    <article className="overflow-hidden rounded-3xl border border-primary/20 bg-white/70">
                                        <img src="/images/meditations/wiedergeburt.png" alt="Spirit Healing Meditation Wiedergeburt" className="aspect-square w-full object-cover" />
                                        <div className="p-5">
                                            <h3 className="text-2xl font-bold">{copy.wiedergeburtTitle}</h3>
                                            <p className="mt-2 min-h-14 leading-7 text-muted-foreground/75">{copy.wiedergeburtText}</p>
                                            <audio className="mt-4 w-full" controls preload="metadata" src="/api/members/meditations/wiedergeburt" />
                                            <a href="/api/members/meditations/wiedergeburt?download=1" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground"><Download className="h-5 w-5" />{copy.meditationDownload}</a>
                                        </div>
                                    </article>
                                )}
                            </div>
                        </section>
                    )}

                    <section className="mt-8 rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 sm:p-8">
                        <h2 className="text-2xl font-bold">{copy.socialTitle}</h2>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <a href="https://www.instagram.com/spirit4healing/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground"><Instagram className="h-5 w-5" />Instagram</a>
                            <a href="https://www.facebook.com/profile.php?id=61588723230682" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/50 px-5 py-2.5 font-bold text-white"><Facebook className="h-5 w-5" />Facebook</a>
                        </div>
                    </section>

                    <Link to="/vortraege-seminare" className="mt-8 inline-flex text-sm font-bold text-primary underline underline-offset-4">{copy.back}</Link>
                </div>
            </main>
        );
    }

    return (
        <main data-no-translate className="min-h-screen bg-card px-4 pb-16 pt-28 text-white sm:px-6">
            <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <section className="lg:sticky lg:top-28">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary"><LockKeyhole className="h-7 w-7" /></div>
                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
                    <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{copy.title}</h1>
                    <p className="mt-5 text-lg leading-8 text-white/80">{copy.intro}</p>
                    <h2 className="mt-8 text-xl font-bold">{copy.benefitTitle}</h2>
                    <div className="mt-4 space-y-3">
                        {copy.benefits.map((benefit) => <p key={benefit} className="flex gap-3 text-white/80"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />{benefit}</p>)}
                    </div>
                </section>

                <section className="rounded-[2rem] bg-[#f7f1e7] p-6 text-muted-foreground shadow-2xl sm:p-9">
                    {submitState === "sent" ? (
                        <div className="py-6 text-center">
                            <MailCheck className="mx-auto h-16 w-16 text-primary" />
                            <h2 className="mt-5 text-3xl font-bold">{copy.sentTitle}</h2>
                            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground/75">{copy.sentText}</p>
                            {newsletterStatus === "pending" && <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-primary/10 p-4 text-sm">{copy.newsletterSent}</p>}
                            <button type="button" onClick={() => setSubmitState("idle")} className="mt-7 rounded-full border border-primary/45 px-5 py-3 font-bold text-primary">{copy.resend}</button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold">{copy.formTitle}</h2>
                            {searchParams.get("state") === "invalid" && <p role="alert" className="mt-4 rounded-2xl border border-amber-400/50 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{copy.invalid}</p>}
                            <form onSubmit={handleSubmit} className="mt-6">
                                <div className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label></div>
                                <label className="block text-sm font-semibold">{copy.name} *<input className={fieldClass} name="name" type="text" autoComplete="name" maxLength={100} placeholder={copy.namePlaceholder} required /></label>
                                <label className="mt-5 block text-sm font-semibold">{copy.email} *<input className={fieldClass} name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$" title={copy.emailFormat} placeholder={copy.emailPlaceholder} required /><span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground/60">{copy.emailFormat}</span></label>
                                <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6"><input className="mt-1.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="privacy" required /><span>{copy.privacyStart}<Link to="/datenschutz" target="_blank" className="font-semibold text-primary underline underline-offset-2">{copy.privacyLink}</Link>{copy.privacyEnd}</span></label>
                                <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/[0.07] p-4"><label className="flex cursor-pointer items-start gap-3 text-sm font-semibold leading-6"><input className="mt-1.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="newsletter" /><span>{copy.newsletter}</span></label><p className="ml-7 mt-2 text-xs leading-5 text-muted-foreground/70">{copy.newsletterHint}</p></div>
                                {errorMessage && <p role="alert" className="mt-5 rounded-2xl border border-red-400/40 bg-red-50 p-4 text-sm leading-6 text-red-800">{errorMessage}</p>}
                                <button type="submit" disabled={submitState === "submitting"} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface disabled:cursor-wait disabled:opacity-65">{submitState === "submitting" ? copy.submitting : copy.submit}<Send className="h-5 w-5" /></button>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
};
