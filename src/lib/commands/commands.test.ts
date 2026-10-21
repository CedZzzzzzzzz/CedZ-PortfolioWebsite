import { describe, expect, it } from 'vitest'
import { about } from '../../content/about'
import { experience } from '../../content/experience'
import { files } from '../../content/files'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'
import { skills } from '../../content/skills'
import { socials } from '../../content/socials'
import type { Command } from '../../types/command'
import { createCommandRegistry, commandRegistry } from './registry'
import { parseCommand } from './parseCommand'

const context = {
  content: {
    about: about.intro,
    experience,
    files,
    profile,
    projects,
    skills,
    socials,
  },
  themes: ['dark', 'blue', 'tokyo', 'fire', 'scar'] as const,
  activeFileId: null,
}

describe('parseCommand', () => {
  it('trims whitespace, normalizes the name, and keeps argument case', () => {
    expect(parseCommand('  OPEN   About.md  NOW  ')).toEqual({
      name: 'open',
      args: ['About.md', 'NOW'],
    })
    expect(parseCommand('  ')).toEqual({ name: '', args: [] })
  })
})

describe('command registry', () => {
  it('lists clickable commands and files', async () => {
    expect(
      (await commandRegistry.execute('help', context)).lines[0][0],
    ).toEqual({
      text: 'help',
      tone: 'accent',
      command: 'help',
    })
    expect((await commandRegistry.execute('ls', context)).lines).toContainEqual(
      [{ text: 'ecobench.md', tone: 'accent', fileId: 'ecobench' }],
    )
  })

  it('returns a clear signal without output', () => {
    expect(commandRegistry.execute('CLEAR', context)).toEqual({
      lines: [],
      clear: true,
    })
  })

  it('resolves aliases and completes names without regard to case', async () => {
    const command: Command = {
      name: 'Open',
      description: 'open a file',
      aliases: ['Cat'],
      run: (args) => ({ lines: [[{ text: args.join(' ') }]] }),
    }
    const registry = createCommandRegistry([command])
    expect(registry.find('cAt')).toBe(command)
    expect((await registry.execute('CAT about', context)).lines).toEqual([
      [{ text: 'about' }],
    ])
    expect(registry.complete('C')).toEqual(['cat'])
    expect(registry.complete('op')).toEqual(['open'])
  })

  it('rejects duplicate names and aliases case-insensitively', () => {
    const first: Command = {
      name: 'help',
      description: 'first',
      aliases: ['assist'],
      run: () => ({ lines: [] }),
    }
    const second: Command = {
      name: 'ASSIST',
      description: 'second',
      run: () => ({ lines: [] }),
    }
    expect(() => createCommandRegistry([first, second])).toThrow(
      /Duplicate command/,
    )
  })

  it('returns an error-toned line for unknown commands', async () => {
    expect((await commandRegistry.execute('missing', context)).lines).toEqual([
      [{ text: 'command not found: missing (try help)', tone: 'error' }],
    ])
  })

  it('passes effects through without performing them', async () => {
    const command: Command = {
      name: 'example',
      description: 'example',
      run: () => ({ lines: [], effects: [{ kind: 'open', fileId: 'about' }] }),
    }
    expect(
      (await createCommandRegistry([command]).execute('example', context))
        .effects,
    ).toEqual([{ kind: 'open', fileId: 'about' }])
  })
})
