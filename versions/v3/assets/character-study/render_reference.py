import bpy,math,json
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(root/'assets/character-study/kenney-study.blend'))
scene=bpy.context.scene
for old in list(scene.objects):
 if old.name not in ['characterMedium','Root']:bpy.data.objects.remove(old,do_unlink=True)
mesh=bpy.data.objects['characterMedium'];rig=bpy.data.objects['Root']
print('VISIBILITY',mesh.hide_render,mesh.hide_get(),rig.hide_render)
mesh.hide_render=False;mesh.hide_set(False);rig.hide_render=False;rig.hide_set(False)
mat=mesh.data.materials[0];mat.use_nodes=True;bs=mat.node_tree.nodes.get('Principled BSDF');bs.inputs['Roughness'].default_value=.8
for link in list(mat.node_tree.links):
 if link.to_socket==bs.inputs['Alpha']:mat.node_tree.links.remove(link)
bs.inputs['Alpha'].default_value=1
tex=mat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(root/'assets/references/kenney/Skins/skaterFemaleA.png'));mat.node_tree.links.new(tex.outputs['Color'],bs.inputs['Base Color'])
# Inspect the source topology as-is, without disguising this as a newly authored Lulu.
bpy.context.view_layer.update();bounds=[mesh.matrix_world@Vector(c) for c in mesh.bound_box];lo=min(p.z for p in bounds);hi=max(p.z for p in bounds);center=sum(bounds,Vector())/8;print('BOUNDS',tuple(center),lo,hi)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,lo-.025));floor=bpy.context.object
m=bpy.data.materials.new('Study backdrop');m.diffuse_color=(.70,.75,.73,1);floor.data.materials.append(m)
bpy.ops.object.camera_add(location=center+Vector((6,-10,5)));camera=bpy.context.object;camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=5.5;scene.camera=camera
for loc,energy,size in [((-4,-6,8),700,5),((4,2,6),500,4)]:
 bpy.ops.object.light_add(type='AREA',location=center+Vector(loc));o=bpy.context.object;o.data.energy=energy;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(center-o.location).to_track_quat('-Z','Y').to_euler()
scene.world.color=(.4,.4,.4);scene.render.engine='CYCLES';scene.cycles.samples=32;scene.render.resolution_x=800;scene.render.resolution_y=900;scene.render.resolution_percentage=100;scene.view_settings.view_transform='AgX'
scene.render.filepath=str(root/'assets/character-study/kenney-surface.png');bpy.ops.render.render(write_still=True)
# Same lens, no geometry subdivision. Thin wire overlay reveals authored edge flow.
wire=mesh.copy();wire.data=mesh.data.copy();scene.collection.objects.link(wire);wire.name='Topology_Overlay';wire.data.materials.clear();ink=bpy.data.materials.new('Topology ink');ink.diffuse_color=(.025,.06,.07,1);wire.data.materials.append(ink)
mod=wire.modifiers.new('Edge study','WIREFRAME');mod.thickness=.003;mod.offset=1
scene.render.filepath=str(root/'assets/character-study/kenney-topology.png');bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(root/'assets/character-study/kenney-study.blend'))
