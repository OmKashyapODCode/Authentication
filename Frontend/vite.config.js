import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer';

const BACKEND_URL = 'http://localhost:5000';

export default defineConfig({
  plugins: [react(),tailwindcss(),autoprefixer()],
  server: {
    proxy: {
      '/api/v1': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});