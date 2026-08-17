import {
    BadgeDollarSign,
    Bot,
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    CircleDashed,
    FileCheck2,
    FlaskConical,
    LockKeyhole,
    Play,
    Save,
    ShieldCheck,
    Sparkles,
    UsersRound,
    XCircle,
} from "lucide-react";
import { createElement, useCallback, useEffect, useMemo, useState } from "react";

const emptyPilotWeek = {
    weekNumber: "1",
    participantCount: "",
    plannedFocus: "",
    actualFocus: "",
    commonQuestions: "",
    helpfulExercises: "",
    challenges: "",
    observedChanges: "",
    professionalInsights: "",
    nextAdjustments: "",
    anonymizationConfirmed: false,
};

const fieldDefinitions = [
    ["plannedFocus", "Geplanter Schwerpunkt", "Was war für diese Woche vorgesehen?", true],
    ["actualFocus", "Tatsächlich bearbeiteter Schwerpunkt", "Was stand in der gemeinsamen Arbeit wirklich im Vordergrund?", true],
    ["commonQuestions", "Häufige Fragen", "Eine anonymisierte Frage pro Zeile."],
    ["helpfulExercises", "Hilfreiche Übungen", "Was wurde als hilfreich erlebt oder beobachtet?"],
    ["challenges", "Schwierigkeiten oder Überforderung", "Wo stockte die Umsetzung? Keine Namen oder Kontaktdaten eintragen."],
    ["observedChanges", "Beobachtete Veränderungen", "Nur konkrete Beobachtungen, keine allgemeinen Wirkungsversprechen."],
    ["professionalInsights", "Fachliche Erkenntnisse", "Was habt ihr als Begleiterinnen gelernt?"],
    ["nextAdjustments", "Anpassungen für die nächste Woche", "Eine konkrete Anpassung pro Zeile."],
];

const viewOptions = [
    ["overview", "Übersicht", BrainCircuit],
    ["pilot", "Pilotwochen", FileCheck2],
    ["runs", "Prüfläufe", CircleDashed],
    ["agents", "Agenten", Bot],
];

const dateTime = (value) => value
    ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "";

const money = (value) => new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
}).format(Number(value || 0));

const resultList = (title, items) => Array.isArray(items) && items.length > 0 ? (
    <section>
        <h4 className="font-bold text-[#173f40]">{title}</h4>
        <ul className="mt-2 space-y-2 text-sm leading-6 text-[#4e6d6e]">
            {items.map((item) => <li key={typeof item === "string" ? item : JSON.stringify(item)} className="flex gap-2"><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#0f8b8d]" /><span>{String(item)}</span></li>)}
        </ul>
    </section>
) : null;

const resultSources = (sources) => Array.isArray(sources) && sources.length > 0 ? (
    <section className="lg:col-span-2">
        <h4 className="font-bold text-[#173f40]">Geprüfte Quellen</h4>
        <div className="mt-2 grid gap-3 lg:grid-cols-2">
            {sources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#0f8b8d]/15 bg-white p-4 text-sm hover:border-[#0f8b8d]/40">
                    <strong className="text-[#075f62]">{source.title}</strong>
                    <span className="mt-1 block leading-6 text-[#6b8585]">{source.note}</span>
                </a>
            ))}
        </div>
    </section>
) : null;

