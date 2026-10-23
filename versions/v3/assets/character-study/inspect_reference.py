import bpy,json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.fbx(filepath=str(root/'assets/references/kenney/Model/characterMedium.fbx'))
for o in bpy.context.scene.objects:
 print('MODEL',o.name,o.type,tuple(o.dimensions),tuple(o.rotation_euler))
 if o.type=='ARMATURE':print('BONES',[b.name for b in o.data.bones])
 if o.type=='MESH':print('MESH',len(o.data.vertices),len(o.data.polygons),'materials',[m.name for m in o.data.materials])
bpy.ops.wm.save_as_mainfile(filepath=str(root/'assets/character-study/kenney-study.blend'))
