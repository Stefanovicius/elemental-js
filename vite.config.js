import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      formats: ['es'],
      fileName: () => 'elemental.js'
    },
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
})
