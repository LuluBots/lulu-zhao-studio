import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
const center=new Vector3(0,.25,0),long=new Vector3(.48,.877,0),wide=new Vector3(.877,-.48,0);
const point=(u:number,v=0,z=0)=>center.clone().addScaledVector(long,u).addScaledVector(wide,v).add(new Vector3(0,0,z));
function Rod({a,b,r=.006,color='#dce2d4'}:{a:Vector3;b:Vector3;r?:number;color?:string}){
 const data=useMemo(()=>{const d=b.clone().sub(a);return {position:a.clone().add(b).multiplyScalar(.5),rotation:new Quaternion().setFromUnitVectors(new Vector3(0,1,0),d.clone().normalize()),length:d.length()}},[a,b]);
 return <mesh position={data.position} quaternion={data.rotation}><cylinderGeometry args={[r,r,data.length,8]}/><meshStandardMaterial color={color} roughness={.65}/></mesh>;
}
export default function HandRacket(){
 const wrapRotation=useMemo(()=>new Quaternion().setFromUnitVectors(new Vector3(0,0,1),long),[]);
 return <group name="Detailed_Visitor_Racket">
  <mesh position={center} rotation={[0,0,-Math.asin(long.x)]} scale={[.79,1,1]}><torusGeometry args={[.34,.025,8,64]}/><meshStandardMaterial color="#8ea6a6" roughness={.5}/></mesh>
  <mesh position={[0,.25,.021]} rotation={[0,0,-Math.asin(long.x)]} scale={[.79,1,1]}><torusGeometry args={[.345,.006,6,64]}/><meshStandardMaterial color="#efdec0"/></mesh>
  {[-1,1].map(s=><Rod key={s} a={point(-.51)} b={point(-.25,s*.13)} r={.015} color="#8ea6a6"/>)}
  <Rod a={point(-.91)} b={point(-.875)} r={.046} color="#b8aa91"/>
  <Rod a={point(-.88)} b={point(-.51)} r={.035} color="#efdec0"/>
  {Array.from({length:16},(_,i)=><mesh key={i} position={point(-.87+i*.023)} quaternion={wrapRotation}><torusGeometry args={[.036,.004,6,16]}/><meshStandardMaterial color="#fff4dd"/></mesh>)}
  {[-.21,-.168,-.126,-.084,-.042,0,.042,.084,.126,.168,.21].map(v=>{const h=.34*Math.sqrt(1-(v/.2686)**2);return <Rod key={v} a={point(-h,v)} b={point(h,v)} r={.003}/>})}
  {[-.28,-.224,-.168,-.112,-.056,0,.056,.112,.168,.224,.28].map(u=>{const h=.2686*Math.sqrt(1-(u/.34)**2);return <Rod key={u} a={point(u,-h,.005)} b={point(u,h,.005)} r={.003}/>})}
 </group>;
}
