import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    // <model-viewer> ships its own renderer bundle — it is code-split and only
    // loaded when a 3D/AR view opens, so the default warning is too low.
    chunkSizeWarningLimit: 1400,
  },
})
