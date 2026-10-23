export type PointerSample={x:number;y:number;time:number};
// A sparse wake, not a particle at every pointer event. Units are CSS pixels/ms.
export function sampleCloud(previous:PointerSample|null,next:PointerSample){
 return previous!==null&&next.time-previous.time>=380&&Math.hypot(next.x-previous.x,next.y-previous.y)>=110;
}
export function cloudEnvelope(age:number){
 if(age<.55||age>11)return 0;
 const smooth=(t:number)=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
 return smooth((age-.55)/1.8)*(1-smooth((age-7)/4));
}
