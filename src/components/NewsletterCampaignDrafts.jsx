import { useEffect, useState } from "react";

const DraftBody = ({ text }) => <div className="mt-5 space-y-5 leading-7">{text.split("\n\n").map((paragraph, index) =>
    <p key={index} className="whitespace-pre-line">{paragraph.split(/(\[[^\]]+\]\(https:\/\/spirit-healing\.tr\/[^)]+\)|\*\*[^*]+\*\*)/u).map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\((https:\/\/spirit-healing\.tr\/[^)]+)\)$/u);
        if (link) return <a key={i} className="font-semibold underline underline-offset-4" href={link[2]}>{link[1]}</a>;
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        return part;
    })}</p>
)}</div>;

export const NewsletterCampaignDrafts = () => {
    const localPreview = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {
        const controller = new AbortController();
        fetch("/api/admin/newsletter-campaigns", { cache: "no-store", signal: controller.signal })
            .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(r => { if (!r.ok) throw new Error(); setData(r); })
            .catch(e => { if (e.name !== "AbortError") setError("Die Kampagnenübersicht konnte nicht geladen werden."); });
        return () => controller.abort();
    }, []);
    return <section className="mt-10 rounded-2xl bg-white p-7" aria-labelledby="campaign-drafts-title">
        <h2 id="campaign-drafts-title" className="font-serif text-3xl">E-Mail-Kampagne zum 13-Wochen-Programm</h2>
        <p className="mt-4 leading-7">Entwürfe zur Prüfung. Die Datumsangaben sind Vorschläge, keine gebuchten Versandtermine. Hier wird nichts automatisch verschickt. Die folgenden Kontaktzahlen stammen ausschließlich aus der Website-Datenbank. Der Verteiler und die gestalteten E-Mails in Hostinger Reach werden getrennt verwaltet und sind hier nicht verbunden.</p>
        {error && <p role="alert" className="mt-4">{error}</p>}
        {data && <>
            <p className="mt-4 font-semibold">{localPreview ? "Lokale Vorschau ohne Verbindung zum Verteiler. Die aktuellen Kontaktzahlen erscheinen erst auf der veröffentlichten Admin-Seite." : `${data.activeGerman} bestätigte deutschsprachige Newsletter-Kontakte · ${data.pending} unbestätigte Anmeldungen ausgeschlossen`}</p>
            <p className="mt-3 text-sm leading-6">Die endgültige Empfängerliste wird erst vor einem gesondert freigegebenen Versand gebildet. Bereits zum Live-Vortrag Angemeldete erhalten keine weiteren Einladungen. Bereits im Programm Gebuchte erhalten keine Verkaufsfolge. Testkontakte, Absenderangaben, Abmeldelink, Restplätze und die Erreichbarkeit der Anmeldung sind vorher zu prüfen.</p>
            <div className="mt-6 space-y-4">{data.drafts.map(d => <details className="rounded-xl border border-[#c7d8d1] p-5" key={d.campaign_key}>
                <summary className="cursor-pointer font-semibold">{d.planned_date.split("-").reverse().join(".")} · {d.subject}</summary>
                <p className="mt-4 text-sm">Status: Entwurf · {d.segment === "newsletter_de_not_registered" ? "Einladung an noch nicht Angemeldete" : "Vertiefung an noch nicht im Programm Gebuchte"}</p>
                <p className="mt-4 text-sm italic">{d.preheader}</p>
                <DraftBody text={d.body} />
                <p className="mt-5 border-t pt-4 text-sm">Vor Versand: vollständige Absenderangaben und persönlicher Abmeldelink aus dem bestehenden Newsletter-System ergänzen. Kein Versand aus dieser Vorschau.</p>
            </details>)}</div>
        </>}
    </section>;
};
