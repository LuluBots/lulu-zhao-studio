"""Rebuild Lulu: Blender 5.2, meters, Z-up source / Y-up GLB, no external assets.
Run: Blender -b --factory-startup --python assets/blender/build_lulu.py
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector, Matrix
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/models'; OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for action in list(bpy.data.actions): bpy.data.actions.remove(action)
scene=bpy.context.scene; scene.render.fps=24

def mat(name,hex,rough=.8):
 srgb=[int(hex[i:i+2],16)/255 for i in (0,2,4)]
 c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in srgb]
 m=bpy.data.materials.new(name); m.diffuse_color=(*c,1); m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*c,1);bs.inputs['Roughness'].default_value=rough
 return m
skin=mat('Skin_WarmPeach','dcae91');hair=mat('Hair_Cocoa','40332f');eye=mat('Eyes','302c2b');shoe=mat('Shoes_Ivory','f4f0df');sole=mat('Soles_Sage','9ca99c');string=mat('Strings','c7d2c4');frame=mat('Racket_Sage','789b92');grip=mat('Grip_Cream','e7d9b4');cream=mat('Humanities_Cream','efe5cb');leaf=mat('Humanities_Leaf','8eaa85');navy=mat('Technology_ScholarBlue','567386');blue=mat('Technology_Ice','66d5dc')
rose=mat('Humanities_DustyRose','c78b99');gold=mat('Humanities_Champagne','c6ad7b');dark=mat('Technology_Graphite','26303f');pink=mat('Technology_Orchid','e88bc2');glow=mat('Technology_CircuitLight','7aebdf')
bs=glow.node_tree.nodes.get('Principled BSDF');bs.inputs['Emission Color'].default_value=(.12,.7,.58,1);bs.inputs['Emission Strength'].default_value=.65
silver=mat('Scientist_Titanium','aabdc5',.38);linen=mat('Scientist_Linen','e2e8e5');hairline=mat('Hair_Highlight','665044');blush=mat('Cheek_Rose','cf9d8b');ink=mat('Stitch_Ink','607e89')
parts=[]
def finish(obj,name,material,bone='Spine',variant='Body'):
 obj.name=f'{variant}_{name}'; obj.data.materials.clear();obj.data.materials.append(material)
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 for f in obj.data.polygons:f.use_smooth=len(f.vertices)<=4
 obj['bone']=bone;obj['variant']=variant;parts.append(obj);return obj

def uv(name,loc,scale,material,bone='Spine',variant='Body',segments=12,rings=8):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc)
 o=bpy.context.object;o.scale=scale;return finish(o,name,material,bone,variant)

def rod(name,a,b,r,material,bone='Spine',variant='Body',r2=None):
 mid=(Vector(a)+Vector(b))/2;d=Vector(b)-Vector(a)
 bpy.ops.mesh.primitive_cone_add(vertices=10,radius1=r,radius2=r if r2 is None else r2,depth=d.length,location=mid)
 o=bpy.context.object;o.rotation_euler=d.to_track_quat('Z','Y').to_euler();return finish(o,name,material,bone,variant)

def torus(name,loc,major,minor,material,bone='Head',variant='Body',scale=(1,1,1),rotation=(0,0,0)):
 bpy.ops.mesh.primitive_torus_add(major_segments=24,minor_segments=6,location=loc,major_radius=major,minor_radius=minor,rotation=rotation)
 o=bpy.context.object;o.scale=scale;return finish(o,name,material,bone,variant)


def curve(name,points,radius,material,bone='Head',variant='Body',closed=False):
 data=bpy.data.curves.new(name,'CURVE');data.dimensions='3D';data.bevel_depth=radius;data.bevel_resolution=2
 spline=data.splines.new('POLY');spline.points.add(len(points)-1)
 for v,p in zip(spline.points,points):v.co=(*p,1)
 spline.use_cyclic_u=closed;o=bpy.data.objects.new(name,data);scene.collection.objects.link(o)
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
 return finish(bpy.context.object,name,material,bone,variant)

def lock(name,controls,width,variant):
 # Catmull-Rom sculpted ribbon, wide across the strand and thin against the scalp.
 points=[Vector(p) for p in controls];samples=[]
 for i in range(len(points)-1):
  a=points[max(0,i-1)];b=points[i];c=points[i+1];d=points[min(len(points)-1,i+2)]
  for j in range(5):
   t=j/5;samples.append((2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t)*.5)
 samples.append(points[-1]);verts=[];faces=[]
 for i,point in enumerate(samples):
  tangent=(samples[min(i+1,len(samples)-1)]-samples[max(0,i-1)]).normalized()
  across=tangent.cross(Vector((0,1,0))).normalized();depth=across.cross(tangent).normalized()
  taper=max(.025,max(0,math.sin(math.pi*i/(len(samples)-1)))**.6)
  for j in range(8):
   a=math.tau*j/8;verts.append(point+across*math.cos(a)*width*taper+depth*math.sin(a)*.027*taper)
 for i in range(len(samples)-1):
  for j in range(8):a=i*8+j;b=i*8+(j+1)%8;faces.append((a,b,b+8,a+8))
 faces.extend([tuple(range(7,-1,-1)),tuple(range(len(verts)-8,len(verts)))])
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new(name,mesh);scene.collection.objects.link(o);bpy.context.view_layer.objects.active=o
 finish(o,name,hair,'Head',variant)
 curve(name+'Etching',[p+Vector((0,-.026,0)) for p in samples[2:-2]],.0018,hairline,'Head',variant)

def flexible_limb(name,a,b,c,radii,bones):
 points=[];verts=[];weights=[];faces=[]
 for i in range(13):
  t=i/12
  center=Vector(a).lerp(Vector(b),t*2) if t<=.5 else Vector(b).lerp(Vector(c),(t-.5)*2)
  radius=radii[0]+(radii[1]-radii[0])*t*2 if t<=.5 else radii[1]+(radii[2]-radii[1])*(t-.5)*2
  tangent=(Vector(b)-Vector(a) if t<=.5 else Vector(c)-Vector(b)).normalized()
  side=tangent.cross(Vector((0,1,0))).normalized();normal=tangent.cross(side).normalized()
  w=max(0,min(1,(t-.36)/.28));w=w*w*(3-2*w)
  for j in range(16):
   angle=math.tau*j/16;verts.append(center+radius*(side*math.cos(angle)+normal*math.sin(angle)));weights.append(w)
 for i in range(12):
  for j in range(16):a0=i*16+j;b0=i*16+(j+1)%16;faces.append((a0,b0,b0+16,a0+16))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new(name,mesh);scene.collection.objects.link(o);bpy.context.view_layer.objects.active=o;finish(o,name,skin,bones[0])
 for bone,invert in [(bones[0],True),(bones[1],False)]:
  group=o.vertex_groups.new(name=bone)
  for i,w in enumerate(weights):group.add([i],1-w if invert else w,'REPLACE')

# One body and one skeleton, shared by both outfits. Front is -Y.
uv('Torso',(0,0,1.13),(.255,.16,.32),skin)
rod('Neck',(0,0,1.37),(0,0,1.53),.09,skin)
uv('Head',(0,-.005,1.73),(.285,.245,.29),skin,'Head',segments=16,rings=12)
for x in [-.10,.10]:
 uv('Eye',(x,-.238,1.74),(.021,.012,.027),eye,'Head')
 uv('Ear',(math.copysign(.276,x),0,1.70),(.042,.052,.065),skin,'Head')
uv('Nose',(0,-.248,1.685),(.027,.025,.023),skin,'Head')
# Outfit-specific hairstyles on the same head and bone.
for variant in ['Humanities','Technology']:
 verts=[];faces=[]
 for j in range(8):
  for i in range(32):
   phi=math.tau*i/32;front=max(0,-math.sin(phi));theta=(1.98-.78*front)*j/7
   verts.append((.307*math.sin(theta)*math.cos(phi),.27*math.sin(theta)*math.sin(phi)+.022,1.76+.307*math.cos(theta)))
 for j in range(7):
  for i in range(32):a=j*32+i;b=j*32+(i+1)%32;faces.append((a,b,b+32,a+32))
 mesh=bpy.data.meshes.new(variant+'Hair');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('Hair',mesh);scene.collection.objects.link(o);bpy.context.view_layer.objects.active=o;finish(o,'HairFoundation',hair,'Head',variant)
 if variant=='Humanities':
  for i in range(4):
   z=.023*i
   lock('SweptFringe'+str(i),[(.10, -.11,2.06-z),(-.07,-.23,2.015-z),(-.23,-.246,1.91-z),(-.28,-.16,1.75-z)],.055,variant)
  for sign in [-1,1]:
   lock('FaceWave'+str(sign),[(sign*.27,-.08,1.97),(sign*.31,-.13,1.79),(sign*.28,-.14,1.61),(sign*.33,-.05,1.52)],.050,variant)
   for i in range(3):
    lock('BackWave'+str(sign)+str(i),[(sign*(.10+i*.065),.22,1.96),(sign*(.16+i*.05),.29,1.73),(sign*(.08+i*.065),.29,1.48),(sign*(.12+i*.05),.25,1.28)],.055,variant)
 else:
  uv('TwistBun',(0,.245,2.015),(.145,.13,.13),hair,'Head',variant,segments=16,rings=10)
  for i in range(3):
   lock('CleanSweep'+str(i),[(-.14,-.08,2.04-i*.023),(0,-.235,2.025-i*.023),(.22,-.235,1.96-i*.025),(.28,-.11,1.82-i*.025)],.042,variant)
  for i in range(3):
   curve('BunGroove'+str(i),[(.13*math.cos(a),.245+.115*math.sin(a),2.01+i*.025) for a in [j*math.tau/28 for j in range(28)]],.004,hairline,'Head',variant,True)
  rod('BunPin',(-.13,.25,2.04),(.14,.25,2.11),.011,silver,'Head',variant)
# A light visor that does not hide the face.
# Headwear belongs to each outfit, not the shared body.
for x in [-.10,.10]:rod('Brow',(x-.03,-.232,1.79),(x+.03,-.233,1.795),.007,hair,'Head')
rod('Smile',(-.025,-.239,1.62),(0,-.244,1.615),.006,rose,'Head');rod('Smile',(0,-.244,1.615),(.025,-.239,1.62),.006,rose,'Head')
for side,x in [('L',-.16),('R',.16)]:
 flexible_limb('Leg'+side,(x,0,.89),(x,-.005,.51),(x,0,.17),(.103,.083,.063),('Thigh.'+side,'Shin.'+side))
 rod('Sock'+side,(x,0,.16),(x,0,.28),.078,shoe,'Foot.'+side)
 uv('Shoe'+side,(x,-.055,.11),(.122,.22,.095),shoe,'Foot.'+side)
 uv('Sole'+side,(x,-.06,.055),(.124,.215,.035),sole,'Foot.'+side)
 for y in [-.12,-.075,-.03]:rod('Lace'+side,(x-.058,y,.184),(x+.058,y,.184),.009,string,'Foot.'+side)
for side,a,b,c in [('L',(-.26,0,1.35),(-.38,-.01,1.09),(-.38,-.16,.97)),('R',(.26,0,1.35),(.40,-.12,1.13),(.372,-.44,.727))]:
 flexible_limb('Arm'+side,a,b,c,(.079,.068,.048),('UpperArm.'+side,'Forearm.'+side))
 uv('Hand'+side,c,(.055,.06,.060),skin,'Hand.'+side)
# Engineered racket: elliptical hoop, open Y-throat, wrapped grip, real chord lengths.
CENTER=Vector((.75,-.47,1.18));U=Vector((.64,0,.7684)).normalized();V=Vector((U.z,0,-U.x))
def racketpoint(u,v=0,depth=0):return CENTER+U*u+V*v+Vector((0,depth,0))
rod('GripCore',racketpoint(-.75),racketpoint(-.43),.027,grip,'Hand.R')
for i in range(14):
 point=racketpoint(-.74+i*.023)
 curve('GripWrap',[point+V*(math.cos(a)*.028)+Vector((0,math.sin(a)*.028,0)) for a in [j*math.tau/16 for j in range(16)]],.003,shoe,'Hand.R',closed=True)
rod('ButtCap',racketpoint(-.77),racketpoint(-.735),.035,grip,'Hand.R')
for sign in [-1,1]:rod('OpenThroat',racketpoint(-.43),racketpoint(-.20,sign*.09),.013,frame,'Hand.R')
for value in [-.16,-.12,-.08,-.04,0,.04,.08,.12,.16]:
 half=.275*math.sqrt(1-(value/.205)**2)
 rod('MainString',racketpoint(-half,value,-.002),racketpoint(half,value,-.002),.0028,string,'Hand.R')
for value in [-.22,-.176,-.132,-.088,-.044,0,.044,.088,.132,.176,.22]:
 half=.205*math.sqrt(1-(value/.275)**2)
 rod('CrossString',racketpoint(value,-half,.002),racketpoint(value,half,.002),.0028,string,'Hand.R')
for i in range(3):
 point=racketpoint(-.615+i*.018)
 curve('GripFinger',[point+V*(math.cos(a)*.035)+Vector((0,math.sin(a)*.035,0)) for a in [math.pi*(.05+j*.12) for j in range(8)]],.010,skin,'Hand.R')
uv('Thumb',racketpoint(-.55, -.018, -.030),(.023,.024,.039),skin,'Hand.R')
for variant,material in [('Humanities',rose),('Technology',silver)]:
 curve('RacketHoop',[racketpoint(.275*math.cos(a),.205*math.sin(a)) for a in [j*math.tau/64 for j in range(64)]],.019,material,'Hand.R',variant,True)
 curve('RimInlay',[racketpoint(.285*math.cos(a),.215*math.sin(a),-.014) for a in [j*math.tau/64 for j in range(64)]],.004,gold if variant=='Humanities' else ink,'Hand.R',variant,True)
# Same garment topology, alternate palette and small original motifs.
for variant,cloth,accent in [('Humanities',cream,leaf),('Technology',navy,blue)]:
 uv('Polo',(0,0,1.16),(.27,.181,.285),cloth,variant=variant)
 for side,a,b in [('L',(-.26,0,1.35),(-.38,-.01,1.09)),('R',(.26,0,1.35),(.40,-.12,1.13))]:
  end=Vector(a).lerp(Vector(b),.45)
  rod('Sleeve'+side,a,end,.105,cloth,'UpperArm.'+side,variant,r2=.098)
  uv('Shoulder'+side,a,(.105,.105,.105),cloth,'UpperArm.'+side,variant)
 # A restrained pleated hem; disconnected rigid skirt follows the hips.
 verts=[];faces=[]
 for z,r in [(1.0,.25),(.76,.36)]:
  for i in range(24):
   angle=2*math.pi*i/24;rr=r*((1.07 if i%2 else .97) if variant=='Humanities' else (1.025 if i%2 else .975));zz=z
   if z<.8:zz=z+(.028*math.cos(angle*6)-.025 if variant=='Humanities' else .06*math.sin(angle))
   verts.append((rr*math.cos(angle),rr*.65*math.sin(angle),zz))
 for i in range(24):faces.append((i,(i+1)%24,(i+1)%24+24,i+24))
 faces.extend([tuple(range(23,-1,-1)),tuple(range(24,48))])
 mesh=bpy.data.meshes.new(variant+'Skirt');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('Skirt',mesh);scene.collection.objects.link(o);bpy.context.view_layer.objects.active=o;finish(o,'Skirt',cloth,variant=variant)
 torus('Waist',(0,0,1.0),.255,.018,accent,variant=variant,scale=(1,.65,1))
 rod('PoloPlacket',(0,-.183,1.23),(0,-.164,1.36),.011,accent,variant=variant)
 if variant=='Humanities':
  for x in [-.065,.065]:uv('Collar',(x,-.13,1.385),(.065,.045,.018),cream,variant=variant)
 else:torus('HighCollar',(0,0,1.40),.10,.023,dark,variant=variant,scale=(1,.8,1))
 if variant=='Humanities':
  rod('LeafStem',(-.12,-.179,1.19),(-.085,-.179,1.30),.009,accent,variant=variant)
  for x,z,angle in [(-.13,1.25,-.5),(-.076,1.28,.5)]:
   o=uv('Leaf',(x,-.181,z),(.024,.008,.047),accent,variant=variant);o.rotation_euler.y=angle
# Character-specific silhouettes and hand-crafted details, all on the shared rig.
variant='Humanities'
torus('RoseHeadband',(0,.018,1.93),.283,.012,rose,'Head',variant,scale=(1,.89,1))
for sign in [-1,1]:uv('PearlEarring',(sign*.286,-.04,1.65),(.018,.014,.024),shoe,'Head',variant)
for i in range(5):
 angle=i*math.tau/5
 uv('RosePetal',(-.315+math.cos(angle)*.031,-.205,1.88+math.sin(angle)*.031),(.027,.018,.027),rose,'Head',variant)
uv('RoseCenter',(-.315,-.228,1.88),(.019,.014,.019),gold,'Head',variant)
for x in [-.09,.09]:
 o=uv('RibbonBow',(x,.35,1.76),(.105,.035,.058),rose,'Head',variant);o.rotation_euler.y=math.copysign(.35,x)
 rod('RibbonTail',(x*.5,.355,1.75),(x*1.4,.37,1.47),.024,rose,'Head',variant,r2=.018)
for x in [-.05,.05]:
 o=uv('NeckBow',(x,-.185,1.36),(.058,.02,.031),rose,variant=variant);o.rotation_euler.y=math.copysign(.3,x)
rod('SilkTie',(0,-.191,1.34),(.065,-.19,1.20),.017,rose,variant=variant)
# Fine calligraphic botanical hem, intentionally visible as a rhythm at miniature scale.
for i in range(7):
 a=math.pi+(.28+i*.40);x=.365*math.cos(a);y=.365*.65*math.sin(a)
 o=uv('HemLeaf',(x,y-.008,.80),(.018,.008,.037),leaf,variant=variant);o.rotation_euler.y=math.sin(a)*.4
for side,x in [('L',-.16),('R',.16)]:
 torus('SockRibbon'+side,(x,0,.275),.079,.010,rose,'Shin.'+side,variant)
variant='Technology'
for x in [-.10,.10]:
 torus('RoundEyewear',(x,-.263,1.747),.068,.006,silver,'Head',variant,rotation=(math.pi/2,0,0))
rod('GlassesBridge',(-.032,-.27,1.758),(.032,-.27,1.758),.005,silver,'Head',variant)
for sign in [-1,1]:curve('GlassesTemple',[(sign*.17,-.257,1.76),(sign*.255,-.14,1.77),(sign*.278,.012,1.745)],.006,silver,'Head',variant)
# Ivory lapels over a blue technical tennis dress; a quiet orbital brooch and stitched pocket.
for sign in [-1,1]:
 points=[(sign*.025,-.112,1.425),(sign*.135,-.13,1.37),(sign*.11,-.177,1.265),(sign*.032,-.197,1.325)]
 mesh=bpy.data.meshes.new('TailoredLapel');mesh.from_pydata(points,[],[(0,1,2,3)]);o=bpy.data.objects.new('TailoredLapel',mesh);scene.collection.objects.link(o);bpy.context.view_layer.objects.active=o;finish(o,'TailoredLapel',linen,variant=variant)
 rod('LapelEdge',points[2],points[3],.006,silver,variant=variant)
rod('ZipLine',(0,-.186,1.04),(0,-.187,1.28),.007,silver,variant=variant)
uv('ZipPull',(0,-.194,1.275),(.013,.008,.026),silver,variant=variant)
curve('PocketStitch',[(.11,-.176,1.22),(.11,-.181,1.12),(.20,-.139,1.12),(.20,-.144,1.22)],.006,linen,variant=variant)
for angle in [-.65,.65]:
 o=torus('OrbitalBrooch',(-.12,-.188,1.255),.040,.004,silver,variant=variant,scale=(1,.50,1),rotation=(math.pi/2,0,angle))
uv('BroochCenter',(-.12,-.20,1.255),(.009,.009,.009),ink,variant=variant)
rod('WristTracker',(-.38,-.115,1.015),(-.38,-.145,.985),.068,ink,'Forearm.L',variant)
uv('TrackerFace',(-.38,-.198,1.013),(.025,.01,.025),linen,'Forearm.L',variant)

# Named, editable armature; rigid weights preserve the toy-like silhouette at joints.
bpy.ops.object.select_all(action='DESELECT')
arm=bpy.data.armatures.new('Lulu_Skeleton');rig=bpy.data.objects.new('Lulu_Rig',arm);scene.collection.objects.link(rig);bpy.context.view_layer.objects.active=rig;rig.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bones=[('Root',(0,0,0),(0,0,.2),None),('Spine',(0,0,.9),(0,0,1.4),'Root'),('Head',(0,0,1.45),(0,0,1.95),'Spine')]
for side,x in [('L',-.16),('R',.16)]:bones.extend([('Thigh.'+side,(x,0,.89),(x,-.005,.51),'Root'),('Shin.'+side,(x,-.005,.51),(x,0,.17),'Thigh.'+side),('Foot.'+side,(x,0,.17),(x,-.18,.08),'Shin.'+side)])
bones.extend([('UpperArm.L',(-.26,0,1.35),(-.38,-.01,1.09),'Spine'),('Forearm.L',(-.38,-.01,1.09),(-.38,-.16,.97),'UpperArm.L'),('UpperArm.R',(.26,0,1.35),(.40,-.12,1.13),'Spine'),('Forearm.R',(.40,-.12,1.13),(.372,-.44,.727),'UpperArm.R')])
bones.extend([('Hand.L',(-.38,-.16,.97),(-.38,-.22,.94),'Forearm.L'),('Hand.R',(.372,-.44,.727),(.417,-.47,.781),'Forearm.R')])
for name,head,tail,parent in bones:
 b=arm.edit_bones.new(name);b.head=head;b.tail=tail
 if parent:b.parent=arm.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
for o in parts:
 if not o.vertex_groups:
  vg=o.vertex_groups.new(name=o['bone']);vg.add(list(range(len(o.data.vertices))),1,'REPLACE')
 o.parent=rig;modifier=o.modifiers.new('Lulu_Armature','ARMATURE');modifier.object=rig
# Join by variant: three skinned drawables, shared skeleton and body.
meshes=[]
groups={v:[o for o in parts if o['variant']==v] for v in ['Body','Humanities','Technology']}
for variant in ['Body','Humanities','Technology']:
 bpy.ops.object.select_all(action='DESELECT');group=groups[variant]
 for o in group:o.select_set(True)
 bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join();o=bpy.context.object;o.name='Lulu_'+variant;meshes.append(o)
rig.animation_data_create()
for name,last in [('Idle',49),('Ready',49),('Run',25),('Shuffle',25),('Swing',25)]:
 rig.animation_data.action=None
 for frame_i in range(1,last+1,2):
  t=(frame_i-1)/(last-1);scene.frame_set(frame_i)
  for b in rig.pose.bones:b.rotation_mode='XYZ';b.rotation_euler=(0,0,0);b.location=(0,0,0)
  pb=rig.pose.bones
  if name in ['Idle','Ready']:
   pb['Spine'].rotation_euler.x=.018*math.sin(t*2*math.pi)
   if name=='Ready':
    pb['UpperArm.L'].rotation_euler.x=-.12;pb['Thigh.L'].rotation_euler.x=.055;pb['Thigh.R'].rotation_euler.x=-.055
  elif name=='Run':
   wave=math.sin(t*2*math.pi)
   pb['Thigh.L'].rotation_euler.x=.46*wave;pb['Thigh.R'].rotation_euler.x=-.46*wave
   pb['Shin.L'].rotation_euler.x=-max(0,-wave)*.65;pb['Shin.R'].rotation_euler.x=-max(0,wave)*.65
   pb['UpperArm.L'].rotation_euler.x=-.34*wave;pb['UpperArm.R'].rotation_euler.x=.12*wave
   pb['Foot.L'].rotation_euler.x=-.20*wave;pb['Foot.R'].rotation_euler.x=.20*wave
   pb['Hand.R'].rotation_euler.z=.05*wave
   pb['Root'].location.z=.012*(1-math.cos(t*4*math.pi));pb['Spine'].rotation_euler.x=.07
  elif name=='Shuffle':
   wave=math.sin(t*2*math.pi)
   pb['Thigh.L'].rotation_euler.z=.18*wave;pb['Thigh.R'].rotation_euler.z=.18*wave
   pb['Thigh.L'].rotation_euler.x=.12+max(0,wave)*.14;pb['Thigh.R'].rotation_euler.x=.12+max(0,-wave)*.14
   pb['Shin.L'].rotation_euler.x=-.16-max(0,wave)*.20;pb['Shin.R'].rotation_euler.x=-.16-max(0,-wave)*.20
   pb['Foot.L'].rotation_euler.x=.04+max(0,wave)*.06;pb['Foot.R'].rotation_euler.x=.04+max(0,-wave)*.06
   pb['Root'].location.z=.008*(1-math.cos(t*4*math.pi))
   pb['UpperArm.L'].rotation_euler.x=-.14;pb['UpperArm.R'].rotation_euler.x=-.05
  else:
   # Neutral at t=.5: exact sweet-spot contact. Wind-up and follow-through on either side.
   angle=.85*math.sin(2*math.pi*t)
   wrist=.22*math.sin(2*math.pi*t)
   pb['Hand.R'].rotation_euler.z=wrist
   pb['UpperArm.R'].rotation_euler.y=angle;pb['Forearm.R'].rotation_euler.y=angle*.45;pb['Spine'].rotation_euler.y=angle*.24;pb['UpperArm.L'].rotation_euler.x=-abs(angle)*.18
  for b in pb:
   b.keyframe_insert(data_path='rotation_euler',frame=frame_i,group=b.name);b.keyframe_insert(data_path='location',frame=frame_i,group=b.name)
 action=rig.animation_data.action;action.name=name;action.use_fake_user=True
 track=rig.animation_data.nla_tracks.new();track.name=name;strip=track.strips.new(name,1,action);track.mute=True
rig.animation_data.action=None
for b in rig.pose.bones:b.rotation_euler=(0,0,0);b.location=(0,0,0)
scene.frame_set(1);scene.frame_end=49
bpy.context.view_layer.update()
anchor=bpy.data.objects.new('Racket_Contact',None);scene.collection.objects.link(anchor);anchor.parent=rig;anchor.parent_type='BONE';anchor.parent_bone='Hand.R';bpy.context.view_layer.update();anchor.matrix_world=Matrix.Translation(CENTER)
bpy.ops.object.select_all(action='DESELECT');rig.select_set(True);anchor.select_set(True)
for o in meshes:o.select_set(True)
bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.gltf(filepath=str(OUT/'lulu.glb'),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='NLA_TRACKS',export_force_sampling=True,export_anim_slide_to_zero=True,export_materials='EXPORT',export_yup=True)
# Studio preview, excluded from export. Clothing visibility is editable in the source.
meshes[1].hide_render=True;meshes[1].hide_set(True)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.025));floor=bpy.context.object;floor.name='Preview_Floor';floor.data.materials.append(mat('Preview_Background','e7eee9'))
bpy.ops.object.camera_add(location=(3.5,-6,3.1));camera=bpy.context.object;camera.name='Preview_Camera';camera.rotation_euler=(Vector((0,0,1.05))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=2.65;scene.camera=camera
for loc,power,size in [((-3,-4,6),450,4),((4,1,5),350,3)]:
 bpy.ops.object.light_add(type='AREA',location=loc);light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(Vector((0,0,1))-light.location).to_track_quat('-Z','Y').to_euler()
scene.world.color=(.45,.45,.45);scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=24;scene.render.resolution_x=540;scene.render.resolution_y=640;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
bpy.ops.wm.save_as_mainfile(filepath=str(Path(__file__).parent/'lulu.blend'))
for variant in ['Technology','Humanities']:
 for o in meshes[1:]:o.hide_render=o.name!='Lulu_'+variant;o.hide_set(o.hide_render)
 scene.render.filepath=str(Path(__file__).parent/f'lulu-{variant.lower()}.png');bpy.ops.render.render(write_still=True)
print('LULU_DONE',OUT/'lulu.glb')
