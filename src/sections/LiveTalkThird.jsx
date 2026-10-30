import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { submitForm } from "@/lib/submissions";
import { replayFunnel } from "@/content/replayFunnel";

export const LiveTalkThird = () => {
    const [info, setInfo] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        fetch("/api/live-talk-3", { signal: controller.signal, cache: "no-store" })
            .then(response => response.json())
            .then(result => {
                if (!result.ok) throw new Error();
                setInfo(result.event);
            })
            .catch(requestError => {
                if (requestError.name !== "AbortError") setError("Die Anmeldung ist gerade nicht erreichbar. Bitte versuche es später noch einmal oder schreibe an info@spirit-healing.tr.");
            });
        return () => controller.abort();
    }, []);

    const register = async event => {
        event.preventDefault();
        if (status === "sending" || !info?.ready) return;
        const data = new FormData(event.currentTarget);
        setStatus("sending");
        setError("");
        try {
            await submitForm("/api/live-talk-3/register", {
                name: data.get("name"),
                email: data.get("email"),
                company: data.get("company"),
            });
            setStatus("success");
        } catch (requestError) {
            setStatus("idle");
            setError(requestError.code === "closed"
                ? "Die Anmeldung ist noch nicht geöffnet oder der Termin hat bereits begonnen."
                : requestError.code === "full"
                    ? "Alle Live-Plätze sind vergeben. Für die Warteliste schreibe an info@spirit-healing.tr."
                    : "Die Anmeldung konnte nicht gespeichert werden. Bitte prüfe deine Angaben und versuche es erneut.");
        }
    };

    const field = "mt-2 min-h-12 w-full rounded-xl border border-[#b9cec7] bg-white px-4 py-3 text-[#173c39]";

    return <main data-no-translate="true" className="min-h-screen bg-[#faf6ed] px-5 py-8 text-[#173c39]">
        <div className="mx-auto max-w-5xl">
            <nav className="flex flex-wrap justify-between gap-4">
                <Link className="font-serif text-xl" to="/">Spirit Healing</Link>
                <Link className="underline" to={replayFunnel.path}>Zum ersten Vortrag & Workbook</Link>
            </nav>

            <header className="mt-9 rounded-3xl bg-[#075d60] px-7 py-12 text-white sm:px-12">
                <p className="text-sm font-bold uppercase tracking-[0.17em] text-[#edcf96]">Dritter Live-Abend · 3. November · 20 Uhr</p>
                <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">Bindungsmuster<br/>verstehen.</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">Ein Teil möchte Nähe. Ein anderer hält Abstand. Wir schauen gemeinsam auf das innere Drehbuch hinter Nähe und Rückzug und auf die Anteile in uns, die Verbindung suchen oder schützen möchten.</p>
                <p className="mt-6 font-semibold">Mit Sabine & Selcan · kostenlos über Zoom<br/>Dienstag, 3. November 2026, 20 Uhr deutscher Zeit</p>
            </header>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <section className="p-3 sm:p-7">
                    <h2 className="font-serif text-3xl">Warum wird es manchmal schwierig, wenn es nah wird?</h2>
                    <p className="mt-5 leading-8">Was geschieht in uns, wenn Verbindung entsteht? Wenn eine Nachricht unbeantwortet bleibt? Wenn wir jemanden gernhaben und uns trotzdem zurückziehen? In unserem dritten kostenlosen Live-Vortrag geht es um Bindungen und Bindungsmuster.</p>
                    <p className="mt-4 leading-8">Wir schauen darauf, wie unterschiedlich Menschen Nähe erleben: mit Vertrauen, mit der Sorge, verlassen zu werden, mit Rückzug oder mit dem Wunsch nach Nähe und der gleichzeitigen Angst davor. Welche Muster zeigen sich in Beziehungen? Welcher innere Anteil sucht Verbindung, welcher möchte schützen? Bring deine Beobachtungen und Fragen mit.</p>
                    <p className="mt-4 leading-8">Du brauchst keine Vorkenntnisse und musst bei den ersten beiden Abenden nicht dabei gewesen sein. Du darfst mit einer Frage kommen oder einfach zuhören. Zum Abschluss gehen wir gemeinsam in eine Meditation.</p>
                    <Link to={replayFunnel.path} className="mt-6 inline-block font-bold underline underline-offset-4">Den ersten Vortrag und das Workbook öffnen</Link>
                </section>

                {status === "success" ? <section role="status" className="rounded-3xl bg-white p-7 sm:p-9">
                    <h2 className="font-serif text-3xl">Schau in dein E-Mail-Postfach.</h2>
                    <p className="mt-5 leading-8">Wir senden dir in wenigen Minuten deine Bestätigung mit dem Zoom-Zugang. Bitte prüfe auch den Spam-Ordner.</p>
                    <p className="mt-4 leading-7">Falls du dich mit dieser E-Mail-Adresse bereits angemeldet hast, bleibt dein vorhandener Zugang gültig. Eine erneute Anmeldung verschickt keine doppelte Nachricht. Bei Fragen schreibe an info@spirit-healing.tr.</p>
                </section> : <form id="anmeldung" onSubmit={register} className="scroll-mt-6 rounded-3xl bg-white p-7 sm:p-9">
                    <h2 className="font-serif text-3xl">Sei live dabei.</h2>
                    <label className="mt-6 block font-semibold" htmlFor="third-name">Dein Vorname</label>
                    <input id="third-name" name="name" className={field} autoComplete="given-name" required maxLength={100}/>
                    <label className="mt-5 block font-semibold" htmlFor="third-email">Deine E-Mail-Adresse</label>
                    <input id="third-email" name="email" type="email" className={field} autoComplete="email" required maxLength={254}/>
                    <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="third-company">Firma</label><input id="third-company" name="company" tabIndex={-1} autoComplete="off"/></div>
                    {info && !info.ready && <p role="status" className="mt-5 rounded-xl bg-[#faf6ed] p-4 leading-7">Die Anmeldung für diesen Termin ist noch nicht geöffnet. Wir bereiten sie gerade im Hintergrund vor.</p>}
                    {error && <p role="alert" className="mt-5 text-red-800">{error}</p>}
                    <button disabled={!info?.ready || status === "sending"} className="mt-7 min-h-12 w-full rounded-full bg-[#075d60] px-6 py-4 font-bold text-white disabled:opacity-50">{status === "sending" ? "Anmeldung wird gespeichert …" : "Kostenlos anmelden"}</button>
                    <p className="mt-4 text-sm leading-6">Wir verwenden deinen Namen und deine E-Mail für Zugangsdaten und Terminerinnerungen. <Link className="underline" to="/datenschutz#live-3-november">Datenschutz zur Anmeldung</Link>.</p>
                </form>}
            </div>

            <footer className="mt-10 flex flex-wrap gap-6 py-6 text-sm"><Link to="/impressum">Impressum</Link><Link to="/datenschutz">Datenschutz</Link><a href="mailto:info@spirit-healing.tr">Kontakt</a></footer>
        </div>
    </main>;
};
