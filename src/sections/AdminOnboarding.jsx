import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ClipboardCheck,
    Clock3,
    Mail,
    Phone,
    RefreshCw,
    ShieldAlert,
    UserRound,
} from "lucide-react";
import { createElement, useEffect, useMemo, useState } from "react";

const topicLabels = {
    beziehungen: "Beziehungen & Nähe",
    selbstwert: "Selbstwert & Selbstvertrauen",
    grenzen: "Grenzen & Bedürfnisse",
    entscheidungen: "Entscheidungen & Klarheit",
    koerper: "Körper & Wohlbefinden",
    beruf: "Beruf & Wirken",
    geld: "Geld & Sicherheit",
    familie: "Familie & Prägungen",
    verlust: "Verlust & Veränderung",
    anderes: "Etwas anderes",
};

const frequencyLabels = {
    selten: "seltener",
    monatlich: "etwa monatlich",
    woechentlich: "etwa wöchentlich",
    mehrmals_woechentlich: "mehrmals pro Woche",
    taeglich: "fast täglich",
};

const statusLabels = {
    neu: "Neu",
    vorbereitet: "Für Gespräch vorbereitet",
    rueckfrage: "Rückfrage nötig",
    abgeschlossen: "Startgespräch abgeschlossen",
};

const formatDate = (value) => value
    ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "–";

const average = (values) => (values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length).toFixed(1);

const ReadField = ({ label, children, accent = false }) => (
    <div className={`rounded-2xl border p-4 ${accent ? "border-amber-300 bg-amber-50" : "border-[#0f8b8d]/15 bg-white"}`}>
        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#648082]">{label}</dt>
        <dd className="mt-2 whitespace-pre-wrap leading-7 text-[#274f51]">{children || "–"}</dd>
    </div>
);

