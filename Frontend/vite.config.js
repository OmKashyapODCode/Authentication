import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BACKEND_URL = 'http://localhost:5000'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api/v1': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
