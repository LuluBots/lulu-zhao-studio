import { Html } from '@react-three/drei';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Group, Plane, Vector3 } from 'three';
import { chargePower } from './trajectories';
import { type Side } from '../state/rally';

const surface=new Plane(new Vector3(0,1,0),-.06);
export default function ShotInput({onHit}:{side:Side;overview:boolean;onHit:(point:[number,number],power:number)=>void}){
 const held=useRef<{id:number;start:number;x:number;y:number;point:[number,number]|null}|null>(null);
 const [charging,setCharging]=useState(false);
 const marker=useRef<Group>(null),label=useRef<HTMLSpanElement>(null),fill=useRef<HTMLSpanElement>(null);
 const {invalidate,gl}=useThree();
 const cancel=()=>{held.current=null;setCharging(false);gl.domElement.style.cursor='';invalidate()};
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')cancel()};
  const up=()=>{if(held.current)cancel()};
  window.addEventListener('blur',up);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);window.addEventListener('keydown',key);
  return ()=>{window.removeEventListener('blur',up);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);window.removeEventListener('keydown',key);gl.domElement.style.cursor=''};
 },[gl,invalidate]);
 const point=(e:ThreeEvent<PointerEvent>):[number,number]|null=>{
  const p=e.ray.intersectPlane(surface,new Vector3());if(!p)return null;
  const x=p.x,z=p.z;
  return Math.abs(x)<=5.7&&z<=-.15&&z>=-10.1?[x,z]:null;
 };
 useFrame(()=>{
  const h=held.current;if(!h)return;
  const power=chargePower(performance.now()-h.start);
  if(marker.current){marker.current.visible=!!h.point;if(h.point)marker.current.position.set(h.point[0],.09,h.point[1]);}
  if(label.current)label.current.textContent=`${Math.round(power*100)}%`;
  if(fill.current)fill.current.style.transform=`scaleX(${power})`;
  invalidate();
 });
 return <>
  <mesh name="Free_Aim_Court" position={[0,.06,-5.1]} rotation={[-Math.PI/2,0,0]}
   onPointerDown={e=>{if(e.button!==0||e.shiftKey||e.ctrlKey||e.metaKey||e.point.z< -9.2)return;if(held.current){cancel();return}e.stopPropagation();held.current={id:e.pointerId,start:performance.now(),x:e.clientX,y:e.clientY,point:point(e)};(e.target as HTMLElement).setPointerCapture(e.pointerId);setCharging(true);invalidate()}}
   onPointerMove={e=>{const h=held.current;if(!h||h.id!==e.pointerId)return;if(Math.hypot(e.clientX-h.x,e.clientY-h.y)>8){cancel();return}h.point=point(e);invalidate()}}
   onPointerUp={e=>{const h=held.current;if(!h||h.id!==e.pointerId)return;e.stopPropagation();const target=point(e),power=chargePower(performance.now()-h.start);cancel();(e.target as HTMLElement).releasePointerCapture(e.pointerId);if(target)onHit(target,power)}}
   onPointerCancel={cancel} onLostPointerCapture={cancel}
   onPointerOver={()=>{gl.domElement.style.cursor='crosshair'}} onPointerOut={()=>{if(!held.current)gl.domElement.style.cursor=''}}>
   <planeGeometry args={[11.4,10]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/>
  </mesh>
  {charging&&<group ref={marker}>
   <mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.22,.26,40]}/><meshBasicMaterial color="#fff7d2" depthWrite={false}/></mesh>
   <Html center style={{pointerEvents:'none'}}><div className="shot-power"><span>Hold · release to hit</span><span ref={label}>25%</span><div><span ref={fill}/></div></div></Html>
  </group>}
 </>;
}
