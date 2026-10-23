import bpy,math,random
from pathlib import Path
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
root=Path(__file__).resolve().parents[2]
for variant in range(4):
 rng=random.Random(21+variant);pieces=[]
 for i in range(18):
  x=rng.uniform(-2.1,2.1);y=rng.uniform(-1.1,1.1);z=rng.uniform(-.15,.45)
  r=rng.uniform(.55,1.05)*(1-.18*abs(x)/2.1)
  bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,location=(x,y,z));o=bpy.context.object;o.scale=(r*1.2,r,r*.8);pieces.append(o)
 for x,y,z,r in [(-.7,0,.65,1.1),(.3,.15,.8,1.2),(1.1,.05,.45,.9)]:
  bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,location=(x,y,z));o=bpy.context.object;o.scale=(r,r*.9,r*.9);pieces.append(o)
 bpy.ops.object.select_all(action='DESELECT')
 for o in pieces:o.select_set(True)
 bpy.context.view_layer.objects.active=pieces[0];bpy.ops.object.join();o=pieces[0];o.name='CloudMatch_'+str(variant);bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
 rem=o.modifiers.new('Continuous billows','REMESH');rem.mode='VOXEL';rem.voxel_size=.13;rem.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier=rem.name)
 sm=o.modifiers.new('Cotton softness','SMOOTH');sm.factor=.7;sm.iterations=3;bpy.ops.object.modifier_apply(modifier=sm.name)
 sub=o.modifiers.new('Rounded surface','SUBSURF');sub.levels=1;bpy.ops.object.modifier_apply(modifier=sub.name)
 attr=o.data.color_attributes.new(name='CloudTint',type='BYTE_COLOR',domain='POINT')
 for v in o.data.vertices:
  t=max(0,min(1,(v.co.z+.7)/2.7));attr.data[v.index].color=(.74+.26*t,.81+.19*t,.90+.10*t,1)
 mat=bpy.data.materials.new('CloudSoft');mat.use_nodes=True;n=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED');col=mat.node_tree.nodes.new('ShaderNodeVertexColor');col.layer_name='CloudTint';mat.node_tree.links.new(col.outputs['Color'],n.inputs['Base Color']);n.inputs['Roughness'].default_value=1;o.data.materials.append(mat)
 for f in o.data.polygons:f.use_smooth=True
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(root/'public/models/cloud-match.glb'),export_format='GLB',use_selection=True)
bpy.ops.wm.save_as_mainfile(filepath=str(Path(__file__).with_name('cloud-match.blend')))
