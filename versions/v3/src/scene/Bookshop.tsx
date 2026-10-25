import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { Mesh } from 'three';
import SceneAsset from './SceneAsset';
function Model(){
 const {scene}=useGLTF('/models/bookshop-courtside.glb');
 const model=useMemo(()=>{const copy=scene.clone(true);copy.traverse(o=>{if(o instanceof Mesh){o.castShadow=true;o.receiveShadow=true}});return copy},[scene]);
 return <group name="Writing_Bicycle_Bookshop"><primitive object={model} dispose={null} scale={1.12} rotation={[0,.25,0]}/></group>;
}
export default function Bookshop(_props:{night:boolean}){return <SceneAsset><Model/></SceneAsset>}
