import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get base path from environment variable or default to '/'
const basePath = process.env.GITHUB_PAGES_BASE || '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  base: basePath,
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: './index.html',
    },
  },
})

