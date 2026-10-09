import { useEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import type { Phase } from '../state/rally';
import { shotDuration, sampleTargetFlight, targetPoint, receptionPoint, type Point } from './trajectories';
import { caughtReturn,inBounds,returnLane,returnLanding,sampleIncoming,type RallyResult,type VisitorInput } from '../state/gameplay';
import type { ScreenAnchor } from './SkyVisitors';
export type RallyClock = { progress: number; returnAt?:number };
type Props={phase:Phase;shot:number;reduced:boolean;clock:RefObject<RallyClock>;input:RefObject<VisitorInput>;onBall:()=>void;onFinished:(r:RallyResult)=>void;onAnchor:(a:ScreenAnchor)=>void;target:[number,number];power:number};
export default function Rally({phase,shot,clock,input,onBall,onFinished,onAnchor,target,power}:Props){
 const ball=useRef<Group>(null),marker=useRef<Group>(null);
 const elapsed=useRef(0),complete=useRef(false),last=useRef<Point|null>(null),before=useRef<[number,number]>([.45,6.5]);
 const returned=useRef<{time:number;start:Point;landing:[number,number]}|null>(null);
 const {invalidate,gl,camera,size}=useThree();
 useEffect(()=>{elapsed.current=0;complete.current=false;returned.current=null;last.current=null;before.current=[input.current.x,input.current.z];clock.current.progress=0;clock.current.returnAt=.68;invalidate()},[phase,shot,clock,input,invalidate]);
 useEffect(()=>()=>{gl.domElement.style.cursor=''},[gl]);
 useFrame((_,delta)=>{
  if(!ball.current)return;
  const v=input.current,hand=v.racket??[v.x-.75,1.18,v.z-.47];
  if(document.querySelector('dialog[open]'))return;
  if(phase!=='playing'){v.swing=0;ball.current.position.set(...(phase==='overview'?[1.75,.14,4.3] as Point:hand as Point));if(marker.current)marker.current.visible=false;return}
  if(complete.current)return;
  elapsed.current+=Math.min(delta,.05);
  const finish=(result:RallyResult)=>{complete.current=true;onFinished(result)};
  const outTime=shotDuration(power)*.68,backTime=1.65;
  const contact=receptionPoint(targetPoint(target),power,v.launch),lane=returnLane(target[0],shot);
  let point:Point;
  if(returned.current){
   const hit=returned.current,t=Math.min(1,(elapsed.current-hit.time)/.85);point=sampleTargetFlight(t*.48,targetPoint(hit.landing),power,hit.start);
   v.swing=Math.min(1,.5+t*2);
   if(t===1){const screen=new Vector3(...point).project(camera);onAnchor({x:(screen.x+1)*size.width/2,y:(1-screen.y)*size.height/2});finish(inBounds(hit.landing)?{winner:'visitor',reason:'returned'}:{winner:'npc',reason:'out'})}
  }else if(elapsed.current<=outTime){
   const p=elapsed.current/outTime*.68;v.swing=elapsed.current<.4?Math.min(1,.5+elapsed.current*1.25):0;clock.current.progress=p;point=sampleTargetFlight(p,targetPoint(target),power,v.launch);
   if(!inBounds(target)&&p>=.48)finish({winner:'npc',reason:'out'});
  }else{
   const t=Math.min(1,(elapsed.current-outTime)/backTime);clock.current.progress=.68+t*.32;point=sampleIncoming(t,contact,lane);
   v.swing=Math.abs(point[2]-hand[2])<1.4?.5:0;
   if(last.current&&caughtReturn(last.current,point,before.current,[hand[0],hand[2]],hand[1]))returned.current={time:elapsed.current,start:[...hand],landing:returnLanding(target,v)};
   else if(t===1)finish({winner:'npc',reason:'missed'});
  }
  if(marker.current){marker.current.visible=!returned.current;marker.current.position.set(lane,.055,v.z);}
  ball.current.position.set(...point);ball.current.rotation.x=elapsed.current*10;
  last.current=point;before.current=[hand[0],hand[2]];invalidate();
 });
 const activate=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();if(event.delta<=5)onBall()};
 const active=phase==='overview'||phase==='ready';
 return <>
  <group ref={ball} name="Interactive_TennisBall" onClick={activate} onPointerOver={e=>{e.stopPropagation();if(active)gl.domElement.style.cursor='pointer'}} onPointerOut={()=>{gl.domElement.style.cursor=''}}>
   <mesh castShadow><sphereGeometry args={[.13,24,16]}/><meshStandardMaterial color="#dce976" roughness={.8}/></mesh>
   <mesh rotation={[.3,0,.6]}><torusGeometry args={[.13,.007,6,32]}/><meshStandardMaterial color="#fffde9"/></mesh>
   {active&&<mesh><sphereGeometry args={[phase==='overview'?.65:.4,12,8]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>}
  </group>
  <group ref={marker} visible={false}><mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.37,.42,32]}/><meshBasicMaterial color="#e9f5a4" transparent opacity={.8} depthWrite={false}/></mesh></group>

 </>;
}
