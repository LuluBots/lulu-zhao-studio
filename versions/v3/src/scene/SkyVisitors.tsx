import { Html } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { airRoute } from '../state/gameplay';
import { obscuresScoreboard } from './scoreboardVisibility';
import { Group } from 'three';
import type { Destination } from '../components/Directory';
export type ScreenAnchor={x:number;y:number};
function Visitor({index,night,reduced,onNavigate,visible}:{visible:boolean;index:number;night:boolean;reduced:boolean;onNavigate:(d:Destination,a?:ScreenAnchor)=>void}){
 const button=useRef<HTMLButtonElement>(null),group=useRef<Group>(null),elapsed=useRef(0),hover=useRef(false),{invalidate}=useThree();
 const destination=(['research','writing','about'] as const)[index];
 const initial=airRoute(index,0,night);
 useFrame(({camera},delta)=>{if(!group.current)return;const clear=visible&&!obscuresScoreboard(camera,group.current.position,3.2);group.current.visible=clear;if(button.current){button.current.style.visibility=clear?'visible':'hidden';button.current.disabled=!clear}if(!visible||reduced||hover.current)return;elapsed.current+=Math.min(delta,.05)*.25;const t=elapsed.current;group.current.position.set(...airRoute(index,t,night));group.current.rotation.z=Math.sin(t*.25+index)*.035;if(night)group.current.rotation.y=Math.atan2(.8*Math.sin(t*.09+index),1.2*Math.cos(t*.09+index));invalidate()});
 const open=()=>onNavigate(destination);
 return <group ref={group} visible={visible} position={initial} name={`${night?'Aircraft':'Balloon'}_${destination}`} onClick={e=>{e.stopPropagation();if(e.delta<5)open()}} onPointerOver={()=>{hover.current=true;document.body.style.cursor='pointer'}} onPointerOut={()=>{hover.current=false;document.body.style.cursor=''}}>
  {night?<group rotation={[0,-.45,0]}>
   <mesh scale={[2.6,.35,.4]} castShadow><sphereGeometry args={[1,24,12]}/><meshStandardMaterial color="#e7ebee" roughness={.45}/></mesh>
   <mesh rotation={[0,.2,0]}><boxGeometry args={[1.1,.09,4.5]}/><meshStandardMaterial color="#96b6c8"/></mesh>
   <mesh position={[-1.8,.1,0]}><boxGeometry args={[.7,.06,1.9]}/><meshStandardMaterial color="#d7e4e9"/></mesh>
   <mesh position={[-1.8,.55,0]} rotation={[0,0,-.25]}><boxGeometry args={[.8,.8,.07]}/><meshStandardMaterial color="#538997"/></mesh>
   {[-1,1].map(s=><mesh key={s} position={[0,0,s*2.25]}><sphereGeometry args={[.06,8,8]}/><meshBasicMaterial color={s<0?'#ee8c7e':'#9edbbc'}/></mesh>)}
   {[-1,0,1].map(i=><mesh key={i} position={[i*.6,.18,.36]}><sphereGeometry args={[.065,8,8]}/><meshBasicMaterial color="#f9e5ae"/></mesh>)}
  </group>:<>
   <mesh scale={[1.3,1.65,1.3]}><sphereGeometry args={[1,24,16]}/><meshStandardMaterial color={['#c5acb8','#e1cba7','#9fbeb8'][index]} roughness={.9}/></mesh>
   {Array.from({length:8},(_,i)=><mesh key={i} rotation={[0,i*Math.PI/4,0]} scale={[1.31,1.66,1.31]}><sphereGeometry args={[1,4,16,0,.065]}/><meshStandardMaterial color="#faf0d5"/></mesh>)}
   <mesh position={[0,-2,0]}><boxGeometry args={[.65,.42,.55]}/><meshStandardMaterial color="#b59874"/></mesh>
   {[-.26,.26].map(x=><mesh key={x} position={[x,-1.55,0]}><cylinderGeometry args={[.016,.016,.8,6]}/><meshStandardMaterial color="#e6dec7"/></mesh>)}
  </>}
  <Html position={[0,night?.1:0,.45]} center zIndexRange={[12,0]} style={{display:visible?undefined:"none"}}><button ref={button} onPointerEnter={()=>{hover.current=true}} onPointerLeave={()=>{hover.current=false;invalidate()}} className={`sky-entry ${night?'airline':''}`} onPointerDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();const r=e.currentTarget.getBoundingClientRect();onNavigate(destination,{x:r.x+r.width/2,y:r.y+r.height/2})}}>{destination[0].toUpperCase()+destination.slice(1)}<span aria-hidden="true"> ↗</span></button></Html>
 </group>;
}
export default function SkyVisitors({visible,...props}:{visible:boolean;night:boolean;reduced:boolean;onNavigate:(d:Destination,a?:ScreenAnchor)=>void}){return <group name="Sky_Navigation">{[0,1,2].map(index=><Visitor key={index} visible={visible} index={index} {...props}/>)}</group>}
