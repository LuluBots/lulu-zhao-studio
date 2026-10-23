import { useMemo } from 'react';
import { Color } from 'three';
export default function Atmosphere({night=false}:{night?:boolean}){
 // Screen-space color layering stays visible in an orthographic, freely orbiting view.
 const uniforms=useMemo(()=>({upper:{value:new Color(night?'#111c38':'#99bfdc')},middle:{value:new Color(night?'#485277':'#dfdfdf')},lower:{value:new Color(night?'#958399':'#f6e4d0')},glow:{value:new Color(night?'#8497bd':'#fff1d9')}}),[night]);
 return <><fog attach="fog" args={[night?'#68718e':'#e1dce0',48,105]}/><group name={night?'Moonlit_Sky':'Daylight_Sky'}>
 <mesh renderOrder={-1000} frustumCulled={false}>
 <planeGeometry args={[2,2]}/><shaderMaterial depthWrite={false} depthTest={false} toneMapped={false} uniforms={uniforms}
 vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,1.,1.);}`}
 fragmentShader={`varying vec2 vUv;uniform vec3 upper;uniform vec3 middle;uniform vec3 lower;uniform vec3 glow;
 void main(){float h=vUv.y;vec3 c=mix(lower,middle,smoothstep(0.,.57,h));c=mix(c,upper,smoothstep(.35,1.,h));float halo=exp(-10.*length((vUv-vec2(.19,.57))*vec2(.8,1.)));c=mix(c,glow,halo*.24);gl_FragColor=vec4(c,1.);
 #include <colorspace_fragment>
 }`}/></mesh>
 {night&&<><mesh position={[-14,9,-10]}><sphereGeometry args={[.85,24,16]}/><meshBasicMaterial color="#f6efdc"/></mesh>{Array.from({length:90},(_,i)=><mesh key={i} position={[Math.sin(i*2.399)*(23+i%8),-12+(i%19)*2.4,Math.cos(i*2.399)*(23+i%8)]}><sphereGeometry args={[i%7===0?.10:.055,6,4]}/><meshBasicMaterial color="#d7e2f1"/></mesh>)}</>}

 </group></>;
}
