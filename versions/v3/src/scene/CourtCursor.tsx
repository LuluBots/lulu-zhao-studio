import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Plane, Raycaster, Vector2, Vector3, Object3D } from 'three';

/** One owner for scene cursors: controls cannot overwrite each other's hover state. */
export default function CourtCursor(){
 const {gl,camera,scene,invalidate}=useThree();
 const state=useRef({inside:false,drag:false,pointer:new Vector2(),ray:new Raycaster(),plane:new Plane(new Vector3(0,1,0),-.06),point:new Vector3()});
 useEffect(()=>{
  const canvas=gl.domElement,s=state.current;
  const move=(e:PointerEvent)=>{if(e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();s.inside=true;s.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);invalidate()};
  const leave=()=>{s.inside=false;s.drag=false;delete canvas.dataset.cursor;invalidate()};
  const down=()=>{s.drag=canvas.dataset.cursor==='grab';invalidate()};
  const up=()=>{s.drag=false;invalidate()};
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('pointerdown',down);
  window.addEventListener('pointerup',up);window.addEventListener('pointercancel',leave);window.addEventListener('blur',leave);
  return ()=>{canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',leave);window.removeEventListener('blur',leave);delete canvas.dataset.cursor};
 },[gl,invalidate]);
 useFrame(()=>{
  const s=state.current;if(!s.inside)return;
  if(s.drag){gl.domElement.dataset.cursor='grabbing';return}
  s.ray.setFromCamera(s.pointer,camera);
  const court=s.ray.ray.intersectPlane(s.plane,s.point);
  const onCourt=!!court&&Math.abs(court.x)<=6.2&&Math.abs(court.z)<=11.85;
  const courtDistance=onCourt?s.ray.ray.origin.distanceTo(s.point):Infinity;
  let mode=onCourt?'aim':'grab';
  const targets:Object3D[]=[];
  scene.traverseVisible(o=>{if(o.userData.cursor==='pointer')targets.push(o)});
  for(const hit of s.ray.intersectObjects(targets,true)){
   if(hit.distance>courtDistance+.1)break;
   let visible=true,interactive=false;
   for(let o:typeof hit.object|null=hit.object;o;o=o.parent){if(!o.visible)visible=false;if(o.userData.cursor==='pointer')interactive=true}
   if(visible&&interactive){mode='point';break}
  }
  gl.domElement.dataset.cursor=mode;
 });
 return null;
}
