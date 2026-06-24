import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Эта строка говорит проекту, что все пути должны начинаться с названия вашего репозитория
  base: '/dchs-balqash-safety/', 
})
