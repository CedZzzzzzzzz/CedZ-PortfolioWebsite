import { experience } from '../../content/experience'
import { files } from '../../content/files'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'
import { skills } from '../../content/skills'
import { socials } from '../../content/socials'
import type { ChatBackend, ChatContext, ChatReply } from '../../types/chat'

interface Intent {
  pattern: RegExp
  /** Keywords that also match when misspelled by one edit ("conatct"). */
  typos?: string[]
  reply: (context: ChatContext) => ChatReply
}

/** True when the words differ by one insert, delete, replace, or adjacent swap. */
function isOneEditApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0
  while (i < a.length && a[i] === b[i]) i++
  return (
    a.slice(i + 1) === b.slice(i + 1) ||
    a.slice(i + 1) === b.slice(i) ||
    a.slice(i) === b.slice(i + 1) ||
    (a[i] === b[i + 1] &&
      a[i + 1] === b[i] &&
      a.slice(i + 2) === b.slice(i + 2))
  )
}

function describeActiveFile({ activeFileId }: ChatContext): ChatReply {
  const file = files.find(({ id }) => id === activeFileId)
  return {
    text: file
      ? `You're looking at ${file.name}. Ask me about projects, experience, resume, or contact to jump elsewhere.`
      : 'No file is open yet. Try: projects, experience, resume, contact.',
  }
}

// Order matters: the first matching intent wins.
const intents: Intent[] = [
  {
    pattern:
      /\bthis page\b|\bcurrent (page|file)\b|\bwhat am i (looking|reading)/,
    reply: describeActiveFile,
  },
  {
    pattern: /\b(omarchy|layout|tiling|panes?)\b/,
    typos: ['layout'],
    reply: () => ({
      text: 'The layout is a tiling workspace: explorer on the left, editor and terminal in the middle, profile on the right. Drag the gutters to resize.',
    }),
  },
  {
    pattern:
      /\b(experience|education|intern(ship)?s?|work(ed)?|school|stud(y|ies|ying))\b/,
    typos: ['experience', 'education', 'internship'],
    reply: () => ({
      text: `${profile.role}. Latest role: ${experience[0].t} at ${experience[0].o} (${experience[0].w}).`,
      openFile: 'experience',
    }),
  },
  {
    pattern: /\b(resume|cv)\b/,
    typos: ['resume'],
    reply: () => ({
      text: 'Opening the resume. You can download the PDF from there.',
      openFile: 'resume',
    }),
  },
  {
    pattern: /\b(projects?|built|build|made)\b/,
    typos: ['project', 'projects'],
    reply: () => ({
      text: `${projects.length} projects. Pick one:`,
      openFile: 'projects',
      cards: projects.map(({ id, n, d }) => ({
        fileId: id,
        title: n,
        description: d,
      })),
    }),
  },
  {
    pattern: /\b(skills?|stack|tech(nolog(y|ies))?|languages?)\b/,
    typos: ['skills'],
    reply: () => ({
      text: `Skill groups: ${skills.map(({ name }) => name).join(', ')}.`,
      openFile: 'skills',
    }),
  },
  {
    pattern: /\b(about|who)\b/,
    reply: () => ({
      text: `${profile.name}: ${profile.role}, focused on ${profile.focus}.`,
      openFile: 'about',
    }),
  },
  {
    pattern: /\b(contact|socials?|email|linkedin|github|reach|hire)\b/,
    typos: ['contact', 'contacts', 'socials', 'email', 'linkedin', 'github'],
    reply: () => ({
      text: `Find Marcus on ${socials.map(({ label }) => label).join(', ')}.`,
      openFile: 'contact',
    }),
  },
  {
    pattern: /^(hi|hello|hey|yo|kumusta)\b/,
    reply: () => ({
      text: 'Hi! Ask me about projects, experience, resume, or contact.',
    }),
  },
]

const fallback: ChatReply = {
  text: "I'm just a tiny dragon ninja 🐉 Try: projects, experience, resume, contact.",
}

export const keywordBackend: ChatBackend = {
  reply(query, context) {
    const normalized = query.toLowerCase().trim()
    // Exact keywords win; typo matching only runs when nothing matched.
    const words = normalized.split(/[^a-z]+/).filter((word) => word.length > 3)
    const intent =
      intents.find(({ pattern }) => pattern.test(normalized)) ??
      intents.find(({ typos }) =>
        typos?.some((keyword) =>
          words.some((word) => isOneEditApart(word, keyword)),
        ),
      )
    return Promise.resolve(intent ? intent.reply(context) : fallback)
  },
}
