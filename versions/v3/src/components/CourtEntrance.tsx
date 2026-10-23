import {useEffect,useRef,useState} from 'react';
import { useProgress } from '@react-three/drei';

/** Asset progress belongs to the invitation, so it never rerenders the 3D scene. */
export default function CourtEntrance({ready,onStart}:{ready:boolean;onStart:()=>void}) {
  const {active,progress,errors}=useProgress();
  const loaded=ready&&!active&&!errors.length;
  const [display,setDisplay]=useState(0),[leaving,setLeaving]=useState(false);
  const target=useRef(0),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  // LoadingManager can reset its denominator as new assets are discovered.
  // Keep the presentation monotonic, reserving the last segment for scene readiness.
  target.current=Math.max(target.current,loaded?100:Math.min(85,progress*.85));
  useEffect(()=>{
    let frame=0,last=performance.now(),value=0;
    const tick=(now:number)=>{const dt=Math.min((now-last)/1000,.06);last=now;
      value=Math.min(target.current,value+dt*Math.max(8,(target.current-value)*2.5));
      setDisplay(value);if(value<100)frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>{cancelAnimationFrame(frame);if(timer.current)clearTimeout(timer.current)};
  },[]);
  const percent=Math.floor(display),complete=loaded&&percent===100;
  const caption=errors.length?'Loading interrupted. Please reload.':complete?'The court is yours.':percent<30?'Opening the gates…':percent<70?'Preparing the court…':'Setting the scene…';
  const enter=()=>{if(!complete||leaving)return;setLeaving(true);timer.current=setTimeout(onStart,matchMedia('(prefers-reduced-motion: reduce)').matches?0:400)};
  return <section className="court-watermark tennis-entrance" data-ready={complete} data-leaving={leaving} aria-label="Grand Slam with Lulu" onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
    <span className="entrance-kicker">LULU ZHAO <i/> AN OPEN INVITATION</span>
    <div className="entry-emblem">
      <svg className="entry-orbit" viewBox="0 0 680 200" aria-hidden="true"><ellipse cx="340" cy="108" rx="307" ry="65" transform="rotate(-8 340 108)"/><path d="M36 130h67m-48 14h42M568 50h63m-55 14h39"/></svg>
      <h1><span data-title="Grand Slam">Grand Slam</span><em>with Lulu</em></h1>
      <svg className="entry-ball" viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="entry-felt" cx="30%" cy="25%"><stop stopColor="#efffa1"/><stop offset="1" stopColor="#acc64e"/></radialGradient></defs><circle cx="32" cy="32" r="29" fill="url(#entry-felt)"/><path d="M13 9c27 6 27 40 0 46M51 9c-27 6-27 40 0 46" fill="none" stroke="#fcffe4" strokeWidth="3"/></svg>
    </div>
    <p>Step onto the court and rally with me.</p>
    <div className="match-loading">
      <div className="match-loading-caption"><span role="status">{caption}</span><span className="loading-number">{String(percent).padStart(2,'0')}<small>%</small></span></div>
      <div className="match-loading-track" role="progressbar" aria-label="Court loading" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <i className="loading-net" aria-hidden="true"/>
        <i className="loading-fill" style={{width:`${percent}%`}} aria-hidden="true"/>
        <i className="loading-tennis-ball" style={{left:`${percent}%`}} aria-hidden="true"/>
      </div>
    </div>
    <button className="court-enter" disabled={!complete||leaving} onClick={enter}>Enter court<span aria-hidden="true">↗</span></button>
  </section>;
}
