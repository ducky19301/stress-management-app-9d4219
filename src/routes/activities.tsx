import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Clock,
  Pause,
  Play,
  RotateCcw,
  Users,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/site/AppShell";
import { KindGlyph } from "@/components/site/KindGlyph";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { activities, activityKinds, type Activity } from "@/lib/fixtures";
import { addCompletion, getCompletions } from "@/lib/store";
import { img } from "@/lib/img";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activities")({
  head: () => ({ meta: [{ title: "Activities · Softground" }] }),
  component: Activities,
});

type Kind = (typeof activityKinds)[number]["id"];
type Mode = "any" | "solo" | "together";

const kindTint: Record<Activity["kind"], string> = {
  calm: "bg-sky/40",
  move: "bg-accent/20",
  outdoors: "bg-primary/15",
  create: "bg-gold/35",
  connect: "bg-plum/15",
  reflect: "bg-secondary",
};

function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Timer lengths offered: a quick 5, a 10, and the full activity length. */
function timerOptions(minutes: number): number[] {
  return [...new Set([5, 10, minutes].filter((m) => m <= minutes))].sort(
    (a, b) => a - b,
  );
}

function Activities() {
  const [kind, setKind] = useState<Kind>("all");
  const [mode, setMode] = useState<Mode>("any");
  const [quick, setQuick] = useState(false);
  const [open, setOpen] = useState<Activity | null>(null);
  const [doneCounts, setDoneCounts] = useState<Record<string, number>>({});

  // Completions live in localStorage: read them after mount.
  useEffect(() => {
    const counts: Record<string, number> = {};
    for (const c of getCompletions())
      counts[c.activityId] = (counts[c.activityId] ?? 0) + 1;
    setDoneCounts(counts);
  }, []);

  const markDone = (activity: Activity, minutes: number) => {
    addCompletion(activity.id, Math.max(1, Math.round(minutes)));
    setDoneCounts((d) => ({ ...d, [activity.id]: (d[activity.id] ?? 0) + 1 }));
  };

  const list = activities.filter(
    (a) =>
      (kind === "all" || a.kind === kind) &&
      (mode === "any" || a.mode === mode || a.mode === "both") &&
      (!quick || a.minutes <= 10),
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-content px-4 py-8 sm:px-8 md:py-12">
        <PageHeader eyebrow="Activities" title="Get out of your head, gently">
          Walks, art, movement and connection — almost all free. Do them alone,
          with your partner, or with people from your circles.
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
                  "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors",
                  kind === k.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:bg-secondary",
                )}
              >
                {k.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div
              className="inline-flex rounded-full border bg-card p-1"
              role="group"
              aria-label="Who with"
            >
              {(
                [
                  ["any", "Anyone"],
                  ["solo", "Just me"],
                  ["together", "With others"],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={mode === v}
                  onClick={() => setMode(v)}
                  className={cn(
                    "rounded-full px-3 py-1 transition-colors",
                    mode === v
                      ? "bg-secondary font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={quick}
              onClick={() => setQuick((q) => !q)}
              className={cn(
                "rounded-full border px-3 py-1.5 transition-colors",
                quick ? "border-accent bg-accent/15" : "bg-card",
              )}
            >
              ⚡ 10 minutes or less
            </button>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-8 rounded-[1.75rem] border border-dashed p-12 text-center text-muted-foreground">
            Nothing matches all of those filters. Try “Anyone” or a different
            type.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setOpen(a)}
                className={cn(
                  "group rise flex flex-col overflow-hidden rounded-[1.75rem] border bg-card text-left transition-all hover:-translate-y-1 hover:shadow-lg",
                  a.image && i % 5 === 0 && "sm:col-span-2",
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {a.image ? (
                  <img
                    src={img(a.image, 900)}
                    alt=""
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div
                    className={cn(
                      "flex aspect-[16/9] items-center justify-center text-6xl",
                      kindTint[a.kind],
                    )}
                  >
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
                      {a.mode === "solo" ? (
                        <User className="size-3" />
                      ) : (
                        <Users className="size-3" />
                      )}
                      {a.mode === "solo"
                        ? "Solo"
                        : a.mode === "together"
                          ? "Together"
                          : "Solo or together"}
                    </span>
                    {(doneCounts[a.id] ?? 0) > 0 && (
                      <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                        <Check className="size-3" /> Done {doneCounts[a.id]}×
                      </span>
                    )}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-medium",
                        a.cost === "Free"
                          ? "bg-primary/10 text-primary"
                          : "bg-gold/30",
                        (doneCounts[a.id] ?? 0) > 0 ? "" : "ml-auto",
                      )}
                    >
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

      <ActivityDialog
        activity={open}
        doneCount={open ? (doneCounts[open.id] ?? 0) : 0}
        onClose={() => setOpen(null)}
        onDone={(activity, minutes) => markDone(activity, minutes)}
      />
    </AppShell>
  );
}

function ActivityDialog({
  activity,
  doneCount,
  onClose,
  onDone,
}: {
  activity: Activity | null;
  doneCount: number;
  onClose: () => void;
  onDone: (activity: Activity, minutes: number) => void;
}) {
  const options = useMemo(
    () => (activity ? timerOptions(activity.minutes) : []),
    [activity],
  );
  const [duration, setDuration] = useState(5);
  const [remaining, setRemaining] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  // Reset the timer whenever a different activity opens.
  useEffect(() => {
    if (!activity) return;
    const d = activity.minutes <= 10 ? activity.minutes : 10;
    setDuration(d);
    setRemaining(d * 60);
    setRunning(false);
    setFinished(false);
  }, [activity?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!running || !activity) return;
    if (remaining <= 0) return;
    const id = window.setInterval(
      () => setRemaining((r) => Math.max(0, r - 1)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [running, remaining, activity]);

  // Timer hit zero: stop, celebrate, log the completion once.
  useEffect(() => {
    if (!activity || remaining !== 0 || finished || !running) return;
    setRunning(false);
    setFinished(true);
    onDone(activity, duration);
    toast(`Nice — you finished “${activity.title}” 🌿`);
  }, [remaining, activity, finished, running, duration, onDone]);

  const pickDuration = (minutes: number) => {
    setDuration(minutes);
    setRemaining(minutes * 60);
    setRunning(false);
    setFinished(false);
  };

  const finishEarly = () => {
    if (!activity) return;
    const elapsed = Math.max(1, Math.ceil((duration * 60 - remaining) / 60));
    onDone(activity, elapsed);
    setRunning(false);
    setFinished(true);
    toast(
      `Logged “${activity.title}” — ${elapsed} calm minute${elapsed === 1 ? "" : "s"} 🌿`,
    );
    onClose();
  };

  const progress =
    activity && duration > 0 ? 1 - remaining / (duration * 60) : 0;

  return (
    <Dialog open={!!activity} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-[1.75rem] sm:max-w-lg">
        {activity && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl">
                {activity.title}
              </DialogTitle>
              <DialogDescription>{activity.blurb}</DialogDescription>
            </DialogHeader>

            <ol className="flex flex-col gap-2">
              {activity.steps.map((s, i) => (
                <li
                  key={s}
                  className="flex items-start gap-3 rounded-2xl bg-muted p-3 text-sm"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>

            {/* Start-now timer */}
            <div className="rounded-2xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Timer</span>
                <div
                  className="flex gap-1"
                  role="group"
                  aria-label="Timer length"
                >
                  {options.map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={duration === m}
                      onClick={() => pickDuration(m)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs transition-colors",
                        duration === m
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-secondary",
                      )}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>
              <div
                className="mt-3 text-center font-display text-5xl tabular-nums"
                aria-live="off"
              >
                {finished ? "Done 🌿" : formatClock(remaining)}
              </div>
              <Progress
                value={progress * 100}
                className="mt-3 h-2"
                aria-label="Timer progress"
              />
              <div className="mt-3 flex gap-2">
                <Button
                  className="flex-1 rounded-full"
                  disabled={finished}
                  onClick={() => setRunning((r) => !r)}
                >
                  {running ? (
                    <>
                      <Pause className="size-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="size-4" />{" "}
                      {remaining < duration * 60 ? "Resume" : "Start now"}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  aria-label="Reset timer"
                  onClick={() => pickDuration(duration)}
                >
                  <RotateCcw className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  disabled={finished}
                  onClick={finishEarly}
                >
                  <Check className="size-4" /> Mark done
                </Button>
              </div>
              {doneCount > 0 && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  You’ve done this {doneCount} time{doneCount === 1 ? "" : "s"}{" "}
                  — it counts toward your week.
                </p>
              )}
            </div>

            {activity.mode !== "solo" && (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  toast(
                    "Invite link copied — share it with someone you trust.",
                  );
                  onClose();
                }}
              >
                Invite someone
              </Button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
