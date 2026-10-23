import { RoundedBox } from '@react-three/drei';
import { useMemo, useEffect, useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial, Vector3, Quaternion, BufferGeometry, Float32BufferAttribute, CatmullRomCurve3, TubeGeometry } from 'three';
import {surfaceTexture} from './surfaceTextures';
const ivory='#f2ead8',sage='#779c93',wood='#c9aa86';
function Bar({a,b,r=.035,color=sage}:{a:[number,number,number];b:[number,number,number];r?:number;color?:string}){
 const {mid,q,length}=useMemo(()=>{const start=new Vector3(...a),end=new Vector3(...b),d=end.clone().sub(start);return {mid:start.add(end).multiplyScalar(.5),q:new Quaternion().setFromUnitVectors(new Vector3(0,1,0),d.clone().normalize()),length:d.length()}},[a,b]);
 return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r,r,length,16]}/><meshStandardMaterial color={color}/></mesh>;
}
function Piping({points,color=ivory,r=.009}:{points:[number,number,number][];color?:string;r?:number}){
 const geometry=useMemo(()=>new TubeGeometry(new CatmullRomCurve3(points.map(p=>new Vector3(...p))),24,r,6,false),[JSON.stringify(points),r]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);return <mesh geometry={geometry}><meshStandardMaterial color={color} roughness={.65}/></mesh>;
}
export function Bench(){return <group name="Upholstered_Tennis_Bench">
 {[-.86,.86].map(x=><group key={x}>{[-.28,.28].map(z=><RoundedBox key={z} name="Bench_Support_Leg" args={[.085,.48,.09]} radius={.018} position={[x,.24,z]} castShadow><meshStandardMaterial color={wood}/></RoundedBox>)}<Bar a={[x,.38,-.28]} b={[x,.85,-.28]} color={wood} r={.035}/><Piping points={[[x,.80,-.29],[x,.85,-.1],[x,.85,.27]]} color={ivory} r={.04}/></group>)}
 <RoundedBox args={[1.92,.11,.77]} radius={.045} position={[0,.44,0]} castShadow><meshStandardMaterial color={wood}/></RoundedBox>
 <RoundedBox args={[1.89,.66,.10]} radius={.04} position={[0,.84,-.32]} castShadow><meshStandardMaterial color={wood}/></RoundedBox>
 {[-.6,0,.6].map(x=><group key={x} position={[x,0,0]}>
 <RoundedBox args={[.57,.15,.66]} radius={.065} smoothness={5} position={[0,.565,.015]} castShadow receiveShadow><meshStandardMaterial color="#f2ead8" roughness={.9}/></RoundedBox>
 <RoundedBox args={[.57,.48,.16]} radius={.065} smoothness={5} position={[0,.88,-.23]} rotation={[-.1,0,0]} castShadow><meshStandardMaterial color="#f2ead8" roughness={.9}/></RoundedBox>
 <Piping points={[[-.24,.64,-.25],[-.27,.64,.25],[0,.64,.33],[.27,.64,.25],[.24,.64,-.25]]} color="#c0cbd0" r={.005}/>
 </group>)}
 <RoundedBox args={[.34,.33,.14]} radius={.055} position={[-.57,.83,-.10]} rotation={[0,0,-.16]} castShadow><meshStandardMaterial color="#a9c7d6" roughness={.9}/></RoundedBox>
 </group>}
