// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { WorkspaceProvider } from '../../../state/WorkspaceProvider'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { MobileQuickBar } from './MobileQuickBar'
import { MobileSectionNav } from './MobileSectionNav'

let container: HTMLDivElement
let root: Root
let observed: IntersectionObserverCallback | null

function QuickBarHarness() {
  const [open, setOpen] = useState(false)
  return <MobileQuickBar open={open} onOpenChange={setOpen} />
}

function ThemeProbe() {
  return <output>{useWorkspaceState().theme}</output>
}

async function mount(ui: React.ReactNode) {
  await act(async () =>
    root.render(<WorkspaceProvider>{ui}</WorkspaceProvider>),
  )
}

function byLabel(label: string) {
  return container.querySelector<HTMLElement>(`[aria-label="${label}"]`)!
}

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  observed = null
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        observed = callback
      }
      observe() {}
      disconnect() {}
    },
  )
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

it('expands the quick bar, keeps hidden actions out of tab order, and cycles the theme', async () => {
  await mount(
    <>
      <QuickBarHarness />
      <ThemeProbe />
    </>,
  )
  const toggle = byLabel('Open quick actions')
  const contact = [...container.querySelectorAll('button')].find(
    (button) => button.textContent === 'Contact',
  )!
  expect(toggle.getAttribute('aria-expanded')).toBe('false')
  expect(contact.tabIndex).toBe(-1)

  await act(async () => toggle.click())
  expect(byLabel('Close quick actions').getAttribute('aria-expanded')).toBe(
    'true',
  )
  expect(contact.tabIndex).toBe(0)

  const before = container.querySelector('output')!.textContent
  const themeButton = container.querySelector<HTMLButtonElement>(
    '[aria-label^="Theme "]',
  )!
  await act(async () => themeButton.click())
  expect(container.querySelector('output')!.textContent).not.toBe(before)

  await act(async () =>
    container
      .querySelector('nav')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      ),
  )
  expect(byLabel('Open quick actions').getAttribute('aria-expanded')).toBe(
    'false',
  )
})

it('slides the section indicator to the section in view', async () => {
  await mount(<MobileSectionNav id="m-sections" open />)
  expect(byLabel('Home').getAttribute('aria-current')).toBe('location')

  const target = document.createElement('section')
  target.id = 'plain-projects'
  await act(async () =>
    observed!(
      [
        {
          isIntersecting: true,
          target,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    ),
  )
  expect(byLabel('Projects').getAttribute('aria-current')).toBe('location')
  expect(byLabel('Home').hasAttribute('aria-current')).toBe(false)
  expect(
    container
      .querySelector<HTMLElement>('.m-section-indicator')!
      .style.getPropertyValue('--i'),
  ).toBe('3')
})

it('holds the indicator on a tapped section until the scroll ends', async () => {
  await mount(<MobileSectionNav id="m-sections" open />)
  await act(async () => byLabel('Skills').click())
  expect(byLabel('Skills').getAttribute('aria-current')).toBe('location')

  const passing = document.createElement('section')
  passing.id = 'plain-about'
  const pass = () =>
    observed!(
      [
        {
          isIntersecting: true,
          target: passing,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    )
  await act(async () => pass())
  expect(byLabel('Skills').getAttribute('aria-current')).toBe('location')

  await act(async () => window.dispatchEvent(new Event('scrollend')))
  expect(byLabel('About').getAttribute('aria-current')).toBe('location')
})
