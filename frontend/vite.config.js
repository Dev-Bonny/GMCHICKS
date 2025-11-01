// frontend/vite.config.js

const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  plugins: [react()],
  base: '/', // This is correct from your old file
  build: {    // This is correct from your old file
    outDir: 'dist',
  },
  // The server.proxy is for development only, it has no effect on Vercel
  // But we leave it here for your local 'npm run dev'
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