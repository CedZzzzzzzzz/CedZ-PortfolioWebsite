// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { ResizeGutter } from './ResizeGutter'

it('exposes size limits and resizes with keyboard controls', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('div')
  const root = createRoot(container)
  const resize = vi.fn()
  const pointer = vi.fn()
  try {
    await act(async () =>
      root.render(
        <ResizeGutter
          axis="right"
          value={250}
          dragging={false}
          onResize={resize}
          onPointerDown={pointer}
          onPointerMove={pointer}
          onPointerUp={pointer}
        />,
      ),
    )
    const separator = container.querySelector('[role="separator"]')!
    expect(separator.getAttribute('aria-valuenow')).toBe('250')
    expect(separator.getAttribute('aria-valuemin')).toBe('190')
    expect(separator.getAttribute('aria-valuemax')).toBe('420')
    expect(separator.getAttribute('tabindex')).toBe('0')
    await act(async () => {
      separator.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
      )
    })
    expect(resize).toHaveBeenLastCalledWith(260)
    await act(async () => {
      separator.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
      )
    })
    expect(resize).toHaveBeenLastCalledWith(190)
    await act(async () => {
      separator.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
      )
    })
    expect(resize).toHaveBeenLastCalledWith(420)
  } finally {
    await act(async () => root.unmount())
    vi.unstubAllGlobals()
  }
})
