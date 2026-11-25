const glyphs: Record<string, string> = {
  calm: '🫧',
  move: '🌀',
  outdoors: '🌿',
  create: '🎨',
  connect: '🫶',
  reflect: '📓',
}

export function KindGlyph({ kind }: { kind: string }) {
  return <span aria-hidden>{glyphs[kind] ?? '✨'}</span>
}
