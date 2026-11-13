import type { ContactMessage } from './contactMessage'

/** `limited` means this visitor has sent too many messages for now. */
export type SendResult = 'sent' | 'limited' | 'failed'

/** Posts the message to `/api/contact`; never rejects. */
export async function sendContactMessage(
  message: ContactMessage,
  /** Hidden field real visitors leave empty; bots that fill it are dropped server-side. */
  website: string,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  try {
    const response = await fetchImpl('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...message, website }),
    })
    if (response.ok) return 'sent'
    return response.status === 429 ? 'limited' : 'failed'
  } catch {
    return 'failed'
  }
}
