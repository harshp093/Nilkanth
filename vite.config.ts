import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate smaller, more cacheable chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React bundle — cached long-term
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          // Animation library
          'framer': ['framer-motion'],
          // Supabase client
          'supabase': ['@supabase/supabase-js'],
          // 3D (heavy, lazy-loaded)
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
    // Increase warning threshold slightly for 3D lib
    chunkSizeWarningLimit: 1000,
  },
})

