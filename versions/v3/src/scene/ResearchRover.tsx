import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, LoopOnce, Mesh } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import CloudPerch from './CloudPerch';
import SceneAsset from './SceneAsset';
function Model({night,reduced,pulse}:{night:boolean;reduced:boolean;pulse:number}){
 const gltf=useGLTF('/models/research-rover.glb'),active=useRef(false),elapsed=useRef(0),{invalidate}=useThree();
 const model=useMemo(()=>{const copy=clone(gltf.scene);copy.traverse(o=>{if(o instanceof Mesh){o.castShadow=true;o.receiveShadow=true}});return copy},[gltf.scene]);
 const mixer=useMemo(()=>new AnimationMixer(model),[model]);
 const duration=useMemo(()=>Math.max(0,...gltf.animations.map(a=>a.duration)),[gltf.animations]);
 useEffect(()=>()=>{mixer.stopAllAction();mixer.uncacheRoot(model)},[mixer,model]);
 useFrame((_,dt)=>{if(!active.current)return;mixer.update(Math.min(dt,.05));elapsed.current+=Math.min(dt,.05);if(elapsed.current>=duration){active.current=false;mixer.stopAllAction()}else invalidate()});
 const demonstrate=()=>{if(reduced||!duration)return;elapsed.current=0;active.current=true;for(const clip of gltf.animations){const a=mixer.clipAction(clip);a.reset().setLoop(LoopOnce,1);a.clampWhenFinished=true;a.play()}invalidate()};
 useEffect(()=>{if(pulse)demonstrate()},[pulse]);
 return <group name="Research_Cloud_Rover"><CloudPerch night={night} width={4.8} depth={3.8}/><primitive object={model} dispose={null} rotation={[0,.45,0]}/></group>;
}
export default function ResearchRover(props:{night:boolean;reduced:boolean;pulse:number}){return <SceneAsset><Model {...props}/></SceneAsset>}
