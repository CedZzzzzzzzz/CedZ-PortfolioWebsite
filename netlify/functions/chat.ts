import { stream, type Config } from '@netlify/functions'
import { files } from '../../src/content/files'
import { facts } from '../data/facts'
import { chatRequestSchema } from '../lib/chatRequest'
import { GeminiProvider } from '../lib/gemini'
import { rateLimiter } from '../lib/rateLimiter'

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN ?? '',
  process.env.LOCAL_ORIGIN ?? '',
].filter(Boolean)

function getCorsHeaders(origin: string | undefined): Record<string, string> {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin ?? '')
    ? (origin as string)
    : ALLOWED_ORIGINS[0] ?? ''

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function jsonResponse(
  statusCode: number,
  body: object,
  extraHeaders: Record<string, string> = {},
) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  }
}

export const config: Config = {
  path: '/api/chat',
}

export const handler = stream(async (event) => {
  const origin = event.headers.origin
  const corsHeaders = getCorsHeaders(origin)

  if (event.httpMethod === 'OPTIONS')
    return { statusCode: 204, headers: corsHeaders, body: '' }

  if (origin && !ALLOWED_ORIGINS.includes(origin))
    return jsonResponse(403, { error: 'Forbidden' }, corsHeaders)

  if (event.httpMethod !== 'POST')
    return jsonResponse(405, { error: 'Method Not Allowed' }, corsHeaders)

  let body: unknown
  try {
    body = JSON.parse(event.body ?? '{}')
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' }, corsHeaders)
  }

  const parsedRequest = chatRequestSchema.safeParse(body)
  if (!parsedRequest.success)
    return jsonResponse(400, { error: 'Invalid request' }, corsHeaders)

  const ip = event.headers['x-forwarded-for'] ?? event.headers['client-ip'] ?? 'unknown'
  if (!rateLimiter(ip))
    return jsonResponse(429, { error: 'Too Many Requests' }, corsHeaders)

  const apiKeys = [
    process.env.GEMINI_CHATBOT_API_KEY ?? process.env.GEMINI_API_KEY,
    process.env.GEMINI_CHATBOT_API_KEY_2 ?? process.env.GEMINI_API_KEY_FALLBACK,
  ].filter((key): key is string => Boolean(key))
  const model =
    process.env.CHATBOT_MODEL ??
    process.env.GEMINI_MODEL ??
    'gemini-3.5-flash-lite'
  if (!apiKeys.length)
    return jsonResponse(500, { error: 'AI service is not configured' }, corsHeaders)

  const activeFileId = files.some(
    ({ id }) => id === parsedRequest.data.activeFileId,
  )
    ? parsedRequest.data.activeFileId!
    : null

  try {
    const provider = new GeminiProvider(apiKeys, model)
    const request = { ...parsedRequest.data, activeFileId }
    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        const send = (event: object) =>
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
        void provider
          .generateResponseStream(
            request,
            JSON.stringify(facts, null, 2),
            (text) => send({ type: 'text', text }),
          )
          .then((reply) => send({ type: 'complete', reply }))
          .catch((error: unknown) => {
            console.error('Error generating Byte reply:', error)
            send({
              type: 'error',
              message:
                'Byte AI is unavailable right now. Please try again in a moment.',
            })
          })
          .finally(() => controller.close())
      },
    })

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'content-type': 'application/x-ndjson; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
      },
      body,
    }
  } catch (error) {
    console.error('Error preparing Byte reply:', error)
    return jsonResponse(
      502,
      { error: 'Byte AI is unavailable right now. Please try again in a moment.' },
      corsHeaders,
    )
  }
})
