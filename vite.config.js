import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ],
  // ✅ FASE 3: Path Aliases para imports más limpios
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separar Ant Design
          if (id.includes('node_modules/antd')) {
            return 'antd-core';
          }
          if (id.includes('@ant-design/icons')) {
            return 'antd-icons';
          }
          // Separar React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }
          // Separar charts
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          // Separar date utilities
          if (id.includes('node_modules/dayjs')) {
            return 'date-utils';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
