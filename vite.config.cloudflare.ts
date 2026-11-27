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
//
// NOTE (2026-11-26): do NOT add a `_redirects` catch-all `/* /_shell.html 200`
// here. Cloudflare Pages redirects any `.html` URL to its extension-less
// counterpart, so `/_shell.html` 308s to `/_shell`, which the catch-all
// rewrites to `/_shell.html` again — an infinite redirect loop
// (softground.pages.dev, ERR_TOO_MANY_REDIRECTS, confirmed 2026-11-26).
// Instead, `build:cloudflare` copies the shell to `index.html` (served for
// `/`) and `404.html` (Pages' own fallback for every other route, which is
// exactly the "rewrite 404s to the shell" TanStack Start's SPA docs ask
// for). No `_redirects` file is written at all.
const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({ spa: { enabled: true } }),
    viteReact(),
  ],
});

export default config;
