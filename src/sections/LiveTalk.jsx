import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { submitForm } from "@/lib/submissions";

const button = "inline-flex min-h-12 items-center justify-center rounded-full bg-[#d4af37] px-7 py-3 font-bold text-[#034f52] disabled:opacity-50";
const field = "mt-2 min-h-12 w-full rounded-xl border border-[#b9cec7] bg-white px-4 py-3 text-[#173c39]";
const Footer = () => <footer className="mt-10 flex flex-wrap justify-center gap-6 text-sm"><Link to="/impressum">Impressum</Link><Link to="/datenschutz">Datenschutz</Link><a href="mailto:info@spirit-healing.tr">Kontakt</a></footer>;
const Shell = ({ children }) => <main data-no-translate="true" className="min-h-screen bg-[#edf4f0] px-5 py-8 text-[#173c39] sm:py-14"><div className="mx-auto max-w-5xl"><Link to="/" className="font-bold tracking-wide">Spirit Healing</Link>{children}<Footer /></div></main>;

export const LiveTalkRegistration = () => {
    const [info, setInfo] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    useEffect(() => {
        const controller = new AbortController();
        fetch("/api/live-talk", { signal: controller.signal }).then(r => r.json()).then(r => {
            if (!r.ok) throw new Error(); setInfo(r.event);
        }).catch(e => { if (e.name !== "AbortError") setError("Die Anmeldung ist gerade nicht erreichbar. Bitte lade die Seite erneut."); });
        return () => controller.abort();
    }, []);
    const register = async (event) => {
        event.preventDefault(); if (status === "sending") return;
        setError(""); setStatus("sending");
        const data = new FormData(event.currentTarget);
        try {
            await submitForm("/api/live-talk/register", { name: data.get("name"), email: data.get("email"), company: data.get("company"), privacyConsent: data.get("privacy") === "on", newsletterConsent: data.get("newsletter") === "on" });
            setStatus("success"); window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) { setStatus("idle"); setError(e.code === "full" ? "Alle verfügbaren Live-Plätze sind vergeben. Schreibe uns für die Warteliste an info@spirit-healing.tr." : e.code === "closed" ? "Für diesen Termin ist die Anmeldung noch nicht geöffnet oder bereits geschlossen." : e.code === "rate_limit" ? "Bitte warte einige Minuten, bevor du es erneut versuchst." : "Bitte prüfe deine Angaben und versuche es erneut. Bei Fragen: info@spirit-healing.tr."); }
    };
    if (status === "success") return <Shell><section role="status" className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-8 sm:p-12"><h1 className="font-serif text-4xl">Schau jetzt in dein E-Mail-Postfach.</h1><p className="mt-6 leading-8">Für eine neue Anmeldung senden wir dir in wenigen Minuten deine Bestätigung mit Zoom-Zugang und Kalendereintrag. Bitte prüfe auch den Spam-Ordner.</p><p className="mt-4 leading-7">Du hast dich bereits angemeldet? Dein bisheriger Zugang bleibt gültig. Eine erneute Anmeldung verschickt keine doppelte E-Mail. Falls du abgesagt hast oder keine Nachricht findest, schreibe uns an <a className="underline" href="mailto:info@spirit-healing.tr">info@spirit-healing.tr</a>.</p><p className="mt-4 leading-7">Falls du weitere Impulse ausgewählt hast, bestätige bitte auch die separate Newsletter-E-Mail. Die Teilnahme am Vortrag ist davon unabhängig.</p><p className="mt-6 font-semibold">6. Oktober 2026 · 19:30–20:30 Uhr deutscher Zeit</p></section></Shell>;
    return <Shell>
        <header className="mt-8 rounded-[2rem] bg-[#075d60] px-7 py-12 text-white sm:px-12"><p className="text-sm font-semibold tracking-widest text-[#f0d687]">KOSTENLOSER LIVE-VORTRAG · 6. OKTOBER</p><h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">Wer schreibt dein inneres Drehbuch?</h1><p className="mt-6 max-w-2xl font-serif text-2xl leading-relaxed">Deine persönliche Matrix erkennen. Deinem Selbst das Zepter zurückgeben.</p><p className="mt-6 leading-7 text-white/85">Mit Sabine &amp; Selcan · Dienstag, 6. Oktober 2026<br />19:30–20:30 Uhr deutscher Zeit<br />Live über Zoom · auf Deutsch</p><a href="#anmeldung" className={`${button} mt-7`}>Kostenlos zum Live-Vortrag anmelden</a></header>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section className="rounded-3xl bg-[#fffaf2] p-7 sm:p-9"><h2 className="font-serif text-3xl">Zurück zu deiner wahren Essenz.</h2><p className="mt-6 leading-8">Vielleicht kennst du deine Muster längst. Trotzdem beginnt in vertrauten Situationen derselbe Film. Du passt dich an, obwohl du anders entscheiden wolltest. Dein inneres Drehbuch übernimmt.</p><p className="mt-5 leading-8">Mit der rückläufigen Venus richten wir unseren Blick auf alte Bindungen und auf die persönliche Matrix, in der vertraute Rollen weiterleben. Wie kannst du aus dieser Matrix aussteigen und deinem Selbst das Zepter zurückgeben? Wir möchten dich auf den Weg zu deiner wahren Essenz mitnehmen.</p><p className="mt-5 leading-8">Eine kurze freiwillige Übung und Zeit für Fragen gehören zum Abend. Du lernst außerdem unser 13-Wochen-Programm kennen, das am 21. Oktober beginnt und uns durch Weihnachten, die Rauhnächte und den Jahreswechsel bis zum 13. Januar führt.</p><p className="mt-5 leading-8">Du brauchst keine Vorkenntnisse. Den aufgezeichneten Vortrag musst du vorher nicht gesehen haben.</p><p className="mt-7 border-t border-[#d8e5df] pt-5 text-sm leading-6">Du möchtest schon jetzt in das Thema eintauchen? Der <Link className="underline" to="/vortrag-13-wochen-programm">bisherige aufgezeichnete Vortrag</Link> bleibt separat verfügbar. Er ist keine Aufzeichnung dieses Live-Abends.</p></section>
            <form id="anmeldung" onSubmit={register} className="scroll-mt-6 rounded-3xl bg-white p-7 sm:p-9"><h2 className="font-serif text-3xl">Sei live dabei.</h2><p className="mt-4 leading-7">Nach deiner Anmeldung erhältst du den Zoom-Link per E-Mail. Wir erinnern dich am Vortag und eine Stunde vor Beginn. Bei kurzfristiger Anmeldung erhältst du nur die noch ausstehenden Erinnerungen.</p><label htmlFor="live-name" className="mt-6 block font-semibold">Dein Name</label><input className={field} id="live-name" name="name" autoComplete="name" required maxLength={100} /><label htmlFor="live-email" className="mt-5 block font-semibold">Deine E-Mail-Adresse</label><input className={field} id="live-email" name="email" type="email" autoComplete="email" required maxLength={254} /><div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="live-company">Firma</label><input id="live-company" name="company" tabIndex={-1} autoComplete="off" /></div><label className="mt-6 flex items-start gap-3 text-sm leading-6"><input type="checkbox" name="privacy" required className="mt-1 h-4 w-4 shrink-0" /><span>Ich stimme der Verarbeitung meiner Angaben für die Anmeldung, den Zoom-Zugang und die Terminerinnerungen zu. <Link to="/datenschutz" className="underline">Datenschutz</Link>. Meine Teilnahme kann ich über den Link in der E-Mail absagen.</span></label><label className="mt-4 flex items-start gap-3 rounded-xl bg-[#f7f2e5] p-4 text-sm leading-6"><input type="checkbox" name="newsletter" className="mt-1 h-4 w-4 shrink-0" /><span>Ja, ich möchte weitere Impulse und Informationen zum 13-Wochen-Programm per E-Mail erhalten. Freiwillig, mit separater Bestätigung per E-Mail und jederzeit abbestellbar.</span></label>{error && <p role="alert" className="mt-5 text-red-800">{error}</p>}{info && !info.ready && <p role="status" className="mt-5">Für diesen Termin ist die Anmeldung noch nicht geöffnet oder bereits geschlossen. Bei Fragen schreibe uns an info@spirit-healing.tr.</p>}<button className={`${button} mt-7 w-full`} disabled={!info?.ready || status === "sending"}>{status === "sending" ? "Anmeldung wird gespeichert …" : "Kostenlos anmelden"}</button><p className="mt-4 text-xs leading-6">Keine Newsletter-Pflicht. Zoom wird erst geöffnet, wenn du deinen Zugangslink anklickst. Die Anmeldung startet keine Aufzeichnung.</p></form>
        </div>
        <p className="mt-8 text-sm leading-6">P.S. Unser Intensivseminar für Familienaufstellung findet am 9. und 10. Oktober in Berlin statt. <Link className="underline" to="/berlin-live">Aktuelle Restplätze ansehen.</Link></p>
    </Shell>;
};

