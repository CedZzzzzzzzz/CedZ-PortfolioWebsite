import type { Effect } from '../../types/command'
import type { WorkspaceAction } from '../../state/types'
import { safeHref } from './safeHref'

export type TerminalInstruction =
  | { kind: 'navigate'; fileId: string }
  | { kind: 'dispatch'; action: WorkspaceAction }
  | { kind: 'pet'; action: 'feed' | 'play' }
  | { kind: 'byte'; open: boolean }
  | { kind: 'external'; href: string }
  | { kind: 'feedback'; text: string; error?: boolean }

export function mapEffect(effect: Effect): TerminalInstruction[] {
  switch (effect.kind) {
    case 'open':
      return [{ kind: 'navigate', fileId: effect.fileId }]
    case 'theme':
      return [
        {
          kind: 'dispatch',
          action: { type: 'set-theme', theme: effect.theme },
        },
      ]
    case 'plain':
      return [
        {
          kind: 'dispatch',
          action: { type: 'set-plain-view', enabled: effect.enabled },
        },
      ]
    case 'byte':
      return [{ kind: 'byte', open: effect.open }]
    case 'pet':
      return [{ kind: 'pet', action: effect.action }]
    case 'external': {
      const href = safeHref(effect.href)
      return href
        ? [{ kind: 'external', href }]
        : [
            {
              kind: 'feedback',
              text: 'Cannot open an invalid or unsupported URL.',
              error: true,
            },
          ]
    }
  }
}
