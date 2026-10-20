// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceProvider } from '../../state/WorkspaceProvider'
import { experience } from '../../content/experience'
import { Editor } from './Editor'
import { Explorer } from '../explorer/Explorer'
import { downscaleImage } from '../../lib/image'

const flags = vi.hoisted(() => ({ enabled: false }))
vi.mock('../../config', () => ({
  get demoUploadsEnabled() {
    return flags.enabled
  },
}))
vi.mock('../../lib/image', () => ({
  downscaleImage: vi.fn(async () => 'data:image/jpeg;base64,uploaded'),
}))

let container: HTMLDivElement
let root: Root

async function click(element: HTMLElement) {
  await act(async () => element.click())
}
function button(text: string) {
  const found = [
    ...container.querySelectorAll<HTMLButtonElement>('button'),
  ].find((item) => item.textContent?.trim() === text)
  if (!found) throw new Error('Missing button: ' + text)
  return found
}
async function openFile(name: string) {
  const item = [
    ...container.querySelectorAll<HTMLButtonElement>('.file-button'),
  ].find((entry) => entry.textContent?.trim().endsWith(name))
  if (!item) throw new Error('Missing file: ' + name)
  await click(item)
}

beforeEach(async () => {
  flags.enabled = false
  window.localStorage.clear()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  await act(async () =>
    root.render(
      <WorkspaceProvider>
        <Explorer />
        <Editor />
      </WorkspaceProvider>,
    ),
  )
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('explorer and editor', () => {
  it('skips image tilt for reduced motion', async () => {
    const media = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => media),
    )
    await openFile('ecobench.md')
    const hero = container.querySelector<HTMLButtonElement>('.project-hero')!
    vi.spyOn(hero, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, 0, 500, 170),
    )
    await act(async () => {
      hero.dispatchEvent(
        new MouseEvent('pointermove', {
          bubbles: true,
          clientX: 100,
          clientY: 40,
        }),
      )
    })
    expect(hero.style.getPropertyValue('--tilt-x')).toBe('')
    await act(async () => {
      media.matches = false
      media.addEventListener.mock.calls[0][1]()
    })
    await act(async () => {
      hero.dispatchEvent(
        new MouseEvent('pointermove', {
          bubbles: true,
          clientX: 100,
          clientY: 40,
        }),
      )
    })
    expect(hero.style.getPropertyValue('--tilt-x')).not.toBe('')
  })

  it('keeps folder expansion separate from navigation', async () => {
    expect(container.textContent).toContain('start here')
    await click(
      container.querySelector<HTMLButtonElement>(
        '[aria-label="Collapse projects"]',
      )!,
    )
    expect(container.querySelector('[role="tab"]')).toBeNull()
    expect(
      container.querySelector('#project-files')?.hasAttribute('hidden'),
    ).toBe(true)
    await openFile('projects/')
    expect(
      container.querySelector('[aria-current="page"]')?.textContent,
    ).toContain('projects/')
    expect(container.querySelectorAll('.project-card')).toHaveLength(3)
    expect(
      container.querySelector('#project-files')?.hasAttribute('hidden'),
    ).toBe(true)
  })

  it('reuses tabs, supports keyboard selection, and closes to an empty editor', async () => {
    await openFile('about.md')
    await openFile('experience.md')
    expect(container.textContent).toContain(experience[0].t)
    await openFile('experience.md')
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(2)
    const active = container.querySelector<HTMLElement>(
      '[role="tab"][aria-selected="true"]',
    )!
    await act(async () => {
      active.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
      )
    })
    expect(
      container.querySelector('[role="tab"][aria-selected="true"]')
        ?.textContent,
    ).toContain('about.md')
    await click(
      container.querySelector<HTMLButtonElement>(
        '[aria-label="Close about.md"]',
      )!,
    )
    expect(
      container.querySelector('[role="tab"][aria-selected="true"]')
        ?.textContent,
    ).toContain('experience.md')
    await click(
      container.querySelector<HTMLButtonElement>(
        '[aria-label="Close experience.md"]',
      )!,
    )
    expect(container.querySelector('[role="tab"]')).toBeNull()
    expect(container.textContent).toContain('start here')
    expect(document.activeElement?.id).toBe('editor-start')
  })

  it('toggles skill filtering and keeps an already-selected project tag selected', async () => {
    await openFile('skills.json')
    await click(button('React'))
    expect(button('React').getAttribute('aria-pressed')).toBe('true')
    expect(container.textContent).toContain('Projects using React')
    await click(button('React'))
    expect(container.textContent).not.toContain('Projects using React')
    await click(button('React'))
    await openFile('f1.md')
    await click(button('React'))
    expect(button('React').getAttribute('aria-pressed')).toBe('true')
    await click(button('F1 2026 Predictor'))
    expect(container.querySelector('[role="tabpanel"] h3')?.textContent).toBe(
      'F1 2026 Predictor',
    )
  })

  it('renders project links, image dimensions, and previous/next navigation', async () => {
    await openFile('ecobench.md')
    expect(container.textContent).not.toContain('Live demo')
    const link = container.querySelector<HTMLAnchorElement>('a.primary')!
    expect(link.rel).toBe('noopener noreferrer')
    expect(link.target).toBe('_blank')
    const image =
      container.querySelector<HTMLImageElement>('.project-hero img')!
    expect(image.getAttribute('loading')).toBe('lazy')
    expect(image.width).toBe(1000)
    expect(image.height).toBe(650)
    expect(image.src).toMatch(/^data:image\/svg/)
    expect(container.querySelector('input[type="file"]')).toBeNull()
    const next = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((item) => item.textContent?.includes('Bifrost Gateway'))!
    await click(next)
    expect(container.querySelector('[role="tabpanel"] h3')?.textContent).toBe(
      'Bifrost Gateway',
    )
    const previous = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((item) => item.textContent?.includes('ECOBENCH'))!
    await click(previous)
    expect(container.querySelector('[role="tabpanel"] h3')?.textContent).toBe(
      'ECOBENCH',
    )
  })

  it('shows the unattached resume state and announces copied email', async () => {
    await openFile('resume.pdf')
    expect(container.textContent).toContain('no PDF attached yet')
    expect(container.querySelector('a[download]')).toBeNull()
    expect(container.querySelector('input[type="file"]')).toBeNull()
    await openFile('contact.txt')
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    await click(button('Copy email'))
    expect(writeText).toHaveBeenCalledWith('your@email.com')
    expect(container.querySelector('[aria-live="polite"]')?.textContent).toBe(
      'copied',
    )
  })

  it('enables demo image drop and removal only when configured', async () => {
    flags.enabled = true
    await openFile('ecobench.md')
    const upload = container.querySelector<HTMLElement>('.upload-area')!
    const event = new Event('drop', { bubbles: true, cancelable: true })
    const file = new File(['image'], 'image.png', { type: 'image/png' })
    Object.defineProperty(event, 'dataTransfer', { value: { files: [file] } })
    await act(async () => {
      upload.dispatchEvent(event)
    })
    expect(downscaleImage).toHaveBeenCalledWith(file)
    expect(
      container.querySelector<HTMLImageElement>('.project-hero img')?.src,
    ).toBe('data:image/jpeg;base64,uploaded')
    await click(button('Remove uploaded image'))
    expect(
      container.querySelector<HTMLImageElement>('.project-hero img')?.src,
    ).toMatch(/^data:image\/svg/)
  })

  it('attaches and removes a demo PDF through workspace state', async () => {
    flags.enabled = true
    const originalCreate = URL.createObjectURL
    const originalRevoke = URL.revokeObjectURL
    URL.createObjectURL = vi.fn(() => 'blob:resume-demo')
    URL.revokeObjectURL = vi.fn()
    try {
      await openFile('resume.pdf')
      const input =
        container.querySelector<HTMLInputElement>('input[type="file"]')!
      Object.defineProperty(input, 'files', {
        configurable: true,
        value: [new File(['pdf'], 'resume.pdf', { type: 'application/pdf' })],
      })
      await act(async () => {
        input.dispatchEvent(new Event('change', { bubbles: true }))
      })
      expect(
        container
          .querySelector<HTMLAnchorElement>('a[download]')
          ?.getAttribute('href'),
      ).toBe('blob:resume-demo')
      await click(button('Remove attached PDF'))
      expect(container.querySelector('a[download]')).toBeNull()
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:resume-demo')
    } finally {
      URL.createObjectURL = originalCreate
      URL.revokeObjectURL = originalRevoke
    }
  })
})
