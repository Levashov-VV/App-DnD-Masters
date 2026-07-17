import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';


export default defineConfig({
  base: '/App-DnD-Masters/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      svg: {
        multipass: true,
      },
    }),
  ],
  optimizeDeps: {
    include: ['three'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
