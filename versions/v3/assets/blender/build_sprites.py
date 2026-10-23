"""Original tennis sprites. Reuse tested interaction skeleton/contact, replace all visible anatomy."""
import bpy, math, random
from mathutils import Vector
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(Path(__file__).with_name('lulu.blend')))
rig=bpy.data.objects['Lulu_Rig']; anchor=bpy.data.objects['Racket_Contact']
for o in list(bpy.data.objects):
 if o not in (rig,anchor):bpy.data.objects.remove(o,do_unlink=True)
rig.animation_data.action=None
for t in rig.animation_data.nla_tracks:t.mute=True
for b in rig.pose.bones:b.rotation_euler=(0,0,0);b.location=(0,0,0)
bpy.context.scene.frame_set(1)
parts=[]
def mat(name,h,rough=.65,metal=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;n=next((node for node in m.node_tree.nodes if node.type=='BSDF_PRINCIPLED'),None)
 if n is None:
  n=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');output=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(n.outputs['BSDF'],output.inputs['Surface'])
 c=[int(h[i:i+2],16)/255 for i in (0,2,4)];c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c]
 n.inputs['Base Color'].default_value=(*c,1);n.inputs['Roughness'].default_value=rough;n.inputs['Metallic'].default_value=metal;return m
felt=mat('Sprite_Felt','cbdc58',.95);seam=mat('Sprite_Seam','f5edca',.92);hand=mat('Sprite_Mittens','f3e7cb',.8);ink=mat('Sprite_Eyes','302c24',.25);white=mat('Sprite_Catchlight','fff9eb',.3);rose=mat('Verse_Ribbon','99515f');navy=mat('Code_Headband','28475b');cream=mat('Verse_Headband','f4e7cc');blue=mat('Code_Embroidery','b7d8de');pink=mat('Verse_Racket','c48f99',.38,.25);steel=mat('Code_Racket','476c87',.32,.35);string=mat('StringBed','e9e5cf');sage=mat('Racket_Throat','78948b',.4,.25)
def finish(o,name,m,bone='Spine',variant='Body'):
 o.name=name;o.data.materials.clear();o.data.materials.append(m)
 bpy.context.view_layer.objects.active=o;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 for v in o.data.vertices:
  v.co=o.matrix_world@v.co
  if bone!='Hand.R':v.co.z-=.36
 from mathutils import Matrix
 o.matrix_world=Matrix.Identity(4)
 for f in o.data.polygons:f.use_smooth=True
 g=o.vertex_groups.new(name=bone);g.add(list(range(len(o.data.vertices))),1,'REPLACE');o.parent=rig
 mod=o.modifiers.new('Sprite_Animation','ARMATURE');mod.object=rig;o['variant']=variant;parts.append(o);return o
def uv(name,p,s,m,bone='Spine',variant='Body'):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=20,location=p);o=bpy.context.object;o.scale=s;return finish(o,name,m,bone,variant)
def tube(name,pts,r,m,bone='Spine',variant='Body',closed=False):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=r;c.bevel_resolution=3
 sp=c.splines.new('POLY');sp.points.add(len(pts)-1)
 for v,p in zip(sp.points,pts):v.co=(*p,1)
 sp.use_cyclic_u=closed;o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True)
 bpy.ops.object.convert(target='MESH');return finish(bpy.context.object,name,m,bone,variant)
def mesh(name,verts,faces,m,variant='Body'):
 data=bpy.data.meshes.new(name);data.from_pydata(verts,[],faces);o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);return finish(o,name,m,variant=variant)
C=Vector((-.12,0,1.09));R=.59
uv('Tennis_Felt_Body',C,(R,R,R),felt)
# Closed tennis seam follows an actual spherical curve rather than a flat painted stripe.
pts=[]
for i in range(257):
 t=math.tau*i/256;p=Vector((.52*math.cos(2*t),math.sin(t),-math.cos(t))).normalized();pts.append(C+p*(R+.002))
tube('Continuous_Tennis_Seam',pts,.016,seam,closed=True)
# Tiny physical fibers are limited to 1600 triangles, only noticeable at close range.
rng=random.Random(73);verts=[];faces=[]
for i in range(1600):
 z=rng.uniform(-1,1);a=rng.random()*math.tau;n=Vector((math.sqrt(1-z*z)*math.cos(a),math.sqrt(1-z*z)*math.sin(a),z));p=C+n*R;t=n.cross(Vector((0,0,1))).normalized()*.0015;k=len(verts);verts.extend([p-t,p+t,p+n*rng.uniform(.003,.008)]);faces.append((k,k+1,k+2))
mesh('Felt_Fibers',verts,faces,felt)
for s in [-1,1]:
 x=C.x+s*.16; y=-math.sqrt(R*R-.16*.16-.06*.06)
 uv('Friendly_Eye',(x,y-.008,1.15),(.035,.018,.052),ink)
 uv('Eye_Glint',(x-.009,y-.025,1.17),(.008,.004,.011),white)
pts=[]
for i in range(25):
 x=-.075+.15*i/24;z=1.005+.035*(x/.075)**2;y=-math.sqrt(R*R-x*x-(z-C.z)**2)-.009;pts.append((C.x+x,y,z))