const RunResult = ({ result }) => (
    <div className="grid gap-5 lg:grid-cols-2">
        {resultList("Beobachtungen", result.signals)}
        {resultList("Empfohlene Anpassungen", result.recommendedAdjustments)}
        {resultList("Interne Contentansätze", result.contentIdeas)}
        {resultList("Prüfhinweise", result.reviewNotes)}
        {resultList("Offene Entscheidungen", result.openDecisions)}
        {resultSources(result.sources)}
        {Array.isArray(result.programBlueprint) && (
            <section className="lg:col-span-2">
                <h4 className="font-bold text-[#173f40]">12-Wochen-Arbeitsentwurf</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {result.programBlueprint.map((week) => (
                        <article key={week.weekNumber} className="rounded-2xl border border-[#0f8b8d]/15 bg-white p-4">
                            <div className="flex items-center justify-between gap-3">
                                <strong>Woche {week.weekNumber}</strong>
                                <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${week.sourceStatus === "pilot-data" ? "bg-emerald-100 text-emerald-800" : week.sourceStatus === "missing" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>{week.sourceStatus === "pilot-data" ? "Pilotdaten" : week.sourceStatus === "missing" ? "noch offen" : "Hypothese"}</span>
                            </div>
                            <p className="mt-2 font-semibold text-[#075f62]">{week.title}</p>
                            <p className="mt-2 text-sm leading-6 text-[#6b8585]">{week.basis}</p>
                        </article>
                    ))}
                </div>
            </section>
        )}
    </div>
);

export const AdminAiCommandCenter = ({ requestJson, setNotice }) => {
    const [state, setState] = useState("loading");
    const [commandCenter, setCommandCenter] = useState(null);
    const [activeView, setActiveView] = useState("overview");
    const [pilotWeek, setPilotWeek] = useState(emptyPilotWeek);
    const [busy, setBusy] = useState("");
    const [decisionNotes, setDecisionNotes] = useState({});
    const [budget, setBudget] = useState({ monthlyBudgetUsd: "15", perRunBudgetUsd: "2" });

    const applySnapshot = useCallback((snapshot) => {
        setCommandCenter(snapshot);
        if (snapshot?.settings) {
            setBudget({
                monthlyBudgetUsd: String(snapshot.settings.monthlyBudgetUsd),
                perRunBudgetUsd: String(snapshot.settings.perRunBudgetUsd),
            });
        }
        setState("ready");
    }, []);

    useEffect(() => {
        let active = true;
        requestJson("/api/admin/ai-command-center")
            .then((result) => active && applySnapshot(result.commandCenter))
            .catch(() => active && setState("error"));
        return () => { active = false; };
    }, [applySnapshot, requestJson]);

    const pendingRuns = useMemo(() => commandCenter?.runs.filter((run) => run.approvalStatus === "pending") || [], [commandCenter]);

    const describeError = (error) => {
        if (String(error.reason || "").startsWith("personal_data_")) {
            return "Der Eintrag enthält offenbar eine E-Mail-Adresse, Telefonnummer oder IBAN. Bitte anonymisieren und erneut speichern.";
        }
        if (error.code === "pilot_weeks_required") return "Erfasse zuerst mindestens eine anonymisierte Pilotwoche.";
        if (error.code === "ai_not_configured") return "Die Live-KI ist noch nicht aktiviert. Der OpenAI-Projektschlüssel muss zuerst sicher auf dem Server hinterlegt werden.";
        if (error.code === "ai_budget_exceeded") return "Der Auftrag würde eine gespeicherte Budgetgrenze überschreiten. Passe die Grenze erst nach bewusster Freigabe an.";
        if (error.code === "ai_provider_unavailable") return "OpenAI war nicht erreichbar oder hat den Auftrag nicht vollständig beantwortet. Ein möglicherweise angefallener Teilbetrag bleibt im Kostenprotokoll sichtbar.";
        return "Der Auftrag konnte nicht gespeichert werden. Bitte prüfe die Eingaben.";
    };

    const submitPilotWeek = async (event) => {
        event.preventDefault();
        setBusy("pilot");
        setNotice(null);
        try {
            const result = await requestJson("/api/admin/ai-command-center/pilot-weeks", {
                method: "POST",
                body: JSON.stringify({
                    ...pilotWeek,
                    weekNumber: Number(pilotWeek.weekNumber),
                    participantCount: Number(pilotWeek.participantCount),
                }),
            });
            applySnapshot(result.commandCenter);
            setPilotWeek((current) => ({ ...emptyPilotWeek, weekNumber: current.weekNumber }));
            setActiveView("runs");
            const latestRun = result.commandCenter.runs[0];
            setNotice({ type: "success", text: latestRun?.mode === "live"
                ? `Die Pilotwoche wurde gespeichert und von der Live-KI geprüft. Kosten: ${money(latestRun.actualCostUsd)}. Nichts wurde veröffentlicht.`
                : "Die anonymisierte Pilotwoche wurde gespeichert und im Mock-Modus durch die Prüfkette geführt. Nichts wurde veröffentlicht." });
        } catch (error) {
            setNotice({ type: "error", text: describeError(error) });
        } finally {
            setBusy("");
        }
    };

    const editPilotWeek = (week) => {
        setPilotWeek({ ...week, weekNumber: String(week.weekNumber), participantCount: String(week.participantCount) });
        setActiveView("pilot");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const startCoreProduct = async () => {
        setBusy("core-product");
        setNotice(null);
        try {
            const result = await requestJson("/api/admin/ai-command-center/runs", {
                method: "POST",
                body: JSON.stringify({ workflowId: "core-product-development" }),
            });
            applySnapshot(result.commandCenter);
            setActiveView("runs");
            const latestRun = result.commandCenter.runs[0];
            setNotice({ type: "success", text: `Der interne 12-Wochen-Arbeitsentwurf wurde erstellt. Kosten: ${money(latestRun?.actualCostUsd)}. Er wartet auf menschliche Prüfung und wurde nicht veröffentlicht.` });
        } catch (error) {
            setNotice({ type: "error", text: describeError(error) });
        } finally {
            setBusy("");
        }
    };

    const decideRun = async (runId, approved) => {
        setBusy(`decision-${runId}`);
        setNotice(null);
        try {
            const result = await requestJson(`/api/admin/ai-command-center/runs/${runId}/decision`, {
                method: "PUT",
                body: JSON.stringify({ approved, note: decisionNotes[runId] || "" }),
            });
            applySnapshot(result.commandCenter);
            setNotice({ type: "success", text: approved ? "Der Arbeitsstand ist intern freigegeben. Es wurde keine Außenaktion ausgelöst." : "Der Arbeitsstand wurde abgelehnt und bleibt im Prüfprotokoll erhalten." });
        } catch {
            setNotice({ type: "error", text: approved ? "Die Entscheidung konnte nicht gespeichert werden." : "Bitte begründe die Ablehnung kurz." });
        } finally {
            setBusy("");
        }
    };

    const saveBudget = async (event) => {
        event.preventDefault();
        setBusy("budget");
        setNotice(null);
        try {
            const result = await requestJson("/api/admin/ai-command-center/settings", {
                method: "PUT",
                body: JSON.stringify({
                    monthlyBudgetUsd: Number(budget.monthlyBudgetUsd),
                    perRunBudgetUsd: Number(budget.perRunBudgetUsd),
                }),
            });
            applySnapshot(result.commandCenter);
            setNotice({ type: "success", text: result.commandCenter.settings.mode === "live"
                ? "Die Budgetgrenzen wurden gespeichert und gelten vor jedem kostenpflichtigen Auftrag."
                : "Die Budgetgrenzen wurden gespeichert. Der aktuelle Mock-Modus verursacht weiterhin keine Modellkosten." });
        } catch {
            setNotice({ type: "error", text: "Die Budgetgrenzen sind ungültig oder konnten nicht gespeichert werden." });
        } finally {
            setBusy("");
        }
    };

    if (state === "loading") return <div className="rounded-3xl bg-[#fffaf2] p-8 font-bold text-[#0f8b8d]">KI-Zentrale wird geladen …</div>;
    if (state === "error") return <div className="rounded-3xl bg-red-50 p-8 font-bold text-red-800">Die KI-Zentrale konnte nicht geladen werden.</div>;

    const { agents, workflows, settings, pilotWeeks, runs } = commandCenter;
    const liveMode = settings.mode === "live";
    const liveReady = liveMode && settings.configurationStatus === "ready";
    const runCostLabel = `${money(settings.typicalRunCostUsd?.min)}–${money(settings.typicalRunCostUsd?.max)}`;

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] bg-[#075f62] p-7 text-white shadow-xl sm:p-9">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#e8ca67]"><Sparkles className="h-4 w-4" /> Spirit Healing AI Command Center</p>
                        <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight">Interne Arbeitsaufträge mit fester Prüfung und menschlicher Entscheidung.</h1>
                        <p className="mt-4 max-w-3xl leading-7 text-white/80">{liveReady ? "Die KI erstellt und prüft echte interne Arbeitsstände aus anonymisierten Angaben. Jede Ausgabe bleibt bis zu deiner Entscheidung intern." : "Diese Stufe arbeitet ausschließlich mit gespeicherten, anonymisierten Angaben. Sie veröffentlicht nichts, schreibt niemanden an und verändert keine Live-Seite."}</p>
                    </div>
                    <div className="shrink-0 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
                        <p className="flex items-center gap-2 font-bold text-[#e8ca67]">{liveReady ? <Sparkles className="h-5 w-5" /> : <FlaskConical className="h-5 w-5" />}{liveReady ? "Live-KI bereit" : liveMode ? "API-Schlüssel fehlt" : "Mock-Modus aktiv"}</p>
                        <p className="mt-2 text-white/75">Diesen Monat: {money(settings.spentThisMonthUsd)} von {money(settings.monthlyBudgetUsd)}</p>
                        <p className="text-white/75">Typischer Auftrag: {runCostLabel}</p>
                        <p className="text-white/75">Außenaktionen: gesperrt</p>
                    </div>
                </div>
            </section>

            <nav className="grid gap-2 rounded-3xl bg-[#fffaf2] p-3 shadow-sm sm:grid-cols-4">
                {viewOptions.map(([id, label, icon]) => (
                    <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 font-bold transition ${activeView === id ? "bg-[#0f8b8d] text-white" : "text-[#4e6d6e] hover:bg-[#eaf4f1]"}`}>{createElement(icon, { className: "h-5 w-5" })}{label}</button>
                ))}
            </nav>

            {activeView === "overview" && (
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            [Bot, agents.length, "klar begrenzte Agenten"],
                            [FileCheck2, pilotWeeks.length, "von 8 Pilotwochen erfasst"],
                            [CircleDashed, pendingRuns.length, "Ergebnisse warten auf Prüfung"],
                            [LockKeyhole, "Aus", "externe Aktionen"],
                        ].map(([icon, value, label]) => (
                            <article key={label} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm">{createElement(icon, { className: "h-6 w-6 text-[#0f8b8d]" })}<strong className="mt-4 block text-3xl">{value}</strong><span className="mt-1 block text-sm text-[#6b8585]">{label}</span></article>
                        ))}
                    </div>

                    <section className="rounded-3xl bg-[#fffaf2] p-6 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div><h2 className="text-2xl font-bold">12-Wochen-Kernprodukt</h2><p className="mt-2 max-w-3xl leading-7 text-[#6b8585]">Aus allen gespeicherten Pilotwochen entsteht ein interner Arbeitsentwurf. Fehlende Wochen und reine Hypothesen bleiben sichtbar gekennzeichnet.</p></div>
                            <button type="button" onClick={startCoreProduct} disabled={busy === "core-product" || pilotWeeks.length === 0 || (liveMode && !liveReady)} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-6 font-bold text-white hover:bg-[#0a6f71] disabled:cursor-not-allowed disabled:opacity-40"><Play className="h-5 w-5" />{busy === "core-product" ? "Arbeitsentwurf läuft …" : liveReady ? `Live-Entwurf starten (typisch ${runCostLabel})` : "Arbeitsentwurf erstellen"}</button>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            {workflows.find((workflow) => workflow.id === "core-product-development")?.steps.map((agentId, index) => {
                                const agent = agents.find((item) => item.id === agentId);
                                return <div key={`${agentId}-${index}`} className="flex items-center gap-2"><span className="rounded-full bg-[#eaf4f1] px-3 py-2 text-xs font-bold text-[#075f62]">{agent?.name}</span>{index < 8 && <ChevronRight className="h-4 w-4 text-[#8aa1a1]" />}</div>;
                            })}
                        </div>
                    </section>

                    <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-3xl border border-[#0f8b8d]/15 bg-white p-6">
                            <h2 className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="h-6 w-6 text-[#0f8b8d]" /> Sicherheitsgrenzen</h2>
                            <ul className="mt-4 space-y-3 leading-7 text-[#4e6d6e]">
                                <li>Direkt erkennbare E-Mail-Adressen, internationale Telefonnummern und IBANs werden blockiert.</li>
                                <li>Jeder Eintrag verlangt eine ausdrückliche Bestätigung der Anonymisierung.</li>
                                <li>Ergebnisse bleiben intern und warten auf Freigabe oder Ablehnung.</li>
                                <li>Website, E-Mail, Social Media, Canva, Metricool und Zahlungen sind nicht angeschlossen.</li>
                            </ul>
                        </div>
                        <form onSubmit={saveBudget} className="rounded-3xl bg-[#fffaf2] p-6 shadow-sm">
                            <h2 className="flex items-center gap-2 text-xl font-bold"><BadgeDollarSign className="h-6 w-6 text-[#0f8b8d]" /> Budgetbremse</h2>
                            <p className="mt-2 text-sm leading-6 text-[#6b8585]">{liveMode ? `Vor jedem Auftrag wird ein Betrag reserviert. Erwartet werden meist ${runCostLabel}; die harte Grenze gilt trotzdem.` : "Die Grenzen sind für die Live-Anbindung vorbereitet. Im Mock-Modus bleiben tatsächliche Modellkosten bei 0."}</p>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <label className="text-sm font-bold">Monatliches Maximum (USD)<input type="number" min="0" max="5000" step="0.01" value={budget.monthlyBudgetUsd} onChange={(event) => setBudget((current) => ({ ...current, monthlyBudgetUsd: event.target.value }))} className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-4 outline-none focus:border-[#0f8b8d]" /></label>
                                <label className="text-sm font-bold">Maximum pro Auftrag (USD)<input type="number" min="0" max="500" step="0.01" value={budget.perRunBudgetUsd} onChange={(event) => setBudget((current) => ({ ...current, perRunBudgetUsd: event.target.value }))} className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-4 outline-none focus:border-[#0f8b8d]" /></label>
                            </div>
                            <button type="submit" disabled={busy === "budget"} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0f8b8d]/40 px-5 font-bold text-[#0f8b8d] hover:bg-[#eaf4f1] disabled:opacity-50"><Save className="h-4 w-4" /> Grenzen speichern</button>
                        </form>
                    </section>
                </div>
            )}

            {activeView === "pilot" && (
                <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
                    <form onSubmit={submitPilotWeek} className="rounded-3xl bg-[#fffaf2] p-6 shadow-sm sm:p-8">
                        <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0f8b8d]">Lernschleife</p><h2 className="mt-2 text-3xl font-bold">Pilotwoche erfassen</h2><p className="mt-2 leading-7 text-[#6b8585]">Der Speichervorgang startet die interne Prüfkette. {liveReady ? `Mit dem Klick bestätigst du einen kostenpflichtigen KI-Auftrag innerhalb der Grenze von ${money(settings.perRunBudgetUsd)}.` : "Im Mock-Modus entstehen keine Modellkosten."}</p></div>
                        <div className="mt-7 grid gap-5 sm:grid-cols-2">
                            <label className="text-sm font-bold">Woche<select value={pilotWeek.weekNumber} onChange={(event) => setPilotWeek((current) => ({ ...current, weekNumber: event.target.value }))} className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-4 outline-none focus:border-[#0f8b8d]">{Array.from({ length: 8 }, (_item, index) => <option key={index + 1} value={index + 1}>Woche {index + 1}</option>)}</select></label>
                            <label className="text-sm font-bold">Teilnehmerzahl<input type="number" min="1" max="500" required value={pilotWeek.participantCount} onChange={(event) => setPilotWeek((current) => ({ ...current, participantCount: event.target.value }))} className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-4 outline-none focus:border-[#0f8b8d]" /></label>
                        </div>
                        <div className="mt-6 grid gap-5 xl:grid-cols-2">
                            {fieldDefinitions.map(([key, label, help, required]) => (
                                <label key={key} className="block text-sm font-bold">{label}{required && <span className="text-red-700"> *</span>}<span className="mt-1 block font-normal leading-5 text-[#6b8585]">{help}</span><textarea required={required} rows={4} maxLength={8000} value={pilotWeek[key]} onChange={(event) => setPilotWeek((current) => ({ ...current, [key]: event.target.value }))} className="mt-2 w-full resize-y rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/15" /></label>
                            ))}
                        </div>
                        <label className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><input type="checkbox" required checked={pilotWeek.anonymizationConfirmed} onChange={(event) => setPilotWeek((current) => ({ ...current, anonymizationConfirmed: event.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-[#0f8b8d]" /><span><strong className="block">Anonymisierung bestätigt</strong>Der Eintrag enthält keine Namen, E-Mail-Adressen, Telefonnummern, Adressen, Kontodaten oder andere Angaben, durch die Teilnehmende erkennbar werden.</span></label>
                        <button type="submit" disabled={busy === "pilot" || (liveMode && !liveReady)} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-7 font-bold text-white hover:bg-[#0a6f71] disabled:opacity-50"><Play className="h-5 w-5" />{busy === "pilot" ? "Speichern und prüfen …" : liveReady ? `Speichern und Live-Prüfung starten (typisch ${runCostLabel})` : "Speichern und Prüfkette starten"}</button>
                    </form>
                    <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm 2xl:sticky 2xl:top-6">
                        <h3 className="font-bold">Gespeicherte Wochen</h3>
                        <div className="mt-4 space-y-2">
                            {pilotWeeks.map((week) => <button key={week.id} type="button" onClick={() => editPilotWeek(week)} className="w-full rounded-2xl border border-[#0f8b8d]/15 p-4 text-left hover:bg-[#eaf4f1]"><strong>Woche {week.weekNumber}</strong><span className="mt-1 block text-sm text-[#6b8585]">{week.actualFocus}</span></button>)}
                            {pilotWeeks.length === 0 && <p className="rounded-2xl bg-[#eaf4f1] p-4 text-sm leading-6 text-[#6b8585]">Noch keine Pilotwoche gespeichert.</p>}
                        </div>
                    </aside>
                </div>
            )}

            {activeView === "runs" && (
                <div className="space-y-5">
                    <div className="rounded-3xl bg-[#fffaf2] p-6"><h2 className="text-3xl font-bold">Prüfläufe und Entscheidungen</h2><p className="mt-2 leading-7 text-[#6b8585]">Jeder Lauf zeigt Übergaben, Ergebnis, Kosten und Freigabestatus. Eine interne Freigabe löst weiterhin keine Veröffentlichung aus.</p></div>
                    {runs.map((run) => (
                        <article key={run.id} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm sm:p-7">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f8b8d]">Auftrag #{run.id} · {run.mode === "mock" ? "Mock-Modus" : "Live-KI"}</p><h3 className="mt-2 text-2xl font-bold">{run.result.title || run.workflowName}</h3><p className="mt-2 max-w-4xl leading-7 text-[#6b8585]">{run.result.executiveSummary}</p><p className="mt-2 text-xs text-[#789091]">Abgeschlossen {dateTime(run.completedAt)} · geschätzt {money(run.estimatedCostUsd)} · tatsächlich {money(run.actualCostUsd)}</p>{run.status === "failed" && <p className="mt-2 text-sm font-semibold text-red-800">Der Auftrag wurde nicht vollständig abgeschlossen. Bitte später erneut starten.</p>}</div>
                                <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${run.status === "failed" ? "bg-red-100 text-red-800" : run.approvalStatus === "approved" ? "bg-emerald-100 text-emerald-800" : run.approvalStatus === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{run.status === "failed" || run.approvalStatus === "rejected" ? <XCircle className="h-4 w-4" /> : run.approvalStatus === "approved" ? <CheckCircle2 className="h-4 w-4" /> : <CircleDashed className="h-4 w-4" />}{run.status === "failed" ? "nicht abgeschlossen" : run.approvalStatus === "approved" ? "intern freigegeben" : run.approvalStatus === "rejected" ? "abgelehnt" : "Prüfung offen"}</span>
                            </div>
                            <details className="mt-6 rounded-2xl border border-[#0f8b8d]/15 bg-white p-4">
                                <summary className="cursor-pointer font-bold text-[#075f62]">Agentenkette anzeigen ({run.steps.length} Schritte)</summary>
                                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                    {run.steps.map((step, index) => <div key={step.id} className="flex gap-3 rounded-2xl bg-[#eaf4f1] p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f8b8d] text-sm font-bold text-white">{index + 1}</span><div><strong>{step.agentName}</strong><span className="ml-2 text-xs text-[#6b8585]">{step.provider}</span><p className="mt-1 text-sm leading-6 text-[#4e6d6e]">{step.summary}</p>{step.inputFrom.length > 0 && <p className="mt-1 text-xs text-[#789091]">übernimmt: {step.inputFrom.join(", ")}</p>}</div></div>)}
                                </div>
                            </details>
                            <details className="mt-3 rounded-2xl border border-[#0f8b8d]/15 bg-white p-4" open={run.approvalStatus === "pending"}>
                                <summary className="cursor-pointer font-bold text-[#075f62]">Ergebnis prüfen</summary>
                                <div className="mt-5"><RunResult result={run.result} /></div>
                            </details>
                            {run.status === "completed" && run.approvalStatus === "pending" ? (
                                <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4">
                                    <label className="block text-sm font-bold text-amber-950">Prüfnotiz<textarea rows={2} maxLength={2000} value={decisionNotes[run.id] || ""} onChange={(event) => setDecisionNotes((current) => ({ ...current, [run.id]: event.target.value }))} placeholder="Bei Ablehnung bitte kurz begründen." className="mt-2 w-full rounded-xl border border-amber-300 bg-white px-4 py-3 font-normal outline-none focus:border-[#0f8b8d]" /></label>
                                    <div className="mt-3 flex flex-col gap-2 sm:flex-row"><button type="button" onClick={() => decideRun(run.id, true)} disabled={busy === `decision-${run.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-5 font-bold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4" /> Intern freigeben</button><button type="button" onClick={() => decideRun(run.id, false)} disabled={busy === `decision-${run.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-5 font-bold text-red-800 disabled:opacity-50"><XCircle className="h-4 w-4" /> Ablehnen</button></div>
                                </div>
                            ) : run.decisionNote && <p className="mt-4 rounded-2xl bg-[#eaf4f1] p-4 text-sm leading-6"><strong>Prüfnotiz:</strong> {run.decisionNote}</p>}
                        </article>
                    ))}
                    {runs.length === 0 && <div className="rounded-3xl bg-[#fffaf2] p-8 text-center text-[#6b8585]">Noch kein Prüflauf vorhanden.</div>}
                </div>
            )}

            {activeView === "agents" && (
                <div>
                    <div className="rounded-3xl bg-[#fffaf2] p-6"><h2 className="text-3xl font-bold">Agenten und Grenzen</h2><p className="mt-2 leading-7 text-[#6b8585]">{liveReady ? `Routinearbeiten laufen über ${settings.routineModel}; Prüfung, Datenschutz und Qualitätskontrolle über ${settings.reviewModel}.` : "Im aktuellen Mock-Modus werden die Rollen ohne kostenpflichtige Modellaufrufe ausgeführt."}</p></div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {agents.map((agent) => <article key={agent.id} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf4f1] text-[#0f8b8d]"><UsersRound className="h-5 w-5" /></span><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#6b8585]">{agent.provider}</span></div><p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#0f8b8d]">{agent.area}</p><h3 className="mt-1 text-xl font-bold">{agent.name}</h3><p className="mt-2 leading-7 text-[#6b8585]">{agent.purpose}</p></article>)}
                    </div>
                </div>
            )}
        </div>
    );
};
