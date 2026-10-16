import { familyLecture } from "../shared/familyLecture.js";
import { liveTalkFamily, normalizeLiveRegistration } from "./liveTalkConfig.js";
import { WebinarValidationError } from "./webinarValidation.js";

export const registerFamilyLectureRoutes = (app, { service, submissionLimiter, analyticsLimiter,
    sameOriginOnly, adminSameOriginOnly, getAdminMember }) => {
    const endpoint = familyLecture.endpoint;
    const privateHeaders = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };
    app.get(endpoint, async (_request, response) => {
        response.set(privateHeaders);
        try { return response.json({ ok: true, event: await service.publicInfo() }); }
        catch { return response.status(503).json({ ok: false, error: "unavailable" }); }
    });
    app.post(`${endpoint}/register`, submissionLimiter, sameOriginOnly, async (request, response) => {
        response.set(privateHeaders);
        try { return response.status(202).json({ ok: true,
            ...await service.register(normalizeLiveRegistration(request.body, liveTalkFamily)) }); }
        catch (error) {
            if (error instanceof WebinarValidationError) return response.status(400).json({ ok: false, error: "validation", field: error.field });
            if (["closed", "full"].includes(error.code)) return response.status(409).json({ ok: false, error: error.code });
            return response.status(500).json({ ok: false, error: "server" });
        }
    });
    app.post(`${endpoint}/access`, analyticsLimiter, sameOriginOnly, async (request, response) => {
        response.set(privateHeaders);
        try {
            const access = await service.access(request.body?.token);
            return access ? response.json({ ok: true, access }) : response.status(404).json({ ok: false, error: "invalid_access" });
        } catch { return response.status(500).json({ ok: false, error: "server" }); }
    });
    for (const [action, method] of [["cancel", "cancel"], ["attribution/withdraw", "withdrawAttribution"]]) {
        app.post(`${endpoint}/${action}`, submissionLimiter, sameOriginOnly, async (request, response) => {
            response.set(privateHeaders);
            try { return await service[method](request.body?.token)
                ? response.json({ ok: true }) : response.status(404).json({ ok: false, error: "invalid_access" }); }
            catch { return response.status(500).json({ ok: false, error: "server" }); }
        });
    }
    const adminEndpoint = "/api/admin/live-talk-family";
    app.get(adminEndpoint, async (request, response) => {
        response.set(privateHeaders);
        if (!await getAdminMember(request, response)) return;
        try { return response.json({ ok: true, ...await service.adminInfo() }); }
        catch { return response.status(500).json({ ok: false, error: "server" }); }
    });
    app.put(adminEndpoint, adminSameOriginOnly, async (request, response) => {
        response.set(privateHeaders);
        if (!await getAdminMember(request, response)) return;
        try { await service.configure(request.body || {}); return response.json({ ok: true, ...await service.adminInfo() }); }
        catch (error) { return response.status(error.code === "validation" ? 400 : 500)
            .json({ ok: false, error: error.code === "validation" ? "validation" : "server" }); }
    });
};
