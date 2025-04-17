import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // 개발 환경에서만 적용되는 프록시 설정
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})