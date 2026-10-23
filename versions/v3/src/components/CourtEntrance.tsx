import { useProgress } from '@react-three/drei';

/** Asset progress belongs to the invitation, so it never rerenders the 3D scene. */
export default function CourtEntrance({ready,onStart}:{ready:boolean;onStart:()=>void}) {
  const {active,progress,errors}=useProgress();
  const complete=ready&&!active;
  const percent=complete?100:Math.min(99,Math.round(progress));
  return <section className="court-watermark tennis-entrance" aria-label="Grand Slam with Lulu" onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
    <span className="entrance-kicker">LULU ZHAO <i/> AN OPEN INVITATION</span>
    <h1><span>Grand Slam</span><em>with Lulu</em></h1>
    <p>Step onto the court and rally with me.</p>
    <div className="match-loading">
      <div className="match-loading-caption"><span role="status">{complete?'The court is yours.':errors.length?'Preparing your court…':'Warming up the court…'}</span><span className="loading-number">{String(percent).padStart(2,'0')}<small>%</small></span></div>
      <div className="match-loading-track" role="progressbar" aria-label="Court loading" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <i className="loading-net" aria-hidden="true"/>
        <i className="loading-fill" style={{width:`${percent}%`}} aria-hidden="true"/>
        <i className="loading-tennis-ball" style={{left:`${percent}%`}} aria-hidden="true"/>
      </div>
    </div>
    <button className="court-enter" disabled={!complete} onClick={onStart}>{complete?'Enter court':'Getting ready'}<span aria-hidden="true">↗</span></button>
  </section>;
}
