import { useMemo } from 'react';
import { Color } from 'three';
import {useThree} from '@react-three/fiber';
export default function Atmosphere({night=false}:{night?:boolean}){
 const {size}=useThree();
 // Screen-space color layering stays visible in an orthographic, freely orbiting view.
 const uniforms=useMemo(()=>({aspect:{value:size.width/size.height},moon:{value:night?1:0},upper:{value:new Color(night?'#111c38':'#99bfdc')},middle:{value:new Color(night?'#485277':'#dfdfdf')},lower:{value:new Color(night?'#958399':'#f6e4d0')},glow:{value:new Color(night?'#8497bd':'#fff1d9')}}),[night,size.width,size.height]);
 return <><fog attach="fog" args={[night?'#68718e':'#e1dce0',48,105]}/><group name={night?'Moonlit_Sky':'Daylight_Sky'}>
 <mesh renderOrder={-1000} frustumCulled={false}>
 <planeGeometry args={[2,2]}/><shaderMaterial depthWrite={false} depthTest={false} toneMapped={false} uniforms={uniforms}
 vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,1.,1.);}`}
 fragmentShader={`varying vec2 vUv;uniform vec3 upper;uniform vec3 middle;uniform vec3 lower;uniform vec3 glow;uniform float aspect;uniform float moon;
 void main(){float h=vUv.y;vec3 c=mix(lower,middle,smoothstep(0.,.57,h));c=mix(c,upper,smoothstep(.35,1.,h));float halo=exp(-10.*length((vUv-vec2(.19,.57))*vec2(.8,1.)));c=mix(c,glow,halo*.24);float d=length((vUv-vec2(.89,.79))*vec2(aspect,1.));float r=min(.022,aspect*.034);c=mix(c,vec3(.92,.91,.83),moon*(1.-smoothstep(r-.001,r+.001,d)));gl_FragColor=vec4(c,1.);
 #include <colorspace_fragment>
 gl_FragColor.rgb += (fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;
 }`}/></mesh>
 {night&&<>{Array.from({length:42},(_,i)=><mesh key={i} position={[Math.sin(i*2.399)*(23+i%8),-12+(i%19)*2.4,Math.cos(i*2.399)*(23+i%8)]}><sphereGeometry args={[i%7===0?.10:.055,6,4]}/><meshBasicMaterial color="#d7e2f1"/></mesh>)}</>}

 </group></>;
}
