import {useEffect,useRef} from 'react';
import type {Side} from '../state/rally';
export default function RolePicker({open,onChoose,onClose}:{open:boolean;onChoose:(side:Side)=>void;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close()},[open]);
 return <dialog ref={dialog} className="role-picker" aria-labelledby="role-title" onCancel={e=>{e.preventDefault();onClose()}} onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}><button className="role-close" aria-label="Cancel role selection" onClick={onClose}>×</button><h2 id="role-title">Who will you play?</h2><div className="role-options"><button className="role-verse" onClick={()=>onChoose('humanities')}><span aria-hidden="true">✧</span><strong>Verse</strong><small>Humanity · poetry & ideas</small><b>Play as Verse →</b></button><button className="role-code" onClick={()=>onChoose('technology')}><span aria-hidden="true">⌘</span><strong>Code</strong><small>Technology · AI</small><b>Play as Code →</b></button></div><footer>WASD / arrow keys move your player.</footer></dialog>;
}
