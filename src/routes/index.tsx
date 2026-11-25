import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BookHeart, HeartHandshake, Lock, MessagesSquare, Sparkles, Trees, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/site/Logo'
import { CrisisButton } from '@/components/site/CrisisButton'
import { Avatar } from '@/components/site/Avatar'
import { img } from '@/lib/img'
import { lifeAreas } from '@/lib/fixtures'

export const Route = createFileRoute('/')({
  component: Home,
})

const pillars = [
  {
    icon: Sparkles,
    title: 'An AI companion that’s always free',
    body: 'Talk at 3am or on your lunch break. Choose CBT, DBT, ACT, couples-focused or compassion-based support — or let it pick what fits.',
    to: '/companion',
  },
  {
    icon: MessagesSquare,
    title: 'Circles of people who get it',
    body: 'Moderated peer chats for breakups, burnout, family stress and more. Anonymous handles, real kindness.',
    to: '/circles',
  },
  {
    icon: Trees,
    title: 'Things to do, alone or together',
    body: 'Walks, art, breathwork, cook-alongs and couples check-ins. Almost all free, all under an hour.',
    to: '/activities',
  },
  {
    icon: BookHeart,
    title: 'Resources that actually help',
    body: 'Books worth your time, low-cost therapists near you, and the free options most people don’t know about.',
    to: '/resources',
  },
] as const

function Home() {
  return (
    <div className="overflow-x-clip">
      {/* Nav */}
      <header className="mx-auto flex max-w-content items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <CrisisButton compact className="size-10 p-0 sm:hidden" />
          <CrisisButton className="hidden sm:inline-flex" />
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/login">Log in</Link>
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-content px-4 pt-8 sm:px-6 md:pt-14">
        <div className="pointer-events-none absolute -top-20 right-0 size-96 rounded-full bg-gold/30 blur-3xl drift" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-primary" /> 1,204 people breathing easier right now
            </span>
            <h1 className="mt-6 text-5xl leading-[1.02] font-normal sm:text-7xl">
              When love, work or <em className="text-accent">life</em> gets heavy —
              <br className="hidden sm:block" /> land somewhere soft.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Softground brings together people who understand, free activities that calm your body, help you can afford, and an AI companion that’s there whenever you need it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
                <Link to="/login">
                  Start free <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7 text-base">
                <Link to="/today">Try a 1-minute breath</Link>
              </Button>
            </div>
          </div>

          <div className="rise relative [animation-delay:150ms]">
            <div className="rounded-[2rem] border bg-card p-5 shadow-xl shadow-primary/5">
              <p className="text-sm text-muted-foreground">What’s on your mind today?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lifeAreas.map((a) => (
                  <Link
                    key={a.id}
                    to="/login"
                    className="rounded-full border bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary hover:bg-secondary"
                  >
                    <span aria-hidden>{a.emoji}</span> {a.label}
                  </Link>
                ))}
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-secondary p-4">
                <img src={img('companion', 96)} alt="" className="size-10 rounded-full object-cover" />
                <p className="text-sm leading-relaxed">
                  “It sounds like you’ve been holding everything together for everyone else. Who’s been holding you?”
                </p>
              </div>
            </div>
          </div>
        </div>

        <img
          src={img('hero', 1600)}
          srcSet={`${img('hero', 800)} 800w, ${img('hero', 1600)} 1600w, ${img('hero', 2200)} 2200w`}
          sizes="(min-width: 1216px) 1216px, 100vw"
          alt="A person resting on a green hillside at golden hour"
          className="rise relative mt-12 w-full rounded-[2rem] object-cover [animation-delay:300ms]"
          width={1584}
          height={672}
        />
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-content px-4 py-24 sm:px-6">
        <h2 className="max-w-2xl text-4xl sm:text-5xl">Four doors in. Use whichever one feels right today.</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, title, body, to }, i) => (
            <Link
              key={title}
              to={to}
              className={`group flex flex-col gap-4 rounded-[1.75rem] border p-7 transition-all hover:-translate-y-1 hover:shadow-lg ${
                i === 0 ? 'bg-primary text-primary-foreground' : 'bg-card'
              }`}
            >
              <Icon className={`size-7 ${i === 0 ? 'text-gold' : 'text-accent'}`} />
              <h3 className="text-2xl">{title}</h3>
              <p className={i === 0 ? 'text-primary-foreground/80' : 'text-muted-foreground'}>{body}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium">
                Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mirror mode */}
      <section className="bg-plum text-white">
        <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <img src={img('companion', 900)} alt="" className="absolute inset-0 size-full rounded-full object-cover mix-blend-luminosity opacity-60" />
            <div className="absolute inset-[18%] flex items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur">
              <div className="text-center">
                <div className="font-display text-3xl">You,</div>
                <div className="font-display text-3xl italic">but kinder.</div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Mirror mode</span>
            <h2 className="mt-3 text-4xl sm:text-5xl">Hear encouragement from the face you see every day.</h2>
            <p className="mt-6 text-lg text-white/80">
              Self-compassion research shows we respond to our own voice and face. With Mirror mode, your companion can take on your look and speak to you the way you’d speak to a best friend. It’s optional, your photo stays private, and you can switch it off any time.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 h-12 rounded-full px-7">
              <Link to="/companion">Meet your companion</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-content px-4 py-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Wallet, t: 'Free at the core', d: 'The companion, circles and almost every activity cost nothing. Forever.' },
            { icon: Lock, t: 'Private by design', d: 'Anonymous handles in circles. Your journal and companion chats are yours alone.' },
            { icon: HeartHandshake, t: 'Humans when it matters', d: 'Trained peer guides moderate every circle, and crisis lines are one tap away.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex flex-col gap-3">
              <Icon className="size-6 text-primary" />
              <h3 className="text-2xl">{t}</h3>
              <p className="text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <figure className="mt-20 rounded-[2rem] bg-secondary p-8 sm:p-12">
          <blockquote className="font-display text-2xl leading-snug sm:text-3xl">
            “I joined the burnout circle on a Sunday night thinking I’d just lurk. Three weeks later we do the walk-and-talk every Thursday.”
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <Avatar name="ember" hue={90} /> ember-tea, member since spring
          </figcaption>
        </figure>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <p className="max-w-lg">
            Softground offers peer and self-guided support. It isn’t a replacement for emergency care or a licensed clinician. In crisis, call or text 988 (US) or your local emergency number.
          </p>
        </div>
      </footer>
    </div>
  )
}
