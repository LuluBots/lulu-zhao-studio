import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Vector3} from 'three';
test('four Blender clouds have distinct silhouettes, smooth normals and a bounded download',async()=>{
 const b=await readFile(new URL('../public/models/clouds.glb',import.meta.url));
 assert.ok(b.length<800*1024);
 const gltf=await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');
 const meshes=[];gltf.scene.traverse(o=>{if(o.isMesh)meshes.push(o)});
 assert.equal(meshes.length,4);assert.equal(new Set(meshes.map(o=>o.name)).size,4);
 const heights=[];
 for(const mesh of meshes){const g=mesh.geometry;g.computeBoundingBox();const size=g.boundingBox.getSize(new Vector3());assert.ok(size.x>3&&size.x<5);assert.ok(size.y>1&&size.y<2.5);heights.push(size.y);assert.ok(g.attributes.color);for(const n of g.attributes.normal.array)assert.ok(Number.isFinite(n));}
 assert.ok(Math.max(...heights)-Math.min(...heights)>.5);
});
