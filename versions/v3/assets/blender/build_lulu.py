"""Rebuild Lulu: Blender 5.2, meters, Z-up source / Y-up GLB, Quaternius CC0 head / hair adaptation.
Run: Blender -b --factory-startup --python assets/blender/build_lulu.py
"""
import bpy, math, json, bmesh
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
skin=mat('Skin_WarmPeach','eed1bb');hair=mat('Hair_Cocoa','302923');eye=mat('Eyes','302c2b');shoe=mat('Shoes_Ivory','f4f0df');sole=mat('Soles_Sage','9ca99c');string=mat('Strings','c7d2c4');frame=mat('Racket_Sage','789b92');grip=mat('Grip_Cream','e7d9b4');cream=mat('Humanities_Cream','f3ecdd');leaf=mat('Humanities_Leaf','8eaa85');navy=mat('Technology_ScholarBlue','294556');blue=mat('Technology_Ice','92b7b4')
rose=mat('Humanities_DustyRose','c78b99');gold=mat('Humanities_Champagne','c6ad7b');dark=mat('Technology_Graphite','26303f');pink=mat('Technology_Orchid','e88bc2');glow=mat('Technology_CircuitLight','7aebdf')
bs=glow.node_tree.nodes.get('Principled BSDF');bs.inputs['Emission Color'].default_value=(.12,.7,.58,1);bs.inputs['Emission Strength'].default_value=.12
silver=mat('Scientist_Titanium','aabdc5',.38);linen=mat('Scientist_Linen','e2e8e5');hairline=mat('Hair_Highlight','665044');blush=mat('Cheek_Rose','cf9d8b');ink=mat('Stitch_Ink','607e89')
# Separate fabric, skin, satin hair and anodized metal instead of a uniform matte finish.
for material,roughness,metallic in [(skin,.5,0),(hair,.48,0),(shoe,.65,0),(sole,.88,0),(frame,.3,.35),(gold,.28,.6),(silver,.27,.65),(cream,.76,0),(navy,.72,0),(rose,.58,0)]:
 node=material.node_tree.nodes.get('Principled BSDF');node.inputs['Roughness'].default_value=roughness;node.inputs['Metallic'].default_value=metallic
parts=[]
def finish(obj,name,material,bone='Spine',variant='Body'):
 obj.name=f'{variant}_{name}'; obj.data.materials.clear();obj.data.materials.append(material)
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 for f in obj.data.polygons:f.use_smooth=len(f.vertices)<=4
 obj['bone']=bone;obj['variant']=variant;parts.append(obj);return obj

def uv(name,loc,scale,material,bone='Spine',variant='Body',segments=20,rings=12):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc)
 o=bpy.context.object;o.scale=scale;return finish(o,name,material,bone,variant)

def rod(name,a,b,r,material,bone='Spine',variant='Body',r2=None):
 mid=(Vector(a)+Vector(b))/2;d=Vector(b)-Vector(a)
 bpy.ops.mesh.primitive_cone_add(vertices=12,radius1=r,radius2=r if r2 is None else r2,depth=d.length,location=mid)
 o=bpy.context.object;o.rotation_euler=d.to_track_quat('Z','Y').to_euler();return finish(o,name,material,bone,variant)

def torus(name,loc,major,minor,material,bone='Head',variant='Body',scale=(1,1,1),rotation=(0,0,0)):
 bpy.ops.mesh.primitive_torus_add(major_segments=36,minor_segments=8,location=loc,major_radius=major,minor_radius=minor,rotation=rotation)
 o=bpy.context.object;o.scale=scale;return finish(o,name,material,bone,variant)


def curve(name,points,radius,material,bone='Head',variant='Body',closed=False):
 data=bpy.data.curves.new(name,'CURVE');data.dimensions='3D';data.bevel_depth=radius;data.bevel_resolution=1
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
 sub=o.modifiers.new('Continuous elbows and knees','SUBSURF');sub.levels=1;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=sub.name)

