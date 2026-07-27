import type { Config, Handler } from '@netlify/functions';
import { z } from 'zod';
import { facts } from '../data/facts';
import { rateLimiter } from '../lib/rateLimiter';
import { GeminiProvider } from '../lib/gemini';

const ALLOWED_ORIGINS = [
    process.env.ALLOWED_ORIGIN ?? '',
    process.env.LOCAL_ORIGIN ?? ''
].filter(Boolean);

const requestSchema = z.object({
    message: z.string().trim().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters')
});

function getCorsHeaders(origin: string | undefined): Record<string, string> {
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin ?? '')
        ? (origin as string)
        : ALLOWED_ORIGINS[0] ?? '';

    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

function jsonResponse(statusCode: number, body: object, extraHeaders: Record<string, string> = {}) {
    return {
        statusCode,
        headers: {
            'content-type': 'application/json',
            ...extraHeaders
        },
        body: JSON.stringify(body)
    };
}

export const config: Config = {
    path: '/api/chat'
};

export const handler: Handler = async event => {
    
    const origin = event.headers['origin'];
    const corsHeaders = getCorsHeaders(origin);

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
        return jsonResponse(403, { error: 'Forbidden' }, corsHeaders);
    }

    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method Not Allowed' }, corsHeaders);
    }

    const ip = event.headers['x-forwarded-for'] ?? event.headers['client-ip'] ?? 'unknown';

    if (!rateLimiter(ip)) {
        return jsonResponse(429, { error: 'Too Many Requests' }, corsHeaders);
    }

    const apiKey1 = process.env.GEMINI_CHATBOT_API_KEY;
    const apiKey2 = process.env.GEMINI_CHATBOT_API_KEY_2;
    const model = process.env.CHATBOT_MODEL;

    const apiKeys = [apiKey1, apiKey2].filter(Boolean) as string[];

    if (!apiKeys.length || !model) {
        return jsonResponse(500, { error: 'Internal Server Error' }, corsHeaders);
    }

    let body: unknown;

    try {
        body = JSON.parse(event.body ?? '{}');
    } catch {
        return jsonResponse(400, { error: 'Invalid JSON' }, corsHeaders);
    }

    const parsedRequest = requestSchema.safeParse(body);

    if (!parsedRequest.success) {
        return jsonResponse(400, { error: 'Invalid request' }, corsHeaders);
    }

    const portfolioContext = JSON.stringify(facts, null, 2);

    try {

        const provider = new GeminiProvider(apiKeys, model);
        const reply = await provider.generateResponse(parsedRequest.data.message, portfolioContext);

        return jsonResponse(200, { message:reply }, corsHeaders);

    } catch (error) {
        console.error('Error generating response:', error);
        return jsonResponse(502, { error: 'The AI service cannot process the request at this time. Please try again later.' }, corsHeaders);
    }
};