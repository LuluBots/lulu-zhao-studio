import { dismissOnBackdrop } from './dismissOnBackdrop';
import { useEffect, useRef } from 'react';
import type { CourtFact } from '../content/courtFacts';

export default function CourtFactDialog({fact,onClose}:{fact:CourtFact|null;onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const el=dialog.current;
    if(fact && !el?.open) el?.showModal();
    else if(!fact && el?.open) el.close();
  },[fact]);
  return <dialog onClick={e=>dismissOnBackdrop(e,onClose)} ref={dialog} className="content-card court-fact" aria-labelledby="court-fact-title"
    onCancel={event=>{event.preventDefault();onClose()}} onKeyDown={e=>e.stopPropagation()}
    onDoubleClick={e=>e.stopPropagation()}>
    <h2 id="court-fact-title">{fact?.title}</h2>
    <p>{fact?.text}</p>
    <button type="button" className="card-secondary" onClick={onClose}>Back to court</button>
  </dialog>;
}
