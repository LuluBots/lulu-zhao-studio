import test from 'node:test';
import assert from 'node:assert/strict';
import {Vector3} from 'three';
import {createMatchCamera,frameMatchCamera} from '../src/scene/matchCamera.ts';
test('match projection preserves equal near/far baseline widths across aspect ratios and orbit angles',()=>{
 for(const [w,h] of [[1280,720],[390,844]])for(const eye of [[23,25,30],[0,13,22],[-18,15,25]]){
  const camera=createMatchCamera();frameMatchCamera(camera,w,h);camera.position.set(...eye);camera.lookAt(0,0,0);camera.updateMatrixWorld();
  const baseline=z=>new Vector3(4.35,0,z).project(camera).sub(new Vector3(-4.35,0,z).project(camera));
  assert.ok(baseline(-8.7).distanceTo(baseline(8.7))<1e-10);
  for(const factor of [.4,1,3]){camera.zoom*=factor;camera.updateProjectionMatrix();assert.ok(baseline(-8.7).distanceTo(baseline(8.7))<1e-10)}
 }
});
