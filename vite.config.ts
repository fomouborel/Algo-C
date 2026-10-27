import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  worker: {
    format: 'es',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'curriculum-algo': [
            './src/data/algoChaptersPart1.ts',
            './src/data/algoChaptersPart2.ts',
          ],
          'curriculum-c': [
            './src/data/cChaptersPart1.ts',
            './src/data/cChaptersPart2.ts',
          ],
          'execution-engines': [
            './src/engines/algoEngine.ts',
            './src/engines/c99Engine.ts',
            './src/engines/c99LexerParser.ts',
          ],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
