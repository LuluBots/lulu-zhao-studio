import test from 'node:test';
import assert from 'node:assert/strict';
import {OrthographicCamera,Vector3} from 'three';
import {obscuresScoreboard} from '../src/scene/scoreboardVisibility.ts';
test('clouds and aircraft overlapping either scoreboard are suppressed for every orbit quadrant',()=>{
 for(const x of [-23,23])for(const z of [-30,30]){
  const camera=new OrthographicCamera(-20,20,16,-16,.1,180);camera.position.set(x,25,z);camera.lookAt(0,0,0);camera.updateMatrixWorld();
  for(const end of [-1,1]){const board=new Vector3(end*6.5,1.4,end*11.4);const cloud=board.clone().lerp(camera.position,.2);assert.equal(obscuresScoreboard(camera,cloud,2),true)}
  assert.equal(obscuresScoreboard(camera,new Vector3(90,-10,90),1),false);
 }
});
