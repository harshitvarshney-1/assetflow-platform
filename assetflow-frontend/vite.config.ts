import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
=======
import path from 'path'
>>>>>>> d3f4f0024265df3fe6391d70be0cb2dc7ee5a611

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
=======
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
>>>>>>> d3f4f0024265df3fe6391d70be0cb2dc7ee5a611
})
