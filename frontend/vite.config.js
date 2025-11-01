// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <-- Import the new plugin

// https://vitejs.dev/config/
export default defineConfig({
  // 👇 Update the plugins array 👇
  plugins: [
    react(),
    tailwindcss(), // <-- Add the plugin here
  ],
  // 👆 End of new section 👆

  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});