import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../deployment/worker.js';
const origin='https://luluzhao.me';
const first='11111111-1111-4111-8111-111111111111',second='22222222-2222-4222-8222-222222222222';
const request=(visitor,source=origin)=>new Request(origin+'/api/visit',{method:'POST',headers:{Origin:source,'Content-Type':'application/json'},body:JSON.stringify({visitor})});
test('private visitor storage deduplicates browsers and never stores the raw identifier',async()=>{
 const entries=new Map(),env={VISITORS:{get:async k=>entries.get(k),put:async(k,v)=>entries.set(k,v)}};
 for(const id of [first,first,second])assert.equal((await worker.fetch(request(id),env)).status,204);
 assert.equal([...entries.keys()].filter(k=>k.startsWith('visitor:')).length,2);
 assert.equal([...entries.keys()].filter(k=>k.startsWith('day:')).length,2);
 assert.ok(!JSON.stringify([...entries]).includes(first));
});
test('stats have no public read endpoint and reject invalid or foreign submissions',async()=>{
 assert.equal((await worker.fetch(new Request(origin+'/api/visit'),{})).status,405);
 assert.equal((await worker.fetch(request(first,'https://elsewhere.example'),{})).status,403);
 assert.equal((await worker.fetch(request('not-a-uuid'),{})).status,400);
});
