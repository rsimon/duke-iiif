import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

export default defineConfig({
  plugins: [svelte(), splitVendorChunkPlugin()],
  server: {
    open: './test/index.html'
  },
  build: {
    rollupOptions: {
      input: './test/index.html'
    }
  }
});