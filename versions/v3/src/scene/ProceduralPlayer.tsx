import { useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import type { VisitorInput } from '../state/gameplay';
import type { RallyClock } from './Rally';
import { samplePlayerPosition, targetPoint } from './trajectories';
import Emblem from './Emblem';
import { sides } from '../content/profile';
import type { Side } from '../state/rally';
import { RoundedBox } from '@react-three/drei';
function Limb({position,rotation=[0,0,0],length=.55,color='#eac4ab'}:{position:[number,number,number];rotation?:[number,number,number];length?:number;color?:string}){
 return <mesh position={position} rotation={rotation} castShadow><capsuleGeometry args={[.095,length,4,8]}/><meshStandardMaterial color={color} roughness={1}/></mesh>;
}
export default function Player({input,visitor=false,clock,reduced=false,side='technology',onSwitch,target=[0,-3.3],playing=false,power=.5}:{input?:RefObject<VisitorInput>;power?:number;target?:[number,number];playing?:boolean;visitor?:boolean;clock?:RefObject<RallyClock>;reduced?:boolean;side?:Side;onSwitch?:()=>void}){
 const swing=useRef<Group>(null),body=useRef<Group>(null),legs=useRef<Group>(null);
 const {gl}=useThree();
 useFrame(()=>{
 if(visitor&&input&&body.current){body.current.position.set(input.current.x,0,input.current.z);input.current.racket=[input.current.x-.66,1.2,input.current.z-.4]}
 if(!visitor&&body.current){const p=playing?(clock?.current.progress??0):0;body.current.position.set(...samplePlayerPosition(p,targetPoint(target),power));if(legs.current)legs.current.rotation.x=reduced?0:Math.sin(p*Math.PI*32)*.15*(p<.6||p>.73?1:0);}
 if(swing.current){const p=clock?.current.progress??0;const t=Math.max(0,1-Math.abs(p-(clock?.current.returnAt??.5))/.08);swing.current.rotation.y=reduced?0:-Math.sin(t*Math.PI/2)*1.25;}});
 const clothing=visitor?'#dddce8':sides[side].color;
 return <group ref={body} onClick={e=>{if(onSwitch){e.stopPropagation();if(e.delta<=5)onSwitch()}}} onPointerOver={e=>{if(onSwitch){e.stopPropagation();gl.domElement.style.cursor='pointer'}}} onPointerOut={()=>{gl.domElement.style.cursor=''}} name={visitor?'Visitor_Placeholder':'Lulu_Placeholder'} position={visitor?[-1.5,0,6.5]:[.9,0,-6.7]} rotation={[0,visitor?Math.PI:0,0]}>
  <group ref={legs}><Limb position={[-.17,.46,0]} length={.5}/><Limb position={[.17,.46,0]} length={.5}/>
  {[-.17,.17].map(x=><RoundedBox key={x} args={[.24,.19,.4]} radius={.065} smoothness={2} position={[x,.12,.065]} castShadow><meshStandardMaterial color="#fffdf3"/></RoundedBox>)}
  </group><mesh position={[0,1.14,0]} castShadow><cylinderGeometry args={[.25,.34,.66,12]}/><meshStandardMaterial color={clothing}/></mesh>
  {!visitor&&<mesh position={[0,.84,0]} castShadow><cylinderGeometry args={[.26,.42,.28,12]}/><meshStandardMaterial color={clothing}/></mesh>}
  {!visitor&&<group position={[0,1.26,.266]} scale={.11}><Emblem side={side} color={side==='humanities'?'#879e76':'#dce6eb'}/></group>}
  <Limb position={[-.34,1.1,.07]} rotation={[.2,0,-.23]} length={.39}/>
  <Limb position={[.39,1.12,.17]} rotation={[.5,0,.65]} length={.4}/>
  <mesh position={[0,1.69,0]} castShadow><sphereGeometry args={[.27,16,12]}/><meshStandardMaterial color="#eac4ab"/></mesh>
  <mesh position={[0,1.79,-.025]} castShadow><sphereGeometry args={[.28,16,12,0,Math.PI*2,0,1.65]}/><meshStandardMaterial color="#4b3b38" roughness={1}/></mesh>
  {!visitor&&<mesh position={[0,1.66,-.25]} castShadow><sphereGeometry args={[.17,12,8]}/><meshStandardMaterial color="#4b3b38"/></mesh>}
  {[-.09,.09].map(x=><mesh key={x} position={[x,1.69,.25]}><sphereGeometry args={[.019,8,6]}/><meshStandardMaterial color="#443b36"/></mesh>)}
  <mesh position={[0,1.83,.09]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.255,.035,6,24,Math.PI]}/><meshStandardMaterial color="#fff8e8"/></mesh>
  <group ref={swing} name="Racket" position={[.66,.97,.4]} rotation={[-.35,0,-.5]}>
   <mesh position={[0,-.13,0]}><cylinderGeometry args={[.035,.04,.35,8]}/><meshStandardMaterial color="#556977"/></mesh>
   <mesh position={[0,-.31,0]}><cylinderGeometry args={[.05,.05,.17,8]}/><meshStandardMaterial color="#f1e9d8"/></mesh>
   <mesh position={[0,.22,0]} scale={[.8,1.15,1]} castShadow><torusGeometry args={[.27,.027,8,24]}/><meshStandardMaterial color={visitor?'#aa9079':'#f2e4c3'}/></mesh>
   {[-.12,0,.12].map(v=><group key={v}><mesh position={[v,.22,0]}><boxGeometry args={[.008,.5-Math.abs(v),.008]}/><meshStandardMaterial color="#dddcca"/></mesh><mesh position={[0,.22+v,0]}><boxGeometry args={[.4-Math.abs(v),.008,.008]}/><meshStandardMaterial color="#dddcca"/></mesh></group>)}
  </group>
 </group>;
}
