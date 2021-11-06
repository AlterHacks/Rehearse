import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import mkcert from'vite-plugin-mkcert'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  server: {
    https: true
  },
  plugins: [
    WindiCSS(),
    mkcert(),
    vue(),
  ]
})