# One body and one skeleton, shared by both outfits. Front is -Y.
# Torso is represented by the continuous closed garment; no intersecting skin shell.
rod('Neck',(0,0,1.37),(0,0,1.59),.073,skin)
# Designed facial topology: chin, jaw, cheek and forehead loops rather than a sphere.
verts=[];faces=[]
for z,rx,depth,cy in [(1.455,.035,.045,-.035),(1.48,.105,.12,-.015),(1.53,.19,.175,0),(1.61,.25,.215,0),(1.70,.277,.235,0),(1.80,.278,.235,.005),(1.90,.26,.225,.01),(1.98,.20,.18,.01),(2.025,.105,.10,.01),(2.04,.004,.004,.01)]:
 for j in range(48):
  a=j*math.tau/48;front=max(0,-math.sin(a));verts.append((rx*math.cos(a),cy+depth*math.sin(a)-.008*front**8,z))
for i in range(9):
 for j in range(48):k=i*48+j;n=i*48+(j+1)%48;faces.append((k,n,n+48,k+48))
mesh=bpy.data.meshes.new('Face_continuous_loops');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('Face',mesh);scene.collection.objects.link(o);finish(o,'SculptedFace',skin,'Head')
bpy.context.view_layer.objects.active=o
sub=o.modifiers.new('Soft facial planes','SUBSURF');sub.levels=2;bpy.ops.object.modifier_apply(modifier=sub.name)
white=mat('Eyes_SoftIvory','f5e8d9',.4);iris=mat('Iris_Hazel','675343',.32);lip=mat('Lips_Rosewood','ae7771',.62)
for sign in [-1,1]:
 x=sign*.105
 uv('Ear',(sign*.272,.005,1.70),(.036,.044,.059),skin,'Head')
 uv('EarInset',(sign*.29,-.018,1.70),(.013,.013,.032),blush,'Head')
 # Tapered almond eye boundary, curved over the face; subtle inset iris.
 uv('EyeWhite',(x,-.225,1.755),(.057,.015,.026),white,'Head',segments=24,rings=12)
 uv('Iris',(x,-.240,1.755),(.019,.005,.022),iris,'Head')
 uv('Pupil',(x,-.245,1.756),(.010,.003,.015),eye,'Head')
 uv('Catchlight',(x-.005,-.248,1.765),(.005,.002,.005),white,'Head',segments=12,rings=8)
 curve('UpperLid',[(x-.056+i*.112/16,-.227-.012*math.sin(math.pi*i/16),1.755+.025*math.sin(math.pi*i/16)) for i in range(17)],.0045,hair,'Head')
 curve('Brow',[(x-.05+i*.10/12,-.222,1.814+.013*math.sin(math.pi*i/12)) for i in range(13)],.006,hair,'Head')
