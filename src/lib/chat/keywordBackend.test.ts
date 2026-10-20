import { describe, expect, it } from 'vitest'
import { keywordBackend } from './keywordBackend'

describe('keywordBackend', () => {
  const noPage = { activeFileId: null }

  it('prioritizes feed, play, plain, and this page', async () => {
    expect(
      (await keywordBackend.reply('feed and play', noPage)).petAction,
    ).toBe('feed')
    expect(
      (await keywordBackend.reply('play with Byte', noPage)).petAction,
    ).toBe('play')
    expect(
      (await keywordBackend.reply('plain projects', noPage)).switchToPlain,
    ).toBe(true)
    expect(
      (
        await keywordBackend.reply('this page and projects', {
          activeFileId: 'ecobench',
        })
      ).text,
      ).toContain('EcoBench')
    expect((await keywordBackend.reply('this page', noPage)).text).toContain(
      'No file',
    )
  })

  it.each([
    ['education projects', 'experience'],
    ['cv projects', 'resume'],
    ['projects skills', 'projects'],
    ['skills about', 'skills'],
    ['who are you contact', 'about'],
    ['contact me', 'contact'],
  ])('routes "%s" to %s', async (query, fileId) => {
    expect((await keywordBackend.reply(query, noPage)).openFile).toBe(fileId)
  })

  it('returns clickable project cards', async () => {
    const reply = await keywordBackend.reply('projects', noPage)
    expect(reply.cards?.map((card) => card.fileId)).toEqual([
      'ecobench',
      'quantis-f1',
      'crime-detection',
      'budget-tracker',
      'portfolio-website',
    ])
  })

  it('describes the layout before lower-priority intents', async () => {
    const reply = await keywordBackend.reply('omarchy projects', noPage)
    expect(reply.openFile).toBeUndefined()
    expect(reply.text).toContain('editor')
  })

  it('handles greetings and unknown questions', async () => {
    expect((await keywordBackend.reply('hello', noPage)).text).toContain('Byte')
    expect(
      (await keywordBackend.reply('quantum bananas', noPage)).text,
    ).toContain('tiny dragon')
  })
})
