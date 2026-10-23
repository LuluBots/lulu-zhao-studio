// Lightweight synthesized court sounds; audio starts only after a user gesture.
let context:AudioContext|undefined;
let enabled=true;
export function setSoundEnabled(value:boolean){enabled=value;if(value)void unlockSound()}
export async function unlockSound(){try{context??=new AudioContext();if(context.state==='suspended')await context.resume()}catch{/* Audio is optional. */}}
export function courtSound(kind:'hit'|'step'|'bounce'|'enter',strength=1){
 if(!enabled||!context||context.state!=='running'||document.hidden)return;
 const c=context,t=c.currentTime,duration=kind==='enter'?.5:kind==='step'?.075:.13;
 const gain=c.createGain();gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime((kind==='step'?.025:.07)*strength,t+.006);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);gain.connect(c.destination);
 const source=c.createBufferSource(),buffer=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
 source.buffer=buffer;const filter=c.createBiquadFilter();filter.type='bandpass';filter.frequency.value=kind==='step'?750:kind==='hit'?1800:kind==='enter'?1100:420;filter.Q.value=.6;source.connect(filter);filter.connect(gain);source.start(t);source.stop(t+duration);
 source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};
}
