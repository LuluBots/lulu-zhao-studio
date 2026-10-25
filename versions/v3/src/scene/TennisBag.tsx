import { RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import { CatmullRomCurve3, Vector3 } from 'three';
function Handle({z}:{z:number}){
 const curve=useMemo(()=>new CatmullRomCurve3([new Vector3(-.65,.85,z),new Vector3(-.5,1.65,z),new Vector3(.5,1.65,z),new Vector3(.65,.85,z)]),[z]);
 return <mesh castShadow><tubeGeometry args={[curve,32,.048,8,false]}/><meshStandardMaterial color="#d2b993" roughness={.8}/></mesh>;
}
function Racket(){return <group position={[.8,1.1,0]} rotation={[0,0,-.35]} scale={.85}>
 <mesh position={[0,.65,0]} scale={[.72,1,1]} castShadow><torusGeometry args={[.65,.045,10,40]}/><meshStandardMaterial color="#eadfc1" roughness={.6}/></mesh>
 {[-.4,-.2,0,.2,.4].map(v=><group key={v}>
  <mesh position={[v*.72,.65,.006]}><boxGeometry args={[.008,2*Math.sqrt(.61*.61-v*v),.008]}/><meshStandardMaterial color="#bfcaba"/></mesh>
  <mesh position={[0,.65+v,.006]}><boxGeometry args={[1.44*Math.sqrt(.61*.61-v*v),.008,.008]}/><meshStandardMaterial color="#bfcaba"/></mesh>
 </group>)}
 <mesh position={[0,-.3,0]} castShadow><cylinderGeometry args={[.055,.065,.65,12]}/><meshStandardMaterial color="#af8267"/></mesh>
 </group>}
/** Personal kit: the person is suggested by what they bring to the court. */
export default function TennisBag(){return <group>
  <RoundedBox args={[3.35,1.15,1.35]} radius={.4} smoothness={6} position={[0,.66,0]} castShadow receiveShadow><meshStandardMaterial color="#46746d" roughness={.88}/></RoundedBox>
  <RoundedBox args={[2.8,.64,.08]} radius={.22} smoothness={5} position={[0,.67,.66]} castShadow><meshStandardMaterial color="#e6dcc5" roughness={.85}/></RoundedBox>
  <RoundedBox args={[2.65,.14,.68]} radius={.065} position={[0,1.22,0]}><meshStandardMaterial color="#263e39" roughness={1}/></RoundedBox>
  <RoundedBox args={[2.68,.09,.48]} radius={.04} position={[0,1.3,-.4]} rotation={[-.4,0,0]} castShadow><meshStandardMaterial color="#73988b" roughness={.85}/></RoundedBox>
  <Handle z={.48}/><Handle z={-.48}/>
  <group position={[-.75,1.22,0]} rotation={[0,0,.13]}>
   <RoundedBox args={[.52,.66,.18]} radius={.025} castShadow><meshStandardMaterial color="#b98b69"/></RoundedBox>
   <mesh position={[0,.02,.1]}><boxGeometry args={[.46,.58,.02]}/><meshStandardMaterial color="#f0e7cf"/></mesh>
  </group>
  <Racket/>
  <mesh position={[1.22,1.22,.2]}><sphereGeometry args={[.19,20,12]}/><meshStandardMaterial color="#cbd583" roughness={1}/></mesh>
 </group>;}
