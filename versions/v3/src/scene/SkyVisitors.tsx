import OrigamiCrane from './OrigamiCrane';
import Bookshop from './Bookshop';
import ResearchRover from './ResearchRover';
import {Balloon,Aircraft} from './AircraftModels';
import { Html } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { airRoute } from '../state/gameplay';
import { obscuresCourt, obscuresScoreboard } from './scoreboardVisibility';
import { Group } from 'three';
import type { Destination } from '../components/Directory';
export type ScreenAnchor={x:number;y:number};
function Visitor({index,night,reduced,onNavigate,visible}:{visible:boolean;index:number;night:boolean;reduced:boolean;onNavigate:(d:Destination,a?:ScreenAnchor)=>void}){
 const button=useRef<HTMLButtonElement>(null),group=useRef<Group>(null),elapsed=useRef(2),[pulse,setPulse]=useState(0),hover=useRef(false),{invalidate}=useThree();
 const destination=(['research','writing','about','trajectory'] as const)[index];
 const initial=airRoute(index,0,night);
 useFrame(({camera},delta)=>{
  if(!group.current)return;
  const active=visible&&!reduced&&elapsed.current<1.2;
  if(active)elapsed.current=Math.min(1.2,elapsed.current+Math.min(delta,.05));
  const progress=elapsed.current/1.2;
  const motion=active?Math.sin(progress*Math.PI*2)*Math.sin(progress*Math.PI):0;
  group.current.position.set(...initial);
  group.current.rotation.z=index===1?motion*.045:index===3?motion*.025:0;
  group.current.rotation.y=0;
  if(index===3)group.current.position.y+=Math.sin(Math.min(progress,1)*Math.PI)* (active?.25:0);
  const radius=index===1?3.5:index===0?3.1:index===2?3:1.5;
  const clear=visible&&!obscuresScoreboard(camera,group.current.position,radius)&&!obscuresCourt(camera,group.current.position,radius);
  group.current.visible=clear;
  if(button.current){button.current.style.visibility=clear?'visible':'hidden';button.current.disabled=!clear}
  if(active)invalidate();
 });
 const animate=()=>{if(reduced)return;elapsed.current=0;setPulse(p=>p+1);invalidate()};
 return <group ref={group} visible={visible} position={initial} name={`${index===0?'CloudRover':index===1?'CloudBookshop':index===2?'OrigamiCrane':night?'Aircraft':'Balloon'}_${destination}`} onClick={e=>{e.stopPropagation();if(e.delta<5)animate()}} userData={{cursor:'pointer'}} onPointerOver={()=>{hover.current=true}} onPointerOut={()=>{hover.current=false}}>
  {index===0?<ResearchRover night={night} reduced={reduced} pulse={pulse}/>:index===1?<Bookshop night={night}/>:index===2?<OrigamiCrane night={night} reduced={reduced} pulse={pulse}/>:night?<Aircraft/>:<Balloon index={index}/>}
  <Html position={[0,index<=2?-1.6:night?-.8:-3.25,.45]} transform sprite distanceFactor={12} center zIndexRange={[12,0]} style={{display:visible?undefined:"none"}}><button ref={button} onPointerEnter={()=>{hover.current=true}} onPointerLeave={()=>{hover.current=false;invalidate()}} className={`sky-entry ${night?'airline':''}`} onPointerDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();const r=e.currentTarget.getBoundingClientRect();onNavigate(destination,{x:r.x+r.width/2,y:r.y+r.height/2})}}>{destination[0].toUpperCase()+destination.slice(1)}<span aria-hidden="true"> ↗</span></button></Html>
 </group>;
}
export default function SkyVisitors({visible,...props}:{visible:boolean;night:boolean;reduced:boolean;onNavigate:(d:Destination,a?:ScreenAnchor)=>void}){return <group name="Sky_Navigation">{[0,1,2,3].map(index=><Visitor key={index} visible={visible} index={index} {...props}/>)}</group>}
