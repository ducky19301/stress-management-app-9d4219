import { cn } from '@/lib/utils'

/** Soft gradient avatar for anonymous handles — no photos in peer spaces. */
export function Avatar({ name, hue, className }: { name: string; hue: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white', className)}
      style={{
        background: `radial-gradient(circle at 30% 30%, oklch(0.8 0.1 ${hue}), oklch(0.5 0.1 ${hue + 30}))`,
      }}
    >
      {name.replace(/[^a-z]/gi, '').charAt(0).toUpperCase()}
    </span>
  )
}
