import type { Point } from '../scene/trajectories';
export type RallyResult={winner:'visitor'|'npc';reason:'returned'|'missed'|'out'};
export type VisitorInput={racket?:Point;swing?:number;roaming:boolean;x:number;z:number;yaw:number;pitch:number;keys:Set<string>;launch:Point};
export const createVisitorInput=():VisitorInput=>({roaming:false,x:-1.5,z:9.35,yaw:0,pitch:0,keys:new Set(),launch:[-1.5,1.2,9.35]});
export function moveVisitor(input:VisitorInput,dt:number){
 const held=(a:string,b:string)=>input.keys.has(a)||input.keys.has(b);
 let x=Number(held('KeyD','ArrowRight'))-Number(held('KeyA','ArrowLeft')),z=Number(held('KeyS','ArrowDown'))-Number(held('KeyW','ArrowUp'));
 const length=Math.hypot(x,z)||1,speed=5.5*Math.min(dt,.05);x/=length;z/=length;
 const edge=input.roaming?5.7:4.1;
 input.x=Math.max(-edge,Math.min(edge,input.x+x*speed));input.z=Math.max(input.roaming?-10.2:2.4,Math.min(input.roaming?10.2:10.0,input.z+z*speed));

}
export const inBounds=(target:readonly number[])=>Math.abs(target[0])<=4.35&&target[1]<=-.15&&target[1]>=-8.7;
// Alternate wings while varying width and depth independently of the serve.
const patterns = [
  [-2.0, 3.7, 2.45, -6.7],
  [2.6, 4.4, -2.15, -5.35],
  [-2.8, 4.8, 1.65, -7.35],
  [1.85, 3.5, -2.75, -6.1],
] as const;
const pattern = (shot: number) => patterns[Math.abs(shot - 1) % patterns.length];
export const returnLane = (opponentX: number, shot: number) =>
  Math.max(-3.1, Math.min(3.1, pattern(shot)[0] - opponentX * .12));
export const returnDepth = (shot: number) => pattern(shot)[1];
export const automaticTarget = (shot: number): [number, number] =>
  [pattern(shot)[2], pattern(shot)[3]];

// Interpolate the impact on the moving racket plane to prevent a position jump at contact.
export function racketIntersection(previous:Point,current:Point,before:Point,now:Point):Point | null {
  const a = previous[2] - before[2], b = current[2] - now[2];
  if (a > 0 || b < 0 || b-a < 1e-8) return null;
  const t = -a / (b-a);
  const lerp = (start:number,end:number) => start + (end-start)*t;
  const hit:Point = [lerp(previous[0],current[0]),lerp(previous[1],current[1]),lerp(previous[2],current[2])];
  const dx = hit[0] - lerp(before[0],now[0]), dy = hit[1] - lerp(before[1],now[1]);
  return (dx/.64)**2 + (dy/.72)**2 <= 1 ? hit : null;
}
export function returnLanding(contact:Point, input:Pick<VisitorInput,'yaw'|'pitch'>, shot:number):[number,number] {
  const width = 1.4 + Math.abs(pattern(shot)[0]) * .45;
  const direction = Math.abs(contact[0]) > .3 ? -Math.sign(contact[0]) : Math.sign(pattern(shot)[0]);
  return [direction * width + Math.tan(input.yaw)*10, pattern(shot+1)[3] + input.pitch*5];
}
// Craft centers stay at least a full wingspan outside the entire court platform.
export function airRoute(index:number,_t:number,_night:boolean):Point{
 // Fixed perimeter anchors. Object clicks play a short local animation only.
 const anchors:Point[]=[[-14,6,-4],[-14,5,8],[22,8,4],[12,8,-10]];
 return [...anchors[index]] as Point;
}

export const baselineRotation=(end:number)=>end>0?0:Math.PI;
