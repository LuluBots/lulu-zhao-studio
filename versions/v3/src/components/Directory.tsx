import { useEffect, useRef } from 'react';
import { useAnchoredDialog } from './useAnchoredDialog';
import type { ScreenAnchor } from '../scene/SkyVisitors';
import { articles, projects, profile, sides } from '../content/profile';
export type Destination='research'|'writing'|'about';
export default function Directory({destination,onClose,anchor}:{destination:Destination|null;onClose:()=>void;anchor?:ScreenAnchor|null}){
 const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);
 useAnchoredDialog(dialog,!!destination,anchor);
 useEffect(()=>{if(destination){dialog.current?.showModal();heading.current?.focus()}else dialog.current?.close()},[destination]);
 return <dialog ref={dialog} className="content-card directory" aria-labelledby="directory-title" onCancel={e=>{e.preventDefault();onClose()}} onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
 <div className="card-top"><span className="card-eyebrow">GRAND SLAM WITH LULU</span><button className="card-close" aria-label="Close directory" onClick={onClose}>×</button></div>
 <h2 id="directory-title" ref={heading} tabIndex={-1}>{destination==='research'?'Research':destination==='writing'?'Writing':'Hello, I’m Lulu.'}</h2>
 {destination==='about'?<><p className="card-status">{profile.affiliation}</p><p className="card-summary">{profile.focus}</p><p className="card-summary">{sides.technology.biography}</p><p className="card-summary">{sides.humanities.biography}</p><p className="tennis-love">Beyond Verse & Code: I love tennis and all kinds of sports.<br/>My favorite player is Novak Djokovic.<br/>I live near a tennis court, and I’d love to play with you.</p></>:(destination==='research'?projects:articles).map(entry=><article className="directory-entry" key={entry.id}><p className="card-status">{entry.status??entry.year}</p><h3>{entry.title}</h3><p>{entry.summary}</p>{entry.note&&<details className="courtside-detail"><summary>Open courtside note <span aria-hidden="true">＋</span></summary><p>{entry.note??entry.summary}</p></details>}</article>)}
 <button className="card-secondary" onClick={onClose}>Back to court</button>
 </dialog>;
}
