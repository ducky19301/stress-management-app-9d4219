/** Serve a generated illustration from /public/img.
 * On Netlify, images go through the Netlify Image CDN (resize + webp).
 * On Cloudflare Pages (built with VITE_IMG_CDN=direct), serve the file
 * directly — there is no Netlify Image CDN there. */
export function img(name: string, width: number) {
  if (import.meta.env.VITE_IMG_CDN === "direct") {
    return `/img/${name}.png`;
  }
  return `/.netlify/images?url=/img/${name}.png&w=${width}&fm=webp`;
}
