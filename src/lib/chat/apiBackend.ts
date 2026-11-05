import { z } from 'zod'
import { files } from '../../content/files'
import { projects } from '../../content/projects'
import type { ChatBackend, ChatReply } from '../../types/chat'

const responseSchema = z.object({
  text: z.string().trim().min(1).max(2000),
  openFile: z.string().optional(),
  switchToPlain: z.boolean().optional(),
  cards: z
    .array(
      z.object({
        fileId: z.string(),
        title: z.string().max(100),
        description: z.string().max(400),
      }),
    )
    .max(6)
    .optional(),
})
const streamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({ type: z.literal('complete'), reply: responseSchema }),
  z.object({ type: z.literal('error'), message: z.string() }),
])

const knownFileIds = new Set(files.map(({ id }) => id))
const knownProjects = new Map(projects.map((project) => [project.id, project]))

function mapReply(data: z.infer<typeof responseSchema>): ChatReply {
  const reply: ChatReply = { text: data.text }
  if (data.openFile && knownFileIds.has(data.openFile))
    reply.openFile = data.openFile
  if (data.switchToPlain !== undefined) reply.switchToPlain = data.switchToPlain

  const cards = data.cards?.flatMap((card) => {
    const project = knownProjects.get(card.fileId)
    return project
      ? [
          {
            fileId: project.id,
            title: project.n,
            description: project.d,
          },
        ]
      : []
  })
  if (cards?.length) reply.cards = cards
  return reply
}

async function readStream(
  response: Response,
  onText?: (text: string) => void,
): Promise<ChatReply> {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('Byte AI returned an empty stream')

  const decoder = new TextDecoder()
  let buffer = ''
  let reply: ChatReply | undefined

  function readLine(line: string) {
    if (!line.trim()) return
    const parsed = streamEventSchema.parse(JSON.parse(line))
    if (parsed.type === 'text') onText?.(parsed.text)
    else if (parsed.type === 'error') throw new Error(parsed.message)
    else reply = mapReply(parsed.reply)
  }

  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    lines.forEach(readLine)
    if (done) break
  }
  readLine(buffer)
  if (!reply) throw new Error('Byte AI did not finish its reply')
  return reply
}

export const apiBackend: ChatBackend = {
  async reply(query, context, onText) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        activeFileId: context.activeFileId,
        history: (context.history ?? []).slice(-8),
      }),
    })

    if (!response.ok) throw new Error('Byte AI request failed')

    if (response.headers.get('content-type')?.includes('application/x-ndjson'))
      return readStream(response, onText)

    const parsed = responseSchema.safeParse(await response.json())
    if (!parsed.success) throw new Error('Byte AI returned an invalid reply')
    return mapReply(parsed.data)
  },
}
