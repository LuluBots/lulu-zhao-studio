import bpy, argparse, sys
from pathlib import Path
parser=argparse.ArgumentParser()
parser.add_argument("rover");parser.add_argument("radio");parser.add_argument("output_directory")
args=parser.parse_args(sys.argv[sys.argv.index("--")+1:])
out=Path(args.output_directory);out.mkdir(parents=True,exist_ok=True)
from mathutils import Vector
for key in [1297,784]:
 bpy.ops.wm.read_factory_settings(use_empty=True)
 bpy.ops.import_scene.gltf(filepath=args.rover if key==1297 else args.radio)
 for o in [o for o in bpy.context.scene.objects if o.type=='MESH']:
  bpy.context.view_layer.objects.active=o
  if o.data.users>1:o.data=o.data.copy()
  if len(o.data.polygons)>600:
   m=o.modifiers.new('Web silhouette budget','DECIMATE');m.ratio=.18 if key==1297 else .28
   bpy.ops.object.modifier_apply(modifier=m.name)
 for image in bpy.data.images:
  if image.size[0]>512 or image.size[1]>512:image.scale(512,512);image.pack()
 if key==1297:
  for mat in bpy.data.materials:
   if not mat.use_nodes:continue
   bs=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
   if not bs:continue
   name=mat.name.lower();color=None
   if 'warm graphite' in name:color=(.67,.71,.65,1)
   elif 'dark lower' in name:color=(.16,.28,.30,1)
   elif 'orange' in name:color=(.48,.58,.18,1)
   elif 'titanium' in name:color=(.45,.59,.56,1)
   if color:bs.inputs['Base Color'].default_value=color
 coords=[o.matrix_world@Vector(c) for o in bpy.context.scene.objects if o.type=='MESH' for c in o.bound_box]
 lo=Vector(tuple(min(v[i] for v in coords) for i in range(3)));hi=Vector(tuple(max(v[i] for v in coords) for i in range(3)))
 print('BOUNDS',key,tuple(lo),tuple(hi))
 # Preserve animated nodes and their local axes; normalize via a common parent.
 root=bpy.data.objects.new('Courtside asset root',None);bpy.context.collection.objects.link(root)
 for obj in list(bpy.context.scene.objects):
  if obj!=root and obj.parent is None:obj.parent=root
 width=3.3 if key==1297 else .9
 factor=width/max(hi.x-lo.x,hi.y-lo.y)
 root.scale=(factor,)*3;root.location=(-((hi.x+lo.x)/2)*factor,-((hi.y+lo.y)/2)*factor,-lo.z*factor)
 bpy.ops.export_scene.gltf(filepath=str(out/('research-rover.glb' if key==1297 else 'court-radio.glb')),export_format='GLB',export_animations=True,export_yup=True)
