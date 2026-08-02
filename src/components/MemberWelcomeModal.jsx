import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, CheckCircle2, Headphones, LoaderCircle, LockKeyhole, PlayCircle, X } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { submitForm } from "@/lib/submissions";
import { readAttribution, trackFunnelEvent } from "@/lib/funnelTracking";

const fieldClass = "mt-1.5 min-h-11 w-full rounded-xl border border-[#55aeb0]/45 bg-white px-4 py-2.5 text-base text-[#143f40] outline-none transition placeholder:text-[#5c7777]/55 focus:border-[#168e91] focus:ring-2 focus:ring-[#55aeb0]/25";

const modalCopy = {
    de: {
        eyebrow: "Kostenlos für dich",
        title: "Deine Spirit-Healing-Mediathek",
        intro: "Nimm dir mit, was dich gerade stärkt: zwei Meditationen, unser vollständiger Vortrag und das begleitende Workbook.",
        recording: "Vortrag ansehen",
        workbook: "Workbook herunterladen",
        meditations: "2 Meditationen hören",
        name: "Dein Name",
        namePlaceholder: "Wie dürfen wir dich ansprechen?",
        email: "E-Mail-Adresse",
        password: "Passwort wählen",
        passwordHint: "Mindestens 10 Zeichen",
        privacyStart: "Ich habe die ",
        privacyLink: "Datenschutzerklärung",
        privacyEnd: " gelesen und stimme der Speicherung meiner Angaben für den Mitgliederzugang zu.",
        newsletter: "Ich möchte Einladungen zu neuen Vorträgen, Seminaren und Meditationen erhalten.",
        submit: "Kostenlos registrieren",
        submitting: "Wird eingerichtet …",
        login: "Ich habe bereits ein Konto",
        directLink: "Dein bisheriger Direktlink funktioniert weiterhin.",
        close: "Fenster schließen",
        successTitle: "Fast geschafft",
        successText: "Wir haben dir eine E-Mail geschickt. Mit einem Klick bestätigst du deinen Zugang und kannst direkt starten.",
        successButton: "Zum Mitgliederbereich",
        error: "Die Registrierung konnte gerade nicht abgeschlossen werden. Bitte versuche es erneut oder schreibe an info@spirit-healing.tr.",
        rateError: "Bitte warte einige Minuten und versuche es dann erneut.",
    },
    tr: {
        eyebrow: "Senin için ücretsiz",
        title: "Spirit Healing içerik alanın",
        intro: "Şu anda sana iyi gelecek içerikleri keşfet: iki meditasyon, seminer kaydının tamamı ve eşlik eden çalışma kitabı.",
        recording: "Semineri izle",
        workbook: "Çalışma kitabını indir",
        meditations: "2 meditasyonu dinle",
        name: "Adın",
        namePlaceholder: "Sana nasıl hitap edelim?",
        email: "E-posta adresi",
        password: "Şifre belirle",
        passwordHint: "En az 10 karakter",
        privacyStart: "",
        privacyLink: "Gizlilik bildirimini",
        privacyEnd: " okudum ve bilgilerimin üye erişimi için saklanmasını kabul ediyorum.",
        newsletter: "Yeni seminer, eğitim ve meditasyonlardan haberdar olmak istiyorum.",
        submit: "Ücretsiz kayıt ol",
        submitting: "Hazırlanıyor …",
        login: "Zaten bir hesabım var",
        directLink: "Mevcut kişisel erişim bağlantın çalışmaya devam eder.",
        close: "Pencereyi kapat",
        successTitle: "Son bir adım kaldı",
        successText: "Sana bir e-posta gönderdik. Bağlantıya tıkladığında erişimini onaylayıp hemen başlayabilirsin.",
        successButton: "Üye alanına git",
        error: "Kayıt şu anda tamamlanamadı. Lütfen yeniden dene veya info@spirit-healing.tr adresine yaz.",
        rateError: "Lütfen birkaç dakika bekleyip yeniden dene.",
    },
};

