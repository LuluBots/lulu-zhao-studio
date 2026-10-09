import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { AnimationMixer, Box3, Vector3, SkinnedMesh } from 'three';
const data=await readFile(new URL('../public/models/lulu.glb',import.meta.url));
const gltf=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');
test('Blender asset provides shared body, both outfits, skin and five clips within size budget',()=>{
 assert.ok(data.byteLength<3*1024*1024);
 assert.deepEqual(gltf.animations.map(c=>c.name).sort(),['Idle','Ready','Run','Shuffle','Swing']);
 for(const name of ['Lulu_Body','Lulu_Humanities','Lulu_Technology'])assert.ok(gltf.scene.getObjectByName(name));
 let skinned=0;gltf.scene.traverse(o=>{if(o instanceof SkinnedMesh){skinned++;assert.ok(o.skeleton.bones.length>=11)}});assert.ok(skinned>=3);
 gltf.scene.updateMatrixWorld(true);const size=new Box3().setFromObject(gltf.scene).getSize(new Vector3());assert.ok(size.y>1.9&&size.y<2.2);assert.ok(size.x<1.6);
});
test('exported Run and Swing deform independent cloned skeletons without invalid poses',()=>{
 const first=clone(gltf.scene),second=clone(gltf.scene),mixer=new AnimationMixer(first);
 const reference=second.getObjectByName('ThighL')??second.getObjectByName('Thigh.L');
 assert.ok(reference);const original=reference.quaternion.toArray();
 for(const clip of gltf.animations){
  mixer.stopAllAction();const action=mixer.clipAction(clip);action.play();action.paused=true;
  for(const t of [0,.25,.5,.75,.999]){
   action.time=clip.duration*t;mixer.update(0);first.updateMatrixWorld(true);
   first.traverse(o=>{assert.ok(o.matrixWorld.elements.every(Number.isFinite))});
  }
 }
 assert.deepEqual(reference.quaternion.toArray(),original);
 mixer.stopAllAction();const run=mixer.clipAction(gltf.animations.find(c=>c.name==='Run'));run.play();run.paused=true;run.time=.25;mixer.update(0);
 const animated=first.getObjectByName(reference.name);assert.notDeepEqual(animated.quaternion.toArray(),reference.quaternion.toArray());
});

test('refined rig has independent wrists and ankles; swing contact matches the ball attachment',()=>{
 const model=clone(gltf.scene),mixer=new AnimationMixer(model);
 const contact=model.getObjectByName('Racket_Contact');assert.ok(contact);
 for(const name of ['HandR','HandL','FootR','FootL'])assert.ok(model.getObjectByName(name));
 const clip=gltf.animations.find(c=>c.name==='Swing'),action=mixer.clipAction(clip);action.play();action.paused=true;action.time=clip.duration*.5;mixer.update(0);model.updateMatrixWorld(true);
 const point=contact.getWorldPosition(new Vector3());assert.ok(point.distanceTo(new Vector3(.75,1.18,.47))<.002);
 const before=point.clone();action.time=clip.duration*.25;mixer.update(0);model.updateMatrixWorld(true);
 assert.ok(contact.getWorldPosition(new Vector3()).distanceTo(before)>.05);
});

test('cross-step IK produces finite poses and planted ankle height on the exported rig',async()=>{
 const {applyTennisSteps}=await import('../src/scene/tennisSteps.ts');
 const {Group,Quaternion}=await import('three');
 for(const phase of [.05,.25,.55,.8]){
  const model=clone(gltf.scene),root=new Group();root.add(model);root.updateMatrixWorld(true);
  for(const name of ['FootL','FootR']){const foot=model.getObjectByName(name);foot.userData.flatQuaternion=foot.getWorldQuaternion(new Quaternion())}
  applyTennisSteps(model,root,phase,new Vector3(1,0,0));
  model.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite)));
  const left=model.getObjectByName('FootL').getWorldPosition(new Vector3());
  if(phase<.6)assert.ok(Math.abs(left.y-.17)<.015,`planted ankle ${left.y}`);
  else assert.ok(left.y>.25);
 }
});

test('visitor racket remains attached to the animated hand while the complete player translates',()=>{
 const model=clone(gltf.scene),mixer=new AnimationMixer(model),contact=model.getObjectByName('Racket_Contact');
 model.rotation.y=Math.PI;
 for(const name of ['Ready','Run','Shuffle','Swing']){
  mixer.stopAllAction();const action=mixer.clipAction(gltf.animations.find(c=>c.name===name));action.play();action.paused=true;action.time=action.getClip().duration*.5;mixer.update(0);
  model.position.set(0,0,0);model.updateMatrixWorld(true);const before=contact.getWorldPosition(new Vector3());
  model.position.set(-2,0,3);model.updateMatrixWorld(true);const after=contact.getWorldPosition(new Vector3());assert.ok(after.clone().sub(before).distanceTo(new Vector3(-2,0,3))<1e-6);
  assert.ok(after.distanceTo(model.getObjectByName('HandR').getWorldPosition(new Vector3()))<1.2);
 }
});
