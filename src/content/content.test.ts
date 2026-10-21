import { describe, expect, it } from 'vitest'
import { experience } from './experience'
import { files } from './files'
import { profile } from './profile'
import { projects } from './projects'
import { skills } from './skills'
import { socials } from './socials'
import { portfolioExperience } from './portfolioExperience'
import { certifications } from './certifications'

describe('content integrity', () => {
  it('has unique project and file IDs', () => {
    expect(new Set(projects.map(({ id }) => id)).size).toBe(projects.length)
    expect(new Set(files.map(({ id }) => id)).size).toBe(files.length)
  })

  it('resolves every project file and parent reference', () => {
    const projectIds = new Set(projects.map(({ id }) => id))
    const fileIds = new Set(files.map(({ id }) => id))
    expect(
      files.filter(({ kind }) => kind === 'project').map(({ id }) => id),
    ).toEqual(projects.map(({ id }) => id))
    for (const file of files) {
      if (file.kind === 'project') expect(projectIds.has(file.id)).toBe(true)
      else if (file.kind === 'certification') {
        expect(file.id).toMatch(/^certification-/)
      } else expect(file.id).toBe(file.kind)
      if (file.parentId) expect(fileIds.has(file.parentId)).toBe(true)
    }
    expect(
      files
        .filter(({ kind }) => kind === 'certification')
        .map(({ name }) => name),
    ).toEqual(certifications.map(({ file }) => file))
  })

  it('uses only listed skill tags on projects', () => {
    const tags = new Set(skills.flatMap(({ tags }) => tags))
    for (const project of projects) {
      for (const tag of project.t) expect(tags.has(tag)).toBe(true)
    }
  })

  it('contains confirmed work experience without the removed education entry', () => {
    expect(experience.map(({ t }) => t)).toContain(
      'Software Quality Assurance Intern',
    )
    expect(experience.some(({ k }) => k === 'education')).toBe(false)
    expect(experience.map(({ o }) => o)).not.toContain(
      'Polyechnic University of the Philippines',
    )
  })

  it('uses the confirmed profile and contact details without placeholders', () => {
    expect(profile.name).toBe('Marcus Cedric S. Pedrosa')
    expect(socials.map(({ label }) => label)).toContain('Instagram')
    expect(socials.every(({ url }) => !url.includes('your-'))).toBe(true)
    expect(portfolioExperience.map(({ t }) => t)).toContain(
      'Software Quality Assurance Intern',
    )
    expect(projects.map(({ id }) => id)).toEqual([
      'ecobench',
      'quantis-f1',
      'budget-tracker',
      'portfolio-website',
    ])
  })
})
