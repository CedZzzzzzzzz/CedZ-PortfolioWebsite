import { describe, expect, it } from 'vitest'
import type { CommandResult, Line } from '../../types/command'
import type { ContributionCalendar } from '../../types/github'
import { commandContent } from '../terminal/commandContent'
import { themes } from '../../theme/themes'
import { commandRegistry } from './registry'

const calendar: ContributionCalendar = {
  login: 'someone',
  total: 9,
  weeks: Array.from({ length: 30 }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => ({
      date: `2026-01-${String((week % 28) + 1).padStart(2, '0')}`,
      count: weekday === 2 ? 3 : 0,
      level: weekday === 2 ? (3 as const) : (0 as const),
    })),
  ),
}

const context = (github: ContributionCalendar | null) => ({
  content: commandContent,
  themes,
  activeFileId: null,
  github,
})

const run = (input: string, github: ContributionCalendar | null = calendar) =>
  commandRegistry.execute(input, context(github)) as CommandResult

const text = (lines: readonly Line[]) =>
  lines.map((line) => line.map((segment) => segment.text).join('')).join('\n')

const graphs = (lines: readonly Line[]) =>
  lines.flat().flatMap((segment) => (segment.graph ? [segment.graph] : []))

describe('github command', () => {
  it('prints a 26-week graph, stats, and a link without leaving the page', () => {
    const result = run('github')
    expect(result.effects).toBeUndefined()
    expect(graphs(result.lines)).toEqual([{ weeks: 26, variant: 'scan' }])
    expect(text(result.lines)).toMatch(/streak {3}0 days now · best 1/)
    expect(text(result.lines)).toMatch(/tue {6}█{18} \d+/)
    expect(result.lines.flat().find((s) => s.href)?.href).toBe(
      `https://github.com/${commandContent.profile.github}`,
    )
  })

  it('shows 53 weeks with --year and rejects other arguments', () => {
    expect(graphs(run('github --YEAR').lines)).toEqual([
      { weeks: 53, variant: 'scan' },
    ])
    expect(run('github --month').lines[0][0]).toMatchObject({ tone: 'error' })
  })

  it('falls back to the link when GitHub is unavailable', () => {
    const result = run('github', null)
    expect(graphs(result.lines)).toEqual([])
    expect(text(result.lines)).toMatch(/unavailable/)
    expect(result.lines.flat().some((s) => s.href)).toBe(true)
  })
})

describe('graph extras', () => {
  it('fastfetch summarizes the person, with a sparkline once data loads', () => {
    const output = text(run('fastfetch').lines)
    expect(output).toContain(commandContent.profile.name)
    expect(output).toMatch(/now {7}\S/)
    expect(output).toMatch(/github {4}[▁-█]{12} 3 this week · 12w/)
    expect(text(run('fastfetch', null).lines)).toMatch(
      /github {4}github\.com\//,
    )
    expect(text(run('fastfetch').lines)).not.toMatch(/active file/)
  })

  it('hunt hands the graph to Byte, or says it cannot find it', () => {
    expect(graphs(run('hunt').lines)).toEqual([{ weeks: 26, variant: 'hunt' }])
    expect(graphs(run('hunt', null).lines)).toEqual([])
  })
})
