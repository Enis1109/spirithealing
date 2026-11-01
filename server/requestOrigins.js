// Existing policies, extracted unchanged so route tests exercise production behavior.
export function createRequestOrigins(productionOrigin) {
const sameOriginOnly = (request, response, next) => {
    const origin = request.get("origin");
    if (!origin || origin.replace("://www.", "://") === productionOrigin.replace("://www.", "://") || /^http:\/\/127\.0\.0\.1:\d+$/u.test(origin) || /^http:\/\/localhost:\d+$/u.test(origin)) {
        return next();
    }
    return response.status(403).json({ ok: false, error: "origin" });
};

const adminSameOriginOnly = (request, response, next) => {
    const origin = request.get("origin");
    const normalizedOrigin = String(origin || "").replace("://www.", "://");
    const normalizedProductionOrigin = productionOrigin.replace("://www.", "://");
    const isLocal = /^http:\/\/(127\.0\.0\.1|localhost):\d+$/u.test(origin || "");
    if (origin && (normalizedOrigin === normalizedProductionOrigin || isLocal)) return next();
    return response.status(403).json({ ok: false, error: "origin" });
};

return { sameOriginOnly, adminSameOriginOnly };
}
