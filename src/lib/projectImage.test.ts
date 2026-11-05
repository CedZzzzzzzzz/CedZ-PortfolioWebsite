// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { resolveProjectImage } from './projectImage'

describe('project image resolution', () => {
  it('prefers uploads, then the configured image', () => {
    const project = { n: 'Example', img: '/projects/example.png' }
    expect(resolveProjectImage(project, 'data:image/jpeg;base64,upload')).toBe(
      'data:image/jpeg;base64,upload',
    )
    expect(resolveProjectImage(project)).toBe('/projects/example.png')
    expect(resolveProjectImage(project, '')).toBe('/projects/example.png')
  })

  it('creates a valid SVG placeholder and escapes special characters', () => {
    const name = 'A & B <script>alert("hi")</script> \'quoted\''
    const url = resolveProjectImage({ n: name, img: '' })
    expect(url).toMatch(/^data:image\/svg\+xml;charset=utf-8,/)
    const svg = decodeURIComponent(url.split(',')[1])
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml')
    expect(doc.querySelector('parsererror')).toBeNull()
    expect(doc.querySelector('script')).toBeNull()
    expect(doc.querySelector('text')?.textContent).toBe(name)
    expect(doc.documentElement.getAttribute('width')).toBe('1000')
    expect(doc.documentElement.getAttribute('height')).toBe('650')
  })
})
