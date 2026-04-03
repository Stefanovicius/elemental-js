import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      input: resolve(__dirname, 'src/browser.js'),
      output: {
        format: 'iife',
        entryFileNames: 'elemental.min.js',
        inlineDynamicImports: true
      }
    }
  }
})
