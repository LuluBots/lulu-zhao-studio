import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Color, Float32BufferAttribute, InstancedMesh, MeshStandardMaterial, Object3D, Plane, Raycaster, SphereGeometry, Vector2, Vector3 } from 'three';
import { obscuresScoreboard } from './scoreboardVisibility';
import { cloudEnvelope, sampleCloud, type PointerSample } from './cloudMotion';
const banks=[[-6,-3.5,6,1.6],[4,-3.6,8,1.7],[-5,-3.8,-7,1.9],[5,-3.5,-5,1.65],[0,-4.1,1,2.1],[-11,-3,-2,.85],[12,-4,-14,.85],[-10,-4,-16,.75],[11,-3,5,.85],[-8,-4,15,1.15],[2,-4,-15,1.35],[-25,-8,5,2.1],[25,-9,-10,1.7],[-14,-10,-29,2.4],[18,-10,26,2.2],[-25,-9,26,1.8]];
type Wake={point:Vector3;born:number};
function Cloud({geometry,index,bank,wake,reduced}:{geometry:SphereGeometry;index:number;bank?:number[];wake?:Wake;reduced:boolean}){
 const mesh=useRef<InstancedMesh>(null),material=useRef<MeshStandardMaterial>(null),visibility=useRef(1);
 const center=useMemo(()=>bank?new Vector3(...bank.slice(0,3) as [number,number,number]):new Vector3(),[bank]);
 const size=bank?.[3]??.65;
 const matrices=useMemo(()=>{const temp=new Object3D();return Array.from({length:9},(_,j)=>{
   const angle=j*2.399+index*.73;
   const radius=j===0?0:1.05+(j%3)*.3;
   temp.position.set(Math.cos(angle)*radius,(j===0?.2:Math.sin(j*1.7+index)*.24)+.16,Math.sin(angle)*radius*.6);
   const lobe=.65+(Math.sin(j*3.1+index*1.9)+1)*.23;
   temp.scale.set(lobe*(index%3===0?1.5:1.1),lobe*(.65+(index%4)*.14),lobe);
   temp.rotation.set(j*.21,index*.37,j*.15);temp.updateMatrix();return temp.matrix.clone();
 })},[index]);
 useLayoutEffect(()=>{if(mesh.current){matrices.forEach((m,i)=>mesh.current!.setMatrixAt(i,m));mesh.current.instanceMatrix.needsUpdate=true;mesh.current.computeBoundingSphere()}},[matrices]);
 useFrame(({camera,invalidate},delta)=>{
   if(!mesh.current||!material.current)return;
   const age=wake?(performance.now()-wake.born)/1000:0;
   if(wake)center.copy(wake.point);
   const hidden=obscuresScoreboard(camera,center,2.8*size);
   const target=hidden?0:1;
   visibility.current+=(target-visibility.current)*(1-Math.exp(-Math.min(delta,.05)*(hidden?5:.7)));
   const alpha=(wake?cloudEnvelope(age):1)*visibility.current;
   material.current.opacity=alpha*(wake?.68:1);mesh.current.visible=alpha>.012;
   mesh.current.position.copy(center);
   // Only pointer-created wisps unfurl. Permanent banks never randomly pulse or shrink.
   const expansion=wake&&!reduced?1+Math.max(0,age-.55)*.025:1;
   mesh.current.scale.setScalar(size*expansion);
   if((wake&&age<11)||Math.abs(target-visibility.current)>.002)invalidate();
 });
 return <instancedMesh ref={mesh} args={[geometry,undefined,9]} frustumCulled={false}><meshStandardMaterial ref={material} vertexColors roughness={.96} transparent depthWrite={false} color="#fffdf7"/></instancedMesh>;
}
export default function Clouds(){
 const {gl,camera,invalidate}=useThree();
 const reduced=useMemo(()=>matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
 const geometry=useMemo(()=>{
  const g=new SphereGeometry(1,28,20),positions=g.attributes.position,colors=[];const shade=new Color();
  for(let i=0;i<positions.count;i++){
   const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
   const billow=1+.035*Math.sin(x*7+y*4)*Math.sin(z*8-x*3)+.012*Math.cos(y*14+z*9);
   positions.setXYZ(i,x*billow,y*billow,z*billow);
   shade.set('#e4eaf0').lerp(new Color('#fffdf5'),Math.max(0,Math.min(1,(y+.8)/1.6)));colors.push(shade.r,shade.g,shade.b);
  }
  g.setAttribute('color',new Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;
 },[]);
 const wake=useMemo(()=>Array.from({length:10},()=>({point:new Vector3(0,-6,0),born:-Infinity})),[]);
 useEffect(()=>{
  let previous:PointerSample|null=null,slot=0;const ray=new Raycaster(),pointer=new Vector2(),plane=new Plane(new Vector3(0,1,0),4.8),point=new Vector3();
  const move=(event:PointerEvent)=>{
   if(reduced||event.pointerType==='touch'||event.buttons)return;
   const next={x:event.clientX,y:event.clientY,time:performance.now()};
   if(!previous){previous=next;return}if(!sampleCloud(previous,next))return;previous=next;
   const rect=gl.domElement.getBoundingClientRect();pointer.set((next.x-rect.left)/rect.width*2-1,-(next.y-rect.top)/rect.height*2+1);
   ray.setFromCamera(pointer,camera);if(!ray.ray.intersectPlane(plane,point)||point.length()>60)return;
   // Keep the playing surface and both baseline scoreboards clear.
   if(Math.abs(point.x)<10&&Math.abs(point.z)<16)return;
   wake[slot].point.copy(point);wake[slot].born=next.time;slot=(slot+1)%wake.length;invalidate();
  };
  gl.domElement.addEventListener('pointermove',move);return ()=>gl.domElement.removeEventListener('pointermove',move);
 },[gl,camera,reduced,wake,invalidate]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <group name="Layered_Clouds">{banks.map((bank,i)=><Cloud key={i} geometry={geometry} index={i} bank={bank} reduced={reduced}/>)}{wake.map((w,i)=><Cloud key={`wake-${i}`} geometry={geometry} index={i+20} wake={w} reduced={reduced}/>)}</group>;
}
