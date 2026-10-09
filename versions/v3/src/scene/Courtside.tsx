import { RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import { Vector3, Quaternion, BufferGeometry, Float32BufferAttribute } from 'three';
const ivory='#f2ead8',sage='#779c93',wood='#c9aa86';
function Bar({a,b,r=.035,color=sage}:{a:[number,number,number];b:[number,number,number];r?:number;color?:string}){
 const {mid,q,length}=useMemo(()=>{const start=new Vector3(...a),end=new Vector3(...b),d=end.clone().sub(start);return {mid:start.add(end).multiplyScalar(.5),q:new Quaternion().setFromUnitVectors(new Vector3(0,1,0),d.clone().normalize()),length:d.length()}},[a,b]);
 return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r,r,length,8]}/><meshStandardMaterial color={color}/></mesh>;
}
function Bench(){return <group name="Rest_Bench">
 {[-.78,.78].flatMap(x=>[-.21,.22].map(z=><mesh key={`${x}-${z}`} name="Bench_Support_Leg" position={[x,.215,z]} castShadow><boxGeometry args={[.17,.55,.17]}/><meshStandardMaterial color="#54786f" metalness={.2} roughness={.65}/></mesh>))}
 {[-.78,.78].flatMap(x=>[-.21,.22].map(z=><mesh key={`foot-${x}-${z}`} name="Bench_Foot_Plate" position={[x,-.035,z]} receiveShadow><boxGeometry args={[.25,.05,.25]}/><meshStandardMaterial color="#54786f"/></mesh>))}
 {[-.78,.78].map(x=><Bar key={x} a={[x,.15,-.27]} b={[x,.15,.28]} r={.045}/>)}
 <Bar a={[-.8,.23,0]} b={[.8,.23,0]} r={.035}/>

 {[-.75,.75].map(x=><group key={x}><Bar a={[x,.04,-.22]} b={[x,.48,-.22]} r={.045}/><Bar a={[x,.04,.25]} b={[x,.48,.25]} r={.045}/><Bar a={[x,.42,-.25]} b={[x,1.02,-.32]} r={.04}/></group>)}
 {[0,1,2,3].map(i=><RoundedBox key={i} args={[2.05,.09,.115]} radius={.025} position={[0,.49,-.20+i*.14]} castShadow><meshStandardMaterial color={wood}/></RoundedBox>)}
 {[.72,.91].map(y=><RoundedBox key={y} args={[2.05,.15,.075]} radius={.03} position={[0,y,-.31]} castShadow><meshStandardMaterial color={wood}/></RoundedBox>)}
 <RoundedBox args={[.65,.055,.36]} radius={.025} position={[-.37,.56,0]} castShadow><meshStandardMaterial color="#e8d7ce"/></RoundedBox>
 <mesh position={[-.52,.43,.26]}><boxGeometry args={[.36,.28,.018]}/><meshStandardMaterial color="#e8d7ce"/></mesh>
 </group>}
