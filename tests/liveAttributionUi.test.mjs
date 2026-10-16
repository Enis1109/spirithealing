import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

test("actual registration route offers separate unchecked measurement only on marked links", async () => {
    const server = await createServer({ configFile: false, plugins: [react()],
        resolve: { alias: { "@": path.resolve("src") } },
        optimizeDeps: { noDiscovery:true, include:[], entries:[] },
        server: { middlewareMode:true, watch:null, hmr:false, ws:false }, appType:"custom" });
    try {
        const { LiveTalkSecond } = await server.ssrLoadModule("/src/sections/LiveTalkSecond.jsx");
        const render = url => renderToStaticMarkup(createElement(MemoryRouter,{initialEntries:[url]},createElement(LiveTalkSecond)));
        const marked = render("/live-vortrag/20-oktober?sh_source=lt20-a01");
        assert.match(marked,/name="measurement"/);
        assert.doesNotMatch(marked,/name="measurement"[^>]*(?:checked|required)/);
        assert.match(marked,/keine Cookies und senden diese Angaben nicht an Meta/);
        assert.match(marked,/18\. Januar 2027/);
        assert.doesNotMatch(render("/live-vortrag/20-oktober"),/name="measurement"/);
        assert.doesNotMatch(render("/live-vortrag/20-oktober?sh_source=bad@example.test"),/name="measurement"/);
        assert.match(marked,/20\. Oktober 2026, 20 Uhr deutscher Zeit/);
        const { FamilyLecture } = await server.ssrLoadModule("/src/sections/FamilyLecture.jsx");
        const renderFamily = url => renderToStaticMarkup(createElement(MemoryRouter,{initialEntries:[url]},createElement(FamilyLecture)));
        const familyMarked=renderFamily("/live-vortrag/familienaufstellung?sh_source=fa27-b01");
        assert.match(familyMarked,/name="measurement"/);
        assert.doesNotMatch(familyMarked,/<input(?=[^>]*name="measurement")(?=[^>]*(?:checked|required))[^>]*>/);
        assert.match(familyMarked,/25\. Januar 2027/);
        assert.match(familyMarked,/<input(?=[^>]*name="recording")(?=[^>]*required)[^>]*>/);
        assert.match(familyMarked,/27\. Oktober 2026 · 20 Uhr deutscher Zeit/);
        assert.doesNotMatch(familyMarked,/zoom\.us\/j\//);
        assert.doesNotMatch(renderFamily("/live-vortrag/familienaufstellung"),/name="measurement"/);
        assert.doesNotMatch(renderFamily("/live-vortrag/familienaufstellung?sh_source=lt20-a01"),/name="measurement"/);
        const familyC02=renderFamily("/live-vortrag/familienaufstellung?sh_source=fa27-c02");
        assert.match(familyC02,/name="measurement"/);
        assert.doesNotMatch(familyC02,/<input(?=[^>]*name="measurement")(?=[^>]*(?:checked|required))[^>]*>/);
    } finally { await server.close(); }
});

test("production wiring normalizes source at the right event and protects withdrawal", () => {
    const routes = readFileSync("server.js","utf8");
    assert.match(routes,/liveTalk2Service\.register\(normalizeLiveRegistration\(request.body, liveTalk2\)\)/);
    assert.match(routes,/app.post\("\/api\/live-talk-2\/attribution\/withdraw", submissionLimiter, sameOriginOnly/);
    const client = readFileSync("src/sections/LiveTalkSecond.jsx","utf8");
    assert.match(client,/sourceCode && data.get\("measurement"\) === "on"/);
    assert.doesNotMatch(client,/fbq\(|trackFunnelEvent|localStorage|sessionStorage/);
    const admin = readFileSync("src/sections/AdminLiveTalk.jsx","utf8");
    assert.match(admin,/<LiveAttributionReport data=\{data\}/);
});
