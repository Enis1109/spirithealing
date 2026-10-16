// First-party, opt-in attribution only. Never sent to Meta or a newsletter provider.
export const liveAttributionVersion = "live-source-2026-10-16";
export const liveAttributionEvent = "live-drehbuch-2026-10-20";
export const liveAttributionSources = Object.freeze({
    "lt20-a01": "Meta-Anzeige 1",
    "lt20-a02": "Meta-Anzeige 2",
    "lt20-e08": "E-Mail E8",
    "lt20-e09": "E-Mail E9",
    "lt20-fb": "Facebook-Beitrag",
    "lt20-ig": "Instagram-Beitrag",
    "lt20-wa": "WhatsApp-Einladung",
});

export const readLiveSource = (search = "") => {
    const values = new URLSearchParams(search).getAll("sh_source");
    return values.length === 1 && Object.hasOwn(liveAttributionSources, values[0]) ? values[0] : null;
};

export const normalizeLiveAttribution = (value, eventKey) => {
    if (eventKey !== liveAttributionEvent || value?.consent !== true
        || value?.version !== liveAttributionVersion || typeof value?.sourceCode !== "string"
        || !Object.hasOwn(liveAttributionSources, value.sourceCode)) return null;
    return { consent: true, version: liveAttributionVersion, sourceCode: value.sourceCode };
};

// Rows are registrations, not mail jobs. Unknown is not assumed to mean direct or email.
export const summarizeLiveAttribution = (rows) => {
    const unique = new Map(rows.map(row => [String(row.id), row]));
    const sources = new Map();
    let active = 0, cancelled = 0;
    for (const row of unique.values()) {
        if (row.status !== "active") { cancelled++; continue; }
        active++;
        const code = Object.hasOwn(liveAttributionSources, row.source_code) ? row.source_code : "unknown";
        sources.set(code, (sources.get(code) || 0) + 1);
    }
    return { total: unique.size, active, cancelled,
        attributed: active - (sources.get("unknown") || 0),
        sources: [...sources].map(([code, count]) => ({ code, count,
            label: liveAttributionSources[code] || "Nicht zugeordnet" })) };
};
