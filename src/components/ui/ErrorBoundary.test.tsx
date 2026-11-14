// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

function Broken(): never {
  throw new Error('chunk missing')
}

it('renders children, and the fallback once a child throws', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const container = document.createElement('div')
  const root = createRoot(container)
  try {
    await act(async () =>
      root.render(<ErrorBoundary fallback="failed">fine</ErrorBoundary>),
    )
    expect(container.textContent).toBe('fine')
    await act(async () =>
      root.render(
        <ErrorBoundary fallback="failed">
          <Broken />
        </ErrorBoundary>,
      ),
    )
    expect(container.textContent).toBe('failed')
  } finally {
    await act(async () => root.unmount())
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  }
})
