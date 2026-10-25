import { Vector3, type Camera } from 'three';
// Reserve screen space around both physical scoreboards for every orbit angle.
export function obscuresScoreboard(camera:Camera,center:Vector3,radius:number){
 const point=center.clone().project(camera);if(point.z>1||point.z< -1)return false;
 const right=new Vector3(1,0,0).applyQuaternion(camera.quaternion);
 const r=center.clone().addScaledVector(right,radius).project(camera).distanceTo(point);
 return [-1,1].some(end=>{const location=new Vector3(end*4.1,1.4,end*10.52),screen=location.clone().project(camera);if(screen.z>1||screen.z< -1)return false;const padding=location.addScaledVector(right,2.2).project(camera).distanceTo(screen);return Math.hypot(point.x-screen.x,point.y-screen.y)<r+padding});
}

// Screen-space exclusion for the playing surface, including during camera orbit.
export function obscuresCourt(camera:Camera,center:Vector3,radius:number){
 const point=center.clone().project(camera);
 if(point.z>1||point.z< -1)return false;
 const right=new Vector3(1,0,0).applyQuaternion(camera.quaternion);
 const r=center.clone().addScaledVector(right,radius).project(camera).distanceTo(point);
 const corners=[[-6.2,-11.85],[6.2,-11.85],[6.2,11.85],[-6.2,11.85]].map(([x,z])=>new Vector3(x,.2,z).project(camera));
 let inside=false;
 for(let i=0,j=3;i<4;j=i++){
  const a=corners[i],b=corners[j];
  if((a.y>point.y)!==(b.y>point.y)&&point.x<(b.x-a.x)*(point.y-a.y)/(b.y-a.y)+a.x)inside=!inside;
  const dx=b.x-a.x,dy=b.y-a.y,denom=dx*dx+dy*dy;
  const t=denom?Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/denom)):0;
  if(Math.hypot(point.x-a.x-t*dx,point.y-a.y-t*dy)<r)return true;
 }
 return inside;
}
