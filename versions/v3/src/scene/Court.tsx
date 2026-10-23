import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useMemo, useEffect, useState, useRef } from 'react';
import { baselineRotation } from '../state/gameplay';
import * as THREE from 'three';

function Stripe({x=0,z=0,width=0.045,length=17.4}:{x?:number;z?:number;width?:number;length?:number}) {
  return <mesh position={[x,0.035,z]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[width,length]}/><meshStandardMaterial color="#fffdf8" roughness={1}/></mesh>;
}
export function Net() {
  const geometry=useMemo(()=>{
    const strands:THREE.BufferGeometry[]=[];
    for(let x=-4.95;x<=4.96;x+=.15){const top=1.05-.13*(1-(x/4.95)**2);strands.push(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(x,.12,0),new THREE.Vector3(x,top,0)),1,.0035,5,false))}
    for(let row=0;row<=9;row++){const t=row/9;const points=Array.from({length:25},(_,i)=>{const x=-4.95+i*9.9/24;return new THREE.Vector3(x,.12+t*(.93-.13*(1-(x/4.95)**2)),0)});strands.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,.0035,5,false))}
    const g=mergeGeometries(strands);strands.forEach(s=>s.dispose());return g;
  },[]);
  const tape=useMemo(()=>{const v:number[]=[],indices:number[]=[];for(let i=0;i<=48;i++){const x=-5.025+i*10.05/48,y=1.07-.13*(1-(x/5.025)**2);v.push(x,y+.032,.018,x,y-.032,.018);if(i<48){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(indices);g.computeVertexNormals();return g},[]);
  useEffect(()=>()=>{geometry.dispose();tape.dispose()},[geometry,tape]);
  return <group name="Court_Net">
    <mesh name="Woven_Net_Cords" geometry={geometry} castShadow><meshStandardMaterial color="#516b69" roughness={.9}/></mesh>
    <mesh geometry={tape} castShadow><meshStandardMaterial color="#fffdf3" side={THREE.DoubleSide} roughness={.78}/></mesh><mesh position={[0,.48,.025]}><boxGeometry args={[.045,.96,.012]}/><meshStandardMaterial color="#f6f2e6" roughness={.8}/></mesh>
    {[-1,1].map(sign=><group key={sign} position={[sign*5.05,0,0]}>
      <mesh position={[0,.6,0]} castShadow><cylinderGeometry args={[.065,.08,1.2,32]}/><meshStandardMaterial color="#64877e" metalness={.25} roughness={.42}/></mesh>
      <mesh position={[0,1.205,0]} scale={[1,.45,1]}><sphereGeometry args={[.073,24,12]}/><meshStandardMaterial color="#d8d3bb" metalness={.35}/></mesh>
      <mesh position={[0,.035,0]}><cylinderGeometry args={[.16,.18,.07,32]}/><meshStandardMaterial color="#64877e"/></mesh>
      {[0,1,2,3].map(i=><mesh key={i} position={[.12*Math.cos(i*Math.PI/2),.076,.12*Math.sin(i*Math.PI/2)]}><cylinderGeometry args={[.012,.012,.012,6]}/><meshStandardMaterial color="#bcc7bd" metalness={.6} roughness={.35}/></mesh>)}
      <mesh name="Net_Tension_Winch" position={[sign*.09,.82,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.042,.042,.10,24]}/><meshStandardMaterial color="#d8d3bb" metalness={.4}/></mesh>
      <mesh position={[sign*.15,.76,0]}><boxGeometry args={[.018,.13,.018]}/><meshStandardMaterial color="#71877f"/></mesh>
      <mesh position={[sign*.18,.70,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.015,.015,.08,16]}/><meshStandardMaterial color="#d8d3bb"/></mesh>
      <mesh name="Net_Side_Binding" position={[-sign*.10,.59,0]}><boxGeometry args={[.045,.96,.018]}/><meshStandardMaterial color="#e8e5d6" roughness={.85}/></mesh>
      {[.22,.45,.68,.91,1.06].map(y=><mesh key={y} position={[-sign*.055,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.052,.003,5,16]}/><meshStandardMaterial color="#e8e5d6"/></mesh>)}
    </group>)}
    <mesh name="Center_Strap_Buckle" position={[0,.38,.045]}><boxGeometry args={[.063,.045,.014]}/><meshStandardMaterial color="#819387" metalness={.5} roughness={.3}/></mesh>
    <mesh position={[0,.035,.04]}><cylinderGeometry args={[.06,.06,.025,20]}/><meshStandardMaterial color="#819387"/></mesh>

  </group>;
}
function GroundPrint({end,x,lines,signature=false}:{end:number;x:number;lines:string[];signature?:boolean}){
 const gl=useThree(s=>s.gl),[hover,setHover]=useState(false);

 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=2048;c.height=512;const ctx=c.getContext('2d')!;ctx.scale(2,2);ctx.fillStyle=signature?'#3e6674':'#527785';ctx.textAlign='center';ctx.font=signature?'italic 100px Georgia,serif':'italic 700 37px Arial,sans-serif';lines.forEach((line,i)=>ctx.fillText(line,512,signature?147:100+i*58));if(signature){ctx.strokeStyle='#3e6674';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(235,183);ctx.quadraticCurveTo(510,148,792,174);ctx.stroke()}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=gl.capabilities.getMaxAnisotropy();return t},[signature,lines.join('|')]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <group position={[x,.025,end*9.8]}>
 <mesh name={signature?'Baseline_luluzhao_signature':'Baseline_fun_fact'} rotation={[-Math.PI/2,0,baselineRotation(end)]} onPointerOver={e=>{if(signature)return;e.stopPropagation();setHover(true);document.body.style.cursor='grab'}} onPointerOut={()=>{setHover(false);document.body.style.cursor=''}}><planeGeometry args={[signature?3.7:2.8,signature?.92:1.0]}/><meshBasicMaterial map={texture} color={hover?'#c28235':'#ffffff'} transparent depthWrite={false}/></mesh>
 {!signature&&<><mesh position={[0,-.008,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[2.9,1.08]}/><meshBasicMaterial color={hover?'#f3eac9':'#dce8e4'} transparent opacity={hover?.95:.6}/></mesh></>}
 </group>;
}
function BaselineDeclaration(){return <>{[-1,1].map(end=><group key={end}><GroundPrint end={end} x={0} signature lines={['luluzhao']}/><GroundPrint end={end} x={-4.1} lines={end>0?["🛹 I'm into plenty of",'other sports too!']:["🏠 I literally live right",'next to the tennis courts.']}/><GroundPrint end={end} x={4.1} lines={end>0?['🐐 Team Djokovic','all the way. GOAT!']:["🎾 Want to hit sometime?","Let's rally!"]}/></group>)}</>}
function Perimeter(){
 const edge=useMemo(()=>{const shape=new THREE.Shape();const x=6.12,z=10.77,r=.55;shape.moveTo(-x+r,-z);shape.lineTo(x-r,-z);shape.quadraticCurveTo(x,-z,x,-z+r);shape.lineTo(x,z-r);shape.quadraticCurveTo(x,z,x-r,z);shape.lineTo(-x+r,z);shape.quadraticCurveTo(-x,z,-x,z-r);shape.lineTo(-x,-z+r);shape.quadraticCurveTo(-x,-z,-x+r,-z);return new THREE.CatmullRomCurve3(shape.getPoints(24).map(p=>new THREE.Vector3(p.x,-.13,p.y)),true)},[]);
 const g=useMemo(()=>new THREE.TubeGeometry(edge,180,.085,8,true),[edge]);useEffect(()=>()=>g.dispose(),[g]);
 return <group name="Ivory_Court_Binding"><mesh geometry={g} castShadow><meshStandardMaterial color="#f5ead4" roughness={.5}/></mesh><mesh geometry={g} position={[0,-.28,0]}><meshStandardMaterial color="#d2ba91" metalness={.15} roughness={.5}/></mesh>
 {[-1,1].map(end=><group key={end}>{[-5.6,-3,0,3,5.6].map(x=><RoundedBox key={x} args={[.18,.22,.18]} radius={.035} position={[x,.11,end*10.65]} castShadow><meshStandardMaterial color="#efe4cb"/></RoundedBox>)}</group>)}
 </group>
}
export default function Court(_props:{night:boolean}){
 const root=useRef<THREE.Group>(null);
 const grit=useMemo(()=>{const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!;const image=ctx.createImageData(256,256);let seed=42;for(let i=0;i<image.data.length;i+=4){seed=(1664525*seed+1013904223)>>>0;const v=222+(seed%34);image.data[i]=image.data[i+1]=image.data[i+2]=v;image.data[i+3]=255}ctx.putImageData(image,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(12,24);return t},[]);
 useEffect(()=>()=>grit.dispose(),[grit]);
 return <group ref={root} name="Court">
  <RoundedBox name="Court_Platform" args={[12.4,.65,21.7]} radius={.25} smoothness={3} position={[0,-.36,0]} receiveShadow castShadow><meshStandardMaterial color="#ede2cb" bumpMap={grit} bumpScale={.001} roughness={.95}/></RoundedBox>
  <RoundedBox name="Sky_Blue_Runoff" args={[12.08,.065,21.38]} radius={.025} smoothness={6} position={[0,-.05,0]} receiveShadow><meshStandardMaterial color="#a8cbde" roughness={.87} bumpMap={grit} bumpScale={.0012}/></RoundedBox>
  <Perimeter/>
  <mesh name="Court_PlayingSurface" position={[0,.004,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[8.7,17.4]}/><meshStandardMaterial color="#c0afd2" bumpMap={grit} bumpScale={.0018} roughnessMap={grit} roughness={.83} metalness={.025}/></mesh>
  {[-4.35,-3.3,3.3,4.35].map(x=><Stripe key={x} x={x}/>)}
  {[-8.7,8.7].map(z=><Stripe key={z} z={z} width={8.73} length={.045}/>)}
  {[-4.5,4.5].map(z=><Stripe key={z} z={z} width={6.6} length={.045}/>)}
  <Stripe length={9}/>
  {[-8.6,8.6].map(z=><Stripe key={z} z={z} length={.18}/>)}
  <Net/><BaselineDeclaration/>
  {[-1,1].map(x=><mesh key={x} position={[x*6.13,-.30,0]}><boxGeometry args={[.06,.13,21]}/><meshStandardMaterial color="#f1e7cc" metalness={.3} roughness={.5}/></mesh>)}
  <RoundedBox args={[12.15,.10,21.45]} radius={.22} position={[0,-.66,0]}><meshStandardMaterial color="#d5c5a9"/></RoundedBox>
  {[-5.65,5.65].map(x=><mesh key={x} position={[x,.008,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.025,20.6]}/><meshStandardMaterial color="#dce9e6"/></mesh>)}

 </group>;
}
