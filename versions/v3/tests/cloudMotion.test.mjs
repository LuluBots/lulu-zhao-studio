import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleCloud,cloudEnvelope} from '../src/scene/cloudMotion.ts';
test('cloud wake requires both travel distance and time, not every pointer event',()=>{
 const p={x:0,y:0,time:0};
 assert.equal(sampleCloud(null,p),false);
 assert.equal(sampleCloud(p,{x:200,y:0,time:100}),false);
 assert.equal(sampleCloud(p,{x:30,y:0,time:1000}),false);
 assert.equal(sampleCloud(p,{x:120,y:0,time:400}),true);
});
test('wake waits before appearing, unfolds gradually, then fades completely',()=>{
 assert.equal(cloudEnvelope(.5),0);
 assert.ok(cloudEnvelope(1)>0&&cloudEnvelope(1)<.5);
 assert.equal(cloudEnvelope(3),1);
 assert.ok(cloudEnvelope(9)<1&&cloudEnvelope(9)>0);
 assert.equal(cloudEnvelope(11),0);
 assert.equal(cloudEnvelope(Infinity),0);
});
