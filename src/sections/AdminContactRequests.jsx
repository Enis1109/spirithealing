import { useEffect, useMemo, useRef, useState } from "react";
import { createContactListLoader } from "@/lib/latestContactList";
import { contactOffers } from "@/lib/contactOffers";
import { useLanguage } from "@/i18n/LanguageContext";

async function request(path, options = {}) {
    const response = await fetch("/api/admin/contact-requests" + path, {
        credentials: "same-origin", cache: "no-store", ...options,
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
}
const transitions = { new: ["in_progress", "done"], in_progress: ["new", "done"], done: ["in_progress"] };
const copy = {
    de: { title: "Kontaktanfragen", intro: "Gespeicherte Anfragen, keine Buchungs- oder Umsatzstatistik. Ältere Einträge können auch Überweisungsanfragen enthalten.", legacy: "Ältere Anfrage / nicht zugeordnet", general: "Allgemeine Anfrage",
        detail: "Details öffnen", close: "Details schließen", next: "Weitere Anfragen", refresh: "Neu laden", empty: "Keine Anfragen vorhanden.", error: "Nicht geladen oder zwischenzeitlich geändert. Bitte neu laden.", note: "Mailstatus offen bedeutet: Versand noch nicht abgeschlossen oder Ausgang unklar. Vor einem manuellen Versand prüfen.", mail: "Benachrichtigung", newsletter: "Newsletter", status: { new: "Neu", in_progress: "In Bearbeitung", done: "Erledigt" } },
    tr: { title: "İletişim talepleri", intro: "Kaydedilmiş talepler; rezervasyon veya ciro istatistiği değildir. Eski kayıtlar havale taleplerini de içerebilir.", legacy: "Eski / sınıflandırılmamış talep", general: "Genel talep",
        detail: "Ayrıntıları aç", close: "Ayrıntıları kapat", next: "Diğer talepler", refresh: "Yenile", empty: "Henüz talep yok.", error: "Yüklenemedi veya başka bir işlemle değişti. Lütfen yenileyin.", note: "Açık e-posta durumu: gönderim tamamlanmadı veya sonucu belirsiz. Elle göndermeden önce kontrol edin.", mail: "Bildirim", newsletter: "Bülten", status: { new: "Yeni", in_progress: "İşlemde", done: "Tamamlandı" } },
};
const button = "min-h-12 rounded-xl border border-[#0f8b8d]/40 px-4 py-2 font-semibold disabled:opacity-50";
const deliveryLabels = {
    de: { pending: "Offen / prüfen", sent: "Gesendet", failed: "Fehlgeschlagen", notification_failed: "Benachrichtigung fehlgeschlagen", confirmation_failed: "Bestätigung fehlgeschlagen", not_requested: "Nicht gewünscht", confirmed: "Bestätigt", unsubscribed: "Abgemeldet", active: "Aktiv" },
    tr: { pending: "Açık / kontrol edin", sent: "Gönderildi", failed: "Başarısız", notification_failed: "Bildirim başarısız", confirmation_failed: "Onay gönderilemedi", not_requested: "İstenmedi", confirmed: "Onaylandı", unsubscribed: "Abonelik iptal edildi", active: "Aktif" },
};

export function AdminContactRequests() {
    const { language } = useLanguage();
    const t = copy[language];
    const delivery = value => deliveryLabels[language][value] || (language === "tr" ? "Kontrol edin" : "Bitte prüfen");
    const [rows, setRows] = useState([]);
    const [next, setNext] = useState(null);
    const [detail, setDetail] = useState(null);
    const [busy, setBusy] = useState(true);
    const [error, setError] = useState(false);
    const generation = useRef(0);
    const load = useMemo(() => createContactListLoader({
        generation, request,
        begin: () => { setDetail(null); setBusy(true); setError(false); },
        success: result => { setRows(result.requests); setNext(result.next); },
        failure: () => { setRows([]); setNext(null); setError(true); },
        finish: () => setBusy(false),
    }), []);
    useEffect(() => {
        void load();
        const invalidate = () => { generation.current++; };
        return invalidate;
    }, [load]);
    const open = async id => {
        const version = ++generation.current;
        setDetail(null); setError(false); setBusy(true);
        try {
            const result = await request("/" + id);
            if (version === generation.current) setDetail(result.request);
        } catch { if (version === generation.current) setError(true); }
        finally { if (version === generation.current) setBusy(false); }
    };
    const update = async status => {
        const version = ++generation.current;
        setBusy(true); setError(false);
        try {
            await request("/" + detail.id, { method: "PATCH", body: JSON.stringify({
                status, from: detail.processing_status, version: detail.processing_version,
            }) });
            if (version === generation.current) await load();
        } catch {
            if (version === generation.current) { setDetail(null); setError(true); setBusy(false); }
        }
    };
    const label = row => contactOffers[row.offer_code]?.[language] || (row.request_kind === "general" ? t.general : t.legacy);
    return <section className="space-y-5 rounded-3xl bg-[#fffaf2] p-5 text-[#173f40] sm:p-8">
        <h1 className="text-3xl font-bold">{t.title}</h1><p>{t.intro}</p><p className="text-sm">{t.note}</p>
        <button className={button} disabled={busy} onClick={() => load()}>{t.refresh}</button>
        {error && <p role="alert">{t.error}</p>}
        {busy && <p role="status">{language === "tr" ? "Yükleniyor …" : "Wird geladen …"}</p>}
        {!busy && !error && !rows.length && <p>{t.empty}</p>}
        <ul className="space-y-3">{rows.map(row => <li key={row.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
            <div><strong>#{row.id} · {label(row)}</strong><p>{new Date(row.created_at).toLocaleString(language)} · {t.status[row.processing_status]}</p>
                <p>{t.mail}: {delivery(row.notification_status)} · {t.newsletter}: {delivery(row.newsletter_status)}</p></div>
            <button className={button} disabled={busy} onClick={() => open(row.id)}>{t.detail}</button>
        </li>)}</ul>
        {next && <button className={button} disabled={busy} onClick={() => load(next)}>{t.next}</button>}
        {detail && <section aria-label={t.detail} className="space-y-3 break-words rounded-xl border-2 border-[#0f8b8d] p-4">
            <h2 className="text-xl font-bold">#{detail.id} · {label(detail)}</h2>
            <p>{detail.name}</p><p>{detail.email}</p><p>{detail.phone}</p><p>{detail.topic}</p>
            <p className="whitespace-pre-wrap">{detail.message}</p>
            <p>{t.mail}: {delivery(detail.notification_status)} · {t.newsletter}: {delivery(detail.newsletter_status)}</p>
            <div className="flex flex-wrap gap-3">{(transitions[detail.processing_status] || []).map(status =>
                <button key={status} className={button} disabled={busy} onClick={() => update(status)}>{t.status[status]}</button>)}
                <button className={button} disabled={busy} onClick={() => { generation.current++; setDetail(null); }}>{t.close}</button></div>
        </section>}
    </section>;
}
