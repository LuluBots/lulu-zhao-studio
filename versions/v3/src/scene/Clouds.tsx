import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { BufferGeometry, Mesh, MeshStandardMaterial, Plane, Raycaster, Vector2, Vector3 } from 'three';
import { obscuresScoreboard } from './scoreboardVisibility';
import { cloudEnvelope, sampleCloud, selectCloudVariant, type PointerSample } from './cloudMotion';
// Deliberate clusters under the platform, then two distant banks; keep the navigation airspace clear.
const banks=[[-5,-4.8,5,2.5],[3,-5.1,6,2.8],[-3,-5,-6,2.8],[4,-4.9,-4,2.4],[0,-5.5,0,3.1],[-23,-12,14,2.7],[25,-13,-18,3.0]];
type Wake={point:Vector3;born:number;variant:number;rotation:number;opacity:number;size:number};
function Cloud({geometries,index,bank,wake}:{geometries:BufferGeometry[];index:number;bank?:number[];wake?:Wake}){
 const mesh=useRef<Mesh>(null),material=useRef<MeshStandardMaterial>(null),visibility=useRef(1);
 const center=useMemo(()=>bank?new Vector3(...bank.slice(0,3) as [number,number,number]):new Vector3(),[bank]);
 const bankOpacity=useMemo(()=>(index<5?.62:.30)+Math.random()*.16,[]);
 useFrame(({camera,invalidate},delta)=>{
  if(!mesh.current||!material.current)return;
  const age=wake?(performance.now()-wake.born)/1000:0;
  if(wake)center.copy(wake.point);
  const size=bank?.[3]??wake?.size??1.6;
  const hidden=obscuresScoreboard(camera,center,2.6*size),target=hidden?0:1;
  visibility.current+=(target-visibility.current)*(1-Math.exp(-Math.min(delta,.05)*(hidden?6:1.4)));
  const alpha=(wake?cloudEnvelope(age):1)*visibility.current;
  material.current.opacity=alpha*(wake?.opacity??bankOpacity);mesh.current.visible=alpha>.012;
  mesh.current.geometry=geometries[wake?.variant??index%geometries.length];
  mesh.current.position.copy(center);mesh.current.rotation.y=wake?.rotation??(.65+(index%3-1)*.18);
  mesh.current.scale.setScalar(size*(wake?1+Math.min(5,Math.max(0,age))*.018:1));
  if((wake&&age<5)||Math.abs(target-visibility.current)>.002)invalidate();
 });
 return <mesh ref={mesh} geometry={geometries[index%geometries.length]} frustumCulled={false}><meshStandardMaterial ref={material} onBeforeCompile={shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <alphatest_fragment>',`diffuseColor.a *= smoothstep(0.0, 0.72, abs(dot(normalize(vNormal), normalize(vViewPosition))));
#include <alphatest_fragment>`);}} vertexColors roughness={.96} transparent depthWrite={false} color="#fffdf9" emissive="#b9cde0" emissiveIntensity={.055}/></mesh>;
}
export default function Clouds(){
 const {gl,camera,invalidate}=useThree();
 const {scene}=useGLTF('/models/clouds.glb?v=sculpted-2');
 const geometries=useMemo(()=>{const result:BufferGeometry[]=[];scene.traverse(o=>{if(o instanceof Mesh)result.push(o.geometry)});return result},[scene]);
 const reduced=useMemo(()=>matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
 const wake=useMemo(()=>Array.from({length:4},()=>({point:new Vector3(0,-6,0),born:-Infinity,variant:0,rotation:0,opacity:.35,size:1.6})),[]);
 useEffect(()=>{
  let previous:PointerSample|null=null,slot=0,lastVariant=0;const ray=new Raycaster(),pointer=new Vector2(),plane=new Plane(new Vector3(0,1,0),4.8),point=new Vector3();
  const move=(event:PointerEvent)=>{
   if(reduced||event.pointerType==='touch'||event.buttons)return;
   const next={x:event.clientX,y:event.clientY,time:performance.now()};
   if(!previous){previous=next;return}if(!sampleCloud(previous,next))return;previous=next;
   const rect=gl.domElement.getBoundingClientRect();pointer.set((next.x-rect.left)/rect.width*2-1,-(next.y-rect.top)/rect.height*2+1);
   ray.setFromCamera(pointer,camera);if(!ray.ray.intersectPlane(plane,point)||point.length()>60)return;
   if(Math.abs(point.x)<10&&Math.abs(point.z)<16)return;
   lastVariant=selectCloudVariant(lastVariant,geometries.length,Math.random());
   Object.assign(wake[slot],{born:next.time,variant:lastVariant,rotation:.65+(Math.random()-.5)*.6,opacity:.24+Math.random()*.25,size:1.35+Math.random()*.8});wake[slot].point.copy(point);
   slot=(slot+1)%wake.length;invalidate();
  };
  gl.domElement.addEventListener('pointermove',move);return ()=>gl.domElement.removeEventListener('pointermove',move);
 },[gl,camera,reduced,wake,invalidate,geometries.length]);
 return <group name="Blender_Cloud_Library">{banks.map((bank,i)=><Cloud key={i} geometries={geometries} index={i} bank={bank}/>)}{wake.map((w,i)=><Cloud key={`wake-${i}`} geometries={geometries} index={i} wake={w}/>)}</group>;
}
useGLTF.preload('/models/clouds.glb?v=sculpted-2');
