import { Object3D, Quaternion, Vector3 } from 'three';
// Distance-driven stance: planted shoes travel backwards relative to the pelvis;
// the recovering foot crosses forward, clears the surface, and plants heel first.
export function stepTarget(phase:number,side:number,direction:Vector3){
 const t=((phase+(side===1?.5:0))%1+1)%1;
 const stance=t<.60, u=stance?t/.60:(t-.60)/.40;
 const travel=stance?.32-.64*u:-.32+.64*(u*u*(3-2*u));
 return new Vector3(side*.16+direction.x*travel,.17+(stance?0:.17*Math.sin(Math.PI*u)),direction.z*travel+(stance?0:.10*Math.sin(Math.PI*u)));
}
function aim(bone:Object3D,child:Object3D,target:Vector3){
 const origin=bone.getWorldPosition(new Vector3());
 const before=child.getWorldPosition(new Vector3()).sub(origin).normalize();
 const after=target.clone().sub(origin).normalize();
 const world=new Quaternion().setFromUnitVectors(before,after).multiply(bone.getWorldQuaternion(new Quaternion()));
 bone.quaternion.copy(bone.parent!.getWorldQuaternion(new Quaternion()).invert().multiply(world));
 bone.updateWorldMatrix(false,true);
}
export function applyTennisSteps(model:Object3D,root:Object3D,phase:number,direction:Vector3){
 const pelvis=model.getObjectByName('Root');if(pelvis)pelvis.position.y-=.07;
 root.updateWorldMatrix(true,true);
 const localDirection=direction.clone().applyQuaternion(root.quaternion.clone().invert());
 for(const [name,side] of [['L',-1],['R',1]] as const){
  const thigh=model.getObjectByName('Thigh'+name),shin=model.getObjectByName('Shin'+name),foot=model.getObjectByName('Foot'+name);
  if(!thigh||!shin||!foot)continue;
  const flat=root.getWorldQuaternion(new Quaternion()).multiply(foot.userData.flatQuaternion??new Quaternion());
  const hip=thigh.getWorldPosition(new Vector3()),knee=shin.getWorldPosition(new Vector3()),ankle=foot.getWorldPosition(new Vector3());
  const a=hip.distanceTo(knee),b=knee.distanceTo(ankle);
  const target=root.localToWorld(stepTarget(phase,side,localDirection));
  const axis=target.clone().sub(hip),distance=Math.min(axis.length(),a+b-.004);axis.normalize();target.copy(hip).addScaledVector(axis,distance);
  const pole=new Vector3(0,0,1).applyQuaternion(root.getWorldQuaternion(new Quaternion()));pole.addScaledVector(axis,-pole.dot(axis)).normalize();
  const along=(a*a-b*b+distance*distance)/(2*distance);
  const bend=hip.clone().addScaledVector(axis,along).addScaledVector(pole,Math.sqrt(Math.max(0,a*a-along*along)));
  aim(thigh,shin,bend);aim(shin,foot,target);
  // Counter-rotate the ankle: the planted sole does not inherit the knee's tilt.
  foot.quaternion.copy(foot.parent!.getWorldQuaternion(new Quaternion()).invert().multiply(flat));
  foot.updateWorldMatrix(false,true);
 }
}
