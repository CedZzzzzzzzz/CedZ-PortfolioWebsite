import { describe, expect, it } from 'vitest'
import { projects } from '../../content/projects'
import { keywordBackend } from './keywordBackend'

const ask = (query: string, activeFileId: string | null = null) =>
  keywordBackend.reply(query, { activeFileId })

describe('keywordBackend', () => {
  it('describes the open file for "this page"', async () => {
    expect((await ask('what is this page?', 'about')).text).toContain(
      'about.md',
    )
    expect((await ask('this page')).text).toContain('No file is open')
  })

  it('explains the layout without opening a file', async () => {
    const reply = await ask('is this omarchy?')
    expect(reply.text).toContain('tiling')
    expect(reply.openFile).toBeUndefined()
  })

  it.each([
    ['where did he study?', 'experience'],
    ['can I see the CV', 'resume'],
    ['what skills does he have', 'skills'],
    ['who is Marcus', 'about'],
    ['how do I email him', 'contact'],
  ])('opens the matching page for "%s"', async (query, fileId) => {
    expect((await ask(query)).openFile).toBe(fileId)
  })

  it('answers projects with a card per project', async () => {
    const reply = await ask('show me your projects')
    expect(reply.openFile).toBe('projects')
    expect(reply.cards?.map(({ fileId }) => fileId)).toEqual(
      projects.map(({ id }) => id),
    )
  })

  it.each([
    ['what are his conatct', 'contact'],
    ['show me the projcts', 'projects'],
    ['his experiance please', 'experience'],
    ['resumee', 'resume'],
  ])('tolerates a one-edit typo in "%s"', async (query, fileId) => {
    expect((await ask(query)).openFile).toBe(fileId)
  })

  it('does not treat unrelated words as typos', async () => {
    expect((await ask('tell me a joke')).openFile).toBeUndefined()
  })

  it('uses the first matching intent', async () => {
    expect((await ask('resume and projects')).openFile).toBe('resume')
  })

  it('greets, and falls back when nothing matches', async () => {
    expect((await ask('Hello!')).text).toContain('Hi!')
    expect((await ask('xyzzy')).text).toContain('tiny dragon ninja')
  })
})
