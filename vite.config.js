import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexiones desde cualquier IP
    port: 5173,
    // Configurar para permitir conexiones desde la IP específica
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '192.168.18.23'
    ]
  }
})
