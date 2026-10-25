import { Camera, BookOpen, Guitar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
const objects=[{name:'Camera',Icon:Camera},{name:'Notebook',Icon:BookOpen},{name:'Hobbies',Icon:Guitar}];
export default function HobbyDialog({onClose}:{onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null),[item,setItem]=useState(0);
 useEffect(()=>{dialog.current?.showModal();heading.current?.focus();return ()=>dialog.current?.close()},[]);
 return createPortal(<dialog ref={dialog} className="hobby-dialog" aria-labelledby="hobby-title" onCancel={e=>{e.preventDefault();onClose()}} onKeyDown={e=>e.stopPropagation()} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose()}}}>
  <header><div><span>IN MY TENNIS BAG</span><h2 id="hobby-title" tabIndex={-1} ref={heading}>Off court</h2></div><button className="hobby-close" aria-label="Close tennis bag" onClick={onClose}>×</button></header>
  <div className="hobby-objects" role="group" aria-label="Explore the bag">{objects.map(({name,Icon},i)=><button key={name} aria-pressed={item===i} onClick={()=>setItem(i)}><Icon size={24} strokeWidth={1.3} aria-hidden/><span>{name}</span></button>)}</div>
  <section className="hobby-detail" aria-live="polite">
   {item===0?<><img src="/photos/off-court-san-juan.jpg" alt="Lulu’s photograph of Old San Juan beside the Atlantic Ocean"/><h3>Through my lens</h3><p>A visual notebook of seasons, movement, and passing moments.</p><a href="https://www.instagram.com/lulu.coco25/" target="_blank" rel="noopener noreferrer">Find me on Instagram ↗</a></>:item===1?<><div className="hobby-notebook" aria-hidden><span>Words first.</span></div><h3>Words first</h3><p>I began publishing poetry and essays in primary school. Writing taught me to notice small things—and to care about how ideas are felt.</p><a href="https://v1.luluzhao.me/blog" target="_blank" rel="noopener noreferrer">Open my notebook ↗</a></>:<><div className="hobby-record" aria-hidden><Guitar size={52} strokeWidth={1}/></div><h3>A beginner, again</h3><p>I like trying different sports and learning to play the guitar—finding new ways to move, listen, and be a beginner.</p><p className="hobby-footnote">Tennis is one part of a growing list of things I enjoy learning.</p></>}
  </section>
 </dialog>,document.body);
}
