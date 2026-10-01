import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves this project from the /CNXH/ subpath.
  base: '/CNXH/',
  build: {
    rollupOptions: {
      input: ['index.html', 'quiz.html', 'result.html'],
    },
  },
});
