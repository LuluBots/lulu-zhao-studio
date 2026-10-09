import test from 'node:test';
import assert from 'node:assert/strict';
import { initialRally, rallyReducer } from '../src/state/rally.ts';
import { sampleFlight, READY_BALL, RETURN_BALL } from '../src/scene/trajectories.ts';
test('one complete exchange, ignores repeated input and returns ready',()=>{
 let s=rallyReducer(initialRally,'enter');
 assert.equal(rallyReducer(s,'hit'),s);
 s=rallyReducer(s,'arrived');s=rallyReducer(s,'hit');
 assert.equal(s.shot,1);assert.equal(rallyReducer(s,'hit'),s);
 s=rallyReducer(s,'finished');assert.equal(s.phase,'ready');
 s=rallyReducer(s,'hit');assert.equal(s.shot,2);
});
test('exit cancels every active phase and stale completion cannot restart play',()=>{
 for(const phase of ['entering','ready','playing']){
  let s=rallyReducer({...initialRally,phase,shot:3},'exit');assert.equal(s.phase,'leaving');
  assert.equal(rallyReducer(s,'finished'),s);assert.equal(rallyReducer(s,'hit'),s);
  s=rallyReducer(s,'arrived');assert.equal(s.phase,'overview');
 }
});
test('deterministic out-and-back, continuous at turnaround, clears the net both ways',()=>{
 assert.deepEqual(sampleFlight(0),READY_BALL);assert.deepEqual(sampleFlight(.5),RETURN_BALL);sampleFlight(1).forEach((v,i)=>assert.ok(Math.abs(v-READY_BALL[i])<1e-9));
 for(const t of [0,.1,.25,.5,.75,.9,1])assert.deepEqual(sampleFlight(t),sampleFlight(t));
 for(let i=0;i<=1000;i++){const p=sampleFlight(i/1000);assert.ok(p.every(Number.isFinite));if(Math.abs(p[2])<.1)assert.ok(p[1]>1.1)}
 const a=sampleFlight(.5-1e-6),b=sampleFlight(.5+1e-6);assert.ok(Math.hypot(...a.map((n,i)=>n-b[i]))<.001);
});
test('switch sides round trip preserves mode and rejects repeated switching',()=>{
 for(const phase of ['overview','ready']){
  const start={...initialRally,phase,shot:4};
  let s=rallyReducer(start,'switch');assert.equal(s.side,'humanities');assert.equal(s.phase,'switching');
  assert.equal(rallyReducer(s,'switch'),s);assert.equal(rallyReducer(s,'hit'),s);assert.equal(rallyReducer(s,'exit'),s);
  s=rallyReducer(s,'arrived');assert.equal(s.phase,phase);assert.equal(s.shot,4);
  s=rallyReducer(s,'switch');s=rallyReducer(s,'arrived');assert.equal(s.side,'technology');assert.equal(s.phase,phase);
 }
});
test('no switching while a shot or camera move is active; explicit side selection is idempotent',()=>{
 for(const phase of ['playing','entering','leaving']){
  const s={...initialRally,phase};assert.equal(rallyReducer(s,'humanities'),s);
 }
 assert.equal(rallyReducer(initialRally,'technology'),initialRally);
 const s=rallyReducer(initialRally,'humanities');assert.equal(s.side,'humanities');
});
