import type { Config } from '@netlify/functions'
import { profile } from '../../src/content/profile'
import { fetchContributionCalendar } from '../lib/githubContributions'

export const config: Config = {
  path: '/api/github',
}

// The login is fixed server-side so this endpoint can't be used as an open GitHub proxy.
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET')
    return Response.json(
      { error: 'Method Not Allowed' },
      { status: 405, headers: { Allow: 'GET' } },
    )

  const token = process.env.GITHUB_TOKEN
  if (!token)
    return Response.json(
      { error: 'GitHub is not configured' },
      { status: 503 },
    )

  try {
    const calendar = await fetchContributionCalendar(profile.github, token)
    return Response.json(calendar, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        // The CDN keeps one copy for 6h, so GitHub sees a handful of calls a day.
        'Netlify-CDN-Cache-Control':
          'public, durable, s-maxage=21600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error)
    return Response.json({ error: 'GitHub is unavailable' }, { status: 502 })
  }
}
