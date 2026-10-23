"""Four original, unified cloud sculptures and a real Cycles AO bake for courtside contact.
No third-party models or textures. Run with Blender --background --python this_file.
"""
import bpy, math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'public/models';OUT.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
clouds=[]
variants=[
 ('Cloud_Cumulus',[(-1.25,0,.20,.85),(-.35,0,.38,1.0),(.55,0,.65,.95),(1.35,0,.18,.75),(0,.45,.13,.78)]),
 ('Cloud_Alto',[(-1.6,0,.12,.65),(-.85,0,.18,.75),(0,0,.32,.83),(.85,0,.15,.72),(1.55,0,.02,.57),(.3,.4,.05,.63)]),
 ('Cloud_Crown',[(-1,0,.10,.75),(-.35,0,.65,.92),(.4,0,.95,.9),(1.1,0,.25,.72),(.1,.4,.15,.8)]),
 ('Cloud_Drift',[(-1.55,0,.08,.57),(-.8,0,.22,.73),(0,0,.3,.83),(.8,0,.44,.76),(1.45,0,.22,.6),(.4,.45,.05,.65)])]
for name,parts in variants:
 # Sculpt a broad base with distinct billows, then fuse into one continuous surface.
 pieces=[]
 for x,y,z,r in parts:
  bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,location=(x,y,z+.25));piece=bpy.context.object;piece.scale=(r,r*.86,r*.88);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);pieces.append(piece)
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,location=(0,0,.12));base=bpy.context.object;base.scale=(1.9,.72,.30);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);pieces.append(base)
 bpy.ops.object.select_all(action='DESELECT')
 for piece in pieces:piece.select_set(True)
 bpy.context.view_layer.objects.active=base;bpy.ops.object.join();obj=bpy.context.object;obj.name=name
 # Apply position so every reusable variant has the same origin.
 bpy.ops.object.transform_apply(location=True,rotation=False,scale=False)
 remesh=obj.modifiers.new('Unified cloud volume','REMESH');remesh.mode='VOXEL';remesh.voxel_size=.085;remesh.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier=remesh.name)
 smooth=obj.modifiers.new('Sculpt polish','SMOOTH');smooth.factor=.8;smooth.iterations=4;bpy.ops.object.modifier_apply(modifier=smooth.name)
 decimate=obj.modifiers.new('Web silhouette budget','DECIMATE');decimate.ratio=.55;bpy.ops.object.modifier_apply(modifier=decimate.name)
 for v in obj.data.vertices:
  if v.co.z<0:v.co.z*=.4
 for face in obj.data.polygons:face.use_smooth=True
 attr=obj.data.color_attributes.new(name='CloudTint',type='FLOAT_COLOR',domain='POINT')
 for i,v in enumerate(obj.data.vertices):
  t=max(0,min(1,(v.co.z+.3)/1.5));attr.data[i].color=(.83+.17*t,.88+.12*t,.94+.06*t,1)
 mat=bpy.data.materials.new(name+'_Pearl');mat.use_nodes=True;n=mat.node_tree.nodes;bs=n.get('Principled BSDF');color=n.new('ShaderNodeVertexColor');color.layer_name='CloudTint';mat.node_tree.links.new(color.outputs['Color'],bs.inputs['Base Color']);bs.inputs['Roughness'].default_value=.96
 obj.data.materials.append(mat);clouds.append(obj)
bpy.ops.object.select_all(action='DESELECT')
for obj in clouds:obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'clouds.glb'),export_format='GLB',use_selection=True,export_materials='EXPORT')
# Editable cloud library, with each named object at its reusable origin.
bpy.ops.wm.save_as_mainfile(filepath=str(Path(__file__).parent/'clouds.blend'))
# Contact bake: original proxy geometry matches the static furniture's dimensions.
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def box(loc,scale):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);return o
# Three coordinates (x,height,z) -> Blender (x,-z,height).
def block(x,h,z,w,d,depth):return box((x,-z,h),(w,depth,d))
for end in [-1,1]:
 # Benches face inward; four supporting legs, slatted seat and back.
 for x in [6.49,6.92]:
  for z in [2.02,3.58]:block(x,.26,end*z,.17,.5,.17)
 block(6.7,.51,end*2.8,.56,.09,2.05);block(7.01,.84,end*2.8,.08,.42,2.05)
 block(7.65,1.65,end*2.8,.08,3.3,.08)
 block(7.5,.24,end*5.35,.55,.48,.55)
for x in [-7.73,-6.77]:
 for z in [-.65,.70]:block(x,1.05,z,.10,2.1,.10)
block(-7.25,2.08,0,.8,.13,1.08)
for x in [-5.05,5.05]:block(x,.6,0,.14,1.2,.14)
bpy.ops.mesh.primitive_plane_add(size=2,location=(0,0,.012));receiver=bpy.context.object;receiver.name='Contact_AO_Receiver';receiver.scale=(13,15,1);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
image=bpy.data.images.new('Court_Contact_AO',width=1024,height=1024,alpha=True);mat=bpy.data.materials.new('AO_Bake');mat.use_nodes=True;node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;mat.node_tree.nodes.active=node;receiver.data.materials.append(mat)
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.world.color=(1,1,1)
bpy.ops.object.select_all(action='DESELECT');receiver.select_set(True);bpy.context.view_layer.objects.active=receiver
bpy.ops.object.bake(type='AO',margin=4)
# Convert actual baked occlusion into a transparent, daylight-independent contact layer.
pixels=list(image.pixels[:]);
for i in range(0,len(pixels),4):
 ao=max(0,min(1,pixels[i]));pixels[i:i+4]=[.16,.22,.27,(1-ao)*.32]
image.pixels[:]=pixels
textures=ROOT/'public/textures';textures.mkdir(exist_ok=True);image.filepath_raw=str(textures/'court-contact-ao.png');image.file_format='PNG';image.save();image.filepath='//../../public/textures/court-contact-ao.png'
bpy.ops.wm.save_as_mainfile(filepath=str(Path(__file__).parent/'court-contact-bake.blend'))
print('CLOUDS_AND_AO_DONE')
