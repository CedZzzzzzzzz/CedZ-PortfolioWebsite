export type PetMode = 'idle' | 'thinking' | 'talking' | 'eating' | 'playing'
export interface PetState {
  mode: PetMode
  cheer: boolean
  gesture: 'feed' | 'play' | null
  eventId: number
}
export type PetEvent = {
  type:
    | 'poke'
    | 'feed'
    | 'play'
    | 'cheer-ended'
    | 'gesture-ended'
    | 'think'
    | 'talk'
    | 'settle'
}
export const initialPetState: PetState = {
  mode: 'idle',
  cheer: false,
  gesture: null,
  eventId: 0,
}

export function petReducer(state: PetState, event: PetEvent): PetState {
  switch (event.type) {
    case 'poke':
      return { ...state, cheer: true, eventId: state.eventId + 1 }
    case 'feed':
    case 'play':
      return {
        ...state,
        mode:
          state.mode === 'talking' || state.mode === 'thinking'
            ? state.mode
            : event.type === 'feed'
              ? 'eating'
              : 'playing',
        gesture: event.type,
        cheer: true,
        eventId: state.eventId + 1,
      }
    case 'cheer-ended':
      return { ...state, cheer: false }
    case 'gesture-ended':
      return {
        ...state,
        gesture: null,
        mode:
          state.mode === 'eating' || state.mode === 'playing'
            ? 'idle'
            : state.mode,
      }
    case 'think':
      return { ...state, mode: 'thinking' }
    case 'talk':
      return { ...state, mode: 'talking' }
    case 'settle':
      return {
        ...state,
        mode:
          state.gesture === 'feed'
            ? 'eating'
            : state.gesture === 'play'
              ? 'playing'
              : 'idle',
      }
  }
}
