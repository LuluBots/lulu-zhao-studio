import test from 'node:test';
import assert from 'node:assert/strict';
import {nextRadioTrack} from '../src/state/radioTracks.ts';
test('radio shuffle excludes current track and covers every other choice',()=>{
 for(let current=0;current<3;current++){
  const choices=[0,.49,.5,.999999].map(r=>nextRadioTrack(current,3,()=>r));
  assert.ok(choices.every(i=>i!==current&&i>=0&&i<3));assert.equal(new Set(choices).size,2);
 }
 assert.equal(nextRadioTrack(-1,3,()=>0),0);assert.equal(nextRadioTrack(-1,3,()=>.999),2);
 assert.equal(nextRadioTrack(0,1),0);assert.equal(nextRadioTrack(-1,0),-1);
});
