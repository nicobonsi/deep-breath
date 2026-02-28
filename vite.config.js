import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to '/deep-breath/' for GitHub Pages deployment
// (matches the repo name)
export default defineConfig({
  plugins: [react()],
  base: '/deep-breath/',
})
