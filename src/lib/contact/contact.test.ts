import { describe, expect, it, vi } from 'vitest'
import { validateContactMessage } from './contactMessage'
import { sendContactMessage } from './sendContactMessage'

const valid = {
  name: '  Juan Dela Cruz ',
  email: ' juan@company.com ',
  org: '',
  message: 'Hello, I would like to talk about a role.',
}

describe('validateContactMessage', () => {
  it('trims a valid message and allows an empty org', () => {
    expect(validateContactMessage(valid)).toEqual({
      ok: true,
      message: {
        name: 'Juan Dela Cruz',
        email: 'juan@company.com',
        org: '',
        message: valid.message,
      },
    })
  })

  it('reports one error per bad field', () => {
    expect(
      validateContactMessage({
        name: ' ',
        email: 'juan@',
        org: '',
        message: '  ',
      }),
    ).toEqual({
      ok: false,
      errors: {
        name: 'enter your name',
        email: 'use a full address, like name@domain.com',
        message: 'write a message',
      },
    })
    expect(validateContactMessage({ ...valid, email: '' })).toMatchObject({
      errors: { email: 'enter your email' },
    })
  })

  it.each([
    'juan@company',
    'juan@.com',
    '@company.com',
    'juan@company.c',
    'juan company@x.com',
  ])('rejects the malformed address %s', (email) => {
    expect(validateContactMessage({ ...valid, email }).ok).toBe(false)
  })

  it('accepts a one-word message', () => {
    expect(validateContactMessage({ ...valid, message: 'Hi' }).ok).toBe(true)
  })

  it('rejects addresses with whitespace and oversized messages', () => {
    expect(
      validateContactMessage({ ...valid, email: 'a@b.com\nbcc: x@y.com' }).ok,
    ).toBe(false)
    expect(
      validateContactMessage({ ...valid, message: 'x'.repeat(2001) }).ok,
    ).toBe(false)
  })
})

describe('sendContactMessage', () => {
  const message = {
    name: 'Juan',
    email: 'j@c.com',
    org: 'ACME',
    message: 'Hello there!',
  }

  it('posts the message with the honeypot value', async () => {
    const fetchImpl = vi.fn(async () => Response.json({ ok: true }))
    expect(await sendContactMessage(message, '', fetchImpl)).toBe('sent')
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ]
    expect(url).toBe('/api/contact')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({ ...message, website: '' })
  })

  it('tells a rate limit apart from other failures', async () => {
    const limited = vi.fn(async () => new Response('', { status: 429 }))
    expect(await sendContactMessage(message, '', limited)).toBe('limited')
  })

  it('reports server and network errors as failed', async () => {
    const down = vi.fn(async () => new Response('', { status: 502 }))
    expect(await sendContactMessage(message, '', down)).toBe('failed')
    const offline = vi.fn(() => Promise.reject(new Error('offline')))
    expect(await sendContactMessage(message, '', offline)).toBe('failed')
  })
})
