import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { liveAttributionEvent, summarizeLiveAttribution } from "../shared/liveAttribution.js";
import { familyLecture } from "../shared/familyLecture.js";

test("admin contact table shows each contact once beside their event-scoped source", async () => {
    const server = await createServer({ configFile: false, plugins: [react()],
        resolve: { alias: { "@": path.resolve("src") } },
        optimizeDeps: { noDiscovery:true, include:[], entries:[] },
        server: { middlewareMode:true, watch:null, hmr:false, ws:false }, appType:"custom" });
    try {
        const { LiveAttributionReport } = await server.ssrLoadModule("/src/components/LiveAttributionReport.jsx");
        const registrations=[
            {id:1,name:"Meta Test",email:"meta@example.test",status:"active",source_code:"lt20-a01",kind:"confirmation"},
            {id:"1",name:"Meta Test",email:"meta@example.test",status:"active",source_code:"lt20-a01",kind:"day"},
            {id:2,name:"Unassigned Test",email:"unknown@example.test",status:"active",source_code:null},
            {id:3,name:"Cancelled Test",email:"cancelled@example.test",status:"cancelled",source_code:"lt20-e08"},
            {id:4,name:"Wrong Event",email:"wrong@example.test",status:"active",source_code:"fa27-c02"},
            {id:5,name:"Unsafe Test",email:"safe@example.test",status:"active",source_code:"__proto__"},
        ];
        const render=(rows,key=liveAttributionEvent)=>renderToStaticMarkup(createElement(LiveAttributionReport,{
            data:{key,registrations:rows,attributionReport:summarizeLiveAttribution(rows,key)},registrationPath:"/live-vortrag/20-oktober"}));
        const html=render(registrations);
        const table=html.match(/<table aria-label="Kontakte und Quellen"[\s\S]*?<\/table>/)[0];
        assert.equal((table.match(/meta@example.test/g)||[]).length,1);
        assert.match(table,/<td[^>]*>Meta Test<\/td><td[^>]*>meta@example.test<\/td><td[^>]*>Meta-Anzeige 1<\/td>/);
        assert.equal((table.match(/Nicht zugeordnet/g)||[]).length,3);
        assert.match(table,/E-Mail E8<\/td><td[^>]*>Abgesagt/);
        assert.doesNotMatch(table,/__proto__|fa27-c02|lt20-a01/);
        assert.match(render([]),/Noch keine Anmeldungen/);
        assert.match(render([{id:6,name:"Family Test",email:"family@example.test",status:"active",source_code:"fa27-c02"}],familyLecture.key),/Meta-Anzeige Familienaufstellung C02/);
        const withdrawn=render([{...registrations[0],source_code:null}]);
        assert.match(withdrawn,/<td[^>]*>meta@example.test<\/td><td[^>]*>Nicht zugeordnet/);
        assert.match(render([{...registrations[0],name:"<script>not executed</script>"}]),/&lt;script&gt;not executed&lt;\/script&gt;/);
    } finally { await server.close(); }
});

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