export const MemberWelcomeModal = ({ language, open, onClose }) => {
    const copy = modalCopy[language] || modalCopy.de;
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const attribution = useMemo(
        () => readAttribution({ searchParams, pathname: location.pathname }),
        [location.pathname, searchParams],
    );
    const closeButtonRef = useRef(null);
    const registrationStarted = useRef(false);
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!open) return undefined;

        trackFunnelEvent({
            eventName: "landing_view",
            eventKey: "homepage_modal",
            attribution,
            locale: language,
        });

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [attribution, language, onClose, open]);

    if (!open) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus("submitting");
        setErrorMessage("");
        const form = event.currentTarget;
        const formData = new FormData(form);
        await trackFunnelEvent({ eventName: "registration_submit", eventKey: "homepage_modal", attribution, locale: language });

        try {
            await submitForm("/api/members/register", {
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password"),
                privacyConsent: formData.get("privacy") === "on",
                newsletterConsent: formData.get("newsletter") === "on",
                company: formData.get("company"),
                locale: language,
                attribution,
            });
            setStatus("sent");
            form.reset();
        } catch (error) {
            setErrorMessage(error.code === "rate_limit" ? copy.rateError : copy.error);
            setStatus("error");
        }
    };

    const markRegistrationStart = () => {
        if (registrationStarted.current) return;
        registrationStarted.current = true;
        trackFunnelEvent({ eventName: "registration_start", eventKey: "homepage_modal", attribution, locale: language });
    };

    const goToLogin = () => {
        onClose();
        navigate("/mitglieder?mode=login");
    };

    return (
        <div
            className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto bg-[#063f41]/55 p-2 backdrop-blur-[3px] sm:items-center sm:p-5"
            role="presentation"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <section
                aria-labelledby="member-modal-title"
                aria-modal="true"
                role="dialog"
                className="relative my-2 max-h-[calc(100dvh-1rem)] w-full max-w-4xl overflow-y-auto rounded-[1.75rem] border border-white/80 bg-[#fffaf2] text-[#143f40] shadow-[0_28px_90px_rgba(3,63,65,.34)] sm:my-5 sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-[2.25rem]"
            >
                <button ref={closeButtonRef} type="button" onClick={onClose} aria-label={copy.close} className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#176f72] shadow-md transition hover:bg-[#e3f5f2] sm:right-5 sm:top-5">
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative overflow-hidden bg-[linear-gradient(145deg,#dff4ef_0%,#f7edcf_100%)] p-6 pb-7 sm:p-9 lg:p-10">
                        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#57b9b8]/20 blur-2xl" aria-hidden="true" />
                        <div className="relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#168e91] text-white shadow-lg shadow-[#168e91]/20"><LockKeyhole className="h-6 w-6" aria-hidden="true" /></div>
                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#a27b08]">{copy.eyebrow}</p>
                            <h2 id="member-modal-title" className="mt-2 max-w-md text-3xl font-bold leading-tight sm:text-4xl">{copy.title}</h2>
                            <p className="mt-4 max-w-lg leading-7 text-[#416566]">{copy.intro}</p>
                            <div className="mt-6 grid gap-3 text-sm font-semibold text-[#31595a]">
                                <span className="flex items-center gap-3"><PlayCircle className="h-5 w-5 text-[#168e91]" />{copy.recording}</span>
                                <span className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-[#168e91]" />{copy.workbook}</span>
                                <span className="flex items-center gap-3"><Headphones className="h-5 w-5 text-[#168e91]" />{copy.meditations}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-7 sm:p-9 lg:p-10">
                        {status === "sent" ? (
                            <div className="flex min-h-80 flex-col items-center justify-center text-center">
                                <CheckCircle2 className="h-16 w-16 text-[#168e91]" aria-hidden="true" />
                                <h3 className="mt-5 text-3xl font-bold">{copy.successTitle}</h3>
                                <p className="mt-3 max-w-md leading-7 text-[#557172]">{copy.successText}</p>
                                <button type="button" onClick={goToLogin} className="mt-7 rounded-full bg-[#d4af37] px-6 py-3 font-bold text-[#074f52] transition hover:bg-[#e3c75f]">{copy.successButton}</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} onFocusCapture={markRegistrationStart}>
                                <div className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label></div>
                                <label className="block text-sm font-semibold">{copy.name} *<input className={fieldClass} name="name" type="text" autoComplete="name" maxLength={100} placeholder={copy.namePlaceholder} required /></label>
                                <label className="mt-4 block text-sm font-semibold">{copy.email} *<input className={fieldClass} name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} placeholder="name@email.de" required /></label>
                                <label className="mt-4 block text-sm font-semibold">{copy.password} *<input className={fieldClass} name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /><span className="mt-1 block text-xs font-normal text-[#6a8182]">{copy.passwordHint}</span></label>
                                <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-5"><input className="mt-1 h-4 w-4 shrink-0 accent-[#168e91]" type="checkbox" name="privacy" required /><span>{copy.privacyStart}<Link to="/datenschutz" target="_blank" className="font-semibold text-[#08777a] underline underline-offset-2">{copy.privacyLink}</Link>{copy.privacyEnd}</span></label>
                                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-[#e7f5f2] p-3.5 text-sm leading-5"><input className="mt-1 h-4 w-4 shrink-0 accent-[#168e91]" type="checkbox" name="newsletter" /><span>{copy.newsletter}</span></label>
                                {errorMessage && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-5 text-red-800">{errorMessage}</p>}
                                <button type="submit" disabled={status === "submitting"} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 font-bold text-[#074f52] transition hover:bg-[#e3c75f] disabled:cursor-wait disabled:opacity-65">
                                    {status === "submitting" && <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />}{status === "submitting" ? copy.submitting : copy.submit}
                                </button>
                                <button type="button" onClick={goToLogin} className="mt-4 w-full text-center text-sm font-bold text-[#08777a] underline underline-offset-4">{copy.login}</button>
                                <p className="mt-2 text-center text-xs text-[#6a8182]">{copy.directLink}</p>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
