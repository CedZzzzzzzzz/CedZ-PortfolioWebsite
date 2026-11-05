import type { ChatBackend, ChatReply } from '../../types/chat'
import { apiBackend } from './apiBackend'

function localAction(query: string): ChatReply | null {
  const normalized = query
    .toLowerCase()
    .trim()
    .replace(/[.!?]+$/, '')

  if (/^(feed|feed byte|eat|have some rice)$/.test(normalized))
    return { text: 'nom nom 🍙', petAction: 'feed' }
  if (/^(play|play byte|backflip)$/.test(normalized))
    return { text: 'Whoosh!', petAction: 'play' }
  if (/^(plain|plain view|switch to plain view|simple view)$/.test(normalized))
    return { text: 'Switching to the portfolio view.', switchToPlain: true }

  return null
}

export const byteBackend: ChatBackend = {
  async reply(query, context, onText) {
    const action = localAction(query)
    return action ?? apiBackend.reply(query, context, onText)
  },
}
