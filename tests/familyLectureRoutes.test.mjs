import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { registerFamilyLectureRoutes } from "../server/familyLectureRoutes.js";
import { liveTalkFamily } from "../server/liveTalkConfig.js";

test("family HTTP routes enforce recording acknowledgement, separate source and admin authentication", async () => {
    const app=express(); app.use(express.json());
    const accepted=[];
    const next=(_request,_response,proceed)=>proceed();
    registerFamilyLectureRoutes(app,{
        submissionLimiter:next,analyticsLimiter:next,sameOriginOnly:next,adminSameOriginOnly:next,
        getAdminMember:async(_req,res)=>{res.status(401).json({ok:false});return null;},
        service:{publicInfo:async()=>({...liveTalkFamily,ready:true}),register:async form=>{accepted.push(form);return {accepted:true};},access:async()=>null,cancel:async()=>false,withdrawAttribution:async()=>false}
    });
    const server=await new Promise((resolve,reject)=>{const handle=app.listen(0,"127.0.0.1",error=>error?reject(error):resolve(handle));handle.on("error",reject);});
    const base=`http://127.0.0.1:${server.address().port}`;
    const post=(path,body)=>fetch(base+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    try {
        const info=await fetch(base+"/api/live-talk-family");
        assert.equal(info.headers.get("cache-control"),"no-store");
        const payload=await info.json();assert.equal(payload.event.key,liveTalkFamily.key);assert.equal(payload.event.joinUrl,undefined);
        const form={name:"Test",email:"test@example.test",privacyConsent:true};
        const rejected=await post("/api/live-talk-family/register",form);
        assert.equal(rejected.status,400);assert.equal((await rejected.json()).field,"recordingNotice");assert.equal(accepted.length,0);
        assert.equal((await post("/api/live-talk-family/register",{...form,recordingNoticeAccepted:true})).status,202);
        assert.equal(accepted.length,1);assert.equal(accepted[0].newsletterConsent,false);
        assert.equal((await post("/api/live-talk-family/access",{token:"wrong"})).status,404);
        assert.equal((await fetch(base+"/api/admin/live-talk-family")).status,401);
    } finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
