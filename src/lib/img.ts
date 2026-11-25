/** Serve a generated illustration from /public/img through the Netlify Image CDN. */
export function img(name: string, width: number) {
  return `/.netlify/images?url=/img/${name}.png&w=${width}&fm=webp`
}
