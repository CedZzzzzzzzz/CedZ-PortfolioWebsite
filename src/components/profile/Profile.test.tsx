// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { WorkspaceProvider } from '../../state/WorkspaceProvider'
import { ByteProvider } from '../../state/ByteProvider'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useTerminal } from '../../hooks/useTerminal'
import { downscaleImage } from '../../lib/image'
import { profile } from '../../content/profile'
import { Profile } from './Profile'
import { ProfileAvatar } from './ProfileAvatar'

const flags = vi.hoisted(() => ({ enabled: false }))
vi.mock('../../config', () => ({
  get demoUploadsEnabled() {
    return flags.enabled
  },
}))
vi.mock('../../lib/image', () => ({
  downscaleImage: vi.fn(async () => 'data:image/jpeg;base64,photo'),
}))
let container: HTMLDivElement,
  root: Root,
  style: HTMLStyleElement,
  meta: HTMLMetaElement
function Probe() {
  const terminal = useTerminal()
  return (
    <>
      <output>{JSON.stringify(useWorkspaceState())}</output>
      <button onClick={() => terminal.run('theme fire')}>terminal theme</button>
    </>
  )
}
async function mount() {
  await act(async () =>
    root.render(
      <WorkspaceProvider>
        <ByteProvider>
          <Profile />
          <Probe />
        </ByteProvider>
      </WorkspaceProvider>,
    ),
  )
}
async function click(element: HTMLElement) {
  await act(async () => element.click())
}
function button(text: string) {
  return [...container.querySelectorAll('button')].find(
    (button) => button.textContent === text,
  )!
}
beforeEach(() => {
  flags.enabled = false
  localStorage.clear()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  style = document.createElement('style')
  style.textContent = readFileSync(
    resolve('src/theme/tokens.css'),
    'utf8',
  ).replace("@import 'tailwindcss';", '')
  document.head.append(style)
  meta = document.createElement('meta')
  meta.name = 'theme-color'
  document.head.append(meta)
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  style.remove()
  meta.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage.clear()
})
it('shows profile content, safe social attributes, fallback, and no default demo controls', async () => {
  await mount()
  expect(container.textContent).toContain(profile.name)
  expect(container.textContent).toContain(profile.role)
  expect(container.textContent).toContain(profile.focus)
  expect(
    container.querySelector('.profile-avatar img')?.getAttribute('src'),
  ).toBe(profile.photo)
  expect(container.querySelector('input[type="file"]')).toBeNull()
  for (const link of container.querySelectorAll('a')) {
    expect(link.rel).toBe('noopener noreferrer')
    if (link.textContent === 'Email') expect(link.href).toMatch(/^mailto:/)
    else expect(link.target).toBe('_blank')
  }
})
it('uses the photo path, falls back on error, and retries when its source changes', async () => {
  await act(async () =>
    root.render(<ProfileAvatar src="/photo.jpg" name={profile.name} />),
  )
  const image = container.querySelector('img')!
  expect(image.width).toBe(84)
  expect(image.height).toBe(84)
  expect(image.alt).toContain(profile.name)
  await act(async () => image.dispatchEvent(new Event('error')))
  expect(container.querySelector('img')).toBeNull()
  expect(container.textContent).toBe('MP')
  expect(container.textContent).toBe('MP')
  await act(async () =>
    root.render(<ProfileAvatar src="/new.jpg" name={profile.name} />),
  )
  expect(container.querySelector('img')!.getAttribute('src')).toBe('/new.jpg')
})
it('shares theme state with terminal, supports wrapping keyboard selection, and updates browser colors', async () => {
  await mount()
  const radios = [
    ...container.querySelectorAll<HTMLButtonElement>('[role="radio"]'),
  ]
  expect(radios[0].getAttribute('aria-checked')).toBe('true')
  await act(async () =>
    radios[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    ),
  )
  expect(document.activeElement).toBe(radios[4])
  expect(radios[4].getAttribute('aria-checked')).toBe('true')
  expect(meta.content).toBe('#0d0508')
  expect(document.documentElement.style.colorScheme).toBe('dark')
  await act(async () =>
    radios[4].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    ),
  )
  expect(radios[0].tabIndex).toBe(0)
  await click(radios[1])
  expect(meta.content).toBe('#070d1f')
  await click(button('terminal theme'))
  expect(radios[3].getAttribute('aria-checked')).toBe('true')
  expect(container.textContent).toContain('Theme · Fire')
  expect(JSON.parse(localStorage.getItem('cedz-theme')!)).toBe('fire')
})
it('opens Byte and toggles plain view through existing actions', async () => {
  await mount()
  await click(button('ask Byte'))
  await click(button('plain view'))
  expect(container.querySelector('output')!.textContent).toContain(
    '"byteOpen":true',
  )
  expect(button('plain view').getAttribute('aria-pressed')).toBe('true')
  await click(button('plain view'))
  expect(button('plain view').getAttribute('aria-pressed')).toBe('false')
})
it('uploads, persists, removes, and reports failed demo photos', async () => {
  flags.enabled = true
  await mount()
  const file = new File(['image'], 'photo.png', { type: 'image/png' })
  const drop = new Event('drop', { bubbles: true, cancelable: true })
  Object.defineProperty(drop, 'dataTransfer', { value: { files: [file] } })
  await act(async () =>
    container.querySelector('.profile-photo-upload')!.dispatchEvent(drop),
  )
  expect(downscaleImage).toHaveBeenCalledWith(file)
  expect(container.querySelector('img')!.src).toBe(
    'data:image/jpeg;base64,photo',
  )
  expect(localStorage.getItem('cedz-imgs')).toContain(
    'data:image/jpeg;base64,photo',
  )
  await click(button('remove photo'))
  expect(container.querySelector('img')?.getAttribute('src')).toBe(
    profile.photo,
  )
  vi.mocked(downscaleImage).mockRejectedValueOnce(new Error('bad image'))
  const input = container.querySelector('input')!
  Object.defineProperty(input, 'files', { value: [file] })
  await act(async () =>
    input.dispatchEvent(new Event('change', { bubbles: true })),
  )
  expect(container.querySelector('[role="status"]')!.textContent).toContain(
    'Could not load',
  )
})
