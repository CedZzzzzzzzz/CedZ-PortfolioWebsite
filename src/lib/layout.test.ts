import { describe, expect, it, vi } from 'vitest'
import {
  clampPaneSize,
  defaultPaneSizes,
  loadPaneSizes,
  savePaneSizes,
  sizeFromPointer,
} from './layout'

describe('pane resize math', () => {
  it('uses drag deltas without jumping to the pointer position', () => {
    expect(sizeFromPointer('left', 210, 225, 245, 600)).toBe(230)
    expect(sizeFromPointer('right', 250, 900, 920, 600)).toBe(230)
    expect(sizeFromPointer('rowRatio', 0.5, 300, 359, 600)).toBeCloseTo(0.6)
  })

  it('clamps each dimension at both ends', () => {
    expect(clampPaneSize('left', 0)).toBe(140)
    expect(clampPaneSize('left', 999)).toBe(420)
    expect(clampPaneSize('right', 0)).toBe(190)
    expect(clampPaneSize('right', 999)).toBe(420)
    expect(clampPaneSize('rowRatio', 0)).toBe(0.2)
    expect(clampPaneSize('rowRatio', 1)).toBe(0.8)
    expect(clampPaneSize('left', NaN)).toBe(210)
    expect(sizeFromPointer('rowRatio', 0.5, 0, 100, 0)).toBe(0.8)
  })
})

describe('pane persistence', () => {
  it('loads valid numbers and clamps values outside the limits', () => {
    const storage = {
      getItem: () => '{"left":100,"right":900,"rowRatio":0.7}',
      setItem: vi.fn(),
    }
    expect(loadPaneSizes(storage)).toEqual({
      left: 140,
      right: 420,
      rowRatio: 0.7,
    })
  })

  it.each([
    'null',
    '[]',
    '{}',
    'bad json',
    '{"left":"210","right":250,"rowRatio":0.5}',
    '{"left":210,"right":250,"rowRatio":null}',
  ])('resets the entire layout for invalid data: %s', (value) => {
    expect(loadPaneSizes({ getItem: () => value, setItem: vi.fn() })).toEqual(
      defaultPaneSizes,
    )
  })

  it('handles missing and unavailable storage', () => {
    expect(loadPaneSizes(null)).toEqual(defaultPaneSizes)
    expect(loadPaneSizes({ getItem: () => null, setItem: vi.fn() })).toEqual(
      defaultPaneSizes,
    )
    expect(
      loadPaneSizes({
        getItem: () => {
          throw new Error('blocked')
        },
        setItem: vi.fn(),
      }),
    ).toEqual(defaultPaneSizes)
  })

  it('writes the required key and tolerates failed writes', () => {
    const setItem = vi.fn()
    savePaneSizes({ getItem: () => null, setItem }, defaultPaneSizes)
    expect(setItem).toHaveBeenCalledWith(
      'cedz-layout',
      JSON.stringify(defaultPaneSizes),
    )
    expect(() =>
      savePaneSizes(
        {
          getItem: () => null,
          setItem: () => {
            throw new Error('quota')
          },
        },
        defaultPaneSizes,
      ),
    ).not.toThrow()
  })
})
