import test from 'node:test';
import assert from 'node:assert/strict';
import { explorationReducer as reduce, initialExploration as initial, selectedEntry } from '../src/state/exploration.ts';
import { projects, articles } from '../src/content/profile.ts';
import { sampleFlight, flightPaths } from '../src/scene/trajectories.ts';
test('preview locks exact entry through the flight and only its completion opens it',()=>{
 let state=reduce(initial,{type:'preview',entry:projects[1]});state=reduce(state,{type:'launch',shot:8});
 assert.equal(reduce(state,{type:'preview',entry:projects[2]}),state);
 assert.equal(reduce(state,{type:'launch',shot:9}),state);
 assert.equal(reduce(state,{type:'complete',shot:7}),state);
 state=reduce(state,{type:'complete',shot:8});assert.equal(state.panel,'detail');assert.equal(state.entry.id,'movebot');
});
test('cancellation discards flight; stale completion cannot reopen a card',()=>{
 let state=reduce(initial,{type:'preview',entry:projects[0]});state=reduce(state,{type:'launch',shot:3});state=reduce(state,{type:'close'});
 assert.equal(reduce(state,{type:'complete',shot:3}),initial);
});
test('Read now bypasses flight and each side resolves only its own entries',()=>{
 const state=reduce(reduce(initial,{type:'preview',entry:articles[0]}),{type:'read'});
 assert.equal(state.panel,'detail');assert.equal(state.shot,null);
 assert.equal(selectedEntry(articles,'movebot').side,'humanities');assert.equal(selectedEntry([], 'missing'),undefined);
});
test('configured IDs and links are safe and unique; every flight clears the net',()=>{
 const entries=[...projects,...articles];assert.equal(new Set(entries.map(e=>e.id)).size,entries.length);
 for(const entry of entries){assert.ok(flightPaths[entry.trajectory]);if(entry.url)assert.equal(new URL(entry.url).protocol,'https:')}
 for(const path of Object.keys(flightPaths))for(let i=0;i<=1000;i++){const [x,y,z]=sampleFlight(i/1000,path);assert.ok(Number.isFinite(x));if(Math.abs(z)<.1)assert.ok(y>1.1)}
 assert.notDeepEqual(sampleFlight(.25,'straight'),sampleFlight(.25,'crosscourt'));
});
test('empty collections can be previewed and never launch a fake discovery',()=>{
 const state=reduce(initial,{type:'preview',entry:null});assert.equal(state.panel,'preview');
 assert.equal(reduce(state,{type:'launch',shot:1}),state);assert.equal(state.entry,null);
});
test('arbitrary court shots continue forward after bouncing and Lulu meets their contact point',async()=>{
 const {sampleTargetFlight,targetPoint,receptionPoint,samplePlayerPosition,CONTACT_AT}=await import('../src/scene/trajectories.ts');
 for(const x of [-4.3,-2,0,2,4.3])for(const z of [-8.6,-6,-3,-.2]){
  const target=targetPoint([x,z]),contact=receptionPoint(target),player=samplePlayerPosition(CONTACT_AT,target);
  assert.ok(contact[2]<target[2]);assert.ok(contact[2]>=-9.4);
  assert.ok(Math.abs((contact[0]-target[0])*(target[2]-6.5)-(contact[2]-target[2])*(target[0]-.45))<1e-8);
  assert.ok(Math.abs(contact[0]-player[0]-.75)<1e-8);assert.ok(Math.abs(contact[2]-player[2]-.47)<1e-8);
  for(let i=0;i<=2000;i++){const p=sampleTargetFlight(i/2000,target);assert.ok(p.every(Number.isFinite));if(Math.abs(p[2])<.02)assert.ok(p[1]>1.1)}
 }
});

test('hold duration controls power, flight speed, arc and receiver while keeping the selected bounce',async()=>{
 const {chargePower,shotDuration,sampleTargetFlight,targetPoint,receptionPoint,samplePlayerPosition,BOUNCE_AT,CONTACT_AT}=await import('../src/scene/trajectories.ts');
 assert.equal(chargePower(0),.25);assert.equal(chargePower(1200),1);assert.equal(chargePower(9000),1);
 assert.ok(shotDuration(.25)>shotDuration(1));
 const target=targetPoint([2,-4]);
 assert.ok(sampleTargetFlight(.24,target,.25)[1]>sampleTargetFlight(.24,target,1)[1]);
 assert.notDeepEqual(receptionPoint(target,.25),receptionPoint(target,1));
 for(const power of [.25,.5,1])for(const x of [-4.3,0,4.3])for(const z of [-8.6,-3,-.2]){
  const t=targetPoint([x,z]);sampleTargetFlight(BOUNCE_AT,t,power).forEach((v,i)=>assert.ok(Math.abs(v-t[i])<1e-8));
  const contact=receptionPoint(t,power),player=samplePlayerPosition(CONTACT_AT,t,power);
  assert.ok(Math.abs(contact[0]-player[0]-.75)<1e-8);assert.ok(Math.abs(contact[2]-player[2]-.47)<1e-8);
  for(let i=0;i<=2000;i++){const p=sampleTargetFlight(i/2000,t,power);assert.ok(p.every(Number.isFinite));if(Math.abs(p[2])<.02)assert.ok(p[1]>1.1)}
 }
});

test('M6 rally tempo remains under three seconds with useful power differentiation',async()=>{
 const {shotDuration}=await import('../src/scene/trajectories.ts');
 assert.ok(shotDuration(.25)<3);assert.ok(shotDuration(1)>=1.8);assert.ok(shotDuration(.25)-shotDuration(1)>.8);
});
