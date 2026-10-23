import {RoundedBox} from '@react-three/drei';
import {useMemo,useEffect} from 'react';
import {LatheGeometry,Vector2,Shape,ExtrudeGeometry} from 'three';
export function Balloon({index}:{index:number}){
 const panels=useMemo(()=>{
 const profile=[ [.20,-1.50],[.32,-1.26],[.65,-.88],[.99,-.38],[1.18,.2],[1.17,.65],[.94,1.12],[.56,1.43],[0,1.55] ].map(p=>new Vector2(...p as [number,number]));
 return Array.from({length:12},(_,i)=>new LatheGeometry(profile,12,i*Math.PI/6,Math.PI/6));
 },[]);
 useEffect(()=>()=>panels.forEach(p=>p.dispose()),[panels]);
 const color=['#b999b5','#d8b987','#8eb6af','#93accb'][index];
 return <group name="Tailored_Balloon">
 {panels.map((g,i)=><mesh key={i} geometry={g} castShadow><meshStandardMaterial color={i%3===0?'#f7edd9':color} roughness={.82}/></mesh>)}
 <mesh position={[0,-1.46,0]}><torusGeometry args={[.21,.028,8,32]}/><meshStandardMaterial color="#b99b72"/></mesh>
 {[-.22,.22].flatMap(x=>[-.20,.20].map(z=><mesh key={`${x}-${z}`} position={[x,-1.72,z]}><cylinderGeometry args={[.014,.014,.62,8]}/><meshStandardMaterial color="#b69a75"/></mesh>))}
 <RoundedBox args={[.64,.36,.56]} radius={.06} smoothness={5} position={[0,-2.08,0]} castShadow><meshStandardMaterial color="#b7956c" roughness={.92}/></RoundedBox>
 {[-2.20,-2.12,-2.04,-1.96].map(y=><RoundedBox key={y} args={[.66,.025,.58]} radius={.012} position={[0,y,0]}><meshStandardMaterial color="#d0b38d" roughness={.85}/></RoundedBox>)}
 <RoundedBox args={[.69,.065,.61]} radius={.03} position={[0,-1.9,0]}><meshStandardMaterial color="#e1c49c"/></RoundedBox>
 </group>
}
function Wing({tail=false}:{tail?:boolean}){
 const geometry=useMemo(()=>{const s=new Shape();s.moveTo(.40,0);s.lineTo(-.05,2.15);s.quadraticCurveTo(-.15,2.35,-.44,2.18);s.lineTo(-.80,.28);s.lineTo(-.8,-.28);s.lineTo(-.44,-2.18);s.quadraticCurveTo(-.15,-2.35,-.05,-2.15);s.lineTo(.40,0);return new ExtrudeGeometry(s,{depth:.045,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.025,bevelThickness:.025})},[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} rotation={[-Math.PI/2,0,0]} scale={tail?.43:1} castShadow><meshStandardMaterial color={tail?'#e2ddc9':'#8caebf'} metalness={.18} roughness={.38}/></mesh>
}
export function Aircraft(){return <group rotation={[0,-.45,0]} name="Sculpted_Touring_Aircraft">
 <mesh scale={[2.15,.25,.30]} castShadow><sphereGeometry args={[1,48,24]}/><meshStandardMaterial color="#f1ecde" roughness={.35} metalness={.12}/></mesh>
 <mesh position={[.56,.18,0]} scale={[.63,.24,.25]}><sphereGeometry args={[1,32,16]}/><meshStandardMaterial color="#476b82" roughness={.2} metalness={.3}/></mesh>
 <Wing/><group position={[-1.55,.13,0]}><Wing tail/></group>
 <mesh position={[-1.60,.40,0]} scale={[.40,.48,.055]} rotation={[0,0,-.35]}><sphereGeometry args={[1,24,16]}/><meshStandardMaterial color="#8caebf"/></mesh>
 <mesh position={[2.1,0,0]} rotation={[0,0,Math.PI/2]}><coneGeometry args={[.17,.28,24]}/><meshStandardMaterial color="#b5bdba" metalness={.5} roughness={.25}/></mesh>
 {[-1,1].map(s=><group key={s}><mesh position={[-.29,.02,s*2.16]}><sphereGeometry args={[.045,12,8]}/><meshBasicMaterial color={s<0?'#f7a091':'#9edbbc'}/></mesh><mesh position={[-.15,-.09,s*.87]} scale={[.42,.13,.14]}><sphereGeometry args={[1,24,12]}/><meshStandardMaterial color="#f1ecde"/></mesh></group>)}
 </group>}
