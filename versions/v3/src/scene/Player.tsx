import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, Group, MathUtils, Mesh, Quaternion, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { RallyClock } from './Rally';
import type { Side } from '../state/rally';
import { samplePlayerPosition, targetPoint } from './trajectories';
import { applyTennisSteps } from './tennisSteps';
import type { VisitorInput } from '../state/gameplay';
import ProceduralPlayer from './ProceduralPlayer';

type Props={input?:RefObject<VisitorInput>;switching?:boolean;hidden?:boolean;power?:number;target?:[number,number];playing?:boolean;visitor?:boolean;clock?:RefObject<RallyClock>;reduced?:boolean;side?:Side;onSwitch?:()=>void};
class ModelBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?this.props.fallback:this.props.children}
}
function Lulu({input,switching=false,hidden=false,visitor=false,clock,reduced=false,side='technology',onSwitch,target=[0,-3.3],playing=false,power=.5}:Props){
 const [initialPosition]=useState<[number,number,number]>(()=>visitor?[-1.5,0,6.5]:[.9,0,-6.7]);
 const swap=useRef<{from:Vector3;elapsed:number}|null>(null);
 const gltf=useGLTF('/models/lulu.glb?v=long-grip-crossstep-3');
 // Clone skeletons, not cached geometries/materials: the two players animate independently.
 const model=useMemo(()=>{const copy=clone(gltf.scene);copy.updateMatrixWorld(true);for(const name of ['FootL','FootR']){const foot=copy.getObjectByName(name);if(foot)foot.userData.flatQuaternion=foot.getWorldQuaternion(new Quaternion());}return copy},[gltf.scene]);
 const mixer=useMemo(()=>new AnimationMixer(model),[model]);
 const actions=useMemo(()=>Object.fromEntries(gltf.animations.map(clip=>{
  const action=mixer.clipAction(clip);action.play();action.paused=true;action.setEffectiveWeight(0);return [clip.name,action];
 })),[gltf.animations,mixer]);
 const root=useRef<Group>(null),time=useRef(0),stride=useRef(0),start=useRef(new Vector3(.9,0,-6.7));
 const {gl,invalidate}=useThree();
 useEffect(()=>{
  model.traverse(object=>{if(object instanceof Mesh){object.castShadow=true;object.receiveShadow=true;object.frustumCulled=false;}});
  const outfit=side==='humanities'?'Humanities':'Technology';
  for(const name of ['Humanities','Technology']){const object=model.getObjectByName(`Lulu_${name}`);if(object)object.visible=name===outfit;}
  invalidate();
 },[model,side,visitor,invalidate]);
 useEffect(()=>{
  // React StrictMode replays effects: explicitly restart cached actions after cleanup.
  Object.values(actions).forEach(action=>{action.reset().play();action.paused=true;action.setEffectiveWeight(0)});
  return ()=>{mixer.stopAllAction()};
 },[actions,mixer]);
 useEffect(()=>{if(playing&&root.current)start.current.copy(root.current.position)},[playing]);
 useEffect(()=>{if(switching&&root.current)swap.current={from:root.current.position.clone(),elapsed:0}},[switching]);
 useFrame((_,delta)=>{
  if(!root.current)return;
  time.current+=Math.min(delta,.05);
  if(switching&&swap.current){
   const motion=swap.current;motion.elapsed+=Math.min(delta,.05);const t=reduced?1:Math.min(1,motion.elapsed/1.8);
   const goal=new Vector3(...(visitor?[input?.current.x??.45,0,input?.current.z??6.5]:[.9,0,-6.7]));
   const edge=side==='humanities'?-5.7:5.7;
   const waypoints=[motion.from,new Vector3(edge,0,motion.from.z),new Vector3(edge,0,goal.z),goal];
   const segment=Math.min(2,Math.floor(t*3)),u=Math.min(1,t*3-segment);
   root.current.position.lerpVectors(waypoints[segment],waypoints[segment+1],u*u*(3-2*u));
   root.current.rotation.y=visitor?Math.PI:0;
   for(const [name,action] of Object.entries(actions)){action.setEffectiveWeight(name==='Run'?1:0);action.time=reduced?0:(motion.elapsed*2)%action.getClip().duration}mixer.update(0);invalidate();return;
  }

  const p=playing?(clock?.current.progress??0):0;
  const previous=root.current.position.clone();
  const contact=samplePlayerPosition(.68,targetPoint(target),power,input?.current.launch);
  const home=samplePlayerPosition(0,targetPoint(target),power,input?.current.launch);
  if(visitor&&input){root.current.position.set(input.current.x,0,input.current.z)}
  if(!visitor){
   if(playing&&p<=.80){const t=MathUtils.clamp((p-.035)/.525,0,1),ease=t*t*(3-2*t);root.current.position.copy(start.current).lerp(new Vector3(...contact),ease);}
   else {const dx=home[0]-previous.x,dz=home[2]-previous.z,distance=Math.hypot(dx,dz),step=Math.min(distance,Math.min(delta,.05)*5.4);
    if(distance>.001){root.current.position.x+=dx/distance*step;root.current.position.z+=dz/distance*step;}
   }
  }
  const dx=root.current.position.x-previous.x,dz=root.current.position.z-previous.z,moved=Math.hypot(dx,dz);
  stride.current+=moved/1.4;
  const recovering=!visitor&&Math.hypot(root.current.position.x-home[0],root.current.position.z-home[2])>.025&&(!playing||p>.80);
  let clip='Ready';
  let yaw=0;
  if(playing&&!visitor&&p>=.56&&p<=.80){clip='Swing';}
  else if(moved>.001||recovering){
   const shuffle=dz<0||Math.abs(dx)>Math.abs(dz)*.8;
   clip=shuffle?'Shuffle':'Run';
   const fade=playing&&p<.60?MathUtils.clamp((.60-p)/.14,0,1):1;
   if(moved>.0001)yaw=(shuffle?MathUtils.clamp(Math.atan2(dx,Math.abs(dz)+.001),-.38,.38):MathUtils.clamp(Math.atan2(dx,dz),-.8,.8))*fade;
  }
  const visitorSwing=visitor?(input?.current.swing??0):0;
  if(visitorSwing>0)clip='Swing';
  if(visitor)root.current.rotation.y=Math.PI;
  else if(playing&&p>=.62&&p<=.75)root.current.rotation.y=0;
  else {const difference=MathUtils.euclideanModulo(yaw-root.current.rotation.y+Math.PI,Math.PI*2)-Math.PI;root.current.rotation.y+=difference*(1-Math.exp(-14*Math.min(delta,.05)));}
  if(reduced)clip='Ready';
  for(const [name,action] of Object.entries(actions)){
   const desired=name===clip?1:0;
   const exactContact=playing&&p>=.64&&p<=.72;
   action.setEffectiveWeight(reduced||exactContact?desired:MathUtils.damp(action.getEffectiveWeight(),desired,24,Math.min(delta,.05)));
   const duration=action.getClip().duration;
   action.time=reduced?0:name==='Swing'?(visitor?visitorSwing:MathUtils.clamp((p-.56)/.24,0,1))*duration:(name==='Run'||name==='Shuffle'?stride.current:time.current)%duration;
  }
  mixer.update(0);
  if(!reduced&&moved>.0001&&clip!=='Swing')applyTennisSteps(model,root.current,stride.current,new Vector3(dx,0,dz).normalize());
  if(visitor&&input){root.current.updateMatrixWorld(true);const contact=model.getObjectByName('Racket_Contact');if(contact){const position=contact.getWorldPosition(new Vector3());input.current.racket=[position.x,position.y,position.z]}}
  if(!reduced)invalidate();
 });
 return <group ref={root} name={visitor?'Visitor_Lulu_Model':'Lulu_Animated_Model'} visible={!hidden} position={initialPosition} rotation={[0,visitor?Math.PI:0,0]}
  onClick={e=>{if(onSwitch){e.stopPropagation();if(e.delta<=5)onSwitch()}}}
  onPointerOver={e=>{if(onSwitch){e.stopPropagation();gl.domElement.style.cursor='pointer'}}} onPointerOut={()=>{gl.domElement.style.cursor=''}}>
  <primitive object={model} dispose={null}/>
 </group>;
}
export default function Player(props:Props){
 const fallback=<ProceduralPlayer {...props}/>;
 return <ModelBoundary fallback={fallback}><Suspense fallback={fallback}><Lulu {...props}/></Suspense></ModelBoundary>;
}
