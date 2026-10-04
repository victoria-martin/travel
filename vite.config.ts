import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

/*
  Sortie en IIFE, pas en module : l'app tourne encore en file:// / scripts classiques
  (voir index.html), où un <script type="module"> casse sur les imports cross-origin.
  react-app.js s'inclut donc comme n'importe quel autre <script src> de l'app.
*/
export default defineConfig({
  plugins: [
    react(),
  ],
  // React/Radix référencent process.env.NODE_ENV (code mort en prod, mais évalué quand même par
  // endroits) — remplacé en dur à la build puisqu'un navigateur nu n'a pas `process`.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
