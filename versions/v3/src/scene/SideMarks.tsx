import Emblem from './Emblem';
import type { Side } from '../state/rally';
export default function SideMarks({side,onSelect,enabled}:{side:Side;onSelect:(side:Side)=>void;enabled:boolean}){
 return <group name="Court_Identity_Marks">{(['technology','humanities'] as const).map(identity=><group key={identity} position={[identity==='technology'?-5.55:5.55,.045,identity==='technology'?-7:7]} rotation={[-Math.PI/2,0,identity==='technology'?0:Math.PI]} onClick={e=>{e.stopPropagation();if(enabled&&e.delta<=5)onSelect(identity)}} userData={{cursor:enabled?'pointer':undefined}}>
  <mesh><circleGeometry args={[.52,32]}/><meshStandardMaterial color={identity===side?'#f8efd8':'#d5e3e7'} roughness={1}/></mesh>
  <group position={[0,0,.008]} scale={.28}><Emblem side={identity} color={identity==='technology'?'#697f96':'#819974'}/></group>
 </group>)}</group>;
}
