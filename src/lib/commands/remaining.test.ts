import { describe, expect, it } from 'vitest'
import { commandRegistry } from './registry'
import { commandContent } from '../terminal/commandContent'
import { themes } from '../../theme/themes'
import { createAskCommand } from './ask'

const context = {
  content: commandContent,
  themes,
  activeFileId: 'about',
  commands: commandRegistry.commands,
}
describe('remaining commands', () => {
  it.each(['about', 'experience', 'skills', 'projects', 'resume', 'contact'])(
    '%s opens its page synchronously',
    (name) => {
      const result = commandRegistry.execute(name, context)
      expect(result).not.toBeInstanceOf(Promise)
      expect(result).toMatchObject({
        effects: [{ kind: 'open', fileId: name }],
      })
    },
  )
  it.each([
    'open about.md',
    'CAT about',
    'code ABOUT.MD',
    'open projects/ecobench.md',
    'open projects/',
  ])('resolves %s', async (input) => {
    expect(
      (await commandRegistry.execute(input, context)).effects?.[0].kind,
    ).toBe('open')
  })
  it.each([
    'open',
    'open nonexistent',
    'theme purple',
    'theme dark extra',
    'ask',
  ])('reports invalid arguments: %s', async (input) => {
    expect(
      (await commandRegistry.execute(input, context)).lines[0][0].tone,
    ).toBe('error')
  })
  it('returns state, pet, and browser effects', async () => {
    for (const [input, effect] of [
      ['theme BLUE', { kind: 'theme', theme: 'blue' }],
      ['plain', { kind: 'plain', enabled: true }],
      ['byte', { kind: 'byte', open: true }],
      ['feed', { kind: 'pet', action: 'feed' }],
      ['play', { kind: 'pet', action: 'play' }],
      ['github', { kind: 'external', href: 'https://github.com/CedZzzzzzzzz' }],
    ] as const)
      expect((await commandRegistry.execute(input, context)).effects).toEqual([
        effect,
      ])
  })
  it('provides static IP, portfolio counts, shortcut help, and sudo feedback', async () => {
    for (const input of ['ip', 'fastfetch', 'neofetch', 'keys', 'sudo'])
      expect(
        (await commandRegistry.execute(input, context)).lines.length,
      ).toBeGreaterThan(0)
    expect(
      JSON.stringify(await commandRegistry.execute('ip', context)),
    ).toContain('127.0.0.1')
    expect(await commandRegistry.execute('neofetch', context)).toEqual(
      await commandRegistry.execute('fastfetch', context),
    )
  })
  it('converts backend cards and every reply effect without putting services on ctx', async () => {
    const command = createAskCommand({
      reply: async (query, ctx) => {
        expect(query).toBe('this page')
        expect(ctx.activeFileId).toBe('about')
        return {
          text: 'reply',
          cards: [
            { fileId: 'ecobench', title: 'ECOBENCH', description: 'energy' },
          ],
          openFile: 'projects',
          switchToPlain: true,
          petAction: 'feed',
        }
      },
    })
    const result = await command.run(['this', 'page'], context)
    expect(result.lines[1][0]).toMatchObject({ fileId: 'ecobench' })
    expect(result.effects).toEqual([
      { kind: 'open', fileId: 'projects' },
      { kind: 'plain', enabled: true },
      { kind: 'pet', action: 'feed' },
    ])
  })
})
