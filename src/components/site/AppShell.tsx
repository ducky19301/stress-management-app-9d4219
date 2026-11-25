import { Link } from '@tanstack/react-router'
import { BookHeart, MessagesSquare, Sparkles, Sun, Trees } from 'lucide-react'
import { Logo } from './Logo'
import { Avatar } from './Avatar'
import { CrisisButton } from './CrisisButton'
import { currentUser } from '@/lib/fixtures'

const nav = [
  { to: '/today', label: 'Today', icon: Sun },
  { to: '/companion', label: 'Companion', icon: Sparkles },
  { to: '/circles', label: 'Circles', icon: MessagesSquare },
  { to: '/activities', label: 'Activities', icon: Trees },
  { to: '/resources', label: 'Resources', icon: BookHeart },
] as const

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col gap-8 border-r bg-sidebar p-5 md:flex">
        <Logo />
        <nav aria-label="Main" className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeProps={{ className: 'bg-sidebar-accent !text-sidebar-foreground' }}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          <CrisisButton className="w-full" />
          <div className="flex items-center gap-3 rounded-xl p-2">
            <Avatar name={currentUser.name} hue={40} />
            <div className="text-sm">
              <div className="font-medium">{currentUser.name}</div>
              <div className="text-muted-foreground">@{currentUser.handle}</div>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/85 px-4 py-3 backdrop-blur md:hidden">
        <Logo />
        <CrisisButton compact className="size-10 p-0" />
      </header>

      <main className="pb-24 md:pb-0">{children}</main>

      <nav
        aria-label="Main"
        className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border bg-card/95 p-1.5 shadow-lg backdrop-blur md:hidden"
      >
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium text-muted-foreground"
            activeProps={{ className: 'bg-secondary !text-foreground' }}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="rise flex flex-col gap-3 pb-8">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</span>
      <h1 className="text-4xl font-medium sm:text-5xl">{title}</h1>
      {children && <div className="max-w-reading text-lg text-muted-foreground">{children}</div>}
    </div>
  )
}
