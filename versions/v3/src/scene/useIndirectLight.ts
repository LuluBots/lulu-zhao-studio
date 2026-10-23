import { useTexture } from '@react-three/drei';
import { useEffect, type RefObject } from 'react';
import { BufferAttribute, Group, Matrix4, Mesh, MeshStandardMaterial, SRGBColorSpace, Vector3 } from 'three';
const paths=['/textures/court-indirect-day.png','/textures/court-indirect-night.png'];
/** Static, world-projected floor irradiance from Cycles diffuse-indirect passes.
 * Direct shadows and moving characters remain dynamically lit. */
export function useIndirectLight(root:RefObject<Group|null>,night:boolean){
 const maps=useTexture(paths);const map=maps[night?1:0];
 useEffect(()=>{
  if(!root.current)return;
  map.colorSpace=SRGBColorSpace;map.channel=1;map.anisotropy=8;map.needsUpdate=true;
  root.current.updateWorldMatrix(true,true);
  const inverse=new Matrix4().copy(root.current.matrixWorld).invert();const point=new Vector3();
  const restore:(()=>void)[]=[];
  root.current.traverse(o=>{
   if(!(o instanceof Mesh)||!['Court_Platform','Court_PlayingSurface','Indirect_Deck','Indirect_Plank'].includes(o.name)||!(o.material instanceof MeshStandardMaterial))return;
   const originalGeometry=o.geometry,originalMaterial=o.material;
   const geometry=originalGeometry.clone(),material=originalMaterial.clone();
   const transform=new Matrix4().multiplyMatrices(inverse,o.matrixWorld),positions=geometry.attributes.position,uv=new Float32Array(positions.count*2);
   for(let i=0;i<positions.count;i++){point.fromBufferAttribute(positions,i).applyMatrix4(transform);uv[i*2]=point.x/26+.5;uv[i*2+1]=.5-point.z/30}
   geometry.setAttribute('uv1',new BufferAttribute(uv,2));material.lightMap=map;material.lightMapIntensity=1;material.needsUpdate=true;o.geometry=geometry;o.material=material;
   restore.push(()=>{o.geometry=originalGeometry;o.material=originalMaterial;geometry.dispose();material.dispose()});
  });
  return ()=>restore.forEach(fn=>fn());
 },[root,map]);
}
paths.forEach(path=>useTexture.preload(path));
