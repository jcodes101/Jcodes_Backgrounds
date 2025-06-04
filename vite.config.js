// website build

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
})

// -- vite.config.js for library build

// import { defineConfig } from 'vite';
// import path from 'path';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     lib: {
//       entry: path.resolve(__dirname, 'src/index.js'),
//       name: 'JcodesStyles',
//       fileName: (format) => `index.${format}.js`,
//     },
//     rollupOptions: {
//       external: ['react', 'react-dom'],
//       output: {
//         globals: {
//           react: 'React',
//           'react-dom': 'ReactDOM',
//         },
//       },
//     },
//   },
// });
