import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn('size-8', className)}>
      <circle cx="26" cy="15" r="8" fill="var(--gold)" />
      <path d="M2 30c6-8 12-10 18-6s12 4 18-2v14H2z" fill="var(--primary)" />
      <path d="M2 34c8-5 14-5 20-2s10 2 16-1v9H2z" fill="var(--accent)" opacity=".85" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2 rounded-lg', className)}>
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight">Softground</span>
    </Link>
  )
}
