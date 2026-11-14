import type { Config, Context } from '@netlify/functions'
import { z } from 'zod'
import { socials } from '../../src/content/socials'
import { contactMessageSchema } from '../../src/lib/contact/contactMessage'
import { sendContactMail } from '../lib/contactMail'
import { rateLimiter } from '../lib/rateLimiter'

export const config: Config = {
  path: '/api/contact',
}

const MAX_MESSAGES = 5
const WINDOW_MS = 10 * 60 * 1000

// `website` is a hidden form field; only bots fill it in.
const requestSchema = contactMessageSchema.extend({
  website: z.string().max(200).optional(),
})

const inbox = socials
  .find((social) => social.label === 'Email')
  ?.url.replace(/^mailto:/i, '')

function json(status: number, body: object): Response {
  return Response.json(body, { status })
}

export default async function handler(
  request: Request,
  context: Context,
): Promise<Response> {
  if (request.method !== 'POST')
    return Response.json(
      { error: 'Method Not Allowed' },
      { status: 405, headers: { Allow: 'POST' } },
    )

  // Browsers always send Origin on a cross-site POST; only this site may submit.
  const origin = request.headers.get('origin')
  const allowed = [
    new URL(request.url).origin,
    process.env.ALLOWED_ORIGIN,
    process.env.LOCAL_ORIGIN,
  ]
  if (origin && !allowed.includes(origin))
    return json(403, { error: 'Forbidden' })

  if (!rateLimiter(`contact:${context.ip}`, MAX_MESSAGES, WINDOW_MS))
    return json(429, { error: 'Too Many Requests' })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) return json(400, { error: 'Invalid request' })

  const { website, ...message } = parsed.data
  // Answer bots like a success so they don't adapt, but send nothing.
  if (website) return json(200, { ok: true })

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO ?? inbox
  if (!apiKey || !to) return json(503, { error: 'Mail is not configured' })

  try {
    await sendContactMail(message, {
      apiKey,
      to,
      from: process.env.CONTACT_FROM ?? 'Portfolio <onboarding@resend.dev>',
    })
    return json(200, { ok: true })
  } catch (error) {
    console.error('Error sending contact message:', error)
    return json(502, { error: 'Mail is unavailable' })
  }
}
