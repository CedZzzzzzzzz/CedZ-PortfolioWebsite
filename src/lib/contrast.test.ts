import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { contrastRatio } from './contrast'
import { themes } from '../theme/themes'

it('calculates known ratios symmetrically and accepts short hex', () => {
  expect(contrastRatio('#000', '#fff')).toBe(21)
  expect(contrastRatio('#abcdef', '#abcdef')).toBe(1)
  expect(contrastRatio('#fff', '#000')).toBe(21)
  expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.478, 3)
  expect(() => contrastRatio('red', '#000')).toThrow()
})

const css = readFileSync(
  new URL('../theme/tokens.css', import.meta.url),
  'utf8',
)
it.each(themes)('%s CSS tokens meet required contrast', (theme) => {
  const block = css.match(
    new RegExp(`:root\\[data-theme='${theme}'\\]\\s*\\{([^}]+)\\}`),
  )?.[1]
  expect(block).toBeDefined()
  const tokens = Object.fromEntries(
    [...block!.matchAll(/--([\w]+):\s*(#[\da-f]+);/gi)].map((match) => [
      match[1],
      match[2],
    ]),
  )
  const ratios = {
    fgBg: contrastRatio(tokens.fg, tokens.bg),
    fgCard: contrastRatio(tokens.fg, tokens.card),
    mutCard: contrastRatio(tokens.mut, tokens.card),
    acCard: contrastRatio(tokens.ac, tokens.card),
  }
  expect(ratios.fgBg).toBeGreaterThanOrEqual(4.5)
  expect(ratios.fgCard).toBeGreaterThanOrEqual(4.5)
  expect(ratios.mutCard).toBeGreaterThanOrEqual(
    theme === 'blue' || theme === 'fire' ? 4.6 : 4.5,
  )
  expect(ratios.acCard).toBeGreaterThanOrEqual(3)
  console.info(theme, JSON.stringify(ratios))
})
