import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gzipSync,deflateSync,brotliCompressSync} from 'node:zlib';
import express from 'express';
import {registerBerlinWebhook} from '../server/berlinWebhook.js';
test('actual site JSON/asset middleware rejects encoded/trailing-frame bodies and stays healthy',async t=>{
    const source=await readFile(new URL('../server.js',import.meta.url),'utf8');
    // Evaluate the exact production parser expressions, not duplicated test options.
    const json=source.match(/app\.use\((express\.json\(\{[^}]+\}\))\)/)?.[1];
    const raw=source.match(/(express\.raw\(\{[^}]+\}\))/)?.[1];
    assert.ok(json);assert.ok(raw);
    for(const [kind,expression,mime,plain]of [['json',json,'application/json',Buffer.from('{"synthetic":true}')],['asset',raw,'application/pdf',Buffer.from('%PDF synthetic')]]){
        const app=express(),parser=Function('express','return '+expression)(express);let invoked=0;
        app.post('/probe',parser,(req,res)=>{invoked++;res.json({ok:true});});app.get('/health',(_q,res)=>res.json({ok:true}));
        app.use((error,_q,res,_next)=>res.status(error.status||500).json({ok:false}));
        const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(()=>{server.closeAllConnections();server.close();});
        const base='http://127.0.0.1:'+server.address().port;
        for(const [encoding,compress]of [['gzip',gzipSync],['deflate',deflateSync],['br',brotliCompressSync]]){
            for(const tail of [Buffer.alloc(0),Buffer.from('trailing invalid frame')]){
                const response=await fetch(base+'/probe',{method:'POST',headers:{'Content-Type':mime,'Content-Encoding':encoding},body:Buffer.concat([compress(plain),tail])});
                assert.equal(response.status,415,kind+'/'+encoding);assert.equal((await fetch(base+'/health')).status,200);
            }
        }
        assert.equal(invoked,0);assert.equal((await fetch(base+'/probe',{method:'POST',headers:{'Content-Type':mime},body:plain})).status,200);assert.equal(invoked,1);
    }
});
test('real webhook raw middleware rejects compression before signature/configuration handling',async t=>{
    const app=express();registerBerlinWebhook(app,{db:{},config:{enabled:false},ready:async()=>true});
    app.use((error,_q,res,_next)=>res.status(error.status||500).json({ok:false}));
    const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(()=>{server.closeAllConnections();server.close();});
    const base='http://127.0.0.1:'+server.address().port;
    assert.equal((await fetch(base+'/api/berlin/stripe-webhook',{method:'POST',headers:{'Content-Type':'application/json','Content-Encoding':'gzip'},body:gzipSync('{}')})).status,415);
});
