const internalAccess = ["anonymisierte Arbeitsdaten", "interne Arbeitsstände"];
const humanApproval = "Menschliche Freigabe vor jeder Außenwirkung";

const agent = ({ access = internalAccess, capabilities = ["interne Entwürfe", "Übergabe an Prüfung"], guardrail = humanApproval, ...profile }) => ({
    ...profile,
    access,
    capabilities,
    guardrail,
});

export const aiAgentRegistry = [
    agent({ id: "sh-director", name: "SH Director", area: "Steuerung", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Ordnet Aufträge, Übergaben und Freigabepunkte.", access: ["Auftragsstatus", "Rollenprofile", ...internalAccess] }),
    agent({ id: "knowledge-curator", name: "Knowledge Curator", area: "Wissen", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Ordnet freigegebene Beobachtungen und hält Herkunft und Version fest." }),
    agent({ id: "program-development", name: "Program Development", area: "Kernprodukt", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Überführt Pilotlernen in einen prüfbaren Programmentwurf." }),
    agent({ id: "research-fact-check", name: "Research & Fact Check", area: "Recherche", provider: "OpenAI · Websuche begrenzt", providerRoute: "openai-review", purpose: "Markiert Aussagen, die Quellen oder vorsichtige Formulierungen brauchen.", access: ["allgemeine fachliche Aussagen", "höchstens zwei Websuchen", "keine Pilotdaten in Suchanfragen"] }),
    agent({ id: "content-studio", name: "Content Studio", area: "Content", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Leitet interne Contentansätze aus freigegebenem Wissen ab.", access: [...internalAccess, "freigegebenes Markenwissen"], capabilities: ["Content-Briefings", "Hooks und Textvarianten", "Bildbriefings für GPT Image 2", "Übergabe an Brand Review"] }),
    agent({ id: "strategy-growth", name: "Strategy & Growth", area: "Strategie", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Verbindet Angebote, Zielgruppen und messbare Ziele.", access: ["freigegebene Angebotsdaten", "anonymisierte Kennzahlen", "interne Arbeitsstände"] }),
    agent({ id: "social-growth", name: "Social Growth", area: "Social Media", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Plant Formate und Tests und wertet freigegebene Kennzahlen aus.", access: ["freigegebene Contententwürfe", "anonymisierte Kennzahlen"], capabilities: ["kanalspezifische Formate", "Caption- und Hook-Varianten", "Testhypothesen", "Lernschleife aus freigegebenen Kennzahlen"], guardrail: "Keine Planung oder Veröffentlichung auf einem Social-Media-Konto ohne gesonderte Freigabe" }),
    agent({ id: "sales-client-journey", name: "Sales & Client Journey", area: "Kundenreise", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Entwirft respektvolle Übergänge zwischen Angeboten.", access: ["freigegebene Angebotsdaten", "anonymisierte Rückmeldungen"] }),
    agent({ id: "analytics-learning", name: "Analytics & Learning", area: "Auswertung", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Trennt Beobachtung, Hypothese und Messlücke.", access: ["anonymisierte Pilotdaten", "freigegebene Kennzahlen"] }),
    agent({ id: "editorial-teaching", name: "Editorial & Teaching", area: "Langform", provider: "Anthropic · Claude Sonnet 5", providerRoute: "anthropic-editorial", fallbackProvider: "OpenAI", purpose: "Bearbeitet lange Skripte, Workbooks und Erzähltexte als interne Entwürfe.", access: ["freigegebene Quellen", "anonymisierte Arbeitsdaten", "vorheriger Programmentwurf"], guardrail: "OpenAI-Zweitprüfung und menschliche Freigabe sind Pflicht" }),
    agent({ id: "brand-review", name: "Brand Review", area: "Marke", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Prüft Ton, Bildbriefing und Spirit-Healing-Begriffe.", access: ["freigegebenes Markenwissen", "interne Text- und Bildbriefings"], capabilities: ["Tonprüfung", "Bildsprache und Motivgrenzen", "Gesundheitsclaim-Prüfung", "Freigabeempfehlung"] }),
    agent({ id: "visual-design", name: "Visual Design & Canva", area: "Gestaltung", provider: "OpenAI · GPT Image 2 + Canva", providerRoute: "openai-image-canva-handoff", purpose: "Erzeugt oder bearbeitet ein Motiv und überführt es anschließend in ein freigegebenes Canva-Markenlayout.", access: ["intern freigegebene Texte", "freigegebene Bildbriefings", "ausgewählte Canva-Markenvorlagen"], capabilities: ["GPT Image 2 für Motive und Bildbearbeitung", "Entwurfsqualität für günstige Varianten", "Finalqualität für ausgewählte Motive", "Canva-Layout und Formatadaption"], guardrail: "Jede kostenpflichtige Bilderzeugung, Canva-Erstellung und Veröffentlichung braucht die dafür vorgesehene Bestätigung" }),
    agent({ id: "technical-operations", name: "Website & Technical", area: "Technik", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Bereitet technische Änderungen vor; kein eigenständiges Live-Deployment.", access: ["Repository-Arbeitsbranch", "technische Protokolle"], guardrail: "Kein Merge oder Live-Deployment ohne gesonderte Freigabe" }),
    agent({ id: "operations-manager", name: "Operations Manager", area: "Betrieb", provider: "OpenAI", providerRoute: "openai-routine", purpose: "Ordnet Termine, Zuständigkeiten und offene Entscheidungen.", access: ["Auftragsstatus", "Zuständigkeiten", "interne Entscheidungen"] }),
    agent({ id: "compliance-privacy", name: "Compliance & Privacy", area: "Schutz", provider: "OpenAI", providerRoute: "openai-review", purpose: "Prüft Datenschutz, Rollen und Gesundheitsclaims.", access: ["zu prüfende interne Ergebnisse", "Freigabegrenzen"] }),
    agent({ id: "independent-review", name: "Independent Review", area: "Zweitprüfung", provider: "OpenAI", providerRoute: "openai-review", purpose: "Prüft wichtige Ergebnisse in einem getrennten Modelllauf unabhängig vom Erstentwurf.", access: ["Erstentwurf", "Claude-Langformentwurf", "anonymisierte Quellenbasis"] }),
    agent({ id: "quality-controller", name: "Quality Controller", area: "Freigabereife", provider: "OpenAI", providerRoute: "openai-review", purpose: "Bündelt Restfragen und legt das Ergebnis Menschen zur Entscheidung vor.", access: ["Prüfprotokolle", "Kostenprotokoll", "interne Ergebnisse"] }),
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
            "editorial-teaching",
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
        "editorial-teaching": "Langform, Lehrlogik und Erzählbogen als internen Arbeitsauftrag vorbereitet.",
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
