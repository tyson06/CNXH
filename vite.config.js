import { defineConfig } from 'vite';

export default defineConfig({
  // This is the tyson06.github.io user site, served from the domain root.
  base: '/',
  build: {
    rollupOptions: {
      input: ['index.html', 'quiz.html', 'result.html'],
    },
  },
});
