import { z } from 'zod'

export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(1000, 'Message must be less than 1000 characters'),
  activeFileId: z.string().max(100).nullable().optional(),
  history: z
    .array(
      z.object({
        question: z.string().trim().min(1).max(200),
        answer: z.string().trim().min(1).max(2000),
      }),
    )
    .max(8)
    .default([]),
})