uv('NoseBridge',(0,-.233,1.716),(.019,.020,.051),skin,'Head')
uv('NoseTip',(0,-.252,1.679),(.027,.023,.019),skin,'Head')
curve('Mouth',[(-.043,-.211,1.61),(-.022,-.220,1.611),(0,-.224,1.606),(.022,-.220,1.611),(.043,-.211,1.615)],.004,lip,'Head')
uv('LowerLip',(0,-.218,1.598),(.025,.006,.007),lip,'Head')
# Coherent cap and large, tapered swept locks; no noodle-like parallel strands.
for variant in ['Humanities','Technology']:
 verts=[];faces=[]
 for j in range(13):
  for i in range(48):
   phi=math.tau*i/48;front=max(0,-math.sin(phi));theta=(2.08-.94*front)*j/12
   verts.append((.310*math.sin(theta)*math.cos(phi),.275*math.sin(theta)*math.sin(phi)+.016,1.765+.315*math.cos(theta)))
 for j in range(12):
  for i in range(48):k=j*48+i;n=j*48+(i+1)%48;faces.append((k,n,n+48,k+48))
 mesh=bpy.data.meshes.new('SculptedHairCap');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('HairCap',mesh);scene.collection.objects.link(o);finish(o,'HairCap',hair,'Head',variant)
 bpy.context.view_layer.objects.active=o;sub=o.modifiers.new('Hair silhouette smoothing','SUBSURF');sub.levels=1;bpy.ops.object.modifier_apply(modifier=sub.name)
 lock('MainSideSweep',[(.12,-.12,2.035),(-.04,-.265,2.003),(-.21,-.275,1.915),(-.268,-.15,1.79)],.087,variant)
 lock('PartSweep',[(.15,-.10,2.028),(.225,-.245,1.96),(.278,-.16,1.85),(.276,-.06,1.77)],.065,variant)
 if variant=='Humanities':
  # Gathered low ponytail: broad upper mass, narrower changing silhouette at tip.
  uv('PonyRoot',(0,.246,1.69),(.12,.115,.16),hair,'Head',variant)
  lock('LowPonytail',[(0,.25,1.78),(.035,.34,1.61),(.08,.33,1.39),(.13,.27,1.30)],.125,variant)
  lock('PonySide',[(.04,.28,1.76),(-.065,.32,1.58),(-.045,.29,1.40),(.045,.29,1.33)],.072,variant)
  lock('FaceFraming', [(-.26,-.08,1.91),(-.278,-.14,1.77),(-.265,-.14,1.62),(-.23,-.08,1.57)],.027,variant)
  for sign in [-1,1]:
   o=uv('SilkHairRibbon',(sign*.065,.35,1.70),(.069,.018,.032),rose,'Head',variant);o.rotation_euler.y=sign*.25
  curve('RibbonTail',[(.02,.36,1.69),(.06,.37,1.57),(.04,.35,1.51)],.012,rose,'Head',variant)
 else:
  uv('TuckedBun',(0,.245,1.94),(.123,.105,.115),hair,'Head',variant,segments=28,rings=18)
  curve('BunFold',[(-.085,.27,2.015),(-.04,.342,1.995),(.055,.335,1.94),(.085,.285,1.88)],.008,hairline,'Head',variant)
  rod('MinimalHairClip',(.21,-.14,1.90),(.252,-.105,1.85),.007,silver,'Head',variant)
for side,x in [('L',-.16),('R',.16)]:
 flexible_limb('Leg'+side,(x,0,.89),(x,-.005,.51),(x,0,.17),(.103,.083,.063),('Thigh.'+side,'Shin.'+side))
 rod('Sock'+side,(x,0,.125),(x,0,.175),.065,shoe,'Foot.'+side)
 # Tennis shoe with broad toe box, shaped midsole and textile vamp.
 for label,levels,material in [('Upper',[(.045,1),(.075,1),(.095,.94),(.12,.79),(.135,.52),(.138,.12)],shoe),('Midsole',[(.012,1.035),(.037,1.035),(.052,1.0)],cream),('Outsole',[(.005,1.01),(.018,1.04)],sole)]:
  verts=[];faces=[];n=48
  for z,sz in levels:
   for j in range(n):
    a=j*math.tau/n;co=math.cos(a);si=math.sin(a)
    px=math.copysign(abs(co)**.72,co)*.107*sz
    py=-.06+math.copysign(abs(si)**.75,si)*.17*sz
    verts.append((x+px,py,z-(.025*max(0,-(py+.06)/.17) if label=='Upper' else 0)))
  for row in range(len(levels)-1):
   for j in range(n):k=row*n+j;nx=row*n+(j+1)%n;faces.append((k,nx,nx+n,k+n))
  faces.extend([tuple(range(n-1,-1,-1)),tuple(range((len(levels)-1)*n,len(levels)*n))])
  mesh=bpy.data.meshes.new(label+side);mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new(label+side,mesh);scene.collection.objects.link(o);finish(o,label+side,material,'Foot.'+side)
  bpy.context.view_layer.objects.active=o;sub=o.modifiers.new('Shoe last smoothing','SUBSURF');sub.levels=1;bpy.ops.object.modifier_apply(modifier=sub.name)
 torus('AnkleCollar'+side,(x,.015,.132),.063,.009,shoe,'Foot.'+side,scale=(1,.85,1))
 # Raised tongue and three pairs of eyelets, actual crossed laces.
 uv('Tongue'+side,(x,-.045,.132),(.044,.092,.014),cream,'Foot.'+side)
 for i,y in enumerate([-.11,-.072,-.034]):
  for sign in [-1,1]:
   uv('Eyelet'+side,(x+sign*.041,y,.139),(.006,.007,.004),sole,'Foot.'+side,segments=8,rings=6)
   rod('Lace'+side,(x+sign*.039,y,.145),(x-sign*.039,y+.027,.146),.0028,string,'Foot.'+side)
 curve('ShoeQuarter'+side,[(x+.101,-.13,.085),(x+.104,-.04,.12),(x+.086,.065,.12)],.004,frame,'Foot.'+side)
 uv('HeelTab'+side,(x,.091,.105),(.043,.014,.024),frame,'Foot.'+side)
