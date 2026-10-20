import { describe, expect, it } from 'vitest'
import { experience } from './experience'
import { files } from './files'
import { projects } from './projects'
import { skills } from './skills'

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
      else expect(file.id).toBe(file.kind)
      if (file.parentId) expect(fileIds.has(file.parentId)).toBe(true)
    }
  })

  it('uses only listed skill tags on projects', () => {
    const tags = new Set(skills.flatMap(({ tags }) => tags))
    for (const project of projects) {
      for (const tag of project.t) expect(tags.has(tag)).toBe(true)
    }
  })

  it('starts experience with education', () => {
    expect(experience[0]?.k).toBe('education')
  })
})
