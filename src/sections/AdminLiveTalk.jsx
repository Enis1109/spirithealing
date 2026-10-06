import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NewsletterCampaignDrafts } from "@/components/NewsletterCampaignDrafts";

export const AdminLiveTalk = () => {
    const [data, setData] = useState(null);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const load = async () => {
        const response = await fetch("/api/admin/live-talk", { cache: "no-store" });
        const body = await response.json();
        if (!body.ok) throw new Error(response.status === 401 || response.status === 403 ? "Bitte melde dich zuerst im Admin-Bereich an und öffne diese Seite danach erneut." : "Übersicht konnte nicht geladen werden.");
        setData(body);
    };
    useEffect(() => { load().catch(e => setMessage(e.message)); }, []);
    const save = async (event) => {
        event.preventDefault(); setBusy(true); setMessage("");
        const form = new FormData(event.currentTarget);
        try {
            const response = await fetch("/api/admin/live-talk", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ joinUrl: form.get("joinUrl"), passcode: form.get("passcode"), enabled: form.get("enabled") === "on" }) });
            const body = await response.json();
            if (!body.ok) throw new Error("Speichern fehlgeschlagen. Bitte prüfe den vollständigen Zoom-Teilnahmelink mit Kenncode.");
            setData(body); setMessage("Einstellungen gespeichert.");
        } catch (e) { setMessage(e.message); }
        finally { setBusy(false); }
    };
    return <main data-no-translate="true" className="min-h-screen bg-[#edf4f0] p-6 text-[#173c39]"><div className="mx-auto max-w-5xl"><Link to="/admin" className="underline">Zum Admin-Bereich</Link><h1 className="mt-8 font-serif text-4xl">Live-Vortrag am 6. Oktober</h1>{message && <p role="status" className="mt-6 rounded-xl bg-white p-4">{message}</p>}{data && <><form onSubmit={save} className="mt-8 rounded-2xl bg-white p-7"><label className="block font-bold" htmlFor="admin-zoom">Zoom-Teilnahmelink</label><input id="admin-zoom" name="joinUrl" type="url" defaultValue={data.joinUrl || ""} required className="mt-3 w-full rounded-xl border p-3" /><p className="mt-3 text-sm">Nur den Teilnahmelink verwenden, niemals einen Host-Startlink. Der Link bleibt in der geschützten Datenbank und erscheint nicht im öffentlichen Seiteninhalt.</p><label className="mt-5 block font-bold" htmlFor="admin-passcode">Zoom-Kenncode für die manuelle Eingabe</label><input id="admin-passcode" name="passcode" type="text" inputMode="numeric" autoComplete="off" defaultValue={data.passcode || ""} required className="mt-3 w-full rounded-xl border p-3" /><p className="mt-3 text-sm">Meeting-ID und Kenncode werden in den Terminnachrichten zusätzlich zum direkten Link angegeben.</p><label className="mt-5 flex gap-3"><input type="checkbox" name="enabled" defaultChecked={data.enabled} />Anmeldung und automatische Terminnachrichten aktivieren</label><button disabled={busy} className="mt-5 rounded-full bg-[#d4af37] px-6 py-3 font-bold">{busy ? "Wird gespeichert …" : "Einstellungen speichern"}</button></form><div className="mt-6 flex gap-6"><Link to="/live-vortrag" className="underline">Anmeldeseite öffnen</Link><button className="underline" onClick={() => load().catch(e => setMessage(e.message))}>Versandübersicht aktualisieren</button></div><p className="mt-5 leading-7">„sent“ bedeutet vom Mailserver angenommen, nicht zwingend im Posteingang zugestellt. „failed“ wird höchstens dreimal versucht. „uncertain“ und endgültige Fehler müssen geprüft werden; unklare Zustellungen werden nicht automatisch doppelt verschickt. Abgesagte Teilnahmen erhalten keine weiteren Erinnerungen.</p><div className="mt-5 overflow-x-auto"><table className="w-full bg-white text-left text-sm"><thead><tr>{["Name", "E-Mail", "Teilnahme", "Newsletter", "Nachricht", "Versand", "Versuche"].map(t => <th className="p-3" key={t}>{t}</th>)}</tr></thead><tbody>{data.registrations.map(r => <tr className="border-t" key={`${r.id}-${r.kind}`}><td className="p-3">{r.name}</td><td className="p-3">{r.email}</td><td className="p-3">{r.status}</td><td className="p-3">{r.newsletter_status}</td><td className="p-3">{r.kind}</td><td className="p-3">{r.mail_status}</td><td className="p-3">{r.attempts}</td></tr>)}</tbody></table>{!data.registrations.length && <p className="mt-4">Noch keine Anmeldungen.</p>}</div><NewsletterCampaignDrafts /></>}</div></main>;
};
