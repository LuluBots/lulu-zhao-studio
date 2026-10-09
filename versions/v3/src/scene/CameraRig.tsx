import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as Controls } from 'three-stdlib';
import { MOUSE, TOUCH, OrthographicCamera, PerspectiveCamera, Vector3, Quaternion } from 'three';
import type { VisitorInput } from '../state/gameplay';
import { cameraLimits, keepCameraSafe } from './cameraBounds';
import { type RallyState } from '../state/rally';
export type ViewAction = { kind: 'reset'; id: number };
type Tween = { elapsed:number; camera:OrthographicCamera|PerspectiveCamera; from:Vector3; to:Vector3; rotation:Quaternion; targetRotation:Quaternion; look:Vector3 };
export default function CameraRig({input,state,action,reduced,onArrived}:{input:RefObject<VisitorInput>;state:RallyState;action:ViewAction;reduced:boolean;onArrived:()=>void}) {
  const {camera,set,size,invalidate} = useThree();
  const {phase,side,returnTo}=state;
  const overview = useRef(camera as OrthographicCamera);
  const controls = useRef<Controls>(null),rallyControls=useRef<Controls>(null);
  const rallyTarget=useMemo(()=>new Vector3(0,1.1,-3.5),[]);
  const perspective = useMemo(()=>new PerspectiveCamera(52,1,.05,180),[]);
  const saved = useRef({position:new Vector3(23,25,30),target:new Vector3(),zoom:22});
  const transition = useRef<Tween|null>(null);
  const zoom = Math.min(size.width/34,size.height/29);
  useEffect(()=>{
    perspective.aspect=size.width/size.height; perspective.fov=size.width<size.height?80:52; perspective.updateProjectionMatrix();
    overview.current.zoom=zoom; overview.current.updateProjectionMatrix(); saved.current.zoom=zoom; invalidate();
  },[size,zoom,perspective,invalidate]);
  useEffect(()=>{
    if(!['entering','leaving','switching'].includes(phase))return;
    const ortho=overview.current;
    if(phase==='switching'){transition.current=null;const timer=window.setTimeout(onArrived,reduced?0:1800);return ()=>window.clearTimeout(timer);}
    if(phase==='entering'){
      saved.current={position:ortho.position.clone(),target:saved.current.target.clone(),zoom:ortho.zoom};
      perspective.position.copy(ortho.position); perspective.quaternion.copy(ortho.quaternion);set({camera:perspective});
    }
    const target=phase==='entering'?new Vector3(0,6.5,13.5):saved.current.position;
    const look=phase==='entering'?rallyTarget.clone():saved.current.target;
    const destination=perspective.clone();destination.position.copy(target);destination.lookAt(look);
    transition.current={elapsed:0,camera:perspective,from:perspective.position.clone(),to:target.clone(),rotation:perspective.quaternion.clone(),targetRotation:destination.quaternion.clone(),look};invalidate();
  },[phase,side,returnTo,perspective,set,invalidate]);
  useFrame((_,delta)=>{
    const tween=transition.current;if(!tween)return;
    tween.elapsed+=Math.min(delta,.05);
    const t=reduced?1:Math.min(tween.elapsed/.72,1),ease=t*t*(3-2*t);
    tween.camera.position.lerpVectors(tween.from,tween.to,ease);tween.camera.quaternion.slerpQuaternions(tween.rotation,tween.targetRotation,ease);
    if(t===1){transition.current=null;if(phase==='leaving'){
      overview.current.position.copy(saved.current.position);overview.current.zoom=saved.current.zoom;overview.current.updateProjectionMatrix();overview.current.lookAt(saved.current.target);set({camera:overview.current});
    }onArrived();}invalidate();
  });
  useEffect(()=>{if(phase!=='overview'||!controls.current)return;controls.current.target.copy(saved.current.target);controls.current.update()},[phase]);
  useEffect(()=>{
    if(phase!=='overview')return;const c=overview.current,ctrl=controls.current;if(!ctrl)return;
    ctrl.enableDamping=false;ctrl.update();c.position.set(23,25,30);ctrl.target.set(0,0,0);c.zoom=zoom;ctrl.update();ctrl.enableDamping=true;
    c.updateProjectionMatrix();ctrl.update();invalidate();
  },[action,zoom,invalidate]);
  return phase==='overview'?<OrbitControls ref={controls} camera={overview.current} target={saved.current.target} zoomToCursor screenSpacePanning makeDefault onChange={()=>{if(controls.current){keepCameraSafe(overview.current,controls.current.target,true);saved.current.target.copy(controls.current.target)}}} enableDamping dampingFactor={.09} minPolarAngle={.2} maxPolarAngle={Math.PI/2.25} minZoom={zoom*cameraLimits.minZoomFactor} maxZoom={Math.max(180,zoom*cameraLimits.maxZoomFactor)} mouseButtons={{LEFT:MOUSE.ROTATE,MIDDLE:MOUSE.DOLLY,RIGHT:MOUSE.PAN}} touches={{ONE:TOUCH.ROTATE,TWO:TOUCH.DOLLY_PAN}}/>:(phase==='ready'||phase==='playing')?<OrbitControls key="rally-pointer-controls" ref={rallyControls} camera={perspective} target={rallyTarget} makeDefault zoomToCursor screenSpacePanning enableDamping dampingFactor={.12} minDistance={cameraLimits.minDistance} maxDistance={cameraLimits.maxDistance} minPolarAngle={.45} maxPolarAngle={1.3} mouseButtons={{LEFT:MOUSE.ROTATE,MIDDLE:MOUSE.PAN,RIGHT:MOUSE.ROTATE}} touches={{ONE:TOUCH.ROTATE,TWO:TOUCH.DOLLY_PAN}} onChange={()=>{if(rallyControls.current)keepCameraSafe(perspective,rallyControls.current.target,false);const direction=perspective.getWorldDirection(new Vector3());input.current.yaw=Math.max(-.5,Math.min(.5,Math.atan2(direction.x,-direction.z)));input.current.pitch=Math.max(-.2,Math.min(.2,direction.y));}}/>:null;
}
