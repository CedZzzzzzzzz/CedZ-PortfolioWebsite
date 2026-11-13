import type { ContactMessage } from '../../src/lib/contact/contactMessage'

const RESEND_URL = 'https://api.resend.com/emails'

export interface MailSettings {
  apiKey: string
  /** Inbox that receives the message. */
  to: string
  /** Sender shown in the inbox; must be an address Resend lets this key send from. */
  from: string
}

/** Emails a contact-form message through Resend; replies go to the visitor. */
export async function sendContactMail(
  message: ContactMessage,
  settings: MailSettings,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const response = await fetchImpl(RESEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: settings.from,
      to: [settings.to],
      reply_to: message.email,
      subject: `Portfolio message from ${message.name.replace(/\s+/g, ' ')}`,
      text: [
        `From: ${message.name} <${message.email}>`,
        ...(message.org ? [`Company or school: ${message.org}`] : []),
        '',
        message.message,
      ].join('\n'),
    }),
  })
  if (!response.ok) throw new Error(`Resend responded ${response.status}`)
}
