import { RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BufferGeometry, Float32BufferAttribute, Group, MathUtils } from 'three';
import CloudPerch from './CloudPerch';
import SceneAsset from './SceneAsset';
function GateMesh(){
 const geometry=useMemo(()=>{
  const points:number[]=[];const w=1.87,h=2.55;
  // Diamond weave, clipped to the opening of the leaf.
  for(const slope of [-1,1])for(let b=-w;b<=h+w;b+=.31){
   const ends:number[][]=[];
   for(const x of [0,w]){const y=slope*x+b;if(y>=0&&y<=h)ends.push([x,y]);}
   for(const y of [0,h]){const x=(y-b)/slope;if(x>0&&x<w)ends.push([x,y]);}
   if(ends.length>=2)points.push(ends[0][0]+.13,ends[0][1]+.32,0,ends[1][0]+.13,ends[1][1]+.32,0);
  }
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(points,3));return g;
 },[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <lineSegments geometry={geometry}><lineBasicMaterial color="#e8e0cb"/></lineSegments>;
}
export default function CourtGate({night,reduced}:{night:boolean;reduced:boolean}){
 const leaf=useRef<Group>(null),[hover,setHover]=useState(false),{invalidate}=useThree();
 useEffect(()=>invalidate(),[hover,reduced,invalidate]);
 useFrame((_,delta)=>{if(!leaf.current)return;const target=hover?-1.02:-.57;const next=reduced?target:MathUtils.damp(leaf.current.rotation.y,target,7,Math.min(delta,.05));leaf.current.rotation.y=next;if(Math.abs(next-target)>.001)invalidate()});
 return <SceneAsset><CloudPerch night={night} width={4.2} depth={2.9}/>
  <group rotation={[0,.48,0]} onPointerOver={()=>setHover(true)} onPointerOut={()=>setHover(false)} name="Half_Open_Court_Gate">
   <RoundedBox position={[0,.15,0]} args={[2.9,.16,1.05]} radius={.06} castShadow receiveShadow><meshStandardMaterial color="#e8dfcb" roughness={.85}/></RoundedBox>
   {[-1.18,1.18].map(x=><group key={x}>
    <RoundedBox position={[x,1.72,0]} args={[.14,3.18,.14]} radius={.045} castShadow><meshStandardMaterial color="#779c93" roughness={.6}/></RoundedBox>
    <mesh position={[x,3.34,0]}><sphereGeometry args={[.105,16,10]}/><meshStandardMaterial color="#e8dfcb"/></mesh>
   </group>)}
   <RoundedBox position={[0,3.27,0]} args={[2.44,.12,.14]} radius={.04} castShadow><meshStandardMaterial color="#779c93"/></RoundedBox>
   <group ref={leaf} position={[-1.10,0,0]} rotation={[0,-.57,0]}>
    {[.075,2.065].map(x=><RoundedBox key={x} position={[x,1.59,0]} args={[.09,2.72,.09]} radius={.025} castShadow><meshStandardMaterial color="#e8dfcb"/></RoundedBox>)}
    {[.27,2.91].map(y=><RoundedBox key={y} position={[1.07,y,0]} args={[2.07,.09,.09]} radius={.025} castShadow><meshStandardMaterial color="#e8dfcb"/></RoundedBox>)}
    <GateMesh/>
    <RoundedBox position={[1.9,1.58,.12]} args={[.23,.045,.045]} radius={.018} castShadow><meshStandardMaterial color="#bba27b" metalness={.3} roughness={.55}/></RoundedBox>
   </group>
   <mesh position={[.2,.236,-.2]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[1.5,.4]}/><meshBasicMaterial color="#f4dba7" transparent opacity={night?.22:.12} depthWrite={false}/></mesh>
  </group>
 </SceneAsset>;
}
