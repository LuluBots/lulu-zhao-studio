import bpy
from mathutils import Vector
from pathlib import Path
root=Path.cwd();bpy.ops.wm.open_mainfile(filepath=str(root/'assets/blender/clouds.blend'))
scene=bpy.context.scene
for i,obj in enumerate(sorted([o for o in scene.objects if o.type=='MESH'],key=lambda o:o.name)):
 obj.location=((i%2)*5-2.5,(i//2)*3.7-1.85,0)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.45));mat=bpy.data.materials.new('Blue_Backdrop');mat.diffuse_color=(.40,.59,.70,1);bpy.context.object.data.materials.append(mat)
bpy.ops.object.camera_add(location=(7,-11,11));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,.25))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=11;scene.camera=cam
for loc,power,size in [((-4,-4,9),1100,7),((5,3,7),600,5)]:
 bpy.ops.object.light_add(type='AREA',location=loc);light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(-light.location).to_track_quat('-Z','Y').to_euler()
scene.world.color=(.3,.4,.5);scene.render.engine='CYCLES';scene.cycles.samples=32;scene.render.resolution_x=1000;scene.render.resolution_y=760;scene.render.resolution_percentage=100
scene.render.filepath=str(root/'assets/blender/cloud-library.png');bpy.ops.render.render(write_still=True)
