import {useEffect,useRef} from 'react';
import {X,MousePointer2,Move,Keyboard,ArrowUpRight} from 'lucide-react';
export default function ControlsHelp({open,onClose}:{open:boolean;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(open&&!dialog.current?.open)dialog.current?.showModal();else if(!open)dialog.current?.close()},[open]);
 return <dialog ref={dialog} className="controls-dialog" aria-labelledby="controls-title" onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}} onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
 <div className="controls-sheet"><header><div><span>COURTSIDE GUIDE</span><h2 id="controls-title">Make yourself at home.</h2></div><button className="guide-close" onClick={onClose} aria-label="Close controls"><X size={18}/></button></header>
 <dl><div><dt><MousePointer2 size={18}/>Look around</dt><dd>Drag to orbit. Shift-drag or right-drag to pan. Scroll or pinch to zoom.</dd></div><div><dt><Keyboard size={18}/>Take your place</dt><dd>Choose Play Rally and a character. Then use <kbd>W A S D</kbd> or the arrow keys to run.</dd></div><div><dt><Move size={18}/>Hit & return</dt><dd>Hold on the opposite court to build power; release to hit. Move your racket into the returning ball.</dd></div><div><dt><ArrowUpRight size={18}/>Explore at your pace</dt><dd>Choose Browse or a sky banner to read. No tennis required. <kbd>Esc</kbd> leaves Rally.</dd></div></dl>
 <button className="guide-done" onClick={onClose}>Back to the court <span aria-hidden="true">↗</span></button></div></dialog>;
}
