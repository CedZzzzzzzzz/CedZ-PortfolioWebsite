import type { ChatReply } from '../../types/chat'
import type { Effect } from '../../types/command'

export function replyEffects(reply: ChatReply): Effect[] {
  const effects: Effect[] = []
  if (reply.openFile) effects.push({ kind: 'open', fileId: reply.openFile })
  if (reply.switchToPlain !== undefined)
    effects.push({ kind: 'plain', enabled: reply.switchToPlain })
  if (reply.petAction) effects.push({ kind: 'pet', action: reply.petAction })
  return effects
}
