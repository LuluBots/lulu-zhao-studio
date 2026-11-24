import test from 'node:test';
import assert from 'node:assert/strict';
import { createVisitorInput,moveVisitor,racketIntersection,inBounds,returnLane,returnDepth,returnLanding,automaticTarget,airRoute,baselineRotation } from '../src/state/gameplay.ts';
import { receptionPoint,sampleTargetFlight,targetPoint,samplePlayerPosition,sampleIncoming,incomingX,incomingBounceAt } from '../src/scene/trajectories.ts';
test('WASD moves both court axes, normalizes diagonals and clamps movement without changing the view',()=>{
 const a=createVisitorInput(),b=createVisitorInput();a.keys.add('KeyD');b.keys.add('KeyD');b.keys.add('KeyW');moveVisitor(a,.05);moveVisitor(b,.05);
 assert.ok(Math.abs(Math.hypot(b.x+1.5,b.z-9.35)-(a.x+1.5))<1e-8);
 b.keys.add('ArrowRight');for(let i=0;i<1000;i++)moveVisitor(b,.05);assert.equal(b.x,4.1);assert.equal(b.z,2.4);assert.equal(b.yaw,0);
 b.keys.clear();b.keys.add('KeyS');moveVisitor(b,.05);assert.ok(b.z>2.4);
});
test('swept reception catches the real racket intersection, not a distant or high ball',()=>{
 const from=[-1.2,1.2,6],to=[-1.2,1.2,7],hand=[-1.2,1.2,6.5];
 assert.deepEqual(racketIntersection(from,to,hand,hand),[-1.2,1.2,6.5]);
 assert.equal(racketIntersection(from,to,[.45,1.2,6.5],[.45,1.2,6.5]),null);
 assert.equal(racketIntersection([-1.2,3,6],[-1.2,3,7],hand,hand),null);
 assert.deepEqual(racketIntersection([0,1.2,6],[0,1.2,7],[-.5,1.2,6.5],[.5,1.2,6.5]),[0,1.2,6.5]);
});
test('each incoming shot keeps its heading at the bounce, clears the net and can be intercepted',()=>{
 for(let shot=1;shot<=4;shot++){
  const contact=receptionPoint(targetPoint(automaticTarget(shot)),.5),lane=returnLane(contact[0],shot),depth=returnDepth(shot);
  const bounceAt=incomingBounceAt(contact,depth),bounce=sampleIncoming(bounceAt,contact,lane,depth);
  assert.ok(Math.abs(bounce[2]-depth)<1e-8 && Math.abs(bounce[1]-.14)<1e-8);
  const hand=[incomingX(8.5,contact,lane),1.2,8.5];let previous=contact,impact=null;
  for(let i=1;i<=200;i++){
   const p=sampleIncoming(i/200,contact,lane,depth);
   assert.ok(Math.abs((p[0]-contact[0])*(bounce[2]-contact[2])-(p[2]-contact[2])*(bounce[0]-contact[0]))<1e-8);
   if(Math.abs(p[2])<.1)assert.ok(p[1]>1.1);
   impact ||= racketIntersection(previous,p,hand,hand);previous=p;
  }
  assert.ok(impact);
 }
});
test('shots use distinct targets and returns leave from the actual contact',()=>{
 const origin=[-2,1.2,4],target=targetPoint([1,-5]);assert.deepEqual(sampleTargetFlight(0,target,.5,origin),origin);
 assert.equal(new Set([1,2,3,4].map(n=>automaticTarget(n).join(','))).size,4);
 assert.equal(inBounds([4.35,-8.7]),true);assert.equal(inBounds([4.36,-4]),false);assert.equal(inBounds([0,-9]),false);
 const contact=[-2,1.3,7];
 assert.equal(inBounds(returnLanding(contact,{yaw:.5,pitch:0},1)),false);
 const landing=returnLanding(contact,{yaw:0,pitch:0},1);
 assert.ok(inBounds(landing));assert.ok(landing[0]>0);assert.notDeepEqual(landing,automaticTarget(1));
});
test('full craft footprint stays outside court airspace through entire day/night routes',()=>{
 for(const night of [false,true])for(let i=0;i<4;i++)for(let t=0;t<160;t+=.1){const [x,,z]=airRoute(i,t,night);assert.ok(Math.abs(x)-3>6.2||Math.abs(z)-3>11.85)}
});
test('signature faces inward from the external baseline at either end',()=>{assert.equal(baselineRotation(1),0);assert.equal(baselineRotation(-1),Math.PI)});

test('arrow keys and WASD are equivalent and combined keys never double speed',()=>{for(const [letter,arrow] of [['KeyW','ArrowUp'],['KeyS','ArrowDown'],['KeyA','ArrowLeft'],['KeyD','ArrowRight']]){const a=createVisitorInput(),b=createVisitorInput(),c=createVisitorInput();a.keys.add(letter);b.keys.add(arrow);c.keys.add(letter);c.keys.add(arrow);moveVisitor(a,.05);moveVisitor(b,.05);moveVisitor(c,.05);assert.equal(a.x,b.x);assert.equal(a.z,b.z);assert.equal(a.x,c.x);assert.equal(a.z,c.z);assert.equal(b.yaw,0);assert.equal(b.pitch,0)}});

test('idle exploration crosses the net and reaches both full-court ends',()=>{
 const input=createVisitorInput();input.roaming=true;input.keys.add('KeyW');for(let i=0;i<100;i++)moveVisitor(input,.05);assert.equal(input.z,-10.2);
 input.keys.clear();input.keys.add('ArrowDown');for(let i=0;i<100;i++)moveVisitor(input,.05);assert.equal(input.z,10.2);
 input.keys.clear();input.keys.add('KeyD');for(let i=0;i<100;i++)moveVisitor(input,.05);assert.equal(input.x,5.7);assert.equal(input.yaw,0);
 input.roaming=false;moveVisitor(input,0);assert.equal(input.x,4.1);assert.equal(input.z,10);
});

test('new visitor starts on the left with no handedness setting',()=>{const v=createVisitorInput();assert.equal(v.x,-1.5);assert.equal('hand' in v,false)});

test("serve setup stands behind opposite baselines in diagonal halves",()=>{const v=createVisitorInput();assert.ok(v.z>8.7);assert.ok(v.x<0);const npc=samplePlayerPosition(0,targetPoint());assert.ok(npc[2]<-8.7);assert.ok(npc[0]>0);moveVisitor(v,.01);assert.equal(v.z,9.35)});

test("section anchors stay fixed as time passes",()=>{for(let i=0;i<4;i++)for(const night of [false,true])assert.deepEqual(airRoute(i,120,night),airRoute(i,0,night))});
