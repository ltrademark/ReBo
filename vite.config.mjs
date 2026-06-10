import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import esbuild from 'esbuild'

const CODE_ENTRY = 'src/figma/code.ts'
const CODE_OUT = 'dist/code.js'

function figmaCode(options = {}) {
  const buildCode = () => esbuild.build({
    entryPoints: [CODE_ENTRY],
    bundle: true,
    outfile: CODE_OUT,
    ...options,
  })

  return {
    name: 'figma-code',
    async buildStart() {
      await buildCode()
    },
    configureServer(server) {
      server.watcher.add(CODE_ENTRY)
      server.watcher.on('change', async (file) => {
        if (file.includes('src/figma/')) {
          await buildCode()
          server.config.logger.info('[figma-code] rebuilt dist/code.js')
        }
      })
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const isProd = command === 'build'

  return {
    plugins: [
      vue(),
      figmaCode({
        sourcemap: isProd ? false : 'inline',
        minify: isProd,
      }),
      isProd && viteSingleFile(),
    ].filter(Boolean),
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
      port: 5173,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      cssCodeSplit: false,
      sourcemap: mode === 'development' ? 'inline' : false,
      rollupOptions: {
        input: 'ui.html',
      },
    },
  }
})