for side,a,b,c in [('L',(-.26,0,1.35),(-.38,-.01,1.09),(-.38,-.16,.97)),('R',(.26,0,1.35),(.40,-.12,1.13),(.372,-.44,.727))]:
 flexible_limb('Arm'+side,a,b,c,(.079,.068,.048),('UpperArm.'+side,'Forearm.'+side))
 uv('Hand'+side,c,(.049,.035,.054),skin,'Hand.'+side)
 if side=='L':
  for i in range(4):
   x=c[0]-.026+i*.017
   length=[.054,.066,.062,.045][i]
   curve('FingerL'+str(i),[(x,c[1]-.008,c[2]-.023),(x,c[1]-.014,c[2]-.043),(x,c[1]-.030,c[2]-.023-length),(x,c[1]-.040,c[2]-.020-length)],.008,skin,'Hand.L')
  curve('ThumbL',[(c[0]+.034,c[1]-.006,c[2]+.008),(c[0]+.052,c[1]-.023,c[2]-.018),(c[0]+.046,c[1]-.039,c[2]-.038)],.011,skin,'Hand.L')
# Engineered racket: elliptical hoop, open Y-throat, wrapped grip, real chord lengths.
CENTER=Vector((.75,-.47,1.18));U=Vector((.64,0,.7684)).normalized();V=Vector((U.z,0,-U.x))
def racketpoint(u,v=0,depth=0):return CENTER+U*u+V*v+Vector((0,depth,0))
rod('GripCore',racketpoint(-.75),racketpoint(-.43),.027,grip,'Hand.R')
# A continuous helical overgrip with overlap, not independent rings.
curve('HelicalOvergrip',[racketpoint(-.74+.30*i/240)+V*(math.cos(i/240*math.tau*11)*.028)+Vector((0,math.sin(i/240*math.tau*11)*.028,0)) for i in range(241)],.0022,shoe,'Hand.R')
rod('ButtCap',racketpoint(-.77),racketpoint(-.735),.035,grip,'Hand.R')
for sign in [-1,1]:rod('OpenThroat',racketpoint(-.43),racketpoint(-.244,sign*.095),.013,frame,'Hand.R')
for value in [-.16,-.12,-.08,-.04,0,.04,.08,.12,.16]:
 half=.275*math.sqrt(1-(value/.205)**2)
 rod('MainString',racketpoint(-half,value,-.002),racketpoint(half,value,-.002),.0028,string,'Hand.R')
for value in [-.22,-.176,-.132,-.088,-.044,0,.044,.088,.132,.176,.22]:
 half=.205*math.sqrt(1-(value/.275)**2)
 rod('CrossString',racketpoint(value,-half,.002),racketpoint(value,half,.002),.0028,string,'Hand.R')
for i in range(4):
 point=racketpoint(-.635+i*.022)
 curve('GripFinger',[point+V*(math.cos(a)*.035)+Vector((0,math.sin(a)*.035,0)) for a in [math.pi*(.05+j*.12) for j in range(8)]],.010,skin,'Hand.R')
uv('Thumb',racketpoint(-.55, -.018, -.030),(.023,.024,.039),skin,'Hand.R')
for variant,material in [('Humanities',rose),('Technology',silver)]:
 curve('RacketHoop',[racketpoint(.275*math.cos(a),.205*math.sin(a)) for a in [j*math.tau/64 for j in range(64)]],.019,material,'Hand.R',variant,True)
 curve('RimInlay',[racketpoint(.285*math.cos(a),.215*math.sin(a),-.014) for a in [j*math.tau/64 for j in range(64)]],.004,gold if variant=='Humanities' else ink,'Hand.R',variant,True)
