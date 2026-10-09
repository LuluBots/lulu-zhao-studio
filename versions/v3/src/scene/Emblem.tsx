import type { Side } from '../state/rally';
export default function Emblem({side,color='#e1e9ec'}:{side:Side;color?:string}) {
 return <group>{side==='humanities'?<>
  <mesh rotation={[0,0,-.55]} scale={[.48,1,.16]}><sphereGeometry args={[1,12,8]}/><meshStandardMaterial color={color} roughness={1}/></mesh>
  <mesh position={[.05,-.08,.17]} rotation={[0,0,-.55]}><boxGeometry args={[.07,1.7,.025]}/><meshStandardMaterial color="#fff5dd"/></mesh>
 </>:<>
  <mesh rotation={[0,0,Math.PI/4]}><torusGeometry args={[.8,.075,4,4]}/><meshStandardMaterial color={color}/></mesh>
  <mesh><sphereGeometry args={[.18,8,6]}/><meshStandardMaterial color={color}/></mesh>
 </>}</group>;
}
