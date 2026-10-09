import { Component, lazy, Suspense, useCallback, useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import type { ViewAction } from './scene/World';
import { initialRally, rallyReducer, otherSide, type Side } from './state/rally';
import { explorationReducer, initialExploration, selectedEntry } from './state/exploration';
import { sides, type Entry } from './content/profile';
import Directory, { type Destination } from './components/Directory';
import { awardPoint, daylightAt, initialScore, pointLabel } from './state/score';
import type { ScreenAnchor } from './scene/SkyVisitors';
import MovementPad from './components/MovementPad';
import { createVisitorInput, type RallyResult } from './state/gameplay';
import RolePicker from './components/RolePicker';
import ContentCard from './components/ContentCard';

const World = lazy(() => import('./scene/World'));
class SceneBoundary extends Component<{children:ReactNode;onBrowse:()=>void},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<div className="scene-error" role="alert"><p>The court couldn’t load.</p><button onClick={this.props.onBrowse}>Browse</button></div>:this.props.children}
}
export default function App(){
  const main=useRef<HTMLElement>(null);
  const [started,setStarted]=useState(false);
  const [choosingRole,setChoosingRole]=useState(false);
  const enterAfterSwap=useRef(false);
  const input=useRef(createVisitorInput());
  const [result,setResult]=useState<RallyResult|null>(null);
  const [score,setScore]=useState(initialScore),lastScored=useRef(-1);
  const [mode,setMode]=useState<'auto'|'day'|'night'>('auto');
  const [automaticDay,setAutomaticDay]=useState(()=>daylightAt(new Date().getHours()));
  const night=mode==='night'||(mode==='auto'&&!automaticDay);
  const [anchor,setAnchor]=useState<ScreenAnchor|null>(null);
  const [directoryAnchor,setDirectoryAnchor]=useState<ScreenAnchor|null>(null);
  useEffect(()=>{const id=window.setInterval(()=>setAutomaticDay(daylightAt(new Date().getHours())),60000);return ()=>clearInterval(id)},[]);

  const [destination,setDestination]=useState<Destination|null>(null);
  const [action,setAction]=useState<ViewAction>({kind:'reset',id:0});
  const [state,dispatch]=useReducer(rallyReducer,{...initialRally,side:location.hash==='#humanities'?'humanities':'technology'});
  const [exploration,explore]=useReducer(explorationReducer,initialExploration);
  const [selection,setSelection]=useState<Partial<Record<Side,string>>>({});
  const [power,setPower]=useState(.5);
  const [target,setTarget]=useState<[number,number]>([0,-3.3]);
  const nextIndex=useRef<Record<Side,number>>({technology:0,humanities:0});
  const [ready,setReady]=useState(false),[lost,setLost]=useState(false);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const activeProfile=sides[state.side];
  const currentEntry=selectedEntry(activeProfile.entries,selection[state.side]);
  const openPreview=useCallback(()=>{explore({type:'preview',entry:currentEntry??null})},[currentEntry]);
  const onClose=useCallback(()=>{explore({type:'close'});requestAnimationFrame(()=>main.current?.focus({preventScroll:true}))},[]);
  const onChoose=useCallback((entry:Entry)=>{
    if(entry.side!==state.side)return;
    setSelection(previous=>({...previous,[state.side]:entry.id}));explore({type:'preview',entry});
  },[state.side]);
  const onCourtHit=useCallback((point:[number,number],strength=.5)=>{
    if(state.phase!=='overview'&&state.phase!=='ready')return;
    if(state.phase==='overview'){explore({type:'close'});setChoosingRole(true);return;}
    const entries=sides[state.side].entries;
    const entry=entries[nextIndex.current[state.side]%entries.length];if(!entry)return;
    setStarted(true);input.current.roaming=false;input.current.z=Math.max(2.4,input.current.z);input.current.x=Math.max(-4.1,Math.min(4.1,input.current.x));setResult(null);input.current.launch=input.current.racket?[...input.current.racket]:[input.current.x-.75,1.18,input.current.z-.47];
    setTarget(point);setPower(strength);explore({type:'preview',entry});explore({type:'launch',shot:state.shot+1});
    dispatch('hit');
    document.body.style.cursor='';main.current?.focus({preventScroll:true});
  },[state.side,state.phase,state.shot]);
  const onHit=useCallback(()=>{
    if(exploration.panel!=='preview'||!exploration.entry||exploration.entry.side!==state.side)return;
    if(state.phase!=='overview'&&state.phase!=='ready')return;
    if(state.phase==='overview'){explore({type:'close'});setChoosingRole(true);return;}
    setStarted(true);input.current.roaming=false;input.current.z=Math.max(2.4,input.current.z);input.current.x=Math.max(-4.1,Math.min(4.1,input.current.x));setResult(null);input.current.launch=input.current.racket?[...input.current.racket]:[input.current.x-.75,1.18,input.current.z-.47];
    explore({type:'launch',shot:state.shot+1});dispatch('hit');
    requestAnimationFrame(()=>main.current?.focus({preventScroll:true}));
  },[exploration,state]);
  const onArrived=useCallback(()=>{
    dispatch('arrived');
    if(state.phase==='switching'&&enterAfterSwap.current){enterAfterSwap.current=false;dispatch('enter');return;}
    // Entering and hitting are queued in order; there is no timer that can fire after cancellation.
    if(state.phase==='entering'&&exploration.panel==='flight')dispatch('hit');
  },[state.phase,exploration.panel]);
  const onFinished=useCallback((outcome:RallyResult)=>{
    if(state.phase!=='playing'||lastScored.current===state.shot)return;
    lastScored.current=state.shot;setResult(outcome);setScore(previous=>awardPoint(previous,outcome.winner==='visitor'?otherSide(state.side):state.side));
    dispatch('finished');
    if(outcome.winner==='visitor'){nextIndex.current[state.side]=(nextIndex.current[state.side]+1)%Math.max(1,sides[state.side].entries.length);explore({type:'complete',shot:state.shot})}
    else explore({type:'close'});
  },[state.phase,state.shot,state.side]);
  const onBall=useCallback(()=>{
    if(state.phase==='overview'){explore({type:'close'});setChoosingRole(true)}
    else if(state.phase==='ready')onCourtHit([0,-3.3]);
  },[state.phase,onCourtHit]);
  const chooseRole=(visitor:Side)=>{
    if(!choosingRole||state.phase!=='overview')return;
    setChoosingRole(false);setStarted(true);setResult(null);input.current.keys.clear();input.current.roaming=false;input.current.x=.45;input.current.z=6.5;
    const opponent=otherSide(visitor);history.pushState(null,'',`#${opponent}`);
    if(opponent!==state.side){enterAfterSwap.current=true;dispatch(opponent)}else dispatch('enter');
    requestAnimationFrame(()=>main.current?.focus({preventScroll:true}));
  };
  const onExit=useCallback(()=>{explore({type:'close'});dispatch('exit')},[]);
  const onSelect=useCallback((side:Side)=>{
    if((state.phase!=='overview'&&state.phase!=='ready')||side===state.side)return;
    explore({type:'close'});history.pushState(null,'',`#${side}`);dispatch(side);requestAnimationFrame(()=>main.current?.focus({preventScroll:true}));
  },[state.phase,state.side]);
  const onSwitch=useCallback(()=>onSelect(otherSide(state.side)),[onSelect,state.side]);
  useEffect(()=>{
    const sync=()=>{
      const side:Side=location.hash==='#humanities'?'humanities':'technology';
      if(state.phase==='overview'||state.phase==='ready'){if(side!==state.side)explore({type:'close'});dispatch(side)}
      else history.replaceState(null,'',`#${state.side}`);
    };
    window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync);
    return ()=>{window.removeEventListener('popstate',sync);window.removeEventListener('hashchange',sync)};
  },[state.phase,state.side]);
  useEffect(()=>{document.title="Grand Slam with Lulu"},[activeProfile.title]);
  useEffect(()=>{
    const query=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(query.matches);
    query.addEventListener('change',update);return ()=>query.removeEventListener('change',update);
  },[]);
  const onReady=useCallback(()=>setReady(true),[]);
  const onContextLost=useCallback(()=>{setLost(true);explore({type:'close'})},[]);
  const command=(kind:ViewAction['kind'])=>setAction(previous=>({kind,id:previous.id+1}));
  return <main ref={main} className="court-world" data-started={started} aria-label="Grand Slam with Lulu — cloud tennis court" aria-describedby="court-instructions" aria-busy={!ready&&!lost} data-light={night?'night':'day'} data-mode={state.phase} data-side={state.side} data-content={exploration.panel} data-shot-power={power.toFixed(3)} data-shot-target={target.join(",")} tabIndex={0}
    onDoubleClick={()=>state.phase==='overview'?command('reset'):onExit()}
    onKeyDown={event=>{
      if(event.target!==event.currentTarget)return;
      if(!started){if(event.key==='Enter'){event.preventDefault();setStarted(true)}return;}
      if(event.key==='Escape'){event.preventDefault();onExit();return}
      if(event.key.toLowerCase()==='b'){event.preventDefault();if(!event.repeat)openPreview();return}
      if(event.key==='Enter'||event.key===' '){event.preventDefault();if(!event.repeat)onBall();return}
    }}>
    <p id="court-instructions" className="sr-only">Use the mouse or trackpad to adjust the view. Scroll to zoom toward your cursor. Drag to orbit; Shift-drag to pan. WASD and arrow keys both move your player. Hold on the opposite court to build power, then release to hit. Move your player to meet the return with the racket to score. Misses and out balls score for the NPC. Press B to browse without playing, Enter to enter Rally, and Escape to leave Rally. Use Switch Ends to exchange player positions. Hover over baseline facts for a gentle highlight. Explore the full court with WASD or arrows before entering Rally.</p>
    <section className="sr-only" aria-label={`${activeProfile.title} profile`}><h1>{activeProfile.title} — Lulu Zhao</h1><p>{activeProfile.focus}</p><p>{activeProfile.biography}</p><ul>{activeProfile.entries.map(entry=><li key={entry.id}>{entry.title}</li>)}</ul></section>
    <p className="sr-only" role="status" aria-live="polite">{activeProfile.title}. {state.phase==='overview'?'Overview. Click the opposite court to hit.':state.phase==='ready'?'Rally ready. Click the opposite court to hit; Enter hits toward the center.':state.phase==='playing'?`Rally in progress. Meet the return with WASD to score and discover ${exploration.entry?.title??'the selected entry'}.`:'Changing view.'}</p>
    {lost?<div className="scene-error" role="alert"><p>The 3D view was interrupted.</p><button onClick={()=>location.reload()}>Reload court</button><button onClick={openPreview}>Browse</button></div>:<SceneBoundary onBrowse={openPreview}><Suspense fallback={null}><World started={started} input={input} night={night} score={score} onAnchor={setAnchor} onNavigate={(d,a)=>{setDirectoryAnchor(a??null);setDestination(d)}} onReset={()=>command('reset')} onExit={onExit} power={power} target={target} onCourtHit={onCourtHit} onBrowse={openPreview} action={action} state={state} path={exploration.entry?.trajectory??'straight'} reduced={reduced} onReady={onReady} onContextLost={onContextLost} onArrived={onArrived} onBall={onBall} onFinished={onFinished} onSwitch={onSwitch} onSelect={onSelect}/></Suspense></SceneBoundary>}
    {started&&<nav aria-label="Court navigation" className="rally-wayfinding" onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}><button onClick={state.phase==='overview'?onBall:onExit}>{state.phase==='overview'?'Play Rally':'Back to Court'}</button><button disabled={!['overview','ready'].includes(state.phase)} onClick={onSwitch}>Switch Ends</button><button onClick={openPreview}>Browse</button>{state.phase==='overview'&&<button onClick={()=>command('reset')}>Reset View</button>}<details className="control-help"><summary aria-label="Controls">?</summary><div><p>Drag to orbit · Shift-drag to pan</p><p>Scroll / pinch to zoom</p><p>WASD / arrows to run</p><p>Click & hold the court to hit</p></div></details></nav>}
    {started&&['overview','ready','playing'].includes(state.phase)&&<MovementPad input={input}/>}
    {(state.phase==='ready'||state.phase==='playing')&&<><div className="rally-live-score" aria-label="Live score"><span>VERSE <b>{pointLabel(score,'humanities')}</b></span><span>CODE <b>{pointLabel(score,'technology')}</b></span></div><div className="rally-result" role="status">{result?result.winner==='visitor'?'RETURN IN · YOUR POINT':result.reason==='out'?'OUT · NPC POINT':'MISSED · NPC POINT':`YOU: ${otherSide(state.side)==='humanities'?'VERSE':'CODE'} · NPC: ${state.side==='humanities'?'VERSE':'CODE'}`}</div></>}
    {!started&&<section className="court-watermark" aria-label="Grand Slam with Lulu" onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}><span>LULU ZHAO</span><h1>Grand Slam<em>with Lulu</em></h1><p>Step onto the court and rally with me.</p><button onClick={()=>setStarted(true)}>Start <span className="start-ball" aria-hidden="true"/></button></section>}
    <div className="world-controls" inert={!started} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')e.stopPropagation()}} onDoubleClick={e=>e.stopPropagation()}>
     <div className="light-modes" role="group" aria-label="Lighting mode">{(['auto','day','night'] as const).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m==='auto'?'Auto':m==='day'?'☀ Day':'☾ Night'}</button>)}</div>

    </div>
    <a className="version-history-link" href="/versions/" onKeyDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>V3 · Version history ↗</a>
    <p className="sr-only" aria-live="polite">Verse: {pointLabel(score,'humanities')}, {score.games.humanities} games. Code: {pointLabel(score,'technology')}, {score.games.technology} games.</p>
    <RolePicker open={choosingRole} onChoose={chooseRole} onClose={()=>{setChoosingRole(false);requestAnimationFrame(()=>main.current?.focus({preventScroll:true}))}}/>
    <Directory anchor={directoryAnchor} destination={destination} onClose={()=>{setDestination(null);main.current?.focus()}}/>
    <ContentCard anchor={anchor} panel={exploration.panel} entry={exploration.entry} entries={activeProfile.entries} onChoose={onChoose} onHit={onHit} onRead={()=>explore({type:'read'})} onClose={onClose}/>
  </main>;
}
