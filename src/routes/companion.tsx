import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ImagePlus, Lock, Send, Settings2, Sparkles, UserRound } from 'lucide-react'
import { AppShell } from '@/components/site/AppShell'
import { Avatar } from '@/components/site/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  approaches,
  companionLooks,
  companionOpening,
  companionReplies,
  companionTones,
  currentUser,
  type ApproachId,
  type ChatMessage,
} from '@/lib/fixtures'
import { img } from '@/lib/img'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/companion')({
  head: () => ({ meta: [{ title: 'Your companion · Softground' }] }),
  component: Companion,
})

type Look = (typeof companionLooks)[number]['id']
const guideHues = [20, 150, 220, 300, 60]

const starters = [
  'My partner and I keep having the same fight',
  'I’m dreading work tomorrow',
  'I feel like I’m not good enough',
  'I can’t switch my brain off',
]

function Companion() {
  const [approach, setApproach] = useState<ApproachId>('auto')
  const [tone, setTone] = useState<(typeof companionTones)[number]>('Warm & gentle')
  const [look, setLook] = useState<Look>('orb')
  const [photo, setPhoto] = useState<string | null>(null)
  const [guideHue, setGuideHue] = useState(150)
  const [memory, setMemory] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>(companionOpening)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const turn = useRef(0)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, typing])

  useEffect(() => () => void (photo && URL.revokeObjectURL(photo)), [photo])

  const send = (text: string) => {
    const t = text.trim()
    if (!t || typing) return
    setMessages((m) => [...m, { id: crypto.randomUUID(), author: 'You', avatarHue: 40, time: 'Now', text: t, isMe: true }])
    setDraft('')
    setTyping(true)
    const pool = companionReplies[approach]
    const reply = pool[turn.current % pool.length]
    turn.current += 1
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: crypto.randomUUID(), author: 'Companion', avatarHue: guideHue, time: 'Now', text: reply }])
    }, 1400)
  }

  const current = approaches.find((a) => a.id === approach)!
  const face = <CompanionFace look={look} photo={photo} hue={guideHue} />

  const settings = (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Approach</legend>
        {approaches.map((a) => (
          <button
            key={a.id}
            type="button"
            aria-pressed={approach === a.id}
            onClick={() => setApproach(a.id)}
            className={cn(
              'rounded-2xl border p-3 text-left transition-all',
              approach === a.id ? 'border-primary bg-secondary' : 'bg-card hover:border-primary/40',
            )}
          >
            <div className="text-sm font-medium">{a.name}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{a.description}</div>
          </button>
        ))}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Tone</legend>
        <div className="flex flex-wrap gap-2">
          {companionTones.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tone === t}
              onClick={() => setTone(t)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                tone === t ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Appearance</legend>
        {companionLooks.map((l) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={look === l.id}
            onClick={() => setLook(l.id)}
            className={cn(
              'flex items-center gap-3 rounded-2xl border p-3 text-left transition-all',
              look === l.id ? 'border-primary bg-secondary' : 'bg-card hover:border-primary/40',
            )}
          >
            <CompanionFace look={l.id} photo={photo} hue={guideHue} className="size-10" />
            <span>
              <span className="block text-sm font-medium">{l.label}</span>
              <span className="block text-xs text-muted-foreground">{l.description}</span>
            </span>
          </button>
        ))}

        {look === 'mirror' && (
          <div className="rounded-2xl bg-plum/10 p-4 text-sm">
            <Label htmlFor="mirror-photo" className="flex cursor-pointer items-center gap-2 font-medium text-plum">
              <ImagePlus className="size-4" /> {photo ? 'Change your photo' : 'Add a selfie'}
            </Label>
            <Input
              id="mirror-photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setPhoto(URL.createObjectURL(f))
              }}
            />
            <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
              <Lock className="mt-0.5 size-3 shrink-0" /> Stays on your device in this preview. Seeing a kind version of yourself can make self-compassion feel more real.
            </p>
          </div>
        )}
        {look === 'custom' && (
          <div className="flex gap-2 pt-1" role="radiogroup" aria-label="Guide color">
            {guideHues.map((h) => (
              <button
                key={h}
                type="button"
                role="radio"
                aria-checked={guideHue === h}
                aria-label={`Guide style ${h}`}
                onClick={() => setGuideHue(h)}
                className={cn('rounded-full ring-offset-2 ring-offset-background', guideHue === h && 'ring-2 ring-primary')}
              >
                <Avatar name="G" hue={h} className="size-9" />
              </button>
            ))}
          </div>
        )}
      </fieldset>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="memory" className="flex flex-col items-start gap-0.5">
          <span>Remember our conversations</span>
          <span className="text-xs font-normal text-muted-foreground">So you don’t have to repeat yourself</span>
        </Label>
        <Switch id="memory" checked={memory} onCheckedChange={setMemory} />
      </div>
    </div>
  )

  return (
    <AppShell>
      <div className="mx-auto grid max-w-content gap-6 px-4 py-6 sm:px-8 md:py-10 xl:grid-cols-[1fr_20rem]">
        <section aria-label="Conversation" className="flex h-[calc(100vh-9rem)] min-h-[34rem] flex-col overflow-hidden rounded-[1.75rem] border bg-card md:h-[calc(100vh-5rem)]">
          <header className="relative flex items-center gap-4 overflow-hidden border-b p-4 sm:p-5">
            <div className="pointer-events-none absolute -top-16 -left-10 size-48 rounded-full bg-gold/25 blur-3xl" />
            <div className="relative">{face}</div>
            <div className="relative flex-1">
              <h1 className="text-2xl">Your companion</h1>
              <p className="text-sm text-muted-foreground">
                {current.short === 'Auto' ? 'Choosing the best approach for you' : current.name} · {tone} · always free
              </p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-full xl:hidden" aria-label="Customize companion">
                  <Settings2 className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl">Make it yours</SheetTitle>
                  <SheetDescription>Choose how your companion supports you. Change it any time.</SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-8">{settings}</div>
              </SheetContent>
            </Sheet>
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6" aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={cn('flex gap-3', m.isMe && 'flex-row-reverse')}>
                {m.isMe ? <Avatar name={currentUser.name} hue={40} /> : <CompanionFace look={look} photo={photo} hue={guideHue} className="size-9" />}
                <div
                  className={cn(
                    'max-w-[78%] rounded-3xl px-4 py-3 text-[15px] leading-relaxed',
                    m.isMe ? 'rounded-tr-md bg-primary text-primary-foreground' : 'rounded-tl-md bg-secondary',
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <CompanionFace look={look} photo={photo} hue={guideHue} className="size-9" />
                <div className="flex items-center gap-1 rounded-3xl rounded-tl-md bg-secondary px-4 py-4" aria-label="Companion is typing">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-2 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pl-12">
                {starters.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex flex-col gap-2 border-t p-3 sm:p-4"
            onSubmit={(e) => {
              e.preventDefault()
              send(draft)
            }}
          >
            <div className="flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Say anything. There’s no wrong way to start."
                aria-label="Message your companion"
                className="h-12 rounded-full bg-background px-5"
              />
              <Button type="submit" size="icon-lg" className="size-12 rounded-full" disabled={!draft.trim() || typing} aria-label="Send">
                <Send className="size-4" />
              </Button>
            </div>
            <p className="px-2 text-center text-[11px] text-muted-foreground">
              Your companion is an AI, not a licensed therapist. Want a human?{' '}
              <Link to="/resources" className="underline underline-offset-2">
                Find affordable therapy
              </Link>
              .
            </p>
          </form>
        </section>

        <aside className="hidden overflow-y-auto xl:block xl:max-h-[calc(100vh-5rem)]">
          <h2 className="mb-1 flex items-center gap-2 text-2xl">
            <Sparkles className="size-5 text-accent" /> Make it yours
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">Different struggles need different kinds of help.</p>
          {settings}
        </aside>
      </div>
    </AppShell>
  )
}

function CompanionFace({ look, photo, hue, className }: { look: Look; photo: string | null; hue: number; className?: string }) {
  const base = cn('size-14 shrink-0 overflow-hidden rounded-full', className)
  if (look === 'mirror') {
    return photo ? (
      <span className={cn(base, 'relative ring-2 ring-gold/70')}>
        <img src={photo} alt="Your companion, in your likeness" className="size-full object-cover saturate-[1.1]" />
        <span className="absolute inset-0 bg-gradient-to-t from-gold/30 to-transparent" />
      </span>
    ) : (
      <span className={cn(base, 'flex items-center justify-center bg-plum/15 text-plum')}>
        <UserRound className="size-1/2" />
      </span>
    )
  }
  if (look === 'custom') return <Avatar name="Guide" hue={hue} className={base} />
  return <img src={img('companion', 160)} alt="" className={cn(base, 'object-cover')} />
}

