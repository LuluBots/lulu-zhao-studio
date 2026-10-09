import type { Side } from './rally';
export type Score={points:Record<Side,number>;games:Record<Side,number>};
export const initialScore:Score={points:{humanities:0,technology:0},games:{humanities:0,technology:0}};
export function awardPoint(score:Score,winner:Side):Score{
 const loser=winner==='humanities'?'technology':'humanities';
 const points={...score.points,[winner]:score.points[winner]+1};
 if(points[winner]>=4&&points[winner]-points[loser]>=2)return {points:{humanities:0,technology:0},games:{...score.games,[winner]:score.games[winner]+1}};
 if(points.humanities===points.technology&&points.humanities>3)return {...score,points:{humanities:3,technology:3}};
 return {...score,points};
}
export function pointLabel(score:Score,side:Side){const p=score.points[side],other=score.points[side==='humanities'?'technology':'humanities'];return p>=3&&other>=3?(p>other?'AD':'40'):['0','15','30','40'][Math.min(p,3)]}
export function daylightAt(hour:number){return hour>=7&&hour<19}
