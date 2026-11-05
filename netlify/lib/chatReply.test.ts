import { describe, expect, it } from 'vitest'
import { parseGeminiReply } from './chatReply'

describe('parseGeminiReply', () => {
  it('keeps valid page actions and rebuilds project cards from site content', () => {
    expect(
      parseGeminiReply({
        text: 'Explore these projects.',
        openFile: 'projects',
        switchToPlain: false,
        projectIds: ['ecobench'],
      }),
    ).toEqual({
      text: 'Explore these projects.',
      openFile: 'projects',
      switchToPlain: false,
      cards: [
        {
          fileId: 'ecobench',
          title: 'EcoBench',
          description: 'A solar-powered public charging station with human-powered backup.',
        },
      ],
    })
  })

  it('drops unknown page and project IDs and rejects malformed answer text', () => {
    expect(
      parseGeminiReply({
        text: 'Answer.',
        openFile: 'external-site',
        projectIds: ['unknown-project'],
      }),
    ).toEqual({ text: 'Answer.' })
    expect(() => parseGeminiReply({ text: '' })).toThrow()
  })
})
