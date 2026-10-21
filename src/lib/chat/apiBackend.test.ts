import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiBackend } from './apiBackend'

afterEach(() => vi.unstubAllGlobals())

describe('apiBackend', () => {
  it('sends the question, active page, and only the eight most recent turns', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ text: 'A natural answer.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await apiBackend.reply('What does Marcus build?', {
      activeFileId: 'about',
      history: Array.from({ length: 10 }, (_, index) => ({
        question: `question ${index}`,
        answer: `answer ${index}`,
      })),
    })

    const [, options] = fetchMock.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(fetchMock.mock.calls[0][0]).toBe('/api/chat')
    expect(body.message).toBe('What does Marcus build?')
    expect(body.activeFileId).toBe('about')
    expect(body.history).toHaveLength(8)
    expect(body.history[0].question).toBe('question 2')
  })

  it('accepts valid replies and drops unknown navigation targets', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            text: 'Here are projects.',
            openFile: 'not-a-page',
            cards: [
              {
                fileId: 'ecobench',
                title: 'untrusted',
                description: 'untrusted',
              },
              { fileId: 'not-a-project', title: 'nope', description: 'nope' },
            ],
          }),
          { status: 200 },
        ),
      ),
    )

    await expect(
      apiBackend.reply('Show me projects', { activeFileId: null }),
    ).resolves.toEqual({
      text: 'Here are projects.',
      cards: [
        {
          fileId: 'ecobench',
          title: 'EcoBench',
          description:
            'A solar-powered public charging station with human-powered backup.',
        },
      ],
    })
  })

  it('shows streamed answer text before applying the validated final reply', async () => {
    const partials: string[] = []
    const events = [
      { type: 'text', text: 'Marcus studies' },
      { type: 'text', text: 'Marcus studies computer engineering.' },
      {
        type: 'complete',
        reply: {
          text: 'Marcus studies computer engineering.',
          openFile: 'about',
        },
      },
    ]
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(events.map((event) => JSON.stringify(event)).join('\n'), {
          headers: { 'Content-Type': 'application/x-ndjson' },
        }),
      ),
    )

    await expect(
      apiBackend.reply('What is he studying?', { activeFileId: null }, (text) =>
        partials.push(text),
      ),
    ).resolves.toEqual({
      text: 'Marcus studies computer engineering.',
      openFile: 'about',
    })
    expect(partials).toEqual([
      'Marcus studies',
      'Marcus studies computer engineering.',
    ])
  })

  it('rejects server errors and malformed replies', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{}', { status: 502 })),
    )
    await expect(
      apiBackend.reply('question', { activeFileId: null }),
    ).rejects.toThrow()

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ message: 'wrong shape' })),
        ),
    )
    await expect(
      apiBackend.reply('question', { activeFileId: null }),
    ).rejects.toThrow()
  })
})
