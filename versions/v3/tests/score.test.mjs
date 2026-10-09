import test from 'node:test';
import assert from 'node:assert/strict';
import {initialScore,awardPoint,pointLabel,daylightAt} from '../src/state/score.ts';
import {initialRally,rallyReducer} from '../src/state/rally.ts';
test('tennis score advances 0,15,30,40 and then a game without mutating prior score',()=>{
 let s=initialScore;for(const label of ['0','15','30','40']){assert.equal(pointLabel(s,'technology'),label);s=awardPoint(s,'technology')}
 assert.equal(s.games.technology,1);assert.equal(pointLabel(s,'technology'),'0');assert.equal(initialScore.games.technology,0);
});
test('deuce requires two consecutive points; a lost advantage returns to deuce',()=>{
 let s={points:{humanities:3,technology:3},games:{humanities:0,technology:0}};
 s=awardPoint(s,'humanities');assert.equal(pointLabel(s,'humanities'),'AD');s=awardPoint(s,'technology');assert.equal(pointLabel(s,'humanities'),'40');
 s=awardPoint(awardPoint(s,'technology'),'technology');assert.equal(s.games.technology,1);assert.equal(s.points.humanities,0);
});
test('switching identity never exchanges accumulated score',()=>{
 const score=awardPoint(initialScore,'technology');let rally=rallyReducer(initialRally,'switch');rally=rallyReducer(rally,'arrived');assert.equal(rally.side,'humanities');assert.equal(pointLabel(score,'technology'),'15');assert.equal(pointLabel(score,'humanities'),'0');
});
test('automatic day/night boundaries use local 07:00 and 19:00',()=>{assert.equal(daylightAt(6),false);assert.equal(daylightAt(7),true);assert.equal(daylightAt(18),true);assert.equal(daylightAt(19),false)});
