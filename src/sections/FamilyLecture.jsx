import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { submitForm } from "@/lib/submissions";
import { LiveAttributionConsent } from "@/components/LiveAttributionConsent";
import { liveAttributionVersion, readLiveSource } from "../../shared/liveAttribution.js";
import { familyLecture } from "../../shared/familyLecture.js";

const field = "mt-2 min-h-12 w-full rounded-xl border border-[#b9cec7] bg-white px-4 py-3 text-[#173c39]";
const button = "inline-flex min-h-12 items-center justify-center rounded-full bg-[#075d60] px-7 py-4 font-bold text-white disabled:opacity-50";

export const FamilyLecture = () => {
    const { search } = useLocation();
    const sourceCode = readLiveSource(search, familyLecture.key);
    const [info, setInfo] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    useEffect(() => {
        const controller = new AbortController();
        fetch(familyLecture.endpoint, { signal: controller.signal, cache: "no-store" })
            .then(r => r.json()).then(r => { if (!r.ok) throw new Error(); setInfo(r.event); })
            .catch(e => { if (e.name !== "AbortError") setError("Die Anmeldung ist gerade nicht erreichbar. Bitte lade die Seite erneut oder schreibe an info@spirit-healing.tr."); });
        return () => controller.abort();
    }, []);
    const register = async event => {
        event.preventDefault();
        if (status === "sending" || !info?.ready) return;
        const data = new FormData(event.currentTarget);
        setStatus("sending"); setError("");
        try {
            await submitForm(`${familyLecture.endpoint}/register`, {
                name: data.get("name"), email: data.get("email"), company: data.get("company"),
                privacyConsent: data.get("privacy") === "on", recordingNoticeAccepted: data.get("recording") === "on",
                newsletterConsent: data.get("newsletter") === "on",
                ...(sourceCode && data.get("measurement") === "on"
                    ? { attribution: { consent: true, version: liveAttributionVersion, sourceCode } } : {}),
            });
            setStatus("success");
        } catch (e) {
            setStatus("idle");
            setError(e.code === "closed" ? "Die Anmeldung ist noch nicht geöffnet oder der Vortrag hat bereits begonnen."
                : e.code === "full" ? "Alle Live-Plätze sind vergeben. Schreibe uns für die Warteliste an info@spirit-healing.tr."
                : e.code === "rate_limit" ? "Bitte warte einige Minuten, bevor du es erneut versuchst."
                : "Die Anmeldung konnte nicht gespeichert werden. Bitte prüfe deine Angaben und versuche es erneut.");
        }
    };
    return <main lang="de" data-no-translate="true" className="min-h-screen bg-[#faf6ed] px-5 py-8 text-[#173c39] sm:py-12">
        <div className="mx-auto max-w-6xl">
            <nav aria-label="Seitennavigation" className="flex flex-wrap items-center justify-between gap-4">
                <Link className="font-serif text-xl" to="/">Spirit Healing</Link>
                <Link className="underline underline-offset-4" to="/aufstellungsarbeit">Zur Aufstellungsarbeit</Link>
            </nav>
            <header className="mt-8 grid overflow-hidden rounded-[2rem] bg-[#075d60] text-white lg:grid-cols-[1.2fr_0.8fr]">
                <div className="px-7 py-10 sm:p-12">
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#edcf96]">Kostenloser Online-Vortrag</p>
                    <h1 className="mt-5 hyphens-auto font-serif text-3xl leading-tight sm:text-5xl">Familienaufstellung kennenlernen.</h1>
                    <p className="mt-5 font-serif text-2xl leading-8">Verantwortung und dein eigener Platz.</p>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">Manche Aufgaben beginnen früh und wirken später wie ein Teil der eigenen Persönlichkeit. In der Familienaufstellung schauen wir auf den Platz, an dem eine solche Rolle entstanden ist.</p>
                    <p className="mt-7 font-semibold leading-8">27. Oktober 2026 · 20 Uhr deutscher Zeit<br/>Mit Sabine & Selcan · live über Zoom · auf Deutsch</p>
                    <a href="#anmeldung" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#edcf96] px-7 py-4 font-bold text-[#173c39]">Kostenlos anmelden</a>
                </div>
                <img src="/ueberuns.jpeg" alt="Sabine Schmidt und Selcan Yilmaz" className="h-72 w-full object-cover object-center sm:h-96 lg:h-full"/>
            </header>
            <div className="mt-9 grid items-start gap-8 lg:grid-cols-2">
                <section className="px-2 py-4 sm:p-7">
                    <h2 className="font-serif text-3xl">Lerne uns und unsere Arbeit kennen.</h2>
                    <p className="mt-5 leading-8">Ein Kind kann innerhalb seiner Familie sehr früh eine Aufgabe übernehmen. Es vermittelt zwischen den Eltern, wird zum Vertrauten, trägt Verantwortung für Geschwister oder versucht, die Stimmung im ganzen Raum zu halten.</p>
                    <p className="mt-4 leading-8">Diese Rolle kann damals geholfen haben, Verbindung und Sicherheit zu bewahren. Im Erwachsenenleben kann sie als übermäßige Verantwortung, Schuld beim Setzen einer Grenze oder das Gefühl weiterwirken, für das Wohlergehen anderer zuständig zu sein.</p>
                    <p className="mt-4 leading-8">In unserem Vortrag schauen wir auf familiäre Rollen, Verantwortung und den eigenen Platz. Du lernst kennen, wie wir eine Aufstellung gemeinsam begleiten und was es bedeutet, als Stellvertreterin oder Stellvertreter mitzuwirken.</p>
                    <section className="mt-8 border-t border-[#d7ddd0] pt-7">
                        <h2 className="font-serif text-2xl">Vom Kennenlernen zur Aufstellungsarbeit in Berlin.</h2>
                        <p className="mt-4 leading-8">Der Vortrag findet online statt. Unsere Aufstellungstage finden in Berlin-Kreuzberg statt: am 12. und 13. Dezember 2026 sowie am 30. und 31. Januar 2027. Jeder Tag ist einzeln buchbar, als Stellvertretung oder mit eigener Aufstellung.</p>
                        <Link to="/berlin-live" className="mt-4 inline-block font-semibold underline underline-offset-4">Berliner Termine ansehen</Link>
                    </section>
                    <p className="mt-7 text-sm leading-7">Du brauchst keine Vorkenntnisse. Der Vortrag ist kostenlos; eine Buchung für einen Aufstellungstag ist dafür nicht nötig.</p>
                </section>
                <section id="anmeldung" className="scroll-mt-6 rounded-[2rem] bg-white p-7 sm:p-9" aria-label="Anmeldung zum Familienaufstellungsvortrag">
                    {status === "success" ? <div role="status" tabIndex={-1}>
                        <h2 className="font-serif text-3xl">Schau in dein E-Mail-Postfach.</h2>
                        <p className="mt-5 leading-8">Für eine neue Anmeldung senden wir dir in wenigen Minuten die Bestätigung mit deinem Zoom-Zugang und einem Kalendereintrag. Bitte prüfe auch den Spam-Ordner.</p>
                        <p className="mt-4 leading-7">Du bist bereits angemeldet? Dein bisheriger Zugang zum 27. Oktober bleibt gültig. Eine erneute Anmeldung verschickt keine doppelte E-Mail. Bei Fragen schreibe an info@spirit-healing.tr.</p>
                        <p className="mt-5 font-semibold">{familyLecture.label}</p>
                    </div> : <form onSubmit={register}>
                        <h2 className="font-serif text-3xl">Sei live dabei.</h2>
                        <p className="mt-4 leading-7">Nach der Anmeldung erhältst du deinen Zoom-Zugang per E-Mail. Wir erinnern dich am Vortag und eine Stunde vor Beginn. Bei kurzfristiger Anmeldung erhältst du nur die noch ausstehenden Erinnerungen.</p>
                        <label className="mt-6 block font-semibold" htmlFor="family-name">Dein Vorname</label>
                        <input id="family-name" name="name" className={field} autoComplete="given-name" required maxLength={100}/>
                        <label className="mt-5 block font-semibold" htmlFor="family-email">Deine E-Mail-Adresse</label>
                        <input id="family-email" name="email" type="email" className={field} autoComplete="email" required maxLength={254}/>
                        <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="family-company">Firma</label><input id="family-company" name="company" tabIndex={-1} autoComplete="off"/></div>
                        <label className="mt-6 flex gap-3 text-sm leading-6"><input type="checkbox" name="privacy" required className="mt-1 h-4 w-4 shrink-0"/><span>Ich stimme der Verarbeitung meiner Angaben für die Anmeldung, den Zoom-Zugang und die Terminerinnerungen zu. <Link className="underline" to="/datenschutz">Datenschutz</Link>. Über den Link in meiner E-Mail kann ich absagen.</span></label>
                        <div className="mt-5 rounded-xl bg-[#faf6ed] p-4 text-sm leading-6"><p className="font-semibold">Hinweis zur Aufzeichnung</p><p className="mt-2">{familyLecture.recordingNotice}</p><label className="mt-3 flex gap-3"><input type="checkbox" name="recording" required className="mt-1 h-4 w-4 shrink-0"/><span>Ich habe den Hinweis zur Aufzeichnung gelesen.</span></label></div>
                        <label className="mt-4 flex gap-3 text-sm leading-6"><input type="checkbox" name="newsletter" className="mt-1 h-4 w-4 shrink-0"/><span>Ich möchte weitere Impulse von Spirit Healing per E-Mail erhalten. Freiwillig, mit separater E-Mail-Bestätigung und jederzeit abbestellbar.</span></label>
                        <LiveAttributionConsent key={sourceCode || "none"} sourceCode={sourceCode} deletionLabel={familyLecture.deletionLabel}/>
                        {info && !info.ready && <p role="status" className="mt-5 rounded-xl bg-[#faf6ed] p-4 leading-7">Die Anmeldung ist noch nicht geöffnet oder der Vortrag hat bereits begonnen. Bei Fragen schreibe an info@spirit-healing.tr.</p>}
                        {error && <p role="alert" className="mt-5 text-red-800">{error}</p>}
                        <button disabled={!info?.ready || status === "sending"} className={`${button} mt-7 w-full`}>{status === "sending" ? "Anmeldung wird gespeichert …" : "Kostenlos anmelden"}</button>
                        <p className="mt-4 text-xs leading-6">Keine Newsletter-Pflicht. Die Anmeldung zum Vortrag am 20. Oktober gilt nicht automatisch für diesen Termin.</p>
                    </form>}
                </section>
            </div>
            <footer className="mt-10 flex flex-wrap gap-6 py-6 text-sm"><Link to="/impressum">Impressum</Link><Link to="/datenschutz">Datenschutz</Link><a href="mailto:info@spirit-healing.tr">Kontakt</a></footer>
        </div>
    </main>;
};