export const LiveTalkAccess = () => {
    const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get("token") || "");
    const [access, setAccess] = useState(null);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    useEffect(() => { submitForm("/api/live-talk/access", { token }).then(r => setAccess(r.access)).catch(() => setMessage("Dieser Zugang ist ungültig oder nicht mehr verfügbar. Bitte schreibe an info@spirit-healing.tr.")); }, [token]);
    const cancel = async () => {
        setBusy(true);
        try { await submitForm("/api/live-talk/cancel", { token }); setAccess(a => ({ ...a, status: "cancelled", joinUrl: null })); }
        catch { setMessage("Die Absage konnte nicht gespeichert werden. Bitte versuche es erneut."); }
        finally { setBusy(false); }
    };
    return <Shell><section className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-8"><h1 className="font-serif text-4xl">Dein Live-Vortrag</h1>{message && <p role="alert" className="mt-5">{message}</p>}{!access && !message && <p className="mt-5">Dein Zugang wird geladen …</p>}{access && <><p className="mt-6">Hallo {access.name},</p><p className="mt-4 font-semibold">{access.label}</p>{access.status === "cancelled" ? <p role="status" className="mt-6">Deine Teilnahme ist abgesagt. Du erhältst keine weiteren Terminerinnerungen. Ein gegebenenfalls separat bestätigter Newsletter bleibt davon unberührt.</p> : <>{access.joinUrl ? <a className={`${button} mt-6`} href={access.joinUrl} rel="noreferrer">Zum Live-Vortrag in Zoom</a> : <p className="mt-6">Der Zoom-Zugang ist derzeit nicht verfügbar oder der Termin ist bereits beendet.</p>}<p className="mt-6 leading-7">Du kannst doch nicht teilnehmen? Mit dem folgenden Button sagst du deine Anmeldung ab und beendest die Terminerinnerungen.</p><button disabled={busy} onClick={cancel} className="mt-4 rounded-full border border-[#7a9290] px-6 py-3">{busy ? "Absage wird gespeichert …" : "Teilnahme absagen"}</button></>}</>}</section></Shell>;
};
