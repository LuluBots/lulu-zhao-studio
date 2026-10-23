import {Balloon,Aircraft} from './AircraftModels';
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
 const destination=(['research','writing','about','trajectory'] as const)[index];
 const initial=airRoute(index,0,night);
 useFrame(({camera},delta)=>{if(!group.current)return;const clear=visible&&!obscuresScoreboard(camera,group.current.position,3.2);group.current.visible=clear;if(button.current){button.current.style.visibility=clear?'visible':'hidden';button.current.disabled=!clear}if(!visible||reduced||hover.current)return;elapsed.current+=Math.min(delta,.05)*.25;const t=elapsed.current;group.current.position.set(...airRoute(index,t,night));group.current.rotation.z=Math.sin(t*.25+index)*.035;if(night)group.current.rotation.y=Math.atan2(.8*Math.sin(t*.09+index),1.2*Math.cos(t*.09+index));invalidate()});
 const open=()=>onNavigate(destination);
 return <group ref={group} visible={visible} position={initial} name={`${night?'Aircraft':'Balloon'}_${destination}`} onClick={e=>{e.stopPropagation();if(e.delta<5)open()}} onPointerOver={()=>{hover.current=true;document.body.style.cursor='pointer'}} onPointerOut={()=>{hover.current=false;document.body.style.cursor=''}}>
  {night?<Aircraft/>:<Balloon index={index}/>}
  <Html position={[0,night?-.8:-2.65,.45]} transform sprite distanceFactor={12} center zIndexRange={[12,0]} style={{display:visible?undefined:"none"}}><button ref={button} onPointerEnter={()=>{hover.current=true}} onPointerLeave={()=>{hover.current=false;invalidate()}} className={`sky-entry ${night?'airline':''}`} onPointerDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();const r=e.currentTarget.getBoundingClientRect();onNavigate(destination,{x:r.x+r.width/2,y:r.y+r.height/2})}}>{destination[0].toUpperCase()+destination.slice(1)}<span aria-hidden="true"> ↗</span></button></Html>
 </group>;
}
export default function SkyVisitors({visible,...props}:{visible:boolean;night:boolean;reduced:boolean;onNavigate:(d:Destination,a?:ScreenAnchor)=>void}){return <group name="Sky_Navigation">{[0,1,2,3].map(index=><Visitor key={index} visible={visible} index={index} {...props}/>)}</group>}
