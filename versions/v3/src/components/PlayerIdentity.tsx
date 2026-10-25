import type { Destination } from './Directory';
const sections:Destination[]=['research','writing','about','trajectory'];
export default function PlayerIdentity({active,onNavigate}:{active:Destination|null;onNavigate:(destination:Destination)=>void}){
 return <aside className="player-ident" aria-label="Lulu Zhao — profile and navigation" onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
  <div className="player-ident-name"><svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="11"/><path d="M6 6c9 2 9 14 0 16M22 6c-9 2-9 14 0 16"/></svg><span>LULU ZHAO</span></div>
  <div className="player-ident-bio"><p className="player-ident-degree">CS PhD <span>·</span> Cornell</p><p className="player-ident-interest">Human–AI Interaction<br/><span>Embodied Intelligence · Design</span></p></div>
  <nav aria-label="Site sections">{sections.map((section,i)=><button key={section} aria-current={active===section?'page':undefined} onClick={()=>onNavigate(section)}><span className="player-ident-number">0{i+1}</span>{section[0].toUpperCase()+section.slice(1)}<span className="player-ident-arrow" aria-hidden>↗</span></button>)}</nav>
 </aside>;
}
