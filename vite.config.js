import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages Project Site is served below /quiz-web/.
  base: '/quiz-web/',
  build: {
    rollupOptions: {
      input: ['index.html', 'quiz.html', 'result.html'],
    },
  },
});
