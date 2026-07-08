import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-core';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'three';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})


