import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/*
  Sortie en IIFE, pas en module : l'app tourne encore en file:// / scripts classiques
  (voir index.html), où un <script type="module"> casse sur les imports cross-origin.
  react-app.js s'inclut donc comme n'importe quel autre <script src> de l'app.
*/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'react-dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/main.tsx',
      name: 'TravelReact',
      formats: ['iife'],
      fileName: () => 'react-app.js',
    },
  },
});
