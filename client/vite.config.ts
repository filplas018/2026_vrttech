import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";


export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@libs": path.resolve(__dirname, "./src/libs"),
      "@types": path.resolve(__dirname, "../src/types"),
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://web:8000',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'http://web:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
