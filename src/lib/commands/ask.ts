import type { ChatBackend } from '../../types/chat'
import type { Command } from '../../types/command'
import { replyEffects } from '../chat/replyEffects'
import { plainTextLine } from './line'

export function createAskCommand(backend: ChatBackend): Command {
  return {
    name: 'ask',
    description: 'Ask Byte a question',
    run(args, ctx) {
      const query = args.join(' ').trim().slice(0, 200)
      if (!query)
        return { lines: [plainTextLine('usage: ask <question>', 'error')] }
      return backend
        .reply(query, { activeFileId: ctx.activeFileId })
        .then((reply) => {
          return {
            lines: [
              plainTextLine(reply.text),
              ...(reply.cards ?? []).map((card) => [
                {
                  text: card.title,
                  fileId: card.fileId,
                  tone: 'accent' as const,
                },
                { text: ` — ${card.description}` },
              ]),
            ],
            effects: replyEffects(reply),
          }
        })
        .catch(() => ({
          lines: [
            plainTextLine(
              'Byte AI is unavailable right now. Please try again in a moment.',
              'error',
            ),
          ],
        }))
    },
  }
}
