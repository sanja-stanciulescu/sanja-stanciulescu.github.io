import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game1: resolve(__dirname, 'game1/index.html'),
        game2: resolve(__dirname, 'game2/index.html'),
        htp: resolve(__dirname, 'htp/index.html'),
      },
    },
  },
  base: "/"
})