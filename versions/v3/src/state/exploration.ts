import type { Entry } from '../content/profile';
export type ExplorationState = { panel: 'closed' | 'preview' | 'flight' | 'detail'; entry: Entry | null; shot: number | null };
export type ExplorationEvent =
  | { type: 'preview'; entry: Entry | null }
  | { type: 'launch'; shot: number }
  | { type: 'complete'; shot: number }
  | { type: 'read' }
  | { type: 'close' };
export const initialExploration: ExplorationState = { panel: 'closed', entry: null, shot: null };
export function explorationReducer(state: ExplorationState, event: ExplorationEvent): ExplorationState {
  if (event.type === 'close') return initialExploration;
  if (event.type === 'preview') {
    if (state.panel === 'flight') return state;
    return { panel: 'preview', entry: event.entry ? { ...event.entry } : null, shot: null };
  }
  if (event.type === 'launch' && state.panel === 'preview' && state.entry) return { ...state, panel: 'flight', shot: event.shot };
  if (event.type === 'complete' && state.panel === 'flight' && event.shot === state.shot) return { ...state, panel: 'detail', shot: null };
  if (event.type === 'read' && state.panel === 'preview') return { ...state, panel: 'detail' };
  return state;
}
export function selectedEntry(entries: readonly Entry[], id?: string): Entry | undefined {
  return entries.find(entry => entry.id === id) ?? entries[0];
}