export function Parasol(){
 const panels=useMemo(()=>Array.from({length:12},(_,i)=>{
  const vertices:number[]=[],indices:number[]=[];
  for(let r=0;r<=8;r++)for(let j=0;j<=6;j++){
   const t=r/8,a=(i+j/6)*Math.PI/6,radius=1.55*t;
   const y=3.65-.24*t-.18*t*t-.07*Math.sin(Math.PI*j/6)*t*t;
   vertices.push(radius*Math.cos(a),y,radius*Math.sin(a));
  }
  for(let r=0;r<8;r++)for(let j=0;j<6;j++){const k=r*7+j;indices.push(k,k+7,k+1,k+1,k+7,k+8)}
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g;
 }),[]);
 const valances=useMemo(()=>Array.from({length:12},(_,i)=>{const v:number[]=[],ix:number[]=[];for(let j=0;j<=12;j++){const t=j/12,a=(i+t)*Math.PI/6,y=3.23-.07*Math.sin(Math.PI*t);v.push(1.55*Math.cos(a),y,1.55*Math.sin(a),1.55*Math.cos(a),y-.08-.07*Math.sin(Math.PI*t),1.55*Math.sin(a));if(j<12){const k=j*2;ix.push(k,k+1,k+2,k+1,k+3,k+2)}}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();return g}),[]);
 useEffect(()=>()=>[...panels,...valances].forEach(g=>g.dispose()),[panels,valances]);
 return <group name="Linen_Parasol"><Bar a={[0,0,0]} b={[0,3.68,0]} r={.04} color={wood}/>
 <RoundedBox args={[.52,.065,.52]} radius={.035} position={[0,.035,0]} castShadow><meshStandardMaterial color="#d8d2bc" roughness={.85}/></RoundedBox><mesh position={[0,.15,0]}><cylinderGeometry args={[.085,.105,.17,24]}/><meshStandardMaterial color={sage} metalness={.3}/></mesh>
 <mesh name="Parasol_Sliding_Hub" position={[0,2.53,0]}><cylinderGeometry args={[.075,.075,.16,24]}/><meshStandardMaterial color={sage}/></mesh>
 <mesh position={[0,3.66,0]} castShadow><coneGeometry args={[.24,.12,36]}/><meshStandardMaterial color={ivory}/></mesh>
 <mesh position={[0,3.74,0]}><sphereGeometry args={[.045,16,12]}/><meshStandardMaterial color={wood}/></mesh>
 {panels.map((array,i)=>{const a=i*Math.PI/6;return <group key={i}>
 <mesh castShadow geometry={array}><meshStandardMaterial color={i%2===0?'#adc8dc':ivory} side={2} roughness={.88}/></mesh>
 <mesh name="Scalloped_Linen_Valance" castShadow geometry={valances[i]}><meshStandardMaterial color={i%2===0?'#adc8dc':ivory} side={2} roughness={.88}/></mesh>
 <Piping points={Array.from({length:9},(_,j)=>{const t=j/8;return [1.55*t*Math.cos(a),3.655-.24*t-.18*t*t,1.55*t*Math.sin(a)] as [number,number,number]})} r={.007}/>
 <Piping points={Array.from({length:7},(_,j)=>{const t=j/6;return [1.55*t*Math.cos(a),3.615-.24*t-.18*t*t,1.55*t*Math.sin(a)] as [number,number,number]})} color={wood} r={.012}/>
 <Bar a={[0,2.56,0]} b={[.85*Math.cos(a),3.40,.85*Math.sin(a)]} r={.014} color={wood}/>
 <mesh position={[.85*Math.cos(a),3.40,.85*Math.sin(a)]}><sphereGeometry args={[.023,8,6]}/><meshStandardMaterial color={sage}/></mesh>
 </group>})}
 </group>;
}
function UmpireChair(){return <group name="Umpire_Chair" position={[-7.25,0,0]} rotation={[0,Math.PI/2,0]}>
 {[-.48,.48].map(x=><group key={x}><Bar a={[x,0,-.65]} b={[x,2.1,-.36]} r={.055}/><Bar a={[x,0,.7]} b={[x,2.1,.27]} r={.055}/><Bar a={[x,2,-.36]} b={[x,2.9,-.36]} r={.04}/><Bar a={[x,2.45,-.36]} b={[x,2.45,.3]} r={.035}/></group>)}
 {[.35,.7,1.05,1.4,1.75].map(y=><RoundedBox key={y} args={[.94,.065,.19]} radius={.018} position={[0,y,.7-y*.2]} castShadow><meshStandardMaterial color={ivory}/></RoundedBox>)}
 <RoundedBox args={[1.08,.13,.8]} radius={.05} position={[0,2.08,-.04]} castShadow><meshStandardMaterial color={ivory}/></RoundedBox>
 <RoundedBox args={[1.08,.63,.09]} radius={.06} position={[0,2.6,-.37]} castShadow><meshStandardMaterial color={ivory}/></RoundedBox>
 <RoundedBox args={[1.6,.09,1.42]} radius={.04} smoothness={4} position={[0,3.13,-.1]} rotation={[.09,0,0]} castShadow><meshStandardMaterial color="#e8dfcb"/></RoundedBox>
 {[-.55,.55].map(x=><Bar key={x} a={[x,2.1,-.5]} b={[x,3.1,-.5]} color={ivory}/>)}
 </group>}
export default function Courtside(_props:{night:boolean}){
 const root=useRef<Group>(null);const fabric=useMemo(()=>surfaceTexture('fabric',5),[]),woodGrain=useMemo(()=>surfaceTexture('wood',2),[]);
 useEffect(()=>{const materials:MeshStandardMaterial[]=[];root.current?.traverse(o=>{if(o instanceof Mesh&&o.material instanceof MeshStandardMaterial){const m=o.material.clone();const timber=m.color.getHexString()===wood.slice(1);const textile=['f2ead8','9bb5a2','e8d7ce'].includes(m.color.getHexString());m.bumpMap=timber?woodGrain:textile?fabric:null;m.bumpScale=timber?.0015:.0007;m.roughness=timber?.56:textile?.83:.42;o.material=m;materials.push(m)}});return ()=>{materials.forEach(m=>m.dispose());fabric.dispose();woodGrain.dispose()}},[fabric,woodGrain]);
 
 return <group ref={root} name="Courtside_Symmetric">
 {[-1,1].map(side=><group key={side} name="Joined_Terrace">
 <RoundedBox args={[2.9,.65,7.8]} radius={.02} position={[side*7.63,-.36,0]} receiveShadow castShadow><meshStandardMaterial color="#ece0c8"/></RoundedBox>
 <RoundedBox args={[2.78,.065,7.68]} radius={.025} position={[side*7.64,-.025,0]} receiveShadow><meshStandardMaterial color="#dccbb0"/></RoundedBox>
 {[-1,1].map(end=><group key={end}>
 <group position={[side*7.55,0,end*2.35]} rotation={[0,side*-Math.PI/2,0]}><Bench/></group>
 <group position={[side*8.35,0,end*2.35]} scale={.72}><Parasol/></group>
 </group>)}
 <RoundedBox args={[.10,.20,7.3]} radius={.035} position={[side*9.02,.08,0]}><meshStandardMaterial color="#f3e8d1"/></RoundedBox>
 </group>)}
 <UmpireChair/>
 </group>}
