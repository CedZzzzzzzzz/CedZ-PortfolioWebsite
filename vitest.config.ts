import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig({
  ...viteConfig,
  test: {
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', 'coverage/**'],
  },
})