# Bumper strip, drilled grommet seats, and the throat bridge are real geometry.
curve('ProtectiveBumper',[racketpoint(.282*math.cos(a),.212*math.sin(a),.006) for a in [(-math.pi/2+j*math.pi/40) for j in range(41)]],.009,frame,'Hand.R')
# The lower ellipse is the bridge; no bar crosses the string bed.
for i in range(32):
 a=i*math.tau/32
 uv('StringGrommet',racketpoint(.274*math.cos(a),.204*math.sin(a),-.016),(.006,.006,.006),dark,'Hand.R',segments=8,rings=6)
# Same garment topology, alternate palette and small original motifs.
for variant,cloth,accent in [('Humanities',cream,leaf),('Technology',navy,blue)]:
 # Tailored torso rings give a waist, shoulder line and actual armhole silhouette.
 verts=[];faces=[]
 for z,rx,ry in [(1.0,.224,.145),(1.08,.208,.143),(1.22,.243,.164),(1.34,.245,.15),(1.41,.102,.085)]:
  for i in range(32):
   a=i*math.tau/32;verts.append((rx*math.cos(a),ry*math.sin(a),z))
 for j in range(4):
  for i in range(32):k=j*32+i;n=j*32+(i+1)%32;faces.append((k,n,n+32,k+32))
 mesh=bpy.data.meshes.new('TailoredPolo');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('TailoredPolo',mesh);scene.collection.objects.link(o);finish(o,'TailoredPolo',cloth,variant=variant)
 # Keep seams integrated into the fabric silhouette, with no floating piping.
 for sign in [-1,1]:
  uv('CapSleeve',(sign*.245,0,1.335),(.092,.080,.093),cloth,'UpperArm.'+('R' if sign>0 else 'L'),variant)

 # Four rings, crisp folded panels and an open double-sided hem.
 verts=[];faces=[]
 for row,(z,r) in enumerate([(1.0,.224),(.94,.25),(.84,.277),(.75,.302)]):
  for i in range(48):
   angle=math.tau*i/48;fold=[1,.89,1.065,1.05][i%4];rr=r*(1+(fold-1)*row/3)
   verts.append((rr*math.cos(angle),rr*.65*math.sin(angle),z))
 for row in range(3):
  for i in range(48):k=row*48+i;n=row*48+(i+1)%48;faces.append((k,n,n+48,k+48))
 mesh=bpy.data.meshes.new(variant+'Skirt');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('Skirt',mesh);scene.collection.objects.link(o);finish(o,'Skirt',cloth,variant=variant)
 for polygon in o.data.polygons:polygon.use_smooth=False
 solid=o.modifiers.new('Turned cloth hem','SOLIDIFY');solid.thickness=.006;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=solid.name)
 curve('HemBinding',[(.302*[1,.89,1.065,1.05][i%4]*math.cos(i*math.tau/48),.302*.65*[1,.89,1.065,1.05][i%4]*math.sin(i*math.tau/48),.751) for i in range(48)],.0035,accent,variant=variant,closed=True)
 torus('Waist',(0,0,1.0),.226,.008,accent,variant=variant,scale=(1,.65,1))
 # Bound neckline and armhole, all in the same fabric construction language.
 curve('NeckBinding',[(.102*math.cos(a),.085*math.sin(a),1.407) for a in [j*math.tau/48 for j in range(48)]],.005,rose if variant=='Humanities' else blue,variant=variant,closed=True)
 if variant=='Humanities':
  curve('EmbroideredStem',[(-.09,-.163,1.25),(-.095,-.161,1.28),(-.08,-.151,1.31)],.002,leaf,variant=variant)
  for x,z in [(-.09,1.27),(-.08,1.30)]:
   curve('EmbroideredLeaf',[(x,-.164,z),(x-.016,-.163,z+.012),(x-.018,-.160,z+.026),(x,-.164,z)],.002,leaf,variant=variant)
 else:
  # One diagonal ice-blue shoulder inset instead of lab-coat lapels and gadgets.
  points=[(-.18,-.105,1.37),(-.10,-.075,1.40),(.19,-.110,1.32),(.22,-.103,1.27)]
  mesh=bpy.data.meshes.new('SportInset');mesh.from_pydata(points,[],[(0,1,2,3)]);o=bpy.data.objects.new('SportInset',mesh);scene.collection.objects.link(o);finish(o,'SportInset',blue,variant=variant)


