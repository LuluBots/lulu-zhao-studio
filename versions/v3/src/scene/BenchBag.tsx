import { Html } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import TennisBag from './TennisBag';
import HobbyDialog from '../components/HobbyDialog';
export default function BenchBag({interactive}:{interactive:boolean}){
 const [open,setOpen]=useState(false),button=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!interactive)setOpen(false)},[interactive]);
 const close=()=>{setOpen(false);requestAnimationFrame(()=>button.current?.focus())};
 return <group name="Personal_Bag_On_Bench" position={[7.49,.53,2.57]} rotation={[0,-Math.PI/2,0]}>
  <group scale={.38} userData={{cursor:interactive?'pointer':undefined}} onClick={e=>{if(interactive){e.stopPropagation();if(e.delta<5)setOpen(true)}}}><TennisBag/></group>
  {interactive&&<Html position={[0,.35,0]} center zIndexRange={[12,0]}><button ref={button} className="bag-focus-target" aria-label="Explore the tennis bag" aria-haspopup="dialog" onPointerDown={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setOpen(true)}}/></Html>}
  {open&&<Html><HobbyDialog onClose={close}/></Html>}
 </group>;
}
