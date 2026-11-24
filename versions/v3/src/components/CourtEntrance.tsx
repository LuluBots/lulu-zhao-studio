import { useProgress } from '@react-three/drei';

export default function CourtEntrance({ready,onStart}:{ready:boolean;onStart:()=>void}) {
  const {active,progress,errors}=useProgress();
  const loaded=ready&&!active;
  return <section className="portfolio-entry" aria-label="Lulu Zhao" onKeyDown={event=>event.stopPropagation()} onDoubleClick={event=>event.stopPropagation()}>
    <h1>Lulu Zhao</h1>
    <p>Human–AI Interaction &amp; Design</p>
    {loaded?<button type="button" onClick={onStart}>Enter court</button>
      :errors.length?<button type="button" onClick={()=>location.reload()}>Retry loading</button>
      :<div className="entry-progress" role="status">Loading court<progress aria-label="Loading court" value={active?progress:undefined} max={100}/></div>}
  </section>;
}
