"""Cycles diffuse-indirect irradiance atlas. Static floor receivers; never bake players.
Blender coordinates: (Three.x, -Three.z, Three.y). Shared 26 x 30 m UV atlas.
"""
import bpy, math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets/blender/court-contact-bake.blend'))
scene=bpy.context.scene
bpy.data.objects.remove(bpy.data.objects['Contact_AO_Receiver'],do_unlink=True)
def mat(name,color):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(*color,1);return m
wood=mat('Warm timber',(.59,.40,.24));ivory=mat('Linen',(.88,.82,.67));sage=mat('Sage foliage',(.29,.42,.26));blue=mat('Sky blue court',(.43,.65,.77));purple=mat('Lavender playing surface',(.56,.38,.61))
for o in list(scene.objects):
 if o.type=='MESH':o.data.materials.clear();o.data.materials.append(wood if o.location.x>6 else ivory)
for end in [-1,1]:
 bpy.ops.mesh.primitive_cone_add(vertices=48,radius1=1.27,radius2=.08,depth=.36,location=(7.65,-end*2.8,2.83));bpy.context.object.data.materials.append(ivory)
 bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,location=(7.5,-end*5.35,1.65));bpy.context.object.scale=(.55,.5,.8);bpy.context.object.data.materials.append(sage)
receivers=[]
def plane(name,x,z,h,w,d,material):
 bpy.ops.mesh.primitive_plane_add(size=2,location=(x,-z,h));o=bpy.context.object;o.name=name;o.scale=(w/2,d/2,1);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(material)
 for loop in o.data.loops:
  p=o.matrix_world @ o.data.vertices[loop.vertex_index].co;o.data.uv_layers.active.data[loop.index].uv=(p.x/26+.5,p.y/30+.5)
 receivers.append(o)
# Partition the court so lavender and blue surfaces contribute their actual bounce colors.
plane('Lavender receiver',0,0,.004,8.7,17.4,purple)
for x in [-5.275,5.275]:plane('Blue sideline',x,0,-.015,1.85,21.7,blue)
for z in [-9.775,9.775]:plane('Blue baseline',0,z,-.015,8.7,2.15,blue)
plane('Rest deck',6.65,0,-.0295,3.3,12,ivory);plane('Umpire deck',-7.25,0,-.04,2.2,3.1,ivory)
scene.render.engine='CYCLES';scene.cycles.samples=96;scene.cycles.use_denoising=True;scene.cycles.max_bounces=6
scene.render.bake.use_pass_direct=False;scene.render.bake.use_pass_indirect=True;scene.render.bake.use_pass_color=False;scene.render.bake.margin=8
scene.world.use_nodes=True
bpy.ops.object.light_add(type='AREA',location=(-12,-8,25));sun=bpy.context.object;sun.rotation_euler=(0,.42,-.3);sun.data.shape='DISK';sun.data.size=10
for mode in ['day','night']:
 sun.data.energy=2600 if mode=='day' else 1000;sun.data.color=(1,.86,.69) if mode=='day' else (.48,.65,1)
 bg=scene.world.node_tree.nodes['Background'];bg.inputs['Color'].default_value=(.65,.79,1,1) if mode=='day' else (.19,.3,.55,1);bg.inputs['Strength'].default_value=.45 if mode=='day' else .16
 image=bpy.data.images.new('Indirect_'+mode,width=1024,height=1024,alpha=False);image.colorspace_settings.name='sRGB'
 for material in [wood,ivory,sage,blue,purple]:
  node=material.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;material.node_tree.nodes.active=node
 bpy.ops.object.select_all(action='DESELECT')
 for o in receivers:o.select_set(True)
 bpy.context.view_layer.objects.active=receivers[0]
 bpy.ops.object.bake(type='DIFFUSE')
 image.filepath_raw=str(ROOT/'public/textures'/('court-indirect-'+mode+'.png'));image.file_format='PNG';image.save();image.filepath='//../../public/textures/court-indirect-'+mode+'.png'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/court-indirect-bake.blend'))
print('INDIRECT_BAKES_COMPLETE')
