import { Html, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Mesh } from 'three';
import { nextRadioTrack, radioTracks } from '../state/radioTracks';
import SceneAsset from './SceneAsset';
function Model(){
 const {scene}=useGLTF('/models/court-radio.glb');
 const model=useMemo(()=>{const copy=scene.clone(true);copy.traverse(o=>{if(o instanceof Mesh){o.castShadow=true;o.receiveShadow=true}});return copy},[scene]);
 return <primitive object={model} dispose={null} rotation={[0,Math.PI/2,0]} scale={.58}/>;
}
export default function CourtRadio({soundEnabled,interactive}:{soundEnabled:boolean;interactive:boolean}){
 const audio=useRef<HTMLAudioElement|null>(null),current=useRef(-1),enabled=useRef(soundEnabled),request=useRef(0);
 const [playing,setPlaying]=useState(false),[message,setMessage]=useState('');
 enabled.current=soundEnabled;
 const play=()=>{
  const a=audio.current;if(!a||!enabled.current||document.hidden)return;
  const id=++request.current;
  void a.play().catch(()=>{if(request.current===id){setPlaying(false);setMessage('Music could not start. Tap the radio to try again.')}});
 };
 const next=()=>{
  const a=audio.current;if(!a)return;
  request.current++;a.pause();current.current=nextRadioTrack(current.current,radioTracks.length);
  a.src=radioTracks[current.current];setMessage('');play();
 };
 useEffect(()=>{
  const a=new Audio();a.preload='none';a.volume=.22;a.dataset.courtBgm='true';
  document.body.appendChild(a);audio.current=a;
  a.onplaying=()=>setPlaying(true);a.onpause=()=>setPlaying(false);a.onended=next;
  const visibility=()=>{if(document.hidden){request.current++;a.pause()}else if(current.current>=0)play()};
  document.addEventListener('visibilitychange',visibility);
  return ()=>{request.current++;document.removeEventListener('visibilitychange',visibility);a.onplaying=null;a.onpause=null;a.onended=null;a.pause();a.removeAttribute('src');a.load();a.remove();audio.current=null;};
 },[]);
 useEffect(()=>{if(!soundEnabled){request.current++;audio.current?.pause()}else if(current.current>=0)play()},[soundEnabled]);
 return <group name="Courtside_Radio" position={[6.95,0,0]}>
  <mesh position={[0,.72,0]} castShadow receiveShadow><cylinderGeometry args={[.40,.40,.06,32]}/><meshStandardMaterial color="#f2ead8" roughness={.6}/></mesh>
  <mesh position={[0,.36,0]} castShadow><cylinderGeometry args={[.035,.05,.68,12]}/><meshStandardMaterial color="#779c93" roughness={.6}/></mesh>
  <mesh position={[0,.035,0]} receiveShadow><cylinderGeometry args={[.22,.25,.06,24]}/><meshStandardMaterial color="#779c93" roughness={.7}/></mesh>
  <group position={[0,.755,0]} userData={{cursor:interactive?'pointer':undefined}} onClick={e=>{if(interactive){e.stopPropagation();if(e.delta<5)next()}}}>
   <SceneAsset><Model/></SceneAsset>
   <mesh position={[-.275,.15,.01]}><sphereGeometry args={[.012,8,6]}/><meshBasicMaterial color={playing?'#e6da88':'#6c756b'}/></mesh>
  </group>
  {interactive&&<Html position={[0,.95,0]} center zIndexRange={[12,0]}><button className="radio-focus-target" aria-label="Radio: play or randomly change background music" onPointerDown={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();next()}}/><span className="radio-status" role="status">{message}</span></Html>}
 </group>;
}
