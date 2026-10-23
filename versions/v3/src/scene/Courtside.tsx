import { useIndirectLight } from './useIndirectLight';
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
export function Bench(){return <group name="Rest_Bench">
 {[-.78,.78].map(x=><group key={x}>
  {[-.21,.22].map(z=><group key={z}><RoundedBox name="Bench_Support_Leg" args={[.10,.49,.10]} radius={.018} position={[x,.215,z]} castShadow><meshStandardMaterial color={sage} metalness={.18} roughness={.48}/></RoundedBox><RoundedBox args={[.18,.035,.18]} radius={.012} position={[x,-.015,z]}><meshStandardMaterial color="#526b65"/></RoundedBox></group>)}
  <Bar a={[x,.35,-.26]} b={[x,.35,.28]} r={.038}/><Bar a={[x,.42,-.26]} b={[x,1.03,-.35]} r={.035}/>
  <Piping points={[[x,.46,.25],[x,.68,.24],[x,.73,.10],[x,.73,-.17],[x,.65,-.3]]} color={sage} r={.028}/>
  <RoundedBox args={[.09,.055,.40]} radius={.025} position={[x,.735,-.005]} castShadow><meshStandardMaterial color={wood}/></RoundedBox>
 </group>)}
 <Bar a={[-.8,.21,0]} b={[.8,.21,0]} r={.028}/>
 {[0,1,2,3].map(i=><RoundedBox key={i} args={[2.05,.065,.12]} radius={.018} position={[0,.48,-.20+i*.14]} castShadow receiveShadow><meshStandardMaterial color={wood} roughness={.57}/></RoundedBox>)}
 {[.70,.86,1.02].map(y=><group key={y}><RoundedBox args={[2.05,.125,.06]} radius={.018} position={[0,y,-.29-(y-.7)*.12]} rotation={[-.12,0,0]} castShadow><meshStandardMaterial color={wood}/></RoundedBox>{[-.78,.78].map(x=><mesh name="Bench_Recessed_Fastener" key={x} position={[x,y,-.252-(y-.7)*.12]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.012,.012,.008,12]}/><meshStandardMaterial color="#71857c" metalness={.5} roughness={.4}/></mesh>)}</group>)}
 <RoundedBox args={[.66,.07,.38]} radius={.03} position={[-.34,.55,0]} castShadow><meshStandardMaterial color="#e9dccc"/></RoundedBox>
 <Piping points={[[-.65,.57,-.17],[-.65,.57,.16],[-.03,.57,.16],[-.03,.57,-.17],[-.65,.57,-.17]]} color="#c4aa8e" r={.0035}/>
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
 <mesh position={[0,.06,0]} castShadow><cylinderGeometry args={[.32,.38,.12,48]}/><meshStandardMaterial color="#d8d2bc" roughness={.85}/></mesh><mesh position={[0,.15,0]}><cylinderGeometry args={[.085,.105,.17,24]}/><meshStandardMaterial color={sage} metalness={.3}/></mesh>
 <mesh name="Parasol_Sliding_Hub" position={[0,2.53,0]}><cylinderGeometry args={[.075,.075,.16,24]}/><meshStandardMaterial color={sage}/></mesh>
 <mesh position={[0,3.66,0]} castShadow><coneGeometry args={[.24,.12,36]}/><meshStandardMaterial color={ivory}/></mesh>
 <mesh position={[0,3.74,0]}><sphereGeometry args={[.045,16,12]}/><meshStandardMaterial color={wood}/></mesh>
 {panels.map((array,i)=>{const a=i*Math.PI/6;return <group key={i}>
 <mesh castShadow geometry={array}><meshStandardMaterial color={i%3===0?'#9bb5a2':ivory} side={2} roughness={.88}/></mesh>
 <mesh name="Scalloped_Linen_Valance" castShadow geometry={valances[i]}><meshStandardMaterial color={i%3===0?'#9bb5a2':ivory} side={2} roughness={.88}/></mesh>
 <Piping points={Array.from({length:9},(_,j)=>{const t=j/8;return [1.55*t*Math.cos(a),3.655-.24*t-.18*t*t,1.55*t*Math.sin(a)] as [number,number,number]})} r={.007}/>
 <Piping points={Array.from({length:7},(_,j)=>{const t=j/6;return [1.55*t*Math.cos(a),3.615-.24*t-.18*t*t,1.55*t*Math.sin(a)] as [number,number,number]})} color={wood} r={.012}/>
 <Bar a={[0,2.56,0]} b={[.85*Math.cos(a),3.40,.85*Math.sin(a)]} r={.014} color={wood}/>
 <mesh position={[.85*Math.cos(a),3.40,.85*Math.sin(a)]}><sphereGeometry args={[.023,8,6]}/><meshStandardMaterial color={sage}/></mesh>
 </group>})}
 </group>;
}
function Planter({tree=false}:{tree?:boolean}){return <group>
 <mesh position={[0,.24,0]} castShadow><cylinderGeometry args={[tree?.36:.3,tree?.27:.24,.48,12]}/><meshStandardMaterial color="#d8b8a1" roughness={1}/></mesh>
 <mesh position={[0,.477,0]}><cylinderGeometry args={[tree?.33:.27,tree?.33:.27,.02,12]}/><meshStandardMaterial color="#787e64"/></mesh>
 {tree?<><Bar a={[0,.4,0]} b={[.1,2,0]} r={.042} color="#9d8a70"/>{Array.from({length:9},(_,i)=><group key={i} position={[Math.sin(i*2.4)*.35,1.15+i*.11,Math.cos(i*2.4)*.28]}><mesh castShadow scale={[.47,.30,.38]}><sphereGeometry args={[1,20,12]}/><meshStandardMaterial color={i%2?'#9dad88':'#809a7e'} roughness={1}/></mesh></group>)}</>:Array.from({length:8},(_,i)=><group key={i} position={[Math.sin(i*2.4)*.2,.47,Math.cos(i*2.4)*.2]}><Bar a={[0,0,0]} b={[0,.45+(i%3)*.12,0]} r={.012} color="#8a9e77"/><mesh position={[0,.45+(i%3)*.12,0]} scale={[.085,.18,.085]}><sphereGeometry args={[1,20,12]}/><meshStandardMaterial color={i%2?'#b9a3c2':'#d7b9cd'}/></mesh></group>)}
 </group>}
