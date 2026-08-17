export const aiAgentRegistry = [
    { id: "sh-director", name: "SH Director", area: "Steuerung", provider: "OpenAI", purpose: "Ordnet Aufträge, Übergaben und Freigabepunkte." },
    { id: "knowledge-curator", name: "Knowledge Curator", area: "Wissen", provider: "OpenAI", purpose: "Ordnet freigegebene Beobachtungen und hält Herkunft und Version fest." },
    { id: "program-development", name: "Program Development", area: "Kernprodukt", provider: "OpenAI", purpose: "Überführt Pilotlernen in einen prüfbaren Programmentwurf." },
    { id: "research-fact-check", name: "Research & Fact Check", area: "Recherche", provider: "OpenAI", purpose: "Markiert Aussagen, die Quellen oder vorsichtige Formulierungen brauchen." },
    { id: "content-studio", name: "Content Studio", area: "Content", provider: "OpenAI", purpose: "Leitet interne Contentansätze aus freigegebenem Wissen ab." },
    { id: "strategy-growth", name: "Strategy & Growth", area: "Strategie", provider: "OpenAI", purpose: "Verbindet Angebote, Zielgruppen und messbare Ziele." },
    { id: "social-growth", name: "Social Growth", area: "Social Media", provider: "OpenAI", purpose: "Plant Tests und wertet freigegebene Kennzahlen aus." },
    { id: "sales-client-journey", name: "Sales & Client Journey", area: "Kundenreise", provider: "OpenAI", purpose: "Entwirft respektvolle Übergänge zwischen Angeboten." },
    { id: "analytics-learning", name: "Analytics & Learning", area: "Auswertung", provider: "OpenAI", purpose: "Trennt Beobachtung, Hypothese und Messlücke." },
    { id: "editorial-teaching", name: "Editorial & Teaching", area: "Langform", provider: "Claude", purpose: "Bearbeitet später lange Skripte, Workbooks und Vorträge." },
    { id: "brand-review", name: "Brand Review", area: "Marke", provider: "OpenAI", purpose: "Prüft Ton und Spirit-Healing-Begriffe." },
    { id: "technical-operations", name: "Website & Technical", area: "Technik", provider: "Codex", purpose: "Bereitet technische Änderungen vor; kein eigenständiges Live-Deployment." },
    { id: "operations-manager", name: "Operations Manager", area: "Betrieb", provider: "OpenAI", purpose: "Ordnet Termine, Zuständigkeiten und offene Entscheidungen." },
    { id: "compliance-privacy", name: "Compliance & Privacy", area: "Schutz", provider: "OpenAI", purpose: "Prüft Datenschutz, Rollen und Gesundheitsclaims." },
    { id: "independent-review", name: "Independent Review", area: "Zweitprüfung", provider: "Claude", purpose: "Prüft wichtige Ergebnisse unabhängig vom Erstentwurf." },
    { id: "quality-controller", name: "Quality Controller", area: "Freigabereife", provider: "OpenAI", purpose: "Bündelt Restfragen und legt das Ergebnis Menschen zur Entscheidung vor." },
];

const agentMap = new Map(aiAgentRegistry.map((agent) => [agent.id, agent]));

export const aiWorkflowRegistry = [
    {
        id: "pilot-week-learning",
        name: "Pilotwoche auswerten",
        description: "Ordnet eine anonymisierte Woche, leitet Lernpunkte ab und endet vor jeder Außenaktion.",
        steps: [
            "sh-director",
            "knowledge-curator",
            "analytics-learning",
            "program-development",
            "research-fact-check",
            "content-studio",
            "compliance-privacy",
            "independent-review",
            "quality-controller",
        ],
    },
    {
        id: "core-product-development",
        name: "12-Wochen-Kernprodukt entwickeln",
        description: "Führt die gespeicherten Pilotwochen zu einem internen, noch nicht veröffentlichten Arbeitsentwurf zusammen.",
        steps: [
            "sh-director",
            "knowledge-curator",
            "analytics-learning",
            "program-development",
            "research-fact-check",
            "strategy-growth",
            "compliance-privacy",
            "independent-review",
            "quality-controller",
        ],
    },
];

