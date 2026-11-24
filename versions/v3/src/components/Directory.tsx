import { dismissOnBackdrop } from './dismissOnBackdrop';
import EntryLinks from './EntryLinks';
import { Mail, Github, GraduationCap, Linkedin, Instagram } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useAnchoredDialog } from './useAnchoredDialog';
import type { ScreenAnchor } from '../scene/SkyVisitors';
import { articles, projects, profile, socialLinks, education } from '../content/profile';
export type Destination='research'|'writing'|'about'|'trajectory';
export default function Directory({destination,onClose}:{destination:Destination|null;onClose:()=>void;anchor?:ScreenAnchor|null}){
 const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);
 useAnchoredDialog(dialog,!!destination);
 useEffect(()=>{if(destination){dialog.current?.showModal();heading.current?.focus()}else dialog.current?.close()},[destination]);
 return <dialog onClick={e=>dismissOnBackdrop(e,onClose)} ref={dialog} className={`content-card directory${destination==='about'?' about-card':''}`} aria-labelledby="directory-title" onCancel={e=>{e.preventDefault();onClose()}} onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
 <div className="card-top"><span className="card-eyebrow">{destination==='about'?'About':''}</span><button className="card-close" aria-label="Close directory" onClick={onClose}>×</button></div>
 <h2 id="directory-title" ref={heading} tabIndex={-1}>{destination==='research'?'Research':destination==='writing'?'Writing':destination==='trajectory'?'Trajectory':profile.name}</h2>
 {destination==='about'?<>
   <p className="about-affiliation">I’m a CS PhD student at Cornell, advised by <a href="https://qianyang.co/" target="_blank" rel="noreferrer">Qian Yang</a> in the <a href="https://designai.cis.cornell.edu/" target="_blank" rel="noreferrer">DesignAI Group</a>.</p>
   <div className="about-body">
     <section aria-labelledby="about-research"><h3 id="about-research">Research</h3><p>My research examines how people reason with AI in open-ended design and scientific inquiry. I design and study interactive systems that help people formulate questions, compare competing explanations, and revise their goals as evidence emerges through experimentation.</p><p>My current work examines the co-design of textile structures and the machines that produce them. I investigate how designers and AI can relate observations from physical prototypes to computational models, using changes in either representation to inform the next design experiment.</p></section>
     <section aria-labelledby="about-background"><h3 id="about-background">Background</h3><p>I moved from Politics, Philosophy, and Economics into AI. My earlier research spans robot learning, manipulation, and generative models.</p></section>
   </div>
   <nav className="profile-links" aria-label="Contact and profiles">{socialLinks.map(link=><a key={link.label} aria-label={link.label} title={link.label} href={link.href} target={link.href.startsWith('https:')?'_blank':undefined} rel={link.href.startsWith('https:')?'noopener noreferrer':undefined}>{link.label==='Email'?<Mail aria-hidden size={22}/>:link.label==='GitHub'?<Github aria-hidden size={22}/>:link.label==='Google Scholar'?<GraduationCap aria-hidden size={24}/>:link.label==='Instagram'?<Instagram aria-hidden size={22}/>:<Linkedin aria-hidden size={22}/>}</a>)}</nav>
 </>:destination==='trajectory'?<ol className="education-timeline">{education.map(item=><li key={item.school}><p className="education-date">{item.dates}</p><h3>{item.school}</h3><p>{item.program}</p>{item.distinction&&<strong className="education-award">{item.distinction}</strong>}</li>)}</ol>:(destination==='research'?projects:articles).map(entry=><article className="directory-entry" key={entry.id}><p className="card-status">{entry.status??entry.year}</p><h3>{entry.title}</h3><p>{entry.summary}</p><EntryLinks entry={entry}/>{entry.note&&<details className="courtside-detail"><summary>Details <span aria-hidden="true">＋</span></summary><p>{entry.note??entry.summary}</p></details>}</article>)}
 <button className="card-secondary" onClick={onClose}>Back to court</button>
 </dialog>;
}
