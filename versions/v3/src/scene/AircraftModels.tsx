import {RoundedBox} from '@react-three/drei';
import {useMemo,useEffect} from 'react';
import {LatheGeometry,Vector2,Vector3,CatmullRomCurve3,TubeGeometry,Shape,ExtrudeGeometry} from 'three';
export function Balloon({index}:{index:number}){
 const {panels,seams}=useMemo(()=>{
  const curve=new CatmullRomCurve3([[.20,-1.50],[.35,-1.16],[.76,-.66],[1.12,-.05],[1.23,.55],[1.06,1.05],[.65,1.48],[.05,1.66]].map(([x,y])=>new Vector3(x,y,0)));
  const profile=curve.getPoints(48).map(p=>new Vector2(p.x,p.y));
  const panels=Array.from({length:12},(_,i)=>{
   const g=new LatheGeometry(profile,8,i*Math.PI/6,Math.PI/6);
   const pos=g.attributes.position;
   for(let j=0;j<pos.count;j++){
    const x=pos.getX(j),z=pos.getZ(j),angle=Math.atan2(x,z);
    const bulge=1+.035*Math.pow(Math.sin(angle*6),2);
    pos.setX(j,x*bulge);pos.setZ(j,z*bulge);
   }
   g.computeVertexNormals();return g;
  });
  const seams=Array.from({length:12},(_,i)=>{
   const angle=i*Math.PI/6;
   return new TubeGeometry(new CatmullRomCurve3(profile.map(p=>new Vector3(p.x*Math.sin(angle),p.y,p.x*Math.cos(angle)))),48,.009,4,false);
  });
  return {panels,seams};
 },[]);
 useEffect(()=>()=>[...panels,...seams].forEach(p=>p.dispose()),[panels,seams]);
 const color=['#b999b5','#d8b987','#8eb6af','#8da8b6'][index];
 return <group name="Tailored_Balloon">
 {panels.map((g,i)=><mesh key={i} geometry={g} castShadow><meshStandardMaterial color={i%2===0?'#f2e7d0':color} roughness={.9}/></mesh>)}
 {seams.map((g,i)=><mesh key={i} geometry={g}><meshStandardMaterial color="#d7cfb9" roughness={.95}/></mesh>)}
 <mesh position={[0,1.66,0]} scale={[1,.35,1]}><sphereGeometry args={[.075,16,8]}/><meshStandardMaterial color="#d7cfb9"/></mesh>
 <mesh position={[0,-1.44,0]}><cylinderGeometry args={[.23,.19,.21,24]}/><meshStandardMaterial color="#718d99" roughness={.85}/></mesh>
 <mesh position={[0,-1.55,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.19,.025,8,32]}/><meshStandardMaterial color="#b99b72"/></mesh>
 {[-.23,.23].flatMap(x=>[-.20,.20].map(z=><mesh key={`${x}-${z}`} position={[x,-1.79,z]}><cylinderGeometry args={[.014,.014,.66,8]}/><meshStandardMaterial color="#b69a75"/></mesh>))}
 <mesh position={[0,-1.77,0]}><cylinderGeometry args={[.065,.075,.13,12]}/><meshStandardMaterial color="#73695b" metalness={.25} roughness={.6}/></mesh>
 <RoundedBox args={[.64,.40,.56]} radius={.055} smoothness={5} position={[0,-2.15,0]} castShadow><meshStandardMaterial color="#a98d69" roughness={.96}/></RoundedBox>
 {[-2.30,-2.23,-2.16,-2.09,-2.02].map(y=><RoundedBox key={y} args={[.66,.022,.58]} radius={.01} position={[0,y,0]}><meshStandardMaterial color="#c5a67c" roughness={.95}/></RoundedBox>)}
 {[-.24,-.12,0,.12,.24].map(x=><group key={x}>{[-.292,.292].map(z=><mesh key={z} position={[x,-2.15,z]}><boxGeometry args={[.012,.36,.008]}/><meshStandardMaterial color="#dcc099" roughness={.95}/></mesh>)}</group>)}
 <RoundedBox args={[.69,.065,.61]} radius={.025} position={[0,-1.94,0]}><meshStandardMaterial color="#dfc29b" roughness={.9}/></RoundedBox>
 <RoundedBox args={[.55,.014,.46]} radius={.02} position={[0,-1.902,0]}><meshStandardMaterial color="#6b604d" roughness={1}/></RoundedBox>
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
