import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

// Cloudflare build config. The default vite.config.ts stays Netlify-flavoured
// (used by `vite build` and netlify.toml); this file swaps the Netlify plugin
// for the Cloudflare Vite plugin so the same app can also deploy to
// Cloudflare Workers. Build with: vite build --config vite.config.cloudflare.ts
const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), cloudflare({ viteEnvironment: { name: 'ssr' } }), tanstackStart(), viteReact()],
})

export default config
