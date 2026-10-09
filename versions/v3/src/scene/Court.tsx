import { useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useMemo, useEffect, useState } from 'react';
import { baselineRotation } from '../state/gameplay';
import * as THREE from 'three';

function Stripe({x=0,z=0,width=0.045,length=17.4}:{x?:number;z?:number;width?:number;length?:number}) {
  return <mesh position={[x,0.035,z]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[width,length]}/><meshStandardMaterial color="#fffdf8" roughness={1}/></mesh>;
}
function Net() {
  const geometry=useMemo(()=>{
    const vertices:number[]=[];
    for(let x=-4.95;x<=4.96;x+=0.19) vertices.push(x,0.12,0,x,1.05,0);
    for(let y=0.12;y<1.06;y+=0.13) vertices.push(-4.95,y,0,4.95,y,0);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));return g;
  },[]);
  return <group name="Court_Net">
    <lineSegments geometry={geometry}><lineBasicMaterial color="#647c86" transparent opacity={0.65}/></lineSegments>
    <mesh position={[0,1.07,0]} castShadow><boxGeometry args={[10.05,0.065,0.055]}/><meshStandardMaterial color="#fffdf3"/></mesh>
    {[-5.05,5.05].map(x=><group key={x} position={[x,0,0]}><mesh position={[0,.6,0]} castShadow><cylinderGeometry args={[.07,.085,1.2,12]}/><meshStandardMaterial color="#51737a"/></mesh><mesh position={[0,.04,0]}><cylinderGeometry args={[.19,.22,.08,16]}/><meshStandardMaterial color="#73939a"/></mesh></group>)}
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
export default function Court(){
 const grit=useMemo(()=>{const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d')!;const image=ctx.createImageData(128,128);let seed=42;for(let i=0;i<image.data.length;i+=4){seed=(1664525*seed+1013904223)>>>0;const v=222+(seed%34);image.data[i]=image.data[i+1]=image.data[i+2]=v;image.data[i+3]=255}ctx.putImageData(image,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(12,24);return t},[]);
 return <group name="Court">
  <RoundedBox name="Court_Platform" args={[12.4,.65,21.7]} radius={.25} smoothness={3} position={[0,-.36,0]} receiveShadow castShadow><meshStandardMaterial color="#b0d3e3" roughness={.95}/></RoundedBox>
  <mesh name="Court_PlayingSurface" position={[0,.004,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[8.7,17.4]}/><meshStandardMaterial color="#c5a6cd" bumpMap={grit} bumpScale={.012} roughnessMap={grit} roughness={.88} metalness={.025}/></mesh>
  {[-4.35,-3.3,3.3,4.35].map(x=><Stripe key={x} x={x}/>)}
  {[-8.7,8.7].map(z=><Stripe key={z} z={z} width={8.73} length={.045}/>)}
  {[-4.5,4.5].map(z=><Stripe key={z} z={z} width={6.6} length={.045}/>)}
  <Stripe length={9}/>
  {[-8.6,8.6].map(z=><Stripe key={z} z={z} length={.18}/>)}
  <Net/><BaselineDeclaration/>
  {[-1,1].map(end=><group key={end} position={[0,-.26,end*11.1]}><mesh receiveShadow><boxGeometry args={[9.8,.28,1.3]}/><meshStandardMaterial color="#89aebd" roughness={.9}/></mesh></group>)}
  {[-1,1].map(x=><mesh key={x} position={[x*6.13,-.30,0]}><boxGeometry args={[.06,.13,21]}/><meshStandardMaterial color="#f1e7cc" metalness={.3} roughness={.5}/></mesh>)}
  <RoundedBox args={[12.15,.10,21.45]} radius={.22} position={[0,-.66,0]}><meshStandardMaterial color="#ded4c6"/></RoundedBox>
  {[-5.65,5.65].map(x=><mesh key={x} position={[x,.008,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.025,20.6]}/><meshStandardMaterial color="#dce9e6"/></mesh>)}

 </group>;
}
