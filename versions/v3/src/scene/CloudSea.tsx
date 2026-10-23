import {useMemo} from 'react';
import {useFrame} from '@react-three/fiber';
import {Color,Vector2,Vector3} from 'three';
// A real world-space density field: views through the cloud bank change with the camera.
// No sky photographs or giant opaque cloud meshes. Static noise avoids visual flicker.
export default function CloudSea({night}:{night:boolean}){
 const uniforms=useMemo(()=>({rayDirection:{value:new Vector3(0,-1,0)},resolution:{value:new Vector2(1,1)},lit:{value:new Color(night?'#a5b5d7':'#fff3df')},shade:{value:new Color(night?'#465778':'#8faac6')}}),[night]);
 useFrame(({camera,gl})=>{camera.getWorldDirection(uniforms.rayDirection.value);gl.getDrawingBufferSize(uniforms.resolution.value)});
 return <mesh name="Volumetric_Cloud_Sea" position={[0,-9,0]} renderOrder={-20} frustumCulled={false}>
 <boxGeometry args={[150,14,150]}/><shaderMaterial transparent depthWrite={false} uniforms={uniforms}
 vertexShader={`varying vec3 worldPoint;void main(){vec4 p=modelMatrix*vec4(position,1.);worldPoint=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`}
 fragmentShader={`precision highp float;varying vec3 worldPoint;uniform vec3 rayDirection;uniform vec2 resolution;uniform vec3 lit;uniform vec3 shade;
 float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
 float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float field(vec3 p){vec3 q=p*vec3(.14,.22,.14);float n=noise3(q)*.68+noise3(q*2.17+7.3)*.24+noise3(q*4.1)*.08;float ceiling=-3.0-2.8*noise3(vec3(p.x*.06,8.,p.z*.06));float edge=(1.-smoothstep(ceiling-2.5,ceiling,p.y))*smoothstep(-16.,-12.,p.y);return smoothstep(.48,.72,n)*edge*(1.-smoothstep(45.,73.,max(abs(p.x),abs(p.z))));}
 void main(){vec3 d=normalize(rayDirection),p=worldPoint+d*.002;vec3 boundary=mix(vec3(-75.,-16.,-75.),vec3(75.,-2.,75.),step(vec3(0.),d));vec3 distances=(boundary-p)/(d+vec3(.000001));float farT=min(distances.x,min(distances.y,distances.z));float stepSize=min(1.2,max(.05,farT/28.));vec4 sum=vec4(0.);
 for(int i=0;i<28;i++){float den=field(p);if(den>.005){float above=field(p+vec3(-.6,1.1,.3));float lighting=clamp(.40+(den-above)*2.4,0.,1.);vec3 col=mix(shade,lit,lighting);float a=1.-exp(-den*stepSize*1.8);sum.rgb+=(1.-sum.a)*col*a;sum.a+=(1.-sum.a)*a;if(sum.a>.985)break;}p+=d*stepSize;}
 if(sum.a<.005)discard;float skyFade=1.-smoothstep(.60,1.,gl_FragCoord.y/resolution.y);gl_FragColor=vec4(sum.rgb/max(sum.a,.001),sum.a*.85*skyFade*smoothstep(.12,.30,gl_FragCoord.y/resolution.y));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`}/></mesh>
}
