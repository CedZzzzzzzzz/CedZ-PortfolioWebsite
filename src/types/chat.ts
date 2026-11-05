export interface ChatContext {
  activeFileId: string | null
  history?: ChatTurn[]
}

export interface ChatTurn {
  question: string
  answer: string
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
  reply(
    query: string,
    context: ChatContext,
    onText?: (text: string) => void,
  ): Promise<ChatReply>
}
