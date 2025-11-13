import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@admin-dashboard/shared-ui': path.resolve(__dirname, '../../packages/shared-ui'),
      '@admin-dashboard/types': path.resolve(__dirname, '../../packages/types')
    }
  },
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
})
