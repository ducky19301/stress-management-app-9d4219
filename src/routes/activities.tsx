import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Clock, Users, User } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell, PageHeader } from '@/components/site/AppShell'
import { KindGlyph } from '@/components/site/KindGlyph'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { activities, activityKinds, type Activity } from '@/lib/fixtures'
import { img } from '@/lib/img'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/activities')({
  head: () => ({ meta: [{ title: 'Activities · Softground' }] }),
  component: Activities,
})

type Kind = (typeof activityKinds)[number]['id']
type Mode = 'any' | 'solo' | 'together'

const kindTint: Record<Activity['kind'], string> = {
  calm: 'bg-sky/40',
  move: 'bg-accent/20',
  outdoors: 'bg-primary/15',
  create: 'bg-gold/35',
  connect: 'bg-plum/15',
  reflect: 'bg-secondary',
}

function Activities() {
  const [kind, setKind] = useState<Kind>('all')
  const [mode, setMode] = useState<Mode>('any')
  const [quick, setQuick] = useState(false)
  const [open, setOpen] = useState<Activity | null>(null)

  const list = activities.filter(
    (a) =>
      (kind === 'all' || a.kind === kind) &&
      (mode === 'any' || a.mode === mode || a.mode === 'both') &&
      (!quick || a.minutes <= 10),
  )

  return (
    <AppShell>
      <div className="mx-auto max-w-content px-4 py-8 sm:px-8 md:py-12">
        <PageHeader eyebrow="Activities" title="Get out of your head, gently">
          Walks, art, movement and connection — almost all free. Do them alone, with your partner, or with people from your circles.
        </PageHeader>

        <div className="sticky top-14 z-30 -mx-4 flex flex-col gap-3 bg-background/90 px-4 py-3 backdrop-blur md:top-0 sm:-mx-8 sm:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {activityKinds.map((k) => (
              <button
                key={k.id}
                type="button"
                aria-pressed={kind === k.id}
                onClick={() => setKind(k.id)}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors',
                  kind === k.id ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary',
                )}
              >
                {k.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="inline-flex rounded-full border bg-card p-1" role="group" aria-label="Who with">
              {(
                [
                  ['any', 'Anyone'],
                  ['solo', 'Just me'],
                  ['together', 'With others'],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={mode === v}
                  onClick={() => setMode(v)}
                  className={cn('rounded-full px-3 py-1 transition-colors', mode === v ? 'bg-secondary font-medium' : 'text-muted-foreground')}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={quick}
              onClick={() => setQuick((q) => !q)}
              className={cn('rounded-full border px-3 py-1.5 transition-colors', quick ? 'border-accent bg-accent/15' : 'bg-card')}
            >
              ⚡ 10 minutes or less
            </button>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-8 rounded-[1.75rem] border border-dashed p-12 text-center text-muted-foreground">
            Nothing matches all of those filters. Try “Anyone” or a different type.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setOpen(a)}
                className={cn(
                  'group rise flex flex-col overflow-hidden rounded-[1.75rem] border bg-card text-left transition-all hover:-translate-y-1 hover:shadow-lg',
                  a.image && i % 5 === 0 && 'sm:col-span-2',
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {a.image ? (
                  <img src={img(a.image, 900)} alt="" className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                ) : (
                  <div className={cn('flex aspect-[16/9] items-center justify-center text-6xl', kindTint[a.kind])}>
                    <KindGlyph kind={a.kind} />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> {a.minutes} min
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      {a.mode === 'solo' ? <User className="size-3" /> : <Users className="size-3" />}
                      {a.mode === 'solo' ? 'Solo' : a.mode === 'together' ? 'Together' : 'Solo or together'}
                    </span>
                    <span className={cn('ml-auto rounded-full px-2 py-0.5 font-medium', a.cost === 'Free' ? 'bg-primary/10 text-primary' : 'bg-gold/30')}>
                      {a.cost}
                    </span>
                  </div>
                  <h2 className="text-2xl">{a.title}</h2>
                  <p className="text-sm text-muted-foreground">{a.blurb}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="rounded-[1.75rem] sm:max-w-lg">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-3xl">{open.title}</DialogTitle>
                <DialogDescription>{open.blurb}</DialogDescription>
              </DialogHeader>
              <ol className="flex flex-col gap-2">
                {open.steps.map((s, i) => (
                  <li key={s} className="flex items-start gap-3 rounded-2xl bg-muted p-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="flex-1 rounded-full"
                  onClick={() => {
                    toast(`Started “${open.title}”. Go gently 🌿`)
                    setOpen(null)
                  }}
                >
                  Start now
                </Button>
                {open.mode !== 'solo' && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => {
                      toast('Invite link copied — share it with someone you trust.')
                      setOpen(null)
                    }}
                  >
                    Invite someone
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
