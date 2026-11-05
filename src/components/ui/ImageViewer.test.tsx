// @vitest-environment jsdom
import { act, useCallback, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { ImageViewer } from './ImageViewer'

function ViewerHarness() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button onClick={() => setOpen(true)}>Preview</button>
      {open && (
        <ImageViewer
          src="data:image/png;base64,x"
          name="Example"
          onClose={close}
        />
      )}
    </>
  )
}

it('traps focus, dismisses with Escape or the backdrop, and restores focus', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  try {
    await act(async () => root.render(<ViewerHarness />))
    const trigger = container.querySelector('button')!
    trigger.focus()
    await act(async () => trigger.click())
    const close = document.querySelector<HTMLButtonElement>(
      '[aria-label="Close image"]',
    )!
    expect(document.activeElement).toBe(close)
    expect(
      document.querySelector('[role="dialog"]')?.getAttribute('aria-modal'),
    ).toBe('true')
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(document.activeElement).toBe(close)
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(document.activeElement).toBe(close)
    trigger.focus()
    expect(document.activeElement).toBe(close)
    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      )
    })
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)

    await act(async () => trigger.click())
    await act(async () =>
      document.querySelector<HTMLElement>('.image-viewer img')!.click(),
    )
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    await act(async () =>
      document.querySelector<HTMLElement>('.image-overlay')!.click(),
    )
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  } finally {
    await act(async () => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  }
})
