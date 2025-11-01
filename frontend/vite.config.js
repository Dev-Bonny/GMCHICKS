// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss'; // <-- Import tailwind
import autoprefixer from 'autoprefixer'; // <-- Import autoprefixer

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 👇 ADD THIS ENTIRE 'css' SECTION 👇
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  // 👆 END OF NEW SECTION 👆

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