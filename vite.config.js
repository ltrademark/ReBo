import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    vue(),
    command === 'build' && viteSingleFile(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    port: 5173,
    cors: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
    sourcemap: mode === 'development' ? 'inline' : false,
    rollupOptions: {
      input: 'ui.html',
    }
  }
}))
