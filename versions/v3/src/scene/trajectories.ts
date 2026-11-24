export const flightPaths = { straight: { label: 'A gentle return', bend: 0 }, crosscourt: { label: 'Across the court', bend: -.8 }, insideout: { label: 'An open angle', bend: .8 } } as const;
export type FlightPath = keyof typeof flightPaths;
export type Point = [number, number, number];
export const READY_BALL: Point = [-1.5, 1.2, 9.35];
export const SHOT_SECONDS = 3.6;
// A path is one shot through the bounce. Only a racket changes its heading.
export function incomingX(z: number, contact: Point, lane: number) {
  return contact[0] + (lane - contact[0]) * (z - contact[2]) / (8.5 - contact[2]);
}

export function incomingBounceAt(contact: Point, depth: number) {
  const toBounce = depth - contact[2];
  // The rough court takes some horizontal speed out of the bounce.
  return toBounce / (toBounce + (10.6 - depth) / .82);
}

export function sampleIncoming(progress: number, contact: Point, lane: number, depth = 3.9): Point {
  const t = Math.max(0, Math.min(1, progress));
  const bounceAt = incomingBounceAt(contact, depth);
  const beforeBounce = t <= bounceAt;
  const u = beforeBounce ? t / bounceAt : (t - bounceAt) / (1 - bounceAt);
  const z = beforeBounce ? contact[2] + (depth - contact[2]) * u : depth + (10.6 - depth) * u;
  const y = beforeBounce
    ? contact[1] * (1-u) + .14 * u + 4 * 1.65 * u * (1-u)
    : .14 + 4 * 1.5 * u * (1-u);
  return [incomingX(z, contact, lane), y, z];
}

export function sampleFlight(progress: number, path: FlightPath = 'straight'): Point {
  const aim = targetPoint([2 * flightPaths[path].bend, -4.2]);
  const p = Math.max(0, Math.min(1, progress));
  return p <= .5
    ? sampleTargetFlight(p * 2 * CONTACT_AT, aim)
    : sampleIncoming((p - .5) * 2, receptionPoint(aim), 2.1 - flightPaths[path].bend);
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
 return [target[0]+(target[0]-origin[0])*carry,1.21288,target[2]+(target[2]-origin[2])*carry];
}
export function samplePlayerPosition(progress:number,target:Point,power=.5,origin:Point=READY_BALL):Point {
 const contact=receptionPoint(target,power,origin), home:Point=[1.5,0,-9.35];
 const destination:Point=[contact[0]-.66,0,contact[2]-.4224];
 const p=Math.max(0,Math.min(1,progress));
 const t=p<.62?Math.min(1,p/.60):1-Math.min(1,Math.max(0,(p-.73)/.27));
 const ease=t*t*(3-2*t);
 return [home[0]+(destination[0]-home[0])*ease,0,home[2]+(destination[2]-home[2])*ease];
}
export function sampleTargetFlight(progress:number,target:Point,power=.5,origin:Point=READY_BALL):Point {
 const p=Math.max(0,Math.min(CONTACT_AT,progress)),contact=receptionPoint(target,power,origin);
 let start:Point,end:Point,t:number,height:number;
 if(p<=BOUNCE_AT){start=origin;end=target;t=p/BOUNCE_AT;
  const netT=origin[2]/(origin[2]-target[2]);
  height=Math.max(2.55-1.35*power,(1.5-(1.2+(.14-1.2)*netT))/(4*netT*(1-netT)));
 }else {start=target;end=contact;t=(p-BOUNCE_AT)/(CONTACT_AT-BOUNCE_AT);height=.25-.15*power;}
 return [start[0]+(end[0]-start[0])*t,start[1]+(end[1]-start[1])*t+4*height*t*(1-t),start[2]+(end[2]-start[2])*t];
}
