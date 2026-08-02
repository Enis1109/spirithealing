const socialSources = [
    ["instagram.com", "instagram"],
    ["facebook.com", "facebook"],
    ["youtube.com", "youtube"],
    ["youtu.be", "youtube"],
    ["tiktok.com", "tiktok"],
    ["whatsapp.com", "whatsapp"],
    ["wa.me", "whatsapp"],
    ["t.me", "telegram"],
    ["telegram.org", "telegram"],
];

const pageSessionId = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 18)}`.slice(0, 36);

const clean = (value, maxLength) => {
    const normalized = String(value || "").trim();
    return normalized ? normalized.slice(0, maxLength) : null;
};

const referrerHost = () => {
    try {
        return clean(new URL(document.referrer).hostname.replace(/^www\./u, ""), 160);
    } catch {
        return null;
    }
};

const inferredSource = (host) => socialSources.find(([domain]) => host?.endsWith(domain))?.[1] || null;

export const getFunnelSessionId = () => pageSessionId;

export const readAttribution = ({ searchParams, pathname }) => {
    const host = referrerHost();
    const source = clean(searchParams.get("utm_source"), 80) || inferredSource(host) || "direct";
    const medium = clean(searchParams.get("utm_medium"), 80)
        || (source === "direct" ? "direct" : "organic_social");

    return {
        funnelSessionId: getFunnelSessionId(),
        source,
        medium,
        campaign: clean(searchParams.get("utm_campaign"), 120)
            || (pathname === "/gratis-meditationen" ? "free_member_funnel" : null),
        content: clean(searchParams.get("utm_content"), 120),
        term: clean(searchParams.get("utm_term"), 120),
        landingPath: clean(pathname, 255),
        referrerHost: host,
    };
};

export const trackFunnelEvent = async ({ eventName, eventKey, attribution, locale }) => {
    try {
        await fetch("/api/analytics/funnel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName,
                eventKey,
                attribution,
                locale,
            }),
            keepalive: true,
        });
    } catch {
        // Funnel measurement must never interrupt the visitor experience.
    }
};
