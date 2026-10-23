import {Suspense,useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas,useFrame} from '@react-three/fiber';
import {OrbitControls,useGLTF} from '@react-three/drei';
import {clone} from 'three/examples/jsm/utils/SkeletonUtils.js';
import {AnimationMixer,Mesh} from 'three';
import Court from './scene/Court';
import CourtBefore from './scene/CourtBefore';
import CourtsideBefore, {Bench as BenchBefore} from './scene/CourtsideBefore';
import Courtside, {Bench} from './scene/Courtside';
function Character({before,verse,position=[0,0,0],rotation=0,action}:{before:boolean;verse:boolean;position?:[number,number,number];rotation?:number;action:string}){
 const asset=useGLTF(before?'/models/lulu-rejected.glb':'/models/tennis-sprites.glb?v=cloud-match-2');
 const model=useMemo(()=>clone(asset.scene),[asset]);
 const mixer=useMemo(()=>new AnimationMixer(model),[model]);
 useEffect(()=>{model.traverse(o=>{if(o instanceof Mesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false}});for(const name of ['Humanities','Technology']){const o=model.getObjectByName('Lulu_'+name);if(o)o.visible=name===(verse?'Humanities':'Technology')}},[model,verse]);
 useEffect(()=>{mixer.stopAllAction();const clip=asset.animations.find(c=>c.name===action);if(clip)mixer.clipAction(clip).play();return()=>{mixer.stopAllAction()}},[asset,mixer,action]);
 useFrame((_,dt)=>{if(action!=='Still')mixer.update(Math.min(dt,.04))});
 return <group position={position} rotation={[0,rotation,0]}><primitive object={model}/></group>;
}
function View({before,verse,view,action}:{before:boolean;verse:boolean;view:string;action:string}){
 const court=view==='court'||view==='courtside',closeCourt=view==='courtside',face=['face','back','side'].includes(view),detail=view==='grip'||view==='shoes',bench=view==='bench';
 const target:[number,number,number]=view==='grip'?[.37,.68,.42]:view==='shoes'?[0,.12,.04]:bench?[0,.55,0]:closeCourt?[-1.5,1,9.35]:court?[0,.5,0]:face?[-.12,1.12,0]:[0,1.05,0];
 return <Canvas key={view} onCreated={({camera,size})=>{if(court&&!closeCourt){camera.zoom=size.width/29;camera.updateProjectionMatrix()}}} shadows dpr={[1,2]} orthographic camera={{position:view==='back'?[1,2,-4]:view==='side'?[4,2,0]:view==='grip'?[1,1,3]:view==='shoes'?[1,1,3]:bench?[3,2.4,4]:closeCourt?[3.5,4,17]:court?[14,14,25]:face?[1.1,2.15,4]:[3.5,3.1,6],zoom:detail?600:bench?150:closeCourt?165:court?24:face?420:220,near:.1,far:120}}>
  <color attach="background" args={[court?'#d7e5ed':'#e5e6df']}/><ambientLight intensity={.65}/><hemisphereLight args={['#fff2dc','#8a9da8',1.1]}/>
  <directionalLight position={[-3,8,6]} intensity={2.1} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-17} shadow-camera-right={17} shadow-camera-top={17} shadow-camera-bottom={-17} shadow-normalBias={.025}/>
  <Suspense fallback={null}>{bench?(before?<BenchBefore/>:<Bench/>):court?<>{before?<><CourtBefore night={false}/><CourtsideBefore night={false}/></>:<><Court night={false}/><Courtside night={false}/></>}<Character before={before} verse={verse} position={[-1.5,0,9.35]} action={action}/><Character before={before} verse={!verse} position={[1.5,0,-9.35]} rotation={Math.PI} action={action}/></>:<Character before={before} verse={verse} action={action}/>}</Suspense>
  {!court&&<mesh rotation={[-Math.PI/2,0,0]} position={[0,-.01,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#e5e6df" roughness={.9}/></mesh>}
  <OrbitControls target={target} enablePan enableDamping minZoom={court?8:100} maxZoom={700}/>
 </Canvas>
}
function App(){
 const [verse,setVerse]=useState(true),[view,setView]=useState(new URLSearchParams(location.search).get('view')||'body'),[action,setAction]=useState('Still');
 return <main><header><div><small>LOCAL CHARACTER REVIEW · NOT PUBLISHED</small><h1>Verse & Code · Cloud Match</h1></div><nav><button aria-pressed={verse} onClick={()=>setVerse(true)}>Verse</button><button aria-pressed={!verse} onClick={()=>setVerse(false)}>Code</button><span/><button onClick={()=>setView('body')}>Full figure</button><button onClick={()=>setView('face')}>Face & hair</button><button onClick={()=>setView('back')}>Back</button><button onClick={()=>setView('side')}>Profile</button><button onClick={()=>setView('grip')}>Grip</button><button onClick={()=>setView('shoes')}>Shoes</button><button onClick={()=>setView('court')}>On court</button><button onClick={()=>setView('courtside')}>Courtside close-up</button><button onClick={()=>setView('bench')}>Seats</button><select aria-label="Animation" value={action} onChange={e=>setAction(e.target.value)}>{['Still','Idle','Ready','Run','Shuffle','Swing'].map(a=><option key={a}>{a}</option>)}</select></nav></header><section>{[true,false].map(before=><article key={String(before)}><label>{before?(['court','courtside','bench'].includes(view)?'BEFORE · Earlier local scene':'BEFORE · Rejected candidate'):'AFTER · Tennis sprites'}</label><View before={before} verse={verse} view={view} action={action}/></article>)}</section><footer>Same camera, light and scale · Drag to rotate · Scroll to inspect · <a href="/" target="_blank">Open local court ↗</a></footer></main>
}
const style=document.createElement('style');style.textContent=`*{box-sizing:border-box}body{font:14px system-ui,sans-serif;color:#263d39;background:#f3f1e9}main{height:100vh;display:flex;flex-direction:column}header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 28px}h1{margin:4px 0 0;font:500 28px Georgia,serif}small{font-size:10px;letter-spacing:2px}nav{display:flex;gap:7px;flex-wrap:wrap}button,select{font:inherit;padding:9px 13px;border:1px solid #bbc9c1;border-radius:20px;background:transparent;color:inherit;cursor:pointer}button[aria-pressed=true]{background:#294d43;color:white}nav span{width:10px}section{display:flex;flex:1;min-height:0;gap:2px}article{width:50%;position:relative}article label{position:absolute;top:16px;left:20px;z-index:1;font-size:11px;letter-spacing:1.7px}footer{padding:12px 28px;font-size:12px}a{color:inherit}@media(max-width:700px){header{padding:12px;align-items:flex-start}nav{gap:3px}button,select{font-size:11px;padding:7px}small{font-size:8px}h1{font-size:20px}article label{font-size:8px;left:8px}}`;document.head.append(style);
createRoot(document.getElementById('root')!).render(<App/>);
