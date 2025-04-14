import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'

console.log(path.resolve(__dirname))

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: '../../../out/webviews/project',
    rollupOptions: {
      output: {
        chunkFileNames: "[name]-[hash].js",
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../src'),
    },
  },
});