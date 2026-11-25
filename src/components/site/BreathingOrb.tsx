import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

const phases = ['Breathe in', 'Hold', 'Breathe out', 'Rest'] as const
const CYCLE = 16 // seconds: 4 in, 4 hold, 4 out, 4 rest

export function BreathingOrb() {
  const [running, setRunning] = useState(false)
  const [t, setT] = useState(0)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setT((v) => v + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const phase = phases[Math.floor((t % CYCLE) / 4)]
  const count = 4 - (t % 4)
  const scale = !running ? 0.7 : phase === 'Breathe in' || phase === 'Hold' ? 1 : 0.62

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex size-56 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--gold),var(--accent)_45%,var(--plum))] opacity-80 blur-[2px] transition-transform duration-[4000ms] ease-in-out motion-reduce:transition-none"
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className="absolute inset-6 rounded-full border border-white/40 transition-transform duration-[4000ms] ease-in-out motion-reduce:transition-none"
          style={{ transform: `scale(${scale})` }}
        />
        <div className="relative text-center text-white drop-shadow" aria-live="polite">
          <div className="font-display text-2xl">{running ? phase : 'Ready'}</div>
          {running && <div className="text-4xl font-light tabular-nums">{count}</div>}
        </div>
      </div>
      <Button
        onClick={() => {
          setRunning((r) => !r)
          if (running) setT(0)
        }}
        className="rounded-full px-6"
      >
        {running ? <Pause className="size-4" /> : <Play className="size-4" />}
        {running ? 'Stop' : 'Start a 1-minute breath'}
      </Button>
    </div>
  )
}
