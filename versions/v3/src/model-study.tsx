import {createRoot} from 'react-dom/client';
import {Canvas} from '@react-three/fiber';
import {Bench,Parasol} from './scene/Courtside';
import {Net} from './scene/Court';
const net=new URLSearchParams(location.search).has('net');
createRoot(document.getElementById('root')!).render(<div style={{height:'100vh',background:'#e8e8de'}}><Canvas shadows dpr={[1,2]} orthographic camera={{position:net?[8,4,8]:[5,4.2,6],zoom:net?85:120,near:.1,far:100}}><color attach="background" args={['#e8e8de']}/><ambientLight intensity={.8}/><hemisphereLight args={['#fff5df','#8c9eab',1]}/><directionalLight castShadow position={[-3,8,5]} intensity={2.2} shadow-mapSize={[2048,2048]}/><group position={[0,net?0:-1.25,0]}>{net?<Net/>:<><Bench/><group position={[.1,0,-.7]}><Parasol/></group></>}</group><mesh rotation={[-Math.PI/2,0,0]} position={[0,net?-.05:-1.3,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#e8e8de" roughness={.9}/></mesh></Canvas></div>);