function UmpireChair(){return <group name="Umpire_Chair" position={[-7.25,0,0]} rotation={[0,Math.PI/2,0]}>
 {[-.48,.48].map(x=><group key={x}><Bar a={[x,0,-.65]} b={[x,2.1,-.36]} r={.055}/><Bar a={[x,0,.7]} b={[x,2.1,.27]} r={.055}/><Bar a={[x,2,-.36]} b={[x,2.9,-.36]} r={.04}/><Bar a={[x,2.45,-.36]} b={[x,2.45,.3]} r={.035}/></group>)}
 {[.35,.7,1.05,1.4,1.75].map(y=><Bar key={y} a={[-.48,y,.7-y*.2]} b={[.48,y,.7-y*.2]} r={.045} color={ivory}/>)}
 <RoundedBox args={[1.08,.13,.8]} radius={.05} position={[0,2.08,-.04]} castShadow><meshStandardMaterial color={ivory}/></RoundedBox>
 <RoundedBox args={[1.08,.63,.09]} radius={.06} position={[0,2.6,-.37]} castShadow><meshStandardMaterial color={ivory}/></RoundedBox>
 <RoundedBox args={[1.6,.09,1.42]} radius={.04} smoothness={4} position={[0,3.13,-.1]} rotation={[.09,0,0]} castShadow><meshStandardMaterial color="#ddbbbd"/></RoundedBox>
 {[-.55,.55].map(x=><Bar key={x} a={[x,2.1,-.5]} b={[x,3.1,-.5]} color={ivory}/>)}
 </group>}
export default function Courtside({night}:{night:boolean}){
 const root=useRef<Group>(null);const fabric=useMemo(()=>surfaceTexture('fabric',5),[]),woodGrain=useMemo(()=>surfaceTexture('wood',2),[]);
 useEffect(()=>{const materials:MeshStandardMaterial[]=[];root.current?.traverse(o=>{if(o instanceof Mesh&&o.material instanceof MeshStandardMaterial){const m=o.material.clone();const timber=m.color.getHexString()===wood.slice(1);const textile=['f2ead8','9bb5a2','e8d7ce'].includes(m.color.getHexString());m.bumpMap=timber?woodGrain:textile?fabric:null;m.bumpScale=timber?.0015:.0007;m.roughness=timber?.56:textile?.83:.42;o.material=m;materials.push(m)}});return ()=>{materials.forEach(m=>m.dispose());fabric.dispose();woodGrain.dispose()}},[fabric,woodGrain]);
 useIndirectLight(root,night);
 return <group ref={root} name="Courtside_Symmetric">
 <RoundedBox name="Indirect_Deck" args={[2.2,.30,3.1]} radius={.35} position={[-7.25,-.19,0]} receiveShadow><meshStandardMaterial color="#d9d6c5"/></RoundedBox>
 <UmpireChair/>
 <RoundedBox name="Indirect_Deck" args={[3.3,.32,12]} radius={.4} position={[6.65,-.21,0]} receiveShadow castShadow><meshStandardMaterial color="#d9d6c5"/></RoundedBox>
 {[-1,1].map(end=><group key={end} name={end<0?'Rest_North':'Rest_South'} scale={[1,1,end]}>
  {Array.from({length:13},(_,i)=><mesh name="Indirect_Plank" key={i} position={[6.65,-.042,.2+i*.44]} receiveShadow><boxGeometry args={[3.04,.025,.40]}/><meshStandardMaterial color={i%3?'#e1d2bb':'#d9c8ad'}/></mesh>)}
  <group position={[6.7,.02,2.8]} rotation={[0,-Math.PI/2,0]}><Bench/></group>
  <group position={[7.65,0,2.8]} scale={.82}><Parasol/></group>
  <group position={[7.5,0,5.35]}><Planter tree/></group>
  <mesh position={[5.95,.36,1.1]} castShadow><cylinderGeometry args={[.45,.45,.07,24]}/><meshStandardMaterial color={ivory}/></mesh><Bar a={[5.95,0,1.1]} b={[5.95,.33,1.1]} r={.08}/>
  <mesh position={[5.95,.53,1.1]} castShadow><cylinderGeometry args={[.055,.06,.27,10]}/><meshStandardMaterial color="#b3cace"/></mesh>
 </group>)}
 </group>}
