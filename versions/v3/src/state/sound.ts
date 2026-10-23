// Layered dry court acoustics: impact body, string-bed snap and rubber friction.
// Generated locally; no streaming, autoplay, or third-party audio requests.
let context:AudioContext|undefined;
let enabled=true,stepCount=0;
export function setSoundEnabled(value:boolean){enabled=value;if(value)void unlockSound()}
export async function unlockSound(){try{context??=new AudioContext();if(context.state==='suspended')await context.resume()}catch{/* Audio is optional. */}}
export function courtSound(kind:'hit'|'step'|'bounce'|'enter',strength=1){
 if(!enabled||!context||context.state!=='running'||document.hidden)return;
 const c=context,t=c.currentTime,power=Math.max(.2,Math.min(1.4,strength));
 const output=c.createGain();output.gain.value=kind==='step'?.34:.6;output.connect(c.destination);
 let pending=0;
 const finish=()=>{if(--pending===0)output.disconnect()};
 function tone(frequency:number,end:number,duration:number,level:number,delay=0,type:OscillatorType='sine'){
  pending++;const oscillator=c.createOscillator(),gain=c.createGain(),start=t+delay;
  oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,start);oscillator.frequency.exponentialRampToValueAtTime(end,start+duration);
  gain.gain.setValueAtTime(.00001,start);gain.gain.linearRampToValueAtTime(level*power,start+.002);gain.gain.exponentialRampToValueAtTime(.00001,start+duration);
  oscillator.connect(gain);gain.connect(output);oscillator.start(start);oscillator.stop(start+duration+.005);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();finish()};
 }
 function noise(duration:number,frequency:number,level:number,delay=0,q=.7){
  pending++;const buffer=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),samples=buffer.getChannelData(0);
  for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
  const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain(),start=t+delay;
  source.buffer=buffer;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=q;
  gain.gain.setValueAtTime(.00001,start);gain.gain.linearRampToValueAtTime(level*power,start+.0015);gain.gain.exponentialRampToValueAtTime(.00001,start+duration);
  source.connect(filter);filter.connect(gain);gain.connect(output);source.start(start);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();finish()};
 }
 if(kind==='hit'){
  // Brief felt/string attack followed by the ball's hollow, damped body.
  noise(.024,3100,.36);noise(.052,1250,.15,0,1.4);
  tone(245,145,.075,.28);tone(870,790,.042,.045);tone(1640,1510,.025,.018);
  noise(.036,1800,.025,.043); // a quiet, short court reflection
 }else if(kind==='bounce'){
  tone(175,83,.085,.25);noise(.026,720,.15);noise(.012,2200,.035);
 }else if(kind==='step'){
  const alternate=stepCount++%2;
  tone(alternate?102:115,58,.07,.13);noise(.045,600,.16);
  noise(.065,2100,.055,.014); // outsole brushing acrylic, not a repeated generic hiss
  if(stepCount%4===0){tone(1480,1120,.047,.018,.026,'triangle');noise(.04,2400,.018,.026,3)}
 }else{
  // A restrained two-bounce invitation instead of a synthetic whoosh.
  tone(170,90,.08,.10);noise(.02,800,.05);tone(150,85,.07,.065,.17);noise(.018,800,.035,.17);
 }
}
