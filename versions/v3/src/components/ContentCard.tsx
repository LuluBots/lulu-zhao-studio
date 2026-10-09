import { useEffect, useRef } from 'react';
import type { Entry } from '../content/profile';
import { useAnchoredDialog } from './useAnchoredDialog';
import type { ScreenAnchor } from '../scene/SkyVisitors';
import { flightPaths } from '../scene/trajectories';

type Props = {anchor?:ScreenAnchor|null;
  panel: 'closed' | 'preview' | 'flight' | 'detail'; entry: Entry | null;
  entries: readonly Entry[]; onChoose: (entry: Entry) => void;
  onHit: () => void; onRead: () => void; onClose: () => void;
};
export default function ContentCard({anchor,panel,entry,entries,onChoose,onHit,onRead,onClose}:Props) {
  const dialog=useRef<HTMLDialogElement>(null), heading=useRef<HTMLHeadingElement>(null);
  const open=panel==='preview'||panel==='detail';
  useAnchoredDialog(dialog,open,anchor);
  useEffect(()=>{
    const node=dialog.current;if(!node)return;
    if(open){if(!node.open)node.showModal();heading.current?.focus();}
    else if(node.open)node.close();
  },[open,panel,entry?.id]);
  const isWriting=entry?.side==='humanities';
  const index=entries.findIndex(item=>item.id===entry?.id);
  const path=flightPaths[entry?.trajectory??'straight'];
  return <dialog ref={dialog} className="content-card" data-side={entry?.side} aria-labelledby="card-title" aria-describedby="card-summary"
    onCancel={event=>{event.preventDefault();event.stopPropagation();onClose()}}
    onKeyDown={event=>event.stopPropagation()} onDoubleClick={event=>event.stopPropagation()}
    onClick={event=>{event.stopPropagation();if(event.target===event.currentTarget){const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)onClose()}}}>
    {!entry&&<article><div className="card-top"><span className="card-eyebrow">GRAND SLAM WITH LULU</span><button className="card-close" type="button" onClick={onClose} aria-label="Close card">×</button></div><h2 id="card-title" ref={heading} tabIndex={-1}>Room for something new.</h2><p id="card-summary" className="card-summary">There are no entries on this side yet.</p><button className="card-secondary" type="button" onClick={onClose}>Back to court</button></article>}
    {entry&&<article>
      <div className="card-top"><span className="card-eyebrow">{isWriting?'HUMANITIES / WRITING':'TECHNOLOGY / RESEARCH'}</span><button className="card-close" type="button" onClick={onClose} aria-label="Close card">×</button></div>
      <div className="card-rule"/>
      <p className="card-kicker">{panel==='preview'?'Your next discovery':isWriting?'A note beyond the baseline':'From the other side of the net'}</p>
      <h2 id="card-title" ref={heading} tabIndex={-1}>{entry.title}</h2>
      <p className="card-status">{entry.status??entry.year}</p>
      <p id="card-summary" className="card-summary">{entry.summary}</p>
      {panel==='preview'?<>
        <div className="card-path"><svg viewBox="0 0 100 36" aria-hidden="true"><path d={entry.trajectory==='crosscourt'?'M8 28 Q58 -12 92 25':entry.trajectory==='insideout'?'M8 28 Q28 -12 92 25':'M8 28 Q50 -10 92 28'}/><circle cx="8" cy="28" r="3"/><circle cx="92" cy="27" r="3"/></svg><span>{path.label}<small>One rally opens this exact {isWriting?'entry':'project'}.</small></span></div>
        <div className="card-actions"><button className="card-primary" type="button" onClick={onHit}>Rally to explore <span aria-hidden="true">↗</span></button><button className="card-secondary" type="button" onClick={onRead}>Read now <span aria-hidden="true">→</span></button></div>
      </>:<>
        {entry.note&&<p className="card-note">{entry.note}</p>}
        <div className="card-actions"><span className="card-unlinked">COURTSIDE NOTES · {isWriting?'WRITING':'RESEARCH'}</span><button className="card-secondary" type="button" onClick={onClose}>Back to court</button></div>
      </>}
      {entries.length>1&&<div className="card-browse"><label htmlFor="content-choice">{isWriting?'Choose an entry':'Choose a project'} <span>{index+1} / {entries.length}</span></label><select id="content-choice" value={entry.id} onChange={event=>{const next=entries.find(item=>item.id===event.target.value);if(next)onChoose(next)}}>{entries.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></div>}
    </article>}
  </dialog>;
}
