import { useMemo } from 'react';
import { BackSide, Color } from 'three';
export default function Atmosphere({night=false}:{night?:boolean}){
 const uniforms=useMemo(()=>({horizon:{value:new Color(night?'#46627d':'#d2e3ef')},zenith:{value:new Color(night?'#192b4b':'#7ab8de')},glow:{value:new Color(night?'#aebeda':'#ffd9a1')}}),[night]);
 return <><fog attach="fog" args={[night?'#202e49':'#dde9f0',55,110]}/><group name={night?'Moonlit_Sky':'Daylight_Sky'}>
 <mesh renderOrder={-100}><sphereGeometry args={[85,32,20]}/><shaderMaterial side={BackSide} depthWrite={false} uniforms={uniforms} vertexShader={`varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`varying vec3 vDirection;uniform vec3 horizon;uniform vec3 zenith;uniform vec3 glow;void main(){vec3 d=normalize(vDirection);float h=smoothstep(-.25,.7,d.y);vec3 c=mix(horizon,zenith,h);float sun=pow(max(0.,dot(d,normalize(vec3(-.5,.58,-.65)))),140.);c+=glow*sun*.5;gl_FragColor=vec4(c,1.);}`} /></mesh>
 {night&&<><mesh position={[-14,9,-10]}><sphereGeometry args={[.85,24,16]}/><meshBasicMaterial color="#f6efdc"/></mesh>{Array.from({length:90},(_,i)=><mesh key={i} position={[Math.sin(i*2.399)*(23+i%8),-12+(i%19)*2.4,Math.cos(i*2.399)*(23+i%8)]}><sphereGeometry args={[i%7===0?.10:.055,6,4]}/><meshBasicMaterial color="#d7e2f1"/></mesh>)}</>}
 {Array.from({length:10},(_,i)=><group key={i} position={[Math.sin(i*2.3)*50,15+(i%3)*5,Math.cos(i*2.3)*50]} rotation={[0,i*.7,0]}>{[0,1,2].map(j=><mesh key={j} position={[j*4,j*.15,j*.5]} scale={[7-j,.22,1.2]}><sphereGeometry args={[1,16,8]}/><meshBasicMaterial color={night?'#8c9ab7':'#fff9eb'} transparent opacity={.13+j*.025} depthWrite={false}/></mesh>)}</group>)}
 </group></>;
}
