// @vitest-environment jsdom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useBlink } from './useBlink'
import { useTypewriter } from './useTypewriter'
import { usePausableTimeout } from './usePausableTimeout'

let root: Root, container: HTMLDivElement
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(async () => {
  await act(async () => root.unmount())
  expect(vi.getTimerCount()).toBe(0)
  container.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})
async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}

it('types two Unicode characters per tick, pauses, restarts for new text, and finishes immediately for reduced motion', async () => {
  function Probe({
    text,
    active,
    reduced,
  }: {
    text: string
    active: boolean
    reduced: boolean
  }) {
    const result = useTypewriter(text, active, reduced)
    return <output data-complete={result.complete}>{result.text}</output>
  }
  const render = async (text: string, active = true, reduced = false) => {
    await act(async () =>
      root.render(
        <StrictMode>
          <Probe text={text} active={active} reduced={reduced} />
        </StrictMode>,
      ),
    )
  }
  await render('AB🐉DEF')
  expect(container.textContent).toBe('')
  await advance(24)
  expect(container.textContent).toBe('AB')
  await render('AB🐉DEF', false)
  expect(vi.getTimerCount()).toBe(0)
  await advance(500)
  expect(container.textContent).toBe('AB')
  await render('AB🐉DEF')
  await advance(24)
  expect(container.textContent).toBe('AB🐉D')
  await advance(24)
  expect(container.textContent).toBe('AB🐉DEF')
  expect(vi.getTimerCount()).toBe(0)
  await render('new reply')
  expect(container.textContent).toBe('')
  await render('new reply', true, true)
  expect(container.textContent).toBe('new reply')
  await render('new reply', true, false)
  expect(container.textContent).toBe('new reply')
  expect(vi.getTimerCount()).toBe(0)
})

it('blinks for 140ms after a random delay and cleans up on pause and reduced motion', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  function Probe({ active, reduced }: { active: boolean; reduced: boolean }) {
    return <output>{useBlink(active, reduced) ? 'blink' : 'open'}</output>
  }
  const render = async (active = true, reduced = false) => {
    await act(async () =>
      root.render(
        <StrictMode>
          <Probe active={active} reduced={reduced} />
        </StrictMode>,
      ),
    )
  }
  await render()
  expect(vi.getTimerCount()).toBe(1)
  await advance(3749)
  expect(container.textContent).toBe('open')
  await advance(1)
  expect(container.textContent).toBe('blink')
  await advance(139)
  expect(container.textContent).toBe('blink')
  await advance(1)
  expect(container.textContent).toBe('open')
  await render(false)
  expect(vi.getTimerCount()).toBe(0)
  await render(true, true)
  expect(vi.getTimerCount()).toBe(0)
  await render()
  expect(vi.getTimerCount()).toBe(1)
})

it('preserves remaining cheer time across pauses and restarts on a new interaction', async () => {
  const finish = vi.fn()
  function Probe({ active, id }: { active: boolean; id: number }) {
    usePausableTimeout(finish, 2500, active, id)
    return null
  }
  const render = async (active: boolean, id = 1) => {
    await act(async () =>
      root.render(
        <StrictMode>
          <Probe active={active} id={id} />
        </StrictMode>,
      ),
    )
  }
  await render(true)
  await advance(1000)
  await render(false)
  expect(vi.getTimerCount()).toBe(0)
  await advance(10000)
  expect(finish).not.toHaveBeenCalled()
  await render(true)
  await advance(1499)
  expect(finish).not.toHaveBeenCalled()
  await advance(1)
  expect(finish).toHaveBeenCalledTimes(1)
  await render(true, 2)
  await advance(2499)
  expect(finish).toHaveBeenCalledTimes(1)
  await advance(1)
  expect(finish).toHaveBeenCalledTimes(2)
})
