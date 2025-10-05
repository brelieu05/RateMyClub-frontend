import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  preview: {
    allowedHosts: [
      'ratemyclub-frontend-production.up.railway.app',
      'localhost',
      '127.0.0.1'
    ]
  }
});