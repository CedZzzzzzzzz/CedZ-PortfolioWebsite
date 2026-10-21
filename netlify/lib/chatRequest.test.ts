import { describe, expect, it } from 'vitest'
import { chatRequestSchema } from './chatRequest'

describe('chatRequestSchema', () => {
  it('accepts requests with up to eight bounded history turns', () => {
    const history = Array.from({ length: 8 }, (_, index) => ({
      question: `question ${index}`,
      answer: `answer ${index}`,
    }))
    expect(chatRequestSchema.safeParse({ message: 'hello', history }).success).toBe(
      true,
    )
  })

  it('rejects too many or oversized history turns', () => {
    const tooMany = Array.from({ length: 9 }, () => ({
      question: 'question',
      answer: 'answer',
    }))
    expect(chatRequestSchema.safeParse({ message: 'hello', history: tooMany }).success).toBe(
      false,
    )
    expect(
      chatRequestSchema.safeParse({
        message: 'hello',
        history: [{ question: 'x'.repeat(201), answer: 'answer' }],
      }).success,
    ).toBe(false)
  })
})