# Athletic proportions, shared by both costumes. Apply the same map to skin and rig.
def proportion(p):
 x,y,z=p
 zz=z*1.12 if z<1.45 else 1.624+(z-1.45)*.72
 sx=.88 if z<1.45 else .72
 sy=.90 if z<1.45 else .78
 return Vector((x*sx,y*sy,zz))
# Racket stays rigid; preserve the attachment of fingers and grip.
hand_old=Vector((.372,-.44,.727));hand_new=proportion(hand_old)
def hand_map(p):return hand_new+(Vector(p)-hand_old)*.88
for o in parts:
 if 'SportInset' in o.name:
  bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.subdivide_edges(bm,edges=list(bm.edges),cuts=8,use_grid_fill=True);bm.to_mesh(o.data);bm.free()
 matrix=o.matrix_world.copy()
 for v in o.data.vertices:
  p=matrix@v.co
  if any(label in o.name for label in ['Embroidered','SportInset','TechnicalBinding']):
   rows=[(1.0,.224,.145),(1.08,.208,.143),(1.22,.243,.164),(1.34,.245,.15),(1.41,.102,.085)]
   for k in range(len(rows)-1):
    za,xa,ya=rows[k];zb,xb,yb=rows[k+1]
    if za<=p.z<=zb:
     t=(p.z-za)/(zb-za);rx=xa+(xb-xa)*t;ry=ya+(yb-ya)*t;p.y=-ry*math.sqrt(max(.02,1-(p.x/rx)**2))-.009;break
  v.co=hand_map(p) if o['bone']=='Hand.R' else proportion(p)
 o.matrix_world=Matrix.Identity(4)
CENTER=hand_map(CENTER)

# Actual CC0 game topology adopted from Quaternius (license bundled with source).
# Body proportions, racket and animation rig remain those of Lulu.
import bmesh
REFERENCE=ROOT/'assets/references/quaternius/Universal Base Characters[Standard]'
for old in list(parts):
 if any(label in old.name for label in ['Waist','HemBinding','NeckBinding','Embroidered','TechnicalBinding','SideSeam','ArmholeBinding']):old['bone']='Spine'
 if old['bone']=='Head':parts.remove(old);bpy.data.objects.remove(old,do_unlink=True)
