// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { DecryptedText } from '../ui/DecryptedText'
import { Icon } from '../ui/Icon'
import { TestMotionProvider } from '../../test/TestMotionProvider'
import { MotionProvider } from './MotionProvider'
import { m } from 'framer-motion'

it('renders final decrypted text immediately when tests disable motion', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('div')
  const root = createRoot(container)
  try {
    await act(async () =>
      root.render(
        <TestMotionProvider>
          <DecryptedText text="booting cedz.portfolio ..." />
          <Icon name="file" />
        </TestMotionProvider>,
      ),
    )
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      'booting cedz.portfolio ...',
    )
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    )
  } finally {
    await act(async () => root.unmount())
    container.remove()
  }
})

it('provides the approved synchronous animation features in strict mode', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('div')
  const root = createRoot(container)
  try {
    await act(async () =>
      root.render(
        <MotionProvider animationsEnabled>
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            pane
          </m.div>
        </MotionProvider>,
      ),
    )
    expect(container.textContent).toBe('pane')
  } finally {
    await act(async () => root.unmount())
    container.remove()
  }
})
