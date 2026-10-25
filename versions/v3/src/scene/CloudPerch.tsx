import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { BufferGeometry, Mesh } from 'three';
/** Shared cloud language for the two stationary sky destinations. */
export default function CloudPerch({night,width=6.2,depth=3.5}:{night:boolean;width?:number;depth?:number}){
 const {scene}=useGLTF('/models/cloud-match.glb?v=1');
 const geometry=useMemo(()=>{
  let source:BufferGeometry|undefined;scene.traverse(o=>{if(!source&&o instanceof Mesh)source=o.geometry});
  const g=source!.clone();g.computeBoundingBox();const b=g.boundingBox!;
  const sx=width/(b.max.x-b.min.x),sy=1.35/(b.max.y-b.min.y),sz=depth/(b.max.z-b.min.z);
  const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2,top=b.max.y;
  g.translate(-cx,-top,-cz);g.scale(sx,sy,sz);g.translate(0,.12,0);g.computeVertexNormals();return g;
 },[scene,width,depth]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} receiveShadow><meshStandardMaterial vertexColors color={night?'#a6b4cf':'#fff7ec'} roughness={.96} emissive={night?'#7187b1':'#b9cde0'} emissiveIntensity={.1}/></mesh>;
}
