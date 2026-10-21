import type { ChatReply, ChatTurn } from '../../src/types/chat'

export interface ChatRequest {
  message: string
  activeFileId: string | null
  history: ChatTurn[]
}

export interface Chatprovider {
  generateResponse(
    request: ChatRequest,
    context: string,
  ): Promise<ChatReply>
}
