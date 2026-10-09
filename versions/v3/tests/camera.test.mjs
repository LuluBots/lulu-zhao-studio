import test from 'node:test';
import assert from 'node:assert/strict';
import {OrthographicCamera,PerspectiveCamera,Vector3,Raycaster,Plane} from 'three';
import {OrbitControls} from 'three-stdlib';
for(const type of ['orthographic','perspective'])test(`${type} wheel zoom preserves the court point under an off-center cursor`,()=>{
 const handlers=new Map(),dom={style:{},clientWidth:1000,clientHeight:800,getBoundingClientRect:()=>({left:0,top:0,width:1000,height:800}),addEventListener:(n,f)=>handlers.set(n,f),removeEventListener:()=>{},ownerDocument:{removeEventListener:()=>{}}};
 const camera=type==='orthographic'?new OrthographicCamera(-20,20,16,-16,.05,180):new PerspectiveCamera(52,1.25,.05,180);
 camera.position.set(23,25,30);camera.lookAt(0,0,0);camera.updateMatrixWorld();const controls=new OrbitControls(camera,dom);controls.zoomToCursor=true;controls.screenSpacePanning=true;
 const cursor={x:.4,y:-.25},ray=new Raycaster();ray.setFromCamera(cursor,camera);const hit=ray.ray.intersectPlane(new Plane(new Vector3(0,1,0),0),new Vector3());assert.ok(hit);const before=hit.clone().project(camera);const distance=camera.position.distanceTo(hit);
 handlers.get('wheel')({clientX:700,clientY:500,deltaY:-100,preventDefault(){}});camera.updateMatrixWorld();const after=hit.clone().project(camera);
 assert.ok(Math.abs(before.x-after.x)<1e-6);assert.ok(Math.abs(before.y-after.y)<1e-6);assert.ok(type==='orthographic'?camera.zoom>1:camera.position.distanceTo(hit)<distance);assert.equal(handlers.has('keydown'),false);controls.dispose();
});

const {cameraLimits,keepCameraSafe}=await import('../src/scene/cameraBounds.ts');
for(const orthographic of [true,false])test(`${orthographic?'overview':'rally'} bounded wheel and trackpad pinch cannot escape safe zoom or height`,()=>{
 const handlers=new Map(),dom={style:{},clientWidth:1000,clientHeight:800,getBoundingClientRect:()=>({left:0,top:0,width:1000,height:800}),addEventListener:(n,f)=>handlers.set(n,f),removeEventListener:()=>{},ownerDocument:{removeEventListener:()=>{}}};
 const camera=orthographic?new OrthographicCamera(-20,20,16,-16,.1,180):new PerspectiveCamera(52,1.25,.05,180);camera.position.set(0,4.5,10.5);camera.lookAt(0,0,0);camera.updateMatrixWorld();
 const controls=new OrbitControls(camera,dom);controls.zoomToCursor=true;controls.screenSpacePanning=true;controls.minZoom=cameraLimits.minZoomFactor;controls.maxZoom=cameraLimits.maxZoomFactor;controls.minDistance=cameraLimits.minDistance;controls.maxDistance=cameraLimits.maxDistance;
 for(const ctrlKey of [false,true])for(const deltaY of [-1000,1000])for(let i=0;i<150;i++){
 handlers.get('wheel')({clientX:790,clientY:230,deltaY,ctrlKey,preventDefault(){}});keepCameraSafe(camera,controls.target,orthographic);controls.update();
 assert.ok(camera.position.y>=(orthographic?8:cameraLimits.minHeight)-1e-6);assert.ok(Math.abs(controls.target.x)<=(orthographic?8.5:5.7));assert.ok(Math.abs(controls.target.z)<=(orthographic?13:10.2));
 if(orthographic){assert.ok(camera.zoom>=controls.minZoom);assert.ok(camera.zoom<=controls.maxZoom)}else {const d=camera.position.distanceTo(controls.target);assert.ok(d>=cameraLimits.minDistance-1e-6);assert.ok(d<=cameraLimits.maxDistance+1e-6)}
 }controls.dispose();
});