function Parasol(){
 const panels=useMemo(()=>Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,b=(i+1)*Math.PI/6;const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute([0,3.65,0,1.55*Math.cos(a),3.23,1.55*Math.sin(a),1.55*Math.cos(b),3.23,1.55*Math.sin(b)],3));g.computeVertexNormals();return g}),[]);
 return <group name="Linen_Parasol"><Bar a={[0,0,0]} b={[0,3.68,0]} r={.045} color={wood}/><mesh position={[0,.06,0]}><cylinderGeometry args={[.33,.4,.12,16]}/><meshStandardMaterial color={ivory}/></mesh>
 {panels.map((array,i)=><group key={i}><mesh castShadow geometry={array}><meshStandardMaterial color={i%2===0?ivory:'#9bb5a2'} side={2} roughness={1}/></mesh><Bar a={[0,3.62,0]} b={[Math.cos(i*Math.PI/6)*1.55,3.21,Math.sin(i*Math.PI/6)*1.55]} color={ivory} r={.013}/></group>)}
 </group>;
}
function Planter({tree=false}:{tree?:boolean}){return <group>
 <mesh position={[0,.24,0]} castShadow><cylinderGeometry args={[tree?.36:.3,tree?.27:.24,.48,12]}/><meshStandardMaterial color="#d8b8a1" roughness={1}/></mesh>
 <mesh position={[0,.477,0]}><cylinderGeometry args={[tree?.33:.27,tree?.33:.27,.02,12]}/><meshStandardMaterial color="#787e64"/></mesh>
 {tree?<><Bar a={[0,.4,0]} b={[.1,2,0]} r={.042} color="#9d8a70"/>{Array.from({length:9},(_,i)=><group key={i} position={[Math.sin(i*2.4)*.35,1.15+i*.11,Math.cos(i*2.4)*.28]}><mesh castShadow scale={[.47,.30,.38]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={i%2?'#9dad88':'#809a7e'} roughness={1}/></mesh></group>)}</>:Array.from({length:8},(_,i)=><group key={i} position={[Math.sin(i*2.4)*.2,.47,Math.cos(i*2.4)*.2]}><Bar a={[0,0,0]} b={[0,.45+(i%3)*.12,0]} r={.012} color="#8a9e77"/><mesh position={[0,.45+(i%3)*.12,0]} scale={[.085,.18,.085]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={i%2?'#b9a3c2':'#d7b9cd'}/></mesh></group>)}
 </group>}
function UmpireChair(){return <group name="Umpire_Chair" position={[-7.25,0,.9]} rotation={[0,Math.PI/2,0]}>
 {[-.48,.48].map(x=><group key={x}><Bar a={[x,0,-.65]} b={[x,2.1,-.36]} r={.055}/><Bar a={[x,0,.7]} b={[x,2.1,.27]} r={.055}/><Bar a={[x,2,-.36]} b={[x,2.9,-.36]} r={.04}/><Bar a={[x,2.45,-.36]} b={[x,2.45,.3]} r={.035}/></group>)}
 {[.35,.7,1.05,1.4,1.75].map(y=><Bar key={y} a={[-.48,y,.7-y*.2]} b={[.48,y,.7-y*.2]} r={.045} color={ivory}/>)}
 <RoundedBox args={[1.08,.13,.8]} radius={.05} position={[0,2.08,-.04]} castShadow><meshStandardMaterial color={ivory}/></RoundedBox>
 <RoundedBox args={[1.08,.63,.09]} radius={.06} position={[0,2.6,-.37]} castShadow><meshStandardMaterial color={ivory}/></RoundedBox>
 <mesh position={[0,3.13,-.1]} rotation={[.09,0,0]} castShadow><boxGeometry args={[1.6,.09,1.42]}/><meshStandardMaterial color="#ddbbbd"/></mesh>
 {[-.55,.55].map(x=><Bar key={x} a={[x,2.1,-.5]} b={[x,3.1,-.5]} color={ivory}/>)}
 </group>}
export default function Courtside(){return <group name="Courtside_Garden">
 <RoundedBox args={[3.3,.32,9.2]} radius={.4} position={[6.65,-.21,2.1]} receiveShadow castShadow><meshStandardMaterial color="#d9d6c5"/></RoundedBox>
 {Array.from({length:20},(_,i)=><mesh key={i} position={[6.65,-.042,-2.1+i*.44]} receiveShadow><boxGeometry args={[3.04,.025,.40]}/><meshStandardMaterial color={i%3?'#e1d2bb':'#d9c8ad'}/></mesh>)}
 <RoundedBox args={[2.2,.30,3.1]} radius={.35} position={[-7.25,-.19,.9]} receiveShadow><meshStandardMaterial color="#d9d6c5"/></RoundedBox>
 <UmpireChair/>
 {[.25,4.25].map(z=><group key={z} position={[6.7,.02,z]} rotation={[0,-Math.PI/2,0]}><Bench/></group>)}
 {[.25,4.25].map(z=><group key={z} position={[7.65,0,z]} scale={.82}><Parasol/></group>)}
 <group position={[7.5,0,6.2]}><Planter tree/></group>

 <mesh position={[5.95,.36,2.35]} castShadow><cylinderGeometry args={[.45,.45,.07,24]}/><meshStandardMaterial color={ivory}/></mesh><Bar a={[5.95,0,2.35]} b={[5.95,.33,2.35]} r={.08}/>
 <mesh position={[5.95,.53,2.35]} castShadow><cylinderGeometry args={[.055,.06,.27,10]}/><meshStandardMaterial color="#b3cace"/></mesh>
 {[0,1,2].map(i=><mesh key={i} position={[5.62+i*.15,.18,-1.2]}><sphereGeometry args={[.10,12,8]}/><meshStandardMaterial color="#dfdf8e"/></mesh>)}
 </group>}