const ScoreRow = ({ label, value, inverted = false }) => (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl bg-white px-4 py-3">
        <span className="text-sm leading-6 text-[#426466]">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full font-bold ${inverted && value >= 7 ? "bg-amber-100 text-amber-800" : !inverted && value >= 7 ? "bg-emerald-100 text-emerald-800" : "bg-[#eaf4f1] text-[#075f62]"}`}>{value}</span>
    </div>
);

const SubmissionCard = ({ submission, requestJson, onUpdated, setNotice }) => {
    const [note, setNote] = useState(submission.reviewNote || "");
    const [busy, setBusy] = useState(false);
    const attention = submission.stability !== "ja" || submission.crisisContact !== "ja";
    const action = async (status) => {
        setBusy(true);
        try {
            const result = await requestJson(`/api/admin/onboarding/${submission.id}`, {
                method: "PUT",
                body: JSON.stringify({ status, note }),
            });
            onUpdated(result.submissions);
            setNotice({ type: "success", text: `Der Status von ${submission.name} wurde aktualisiert.` });
        } catch {
            setNotice({ type: "error", text: "Der Gesprächsstatus konnte nicht gespeichert werden." });
        } finally {
            setBusy(false);
        }
    };

    return (
        <article className={`overflow-hidden rounded-3xl border bg-[#fffaf2] shadow-sm ${attention ? "border-amber-300" : "border-[#0f8b8d]/12"}`}>
            <details className="group">
                <summary className="flex cursor-pointer list-none flex-col gap-4 p-5 marker:content-none sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex min-w-0 items-start gap-4">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${attention ? "bg-amber-100 text-amber-800" : "bg-[#e4f2ef] text-[#0f8b8d]"}`}>{attention ? <ShieldAlert className="h-6 w-6" /> : <UserRound className="h-6 w-6" />}</span>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-xl font-bold">{submission.name}</h2>{attention && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Vor Gespräch prüfen</span>}</div>
                            <p className="mt-1 text-sm text-[#648082]">{formatDate(submission.createdAt)} · {submission.reference}</p>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#426466]">{submission.goalStatement}</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                        <span className="rounded-full bg-[#eaf4f1] px-3 py-1.5 text-xs font-bold text-[#075f62]">{statusLabels[submission.reviewStatus] || submission.reviewStatus}</span>
                        <ChevronDown className="h-5 w-5 text-[#648082] transition group-open:rotate-180" />
                    </div>
                </summary>

                <div className="border-t border-[#0f8b8d]/12 px-5 py-6 sm:px-6">
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <a href={`mailto:${submission.email}`} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold text-[#075f62] hover:underline"><Mail className="h-5 w-5" /> {submission.email}</a>
                        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-[#426466]"><Phone className="h-5 w-5 text-[#0f8b8d]" /> {submission.phone || "nicht angegeben"}</div>
                        <div className="rounded-2xl bg-white p-4 text-sm text-[#426466]"><strong className="block text-[#173f40]">Handlungsfreiheit</strong>{average([submission.h01, submission.h02, submission.h03, submission.h04, submission.h05])} / 10</div>
                        <div className="rounded-2xl bg-white p-4 text-sm text-[#426466]"><strong className="block text-[#173f40]">Musterbelastung</strong>{average([submission.b01, submission.b02, submission.b03])} / 10</div>
                    </section>

                    {attention && (
                        <section className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5">
                            <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" /><div><h3 className="font-bold text-amber-900">Bitte vor dem Startgespräch ansehen</h3><p className="mt-1 text-sm leading-6 text-amber-800">Stabilität für den Gruppenprozess: <strong>{submission.stability}</strong> · Ansprechperson/Anlaufstelle in einer Krise: <strong>{submission.crisisContact}</strong>. Das ist keine Diagnose, sondern ein Hinweis für eure persönliche Klärung.</p></div></div>
                        </section>
                    )}

                    <section className="mt-7">
                        <h3 className="text-lg font-bold text-[#075f62]">1. Anliegen & Ziel</h3>
                        <div className="mt-3 grid gap-3 lg:grid-cols-2">
                            <ReadField label="Lebensbereiche">{submission.topicAreas.map((topic) => topicLabels[topic] || topic).join(", ")}</ReadField>
                            <ReadField label="Ziel heute / Zuversicht">{`${submission.goalScore}/10 · ${submission.confidenceScore}/10`}</ReadField>
                            <ReadField label="Thema im Kern">{submission.mainTopic}</ReadField>
                            <ReadField label="Konkrete Situation">{submission.recentScene}</ReadField>
                            <ReadField label="Gewünschte Veränderung">{submission.desiredChange}</ReadField>
                            <ReadField label="Zielsatz">{submission.goalStatement}</ReadField>
                        </div>
                    </section>

                    <section className="mt-7">
                        <h3 className="text-lg font-bold text-[#075f62]">2. Musterablauf</h3>
                        <div className="mt-3 grid gap-3 lg:grid-cols-2">
                            <ReadField label="Auslöser">{submission.trigger}</ReadField>
                            <ReadField label="Automatische Bedeutung">{submission.automaticMeaning}</ReadField>
                            <ReadField label="Gefühle & Intensität">{`${submission.feelings}\nIntensität: ${submission.feelingIntensity}/10`}</ReadField>
                            <ReadField label="Körperreaktion">{submission.bodyResponse}</ReadField>
                            <ReadField label="Reaktion / Vermeidung">{submission.typicalResponse}</ReadField>
                            <ReadField label="Häufigkeit">{frequencyLabels[submission.patternFrequency] || submission.patternFrequency}</ReadField>
                            <ReadField label="Kurzfristiger Schutz">{submission.shortTermProtection}</ReadField>
                            <ReadField label="Langfristige Kosten">{submission.longTermCost}</ReadField>
                            <ReadField label="Befürchtete Folge bei Veränderung">{submission.fearedConsequence}</ReadField>
                            <ReadField label="Ausnahmen">{submission.exceptions}</ReadField>
                        </div>
                    </section>

                    <section className="mt-7">
                        <h3 className="text-lg font-bold text-[#075f62]">3. Satzergänzungen für die Matrix-Hypothese</h3>
                        <dl className="mt-3 grid gap-3 lg:grid-cols-2">
                            <ReadField label="Ich bin …">{submission.identityStatement}</ReadField>
                            <ReadField label="Andere sind …">{submission.othersStatement}</ReadField>
                            <ReadField label="Die Welt ist …">{submission.worldStatement}</ReadField>
                            <ReadField label="Deshalb muss ich …">{submission.mustStatement}</ReadField>
                            <ReadField label="Ich darf nicht …">{submission.mustNotStatement}</ReadField>
                            <ReadField label="Früher / Familie">{submission.earlyEcho}</ReadField>
                        </dl>
                    </section>

                    <section className="mt-7 grid gap-5 xl:grid-cols-2">
                        <div>
                            <h3 className="text-lg font-bold text-[#075f62]">4. Handlungsfreiheit · letzte 14 Tage</h3>
                            <div className="mt-3 space-y-2 rounded-2xl bg-[#eaf4f1] p-3">
                                <ScoreRow label="Bewusst entscheiden" value={submission.h01} />
                                <ScoreRow label="Bedürfnisse & Grenzen wahrnehmen" value={submission.h02} />
                                <ScoreRow label="In schwierigen Situationen bei mir bleiben" value={submission.h03} />
                                <ScoreRow label="Mich als handlungsfähig erleben" value={submission.h04} />
                                <ScoreRow label="Passende Schritte gehen" value={submission.h05} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#075f62]">5. Musterbelastung · letzte 14 Tage</h3>
                            <div className="mt-3 space-y-2 rounded-2xl bg-[#eaf4f1] p-3">
                                <ScoreRow label="Belastung im Alltag" value={submission.b01} inverted />
                                <ScoreRow label="Einschränkung von Beziehung/Entscheidung" value={submission.b02} inverted />
                                <ScoreRow label="Lange Rückkehr in die eigene Kraft" value={submission.b03} inverted />
                            </div>
                        </div>
                    </section>

                    <section className="mt-7">
                        <h3 className="text-lg font-bold text-[#075f62]">6. Ressourcen & sicherer Rahmen</h3>
                        <dl className="mt-3 grid gap-3 lg:grid-cols-2">
                            <ReadField label="Stabilität" accent={submission.stability !== "ja"}>{submission.stability}</ReadField>
                            <ReadField label="Professionelle Begleitung">{submission.professionalSupport}</ReadField>
                            <ReadField label="Was für sichere Begleitung wichtig ist">{submission.safeSupport}</ReadField>
                            <ReadField label="Ressourcen">{submission.resources}</ReadField>
                            <ReadField label="Ansprechperson/Anlaufstelle in Krise" accent={submission.crisisContact !== "ja"}>{submission.crisisContact}</ReadField>
                            <ReadField label="Anonyme Gesamtauswertung">{submission.aggregateConsent ? "eingewilligt" : "nicht eingewilligt"}</ReadField>
                        </dl>
                    </section>

                    <section className="mt-7 rounded-3xl bg-[#e4f2ef] p-5 sm:p-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-[#075f62]"><ClipboardCheck className="h-5 w-5" /> Vorbereitung des Startgesprächs</h3>
                        <label className="mt-4 block text-sm font-bold">Interne Notiz
                            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={2500} className="mt-2 w-full resize-y rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/20" placeholder="Zum Beispiel: Hypothese, Rückfrage oder Schwerpunkt für das Gespräch …" />
                        </label>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" disabled={busy} onClick={() => action("vorbereitet")} className="rounded-full bg-[#0f8b8d] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">Als vorbereitet markieren</button>
                            <button type="button" disabled={busy} onClick={() => action("rueckfrage")} className="rounded-full border border-amber-400 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-900 disabled:opacity-50">Rückfrage nötig</button>
                            <button type="button" disabled={busy} onClick={() => action("abgeschlossen")} className="rounded-full border border-emerald-400 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 disabled:opacity-50">Gespräch abgeschlossen</button>
                        </div>
                        {submission.reviewedAt && <p className="mt-3 text-xs text-[#648082]">Zuletzt bearbeitet: {formatDate(submission.reviewedAt)}{submission.reviewedBy ? ` von ${submission.reviewedBy}` : ""}</p>}
                    </section>
                </div>
            </details>
        </article>
    );
};

export const AdminOnboarding = ({ requestJson, setNotice }) => {
    const [submissions, setSubmissions] = useState([]);
    const [state, setState] = useState("loading");
    const [filter, setFilter] = useState("offen");

    const load = async () => {
        setState("loading");
        try {
            const result = await requestJson("/api/admin/onboarding");
            setSubmissions(result.submissions || []);
            setState("ready");
        } catch {
            setState("error");
        }
    };

    useEffect(() => {
        let active = true;
        requestJson("/api/admin/onboarding")
            .then((result) => {
                if (!active) return;
                setSubmissions(result.submissions || []);
                setState("ready");
            })
            .catch(() => active && setState("error"));
        return () => { active = false; };
    }, [requestJson]);

    const stats = useMemo(() => ({
        total: submissions.length,
        new: submissions.filter((item) => item.reviewStatus === "neu").length,
        attention: submissions.filter((item) => item.stability !== "ja" || item.crisisContact !== "ja").length,
        completed: submissions.filter((item) => item.reviewStatus === "abgeschlossen").length,
    }), [submissions]);

    const visible = submissions.filter((item) => {
        if (filter === "alle") return true;
        if (filter === "hinweis") return item.stability !== "ja" || item.crisisContact !== "ja";
        if (filter === "abgeschlossen") return item.reviewStatus === "abgeschlossen";
        return item.reviewStatus !== "abgeschlossen";
    });

    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] bg-[#075f62] p-7 text-white shadow-xl sm:p-9">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e8ca67]">Zepter-Pilot</p><h1 className="mt-2 text-4xl font-bold">Startfragebögen</h1><p className="mt-3 max-w-2xl leading-7 text-white/75">Vertrauliche Vorbereitung für eure gemeinsamen Startgespräche. Hinweise ersetzen keine persönliche Einschätzung.</p></div>
                    <button type="button" onClick={load} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 px-5 font-bold text-white hover:bg-white/10"><RefreshCw className="h-4 w-4" /> Aktualisieren</button>
                </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[[UserRound, stats.total, "eingegangen"], [Clock3, stats.new, "neu"], [ShieldAlert, stats.attention, "vor Gespräch prüfen"], [CheckCircle2, stats.completed, "Gespräche abgeschlossen"]].map(([icon, value, label]) => <article key={label} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm">{createElement(icon, { className: "h-6 w-6 text-[#0f8b8d]" })}<strong className="mt-4 block text-3xl">{value}</strong><span className="mt-1 block text-sm text-[#648082]">{label}</span></article>)}
            </div>

            <div className="flex flex-wrap gap-2 rounded-3xl bg-[#fffaf2] p-3">
                {[["offen", "Offen"], ["hinweis", "Mit Hinweis"], ["abgeschlossen", "Abgeschlossen"], ["alle", "Alle"]].map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-sm font-bold ${filter === value ? "bg-[#0f8b8d] text-white" : "text-[#557274] hover:bg-[#eaf4f1]"}`}>{label}</button>)}
            </div>

            {state === "loading" && <div className="rounded-3xl bg-[#fffaf2] p-8 font-bold text-[#0f8b8d]">Fragebögen werden geladen …</div>}
            {state === "error" && <div className="rounded-3xl bg-red-50 p-8 font-bold text-red-800">Die Fragebögen konnten nicht geladen werden.</div>}
            {state === "ready" && visible.length === 0 && <div className="rounded-3xl bg-[#fffaf2] p-8 text-center text-[#648082]">In dieser Ansicht gibt es noch keine Fragebögen.</div>}
            {state === "ready" && <div className="space-y-4">{visible.map((submission) => <SubmissionCard key={submission.id} submission={submission} requestJson={requestJson} onUpdated={setSubmissions} setNotice={setNotice} />)}</div>}
        </div>
    );
};
