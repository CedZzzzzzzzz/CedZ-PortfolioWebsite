import { readStoredJson, writeStoredJson, type JsonStorage } from './storage'

export interface PaneSizes {
  left: number
  right: number
  rowRatio: number
}
export type ResizeAxis = keyof PaneSizes
export const defaultPaneSizes: PaneSizes = {
  left: 210,
  right: 250,
  rowRatio: 0.5,
}
export const paneLimits = {
  left: { min: 140, max: 420 },
  right: { min: 190, max: 420 },
  rowRatio: { min: 0.2, max: 0.8 },
}

export function clampPaneSize(axis: ResizeAxis, value: number): number {
  if (!Number.isFinite(value)) return defaultPaneSizes[axis]
  return Math.min(paneLimits[axis].max, Math.max(paneLimits[axis].min, value))
}

export function sizeFromPointer(
  axis: ResizeAxis,
  startValue: number,
  startPointer: number,
  pointer: number,
  gridHeight: number,
): number {
  const delta = pointer - startPointer
  const change =
    axis === 'rowRatio' ? delta / Math.max(1, gridHeight - 10) : delta
  return clampPaneSize(axis, startValue + (axis === 'right' ? -change : change))
}

export function loadPaneSizes(storage: JsonStorage | null): PaneSizes {
  if (!storage) return { ...defaultPaneSizes }
  const sizes = readStoredJson(
    storage,
    'cedz-layout',
    defaultPaneSizes,
    (value): value is PaneSizes => {
      if (typeof value !== 'object' || value === null) return false
      const record = value as Record<string, unknown>
      return ['left', 'right', 'rowRatio'].every(
        (key) =>
          typeof record[key] === 'number' && Number.isFinite(record[key]),
      )
    },
  )
  return {
    left: clampPaneSize('left', sizes.left),
    right: clampPaneSize('right', sizes.right),
    rowRatio: clampPaneSize('rowRatio', sizes.rowRatio),
  }
}

export function savePaneSizes(
  storage: JsonStorage | null,
  sizes: PaneSizes,
): void {
  if (storage) writeStoredJson(storage, 'cedz-layout', sizes)
}
