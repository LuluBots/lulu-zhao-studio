import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleCloud,cloudEnvelope,selectCloudVariant} from '../src/scene/cloudMotion.ts';
test('responsive wake still requires both spacing and time',()=>{
 const p={x:0,y:0,time:0};
 assert.equal(sampleCloud(null,p),false);
 assert.equal(sampleCloud(p,{x:200,y:0,time:100}),false);
 assert.equal(sampleCloud(p,{x:30,y:0,time:1000}),false);
 assert.equal(sampleCloud(p,{x:60,y:0,time:160}),true);
});
test('wake is visible quickly without flashing, and fully disappears',()=>{
 assert.equal(cloudEnvelope(.09),0);
 assert.ok(cloudEnvelope(.2)>0&&cloudEnvelope(.2)<.5);
 assert.equal(cloudEnvelope(.5),1);
 assert.ok(cloudEnvelope(4)<1&&cloudEnvelope(4)>0);
 assert.equal(cloudEnvelope(5),0);
 assert.equal(cloudEnvelope(Infinity),0);
});
test('random library selection is bounded and never repeats the preceding shape',()=>{
 for(let previous=0;previous<4;previous++)for(const r of [0,.2,.5,.9,1]){const chosen=selectCloudVariant(previous,4,r);assert.ok(chosen>=0&&chosen<4);assert.notEqual(chosen,previous)}
 assert.equal(selectCloudVariant(0,1,.5),0);
});
