import { useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, ExternalLink, MonitorPlay, Send, Sparkles, UserPlus, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/Modal";
import { useLanguage } from "@/i18n/LanguageContext";
import { submitForm } from "@/lib/submissions";

const zoomUrl = "https://us06web.zoom.us/j/83378556575?pwd=1r3QjNen3GIaPLBYiHYJ5qTuEqMxP4.1";
const eventKey = "wer-entscheidet-dein-leben-2026-07-26";
const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-primary/35 bg-white/90 px-4 py-3 text-base text-muted-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/25";

const content = {
    de: {
        eyebrow: "Vorträge & Seminare",
        live: "Live-Vortrag via Zoom",
        title: "Wer entscheidet eigentlich dein Leben?",
        subtitle: "Warum du oft gegen dein eigenes Gefühl handelst – und wie innere Anteile deine Entscheidungen beeinflussen.",
        intro: "Du weißt, was du verändern möchtest – und trotzdem hält etwas in dir dagegen. In diesem Vortrag zeigen wir, warum solche inneren Widersprüche keine Schwäche sind und welche Schutzlogik hinter ihnen wirken kann.",
        dateLabel: "Termin",
        date: "Sonntag, 26. Juli 2026",
        timeLabel: "Uhrzeit",
        time: "10:00 Uhr (Berlin) · 11:00 Uhr (Türkiye)",
        formatLabel: "Format",
        format: "Live und online über Zoom",
        register: "Kostenlos anmelden",
        join: "Direkt am Zoom-Vortrag teilnehmen",
        access: "Der Zugangslink führt direkt in das geplante Zoom-Meeting.",
        meetingId: "Meeting-ID: 833 7855 6575",
        passcode: "Kenncode: 526287",
        topicsEyebrow: "Darum geht es",
        topicsTitle: "Innere Anteile verstehen, statt gegen dich selbst zu kämpfen",
        topicsIntro: "Der Vortrag verbindet psychologische Einordnung mit einer verständlichen Einführung in die systemische Anteilearbeit.",
        topics: [
            "Warum verschiedene innere Anteile unterschiedliche Entscheidungen treffen wollen",
            "Wie Schutzanteile Aufschieben, Anpassung, Kontrolle oder Rückzug beeinflussen können",
            "Weshalb eine vermeintlich unlogische Reaktion aus dem inneren System heraus Sinn ergeben kann",
            "Wie du Ereignis, Bewertung und automatische Schutzreaktion besser voneinander unterscheidest",
            "Was Selbstführung bedeutet und wie wieder mehr innerer Handlungsspielraum entsteht",
        ],
        audienceEyebrow: "Für wen ist der Vortrag?",
        audienceTitle: "Für Menschen, die sich selbst besser verstehen möchten",
        audienceText: "Der Vortrag ist für dich geeignet, wenn du Entscheidungen aufschiebst, immer wieder in dieselben inneren Konflikte gerätst oder spürst, dass ein Teil von dir Veränderung will, während ein anderer Teil bremst. Vorkenntnisse sind nicht nötig.",
        futureEyebrow: "Weitere Veranstaltungen",
        futureTitle: "Vorträge und Seminare mit Substanz",
        futureText: "Künftig findest du hier unsere Live-Vorträge, vertiefenden Online-Seminare und begleiteten Gruppenformate. Im Mittelpunkt stehen innere Anteile, Nervensystem, Beziehungsmuster, systemische Zusammenhänge und Energiearbeit.",
        contact: "Interesse an weiteren Terminen",
        registrationTitle: "Zum Vortrag anmelden",
        registrationIntro: "Nach der Anmeldung ist dein Platz gespeichert. Den Zoom-Zugang findest du weiterhin direkt auf dieser Seite.",
        name: "Vor- und Nachname",
        namePlaceholder: "Wie dürfen wir dich ansprechen?",
        email: "E-Mail-Adresse",
        emailPlaceholder: "deine@email.de",
        emailFormat: "Bitte gib eine vollständige E-Mail-Adresse mit @ und Domain ein, zum Beispiel name@email.de.",
        privacyStart: "Ich habe die ",
        privacyLink: "Datenschutzerklärung",
        privacyEnd: " gelesen und bin mit der Speicherung meiner Angaben für die Vortragsanmeldung einverstanden.",
        newsletter: "Ja, ich möchte per E-Mail über weitere Vorträge, Seminare und Termine informiert werden.",
        newsletterHint: "Freiwillig. Du bestätigst die Anmeldung anschließend über einen Link in einer separaten E-Mail.",
        submitRegistration: "Anmeldung senden",
        submitting: "Anmeldung wird gespeichert …",
        successTitle: "Deine Anmeldung ist gespeichert",
        successText: "Vielen Dank. Wir haben deinen Namen und deine E-Mail-Adresse für diesen Vortrag vorgemerkt.",
        successNewsletter: "Bitte bestätige den Newsletter noch über den Link in der separaten E-Mail.",
        done: "Fertig",
        close: "Fenster schließen",
        error: "Die Anmeldung konnte gerade nicht gespeichert werden. Bitte versuche es erneut oder schreibe an info@spirit-healing.tr.",
        rateError: "Es wurden zu viele Anmeldungen in kurzer Zeit gesendet. Bitte versuche es in einigen Minuten erneut.",
        legal: { imprint: "Impressum", privacy: "Datenschutz" },
    },
    tr: {
        eyebrow: "Seminerler & Eğitimler",
        live: "Zoom üzerinden canlı seminer",
        title: "Hayatına aslında kim karar veriyor?",
        subtitle: "Neden bazen kendi hislerine karşı hareket ediyorsun ve içsel parçaların kararlarını nasıl etkiliyor?",
        intro: "Neyi değiştirmek istediğini biliyorsun, ama yine de içinde bir şey buna karşı çıkıyor. Bu seminerde içsel çelişkilerin neden bir zayıflık olmadığını ve arkalarında hangi korunma mantığının bulunabileceğini anlatıyoruz.",
        dateLabel: "Tarih",
        date: "26 Temmuz 2026 Pazar",
        timeLabel: "Saat",
        time: "Berlin 10:00 · Türkiye 11:00",
        formatLabel: "Format",
        format: "Zoom üzerinden canlı ve çevrim içi",
        register: "Ücretsiz kayıt ol",
        join: "Zoom seminerine doğrudan katıl",
        access: "Bağlantı seni doğrudan planlanan Zoom toplantısına götürür.",
        meetingId: "Toplantı kimliği: 833 7855 6575",
        passcode: "Parola: 526287",
        topicsEyebrow: "Seminerin içeriği",
        topicsTitle: "Kendinle savaşmak yerine içsel parçalarını anlamak",
        topicsIntro: "Seminer, psikolojik çerçeveyi sistemik içsel parçalar çalışmasına anlaşılır bir girişle birleştiriyor.",
        topics: [
            "Farklı içsel parçaların neden farklı kararlar vermek istediği",
            "Koruyucu parçaların erteleme, uyum sağlama, kontrol veya geri çekilmeyi nasıl etkileyebildiği",
            "Dışarıdan mantıksız görünen bir tepkinin içsel sistem açısından neden anlamlı olabildiği",
            "Olayı, yorumu ve otomatik korunma tepkisini birbirinden nasıl ayırabileceğin",
            "Öz liderliğin ne anlama geldiği ve içsel hareket alanının nasıl genişleyebileceği",
        ],
        audienceEyebrow: "Kimler için?",
        audienceTitle: "Kendini daha iyi anlamak isteyen herkes için",
        audienceText: "Kararlarını erteliyorsan, sürekli aynı içsel çatışmalara giriyorsan veya bir parçan değişim isterken başka bir parçanın seni durdurduğunu hissediyorsan bu seminer sana hitap edebilir. Ön bilgi gerekmez.",
        futureEyebrow: "Gelecek etkinlikler",
        futureTitle: "İçi dolu seminer ve eğitimler",
        futureText: "Canlı seminerlerimizi, derinleştirici çevrim içi eğitimlerimizi ve eşlikli grup çalışmalarımızı ileride burada bulabileceksin. İçsel parçalar, sinir sistemi, ilişki örüntüleri, sistemik bağlantılar ve enerji çalışması temel konularımız arasında.",
        contact: "Yeni tarihlerle ilgileniyorum",
        registrationTitle: "Seminere kayıt ol",
        registrationIntro: "Kayıttan sonra yerin ayrılır. Zoom erişim bağlantısını bu sayfada görmeye devam edebilirsin.",
        name: "Ad ve soyad",
        namePlaceholder: "Sana nasıl hitap edelim?",
        email: "E-posta adresi",
        emailPlaceholder: "adiniz@email.com",
        emailFormat: "Lütfen @ işareti ve alan adı içeren tam bir e-posta adresi gir, örneğin ad@email.com.",
        privacyStart: "",
        privacyLink: "Gizlilik bildirimini",
        privacyEnd: " okudum ve bilgilerimin seminer kaydı için saklanmasını kabul ediyorum.",
        newsletter: "Evet, gelecek seminerler, eğitimler ve tarihler hakkında e-posta almak istiyorum.",
        newsletterHint: "İsteğe bağlıdır. Aboneliğini ayrı bir e-postadaki bağlantı üzerinden onaylarsın.",
        submitRegistration: "Kaydı gönder",
        submitting: "Kayıt kaydediliyor …",
        successTitle: "Kaydın alındı",
        successText: "Teşekkür ederiz. Adını ve e-posta adresini bu seminer için kaydettik.",
        successNewsletter: "Lütfen bülten aboneliğini ayrı e-postadaki bağlantı üzerinden onayla.",
        done: "Tamam",
        close: "Pencereyi kapat",
        error: "Kayıt şu anda kaydedilemedi. Lütfen yeniden dene veya info@spirit-healing.tr adresine yaz.",
        rateError: "Kısa süre içinde çok fazla kayıt gönderildi. Lütfen birkaç dakika sonra yeniden dene.",
        legal: { imprint: "Künye", privacy: "Gizlilik" },
    },
};

export const Events = () => {
    const { language } = useLanguage();
    const copy = content[language];
    const [registrationOpen, setRegistrationOpen] = useState(false);
    const [submitState, setSubmitState] = useState("idle");
    const [newsletterStatus, setNewsletterStatus] = useState("not_requested");
    const [errorMessage, setErrorMessage] = useState("");

    const openRegistration = () => {
        setSubmitState("idle");
        setNewsletterStatus("not_requested");
        setErrorMessage("");
        setRegistrationOpen(true);
    };

    const handleRegistration = async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setErrorMessage("");
        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const result = await submitForm("/api/event-registration", {
                eventKey,
                name: formData.get("name"),
                email: formData.get("email"),
                privacyConsent: formData.get("privacy") === "on",
                newsletterConsent: formData.get("newsletter") === "on",
                company: formData.get("company"),
                locale: language,
            });
            setNewsletterStatus(result.newsletterStatus);
            setSubmitState("success");
            form.reset();
        } catch (error) {
            setErrorMessage(error.code === "rate_limit" ? copy.rateError : copy.error);
            setSubmitState("error");
        }
    };

    const facts = [
        { icon: CalendarDays, label: copy.dateLabel, value: copy.date },
        { icon: Clock3, label: copy.timeLabel, value: copy.time },
        { icon: MonitorPlay, label: copy.formatLabel, value: copy.format },
    ];

    return (
        <main data-no-translate className="min-h-screen overflow-hidden bg-card pb-8 pt-24 text-white sm:pt-28">
            <section className="relative border-b border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_34%)]" aria-hidden="true" />
                <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:px-8">
                    <div>
                        <p className="font-semibold uppercase tracking-[0.2em] text-primary">{copy.eyebrow}</p>
                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/45 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
                            {copy.live}
                        </div>
                        <h1 className="mt-5 text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-6xl">{copy.title}</h1>
                        <p className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-primary">{copy.subtitle}</p>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">{copy.intro}</p>
                    </div>

                    <aside className="glass-strong rounded-[2rem] p-5 shadow-2xl shadow-black/15 sm:p-7" aria-label={copy.live}>
                        <div className="space-y-4">
                            {facts.map(({ icon, label, value }) => {
                                const FactIcon = icon;
                                return <div key={label} className="flex items-start gap-4 rounded-2xl bg-white/55 p-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                        <FactIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/55">{label}</p>
                                        <p className="mt-1 font-bold leading-6 text-muted-foreground">{value}</p>
                                    </div>
                                </div>;
                            })}
                        </div>
                        <button type="button" onClick={openRegistration} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-center font-bold text-primary-foreground transition hover:bg-surface">
                            {copy.register}
                            <UserPlus className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <a href={zoomUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-primary/45 bg-white/55 px-5 py-3.5 text-center font-bold text-muted-foreground transition hover:bg-white">
                            {copy.join}
                            <ExternalLink className="h-5 w-5" aria-hidden="true" />
                        </a>
                        <p className="mt-4 text-sm leading-6 text-muted-foreground/75">{copy.access}</p>
                        <div className="mt-3 space-y-1 text-sm font-semibold text-muted-foreground/75">
                            <p>{copy.meetingId}</p>
                            <p>{copy.passcode}</p>
                        </div>
                    </aside>
                </div>
            </section>

            <div className="mx-auto w-full max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                <section className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                    <div className="lg:sticky lg:top-28">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.topicsEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{copy.topicsTitle}</h2>
                        <p className="mt-5 text-lg leading-8 text-white/80">{copy.topicsIntro}</p>
                    </div>
                    <div className="space-y-3">
                        {copy.topics.map((topic, index) => (
                            <div key={topic} className="flex gap-4 rounded-2xl border border-white/15 bg-white/[0.07] p-5 sm:p-6">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{index + 1}</span>
                                <p className="pt-1 text-lg leading-7 text-white/88">{topic}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid overflow-hidden rounded-[2rem] bg-surface shadow-xl shadow-black/10 md:grid-cols-[0.42fr_1fr]">
                    <div className="flex min-h-56 items-center justify-center bg-primary/12 p-8">
                        <UsersRound className="h-24 w-24 text-primary" aria-hidden="true" />
                    </div>
                    <div className="p-6 sm:p-10">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.audienceEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight text-muted-foreground sm:text-4xl">{copy.audienceTitle}</h2>
                        <p className="mt-5 text-lg leading-8 text-muted-foreground/80">{copy.audienceText}</p>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-primary/35 bg-[#0B777A] p-6 shadow-2xl shadow-black/15 sm:p-10 lg:p-12">
                    <div className="max-w-3xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                            <Sparkles className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.futureEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{copy.futureTitle}</h2>
                        <p className="mt-5 text-lg leading-8 text-white/80">{copy.futureText}</p>
                        <Link to="/kontakt" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                            {copy.contact}
                            <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            </div>

            <footer className="flex items-center justify-center gap-2 px-4 pt-2 text-sm text-white/75">
                <Link to="/impressum" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{copy.legal.imprint}</Link>
                <Link to="/datenschutz" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{copy.legal.privacy}</Link>
            </footer>

            <Modal open={registrationOpen} onClose={() => setRegistrationOpen(false)} title={submitState === "success" ? copy.successTitle : copy.registrationTitle} closeLabel={copy.close}>
                {submitState === "success" ? (
                    <div className="py-5 text-center">
                        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" aria-hidden="true" />
                        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-muted-foreground/80">{copy.successText}</p>
                        {newsletterStatus === "pending" && <p className="mx-auto mt-3 max-w-lg rounded-2xl bg-primary/10 p-4 text-sm leading-6 text-muted-foreground">{copy.successNewsletter}</p>}
                        <button type="button" onClick={() => setRegistrationOpen(false)} className="mt-7 min-h-12 rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                            {copy.done}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleRegistration} className="mt-3">
                        <p className="text-sm leading-6 text-muted-foreground/75">{copy.registrationIntro}</p>
                        <div className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                            <label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
                        </div>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <label className="block text-sm font-semibold text-muted-foreground">
                                {copy.name} *
                                <input className={fieldClass} type="text" name="name" autoComplete="name" maxLength={100} placeholder={copy.namePlaceholder} required />
                            </label>
                            <label className="block text-sm font-semibold text-muted-foreground">
                                {copy.email} *
                                <input className={fieldClass} type="email" name="email" autoComplete="email" inputMode="email" maxLength={254} pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$" title={copy.emailFormat} placeholder={copy.emailPlaceholder} required />
                                <span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground/60">{copy.emailFormat}</span>
                            </label>
                        </div>

                        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
                            <input className="mt-1.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="privacy" required />
                            <span>
                                {copy.privacyStart}
                                <Link to="/datenschutz" target="_blank" className="font-semibold text-primary underline decoration-primary/50 underline-offset-2 hover:decoration-primary">{copy.privacyLink}</Link>
                                {copy.privacyEnd}
                            </span>
                        </label>

                        <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/[0.07] p-4">
                            <label className="flex cursor-pointer items-start gap-3 text-sm font-semibold leading-6 text-muted-foreground">
                                <input className="mt-1.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="newsletter" />
                                <span>{copy.newsletter}</span>
                            </label>
                            <p className="ml-7 mt-2 text-xs leading-5 text-muted-foreground/70">{copy.newsletterHint}</p>
                        </div>

                        {errorMessage && <p role="alert" className="mt-5 rounded-2xl border border-red-400/40 bg-red-50 p-4 text-sm leading-6 text-red-800">{errorMessage}</p>}

                        <button type="submit" disabled={submitState === "submitting"} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition hover:bg-surface disabled:cursor-wait disabled:opacity-65 sm:w-auto">
                            {submitState === "submitting" ? copy.submitting : copy.submitRegistration}
                            <Send className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </form>
                )}
            </Modal>
        </main>
    );
};
