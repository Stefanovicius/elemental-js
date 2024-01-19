import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'Elemental.js',
      fileName: 'elemental'
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
})
