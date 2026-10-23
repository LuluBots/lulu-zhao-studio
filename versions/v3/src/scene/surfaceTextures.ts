import {DataTexture,RGBAFormat,RepeatWrapping,LinearFilter} from 'three';
// Small, repeatable micro-height maps; no remote textures or loading overhead.
export function surfaceTexture(kind:'fabric'|'wood'|'grit',repeat=8){
 const n=128,data=new Uint8Array(n*n*4);let seed=73;
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  seed=(1664525*seed+1013904223)>>>0;const noise=(seed%41)-20;
  const weave=kind==='fabric'?((x%4<2?14:-14)+(y%4<2?14:-14)):kind==='wood'?Math.sin(y*.4+Math.sin(x*.025)*3)*35:0;
  const value=Math.max(0,Math.min(255,160+noise+weave)),i=(y*n+x)*4;data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;
 }
 const map=new DataTexture(data,n,n,RGBAFormat);map.wrapS=map.wrapT=RepeatWrapping;map.repeat.set(repeat,repeat);map.magFilter=map.minFilter=LinearFilter;map.generateMipmaps=true;map.needsUpdate=true;return map;
}
