export const flightPaths = { straight: { label: 'A gentle return', bend: 0 }, crosscourt: { label: 'Across the court', bend: -.8 }, insideout: { label: 'An open angle', bend: .8 } } as const;
export type FlightPath = keyof typeof flightPaths;
export type Point = [number, number, number];
export const READY_BALL: Point = [.45, 1.2, 6.5];
export const RETURN_BALL: Point = [1.55, 1.2, -6.1];
export const SHOT_SECONDS = 3.6;
// A repeatable out-and-back exchange; both arcs clear the net. No physics or randomness.
export function sampleFlight(progress: number, path: FlightPath = 'straight'): Point {
  const p = Math.max(0, Math.min(1, progress));
  const returning = p > .5;
  const t = returning ? (p - .5) * 2 : p * 2;
  const start = returning ? RETURN_BALL : READY_BALL;
  const end = returning ? READY_BALL : RETURN_BALL;
  return [start[0] + (end[0] - start[0]) * t + flightPaths[path].bend * Math.sin(Math.PI*t), 1.2 + 1.8 * 4 * t * (1-t), start[2] + (end[2] - start[2]) * t];
}

// Coordinates live in the same local court space as the markers, remain fixed when identities swap ends.
export function targetPoint(target?: readonly [number,number]): Point {
  return [target?.[0] ?? 0, .14, target?.[1] ?? -3.3];
}
export const chargePower=(milliseconds:number)=>.25+.75*Math.min(1,Math.max(0,milliseconds)/1200);
export const shotDuration=(power=.5)=>3.15-1.2*Math.min(1,Math.max(0,power));
export const BOUNCE_AT=.48, CONTACT_AT=.68;
// Preserve the incoming horizontal direction after the bounce, rather than steering toward Lulu.
export function receptionPoint(target:Point,power=.5,origin:Point=READY_BALL):Point {
 const carry=Math.min(.12+.24*power,(9.4-Math.abs(target[2]))/(origin[2]+Math.abs(target[2])),(5-Math.abs(target[0]))/(Math.abs(target[0]-origin[0])+.001));
 return [target[0]+(target[0]-origin[0])*carry,1.18,target[2]+(target[2]-origin[2])*carry];
}
export function samplePlayerPosition(progress:number,target:Point,power=.5,origin:Point=READY_BALL):Point {
 const contact=receptionPoint(target,power,origin), home:Point=[.9,0,-6.7];
 const destination:Point=[contact[0]-.75,0,contact[2]-.47];
 const p=Math.max(0,Math.min(1,progress));
 const t=p<.62?Math.min(1,p/.60):1-Math.min(1,Math.max(0,(p-.73)/.27));
 const ease=t*t*(3-2*t);
 return [home[0]+(destination[0]-home[0])*ease,0,home[2]+(destination[2]-home[2])*ease];
}
export function sampleTargetFlight(progress:number,target:Point,power=.5,origin:Point=READY_BALL):Point {
 const p=Math.max(0,Math.min(1,progress)),contact=receptionPoint(target,power,origin);
 let start:Point,end:Point,t:number,height:number;
 if(p<=BOUNCE_AT){start=origin;end=target;t=p/BOUNCE_AT;
  const netT=origin[2]/(origin[2]-target[2]);
  height=Math.max(2.55-1.35*power,(1.5-(1.2+(.14-1.2)*netT))/(4*netT*(1-netT)));
 }else if(p<=CONTACT_AT){start=target;end=contact;t=(p-BOUNCE_AT)/(CONTACT_AT-BOUNCE_AT);height=.25-.15*power;}
 else {start=contact;end=origin;t=(p-CONTACT_AT)/(1-CONTACT_AT);height=2.0-.85*power;}
 return [start[0]+(end[0]-start[0])*t,start[1]+(end[1]-start[1])*t+4*height*t*(1-t),start[2]+(end[2]-start[2])*t];
}
