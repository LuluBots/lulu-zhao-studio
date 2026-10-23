import { Environment, Lightformer } from '@react-three/drei';
// Local studio environment: broad reflection shapes give metal and hair a readable silhouette.
export default function ArtLighting({night}:{night:boolean}){
 return <><Environment resolution={128} frames={1} environmentIntensity={night?.25:.45}>
  <Lightformer form="rect" intensity={2} color={night?'#a6c8ef':'#fff0d8'} scale={[14,8,1]} position={[-10,16,6]} rotation={[-Math.PI/3,-.4,0]}/>
  <Lightformer form="rect" intensity={1} color="#b4d6ee" scale={[8,12,1]} position={[12,8,-7]} rotation={[0,Math.PI/2,0]}/>
 </Environment><directionalLight position={[10,8,-12]} intensity={night?.4:.65} color="#b7d7f0"/></>;
}
