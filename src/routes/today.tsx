import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Flame, Radio, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/site/AppShell'
import { BreathingOrb } from '@/components/site/BreathingOrb'
import { KindGlyph } from '@/components/site/KindGlyph'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { activities, circles, currentUser, moods, prompts, weekMoods, weeklyPulse } from '@/lib/fixtures'
import { img } from '@/lib/img'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/today')({
  head: () => ({ meta: [{ title: 'Today · Softground' }] }),
  component: Today,
})

const suggestions: Record<number, string[]> = {
  1: ['box-breathing', 'shake-it-off', 'unsent-letter'],
  2: ['shake-it-off', 'worry-window', 'noticing-walk'],
  3: ['noticing-walk', 'scribble-it-out', 'worry-window'],
  4: ['scribble-it-out', 'repair-conversation', 'sketch-club'],
  5: ['sketch-club', 'cook-together', 'repair-conversation'],
}

function Today() {
  const [mood, setMood] = useState<number | null>(null)
  const [promptIdx, setPromptIdx] = useState(0)
  const [entry, setEntry] = useState('')

  const picks = (suggestions[mood ?? 3] ?? []).map((id) => activities.find((a) => a.id === id)!).filter(Boolean)
  const live = circles.filter((c) => c.nextLive).slice(0, 2)
  const week = mood ? [...weekMoods.slice(0, 6), { day: 'Today', value: mood }] : weekMoods

  return (
    <AppShell>
      <div className="mx-auto max-w-content px-4 py-8 sm:px-8 md:py-12">
        <div className="rise flex flex-wrap items-end justify-between gap-4 pb-8">
          <div>
            <p className="text-muted-foreground">Sunday, November 23</p>
            <h1 className="mt-1 text-4xl sm:text-5xl">Hey {currentUser.name}, how are you, really?</h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium">
            <Flame className="size-4 text-accent" /> {currentUser.streak}-day check-in streak
          </span>
        </div>

        {/* Mood check-in */}
        <section aria-labelledby="checkin" className="rise rounded-[1.75rem] border bg-card p-6 [animation-delay:80ms] sm:p-8">
          <h2 id="checkin" className="text-2xl">
            Check in
          </h2>
          <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                aria-pressed={mood === m.value}
                onClick={() => {
                  setMood(m.value)
                  toast(m.value <= 2 ? 'Thank you for being honest. Let’s go gently today.' : 'Logged. Nice to see you.')
                }}
                className={cn(
                  'group flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all sm:p-4',
                  mood === m.value ? 'border-foreground/30 bg-secondary shadow-sm' : 'hover:bg-muted',
                )}
              >
                <span
                  className="size-10 rounded-full transition-transform group-hover:scale-110 sm:size-12"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, color-mix(in oklch, ${m.color} 40%, white), ${m.color})`,
                    transform: mood === m.value ? 'scale(1.15)' : undefined,
                  }}
                />
                <span className="text-center text-xs font-medium sm:text-sm">{m.label}</span>
              </button>
            ))}
          </div>
          {mood !== null && mood <= 2 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-plum/10 p-4 text-sm">
              <span>Heavy day. Your companion is free right now if you want to talk it through.</span>
              <Button asChild size="sm" className="rounded-full">
                <Link to="/companion">Talk now</Link>
              </Button>
            </div>
          )}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Breathe */}
          <section className="rise flex flex-col items-center justify-center rounded-[1.75rem] bg-primary p-8 text-primary-foreground [animation-delay:160ms]">
            <h2 className="mb-6 text-2xl">Reset in 60 seconds</h2>
            <BreathingOrb />
          </section>

          {/* Suggestions */}
          <section className="rise flex flex-col gap-4 [animation-delay:220ms]">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl">{mood ? 'Picked for how you feel' : 'Gentle ideas for today'}</h2>
              <Link to="/activities" className="text-sm font-medium text-primary hover:underline">
                All activities
              </Link>
            </div>
            {picks.map((a) => (
              <Link
                key={a.id}
                to="/activities"
                className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary text-2xl">
                  {a.image ? <img src={img(a.image, 120)} alt="" className="size-full object-cover" /> : <KindGlyph kind={a.kind} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{a.title}</div>
                  <div className="truncate text-sm text-muted-foreground">{a.blurb}</div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {a.minutes} min · {a.mode === 'solo' ? 'Solo' : a.mode === 'together' ? 'Together' : 'Either'}
                </span>
              </Link>
            ))}
            <Link
              to="/companion"
              className="flex items-center gap-4 rounded-2xl bg-secondary p-4 transition-colors hover:bg-secondary/70"
            >
              <img src={img('companion', 120)} alt="" className="size-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="size-4 text-accent" /> Your companion is here
                </div>
                <div className="text-sm text-muted-foreground">Free, private, any hour.</div>
              </div>
              <ArrowRight className="size-4" />
            </Link>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Journal */}
          <section className="rounded-[1.75rem] border bg-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-2xl">Two-minute journal</h2>
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => setPromptIdx((i) => (i + 1) % prompts.length)}
              >
                New prompt
              </button>
            </div>
            <p className="mt-3 font-display text-lg italic text-muted-foreground">{prompts[promptIdx]}</p>
            <Textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Only you can see this…"
              className="mt-4 min-h-32 rounded-2xl bg-background"
              aria-label="Journal entry"
            />
            <div className="mt-3 flex justify-end">
              <Button
                disabled={!entry.trim()}
                className="rounded-full"
                onClick={() => {
                  setEntry('')
                  toast('Saved to your private journal')
                }}
              >
                Save privately
              </Button>
            </div>
          </section>

          {/* Week */}
          <section className="flex flex-col rounded-[1.75rem] border bg-card p-6">
            <h2 className="text-2xl">Your week</h2>
            <div className="mt-6 flex flex-1 items-end gap-2" role="img" aria-label={`Mood this week: ${week.map((w) => `${w.day} ${moods[w.value - 1].label}`).join(', ')}`}>
              {week.map((w) => (
                <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-full transition-all"
                    style={{ height: `${w.value * 22}px`, background: moods[w.value - 1].color }}
                  />
                  <span className="text-[11px] text-muted-foreground">{w.day}</span>
                </div>
              ))}
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Minutes calm" value={weeklyPulse.minutesCalm} />
              <Stat label="Kind words given" value={weeklyPulse.kindWords} />
            </dl>
          </section>
        </div>

        {/* Live */}
        <section className="mt-6 rounded-[1.75rem] border bg-card p-6">
          <h2 className="flex items-center gap-2 text-2xl">
            <Radio className="size-5 text-accent" /> Live circles coming up
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {live.map((c) => (
              <Link
                key={c.id}
                to="/circles"
                search={{ c: c.id }}
                className="flex items-center justify-between rounded-2xl bg-muted p-4 transition-colors hover:bg-secondary"
              >
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-muted-foreground">{c.guide}</div>
                </div>
                <span className="rounded-full bg-background px-3 py-1 text-xs font-medium">{c.nextLive}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-display text-2xl">{value}</dd>
    </div>
  )
}
