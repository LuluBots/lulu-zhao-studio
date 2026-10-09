import test from 'node:test';
import assert from 'node:assert/strict';
import { createVisitorInput,moveVisitor,caughtReturn,inBounds,returnLane,sampleIncoming,returnLanding,airRoute,baselineRotation } from '../src/state/gameplay.ts';
import { receptionPoint,sampleTargetFlight,targetPoint } from '../src/scene/trajectories.ts';
test('WASD moves both court axes, normalizes diagonals and clamps movement without changing the view',()=>{
 const a=createVisitorInput(),b=createVisitorInput();a.keys.add('KeyD');b.keys.add('KeyD');b.keys.add('KeyW');moveVisitor(a,.05);moveVisitor(b,.05);
 assert.ok(Math.abs(Math.hypot(b.x-.45,b.z-6.5)-(a.x-.45))<1e-8);
 b.keys.add('ArrowRight');for(let i=0;i<1000;i++)moveVisitor(b,.05);assert.equal(b.x,4.1);assert.equal(b.z,2.4);assert.equal(b.yaw,0);
 b.keys.clear();b.keys.add('KeyS');moveVisitor(b,.05);assert.ok(b.z>2.4);
});
test('swept reception catches the real racket intersection, not a distant or high ball',()=>{
 assert.equal(caughtReturn([-1.2,1.2,6],[-1.2,1.2,7],[-1.2,6.5],[-1.2,6.5]),true);
 assert.equal(caughtReturn([-1.2,1.2,6],[-1.2,1.2,7],[.45,6.5],[.45,6.5]),false);
 assert.equal(caughtReturn([-1.2,3,6],[-1.2,3,7],[-1.2,6.5],[-1.2,6.5]),false);
 assert.equal(caughtReturn([0,1.2,6],[0,1.2,7],[-.5,6.5],[.5,6.5]),true);
});
test('NPC return requires movement and a positioned visitor can catch it',()=>{
 for(const shot of [1,2,3]){
  const contact=receptionPoint(targetPoint([0,-3.3]),.5),lane=returnLane(0,shot);let previous=contact,caught=false,stationary=false;
  for(let i=1;i<=200;i++){const p=sampleIncoming(i/200,contact,lane);caught ||= caughtReturn(previous,p,[lane,6.5],[lane,6.5]);stationary ||= caughtReturn(previous,p,[.45,6.5],[.45,6.5]);if(Math.abs(p[2])<.1)assert.ok(p[1]>1.1);previous=p}
  assert.equal(caught,true);assert.equal(stationary,false);
 }
});
test('launch follows the moved racket; launch and return out-balls are rejected',()=>{
 const origin=[-2,1.2,4],target=targetPoint([1,-5]);assert.deepEqual(sampleTargetFlight(0,target,.5,origin),origin);
 assert.equal(inBounds([4.35,-8.7]),true);assert.equal(inBounds([4.36,-4]),false);assert.equal(inBounds([0,-9]),false);
 assert.equal(inBounds(returnLanding([0,-4],{yaw:.5,pitch:0})),false);assert.equal(inBounds(returnLanding([0,-4],{yaw:0,pitch:0})),true);
});
test('full craft footprint stays outside court airspace through entire day/night routes',()=>{
 for(const night of [false,true])for(let i=0;i<3;i++)for(let t=0;t<160;t+=.1){const [x,,z]=airRoute(i,t,night);assert.ok(Math.abs(x)-3>6.2||Math.abs(z)-3>11.85)}
});
test('signature faces inward from the external baseline at either end',()=>{assert.equal(baselineRotation(1),0);assert.equal(baselineRotation(-1),Math.PI)});

test('arrow keys and WASD are equivalent and combined keys never double speed',()=>{for(const [letter,arrow] of [['KeyW','ArrowUp'],['KeyS','ArrowDown'],['KeyA','ArrowLeft'],['KeyD','ArrowRight']]){const a=createVisitorInput(),b=createVisitorInput(),c=createVisitorInput();a.keys.add(letter);b.keys.add(arrow);c.keys.add(letter);c.keys.add(arrow);moveVisitor(a,.05);moveVisitor(b,.05);moveVisitor(c,.05);assert.equal(a.x,b.x);assert.equal(a.z,b.z);assert.equal(a.x,c.x);assert.equal(a.z,c.z);assert.equal(b.yaw,0);assert.equal(b.pitch,0)}});

test('idle exploration crosses the net and reaches both full-court ends',()=>{
 const input=createVisitorInput();input.roaming=true;input.keys.add('KeyW');for(let i=0;i<100;i++)moveVisitor(input,.05);assert.equal(input.z,-10.2);
 input.keys.clear();input.keys.add('ArrowDown');for(let i=0;i<100;i++)moveVisitor(input,.05);assert.equal(input.z,10.2);
 input.keys.clear();input.keys.add('KeyD');for(let i=0;i<100;i++)moveVisitor(input,.05);assert.equal(input.x,5.7);assert.equal(input.yaw,0);
 input.roaming=false;moveVisitor(input,0);assert.equal(input.x,4.1);assert.equal(input.z,8.25);
});
