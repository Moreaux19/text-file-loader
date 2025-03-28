import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/text-file-loader/',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/styles/index.css', // Копируем файл стилей
          dest: 'styles' // В папку dist/styles
        }
      ]
    })
  ]
});