def adopt(path,wanted,variant,cut=False):
 before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(REFERENCE/path));bpy.context.view_layer.update()
 new=set(bpy.data.objects)-before
 for obj in list(new):
  if obj.type!='MESH' or not any(obj.name.startswith(n) for n in wanted):continue
  world=obj.matrix_world.copy();obj.parent=None
  for v in obj.data.vertices:v.co=world@v.co
  obj.matrix_world=Matrix.Identity(4)
  for mod in list(obj.modifiers):obj.modifiers.remove(mod)
  if cut and obj.name.startswith('Superhero_Female'):
   bm=bmesh.new();bm.from_mesh(obj.data)
   cut_result=bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=.00001,plane_co=(0,0,1.55),plane_no=(0,0,1),clear_inner=True)
   boundary=[e for e in bm.edges if e.is_boundary and all(abs(v.co.z-1.55)<.0001 for v in e.verts)]
   if boundary:bmesh.ops.holes_fill(bm,edges=boundary,sides=0)
   bm.to_mesh(obj.data);bm.free()
  for v in obj.data.vertices:
   x,y,z=v.co
   if obj.name.startswith('Eyebrows'):
    z=1.664+(z-1.664)*.42+.004*math.sin(math.pi*min(1,abs(x)/.065))
   if obj.name.startswith('Superhero_Female') and y<-.04:
    z+=.005*math.exp(-((z-1.59)/.018)**2)*math.exp(-((abs(x)-.028)/.018)**2)
    y+=.008*math.exp(-(x/.022)**2-((z-1.625)/.025)**2)
   if obj.name.startswith('Superhero_Female'):
    x*=1-.14*max(0,1-abs(z-1.575)/.07)
   v.co=(x*1.75,y*1.65,1.61+(z-1.50)*1.65)
  
  for attr in list(obj.data.color_attributes):obj.data.color_attributes.remove(attr)
  if obj.data.uv_layers:
   active=obj.data.uv_layers.active
   for layer in list(obj.data.uv_layers):
    if layer!=active:obj.data.uv_layers.remove(layer)
   active.name='UVMap'
  obj.vertex_groups.clear();obj['bone']='Head';obj['variant']=variant;obj.name=variant+'_Quaternius_'+obj.name;parts.append(obj);new.remove(obj)
  for poly in obj.data.polygons:poly.use_smooth=True
  for material in obj.data.materials:
   if not material or not material.use_nodes:continue
   bs=material.node_tree.nodes.get('Principled BSDF')
   if bs:
    for socket in ['Metallic','Roughness']:
     for link in list(bs.inputs[socket].links):material.node_tree.links.remove(link)
    bs.inputs['Metallic'].default_value=0;bs.inputs['Roughness'].default_value=.56
    if 'Body' in obj.name:
     for link in list(bs.inputs['Normal'].links):material.node_tree.links.remove(link)
    colors=[n for n in material.node_tree.nodes if n.type=='TEX_IMAGE' and n.image and ('BaseColor' in n.image.name or 'Eye_Brown' in n.image.name)]
    if colors:
     if 'Hair' in material.name:
      mix=material.node_tree.nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=(.075,.038,.023,1)
      material.node_tree.links.new(colors[0].outputs['Color'],mix.inputs[1]);material.node_tree.links.new(mix.outputs[0],bs.inputs['Base Color'])
     else:material.node_tree.links.new(colors[0].outputs['Color'],bs.inputs['Base Color'])
   for node in material.node_tree.nodes:
    if node.type=='TEX_IMAGE' and node.image:
     if 'Female_Dark' in node.image.name:
      node.image=bpy.data.images.load(str(REFERENCE/'Base Characters/Textures/T_Superhero_Female_Light_BaseColor.png'),check_existing=True)
     image=node.image
     if image.size[0]>512:image.scale(512,512)
     if 'Normal' in image.name and image.size[0]>256:image.scale(256,256)
     if 'Female_Light_BaseColor' in image.name and not image.get('fair_skin'):
      pixels=list(image.pixels[:])
      for k in range(0,len(pixels),4):
       r,g,b=pixels[k:k+3]
       if r>g*1.04 and r>b*1.15:
        pixels[k]=min(1,r*.42+.53);pixels[k+1]=min(1,g*.42+.43);pixels[k+2]=min(1,b*.42+.36)
      image.pixels[:]=pixels;image['fair_skin']=True
     image.pack()
 for obj in new:
  if obj.name in bpy.data.objects:bpy.data.objects.remove(obj,do_unlink=True)
adopt(Path('Base Characters/Godot - UE/Superhero_Female_FullBody.gltf'),['Superhero_Female','Eyes','Eyebrows'],'Body',True)
adopt(Path('Hairstyles/Rigged to Head Bone/glTF (Godot -Unreal)/Hair_Long.gltf'),['Hair_Long'],'Humanities')
adopt(Path('Hairstyles/Rigged to Head Bone/glTF (Godot -Unreal)/Hair_Buns.gltf'),['Hair_Buns'],'Technology')


# Light eyewear adapted to the imported face, rather than floating over the old head.
for x in [-.057,.057]:
 curve('StudyFrames',[(x-.035,-.145,1.884),(x+.035,-.145,1.884),(x+.032,-.146,1.840),(x-.032,-.146,1.840)],.0026,silver,'Head','Technology',True)
rod('StudyBridge',(-.022,-.145,1.870),(.022,-.145,1.870),.0025,silver,'Head','Technology')
for sign in [-1,1]:
 curve('StudyTemple',[(sign*.092,-.145,1.876),(sign*.14,-.05,1.87),(sign*.145,.018,1.86)],.0024,silver,'Head','Technology')
 uv('PearlStud',(sign*.146,-.007,1.817),(.008,.007,.009),gold,'Head','Humanities',segments=12,rings=8)

