import {
    BadgeDollarSign,
    BookOpenCheck,
    Bot,
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    CircleDashed,
    CalendarCheck2,
    FileCheck2,
    FlaskConical,
    Image,
    Play,
    Save,
    ShieldCheck,
    Sparkles,
    UsersRound,
    Workflow,
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

const emptyContentBrief = {
    projectName: "",
    goal: "",
    audience: "",
    coreMessage: "",
    offer: "",
    callToAction: "",
    tone: "warm, klar, respektvoll und bodenständig",
    constraints: "Keine Diagnosen, Heilversprechen oder erfundenen Erfahrungsberichte.",
    channels: ["instagram", "facebook"],
    anonymizationConfirmed: false,
};

const emptyTeamMeeting = {
    meetingDate: new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" }),
    dayPriorities: "",
    weekPriorities: "",
    monthPriorities: "",
    currentSignals: "",
    openDecisions: "",
    constraints: "",
    anonymizationConfirmed: false,
};

const emptyKnowledge = {
    category: "unternehmen",
    title: "",
    content: "",
    sourceNote: "",
    confirmed: false,
};

const contentChannels = [
    ["instagram", "Instagram"],
    ["facebook", "Facebook"],
    ["tiktok", "TikTok"],
    ["whatsapp", "WhatsApp"],
    ["youtube", "YouTube"],
    ["linkedin", "LinkedIn"],
    ["newsletter", "Newsletter"],
    ["blog", "Blog"],
];

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
    ["meeting", "Team-Meeting", CalendarCheck2],
    ["projects", "Projekte", Sparkles],
    ["learning", "Wissen & Lernen", BookOpenCheck],
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

const preciseMoney = (value) => new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
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

const RunResult = ({ result, run, assets, settings, onImageDraft, busy }) => (
    <div className="grid gap-5 lg:grid-cols-2">
        {Array.isArray(result.assignments) && result.assignments.length > 0 && (
            <section className="lg:col-span-2">
                <h4 className="font-bold text-[#173f40]">Arbeitsverteilung</h4>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    {result.assignments.map((assignment, index) => (
                        <article key={`${assignment.agentId}-${index}`} className="rounded-2xl border border-[#0f8b8d]/15 bg-white p-4">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                                <span className="rounded-full bg-[#eaf4f1] px-3 py-1 text-[#075f62]">{assignment.owner}</span>
                                <span className="rounded-full bg-[#fff4d8] px-3 py-1 text-[#795800]">{assignment.horizon}</span>
                                <span className="rounded-full bg-white px-3 py-1 text-[#6b8585]">{assignment.priority}</span>
                            </div>
                            <p className="mt-3 font-semibold text-[#173f40]">{assignment.task}</p>
                            <p className="mt-2 text-sm leading-6 text-[#6b8585]"><strong>Fertig, wenn:</strong> {assignment.doneWhen}</p>
                            <p className="mt-1 text-sm leading-6 text-[#6b8585]"><strong>Abhängigkeit:</strong> {assignment.dependsOn}</p>
                        </article>
                    ))}
                </div>
            </section>
        )}
        {result.contentPackage && (
            <section className="space-y-5 lg:col-span-2">
                <div className="rounded-2xl border border-[#0f8b8d]/15 bg-white p-5">
                    <h4 className="text-xl font-bold text-[#173f40]">{result.contentPackage.projectName}</h4>
                    <p className="mt-2 leading-7 text-[#4e6d6e]">{result.contentPackage.campaignIdea}</p>
                    <p className="mt-3 text-sm leading-6 text-[#6b8585]"><strong>Zielgruppe:</strong> {result.contentPackage.audienceSummary}</p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    {result.contentPackage.pieces?.map((piece, index) => (
                        <article key={`${piece.channel}-${index}`} className="rounded-2xl border border-[#0f8b8d]/15 bg-white p-5">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0f8b8d]">{piece.channel} · {piece.format}</p>
                            <h5 className="mt-3 font-bold text-[#173f40]">{piece.hook}</h5>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#4e6d6e]">{piece.caption}</p>
                            <p className="mt-3 rounded-xl bg-[#eaf4f1] p-3 text-sm"><strong>Handlungsaufruf:</strong> {piece.callToAction}</p>
                        </article>
                    ))}
                </div>
                <div>
                    <h4 className="font-bold text-[#173f40]">Bildentwürfe</h4>
                    <div className="mt-3 grid gap-4 lg:grid-cols-2">
                        {result.contentPackage.imageBriefs?.map((brief, index) => {
                            const generated = assets.find((asset) => asset.sourceRunId === run.id && asset.briefIndex === index && asset.status === "completed");
                            return (
                                <article key={`${brief.title}-${index}`} className="rounded-2xl border border-[#0f8b8d]/15 bg-white p-5">
                                    {generated && <img src={generated.imageUrl} alt={brief.title} className="mb-4 aspect-[2/3] w-full rounded-2xl object-cover" />}
                                    <h5 className="font-bold text-[#173f40]">{brief.title}</h5>
                                    <p className="mt-2 text-sm leading-6 text-[#6b8585]">{brief.purpose}</p>
                                    {!generated && run.approvalStatus === "approved" && (
                                        <button type="button" onClick={() => onImageDraft(run.id, index)} disabled={busy === `image-${run.id}-${index}` || !settings.imageGenerationReady} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-5 font-bold text-white disabled:opacity-40">
                                            <Image className="h-4 w-4" />{busy === `image-${run.id}-${index}` ? "Bild wird erstellt …" : `Bildentwurf erstellen (ca. ${preciseMoney(settings.imageDraftOutputCostUsd)})`}
                                        </button>
                                    )}
                                    {!generated && run.approvalStatus !== "approved" && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Zuerst das Textpaket intern freigeben.</p>}
                                </article>
                            );
                        })}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#6b8585]">Nach der Bildauswahl ist das Paket für das Canva-Markenlayout vorbereitet. Dabei wird noch nichts veröffentlicht.</p>
                </div>
            </section>
        )}
        {resultList("Beobachtungen", result.signals)}
        {resultList("Empfohlene Anpassungen", result.recommendedAdjustments)}
        {resultList("Interne Contentansätze", result.contentIdeas)}
        {resultList("Prüfhinweise", result.reviewNotes)}
        {resultList("Offene Entscheidungen", result.openDecisions)}
        {Array.isArray(result.learningProposals) && result.learningProposals.length > 0 && (
            <section className="lg:col-span-2">
                <h4 className="font-bold text-[#173f40]">Lernvorschläge</h4>
                <p className="mt-1 text-sm leading-6 text-[#6b8585]">Nach Freigabe dieses Arbeitsstands erscheinen sie als Kandidaten. Erst eine zweite Entscheidung macht daraus eine aktive, versionierte Arbeitsregel.</p>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    {result.learningProposals.map((proposal, index) => (
                        <article key={`${proposal.agentId}-${index}`} className="rounded-2xl border border-[#0f8b8d]/15 bg-white p-4 text-sm leading-6">
                            <strong className="text-[#075f62]">{proposal.agentId} · Risiko {proposal.riskLevel}</strong>
                            <p className="mt-2"><strong>Beobachtung:</strong> {proposal.observation}</p>
                            <p className="mt-1"><strong>Änderung:</strong> {proposal.proposedChange}</p>
                            <p className="mt-1"><strong>Erfolg:</strong> {proposal.successMetric}</p>
                            <p className="mt-1"><strong>Vergleich:</strong> {proposal.evaluationPlan}</p>
                        </article>
                    ))}
                </div>
            </section>
        )}
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
    const [contentBrief, setContentBrief] = useState(emptyContentBrief);
    const [teamMeeting, setTeamMeeting] = useState(emptyTeamMeeting);
    const [knowledgeEntry, setKnowledgeEntry] = useState(emptyKnowledge);
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
        if (error.code === "ai_not_configured") return "Die Live-KI ist noch nicht vollständig aktiviert. Der noch fehlende Anbieter-Schlüssel muss zuerst sicher auf dem Server hinterlegt werden.";
        if (error.code === "ai_budget_exceeded") return "Der Auftrag würde eine gespeicherte Budgetgrenze überschreiten. Passe die Grenze erst nach bewusster Freigabe an.";
        if (error.code === "ai_provider_unavailable") return "Ein KI-Anbieter war nicht erreichbar oder hat den Auftrag nicht vollständig beantwortet. Ein möglicherweise angefallener Teilbetrag bleibt im Kostenprotokoll sichtbar.";
        if (error.code === "ai_content_approval_required") return "Gib zuerst das Textpaket intern frei.";
        return "Der Auftrag konnte nicht gespeichert werden. Bitte prüfe die Eingaben.";
    };

    const submitContentProject = async (event) => {
        event.preventDefault();
        setBusy("content-project");
        setNotice(null);
        try {
            const result = await requestJson("/api/admin/ai-command-center/runs", {
                method: "POST",
                body: JSON.stringify({ workflowId: "content-project", ...contentBrief }),
            });
            applySnapshot(result.commandCenter);
            setContentBrief(emptyContentBrief);
            setActiveView("runs");
            const latestRun = result.commandCenter.runs[0];
            setNotice({ type: "success", text: `Das Content-Paket wurde erstellt. Kosten: ${money(latestRun?.actualCostUsd)}. Es wartet auf deine Prüfung und wurde nicht veröffentlicht.` });
        } catch (error) {
            setNotice({ type: "error", text: describeError(error) });
        } finally {
            setBusy("");
        }
    };

    const submitTeamMeeting = async (event) => {
        event.preventDefault();
        setBusy("team-meeting");
        setNotice(null);
        try {
            const result = await requestJson("/api/admin/ai-command-center/runs", {
                method: "POST",
                body: JSON.stringify({ workflowId: "team-meeting", ...teamMeeting }),
            });
            applySnapshot(result.commandCenter);
            setTeamMeeting((current) => ({ ...emptyTeamMeeting, meetingDate: current.meetingDate }));
            setActiveView("runs");
            setNotice({ type: "success", text: "Das Team-Meeting ist ausgewertet. Der Arbeitsplan wartet auf deine Prüfung; noch keine Aufgabe wurde außen ausgeführt." });
        } catch (error) {
            setNotice({ type: "error", text: describeError(error) });
        } finally {
            setBusy("");
        }
    };

    const saveKnowledge = async (event) => {
        event.preventDefault();
        setBusy("knowledge");
        setNotice(null);
        try {
            const result = await requestJson("/api/admin/ai-command-center/knowledge", {
                method: "POST",
                body: JSON.stringify(knowledgeEntry),
            });
            applySnapshot(result.commandCenter);
            setKnowledgeEntry((current) => ({ ...emptyKnowledge, category: current.category }));
            setNotice({ type: "success", text: "Das bestätigte Unternehmenswissen wurde versioniert gespeichert und steht künftigen Teamläufen zur Verfügung." });
        } catch (error) {
            setNotice({ type: "error", text: describeError(error) });
        } finally {
            setBusy("");
        }
    };

    const decideLearning = async (itemId, approved) => {
        setBusy(`learning-${itemId}`);
        setNotice(null);
        try {
            const result = await requestJson(`/api/admin/ai-command-center/learning/${itemId}/decision`, {
                method: "PUT",
                body: JSON.stringify({ approved }),
            });
            applySnapshot(result.commandCenter);
            setNotice({ type: "success", text: approved ? "Der Lernvorschlag ist als neue Playbook-Version aktiv." : "Der Lernvorschlag wurde verworfen und bleibt im Prüfprotokoll." });
        } catch {
            setNotice({ type: "error", text: "Der Lernvorschlag konnte nicht entschieden werden." });
        } finally {
            setBusy("");
        }
    };

    const createImageDraft = async (runId, briefIndex) => {
        const estimatedCost = preciseMoney(commandCenter.settings.imageDraftOutputCostUsd);
        if (!window.confirm(`Diesen Bildentwurf jetzt mit GPT Image 2 erstellen? Die geschätzten API-Kosten betragen ${estimatedCost}.`)) return;
        setBusy(`image-${runId}-${briefIndex}`);
        setNotice(null);
        try {
            const result = await requestJson(`/api/admin/ai-command-center/runs/${runId}/image-drafts`, {
                method: "POST",
                body: JSON.stringify({ briefIndex, confirmCost: true }),
            });
            applySnapshot(result.commandCenter);
            setNotice({ type: "success", text: `Der Bildentwurf wurde erstellt. Kosten: ${estimatedCost}. Er bleibt intern und ist für die Canva-Übergabe vorbereitet.` });
        } catch (error) {
            setNotice({ type: "error", text: describeError(error) });
        } finally {
            setBusy("");
        }
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

    const { agents, workflows, settings, pilotWeeks, runs, assets = [], knowledge = [], learningItems = [] } = commandCenter;
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
                        <p className="flex items-center gap-2 font-bold text-[#e8ca67]">{liveReady ? <Sparkles className="h-5 w-5" /> : <FlaskConical className="h-5 w-5" />}{liveReady ? "Live-KI bereit" : liveMode ? settings.configurationStatus === "missing_anthropic_key" ? "Claude-Schlüssel fehlt" : "OpenAI-Schlüssel fehlt" : "Mock-Modus aktiv"}</p>
                        <p className="mt-2 text-white/75">Diesen Monat: {money(settings.spentThisMonthUsd)} von {money(settings.monthlyBudgetUsd)}</p>
                        <p className="text-white/75">Typischer Auftrag: {runCostLabel}</p>
                        <p className="text-white/75">Langform: {settings.anthropicConfigured ? settings.editorialModel : "Claude vorbereitet"}</p>
                        <p className="text-white/75">Bilder: {settings.imageGenerationReady ? settings.imageModel : `${settings.imageModel} vorbereitet`}</p>
                        <p className="text-white/75">Bildausgabe: Entwurf {preciseMoney(settings.imageDraftOutputCostUsd)} · Final {preciseMoney(settings.imageFinalOutputCostUsd)}</p>
                        <p className="text-white/75">Canva: Markenlayout mit Freigabe</p>
                        <p className="text-white/75">Außenaktionen: gesperrt</p>
                    </div>
                </div>
            </section>

            <nav className="grid gap-2 rounded-3xl bg-[#fffaf2] p-3 shadow-sm sm:grid-cols-4 xl:grid-cols-7">
                {viewOptions.map(([id, label, icon]) => (
                    <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 font-bold transition ${activeView === id ? "bg-[#0f8b8d] text-white" : "text-[#4e6d6e] hover:bg-[#eaf4f1]"}`}>{createElement(icon, { className: "h-5 w-5" })}{label}</button>
                ))}
            </nav>

            {activeView === "overview" && (
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {[
                            [Bot, agents.length, "dauerhafte Rollen"],
                            [BookOpenCheck, knowledge.filter((entry) => entry.status === "active").length, "bestätigte Wissenseinträge"],
                            [Workflow, learningItems.filter((item) => item.status === "active").length, "aktive Lernversionen"],
                            [FileCheck2, pilotWeeks.length, "von 8 Pilotwochen erfasst"],
                            [CircleDashed, pendingRuns.length, "Ergebnisse warten auf Prüfung"],
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
                                <li>Website, E-Mail, Social Media, Metricool und Zahlungen bleiben von der KI getrennt.</li>
                                <li>GPT Image 2 ist für Motive vorbereitet. Jeder kostenpflichtige Bildlauf braucht eine eigene Bestätigung.</li>
                                <li>Canva übernimmt danach Markenlayout und Formate. Ein Canva-Entwurf oder eine Veröffentlichung braucht ebenfalls eine eigene Bestätigung.</li>
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

            {activeView === "meeting" && (
                <form onSubmit={submitTeamMeeting} className="rounded-3xl bg-[#fffaf2] p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0f8b8d]">Morgendliche Arbeitsverteilung</p>
                            <h2 className="mt-2 text-3xl font-bold">Team-Meeting starten</h2>
                            <p className="mt-2 max-w-3xl leading-7 text-[#6b8585]">Du gibst die Lage und Prioritäten vor. Der Director verteilt sie auf die passenden Rollen, nennt Abhängigkeiten und legt für jede Aufgabe ein prüfbares Fertig-Kriterium fest.</p>
                        </div>
                        <span className="rounded-full bg-[#eaf4f1] px-4 py-2 text-sm font-bold text-[#075f62]">Unternehmenswissen: {knowledge.filter((entry) => entry.status === "active").length} · Playbooks: {learningItems.filter((item) => item.status === "active").length}</span>
                    </div>
                    <div className="mt-7 grid gap-5 lg:grid-cols-2">
                        <label className="text-sm font-bold">Datum *<input type="date" required value={teamMeeting.meetingDate} onChange={(event) => setTeamMeeting((current) => ({ ...current, meetingDate: event.target.value }))} className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-4 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Signale seit dem letzten Meeting<textarea rows={3} maxLength={6000} value={teamMeeting.currentSignals} onChange={(event) => setTeamMeeting((current) => ({ ...current, currentSignals: event.target.value }))} placeholder="Neue Buchungen, Reaktionen, Engpässe oder Ergebnisse. Eine Beobachtung pro Zeile." className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Heute *<textarea required rows={5} maxLength={6000} value={teamMeeting.dayPriorities} onChange={(event) => setTeamMeeting((current) => ({ ...current, dayPriorities: event.target.value }))} placeholder="Was soll heute konkret fertig werden? Eine Aufgabe pro Zeile." className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Diese Woche<textarea rows={5} maxLength={6000} value={teamMeeting.weekPriorities} onChange={(event) => setTeamMeeting((current) => ({ ...current, weekPriorities: event.target.value }))} placeholder="Welche Wochenziele müssen mitlaufen?" className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Dieser Monat<textarea rows={4} maxLength={6000} value={teamMeeting.monthPriorities} onChange={(event) => setTeamMeeting((current) => ({ ...current, monthPriorities: event.target.value }))} placeholder="Welche Monatsziele dürfen im Tagesgeschäft nicht verloren gehen?" className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Offene Entscheidungen<textarea rows={4} maxLength={6000} value={teamMeeting.openDecisions} onChange={(event) => setTeamMeeting((current) => ({ ...current, openDecisions: event.target.value }))} placeholder="Wo braucht das Team deine Entscheidung?" className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold lg:col-span-2">Grenzen und feste Vorgaben<textarea rows={3} maxLength={6000} value={teamMeeting.constraints} onChange={(event) => setTeamMeeting((current) => ({ ...current, constraints: event.target.value }))} placeholder="Zum Beispiel feste Termine, Budgets oder Dinge, die heute nicht verändert werden dürfen." className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                    </div>
                    <label className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><input type="checkbox" required checked={teamMeeting.anonymizationConfirmed} onChange={(event) => setTeamMeeting((current) => ({ ...current, anonymizationConfirmed: event.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-[#0f8b8d]" /><span><strong className="block">Eingaben geprüft</strong>Das Meeting enthält keine personenbezogenen Daten oder vertraulichen Geschichten realer Teilnehmender.</span></label>
                    <button type="submit" disabled={busy === "team-meeting" || (liveMode && !liveReady)} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-7 font-bold text-white hover:bg-[#0a6f71] disabled:opacity-50"><UsersRound className="h-5 w-5" />{busy === "team-meeting" ? "Team berät …" : `Team-Meeting auswerten (typisch ${runCostLabel})`}</button>
                </form>
            )}

            {activeView === "learning" && (
                <div className="grid gap-6 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <form onSubmit={saveKnowledge} className="h-fit rounded-3xl bg-[#fffaf2] p-6 shadow-sm sm:p-8">
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0f8b8d]">Unternehmensgedächtnis</p>
                        <h2 className="mt-2 text-3xl font-bold">Bestätigtes Wissen speichern</h2>
                        <p className="mt-2 leading-7 text-[#6b8585]">Nur hier bestätigte Fakten gelten künftig als Unternehmenswissen. Eine neue Fassung mit demselben Titel ersetzt die alte sichtbar als nächste Version.</p>
                        <div className="mt-6 space-y-5">
                            <label className="block text-sm font-bold">Bereich<select value={knowledgeEntry.category} onChange={(event) => setKnowledgeEntry((current) => ({ ...current, category: event.target.value }))} className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-4 outline-none focus:border-[#0f8b8d]"><option value="unternehmen">Unternehmen</option><option value="marke">Marke und Sprache</option><option value="angebote">Angebote</option><option value="zielgruppen">Zielgruppen</option><option value="prozesse">Prozesse</option><option value="kennzahlen">Kennzahlen</option><option value="termine">Termine</option></select></label>
                            <label className="block text-sm font-bold">Titel *<input required maxLength={180} value={knowledgeEntry.title} onChange={(event) => setKnowledgeEntry((current) => ({ ...current, title: event.target.value }))} className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-4 outline-none focus:border-[#0f8b8d]" /></label>
                            <label className="block text-sm font-bold">Inhalt *<textarea required rows={7} maxLength={12000} value={knowledgeEntry.content} onChange={(event) => setKnowledgeEntry((current) => ({ ...current, content: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                            <label className="block text-sm font-bold">Quelle oder Beschluss *<input required maxLength={500} value={knowledgeEntry.sourceNote} onChange={(event) => setKnowledgeEntry((current) => ({ ...current, sourceNote: event.target.value }))} placeholder="Zum Beispiel: Team-Beschluss vom 05.09.2026" className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-4 outline-none focus:border-[#0f8b8d]" /></label>
                            <label className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><input type="checkbox" required checked={knowledgeEntry.confirmed} onChange={(event) => setKnowledgeEntry((current) => ({ ...current, confirmed: event.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-[#0f8b8d]" /><span>Ich bestätige, dass dieser Eintrag stimmt, keine personenbezogenen Daten enthält und von allen Agenten als Unternehmenswissen verwendet werden darf.</span></label>
                        </div>
                        <button type="submit" disabled={busy === "knowledge"} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-7 font-bold text-white disabled:opacity-50"><Save className="h-5 w-5" /> Wissen versioniert speichern</button>
                    </form>
                    <div className="space-y-6">
                        <section className="rounded-3xl bg-[#fffaf2] p-6 shadow-sm">
                            <h2 className="text-2xl font-bold">Aktives Unternehmenswissen</h2>
                            <div className="mt-4 space-y-3">
                                {knowledge.filter((entry) => entry.status === "active").map((entry) => <article key={entry.id} className="rounded-2xl border border-[#0f8b8d]/15 bg-white p-4"><div className="flex items-center justify-between gap-3"><strong>{entry.title}</strong><span className="rounded-full bg-[#eaf4f1] px-3 py-1 text-xs font-bold text-[#075f62]">{entry.category} · v{entry.version}</span></div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4e6d6e]">{entry.content}</p><p className="mt-2 text-xs text-[#789091]">Quelle: {entry.sourceNote}</p></article>)}
                                {knowledge.filter((entry) => entry.status === "active").length === 0 && <p className="rounded-2xl bg-white p-4 text-sm text-[#6b8585]">Noch kein bestätigter Wissenseintrag.</p>}
                            </div>
                        </section>
                        <section className="rounded-3xl bg-[#fffaf2] p-6 shadow-sm">
                            <h2 className="text-2xl font-bold">Lernkandidaten und Playbooks</h2>
                            <p className="mt-2 text-sm leading-6 text-[#6b8585]">Die Agenten dürfen Vorschläge selbst entwickeln. Als aktive Regel lernen sie erst nach einem dokumentierten Vergleich und deiner Entscheidung. So bleibt jede Veränderung nachvollziehbar und rücksetzbar.</p>
                            <div className="mt-4 space-y-3">
                                {learningItems.map((item) => <article key={item.id} className="rounded-2xl border border-[#0f8b8d]/15 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><strong>{item.agentName}</strong><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === "active" ? "bg-emerald-100 text-emerald-800" : item.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{item.status === "active" ? `aktiv · v${item.playbookVersion}` : item.status === "rejected" ? "verworfen" : `Kandidat · Risiko ${item.riskLevel}`}</span></div><p className="mt-3 text-sm leading-6"><strong>Beobachtung:</strong> {item.observation}</p><p className="mt-1 text-sm leading-6"><strong>Vorgeschlagene Regel:</strong> {item.proposedChange}</p><p className="mt-1 text-sm leading-6"><strong>Erfolgskriterium:</strong> {item.successMetric}</p><p className="mt-1 text-sm leading-6"><strong>Vergleich:</strong> {item.evaluationPlan}</p>{item.status === "candidate" && <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => decideLearning(item.id, true)} disabled={busy === `learning-${item.id}`} className="rounded-full bg-[#0f8b8d] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Als neue Version aktivieren</button><button type="button" onClick={() => decideLearning(item.id, false)} disabled={busy === `learning-${item.id}`} className="rounded-full border border-red-300 px-4 py-2 text-sm font-bold text-red-800 disabled:opacity-50">Verwerfen</button></div>}</article>)}
                                {learningItems.length === 0 && <p className="rounded-2xl bg-white p-4 text-sm text-[#6b8585]">Lernkandidaten entstehen aus freigegebenen Team- und Arbeitsläufen.</p>}
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {activeView === "projects" && (
                <form onSubmit={submitContentProject} className="rounded-3xl bg-[#fffaf2] p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0f8b8d]">Content-Produktion</p>
                            <h2 className="mt-2 text-3xl font-bold">Neues Projekt starten</h2>
                            <p className="mt-2 max-w-3xl leading-7 text-[#6b8585]">Die Agenten erstellen vollständige Texte, Bildbriefings und eine Canva-Übergabe. Das Textpaket kostet typischerweise {runCostLabel}. Ein Bildentwurf wird später einzeln mit derzeit etwa {preciseMoney(settings.imageDraftOutputCostUsd)} bestätigt.</p>
                        </div>
                        <span className="rounded-full bg-[#eaf4f1] px-4 py-2 text-sm font-bold text-[#075f62]">Monatsrest: {money(settings.remainingThisMonthUsd)}</span>
                    </div>
                    <div className="mt-7 grid gap-5 lg:grid-cols-2">
                        <label className="text-sm font-bold">Projektname *<input required maxLength={160} value={contentBrief.projectName} onChange={(event) => setContentBrief((current) => ({ ...current, projectName: event.target.value }))} placeholder="Zum Beispiel: Neue Gruppenrunde im Herbst" className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-4 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Ziel des Projekts *<textarea required rows={3} maxLength={1200} value={contentBrief.goal} onChange={(event) => setContentBrief((current) => ({ ...current, goal: event.target.value }))} placeholder="Was soll der Content konkret erreichen?" className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Zielgruppe *<textarea required rows={3} maxLength={1200} value={contentBrief.audience} onChange={(event) => setContentBrief((current) => ({ ...current, audience: event.target.value }))} placeholder="Für wen ist der Content gedacht?" className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Kernbotschaft *<textarea required rows={3} maxLength={2000} value={contentBrief.coreMessage} onChange={(event) => setContentBrief((current) => ({ ...current, coreMessage: event.target.value }))} placeholder="Was sollen Menschen verstehen oder mitnehmen?" className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Angebot oder Anlass<textarea rows={3} maxLength={1200} value={contentBrief.offer} onChange={(event) => setContentBrief((current) => ({ ...current, offer: event.target.value }))} placeholder="Welches Angebot darf genannt werden?" className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Gewünschter nächster Schritt *<textarea required rows={3} maxLength={800} value={contentBrief.callToAction} onChange={(event) => setContentBrief((current) => ({ ...current, callToAction: event.target.value }))} placeholder="Zum Beispiel: Mehr erfahren oder unverbindlich anfragen" className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Ton und Sprache *<textarea required rows={3} maxLength={800} value={contentBrief.tone} onChange={(event) => setContentBrief((current) => ({ ...current, tone: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                        <label className="text-sm font-bold">Weitere Grenzen oder Vorgaben<textarea rows={3} maxLength={2000} value={contentBrief.constraints} onChange={(event) => setContentBrief((current) => ({ ...current, constraints: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none focus:border-[#0f8b8d]" /></label>
                    </div>
                    <fieldset className="mt-6">
                        <legend className="text-sm font-bold">Kanäle *</legend>
                        <div className="mt-3 flex flex-wrap gap-3">
                            {contentChannels.map(([id, label]) => (
                                <label key={id} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-bold ${contentBrief.channels.includes(id) ? "border-[#0f8b8d] bg-[#eaf4f1] text-[#075f62]" : "border-[#0f8b8d]/20 bg-white text-[#6b8585]"}`}>
                                    <input type="checkbox" checked={contentBrief.channels.includes(id)} onChange={(event) => setContentBrief((current) => ({ ...current, channels: event.target.checked ? [...current.channels, id] : current.channels.filter((channel) => channel !== id) }))} className="h-4 w-4 accent-[#0f8b8d]" />{label}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <label className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><input type="checkbox" required checked={contentBrief.anonymizationConfirmed} onChange={(event) => setContentBrief((current) => ({ ...current, anonymizationConfirmed: event.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-[#0f8b8d]" /><span><strong className="block">Eingaben geprüft</strong>Das Briefing enthält keine personenbezogenen Daten oder vertraulichen Geschichten realer Teilnehmender.</span></label>
                    <button type="submit" disabled={busy === "content-project" || contentBrief.channels.length === 0 || (liveMode && !liveReady)} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-7 font-bold text-white hover:bg-[#0a6f71] disabled:opacity-50"><Play className="h-5 w-5" />{busy === "content-project" ? "Content-Paket wird erstellt …" : `Content-Paket erstellen (typisch ${runCostLabel})`}</button>
                </form>
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
                                <div className="mt-5"><RunResult result={run.result} run={run} assets={assets} settings={settings} onImageDraft={createImageDraft} busy={busy} /></div>
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
                    <div className="rounded-3xl bg-[#fffaf2] p-6"><h2 className="text-3xl font-bold">Agenten, Zugänge und Grenzen</h2><p className="mt-2 leading-7 text-[#6b8585]">{liveReady ? `Routinearbeiten laufen über ${settings.routineModel}; Langform über ${settings.editorialProvider === "Anthropic" ? settings.editorialModel : `${settings.routineModel} als Rückfallroute`}; Prüfung, Datenschutz und Qualitätskontrolle über ${settings.reviewModel}. Bilder laufen nach Einzelbestätigung über ${settings.imageModel} und anschließend durch das Canva-Markenlayout.` : `Im aktuellen Mock-Modus werden Rollen und Übergaben ohne kostenpflichtige Modellaufrufe geprüft. Claude, ${settings.imageModel} und Canva bleiben bis zur gesonderten Aktivierung geschützt.`}</p></div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {agents.map((agent) => <article key={agent.id} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf4f1] text-[#0f8b8d]"><UsersRound className="h-5 w-5" /></span><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#6b8585]">{agent.provider}</span></div><p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#0f8b8d]">{agent.area}</p><h3 className="mt-1 text-xl font-bold">{agent.name}</h3><p className="mt-2 leading-7 text-[#6b8585]">{agent.purpose}</p><div className="mt-4 rounded-2xl border border-[#0f8b8d]/10 bg-white p-4 text-sm leading-6"><strong className="text-[#075f62]">Möglichkeiten</strong><p className="mt-1 text-[#6b8585]">{agent.capabilities.join(" · ")}</p><strong className="mt-3 block text-[#075f62]">Lernweise</strong><p className="mt-1 text-[#6b8585]">{agent.learning}</p><strong className="mt-3 block text-[#075f62]">Zugriff</strong><p className="mt-1 text-[#6b8585]">{agent.access.join(" · ")}</p><strong className="mt-3 block text-[#075f62]">Freigabegrenze</strong><p className="mt-1 text-[#6b8585]">{agent.guardrail}</p></div></article>)}
                    </div>
                </div>
            )}
        </div>
    );
};
