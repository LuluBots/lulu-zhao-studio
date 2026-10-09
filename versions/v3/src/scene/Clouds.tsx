import { useFrame } from '@react-three/fiber';
import { obscuresScoreboard } from './scoreboardVisibility';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Object3D, Vector3 } from 'three';
const clusters:[number,number,number,number][]=[[-6,-3.5,6,1.6],[4,-3.6,8,1.7],[-5,-3.8,-7,1.9],[5,-3.5,-5,1.65],[0,-4.1,1,2.1],[-9,-1,-2,.85],[12,-3,-14,.85],[-10,-3.5,-16,.75],[9,-1,5,.85],[-8,-2,13,1.15],[2,-3,-12,1.35]];
const puffs:[[number,number,number],[number,number,number]][]=[[[0,0,0],[2.2,.75,1.6]],[[-1.25,.13,.1],[1.4,.9,1.3]],[[.9,.3,.1],[1.4,1.05,1.2]],[[0,.55,-.2],[1.35,1.1,1.2]],[[1.65,-.04,.25],[1.3,.65,1.1]]];
function Bank({distant=false}:{distant?:boolean}){
 const ref=useRef<InstancedMesh>(null);
 const matrices=useMemo(()=>{
  const points=distant?Array.from({length:9},(_,i)=>[Math.sin(i*2.4)*(29+i%3*4),-10-i%3,Math.cos(i*2.4)*(29+i%3*4),1.4+i%3*.25]):clusters;
  const temp=new Object3D();return points.flatMap(([x,y,z,s])=>puffs.map(([p,scale])=>{temp.position.set(x+p[0]*s,y+p[1]*s,z+p[2]*s);temp.scale.set(scale[0]*s,scale[1]*s*(distant?.6:1),scale[2]*s);temp.updateMatrix();return temp.matrix.clone()}));
 },[distant]);
 const cache=useMemo(()=>matrices.map(matrix=>({matrix,center:new Vector3().setFromMatrixPosition(matrix),radius:new Vector3().setFromMatrixScale(matrix).length(),hidden:false,clearFor:1.5,amount:1})),[matrices]);
 const elapsed=useRef(0),scale=useMemo(()=>new Vector3(),[]);
 useFrame(({camera},delta)=>{if(!ref.current)return;const dt=Math.min(delta,.05);elapsed.current+=dt;const check=elapsed.current>=.25;if(check)elapsed.current=0;let changed=false;
  cache.forEach((item,i)=>{if(check)item.hidden=obscuresScoreboard(camera,item.center,item.radius);item.clearFor=item.hidden?0:item.clearFor+dt;
   const target=item.hidden||item.clearFor<1.5?0:1;const speed=target===0?1.2:.35;
   const next=item.amount+Math.max(-dt*speed,Math.min(dt*speed,target-item.amount));
   if(Math.abs(next-item.amount)>.00001){item.amount=next;scale.setScalar(Math.max(.0001,next));ref.current!.setMatrixAt(i,item.matrix.clone().scale(scale));changed=true;}
  });if(changed)ref.current.instanceMatrix.needsUpdate=true;
 });
 useLayoutEffect(()=>{if(ref.current){matrices.forEach((m,i)=>ref.current!.setMatrixAt(i,m));ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere()}},[matrices]);
 return <instancedMesh ref={ref} args={[undefined,undefined,matrices.length]} name={distant?'Hazy_Cloud_Bank':'Nearby_Cloud_Bank'}><sphereGeometry args={[1,20,14]}/><meshStandardMaterial color={distant?'#edf1f3':'#fffdf7'} roughness={1} emissive={distant?'#d5e2ec':'#000000'} emissiveIntensity={distant?.22:0}/></instancedMesh>;
}
export default function Clouds(){return <group name="Clouds"><Bank/><Bank distant/></group>}
