import { expect, it } from 'vitest'
import { fuzzySearch } from './launcher/fuzzySearch'
import { matchShortcut } from './shortcuts/registry'
import { classifyTouch, classifyWheel } from './navigation/swipe'

it('fuzzy searches case-insensitive subsequences with stable ties', () => {
  const items = [
    { id: 'a', label: 'Open About' },
    { id: 'b', label: 'Open Projects' },
    { id: 'c', label: 'Theme Blue' },
  ]
  expect(fuzzySearch('opab', items).map((result) => result.item.id)).toEqual([
    'a',
  ])
  expect(fuzzySearch('', items).map((result) => result.item.id)).toEqual([
    'a',
    'b',
    'c',
  ])
})
it('matches shortcuts while protecting typing and composition', () => {
  expect(
    matchShortcut({ key: ' ', ctrlKey: true, metaKey: false, altKey: false }),
  ).toBe('launcher')
  expect(
    matchShortcut({ key: 'k', ctrlKey: false, metaKey: true, altKey: false }),
  ).toBe('launcher')
  expect(
    matchShortcut({
      key: 'b',
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      typing: true,
    }),
  ).toBeNull()
  expect(
    matchShortcut({
      key: 'b',
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      composing: true,
    }),
  ).toBeNull()
  expect(
    matchShortcut({ key: 'b', ctrlKey: true, metaKey: false, altKey: false }),
  ).toBeNull()
  expect(
    matchShortcut({
      key: 'ArrowRight',
      ctrlKey: true,
      metaKey: false,
      altKey: false,
    }),
  ).toBe('next-tab')
})
it('classifies horizontal wheel and two-finger swipes', () => {
  expect(classifyWheel(100, 20, 1000, 0)).toBe(1)
  expect(classifyWheel(-100, 20, 1000, 0)).toBe(-1)
  expect(classifyWheel(100, 90, 1000, 0)).toBe(0)
  expect(classifyWheel(100, 0, 500, 0)).toBe(0)
  expect(
    classifyTouch(
      [
        [0, 0],
        [0, 50],
      ],
      [
        [80, 2],
        [80, 52],
      ],
    ),
  ).toBe(1)
  expect(
    classifyTouch(
      [
        [0, 0],
        [0, 50],
      ],
      [
        [2, 80],
        [2, 130],
      ],
    ),
  ).toBe(0)
  expect(
    classifyTouch(
      [
        [0, 0],
        [100, 0],
      ],
      [
        [30, 0],
        [180, 0],
      ],
    ),
  ).toBe(0)
})
