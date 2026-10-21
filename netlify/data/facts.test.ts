import { describe, expect, it } from 'vitest'
import { facts } from './facts'

describe('Byte knowledge context', () => {
  it('uses the displayed site content and separately includes CV details', () => {
    expect(facts.site.profile.name).toBe('Marcus Cedric S. Pedrosa')
    expect(facts.site.experience.map(({ t }) => t)).toContain(
      'Software Quality Assurance Intern',
    )
    expect(facts.site.skills.flatMap(({ tags }) => tags)).toContain('Gemini API')
    expect(facts.site.projects.map(({ id }) => id)).toContain('quantis-f1')
    expect(facts.resumeText).toContain('AI Bifrost Middleware')
    expect(facts.resumeText).toContain('up to 50 receipt items')
    expect(facts.instructions).toContain('authoritative')
  })
})
