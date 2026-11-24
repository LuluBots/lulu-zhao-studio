import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useMemo, useEffect, useState, useRef } from 'react';
import { baselineRotation } from '../state/gameplay';
import * as THREE from 'three';

/** A single painted layer keeps intersections flush and all eleven lines in one draw. */
function CourtLines() {
  const geometry = useMemo(() => {
    const rectangles: [number, number, number, number][] = [];
    for (const x of [-4.35, -3.3, 3.3, 4.35]) rectangles.push([x, 0, .045, 17.4]);
    for (const end of [-1, 1]) {
      rectangles.push([0, end * 8.7, 8.74, .072], [0, end * 4.5, 6.6, .045], [0, end * 8.6, .045, .18]);
    }
    rectangles.push([0, 0, .045, 9]);
    const pieces = rectangles.map(([x, z, w, h]) =>
      new THREE.PlaneGeometry(w, h).rotateX(-Math.PI / 2).translate(x, .019, z)
    );
    const merged = mergeGeometries(pieces);
    pieces.forEach(piece => piece.dispose());
    return merged;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh name="Painted_Court_Markings" geometry={geometry} receiveShadow>
    <meshStandardMaterial color="#fffaf0" roughness={.91}/>
  </mesh>;
}

/** The two recessed drainage channels use a single texture so their slots mipmap at a distance. */
function SidelineDrainage() {
  const texture = useMemo(() => {
    const tile = document.createElement('canvas');
    tile.width = 128;
    tile.height = 256;
    const ctx = tile.getContext('2d')!;
    ctx.fillStyle = '#a9b5ad';
    ctx.fillRect(0, 0, 128, 256);
    ctx.fillStyle = '#d9d6bc';
    ctx.fillRect(0, 0, 9, 256);
    ctx.fillRect(119, 0, 9, 256);
    for (let y = 16; y < 256; y += 32) {
      ctx.fillStyle = '#536865';
      ctx.beginPath();
      ctx.roundRect(24, y, 80, 10, 5);
      ctx.fill();
    }
    const map = new THREE.CanvasTexture(tile);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.y = 30;
    map.anisotropy = 4;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <group name="Inset_Sideline_Drains">
    {[-5.82, 5.82].map(x => <mesh key={x} position={[x, -.013, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[.12, 20.6]}/>
      <meshStandardMaterial map={texture} roughness={.55} metalness={.24}/>
    </mesh>)}
  </group>;
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
 <mesh name={signature?'Baseline_luluzhao_signature':'Baseline_fun_fact'} rotation={[-Math.PI/2,0,baselineRotation(end)]} onPointerOver={e=>{if(signature)return;e.stopPropagation();setHover(true)}} onPointerOut={()=>{setHover(false)}}><planeGeometry args={[signature?3.7:2.8,signature?.92:1.0]}/><meshBasicMaterial map={texture} color={hover?'#c28235':'#ffffff'} transparent depthWrite={false}/></mesh>
 {!signature&&<><mesh position={[0,-.008,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[2.9,1.08]}/><meshBasicMaterial color={hover?'#f3eac9':'#dce8e4'} transparent opacity={hover?.95:.6}/></mesh></>}
 </group>;
}
function BaselineDeclaration(){return <>{[-1,1].map(end=><group key={end}><GroundPrint end={end} x={0} signature lines={['luluzhao']}/><GroundPrint end={end} x={-4.1} lines={end>0?["🛹 I'm into plenty of",'other sports too!']:["🏠 I literally live right",'next to the tennis courts.']}/><GroundPrint end={end} x={4.1} lines={end>0?['🐐 Team Djokovic','all the way. GOAT!']:["🎾 Want to hit sometime?","Let's rally!"]}/></group>)}</>}
function Perimeter(){
 const edge=useMemo(()=>{const shape=new THREE.Shape();const x=6.12,z=10.77,r=.55;shape.moveTo(-x+r,-z);shape.lineTo(x-r,-z);shape.quadraticCurveTo(x,-z,x,-z+r);shape.lineTo(x,z-r);shape.quadraticCurveTo(x,z,x-r,z);shape.lineTo(-x+r,z);shape.quadraticCurveTo(-x,z,-x,z-r);shape.lineTo(-x,-z+r);shape.quadraticCurveTo(-x,-z,-x+r,-z);return new THREE.CatmullRomCurve3(shape.getPoints(24).map(p=>new THREE.Vector3(p.x,-.13,p.y)),true)},[]);
 const g=useMemo(()=>new THREE.TubeGeometry(edge,180,.085,8,true),[edge]);useEffect(()=>()=>g.dispose(),[g]);
 return <group name="Ivory_Court_Binding"><mesh geometry={g} castShadow><meshStandardMaterial color="#f5ead4" roughness={.5}/></mesh><mesh geometry={g} position={[0,-.28,0]}><meshStandardMaterial color="#d2ba91" metalness={.15} roughness={.5}/></mesh>
 </group>
}
export default function Court({night}:{night:boolean}){
 const root=useRef<THREE.Group>(null);
 const grit=useMemo(()=>{const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!;const image=ctx.createImageData(256,256);let seed=42;for(let i=0;i<image.data.length;i+=4){seed=(1664525*seed+1013904223)>>>0;const v=222+(seed%34);image.data[i]=image.data[i+1]=image.data[i+2]=v;image.data[i+3]=255}ctx.putImageData(image,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(12,24);return t},[]);
 useEffect(()=>()=>grit.dispose(),[grit]);
 return <group ref={root} name="Court">
  <RoundedBox name="Court_Platform" args={[12.4,.65,21.7]} radius={.25} smoothness={3} position={[0,-.36,0]} receiveShadow castShadow><meshStandardMaterial color="#ede2cb" bumpMap={grit} bumpScale={.001} roughness={.95}/></RoundedBox>
  <RoundedBox name="Sky_Blue_Runoff" args={[12.08,.065,21.38]} radius={.025} smoothness={6} position={[0,-.05,0]} receiveShadow><meshStandardMaterial color={night?'#7099a7':'#9fc8c5'} roughness={.87} bumpMap={grit} bumpScale={.0012}/></RoundedBox>
  <Perimeter/>
  <mesh name="Court_PlayingSurface" position={[0,.004,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[8.7,17.4]}/><meshStandardMaterial color={night?'#7783ac':'#adaacb'} bumpMap={grit} bumpScale={.0018} roughnessMap={grit} roughness={.83} metalness={.025}/></mesh>
  <mesh name="Service_Box_Inlay" position={[0,.009,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
    <planeGeometry args={[6.6,9]}/><meshStandardMaterial color={night?'#697eaa':'#abb5d0'} bumpMap={grit} bumpScale={.0018} roughness={.86}/>
  </mesh>
  <CourtLines/>
  <Net/><BaselineDeclaration/>
  {[-1,1].map(x=><mesh key={x} position={[x*6.13,-.30,0]}><boxGeometry args={[.06,.13,21]}/><meshStandardMaterial color="#f1e7cc" metalness={.3} roughness={.5}/></mesh>)}
  <RoundedBox args={[12.15,.10,21.45]} radius={.22} position={[0,-.66,0]}><meshStandardMaterial color="#d5c5a9"/></RoundedBox>
  <SidelineDrainage/>

 </group>;
}
