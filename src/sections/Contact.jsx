import { useState } from "react";
import { CheckCircle2, Facebook, HeartHandshake, Instagram, Languages, Mail, MessageCircleMore, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/Modal";
import { useLanguage } from "@/i18n/LanguageContext";
import { submitForm } from "@/lib/submissions";

const MESSAGE_LIMIT = 2000;

const content = {
    de: {
        eyebrow: "Kontakt",
        title: "Lass uns ins Gespräch kommen",
        intro: "Manchmal beginnt Veränderung damit, das eigene Thema zum ersten Mal in Worte zu fassen. Schreib uns, was dich gerade bewegt – wir hören zu und melden uns persönlich bei dir.",
        direct: "Direkter Kontakt",
        directText: "Wenn du lieber direkt Kontakt aufnehmen möchtest, erreichst du uns per E-Mail oder telefonisch.",
        language: "Online-Begleitung auf Deutsch und Türkisch",
        formCardEyebrow: "Deine Nachricht an uns",
        formCardTitle: "Dein erster Schritt darf leicht sein",
        formCardText: "Du musst dein Anliegen noch nicht fertig sortiert haben. Ein paar Sätze darüber, was dich beschäftigt und was du dir wünschst, genügen für den Anfang.",
        openForm: "Ersten Schritt gehen",
        formTitle: "Erzähl uns, was dich gerade bewegt",
        formIntro: "Schreib so viel oder so wenig, wie sich für dich gerade stimmig anfühlt. Pflichtfelder sind mit * markiert.",
        name: "Vor- und Nachname",
        namePlaceholder: "Wie dürfen wir dich ansprechen?",
        email: "E-Mail-Adresse",
        emailPlaceholder: "deine@email.de",
        emailFormat: "Bitte gib eine vollständige E-Mail-Adresse mit @ und Domain ein, zum Beispiel name@email.de.",
        phone: "Telefonnummer (optional)",
        phonePlaceholder: "+49 …",
        topic: "Worum geht es?",
        topics: ["Kostenfreies Kennenlerngespräch", "Traumasensible Prozessbegleitung", "Integrative Therapie", "Intensivprozess", "Eine andere Frage"],
        message: "Deine Nachricht",
        messagePlaceholder: "Was beschäftigt dich gerade? Was wünschst du dir von einer Begleitung?",
        characters: "Zeichen",
        privacyStart: "Ich habe die ",
        privacyLink: "Datenschutzerklärung",
        privacyEnd: " gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert und verwendet werden.",
        newsletter: "Ja, ich möchte per E-Mail über neue Vorträge, Seminare und Termine von Spirit Healing informiert werden.",
        newsletterHint: "Freiwillig und unabhängig von deiner Anfrage. Zur Bestätigung erhältst du eine separate E-Mail; eine Abmeldung ist jederzeit möglich.",
        submit: "Anfrage senden",
        submitting: "Nachricht wird gesendet …",
        close: "Fenster schließen",
        successTitle: "Deine Nachricht ist angekommen",
        successText: "Vielen Dank. Wir melden uns persönlich bei dir zurück.",
        successNewsletter: "Bitte bestätige die Newsletter-Anmeldung noch über den Link in der separaten E-Mail.",
        successClose: "Fertig",
        error: "Die Nachricht konnte gerade nicht übermittelt werden. Bitte versuche es noch einmal oder schreibe an info@spirit-healing.tr.",
        rateError: "Es wurden zu viele Nachrichten in kurzer Zeit gesendet. Bitte versuche es in einigen Minuten erneut.",
        homeLabel: "Spirit Healing Startseite",
    },
    tr: {
        eyebrow: "İletişim",
        title: "Tanışalım",
        intro: "Bazen değişim, yaşadığın şeyi ilk kez kendi cümlelerinle anlatmakla başlar. Şu anda seni nelerin etkilediğini bize yaz; seni dinleyip kişisel olarak geri döneceğiz.",
        direct: "Doğrudan iletişim",
        directText: "Doğrudan iletişimi tercih edersen bize e-posta veya telefon yoluyla ulaşabilirsin.",
        language: "Türkçe ve Almanca çevrim içi danışmanlık",
        formCardEyebrow: "Bize mesajın",
        formCardTitle: "İlk adımın hafif olabilir",
        formCardText: "Anlatmak istediklerini önceden bütünüyle toparlamış olman gerekmez. Seni neyin etkilediğini ve nasıl bir destek istediğini birkaç cümleyle paylaşman başlangıç için yeterli.",
        openForm: "İlk adımı at",
        formTitle: "Şu anda seni nelerin etkilediğini anlat",
        formIntro: "Şu an sana ne kadarı doğru geliyorsa o kadarını yazabilirsin. Zorunlu alanlar * ile işaretlidir.",
        name: "Ad ve soyad",
        namePlaceholder: "Sana nasıl hitap edelim?",
        email: "E-posta adresi",
        emailPlaceholder: "adiniz@email.com",
        emailFormat: "Lütfen @ işareti ve alan adı içeren tam bir e-posta adresi gir, örneğin ad@email.com.",
        phone: "Telefon numarası (isteğe bağlı)",
        phonePlaceholder: "+90 …",
        topic: "Hangi konuda yazıyorsun?",
        topics: ["Ücretsiz tanışma görüşmesi", "Travma bilgili süreç danışmanlığı", "Bütüncül terapi", "Yoğunlaştırılmış süreç", "Başka bir konu"],
        message: "Mesajın",
        messagePlaceholder: "Şu anda seni ne etkiliyor? Nasıl bir destek istiyorsun?",
        characters: "karakter",
        privacyStart: "",
        privacyLink: "Gizlilik bildirimini",
        privacyEnd: " okudum; bilgilerimin talebimin işlenmesi amacıyla kaydedilmesini ve kullanılmasını kabul ediyorum.",
        newsletter: "Evet, Spirit Healing'in yeni seminerleri, eğitimleri ve tarihleri hakkında e-posta almak istiyorum.",
        newsletterHint: "İsteğe bağlıdır ve talebinden bağımsızdır. Ayrı bir e-postadaki bağlantıya tıklayarak aboneliğini onaylarsın; dilediğin zaman iptal edebilirsin.",
        submit: "Mesajı gönder",
        submitting: "Mesaj gönderiliyor …",
        close: "Pencereyi kapat",
        successTitle: "Mesajın bize ulaştı",
        successText: "Teşekkür ederiz. Sana kişisel olarak geri dönüş yapacağız.",
        successNewsletter: "Lütfen bülten aboneliğini ayrı e-postadaki bağlantı üzerinden onayla.",
        successClose: "Tamam",
        error: "Mesaj şu anda iletilemedi. Lütfen yeniden dene veya info@spirit-healing.tr adresine yaz.",
        rateError: "Kısa süre içinde çok fazla mesaj gönderildi. Lütfen birkaç dakika sonra yeniden dene.",
        homeLabel: "Spirit Healing ana sayfası",
    },
};

const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-primary/35 bg-white/90 px-4 py-3 text-base text-muted-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/25";

export const Contact = () => {
    const { language } = useLanguage();
    const copy = content[language];
    const [modalOpen, setModalOpen] = useState(false);
    const [submitState, setSubmitState] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState("not_requested");
    const [messageLength, setMessageLength] = useState(0);

    const openForm = () => {
        setSubmitState("idle");
        setErrorMessage("");
        setNewsletterStatus("not_requested");
        setMessageLength(0);
        setModalOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setErrorMessage("");
        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const result = await submitForm("/api/contact", {
                name: formData.get("name"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                topic: formData.get("topic"),
                message: formData.get("message"),
                privacyConsent: formData.get("privacy") === "on",
                newsletterConsent: formData.get("newsletter") === "on",
                company: formData.get("company"),
                locale: language,
            });
            setNewsletterStatus(result.newsletterStatus);
            setSubmitState("success");
            form.reset();
            setMessageLength(0);
        } catch (error) {
            setErrorMessage(error.code === "rate_limit" ? copy.rateError : copy.error);
            setSubmitState("error");
        }
    };

    return (
        <main data-no-translate className="min-h-screen bg-card pb-20 pt-28 text-white sm:pt-32">
            <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <header className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
                    <Link to="/" aria-label={copy.homeLabel} className="inline-flex w-fit">
                        <img src="/Logo-tuerkis.jpeg" alt="Spirit Healing Logo" className="h-24 w-24 rounded-full object-cover shadow-xl shadow-black/15 ring-2 ring-primary sm:h-28 sm:w-28" />
                    </Link>
                    <div>
                            <p className="font-semibold uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
                            <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">{copy.title}</h1>
                        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/88">{copy.intro}</p>
                    </div>
                </header>

                <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
                    <article className="glass rounded-[2rem] p-6 sm:p-8">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                <MessageCircleMore className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <h2 className="mt-5 text-2xl font-bold text-muted-foreground">{copy.direct}</h2>
                            <p className="mt-2 text-muted-foreground/85">{copy.directText}</p>
                            <div className="mt-5 space-y-3">
                                <a href="mailto:info@spirit-healing.tr" className="flex min-h-12 items-center gap-3 rounded-2xl bg-white/65 px-4 py-3 text-muted-foreground transition hover:bg-white">
                                    <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="break-all">info@spirit-healing.tr</span>
                                </a>
                                <a href="tel:+491775022131" className="flex min-h-12 items-center gap-3 rounded-2xl bg-white/65 px-4 py-3 text-muted-foreground transition hover:bg-white">
                                    <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                    <span>+49 177 5022131</span>
                                </a>
                            </div>
                            <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground/80">
                                <Languages className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                                {copy.language}
                            </p>
                            <div className="mt-5 flex gap-3">
                                <a href="https://www.instagram.com/spirit4healing/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
                                    <Instagram className="h-5 w-5" aria-hidden="true" />
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61588723230682" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
                                    <Facebook className="h-5 w-5" aria-hidden="true" />
                                </a>
                            </div>
                    </article>

                    <article className="relative flex min-h-full flex-col overflow-hidden rounded-[2rem] border border-primary/40 bg-[#f7f1e7] p-6 text-muted-foreground shadow-2xl shadow-black/15 sm:p-8">
                        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
                        <div className="relative flex flex-1 flex-col">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                <HeartHandshake className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-primary">{copy.formCardEyebrow}</p>
                            <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{copy.formCardTitle}</h2>
                            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground/80">{copy.formCardText}</p>
                            <button type="button" onClick={openForm} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-fit">
                                {copy.openForm}
                                <Send className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </article>
                </div>
            </section>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={submitState === "success" ? copy.successTitle : copy.formTitle} closeLabel={copy.close}>
                {submitState === "success" ? (
                    <div className="py-5 text-center">
                        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" aria-hidden="true" />
                        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-muted-foreground/80">{copy.successText}</p>
                        {newsletterStatus === "pending" && <p className="mx-auto mt-3 max-w-lg rounded-2xl bg-primary/10 p-4 text-sm leading-6 text-muted-foreground">{copy.successNewsletter}</p>}
                        <button type="button" onClick={() => setModalOpen(false)} className="mt-7 min-h-12 rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                            {copy.successClose}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-3">
                        <p className="text-sm text-muted-foreground/75">{copy.formIntro}</p>
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
                            <label className="block text-sm font-semibold text-muted-foreground">
                                {copy.phone}
                                <input className={fieldClass} type="tel" name="phone" autoComplete="tel" maxLength={40} placeholder={copy.phonePlaceholder} />
                            </label>
                            <label className="block text-sm font-semibold text-muted-foreground">
                                {copy.topic} *
                                <select className={fieldClass} name="topic" defaultValue={copy.topics[0]} required>
                                    {copy.topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                                </select>
                            </label>
                        </div>

                        <label className="mt-5 block text-sm font-semibold text-muted-foreground">
                            <span className="flex items-center justify-between gap-3">
                                <span>{copy.message} *</span>
                                <span className="font-normal text-muted-foreground/60">{messageLength}/{MESSAGE_LIMIT} {copy.characters}</span>
                            </span>
                            <textarea
                                className={`${fieldClass} min-h-32 resize-y`}
                                name="message"
                                maxLength={MESSAGE_LIMIT}
                                onChange={(event) => setMessageLength(event.target.value.length)}
                                placeholder={copy.messagePlaceholder}
                                required
                            />
                        </label>

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
                            {submitState === "submitting" ? copy.submitting : copy.submit}
                            <Send className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </form>
                )}
            </Modal>
        </main>
    );
};
