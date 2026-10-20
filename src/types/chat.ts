export interface ChatContext {
  activeFileId: string | null
}

export interface ChatCard {
  fileId: string
  title: string
  description: string
}

export interface ChatReply {
  text: string
  cards?: ChatCard[]
  openFile?: string
  switchToPlain?: boolean
  petAction?: 'feed' | 'play'
}

export interface ChatBackend {
  reply(query: string, context: ChatContext): Promise<ChatReply>
}
