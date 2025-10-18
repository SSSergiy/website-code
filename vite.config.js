import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: '_site/assets',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: './src/assets/js/main.js',
        style: './src/assets/main.css',
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/style.css';
          }
          return 'css/[name].[ext]';
        },
        entryFileNames: 'js/[name].js',
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  server: {
    port: 3001,
    open: false,
  },
});
