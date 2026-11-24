import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as Controls } from 'three-stdlib';
import { MOUSE, TOUCH, OrthographicCamera, Vector3, Quaternion } from 'three';
import type { VisitorInput } from '../state/gameplay';
import { createMatchCamera, frameMatchCamera, viewDuration } from './matchCamera';
import { cameraLimits, keepCameraSafe } from './cameraBounds';
import { type RallyState } from '../state/rally';
export type ViewAction = { kind: 'reset'; id: number };
type Tween = { elapsed:number; camera:OrthographicCamera; from:Vector3; to:Vector3; rotation:Quaternion; targetRotation:Quaternion; look:Vector3;fromZoom:number;toZoom:number };
export default function CameraRig({started,input,state,action,reduced,onArrived}:{started:boolean;input:RefObject<VisitorInput>;state:RallyState;action:ViewAction;reduced:boolean;onArrived:()=>void}) {
  const {camera,set,size,invalidate} = useThree();
  const {phase,side,returnTo}=state;
  const overview = useRef(camera as OrthographicCamera);
  const controls = useRef<Controls>(null),rallyControls=useRef<Controls>(null);
  const rallyTarget=useMemo(()=>new Vector3(0,.8,1),[]);
  const rallyCamera = useMemo(()=>createMatchCamera(),[]);
  const saved = useRef({position:new Vector3(23,25,30),target:new Vector3(),zoom:22});
  const transition = useRef<Tween|null>(null);
  const intro = useRef<{elapsed:number;firstFrame:boolean;angle:number;radius:number;height:number;zoom:number}|null>(null);
  const entered = useRef(false);
  const zoom = Math.min(size.width/48,size.height/39);

  useEffect(()=>{
    frameMatchCamera(rallyCamera,size.width,size.height);
    overview.current.zoom=zoom*1.05; overview.current.updateProjectionMatrix(); saved.current.zoom=zoom; invalidate();
  },[size,zoom,rallyCamera,invalidate]);
  useEffect(()=>{
    if(!['entering','leaving','switching'].includes(phase))return;
    const ortho=overview.current;
    if(phase==='switching'){transition.current=null;const timer=window.setTimeout(onArrived,reduced?0:viewDuration.switching*1000);return ()=>window.clearTimeout(timer);}
    if(phase==='entering'){
      saved.current={position:ortho.position.clone(),target:saved.current.target.clone(),zoom:ortho.zoom};
      rallyCamera.zoom=ortho.zoom;rallyCamera.updateProjectionMatrix();rallyCamera.position.copy(ortho.position); rallyCamera.quaternion.copy(ortho.quaternion);set({camera:rallyCamera});
    }
    const target=phase==='entering'?new Vector3(0,13,22):saved.current.position;
    const look=phase==='entering'?rallyTarget.clone():saved.current.target;
    const destination=rallyCamera.clone();destination.position.copy(target);destination.lookAt(look);
    transition.current={elapsed:0,camera:rallyCamera,from:rallyCamera.position.clone(),to:target.clone(),rotation:rallyCamera.quaternion.clone(),targetRotation:destination.quaternion.clone(),look,fromZoom:rallyCamera.zoom,toZoom:phase==='entering'?Math.min(size.width/28,size.height/27):saved.current.zoom};invalidate();
  },[phase,side,returnTo,rallyCamera,set,invalidate]);
  useEffect(()=>{
    if(!started || entered.current || phase!=='overview') return;
    entered.current=true;

    const c=overview.current;
    intro.current={elapsed:0,firstFrame:true,angle:Math.atan2(c.position.x,c.position.z),
      radius:Math.hypot(c.position.x,c.position.z),height:c.position.y,zoom:c.zoom};
    invalidate();
  },[started,reduced,phase,invalidate]);
  useFrame((_,delta)=>{

    const shot=intro.current;
    if(shot && phase==='overview'){
      // Demand rendering may have been idle for several seconds before the click.
      if(shot.firstFrame) shot.firstFrame=false;
      else shot.elapsed+=delta;
      const t=reduced?1:Math.min(1,shot.elapsed/.9), ease=t*t*(3-2*t);
      const angle=shot.angle*(1-ease), lift=Math.sin(Math.PI*ease);
      const c=overview.current;
      c.position.set(shot.radius*Math.sin(angle),shot.height+(34-shot.height)*ease+3*lift,shot.radius*Math.cos(angle));
      c.zoom=shot.zoom*(1+.12*ease-.07*lift);
      c.updateProjectionMatrix();
      controls.current?.update();
      if(t===1)intro.current=null;
      invalidate();
    }else if(shot){intro.current=null}
    const tween=transition.current;if(!tween)return;
    tween.elapsed+=delta;
    const t=reduced?1:Math.min(tween.elapsed/(phase==='entering'?viewDuration.entering:viewDuration.leaving),1),ease=t*t*(3-2*t);
    tween.camera.zoom=tween.fromZoom+(tween.toZoom-tween.fromZoom)*ease;tween.camera.updateProjectionMatrix();
    tween.camera.position.lerpVectors(tween.from,tween.to,ease);tween.camera.quaternion.slerpQuaternions(tween.rotation,tween.targetRotation,ease);
    if(t===1){transition.current=null;if(phase==='leaving'){
      overview.current.position.copy(saved.current.position);overview.current.zoom=saved.current.zoom;overview.current.updateProjectionMatrix();overview.current.lookAt(saved.current.target);set({camera:overview.current});
    }onArrived();}invalidate();
  });
  useEffect(()=>{if(phase!=='overview'||!controls.current)return;controls.current.target.copy(saved.current.target);controls.current.update()},[phase]);
  useEffect(()=>{
    if(phase!=='overview')return;intro.current=null;const c=overview.current,ctrl=controls.current;if(!ctrl)return;
    ctrl.enableDamping=false;ctrl.update();if(entered.current)c.position.set(0,34,38);else c.position.set(23,25,30);ctrl.target.set(0,0,0);c.zoom=zoom*1.05;ctrl.update();ctrl.enableDamping=true;
    c.updateProjectionMatrix();ctrl.update();invalidate();
  },[action,zoom,invalidate]);
  return phase==='overview'?<OrbitControls ref={controls} onStart={()=>{intro.current=null}} enabled={started} camera={overview.current} target={saved.current.target} zoomToCursor screenSpacePanning makeDefault onChange={()=>{if(controls.current){keepCameraSafe(overview.current,controls.current.target,true);saved.current.target.copy(controls.current.target)}}} enableDamping dampingFactor={.09} minPolarAngle={.2} maxPolarAngle={Math.PI/2.25} minZoom={zoom*.4} maxZoom={Math.max(180,zoom*cameraLimits.maxZoomFactor)} mouseButtons={{LEFT:MOUSE.ROTATE,MIDDLE:MOUSE.DOLLY,RIGHT:MOUSE.PAN}} touches={{ONE:TOUCH.ROTATE,TWO:TOUCH.DOLLY_PAN}}/>:(phase==='ready'||phase==='playing')?<OrbitControls key="rally-pointer-controls" ref={rallyControls} camera={rallyCamera} target={rallyTarget} makeDefault zoomToCursor screenSpacePanning enableDamping dampingFactor={.12} minZoom={zoom*.4} maxZoom={Math.max(180,zoom*cameraLimits.maxZoomFactor)} minPolarAngle={.45} maxPolarAngle={1.3} mouseButtons={{LEFT:MOUSE.ROTATE,MIDDLE:MOUSE.PAN,RIGHT:MOUSE.ROTATE}} touches={{ONE:TOUCH.ROTATE,TWO:TOUCH.DOLLY_PAN}} onChange={()=>{if(rallyControls.current)keepCameraSafe(rallyCamera,rallyControls.current.target,false);const direction=rallyCamera.getWorldDirection(new Vector3());input.current.yaw=Math.max(-.5,Math.min(.5,Math.atan2(direction.x,-direction.z)));input.current.pitch=Math.max(-.2,Math.min(.2,direction.y));}}/>:null;
}
