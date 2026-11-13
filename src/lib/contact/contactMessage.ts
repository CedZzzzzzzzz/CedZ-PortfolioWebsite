import { z } from 'zod'

export const MESSAGE_MAX = 2000

/** One schema for the form and the function, so both reject the same input. */
export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, 'enter your name').max(80),
  email: z
    .string()
    .trim()
    .min(1, 'enter your email')
    .max(120)
    .pipe(z.email('use a full address, like name@domain.com')),
  org: z.string().trim().max(100),
  message: z.string().trim().min(1, 'write a message').max(MESSAGE_MAX),
})

export type ContactMessage = z.infer<typeof contactMessageSchema>
export type ContactField = keyof ContactMessage
export type ContactErrors = Partial<Record<ContactField, string>>

export type ContactValidation =
  { ok: true; message: ContactMessage } | { ok: false; errors: ContactErrors }

/** Trims the input and reports the first problem per field. */
export function validateContactMessage(
  input: Record<ContactField, string>,
): ContactValidation {
  const result = contactMessageSchema.safeParse(input)
  if (result.success) return { ok: true, message: result.data }

  const errors: ContactErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField
    errors[field] ??= issue.message
  }
  return { ok: false, errors }
}
