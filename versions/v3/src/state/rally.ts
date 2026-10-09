export type Side = 'technology' | 'humanities';
export type Phase = 'overview' | 'entering' | 'ready' | 'playing' | 'leaving' | 'switching';
export type RallyState = { phase: Phase; shot: number; side: Side; returnTo: 'overview' | 'ready' };
export type RallyEvent = 'enter' | 'arrived' | 'hit' | 'finished' | 'exit' | 'switch' | Side;
export const initialRally: RallyState = { phase: 'overview', shot: 0, side: 'technology', returnTo: 'overview' };
export const otherSide = (side: Side): Side => side === 'technology' ? 'humanities' : 'technology';
export const sideSign = (side: Side) => side === 'technology' ? 1 : -1;
export function rallyReducer(state: RallyState, event: RallyEvent): RallyState {
  if (event === 'switch' || event === 'humanities' || event === 'technology') {
    if (state.phase !== 'overview' && state.phase !== 'ready') return state;
    const side = event === 'switch' ? otherSide(state.side) : event;
    return side === state.side ? state : { ...state, side, phase: 'switching', returnTo: state.phase };
  }
  if (event === 'arrived' && state.phase === 'switching') return { ...state, phase: state.returnTo };
  if (state.phase === 'switching') return state;
  if (event === 'exit' && state.phase !== 'overview' && state.phase !== 'leaving') return { ...state, phase: 'leaving' };
  if (event === 'enter' && state.phase === 'overview') return { ...state, phase: 'entering' };
  if (event === 'arrived' && state.phase === 'entering') return { ...state, phase: 'ready' };
  if (event === 'arrived' && state.phase === 'leaving') return { ...state, phase: 'overview' };
  if (event === 'hit' && state.phase === 'ready') return { ...state, phase: 'playing', shot: state.shot + 1 };
  if (event === 'finished' && state.phase === 'playing') return { ...state, phase: 'ready' };
  return state;
}
