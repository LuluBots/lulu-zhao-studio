import bpy, argparse, sys
parser=argparse.ArgumentParser(description="Prepare Scenario bookshop GLB for the website")
parser.add_argument("input");parser.add_argument("output")
args=parser.parse_args(sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else [])
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=args.input)
objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
coords=[o.matrix_world@Vector(c) for o in objects for c in o.bound_box]
lo=Vector(tuple(min(v[i] for v in coords) for i in range(3))); hi=Vector(tuple(max(v[i] for v in coords) for i in range(3)))
print('BOUNDS',lo,hi,'DIM',hi-lo)
# Collapse static pieces by material to avoid 1,400 draw calls.
by_material={}
for o in objects:
 key=tuple(m.name if m else '' for m in o.data.materials)
 by_material.setdefault(key,[]).append(o)
for group in by_material.values():
 bpy.ops.object.select_all(action='DESELECT')
 for o in group:o.select_set(True)
 bpy.context.view_layer.objects.active=group[0]
 if len(group)>1:bpy.ops.object.join()
 o=bpy.context.object
 if len(o.data.polygons)>800:
  mod=o.modifiers.new('Courtside detail reduction','DECIMATE');mod.ratio=.45
  bpy.ops.object.modifier_apply(modifier=mod.name)
for image in bpy.data.images:
 if image.size[0]>512 or image.size[1]>512:image.scale(512,512)
# Muted sage canopy and pale linen, preserving teal shop and book colors.
for m in bpy.data.materials:
 if not m.use_nodes:continue
 bsdf=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if not bsdf:continue
 if 'vermilion' in m.name:bsdf.inputs['Base Color'].default_value=(.32,.47,.39,1)
 if 'undyed linen' in m.name:bsdf.inputs['Base Color'].default_value=(.89,.85,.73,1)
 if 'golden ochre' in m.name:bsdf.inputs['Base Color'].default_value=(.48,.55,.39,1)
# Normalize the longest horizontal dimension to 4.1 court metres, feet at z=0.
scale=4.1/max(hi.x-lo.x,hi.y-lo.y)
center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z))
for o in [o for o in bpy.context.scene.objects if o.type=='MESH']:
 o.location=(o.location-center)*scale;o.scale*=scale
bpy.ops.export_scene.gltf(filepath=args.output,export_format='GLB',export_yup=True)
print('OPTIMIZED',len([o for o in bpy.context.scene.objects if o.type=='MESH']))
