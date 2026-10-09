import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { useEffect, useRef, type RefObject } from 'react';
import Court from './Court';
import Player from './Player';
import Clouds from './Clouds';
import Courtside from './Courtside';
import Atmosphere from './Atmosphere';
import CameraRig from './CameraRig';
import Rally from './Rally';
import VisitorControls from './VisitorControls';
import { inBounds, type VisitorInput, type RallyResult } from '../state/gameplay';
import type { ViewAction } from './CameraRig';
import { type RallyState, type Side } from '../state/rally';
import { Vector3 } from 'three';
import SkyVisitors, { type ScreenAnchor } from './SkyVisitors';
import type { Score } from '../state/score';
import ShotInput from './ShotInput';
import Wayfinding from './Wayfinding';
import type { Destination } from '../components/Directory';


import type { FlightPath } from './trajectories';
export type { ViewAction } from './CameraRig';
type Props={started:boolean;input:RefObject<VisitorInput>;night:boolean;score:Score;onAnchor:(a:ScreenAnchor)=>void;onNavigate:(destination:Destination,a?:ScreenAnchor)=>void;onReset:()=>void;onExit:()=>void;power:number;target:[number,number];onCourtHit:(point:[number,number],power?:number)=>void;onBrowse:()=>void;path:FlightPath;action:ViewAction;state:RallyState;reduced:boolean;onReady:()=>void;onContextLost:()=>void;onArrived:()=>void;onBall:()=>void;onFinished:(r:RallyResult)=>void;onSwitch:()=>void;onSelect:(side:Side)=>void};
function ContextWatch({onLost}:{onLost:()=>void}){
 const {gl}=useThree();useEffect(()=>{const canvas=gl.domElement;const lost=(event:Event)=>{event.preventDefault();onLost()};canvas.addEventListener('webglcontextlost',lost);return ()=>canvas.removeEventListener('webglcontextlost',lost)},[gl,onLost]);return null;
}
function LandingAnchor({clock,target,shot,onAnchor}:{clock:React.RefObject<{progress:number}>;target:[number,number];shot:number;onAnchor:(a:ScreenAnchor)=>void}){
 const last=useRef(-1);const {camera,size}=useThree();
 useFrame(()=>{if(clock.current.progress>=.48&&last.current!==shot){last.current=shot;const p=new Vector3(target[0],.15,target[1]).project(camera);onAnchor({x:(p.x+1)*size.width/2,y:(1-p.y)*size.height/2})}});return null;
}
function Scene({started,input,night,score,onContextLost,onAnchor,onNavigate,onReset,power,target,onCourtHit,action,state,reduced,onReady,onArrived,onBall,onFinished,onSwitch}:Props){
 const clock=useRef({progress:0});
 useEffect(()=>{onReady()},[onReady]);
 return <>
  <ContextWatch onLost={onContextLost}/>
  <ambientLight intensity={night?.42:.55}/><hemisphereLight args={[night?'#aac6ed':'#f0faff',night?'#34334b':'#c9c2de',night?.65:.8]}/>
  <directionalLight position={[-12,25,8]} intensity={night?1.15:2.1} color={night?'#bcd4ff':'#fff4dc'} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-normalBias={.035} shadow-bias={-.0002} shadow-radius={4}/>
  <Atmosphere night={night}/><SkyVisitors visible={started&&state.phase==='overview'} night={night} reduced={reduced} onNavigate={onNavigate}/><Court/>{started&&<Courtside/>}<Clouds/>
  {started&&<Wayfinding score={score} state={state} onPlay={onBall} onSwitch={onSwitch} onReset={onReset}/>}
  <VisitorControls input={input} roaming={state.phase==='overview'} active={started&&['overview','ready','playing'].includes(state.phase)}/>
  <LandingAnchor clock={clock} target={target} shot={state.shot} onAnchor={onAnchor}/>
  {started&&<group name="Fixed_Court_Interaction">
   {started&&(state.phase==='overview'||state.phase==='ready')&&<ShotInput side={state.side} overview={state.phase==='overview'} onHit={onCourtHit}/> }

   {(['technology','humanities'] as const).map(identity=><Player input={input} key={identity} side={identity} visitor={identity!==state.side} switching={state.phase==='switching'}  power={power} target={target} playing={state.phase==='playing'&&identity===state.side&&inBounds(target)} clock={clock} reduced={reduced} onSwitch={onSwitch}/>)}
   <Rally input={input} onAnchor={onAnchor} power={power} target={target} phase={state.phase==='switching'?state.returnTo:state.phase} shot={state.shot} reduced={reduced} clock={clock} onBall={onBall} onFinished={onFinished}/>
  </group>}
  <ContactShadows position={[0,-4.9,0]} opacity={.12} scale={40} blur={3.5} far={8} resolution={256} frames={1} color="#738b9b"/>
  <CameraRig input={input} state={state} action={action} reduced={reduced} onArrived={onArrived}/>
 </>;
}
export default function World(props:Props){
 const initialPosition=useRef<[number,number,number]>([23,25,30]);
 return <Canvas orthographic shadows dpr={[1,2]} frameloop="demand" camera={{position:initialPosition.current,zoom:22,near:.1,far:180}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}} fallback={<div className="scene-error" role="alert"><p>This device cannot display the 3D court.</p><button onClick={props.onBrowse}>Explore the collection</button></div>}><Scene {...props}/></Canvas>;
}
