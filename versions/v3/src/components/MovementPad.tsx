import type { RefObject } from 'react';
import { moveVisitor,type VisitorInput } from '../state/gameplay';
export default function MovementPad({input}:{input:RefObject<VisitorInput>}){
 return <div className="movement-pad" aria-label="Player movement" onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')e.stopPropagation()}} onDoubleClick={e=>e.stopPropagation()}>
 {([['KeyW','W','Move forward'],['KeyA','A','Move left'],['KeyS','S','Move back'],['KeyD','D','Move right']] as const).map(([code,label,name])=><button key={code} className={code} aria-label={name} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);input.current.keys.add(code);moveVisitor(input.current,.035)}} onPointerUp={()=>input.current.keys.delete(code)} onPointerCancel={()=>input.current.keys.delete(code)} onLostPointerCapture={()=>input.current.keys.delete(code)} onClick={e=>{if(e.detail===0){input.current.keys.add(code);moveVisitor(input.current,.05);input.current.keys.delete(code)}}}>{label}</button>)}

 </div>;
}
