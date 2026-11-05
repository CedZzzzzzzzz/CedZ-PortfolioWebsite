import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

it.each([undefined, 'false', '1', 'TRUE'])(
  'disables demo uploads unless explicitly enabled: %s',
  async (value) => {
    vi.resetModules()
    vi.stubEnv('VITE_ENABLE_DEMO_UPLOADS', value)
    expect((await import('./config')).demoUploadsEnabled).toBe(false)
  },
)

it('enables demo uploads only for the explicit true value', async () => {
  vi.resetModules()
  vi.stubEnv('VITE_ENABLE_DEMO_UPLOADS', 'true')
  expect((await import('./config')).demoUploadsEnabled).toBe(true)
})

it('disables demo uploads in production even when explicitly enabled', async () => {
  vi.resetModules()
  vi.stubEnv('PROD', true)
  vi.stubEnv('VITE_ENABLE_DEMO_UPLOADS', 'true')
  expect((await import('./config')).demoUploadsEnabled).toBe(false)
})
