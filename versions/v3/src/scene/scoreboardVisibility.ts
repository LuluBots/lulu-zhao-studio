import { Vector3, type Camera } from 'three';
// Reserve screen space around both physical scoreboards for every orbit angle.
export function obscuresScoreboard(camera:Camera,center:Vector3,radius:number){
 const point=center.clone().project(camera);if(point.z>1||point.z< -1)return false;
 const right=new Vector3(1,0,0).applyQuaternion(camera.quaternion);
 const r=center.clone().addScaledVector(right,radius).project(camera).distanceTo(point);
 return [-1,1].some(end=>{const location=new Vector3(end*6.5,1.4,end*11.4),screen=location.clone().project(camera);if(screen.z>1||screen.z< -1)return false;const padding=location.addScaledVector(right,2.2).project(camera).distanceTo(screen);return Math.hypot(point.x-screen.x,point.y-screen.y)<r+padding});
}
