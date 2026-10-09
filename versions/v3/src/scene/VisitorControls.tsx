import { useEffect, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { moveVisitor, type VisitorInput } from '../state/gameplay';
export default function VisitorControls({input,active,roaming}:{input:RefObject<VisitorInput>;active:boolean;roaming:boolean}){
 const invalidate=useThree(s=>s.invalidate);
 useEffect(()=>{
  const state=input.current;state.keys.clear();state.roaming=roaming;
  const down=(e:KeyboardEvent)=>{if(!active||document.querySelector('dialog[open]')||!['KeyW','KeyA','KeyS','KeyD','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code))return;e.preventDefault();state.keys.add(e.code);if(!e.repeat)moveVisitor(state,.035);invalidate()};
  const up=(e:KeyboardEvent)=>state.keys.delete(e.code),clear=()=>state.keys.clear();
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
  return ()=>{clear();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear)};
 },[active,input,roaming,invalidate]);
 useFrame((_,dt)=>{if(!active||document.querySelector('dialog[open]')){input.current.keys.clear();return}moveVisitor(input.current,dt);if(input.current.keys.size)invalidate()});
 return null;
}
