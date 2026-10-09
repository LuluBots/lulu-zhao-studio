import { Vector3, type Camera } from 'three';
export const cameraLimits={minDistance:5,maxDistance:32,minZoomFactor:.7,maxZoomFactor:6,minHeight:4.2};
// Keep the orbit target on the court and the eye above courtside geometry.
// The same guard runs after wheel, pinch, rotation and pan changes.
export function keepCameraSafe(camera:Camera,target:Vector3,overview:boolean){
 const edgeX=overview?8.5:5.7,edgeZ=overview?13:10.2;
 const bounded=new Vector3(Math.max(-edgeX,Math.min(edgeX,target.x)),Math.max(0,Math.min(1.5,target.y)),Math.max(-edgeZ,Math.min(edgeZ,target.z)));
 camera.position.add(bounded.clone().sub(target));target.copy(bounded);
 if(!overview){
  const offset=camera.position.clone().sub(target),distance=offset.length();
  if(distance<cameraLimits.minDistance||distance>cameraLimits.maxDistance){offset.setLength(Math.max(cameraLimits.minDistance,Math.min(cameraLimits.maxDistance,distance||1)));camera.position.copy(target).add(offset)}
  camera.position.y=Math.max(cameraLimits.minHeight,camera.position.y);
 }else camera.position.y=Math.max(8,camera.position.y);
 camera.lookAt(target);camera.updateMatrixWorld();
}
