// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { WorkspaceProvider } from '../state/WorkspaceProvider'
import { useWorkspaceDispatch } from '../state/useWorkspaceDispatch'
import { useWorkspaceState } from '../state/useWorkspaceState'
import { useHashSync } from './useHashSync'

let root: Root, container: HTMLDivElement

function Probe() {
  useHashSync('ide')
  const { activeFileId, tabs } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  return (
    <>
      <output>{`${activeFileId}|${tabs.join(',')}`}</output>
      <button onClick={() => dispatch({ type: 'open-file', fileId: 'skills' })}>
        open
      </button>
      <button
        onClick={() =>
          tabs.forEach((fileId) => dispatch({ type: 'close-tab', fileId }))
        }
      >
        close
      </button>
    </>
  )
}
async function mount(url: string) {
  window.history.replaceState(null, '', url)
  await act(async () =>
    root.render(
      <WorkspaceProvider routeAware>
        <Probe />
      </WorkspaceProvider>,
    ),
  )
}
const output = () => container.querySelector('output')!.textContent
async function click(index: number) {
  await act(async () => container.querySelectorAll('button')[index].click())
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  window.history.replaceState(null, '', '/')
  vi.unstubAllGlobals()
})

it('opens the file named in the hash and keeps the hash', async () => {
  await mount('/terminal#ecobench')
  expect(output()).toBe('ecobench|ecobench')
  expect(window.location.hash).toBe('#ecobench')
})

it('ignores an unknown hash and clears it', async () => {
  await mount('/terminal#nope')
  expect(output()).toBe('null|')
  expect(window.location.hash).toBe('')
})

it('writes the active tab to the hash without adding history entries', async () => {
  await mount('/terminal')
  const entries = window.history.length
  await click(0)
  expect(window.location.hash).toBe('#skills')
  await click(1)
  expect(window.location.hash).toBe('')
  expect(window.location.pathname).toBe('/terminal')
  expect(window.history.length).toBe(entries)
})

it('follows a hash changed by hand', async () => {
  await mount('/terminal')
  window.location.hash = '#about'
  await act(async () => window.dispatchEvent(new HashChangeEvent('hashchange')))
  expect(output()).toBe('about|about')
})

it('stays idle while the portfolio view is showing', async () => {
  await mount('/#ecobench')
  expect(output()).toBe('null|')
  expect(window.location.hash).toBe('#ecobench')
})
