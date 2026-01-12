import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
        },
      },
    },
    // Minification
    minify: 'esbuild',
    // Source maps only for errors
    sourcemap: false,
    // Target modern browsers
    target: 'es2020',
  },
})
