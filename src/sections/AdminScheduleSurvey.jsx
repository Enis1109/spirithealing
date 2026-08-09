import {
    CalendarCheck2,
    CheckCircle2,
    Clock3,
    MessageSquareText,
    RefreshCw,
    Star,
    Trophy,
    UserRound,
    UsersRound,
} from "lucide-react";
import { createElement, useEffect, useMemo, useState } from "react";

const slotOrder = ["mo_1000", "mo_1930", "mi_1000", "mi_1930", "fr_1930", "sa_1100", "so_1100"];

const formatDate = (value) => value
    ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "–";

export const AdminScheduleSurvey = ({ requestJson }) => {
    const [data, setData] = useState({ total: 0, submissions: [], summary: [] });
    const [state, setState] = useState("loading");

    const load = async () => {
        setState("loading");
        try {
            const result = await requestJson("/api/admin/schedule-surveys");
            setData({ total: result.total || 0, submissions: result.submissions || [], summary: result.summary || [] });
            setState("ready");
        } catch {
            setState("error");
        }
    };

    useEffect(() => {
        let active = true;
        requestJson("/api/admin/schedule-surveys")
            .then((result) => {
                if (!active) return;
                setData({ total: result.total || 0, submissions: result.submissions || [], summary: result.summary || [] });
                setState("ready");
            })
            .catch(() => active && setState("error"));
        return () => { active = false; };
    }, [requestJson]);

    const ranked = useMemo(() => [...data.summary].sort((a, b) => (
        b.availableCount - a.availableCount
        || b.preferredCount - a.preferredCount
        || slotOrder.indexOf(a.id) - slotOrder.indexOf(b.id)
    )), [data.summary]);
    const leadingSlot = ranked[0];
    const answeredWithNotes = data.submissions.filter((item) => item.knownExceptions).length;
    const latestUpdate = data.submissions.reduce((latest, item) => {
        const timestamp = new Date(item.updatedAt).getTime();
        return timestamp > latest ? timestamp : latest;
    }, 0);

    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] bg-[#075f62] p-7 text-white shadow-xl sm:p-9">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e8ca67]">8 Wochen Begleitung</p>
                        <h1 className="mt-2 text-4xl font-bold">Terminabfrage</h1>
                        <p className="mt-3 max-w-2xl leading-7 text-white/75">Alle Rückmeldungen auf einen Blick: mögliche Teilnahme, Favoriten und bekannte Ausnahmen.</p>
                    </div>
                    <button type="button" onClick={load} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 px-5 font-bold text-white hover:bg-white/10"><RefreshCw className="h-4 w-4" /> Aktualisieren</button>
                </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    [UsersRound, data.total, "Rückmeldungen"],
                    [CalendarCheck2, leadingSlot?.availableCount || 0, "größte mögliche Runde"],
                    [Star, leadingSlot?.preferredCount || 0, "Favoriten beim Spitzenreiter"],
                    [MessageSquareText, answeredWithNotes, "mit Hinweis"],
                ].map(([icon, value, label]) => <article key={label} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm">{createElement(icon, { className: "h-6 w-6 text-[#0f8b8d]" })}<strong className="mt-4 block text-3xl">{value}</strong><span className="mt-1 block text-sm text-[#648082]">{label}</span></article>)}
            </div>

            {state === "loading" && <div className="rounded-3xl bg-[#fffaf2] p-8 font-bold text-[#0f8b8d]">Terminantworten werden geladen …</div>}
            {state === "error" && <div className="rounded-3xl bg-red-50 p-8 font-bold text-red-800">Die Terminantworten konnten nicht geladen werden.</div>}

            {state === "ready" && data.total === 0 && (
                <section className="rounded-3xl bg-[#fffaf2] p-8 text-center">
                    <CalendarCheck2 className="mx-auto h-10 w-10 text-[#0f8b8d]" />
                    <h2 className="mt-4 text-2xl font-bold">Noch keine Rückmeldung</h2>
                    <p className="mt-2 text-[#648082]">Sobald die erste Person die Terminabfrage absendet, erscheint hier automatisch die Auswertung.</p>
                </section>
            )}

            {state === "ready" && data.total > 0 && (
                <>
                    <section className="overflow-hidden rounded-3xl border border-[#d4af37]/40 bg-[#fff8df] p-6 shadow-sm sm:p-7">
                        <div className="flex items-start gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d4af37] text-[#173f40]"><Trophy className="h-6 w-6" /></span>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7127]">Aktuell beste Überschneidung</p>
                                <h2 className="mt-1 text-2xl font-bold">{leadingSlot.label}</h2>
                                <p className="mt-2 leading-7 text-[#665b39]">{leadingSlot.availableCount} von {data.total} Personen können regelmäßig teilnehmen · {leadingSlot.preferredCount} haben diesen Termin als Favoriten gewählt.</p>
                                <p className="mt-2 text-xs text-[#857750]">Das ist eine automatische Momentaufnahme. Bekannte Ausnahmen stehen unten bei den einzelnen Antworten.</p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm sm:p-7">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div><h2 className="text-2xl font-bold">Auswertung nach Termin</h2><p className="mt-1 text-sm text-[#648082]">Sortiert nach größtmöglicher Live-Teilnahme, danach nach Favoriten.</p></div>
                            {latestUpdate > 0 && <p className="text-xs text-[#648082]">Stand: {formatDate(latestUpdate)}</p>}
                        </div>
                        <div className="mt-6 space-y-4">
                            {ranked.map((slot, index) => {
                                const percentage = Math.round((slot.availableCount / data.total) * 100);
                                return (
                                    <article key={slot.id} className={`rounded-2xl border p-4 sm:p-5 ${index === 0 ? "border-[#d4af37]/60 bg-[#fff8df]" : "border-[#0f8b8d]/12 bg-white"}`}>
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? "bg-[#d4af37] text-[#173f40]" : "bg-[#e4f2ef] text-[#0f8b8d]"}`}>{index + 1}</span><div><h3 className="font-bold">{slot.label}</h3><p className="text-xs text-[#648082]">{slot.istanbul}</p></div></div>
                                            <p className="text-sm font-semibold text-[#315658]"><strong className="text-xl text-[#075f62]">{slot.availableCount}/{data.total}</strong> möglich · <strong>{slot.preferredCount}</strong> Favorit{slot.preferredCount === 1 ? "" : "en"}</p>
                                        </div>
                                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e4eeec]" aria-label={`${percentage} Prozent können teilnehmen`}><div className="h-full rounded-full bg-[#0f8b8d]" style={{ width: `${percentage}%` }} /></div>
                                        <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                            <div className="rounded-xl bg-[#eaf4f1] px-4 py-3 text-sm leading-6"><strong className="block text-[#075f62]">Können teilnehmen</strong><span className="text-[#426466]">{slot.availableNames.join(", ") || "niemand"}</span></div>
                                            <div className="rounded-xl bg-[#fff8df] px-4 py-3 text-sm leading-6"><strong className="flex items-center gap-1 text-[#7b6420]"><Star className="h-4 w-4 fill-[#d4af37] text-[#d4af37]" /> Favorit</strong><span className="text-[#665b39]">{slot.preferredNames.join(", ") || "niemand"}</span></div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <section className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm sm:p-7">
                        <h2 className="text-2xl font-bold">Einzelne Rückmeldungen</h2>
                        <p className="mt-1 text-sm text-[#648082]">Eine erneute Abgabe mit demselben Namen ersetzt automatisch die frühere Auswahl.</p>
                        <div className="mt-5 grid gap-3">
                            {data.submissions.map((submission) => {
                                const favorite = data.summary.find((slot) => slot.id === submission.preferredSlot);
                                const available = slotOrder
                                    .filter((id) => submission.availableSlots.includes(id))
                                    .map((id) => data.summary.find((slot) => slot.id === id)?.label)
                                    .filter(Boolean);
                                return (
                                    <article key={submission.id} className="rounded-2xl border border-[#0f8b8d]/12 bg-white p-4 sm:p-5">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex min-w-0 items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e4f2ef] text-[#0f8b8d]"><UserRound className="h-5 w-5" /></span><div><h3 className="text-lg font-bold">{submission.name}</h3><p className="mt-1 text-xs text-[#648082]">Zuletzt gespeichert: {formatDate(submission.updatedAt)}</p></div></div>
                                            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#fff8df] px-3 py-1.5 text-xs font-bold text-[#7b6420]"><Star className="h-3.5 w-3.5 fill-[#d4af37] text-[#d4af37]" /> {favorite?.label || submission.preferredSlot}</span>
                                        </div>
                                        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.7fr)]">
                                            <div className="rounded-xl bg-[#eaf4f1] px-4 py-3 text-sm leading-6"><strong className="flex items-center gap-2 text-[#075f62]"><CheckCircle2 className="h-4 w-4" /> Alle möglichen Termine</strong><span className="mt-1 block text-[#426466]">{available.join(" · ")}</span></div>
                                            <div className="rounded-xl bg-[#f7f4ed] px-4 py-3 text-sm leading-6"><strong className="flex items-center gap-2 text-[#675f4d]"><Clock3 className="h-4 w-4" /> Bekannte Ausnahme</strong><span className="mt-1 block whitespace-pre-wrap text-[#6d685d]">{submission.knownExceptions || "keine angegeben"}</span></div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};
