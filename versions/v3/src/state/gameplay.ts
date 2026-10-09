import type { Point } from '../scene/trajectories';
export type RallyResult={winner:'visitor'|'npc';reason:'returned'|'missed'|'out'};
export type VisitorInput={racket?:Point;swing?:number;roaming:boolean;x:number;z:number;yaw:number;pitch:number;keys:Set<string>;launch:Point};
export const createVisitorInput=():VisitorInput=>({roaming:false,x:.45,z:6.5,yaw:0,pitch:0,keys:new Set(),launch:[.45,1.2,6.5]});
export function moveVisitor(input:VisitorInput,dt:number){
 const held=(a:string,b:string)=>input.keys.has(a)||input.keys.has(b);
 let x=Number(held('KeyD','ArrowRight'))-Number(held('KeyA','ArrowLeft')),z=Number(held('KeyS','ArrowDown'))-Number(held('KeyW','ArrowUp'));
 const length=Math.hypot(x,z)||1,speed=5.5*Math.min(dt,.05);x/=length;z/=length;
 const edge=input.roaming?5.7:4.1;
 input.x=Math.max(-edge,Math.min(edge,input.x+x*speed));input.z=Math.max(input.roaming?-10.2:2.4,Math.min(input.roaming?10.2:8.25,input.z+z*speed));

}
export const inBounds=(target:readonly number[])=>Math.abs(target[0])<=4.35&&target[1]<=-.15&&target[1]>=-8.7;
export const returnLane=(x:number,shot:number)=>Math.max(-3.2,Math.min(3.2,-x*.55+(shot%2?-1.2:1.2)));
export function sampleIncoming(t:number,contact:Point,lane:number):Point{
 const bounce:Point=[lane,.14,3.9],end:Point=[lane,.14,9.7];
 const first=t<.64,u=first?t/.64:(t-.64)/.36,a=first?contact:bounce,b=first?bounce:end;
 return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u+4*(first?1.65:1.15)*u*(1-u),a[2]+(b[2]-a[2])*u];
}
// Swept relative-plane intersection prevents tunneling even while the racket moves.
export function caughtReturn(previous:Point,current:Point,before:readonly [number,number],now:readonly [number,number],height=1.2){
 const a=previous[2]-before[1],b=current[2]-now[1];if(a>0||b<0||b-a<1e-8)return false;
 const t=-a/(b-a),x=previous[0]+(current[0]-previous[0])*t,y=previous[1]+(current[1]-previous[1])*t,racketX=before[0]+(now[0]-before[0])*t;
 return ((x-racketX)/.64)**2+((y-height)/.72)**2<=1;
}
export function returnLanding(target:readonly [number,number],input:Pick<VisitorInput,'yaw'|'pitch'>):[number,number]{return [target[0]+Math.tan(input.yaw)*10,target[1]+input.pitch*5]}
// Craft centers stay at least a full wingspan outside the entire court platform.
export function airRoute(index:number,t:number,night:boolean):Point{
 const bases:Point[]=[[-16,8,0],[-18,5,12],[18,8,4],[16,6,-13]],b=bases[index];
 return [b[0]+Math.sin(t*(night?.09:.045)+index)*1.2,b[1]+Math.sin(t*.3+index)*.4,b[2]+Math.cos(t*.09+index)*.8];
}
export const baselineRotation=(end:number)=>end>0?0:Math.PI;