tube('Quiet_Smile',pts,.009,ink)
# Relaxed free arm and small mitten, no human fingers/anatomy.
tube('Welcoming_Arm',[(C.x-.51,-.03,1.10),(-.78,-.08,1.07),(-.87,-.10,1.18)],.037,felt)
uv('Free_Mitten',(-.9,-.10,1.22),(.075,.053,.075),hand)
uv('Free_Thumb',(-.84,-.13,1.23),(.038,.036,.045),hand)
# Tested racket sweet spot is retained in Blender Z-up coordinates.
CENTER=Vector((.66,-.4224,1.21288));U=Vector((.64,0,.7684)).normalized();V=Vector((U.z,0,-U.x))
def rp(u,v=0,d=0):return CENTER+U*u+V*v+Vector((0,d,0))
tube('Racket_Arm',[(.37,-.05,.71),(.40,-.21,.88),tuple(rp(-.52))],.037,felt,'Hand.R')
uv('Racket_Mitten',rp(-.53,0,.023),(.062,.042,.077),hand,'Hand.R')
uv('Racket_Thumb',rp(-.48,-.026,-.026),(.031,.032,.047),hand,'Hand.R')
tube('Grip',[rp(-.67),rp(-.37)],.024,cream,'Hand.R')
tube('Overgrip',[rp(-.66+.28*i/160)+V*math.cos(i/160*math.tau*9)*.025+Vector((0,math.sin(i/160*math.tau*9)*.025,0)) for i in range(161)],.0018,seam,'Hand.R')
uv('Butt_Cap',rp(-.67),(.033,.033,.033),cream,'Hand.R')
for s in [-1,1]:tube('Open_Y_Throat',[rp(-.37),rp(-.215,s*.085)],.011,sage,'Hand.R')
for v in [-.14,-.105,-.07,-.035,0,.035,.07,.105,.14]:
 h=.245*math.sqrt(1-(v/.185)**2);tube('Main_String',[rp(-h,v),rp(h,v)],.0017,string,'Hand.R')
for u in [-.20,-.16,-.12,-.08,-.04,0,.04,.08,.12,.16,.20]:
 h=.185*math.sqrt(1-(u/.245)**2);tube('Cross_String',[rp(u,-h,.001),rp(u,h,.001)],.0017,string,'Hand.R')
for variant,band,racket in [('Humanities',cream,pink),('Technology',navy,steel)]:
 # Fabric band follows the upper spherical surface; narrow curved ribbon, no floating torus.
 verts=[];faces=[]
 for j in range(5):
  theta=.92+j*.035
  for i in range(96):
   a=math.tau*i/96;verts.append(C+Vector((math.sin(theta)*math.cos(a),math.sin(theta)*math.sin(a),math.cos(theta)))*(R+.009))
 for j in range(4):
  for i in range(96):a=j*96+i;b=j*96+(i+1)%96;faces.append((a,b,b+96,a+96))
 mesh('Woven_Headband',verts,faces,band,variant)
 tube('Racket_Hoop',[rp(.245*math.cos(i*math.tau/96),.185*math.sin(i*math.tau/96)) for i in range(96)],.017,racket,'Hand.R',variant,True)
 if variant=='Humanities':
  for sign in [-1,1]:
   verts=[]
   for i in range(16):
    t=i/15;center=Vector((C.x-.49-.22*t,.20+sign*.06+.12*t,1.43-.20*t+.025*math.sin(t*math.tau)))
    verts.extend([center+Vector((-.028,0,0)),center+Vector((.028,0,0))])
   faces=[(i*2,i*2+1,i*2+3,i*2+2) for i in range(15)];o=mesh('Silk_Ribbon_Tail',verts,faces,rose,variant)
   mod=o.modifiers.new('Ribbon thickness','SOLIDIFY');mod.thickness=.003;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
  uv('Ribbon_Knot',(C.x-.49,.20,1.43),(.045,.03,.036),rose,variant=variant)
 else:
  for ox in [-.018,.018]:
   tube('Code_Stitch',[(C.x+ox-.03,-.51,1.43),(C.x+ox,-.52,1.455),(C.x+ox+.03,-.51,1.43),(C.x+ox,-.52,1.405)],.003,blue,variant=variant,closed=True)
# Join exactly three independently switchable skinned meshes.
groups={v:[o for o in parts if o['variant']==v] for v in ['Body','Humanities','Technology']}
for variant in ['Body','Humanities','Technology']:
 bpy.ops.object.select_all(action='DESELECT');group=groups[variant]
 for o in group:o.select_set(True)
 bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join();group[0].name='Lulu_'+variant
bpy.ops.object.select_all(action='DESELECT');rig.select_set(True);anchor.select_set(True)
for n in ['Body','Humanities','Technology']:bpy.data.objects['Lulu_'+n].select_set(True)
bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/tennis-sprites.glb'),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='NLA_TRACKS',export_force_sampling=True,export_anim_slide_to_zero=True,export_yup=True)
bpy.ops.wm.save_as_mainfile(filepath=str(Path(__file__).with_name('tennis-sprites.blend')))
print('SPRITES_COMPLETE')
