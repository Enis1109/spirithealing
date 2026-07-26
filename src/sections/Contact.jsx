import { Facebook, Instagram, Mail, Phone, Send, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const content = {
    de: {
        eyebrow: "Kontakt",
        title: "Lass uns ins Gespräch kommen",
        intro: "Erzähl uns in Ruhe, was dich gerade bewegt und welche Form der Begleitung du suchst. Wir melden uns persönlich bei dir zurück.",
        direct: "Direkter Kontakt",
        directText: "Du kannst uns auch direkt per E-Mail oder telefonisch erreichen.",
        language: "Online-Begleitung auf Deutsch und Türkisch",
        formTitle: "Deine Anfrage",
        formIntro: "Die mit * gekennzeichneten Felder sind erforderlich.",
        name: "Vor- und Nachname",
        namePlaceholder: "Wie dürfen wir dich ansprechen?",
        email: "E-Mail-Adresse",
        emailPlaceholder: "deine@email.de",
        phone: "Telefonnummer (optional)",
        phonePlaceholder: "+49 …",
        topic: "Worum geht es?",
        topics: ["Kostenfreies Kennenlerngespräch", "Traumasensible Prozessbegleitung", "Integrative Therapie", "Intensivprozess", "Eine andere Frage"],
        message: "Deine Nachricht",
        messagePlaceholder: "Was möchtest du uns mitteilen?",
        privacyStart: "Ich habe die ",
        privacyLink: "Datenschutzerklärung",
        privacyEnd: " gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.",
        submit: "E-Mail vorbereiten",
        note: "Beim Absenden öffnet sich dein E-Mail-Programm. Erst wenn du die vorbereitete Nachricht dort sendest, werden deine Angaben übermittelt.",
        subject: "Kontaktanfrage über spirit-healing.tr",
        mailLabels: { name: "Name", email: "E-Mail", phone: "Telefon", topic: "Anliegen", message: "Nachricht" },
        homeLabel: "Spirit Healing Startseite",
    },
    tr: {
        eyebrow: "İletişim",
        title: "Tanışalım",
        intro: "Şu anda seni nelerin etkilediğini ve nasıl bir destek aradığını bize kendi cümlelerinle anlatabilirsin. Sana kişisel olarak geri dönüş yapacağız.",
        direct: "Doğrudan iletişim",
        directText: "Bize doğrudan e-posta veya telefon yoluyla da ulaşabilirsin.",
        language: "Türkçe ve Almanca çevrim içi danışmanlık",
        formTitle: "Bize yaz",
        formIntro: "* ile işaretlenen alanların doldurulması zorunludur.",
        name: "Ad ve soyad",
        namePlaceholder: "Sana nasıl hitap edelim?",
        email: "E-posta adresi",
        emailPlaceholder: "adiniz@email.com",
        phone: "Telefon numarası (isteğe bağlı)",
        phonePlaceholder: "+90 …",
        topic: "Hangi konuda yazıyorsun?",
        topics: ["Ücretsiz tanışma görüşmesi", "Travma bilgili süreç danışmanlığı", "Bütüncül terapi", "Yoğunlaştırılmış süreç", "Başka bir konu"],
        message: "Mesajın",
        messagePlaceholder: "Bizimle ne paylaşmak istersin?",
        privacyStart: "",
        privacyLink: "Gizlilik bildirimini",
        privacyEnd: " okudum ve bilgilerimin talebimin işlenmesi amacıyla kullanılmasını kabul ediyorum.",
        submit: "E-postayı hazırla",
        note: "Gönder düğmesine bastığında e-posta programın açılır. Bilgilerin ancak hazırlanan mesajı oradan gönderdiğinde iletilir.",
        subject: "spirit-healing.tr üzerinden iletişim talebi",
        mailLabels: { name: "Ad soyad", email: "E-posta", phone: "Telefon", topic: "Konu", message: "Mesaj" },
        homeLabel: "Spirit Healing ana sayfası",
    },
};

const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-primary/35 bg-white/90 px-4 py-3 text-base text-muted-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/25";

export const Contact = () => {
    const { language } = useLanguage();
    const copy = content[language];

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const lines = [
            `${copy.mailLabels.name}: ${formData.get("name")}`,
            `${copy.mailLabels.email}: ${formData.get("email")}`,
            `${copy.mailLabels.phone}: ${formData.get("phone") || "–"}`,
            `${copy.mailLabels.topic}: ${formData.get("topic")}`,
            "",
            `${copy.mailLabels.message}:`,
            formData.get("message"),
        ];

        const subject = `${copy.subject}: ${formData.get("topic")}`;
        window.location.href = `mailto:info@spirit-healing.tr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    };

    return (
        <main className="min-h-screen bg-card pb-20 pt-28 sm:pt-32">
            <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
                    <div className="space-y-6 lg:sticky lg:top-28">
                        <Link to="/" aria-label={copy.homeLabel} className="inline-flex">
                            <img
                                src="/Logo-tuerkis.jpeg"
                                alt="Spirit Healing Logo"
                                className="h-24 w-24 rounded-full object-cover shadow-xl shadow-black/15 ring-2 ring-primary sm:h-28 sm:w-28"
                            />
                        </Link>
                        <div>
                            <p className="font-semibold uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
                            <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">{copy.title}</h1>
                            <p className="mt-5 max-w-xl text-lg leading-8 text-white/90">{copy.intro}</p>
                        </div>

                        <div className="glass rounded-3xl p-5 sm:p-6">
                            <h2 className="text-2xl font-bold text-muted-foreground">{copy.direct}</h2>
                            <p className="mt-2 text-muted-foreground/85">{copy.directText}</p>
                            <div className="mt-5 space-y-3">
                                <a href="mailto:info@spirit-healing.tr" className="flex min-h-12 items-center gap-3 rounded-2xl bg-white/65 px-4 py-3 text-muted-foreground transition hover:bg-white">
                                    <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden="true"/>
                                    <span className="break-all">info@spirit-healing.tr</span>
                                </a>
                                <a href="tel:+491775022131" className="flex min-h-12 items-center gap-3 rounded-2xl bg-white/65 px-4 py-3 text-muted-foreground transition hover:bg-white">
                                    <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true"/>
                                    <span>+49 177 5022131</span>
                                </a>
                            </div>
                            <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground/80">
                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true"/>
                                {copy.language}
                            </p>
                            <div className="mt-5 flex gap-3">
                                <a href="https://www.instagram.com/spirit4healing/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
                                    <Instagram className="h-5 w-5" aria-hidden="true"/>
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61588723230682" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
                                    <Facebook className="h-5 w-5" aria-hidden="true"/>
                                </a>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-5 shadow-2xl shadow-black/15 sm:p-8" aria-labelledby="contact-form-title">
                        <div>
                            <h2 id="contact-form-title" className="text-3xl font-bold text-muted-foreground">{copy.formTitle}</h2>
                            <p className="mt-2 text-sm text-muted-foreground/75">{copy.formIntro}</p>
                        </div>

                        <div className="mt-7 grid gap-5 sm:grid-cols-2">
                            <label className="block text-sm font-semibold text-muted-foreground">
                                {copy.name} *
                                <input className={fieldClass} type="text" name="name" autoComplete="name" placeholder={copy.namePlaceholder} required/>
                            </label>
                            <label className="block text-sm font-semibold text-muted-foreground">
                                {copy.email} *
                                <input className={fieldClass} type="email" name="email" autoComplete="email" placeholder={copy.emailPlaceholder} required/>
                            </label>
                            <label className="block text-sm font-semibold text-muted-foreground">
                                {copy.phone}
                                <input className={fieldClass} type="tel" name="phone" autoComplete="tel" placeholder={copy.phonePlaceholder}/>
                            </label>
                            <label className="block text-sm font-semibold text-muted-foreground">
                                {copy.topic} *
                                <select className={fieldClass} name="topic" defaultValue={copy.topics[0]} required>
                                    {copy.topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                                </select>
                            </label>
                        </div>

                        <label className="mt-5 block text-sm font-semibold text-muted-foreground">
                            {copy.message} *
                            <textarea className={`${fieldClass} min-h-40 resize-y`} name="message" placeholder={copy.messagePlaceholder} required/>
                        </label>

                        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
                            <input className="mt-1.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="privacy" required/>
                            <span>
                                {copy.privacyStart}
                                <Link to="/datenschutz" className="font-semibold text-primary underline decoration-primary/50 underline-offset-2 hover:decoration-primary">{copy.privacyLink}</Link>
                                {copy.privacyEnd}
                            </span>
                        </label>

                        <button type="submit" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto">
                            {copy.submit}
                            <Send className="h-5 w-5" aria-hidden="true"/>
                        </button>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground/75">{copy.note}</p>
                    </form>
                </div>
            </section>
        </main>
    );
};
