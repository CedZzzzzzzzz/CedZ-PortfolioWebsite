import type {
  Command,
  CommandContext,
  CommandResult,
  CommandSummary,
} from '../../types/command'
import { clearCommand } from './clear'
import { helpCommand } from './help'
import { plainTextLine } from './line'
import { lsCommand } from './ls'
import { parseCommand } from './parseCommand'
import { byteBackend } from '../chat/byteBackend'
import { createAskCommand } from './ask'
import { openCommand } from './open'
import { aboutCommand } from './about'
import { experienceCommand } from './experience'
import { skillsCommand } from './skills'
import { projectsCommand } from './projects'
import { resumeCommand } from './resume'
import { contactCommand } from './contact'
import { plainCommand } from './plain'
import { fastfetchCommand } from './fastfetch'
import { themeCommand } from './theme'
import { feedCommand } from './feed'
import { playCommand } from './play'
import { byteCommand } from './byte'
import { ipCommand } from './ip'
import { githubCommand } from './github'
import { keysCommand } from './keys'
import { sudoCommand } from './sudo'

export interface CommandRegistry {
  commands: readonly CommandSummary[]
  find(name: string): Command | undefined
  complete(prefix: string): string[]
  execute(
    input: string,
    context: Omit<CommandContext, 'commands'>,
  ): CommandResult | Promise<CommandResult>
}

export function createCommandRegistry(
  commands: readonly Command[],
): CommandRegistry {
  const names = new Map<string, Command>()

  for (const command of commands) {
    for (const name of [command.name, ...(command.aliases ?? [])]) {
      const key = name.toLowerCase()
      if (names.has(key)) {
        throw new Error(`Duplicate command name or alias: ${name}`)
      }
      names.set(key, command)
    }
  }

  const summaries = commands.map(({ name, description, aliases }) => ({
    name,
    description,
    aliases,
  }))

  return {
    commands: summaries,
    find(name) {
      return names.get(name.toLowerCase())
    },
    complete(prefix) {
      const query = prefix.toLowerCase()
      return [...names.keys()].filter((name) => name.startsWith(query))
    },
    execute(input, context) {
      const { name, args } = parseCommand(input)
      if (!name) return { lines: [] }

      const command = names.get(name)
      if (!command) {
        return {
          lines: [
            plainTextLine(`command not found: ${name} (try help)`, 'error'),
          ],
        }
      }

      return command.run(args, { ...context, commands: summaries })
    },
  }
}

export const commandRegistry = createCommandRegistry([
  helpCommand,
  lsCommand,
  clearCommand,
  openCommand,
  aboutCommand,
  experienceCommand,
  skillsCommand,
  projectsCommand,
  resumeCommand,
  contactCommand,
  plainCommand,
  fastfetchCommand,
  themeCommand,
  feedCommand,
  playCommand,
  byteCommand,
  createAskCommand(byteBackend),
  ipCommand,
  githubCommand,
  keysCommand,
  sudoCommand,
])
