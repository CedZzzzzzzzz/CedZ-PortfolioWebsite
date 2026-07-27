import { GoogleGenAI } from '@google/genai';
import type { Chatprovider } from './provider';

export class GeminiProvider implements Chatprovider {
    private keys: string[];
    private model: string;

    constructor(apiKeys: string[], model: string) {
        this.keys = apiKeys;
        this.model = model;
    }

    async generateResponse(message: string, context: string): Promise<string> {
        let lastError: unknown;

        for (const key of this.keys) {
            try {
                const client = new GoogleGenAI({ apiKey: key });

                const response = await client.models.generateContent({
                    model: this.model,
                    contents: `
                        Approved portfolio facts:
                        ${context}

                        Visitor's question:
                        ${message}
                    `,
                    config: {
                        systemInstruction:
                            `You are CedZ a portfolio assistant.
                            You answer for Marcus, you do not claim to be Marcus.
                            Use only the approved portfolio facts provided in the user message.
                            Do not invent skills, projects, certifications, experience, contact details, or availability.
                            Respond in plain text only.
                            Do not use Markdown.
                            Do not use bold, italics and bullet formatting. For links, kindly provide the full URL with out any parentheses or brackets.
                            If the answer is not present in the facts, say that you do not have that information.
                            Keep responses concise and professional.`,
                    }
                });

                const reply = response.text?.trim();

                if (!reply) {
                    throw new Error('Error: No response generated.');
                }

                return reply;

            } catch (err: unknown) {
                const status = (err as { status?: number })?.status;
                const isRetryable = status === 503 || status === 429;
                const hasNextKey = this.keys.indexOf(key) < this.keys.length - 1;

                if (isRetryable && hasNextKey) {
                    console.warn(`Key ending in ${key.slice(-6)} hit ${status}, trying next key...`);
                    lastError = err;
                    continue;
                }
                throw err;
            }
        }

        throw lastError;
    }
}