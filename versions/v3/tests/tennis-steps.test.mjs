import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { stepTarget } from '../src/scene/tennisSteps.ts';
import { otherSide } from '../src/state/rally.ts';
test('both ends always have complementary identities through repeated swaps',()=>{
 let side='technology';for(let i=0;i<10;i++){assert.notEqual(side,otherSide(side));assert.equal(otherSide(otherSide(side)),side);side=otherSide(side)}
});
test('stance remains grounded, the recovering foot clears the court, lateral steps cross',()=>{
 for(const direction of [new Vector3(1,0,0),new Vector3(-1,0,0),new Vector3(0,0,1)]){
  const a=stepTarget(.05,-1,direction),b=stepTarget(.55,-1,direction);
  assert.equal(a.y,.17);assert.equal(b.y,.17);assert.ok(b.clone().sub(a).dot(direction)<0);
  assert.ok(stepTarget(.80,-1,direction).y>.30);
  assert.ok(stepTarget(0,-1,direction).distanceTo(stepTarget(1,-1,direction))<1e-8);
 }
 assert.ok(stepTarget(0,-1,new Vector3(1,0,0)).x>0);
});