const workflowMap = new Map(aiWorkflowRegistry.map((workflow) => [workflow.id, workflow]));

const excerpt = (value, fallback = "Keine Angabe") => {
    const normalized = String(value || "").replace(/\s+/gu, " ").trim();
    if (!normalized) return fallback;
    return normalized.length > 220 ? `${normalized.slice(0, 217)}…` : normalized;
};

const listFromText = (value) => String(value || "")
    .split(/\n|[•;]/u)
    .map((item) => item.replace(/^[-–—\s]+/u, "").trim())
    .filter(Boolean)
    .slice(0, 5);

const completedSteps = (workflow, summaryFactory) => workflow.steps.map((agentId, index) => {
    const agent = agentMap.get(agentId);
    const previous = index === 0 ? [] : [`step-${index}`];
    return {
        id: `step-${index + 1}`,
        agentId,
        agentName: agent.name,
        provider: agent.provider,
        status: "completed",
        inputFrom: previous,
        summary: summaryFactory(agentId),
    };
});

const pilotResult = (pilotWeek) => {
    const adjustments = listFromText(pilotWeek.nextAdjustments);
    const questions = listFromText(pilotWeek.commonQuestions);
    const contentIdeas = questions.length > 0
        ? questions.map((question) => `Sachlicher Beitrag zur anonymisierten Frage: ${question}`)
        : [`Beitrag zum Wochenschwerpunkt „${excerpt(pilotWeek.actualFocus)}“`];

    return {
        title: `Interne Auswertung der Pilotwoche ${pilotWeek.weekNumber}`,
        executiveSummary: `Woche ${pilotWeek.weekNumber} wurde mit ${pilotWeek.participantCount} Teilnehmenden dokumentiert. Der Arbeitsentwurf trennt Eingaben, Ableitungen und offene Prüfungen.`,
        signals: [
            `Geplanter Schwerpunkt: ${excerpt(pilotWeek.plannedFocus)}`,
            `Tatsächlich bearbeitet: ${excerpt(pilotWeek.actualFocus)}`,
            `Hilfreiche Übungen: ${excerpt(pilotWeek.helpfulExercises)}`,
            `Schwierigkeiten: ${excerpt(pilotWeek.challenges)}`,
            `Beobachtete Veränderungen: ${excerpt(pilotWeek.observedChanges)}`,
        ],
        recommendedAdjustments: adjustments.length > 0
            ? adjustments
            : ["Für die nächste Woche noch eine konkrete Anpassung festhalten."],
        contentIdeas,
        reviewNotes: [
            "Beobachtungen aus einer Pilotgruppe sind keine Wirksamkeitsnachweise.",
            "Gesundheitsbezogene Aussagen brauchen vor öffentlicher Verwendung eine gesonderte Prüfung.",
            "Das Ergebnis bleibt intern, bis ein Mensch es freigibt.",
        ],
        externalActions: [],
    };
};

const extensionWeeks = [
    { weekNumber: 9, title: "Stabilisierung", basis: "Welche hilfreichen Schritte brauchen mehr Wiederholung?" },
    { weekNumber: 10, title: "Transfer in den Alltag", basis: "Wo gelingt die Umsetzung außerhalb der Gruppe noch nicht?" },
    { weekNumber: 11, title: "Umgang mit Rückschritten", basis: "Welche Schwierigkeiten und Gegenbewegungen wiederholen sich?" },
    { weekNumber: 12, title: "Abschluss und nächste Schritte", basis: "Was soll nach dem Programm selbständig weitergeführt werden?" },
];

