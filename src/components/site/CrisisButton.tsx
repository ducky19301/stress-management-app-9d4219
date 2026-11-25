import { LifeBuoy, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { crisisLines } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

export function CrisisButton({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn('rounded-full border-plum/40 text-plum hover:bg-plum/10 hover:text-plum', className)}
        >
          <LifeBuoy className="size-4" />
          {compact ? <span className="sr-only">Get help now</span> : 'Get help now'}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">You don’t have to hold this alone</SheetTitle>
          <SheetDescription>
            If you might hurt yourself or someone else, or you’re not safe at home, reach a real person right now. These are free and confidential.
          </SheetDescription>
        </SheetHeader>
        <ul className="flex flex-col gap-3 px-4 pb-6">
          {crisisLines.map((line) => (
            <li key={line.name}>
              <a
                href={line.href}
                className="flex items-start gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-plum/50 hover:bg-plum/5"
              >
                <Phone className="mt-0.5 size-4 text-plum" />
                <span>
                  <span className="block font-medium">{line.name}</span>
                  <span className="block text-sm text-muted-foreground">
                    {line.how} · {line.region}
                  </span>
                </span>
              </a>
            </li>
          ))}
          <li className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
            In immediate danger? Call your local emergency number (911 in the US, 999 in the UK, 112 in the EU).
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  )
}
