import bpy
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(Path(__file__).with_name('tennis-sprites.blend')))
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=32;s.render.resolution_x=s.render.resolution_y=600;s.render.resolution_percentage=100;s.render.film_transparent=True;s.world.use_nodes=True;bg=next(n for n in s.world.node_tree.nodes if n.type=='BACKGROUND');bg.inputs['Color'].default_value=(.65,.7,.8,1);bg.inputs['Strength'].default_value=.6
bpy.ops.object.camera_add(location=(2,-5,2.4));c=bpy.context.object;c.rotation_euler=(Vector((0,0,.9))-c.location).to_track_quat('-Z','Y').to_euler();c.data.type='ORTHO';c.data.ortho_scale=2.05;s.camera=c
for loc,power,size in [((-3,-4,5),400,4),((4,1,3),250,3)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.size=size;o.rotation_euler=(Vector((0,0,.8))-o.location).to_track_quat('-Z','Y').to_euler()
out=root/'public/brand';out.mkdir(exist_ok=True)
for name,variant in [('verse','Humanities'),('code','Technology')]:
 for v in ['Humanities','Technology']:bpy.data.objects['Lulu_'+v].hide_render=v!=variant
 s.render.filepath=str(out/(name+'-sprite.png'));bpy.ops.render.render(write_still=True)