# Named, editable armature; rigid weights preserve the toy-like silhouette at joints.
bpy.ops.object.select_all(action='DESELECT')
arm=bpy.data.armatures.new('Lulu_Skeleton');rig=bpy.data.objects.new('Lulu_Rig',arm);scene.collection.objects.link(rig);bpy.context.view_layer.objects.active=rig;rig.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bones=[('Root',(0,0,0),(0,0,.2),None),('Spine',(0,0,.9),(0,0,1.4),'Root'),('Head',(0,0,1.45),(0,0,1.95),'Spine')]
for side,x in [('L',-.16),('R',.16)]:bones.extend([('Thigh.'+side,(x,0,.89),(x,-.005,.51),'Root'),('Shin.'+side,(x,-.005,.51),(x,0,.17),'Thigh.'+side),('Foot.'+side,(x,0,.17),(x,-.18,.08),'Shin.'+side)])
bones.extend([('UpperArm.L',(-.26,0,1.35),(-.38,-.01,1.09),'Spine'),('Forearm.L',(-.38,-.01,1.09),(-.38,-.16,.97),'UpperArm.L'),('UpperArm.R',(.26,0,1.35),(.40,-.12,1.13),'Spine'),('Forearm.R',(.40,-.12,1.13),(.372,-.44,.727),'UpperArm.R')])
bones.extend([('Hand.L',(-.38,-.16,.97),(-.38,-.22,.94),'Forearm.L'),('Hand.R',(.372,-.44,.727),(.417,-.47,.781),'Forearm.R')])
for name,head,tail,parent in bones:
 b=arm.edit_bones.new(name);b.head=proportion(head);b.tail=proportion(tail)
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
# Encode the hair tint as a standard glTF base-color factor; custom Mix nodes
# do not survive all Blender exporter versions. Geometry and texture data are unchanged.
import struct
path=OUT/'lulu.glb';blob=path.read_bytes();size=struct.unpack_from('<I',blob,12)[0]
doc=json.loads(blob[20:20+size]);binary=blob[20+size:]
for material in doc.get('materials',[]):
 if material.get('name','').startswith('MI_Hair'):
  material.setdefault('pbrMetallicRoughness',{})['baseColorFactor']=[.075,.038,.023,1]
packed=json.dumps(doc,separators=(',',':')).encode();packed+=b' '*((-len(packed))%4)
path.write_bytes(struct.pack('<4sII',b'glTF',2,20+len(packed)+len(binary))+struct.pack('<I4s',len(packed),b'JSON')+packed+binary)

# Studio preview, excluded from export. Clothing visibility is editable in the source.
meshes[1].hide_render=True;meshes[1].hide_set(True)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.025));floor=bpy.context.object;floor.name='Preview_Floor';floor.data.materials.append(mat('Preview_Background','e7eee9'))
bpy.ops.object.camera_add(location=(3.5,-6,3.1));camera=bpy.context.object;camera.name='Preview_Camera';camera.rotation_euler=(Vector((0,0,1.05))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=2.65;scene.camera=camera
for loc,power,size in [((-3,-4,6),450,4),((4,1,5),350,3)]:
 bpy.ops.object.light_add(type='AREA',location=loc);light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(Vector((0,0,1))-light.location).to_track_quat('-Z','Y').to_euler()
scene.world.color=(.45,.45,.45);scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=48;scene.render.resolution_x=810;scene.render.resolution_y=960;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
bpy.ops.wm.save_as_mainfile(filepath=str(Path(__file__).parent/'lulu.blend'))
for variant in ['Technology','Humanities']:
 for o in meshes[1:]:o.hide_render=o.name!='Lulu_'+variant;o.hide_set(o.hide_render)
 scene.render.filepath=str(Path(__file__).parent/f'lulu-{variant.lower()}.png');bpy.ops.render.render(write_still=True)
print('LULU_DONE',OUT/'lulu.glb')
