import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: true,
    hmr: {
      port: 5173,
      host: 'localhost',
      clientPort: 5173,
      overlay: false
    },
    watch: {
      usePolling: true
    },
    cors: true
  },
  preview: {
    port: 5173,
    host: 'localhost'
  },
  define: {
    global: 'globalThis'
  }
})
