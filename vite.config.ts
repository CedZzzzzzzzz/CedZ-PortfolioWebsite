import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: ['chrome111', 'edge111', 'firefox113', 'safari16.4'],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/framer-motion/')) return 'framer-motion'
          if (id.includes('/node_modules/motion-dom/')) return 'framer-motion'
          if (id.includes('/node_modules/motion-utils/')) return 'framer-motion'
          return undefined
        },
      },
    },
  },
})
