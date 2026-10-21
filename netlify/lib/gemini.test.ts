import { beforeEach, describe, expect, it, vi } from 'vitest'

const { generateContent, generateContentStream } = vi.hoisted(() => ({
  generateContent: vi.fn(),
  generateContentStream: vi.fn(),
}))

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContent, generateContentStream }
  },
  ThinkingLevel: { MINIMAL: 'MINIMAL', LOW: 'LOW' },
}))

import { GeminiProvider } from './gemini'

describe('GeminiProvider', () => {
  beforeEach(() => {
    generateContent.mockReset().mockResolvedValue({ text: '{"text":"Hi."}' })
    generateContentStream.mockReset()
  })

  it('uses concise low-latency generation and sends only recent bounded history', async () => {
    const history = Array.from({ length: 6 }, (_, index) => ({
      question: `Question ${index}`,
      answer: `Answer ${index}${'x'.repeat(900)}`,
    }))
    const provider = new GeminiProvider(['test-key'], 'gemini-3.5-flash-lite')

    await provider.generateResponse(
      { message: 'Question now', activeFileId: 'about', history },
      '{}',
    )

    const request = generateContent.mock.calls[0][0]
    expect(request.config).toMatchObject({
      maxOutputTokens: 512,
      thinkingConfig: { thinkingLevel: 'MINIMAL' },
    })
    expect(request.contents).toHaveLength(9)
    expect(request.contents[0].parts[0].text).toBe('Question 2')
    expect(request.contents[1].parts[0].text).toHaveLength(800)
    expect(request.contents.at(-1).parts[0].text).toContain('Question: Question now')
  })

  it('streams only the answer text while still validating the final JSON reply', async () => {
    async function* chunks() {
      yield { text: '{"text":"Marcus studies ' }
      yield { text: 'computer engineering.","openFile":"about"}' }
    }
    generateContentStream.mockResolvedValue(chunks())
    const provider = new GeminiProvider(['test-key'], 'gemini-3.5-flash-lite')
    const partials: string[] = []

    await expect(
      provider.generateResponseStream(
        { message: 'What is he studying?', activeFileId: 'about', history: [] },
        '{}',
        (text) => partials.push(text),
      ),
    ).resolves.toEqual({
      text: 'Marcus studies computer engineering.',
      openFile: 'about',
    })
    expect(partials).toEqual([
      'Marcus studies ',
      'Marcus studies computer engineering.',
    ])
  })
})
