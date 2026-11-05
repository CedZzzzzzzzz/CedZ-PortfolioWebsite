import { z } from 'zod'
import { files } from '../../src/content/files'
import { projects } from '../../src/content/projects'
import type { ChatReply } from '../../src/types/chat'

const modelReplySchema = z.object({
  text: z.string().trim().min(1).max(2000),
  openFile: z.string().optional(),
  switchToPlain: z.boolean().optional(),
  projectIds: z.array(z.string()).max(6).optional(),
})

const knownFileIds = new Set(files.map(({ id }) => id))
const knownProjects = new Map(projects.map((project) => [project.id, project]))

export function parseGeminiReply(value: unknown): ChatReply {
  const parsed = modelReplySchema.parse(value)
  const reply: ChatReply = { text: parsed.text }

  if (parsed.openFile && knownFileIds.has(parsed.openFile))
    reply.openFile = parsed.openFile
  if (parsed.switchToPlain !== undefined)
    reply.switchToPlain = parsed.switchToPlain

  const cards = parsed.projectIds?.flatMap((id) => {
    const project = knownProjects.get(id)
    return project
      ? [{ fileId: project.id, title: project.n, description: project.d }]
      : []
  })
  if (cards?.length) reply.cards = cards

  return reply
}
