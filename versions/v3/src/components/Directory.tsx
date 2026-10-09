import { useEffect, useRef } from 'react';
import { useAnchoredDialog } from './useAnchoredDialog';
import type { ScreenAnchor } from '../scene/SkyVisitors';
import { articles, projects, profile, socialLinks, education } from '../content/profile';
export type Destination='research'|'writing'|'about'|'trajectory';
export default function Directory({destination,onClose}:{destination:Destination|null;onClose:()=>void;anchor?:ScreenAnchor|null}){
 const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);
 useAnchoredDialog(dialog,!!destination);
 useEffect(()=>{if(destination){dialog.current?.showModal();heading.current?.focus()}else dialog.current?.close()},[destination]);
 return <dialog ref={dialog} className={`content-card directory${destination==='about'?' about-card':''}`} aria-labelledby="directory-title" onCancel={e=>{e.preventDefault();onClose()}} onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
 <div className="card-top"><span className="card-eyebrow">{destination==='about'?'About':''}</span><button className="card-close" aria-label="Close directory" onClick={onClose}>×</button></div>
 <h2 id="directory-title" ref={heading} tabIndex={-1}>{destination==='research'?'Research':destination==='writing'?'Writing':destination==='trajectory'?'Trajectory':profile.name}</h2>
 {destination==='about'?<>
   <p className="about-affiliation">CS PhD · Cornell University</p>
   <div className="about-body">
     <section aria-labelledby="about-research"><h3 id="about-research">Research</h3><p>I study human–AI interaction and embodied intelligence, exploring how multimodal AI can support the co-design of physical inventions.</p></section>
     <section aria-labelledby="about-background"><h3 id="about-background">Background</h3><p>I moved from Politics, Philosophy, and Economics into AI. My earlier research spans robot learning, manipulation, and generative models.</p></section>
   </div>
   <nav className="profile-links" aria-label="Contact and profiles">{socialLinks.map(link=><a key={link.label} href={link.href} target={link.href.startsWith('https:')?'_blank':undefined} rel={link.href.startsWith('https:')?'noopener noreferrer':undefined}>{link.label}<span aria-hidden="true">↗</span></a>)}</nav>
 </>:destination==='trajectory'?<ol className="education-timeline">{education.map(item=><li key={item.school}><p className="education-date">{item.dates}</p><h3>{item.school}</h3><p>{item.program}</p>{item.distinction&&<strong className="education-award">{item.distinction}</strong>}</li>)}</ol>:(destination==='research'?projects:articles).map(entry=><article className="directory-entry" key={entry.id}><p className="card-status">{entry.status??entry.year}</p><h3>{entry.title}</h3><p>{entry.summary}</p>{entry.note&&<details className="courtside-detail"><summary>Details <span aria-hidden="true">＋</span></summary><p>{entry.note??entry.summary}</p></details>}</article>)}
 <button className="card-secondary" onClick={onClose}>Back to court</button>
 </dialog>;
}
