const { spawn } = require('child_process')
const fs = require('fs')

const MANIFEST = 'manifest.json'
const DEV_UI = 'http://localhost:5173/ui.html'

const original = fs.readFileSync(MANIFEST, 'utf8')
const manifest = JSON.parse(original)

manifest.ui = DEV_UI
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`[dev] manifest.json → ${DEV_UI}`)

const opts = { stdio: 'inherit', shell: true }
const vite = spawn('npx', ['vite'], opts)
const code = spawn('npx', ['esbuild', 'src/figma/code.ts',
  '--bundle', '--outfile=dist/code.js', '--sourcemap=inline', '--watch'], opts)

const cleanup = () => {
  fs.writeFileSync(MANIFEST, original)
  console.log('\n[dev] manifest.json restored')
  vite.kill()
  code.kill()
  process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
