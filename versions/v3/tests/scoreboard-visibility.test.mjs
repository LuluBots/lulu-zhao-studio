import test from 'node:test';
import assert from 'node:assert/strict';
import {OrthographicCamera,Vector3} from 'three';
import {obscuresScoreboard,obscuresCourt} from '../src/scene/scoreboardVisibility.ts';
test('clouds and aircraft overlapping either scoreboard are suppressed for every orbit quadrant',()=>{
 for(const x of [-23,23])for(const z of [-30,30]){
  const camera=new OrthographicCamera(-20,20,16,-16,.1,180);camera.position.set(x,25,z);camera.lookAt(0,0,0);camera.updateMatrixWorld();
  for(const end of [-1,1]){const board=new Vector3(end*4.55,1.4,end*10.30);const cloud=board.clone().lerp(camera.position,.2);assert.equal(obscuresScoreboard(camera,cloud,2),true)}
  assert.equal(obscuresScoreboard(camera,new Vector3(90,-10,90),1),false);
 }
});

// A craft in front of the court must be hidden regardless of camera quadrant.
test('playing surface is protected when the camera orbits',()=>{
 for(const x of [-23,23])for(const z of [-30,30]){
  const camera=new OrthographicCamera(-24,24,20,-20,.1,180);camera.position.set(x,25,z);camera.lookAt(0,0,0);camera.updateMatrixWorld();
  const foreground=new Vector3(0,.2,0).lerp(camera.position,.2);
  assert.equal(obscuresCourt(camera,foreground,2),true);
  assert.equal(obscuresCourt(camera,new Vector3(80,30,80),2),false);
 }
});