const coreProductResult = (pilotWeeks) => {
    const sorted = [...pilotWeeks].sort((left, right) => left.weekNumber - right.weekNumber);
    const recordedWeeks = new Map(sorted.map((week) => [week.weekNumber, week]));
    const firstEight = Array.from({ length: 8 }, (_unused, index) => {
        const weekNumber = index + 1;
        const source = recordedWeeks.get(weekNumber);
        return {
            weekNumber,
            title: source ? excerpt(source.actualFocus, `Woche ${weekNumber}`) : `Woche ${weekNumber} noch offen`,
            basis: source
                ? `Arbeitsstand aus Pilotwoche ${weekNumber}: ${excerpt(source.professionalInsights)}`
                : "Für diese Pilotwoche liegen noch keine anonymisierten Angaben vor.",
            sourceStatus: source ? "pilot-data" : "missing",
        };
    });

    return {
        title: "Arbeitsentwurf für das 12-Wochen-Kernprodukt",
        executiveSummary: `${sorted.length} von 8 Pilotwochen sind erfasst. Die Wochen 9 bis 12 sind begründete Prüffelder und noch keine freigegebenen Programminhalte.`,
        programBlueprint: [...firstEight, ...extensionWeeks.map((week) => ({ ...week, sourceStatus: "hypothesis" }))],
        openDecisions: [
            sorted.length < 8 ? "Die fehlenden Pilotwochen erfassen, bevor die Struktur beschlossen wird." : "Prüfen, ob die Pilotdaten die vier Ergänzungswochen tatsächlich tragen.",
            "Lernziele, Übungen und Grenzen jeder Woche fachlich festlegen.",
            "Öffentliche Wirkungsversprechen getrennt prüfen; Pilotbeobachtungen reichen dafür nicht aus.",
        ],
        sourceWeeks: sorted.map((week) => week.weekNumber),
        externalActions: [],
    };
};

export const buildMockWorkflowRun = ({ workflowId, pilotWeek = null, pilotWeeks = [] }) => {
    const workflow = workflowMap.get(workflowId);
    if (!workflow) throw new Error(`Unknown workflow: ${workflowId}`);
    if (workflowId === "pilot-week-learning" && !pilotWeek) throw new Error("Pilot week is required");
    if (workflowId === "core-product-development" && pilotWeeks.length === 0) throw new Error("Pilot weeks are required");

    const contextLabel = workflowId === "pilot-week-learning"
        ? `Pilotwoche ${pilotWeek.weekNumber}`
        : `${pilotWeeks.length} gespeicherte Pilotwochen`;
    const summaries = {
        "sh-director": `Auftrag und Freigabegrenzen für ${contextLabel} festgelegt.`,
        "knowledge-curator": "Eingaben als interne Quelle geordnet; keine fremden Quellen oder personenbezogenen Daten ergänzt.",
        "analytics-learning": "Beobachtungen, Deutungen und noch fehlende Messpunkte getrennt.",
        "program-development": "Aus den geordneten Eingaben einen Programmarbeitsstand abgeleitet.",
        "research-fact-check": "Aussagen mit möglichem Quellen- oder Evidenzbedarf markiert.",
        "content-studio": "Mögliche Contentansätze vorbereitet; keine Veröffentlichung ausgelöst.",
        "strategy-growth": "Angebotsbezug als interne Hypothese geprüft.",
        "compliance-privacy": "Datenschutz, sensible Aussagen und Außenwirkungsrisiken geprüft.",
        "independent-review": "Ergebnis unabhängig auf Widersprüche und unbelegte Schlussfolgerungen geprüft.",
        "quality-controller": "Restfragen gebündelt und Ergebnis zur menschlichen Entscheidung vorgelegt.",
    };

    return {
        workflowId,
        workflowName: workflow.name,
        mode: "mock",
        status: "completed",
        estimatedCostUsd: 0,
        actualCostUsd: 0,
        approvalStatus: "pending",
        steps: completedSteps(workflow, (agentId) => summaries[agentId] || "Arbeitsschritt abgeschlossen."),
        result: workflowId === "pilot-week-learning" ? pilotResult(pilotWeek) : coreProductResult(pilotWeeks),
    };
};
