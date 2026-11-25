import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Flag, Heart, Search, Send, ShieldCheck, Users } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell, PageHeader } from '@/components/site/AppShell'
import { Avatar } from '@/components/site/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  circleMessages,
  circles,
  currentUser,
  defaultMessages,
  directMatches,
  lifeAreas,
  type ChatMessage,
  type LifeArea,
} from '@/lib/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/circles')({
  validateSearch: (s: Record<string, unknown>): { c?: string } => ({
    c: typeof s.c === 'string' ? s.c : undefined,
  }),
  head: () => ({ meta: [{ title: 'Circles · Softground' }] }),
  component: Circles,
})

function Circles() {
  const { c } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [area, setArea] = useState<LifeArea | 'all'>('all')
  const [query, setQuery] = useState('')
  const active = circles.find((x) => x.id === c)

  const list = circles.filter(
    (x) => (area === 'all' || x.area === area) && x.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <AppShell>
      <div className="mx-auto max-w-content px-4 py-8 sm:px-8 md:py-12">
        <PageHeader eyebrow="Circles" title="People going through it, too">
          Moderated, anonymous group chats and one-to-one buddies. Share as much or as little as you like.
        </PageHeader>

        <Tabs defaultValue="groups">
          <TabsList className="rounded-full">
            <TabsTrigger value="groups" className="rounded-full">
              Group circles
            </TabsTrigger>
            <TabsTrigger value="buddies" className="rounded-full">
              Find a buddy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
              <div className={cn('flex flex-col gap-4', active && 'hidden lg:flex')}>
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search circles"
                    aria-label="Search circles"
                    className="h-11 rounded-full bg-card pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Chip on={area === 'all'} onClick={() => setArea('all')}>
                    All
                  </Chip>
                  {lifeAreas.map((a) => (
                    <Chip key={a.id} on={area === a.id} onClick={() => setArea(a.id)}>
                      {a.emoji} {a.label.split(' ')[0]}
                    </Chip>
                  ))}
                </div>
                <ul className="flex flex-col gap-2">
                  {list.length === 0 && (
                    <li className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                      No circles match yet. Try another topic — or suggest a new circle to our guides.
                    </li>
                  )}
                  {list.map((x) => (
                    <li key={x.id}>
                      <button
                        type="button"
                        onClick={() => void navigate({ search: { c: x.id } })}
                        className={cn(
                          'w-full rounded-2xl border p-4 text-left transition-all',
                          c === x.id ? 'border-primary bg-secondary' : 'bg-card hover:border-primary/40',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium">{x.name}</span>
                          {x.nextLive && (
                            <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                              Live {x.nextLive.split(' · ')[0]}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{x.description}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="size-2 rounded-full bg-primary" /> {x.online} here now
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3" /> {x.members.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {active ? (
                <ChatRoom
                  key={active.id}
                  name={active.name}
                  guide={active.guide}
                  online={active.online}
                  initial={circleMessages[active.id] ?? defaultMessages}
                  onBack={() => void navigate({ search: {} })}
                />
              ) : (
                <div className="hidden flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-dashed bg-card/50 p-12 text-center lg:flex">
                  <ShieldCheck className="size-10 text-primary" />
                  <h2 className="text-2xl">Pick a circle to step inside</h2>
                  <p className="max-w-sm text-muted-foreground">
                    Every circle has a trained peer guide. You’ll appear as <strong>@{currentUser.handle}</strong> — never your real name.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="buddies" className="mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {directMatches.map((m) => (
                <div key={m.handle} className="flex flex-col gap-4 rounded-[1.75rem] border bg-card p-6">
                  <Avatar name={m.handle} hue={m.hue} className="size-14 text-lg" />
                  <div>
                    <div className="font-medium">@{m.handle}</div>
                    <div className="text-sm text-muted-foreground">
                      {lifeAreas.find((a) => a.id === m.area)?.label}
                    </div>
                  </div>
                  <p className="text-sm">{m.note}</p>
                  <Button
                    className="mt-auto rounded-full"
                    onClick={() => toast(`Buddy request sent to @${m.handle}. You’ll be notified if they accept.`)}
                  >
                    Say hello
                  </Button>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Buddies are matched on what you’re going through, time zone and how you like to talk. Either of you can end a chat at any time.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-sm transition-colors',
        on ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}

function ChatRoom({
  name,
  guide,
  online,
  initial,
  onBack,
}: {
  name: string
  guide: string
  online: number
  initial: ChatMessage[]
  onBack: () => void
}) {
  const [messages, setMessages] = useState(initial)
  const [hugged, setHugged] = useState<Set<string>>(new Set())
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), author: currentUser.handle, avatarHue: 40, time: 'Now', text, isMe: true },
    ])
    setDraft('')
  }

  return (
    <section aria-label={name} className="flex h-[70vh] min-h-[32rem] flex-col overflow-hidden rounded-[1.75rem] border bg-card">
      <header className="flex items-center gap-3 border-b p-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack} aria-label="Back to circles">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl">{name}</h2>
          <p className="text-xs text-muted-foreground">
            {online} here now · moderated by {guide}
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex gap-3', m.isMe && 'flex-row-reverse')}>
            <Avatar name={m.author} hue={m.avatarHue} />
            <div className={cn('max-w-[80%]', m.isMe && 'text-right')}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground" style={{ justifyContent: m.isMe ? 'flex-end' : undefined }}>
                <span className={cn('font-medium', m.isGuide && 'text-primary')}>{m.isMe ? 'You' : m.author}</span>
                <span>{m.time}</span>
              </div>
              <div
                className={cn(
                  'mt-1 inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed',
                  m.isMe ? 'bg-primary text-primary-foreground' : m.isGuide ? 'bg-secondary' : 'bg-muted',
                )}
              >
                {m.text}
              </div>
              {!m.isMe && (
                <div className="mt-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setHugged((h) => {
                        const n = new Set(h)
                        if (n.has(m.id)) n.delete(m.id)
                        else n.add(m.id)
                        return n
                      })
                    }
                    aria-pressed={hugged.has(m.id)}
                    className={cn(
                      'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors hover:bg-secondary',
                      hugged.has(m.id) ? 'text-plum' : 'text-muted-foreground',
                    )}
                  >
                    <Heart className={cn('size-3', hugged.has(m.id) && 'fill-current')} />
                    {(m.hugs ?? 0) + (hugged.has(m.id) ? 1 : 0)} heard you
                  </button>
                  <button
                    type="button"
                    aria-label="Report message"
                    onClick={() => toast('Thanks — a guide will review this privately.')}
                    className="rounded-full px-2 py-0.5 text-xs text-muted-foreground hover:bg-secondary"
                  >
                    <Flag className="size-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        className="flex gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Share with ${name}…`}
          aria-label="Message"
          className="h-11 rounded-full bg-background"
        />
        <Button type="submit" size="icon-lg" className="rounded-full" disabled={!draft.trim()} aria-label="Send">
          <Send className="size-4" />
        </Button>
      </form>
    </section>
  )
}
