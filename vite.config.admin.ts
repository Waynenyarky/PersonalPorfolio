import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  server: {
    port: 5174,
    open: '/admin.html',
  },
  build: {
    outDir: 'dist-admin',
    rollupOptions: {
      input: './admin.html',
    },
  },
})
