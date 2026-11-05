import type { Dispatch } from 'react'
import type { Effect, Line } from '../../types/command'
import type { WorkspaceAction } from '../../state/types'
import { mapEffect } from '../terminal/mapEffect'
import { plainTextLine } from '../commands/line'

export interface EffectHandlers {
  openFile: (fileId: string) => void
  dispatch: Dispatch<WorkspaceAction>
  byte: {
    open: () => void
    close: () => void
    interact: (action: 'feed' | 'play') => void
  }
  openExternal: (href: string) => void
}
export function executeEffects(
  effects: readonly Effect[],
  handlers: EffectHandlers,
): Line[] {
  const feedback: Line[] = []
  for (const effect of effects)
    for (const instruction of mapEffect(effect)) {
      switch (instruction.kind) {
        case 'navigate':
          handlers.openFile(instruction.fileId)
          break
        case 'dispatch':
          handlers.dispatch(instruction.action)
          break
        case 'feedback':
          feedback.push(
            plainTextLine(
              instruction.text,
              instruction.error ? 'error' : 'muted',
            ),
          )
          break
        case 'pet':
          handlers.byte.interact(instruction.action)
          feedback.push(
            plainTextLine(
              instruction.action === 'feed' ? 'nom nom 🍙' : 'Whoosh!',
            ),
          )
          break
        case 'byte':
          if (instruction.open) handlers.byte.open()
          else handlers.byte.close()
          break
        case 'external':
          handlers.openExternal(instruction.href)
          break
      }
    }
  return feedback
}
