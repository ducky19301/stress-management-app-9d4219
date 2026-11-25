import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Cloudflare Pages build config. The default vite.config.ts stays
// Netlify-flavoured (used by `vite build` and netlify.toml); this file
// builds the same app as a static SPA for Cloudflare Pages. The app has no
// server functions (all data is fixtures + localStorage), so nothing is lost
// by serving it statically — the router takes over in the browser from the
// `_shell.html` this build writes. Build with:
//   vite build --config vite.config.cloudflare.ts
const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({ spa: { enabled: true } }),
    viteReact(),
  ],
});

export default config;
