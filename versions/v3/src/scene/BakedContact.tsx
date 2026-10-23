import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
// Cycles-baked contact occlusion from the matching fixed-furniture geometry.
// Directional day/night lighting remains live; moving players are never baked into this layer.
export default function BakedContact(){
 const map=useTexture('/textures/court-contact-ao.png'),gl=useThree(s=>s.gl);
 useEffect(()=>{map.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());map.needsUpdate=true},[map,gl]);
 return <mesh name="Baked_Courtside_Contact" position={[0,.019,0]} rotation={[-Math.PI/2,0,0]} renderOrder={1}>
  <planeGeometry args={[26,30]}/><meshBasicMaterial map={map} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1} toneMapped={false}/>
 </mesh>;
}

useTexture.preload('/textures/court-contact-ao.png');
