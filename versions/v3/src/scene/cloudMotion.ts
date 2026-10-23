export type PointerSample={x:number;y:number;time:number};
// A sparse wake, not a particle at every pointer event. Units are CSS pixels/ms.
export function sampleCloud(previous:PointerSample|null,next:PointerSample){
 return previous!==null&&next.time-previous.time>=160&&Math.hypot(next.x-previous.x,next.y-previous.y)>=55;
}
export function cloudEnvelope(age:number){
 if(age<.10||age>5)return 0;
 const smooth=(t:number)=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
 return smooth((age-.10)/.38)*(1-smooth((age-3.3)/1.7));
}

export function selectCloudVariant(previous:number,count:number,random:number){return count<=1?0:(previous+1+Math.floor(Math.max(0,Math.min(.999999,random))*(count-1)))%count}
