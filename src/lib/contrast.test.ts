import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { contrastRatio } from './contrast'
import { themes } from '../theme/themes'

function mixedColor(foreground: string, background: string, amount: number) {
  const channels = (hex: string) => {
    const value = hex.length === 4
      ? [...hex.slice(1)].map((char) => char + char).join('')
      : hex.slice(1)
    return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16))
  }
  const foregroundChannels = channels(foreground)
  const backgroundChannels = channels(background)
  return (
    '#' +
    foregroundChannels
      .map((channel, index) =>
        Math.round(channel * amount + backgroundChannels[index] * (1 - amount))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

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
    [...block!.matchAll(/--([\w-]+):\s*(#[\da-f]+);/gi)].map((match) => [
      match[1],
      match[2],
    ]),
  )
  const ratios = {
    fgBg: contrastRatio(tokens.fg, tokens.bg),
    fgCard: contrastRatio(tokens.fg, tokens.card),
    mutCard: contrastRatio(tokens.mut, tokens.card),
    mutBg: contrastRatio(tokens.mut, tokens.bg),
    acCard: contrastRatio(tokens.ac, tokens.card),
    acBg: contrastRatio(tokens.ac, tokens.bg),
    ac2Card: contrastRatio(tokens.ac2, tokens.card),
    primaryText: contrastRatio(tokens.bg, tokens.ac),
    selectedOnCard: contrastRatio(
      tokens.ac,
      mixedColor(tokens.ac, tokens.card, 0.12),
    ),
    subtleBorderCard: contrastRatio(tokens.bd, tokens.card),
    subtleBorderBg: contrastRatio(tokens.bd, tokens.bg),
    strongBorderCard: contrastRatio(tokens['bd-strong'], tokens.card),
    strongBorderBg: contrastRatio(tokens['bd-strong'], tokens.bg),
    okCard: contrastRatio(tokens.ok, tokens.card),
    warnCard: contrastRatio(tokens.warn, tokens.card),
  }
  expect(ratios.fgBg).toBeGreaterThanOrEqual(4.5)
  expect(ratios.fgCard).toBeGreaterThanOrEqual(4.5)
  expect(ratios.mutCard).toBeGreaterThanOrEqual(
    theme === 'blue' || theme === 'fire' ? 4.6 : 4.5,
  )
  expect(ratios.mutBg).toBeGreaterThanOrEqual(4.5)
  expect(ratios.acCard).toBeGreaterThanOrEqual(3)
  expect(ratios.acBg).toBeGreaterThanOrEqual(3)
  expect(ratios.ac2Card).toBeGreaterThanOrEqual(3)
  expect(ratios.primaryText).toBeGreaterThanOrEqual(4.5)
  expect(ratios.selectedOnCard).toBeGreaterThanOrEqual(4.5)
  expect(ratios.strongBorderCard).toBeGreaterThanOrEqual(3)
  expect(ratios.strongBorderBg).toBeGreaterThanOrEqual(3)
  expect(ratios.okCard).toBeGreaterThanOrEqual(4.5)
  expect(ratios.warnCard).toBeGreaterThanOrEqual(4.5)
  console.info(theme, JSON.stringify(ratios))
})
