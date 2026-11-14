import { describe, expect, it, vi } from 'vitest'
import { sendContactMail } from './contactMail'

const settings = {
  apiKey: 'k3y',
  to: 'me@example.com',
  from: 'Portfolio <onboarding@resend.dev>',
}
const message = {
  name: 'Juan\nDela Cruz',
  email: 'juan@company.com',
  org: 'ACME',
  message: 'Hello, I would like to talk.',
}

describe('sendContactMail', () => {
  it('sends to the inbox with the visitor as reply-to', async () => {
    const fetchImpl = vi.fn(async () => Response.json({ id: '1' }))
    await sendContactMail(message, settings, fetchImpl)
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.resend.com/emails')
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer k3y',
    )
    const body = JSON.parse(init.body as string)
    expect(body).toMatchObject({
      from: settings.from,
      to: ['me@example.com'],
      reply_to: 'juan@company.com',
      subject: 'Portfolio message from Juan Dela Cruz',
    })
    expect(body.text).toContain('Company or school: ACME')
    expect(body.text).toContain('Hello, I would like to talk.')
  })

  it('omits the org line when empty and throws on a failed send', async () => {
    const ok = vi.fn(async () => Response.json({ id: '1' }))
    await sendContactMail({ ...message, org: '' }, settings, ok)
    const [, init] = ok.mock.calls[0] as unknown as [string, RequestInit]
    expect(JSON.parse(init.body as string).text).not.toContain('Company')

    const denied = vi.fn(async () => new Response('', { status: 403 }))
    await expect(sendContactMail(message, settings, denied)).rejects.toThrow(
      '403',
    )
  })
})
