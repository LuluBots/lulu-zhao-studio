import { useThree } from '@react-three/fiber';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { Html, RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RallyState } from '../state/rally';
import { pointLabel, type Score } from '../state/score';
type Props={state:RallyState;score:Score;onPlay:()=>void;onSwitch:()=>void;onReset:()=>void};
function Board({end,state,score,onPlay,onSwitch,onReset}:Props&{end:number}){
 const gl=useThree(s=>s.gl);
 const [expanded,setExpanded]=useState(false),dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(expanded)dialog.current?.showModal();else dialog.current?.close()},[expanded]);
 const texture=useMemo(()=>{
  const c=document.createElement('canvas');c.width=1440;c.height=720;const ctx=c.getContext('2d')!;ctx.scale(2,2);
  ctx.fillStyle='#143d53';ctx.fillRect(0,0,720,360);ctx.strokeStyle='#83afb3';ctx.lineWidth=2;ctx.strokeRect(12,12,696,336);
  ctx.fillStyle='#f2f2df';ctx.font='italic 700 36px Impact, sans-serif';ctx.fillText('GRAND SLAM',38,66);ctx.font='italic 26px Georgia';ctx.fillText('luluzhao',545,60);
  ctx.font='15px sans-serif';ctx.fillStyle='#b4cfcf';ctx.fillText('PLAYER',38,108);ctx.fillText('GAMES',440,108);ctx.fillText('POINTS',575,108);
  (['humanities','technology'] as const).forEach((side,i)=>{const y=166+i*96;ctx.fillStyle='#f0f2dd';ctx.font='italic 700 40px Impact, sans-serif';ctx.fillText(side==='humanities'?'VERSE':'CODE',38,y);ctx.font='16px sans-serif';ctx.fillStyle='#a9c4c5';ctx.fillText(`${side==='humanities'?'HUMANITY':'TECH'} · ${side===state.side?'NPC':'YOU'}`,38,y+26);ctx.font='36px monospace';ctx.fillStyle='#e1e6cb';ctx.fillText(String(score.games[side]),460,y);ctx.fillStyle='#deebbb';ctx.fillRect(558,y-40,124,62);ctx.fillStyle='#1b4452';ctx.textAlign='center';ctx.fillText(pointLabel(score,side),620,y+5);ctx.textAlign='left';ctx.strokeStyle='#456b79';ctx.beginPath();ctx.moveTo(38,y+40);ctx.lineTo(682,y+40);ctx.stroke()});
  const map=new CanvasTexture(c);map.colorSpace=SRGBColorSpace;map.anisotropy=gl.capabilities.getMaxAnisotropy();return map;
 },[score,state.side]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 const content=<div className="match-board">
  <header><strong className="rally-wordmark">Grand Slam with Lulu</strong><img className="lulu-logo" src="/brand/lulu-zhao.svg" alt="luluzhao · Grand Slam with Lulu"/></header>
  <div className="match-columns"><span>PLAYER / SIDE</span><span>GAMES</span><span>POINTS</span></div>
  {(['humanities','technology'] as const).map(side=><div className="match-row" key={side}><div><strong>{side==='humanities'?'Verse':'Code'}</strong><small>{side==='humanities'?'Humanity':'Tech'} · {side===state.side?'NPC':'YOU'}</small></div><span>{score.games[side]}</span><b>{pointLabel(score,side)}</b></div>)}
  <div className="match-caption">RETURN IN = YOUR POINT · MISS / OUT = NPC POINT</div>
  <div className="match-actions"><button onClick={()=>{setExpanded(false);onPlay()}}>Play</button><button disabled={!['overview','ready'].includes(state.phase)} onClick={()=>{setExpanded(false);onSwitch()}}>Switch Ends</button><button onClick={()=>{setExpanded(false);onReset()}}>Reset view</button></div>
 </div>;
 return <group name={`Scoreboard_${end<0?'North':'South'}`} position={[end*6.5,0,end*11.4]} rotation={[0,end<0?0:Math.PI,0]}>
  <RoundedBox args={[3.45,.14,1.0]} radius={.07} position={[0,-.06,0]} receiveShadow castShadow><meshStandardMaterial color="#93afb4"/></RoundedBox>
  {[-1.15,1.15].map(x=><mesh key={x} position={[x,.67,0]} castShadow><boxGeometry args={[.055,1.34,.075]}/><meshStandardMaterial color="#567783" metalness={.6} roughness={.35}/></mesh>)}
  <group position={[0,1.4,0]} onClick={e=>{e.stopPropagation();if(e.delta<5)setExpanded(true)}} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor=''}}>
   <RoundedBox args={[3.25,1.63,.10]} radius={.035} castShadow><meshStandardMaterial color="#c2d7d5" metalness={.35} roughness={.4}/></RoundedBox>
   {[-1,1].map(face=><mesh key={face} position={[0,0,face*.056]} rotation={[0,face<0?Math.PI:0,0]}><planeGeometry args={[3.14,1.53]}/><meshBasicMaterial map={texture} depthTest depthWrite/></mesh>)}
  </group>
  <Html><dialog ref={dialog} className="match-dialog" aria-label={`${end<0?'North':'South'} scoreboard`} onCancel={e=>{e.preventDefault();setExpanded(false)}} onKeyDown={e=>e.stopPropagation()}><button className="scoreboard-close" aria-label="Close scoreboard" onClick={()=>setExpanded(false)}>×</button>{expanded&&content}</dialog></Html>
 </group>;
}
export default function Wayfinding(props:Props){return <>{[-1,1].map(end=><Board key={end} end={end} {...props}/>)}</>}
