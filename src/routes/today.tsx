import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Flame, Radio, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/site/AppShell";
import { BreathingOrb } from "@/components/site/BreathingOrb";
import { KindGlyph } from "@/components/site/KindGlyph";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { activities, circles, moods, prompts } from "@/lib/fixtures";
import {
  addJournalEntry,
  buildWeekStrip,
  checkinForToday,
  computeStreak,
  deleteJournalEntry,
  getCheckins,
  getCompletions,
  getJournal,
  saveCheckin,
  useProfile,
  weekStats,
  type JournalEntry,
} from "@/lib/store";
import { img } from "@/lib/img";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/today")({
  head: () => ({ meta: [{ title: "Today · Softground" }] }),
  component: Today,
});

const suggestions: Record<number, string[]> = {
  1: ["box-breathing", "shake-it-off", "unsent-letter"],
  2: ["shake-it-off", "worry-window", "noticing-walk"],
  3: ["noticing-walk", "scribble-it-out", "worry-window"],
  4: ["scribble-it-out", "repair-conversation", "sketch-club"],
  5: ["sketch-club", "cook-together", "repair-conversation"],
};

/** Mood-matched picks first, then picks that fit the user's focus areas. */
function pickSuggestions(mood: number | null, focus: string[]): string[] {
  const moodPicks = suggestions[mood ?? 3] ?? [];
  const focusPicks = activities
    .filter((a) => a.helpsWith.some((h) => focus.includes(h)))
    .map((a) => a.id);
  const ordered = [
    ...new Set([
      ...moodPicks.filter((id) => focusPicks.includes(id)),
      ...moodPicks,
      ...focusPicks,
    ]),
  ];
  return ordered.slice(0, 3);
}

function Today() {
  const { profile } = useProfile();
  const [mood, setMood] = useState<number | null>(null);
  const [promptIdx, setPromptIdx] = useState(0);
  const [entry, setEntry] = useState("");
  const [week, setWeek] = useState(() => buildWeekStrip([]));
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({
    checkIns: 0,
    minutesCalm: 0,
    activitiesDone: 0,
  });
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [todayLabel, setTodayLabel] = useState("Today");

  // Stored data lives in localStorage: read it after mount (see AGENTS.md).
  useEffect(() => {
    const tz = profile.timezone;
    setMood(checkinForToday(tz));
    const checkins = getCheckins();
    setWeek(buildWeekStrip(checkins, tz));
    setStreak(computeStreak(checkins, tz));
    setStats(weekStats(checkins, getCompletions(), tz));
    setEntries(getJournal());
    setTodayLabel(
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: tz,
      }).format(new Date()),
    );
  }, [profile.timezone]);

  const checkIn = (value: number) => {
    const checkins = saveCheckin(value, profile.timezone);
    setMood(value);
    setWeek(buildWeekStrip(checkins, profile.timezone));
    setStreak(computeStreak(checkins, profile.timezone));
    setStats(weekStats(checkins, getCompletions(), profile.timezone));
    toast(
      value <= 2
        ? "Thank you for being honest. Let’s go gently today."
        : "Logged. Nice to see you.",
    );
  };

  const saveEntry = () => {
    if (!entry.trim()) return;
    setEntries(addJournalEntry(prompts[promptIdx], entry, profile.timezone));
    setEntry("");
    toast("Saved to your private journal");
  };

  const picks = pickSuggestions(mood, profile.focus)
    .map((id) => activities.find((a) => a.id === id)!)
    .filter(Boolean);
  const live = circles.filter((c) => c.nextLive).slice(0, 2);

  return (
    <AppShell>
      <div className="mx-auto max-w-content px-4 py-8 sm:px-8 md:py-12">
        <div className="rise flex flex-wrap items-end justify-between gap-4 pb-8">
          <div>
            <p className="text-muted-foreground">{todayLabel}</p>
            <h1 className="mt-1 text-4xl sm:text-5xl">
              Hey {profile.name}, how are you, really?
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium">
            <Flame className="size-4 text-accent" />
            {streak > 0
              ? `${streak}-day check-in streak`
              : "Check in today to start your streak"}
          </span>
        </div>

        {/* Mood check-in */}
        <section
          aria-labelledby="checkin"
          className="rise rounded-[1.75rem] border bg-card p-6 [animation-delay:80ms] sm:p-8"
        >
          <h2 id="checkin" className="text-2xl">
            Check in
          </h2>
          <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                aria-pressed={mood === m.value}
                onClick={() => checkIn(m.value)}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all sm:p-4",
                  mood === m.value
                    ? "border-foreground/30 bg-secondary shadow-sm"
                    : "hover:bg-muted",
                )}
              >
                <span
                  className="size-10 rounded-full transition-transform group-hover:scale-110 sm:size-12"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, color-mix(in oklch, ${m.color} 40%, white), ${m.color})`,
                    transform: mood === m.value ? "scale(1.15)" : undefined,
                  }}
                />
                <span className="text-center text-xs font-medium sm:text-sm">
                  {m.label}
                </span>
              </button>
            ))}
          </div>
          {mood !== null && mood <= 2 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-plum/10 p-4 text-sm">
              <span>
                Heavy day. Your companion is free right now if you want to talk
                it through.
              </span>
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
              <h2 className="text-2xl">
                {mood ? "Picked for how you feel" : "Gentle ideas for today"}
              </h2>
              <Link
                to="/activities"
                className="text-sm font-medium text-primary hover:underline"
              >
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
                  {a.image ? (
                    <img
                      src={img(a.image, 120)}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <KindGlyph kind={a.kind} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{a.title}</div>
                  <div className="truncate text-sm text-muted-foreground">
                    {a.blurb}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {a.minutes} min ·{" "}
                  {a.mode === "solo"
                    ? "Solo"
                    : a.mode === "together"
                      ? "Together"
                      : "Either"}
                </span>
              </Link>
            ))}
            <Link
              to="/companion"
              className="flex items-center gap-4 rounded-2xl bg-secondary p-4 transition-colors hover:bg-secondary/70"
            >
              <img
                src={img("companion", 120)}
                alt=""
                className="size-14 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="size-4 text-accent" /> Your companion is
                  here
                </div>
                <div className="text-sm text-muted-foreground">
                  Free, private, any hour.
                </div>
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
            <p className="mt-3 font-display text-lg italic text-muted-foreground">
              {prompts[promptIdx]}
            </p>
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
                onClick={saveEntry}
              >
                Save privately
              </Button>
            </div>
            {entries.length > 0 && (
              <div className="mt-6 border-t pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Recent entries · stored only on this device
                </h3>
                <ul className="mt-3 flex flex-col gap-3">
                  {entries.slice(0, 3).map((e) => (
                    <li
                      key={e.id}
                      className="flex items-start justify-between gap-3 rounded-2xl bg-muted p-4"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {new Date(`${e.date}T12:00:00`).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}{" "}
                          · {e.prompt}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm">{e.text}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Delete journal entry"
                        className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
                        onClick={() => {
                          setEntries(deleteJournalEntry(e.id));
                          toast("Entry deleted");
                        }}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Week */}
          <section className="flex flex-col rounded-[1.75rem] border bg-card p-6">
            <h2 className="text-2xl">Your week</h2>
            <div
              className="mt-6 flex flex-1 items-end gap-2"
              role="img"
              aria-label={
                week.some((w) => w.value !== null)
                  ? `Mood this week: ${week.map((w) => `${w.day} ${w.value === null ? "no check-in" : moods[w.value - 1].label}`).join(", ")}`
                  : "No check-ins yet this week"
              }
            >
              {week.map((w) => (
                <div
                  key={w.date}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-full transition-all"
                    style={{
                      height: w.value === null ? "8px" : `${w.value * 22}px`,
                      background:
                        w.value === null
                          ? "var(--border)"
                          : moods[w.value - 1].color,
                    }}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {w.day}
                  </span>
                </div>
              ))}
            </div>
            {week.every((w) => w.value === null) && (
              <p className="mt-4 text-sm text-muted-foreground">
                Your week builds as you check in — one honest tap a day.
              </p>
            )}
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Check-ins this week" value={stats.checkIns} />
              <Stat label="Minutes calm" value={stats.minutesCalm} />
              <Stat label="Activities done" value={stats.activitiesDone} />
              <Stat label="Day streak" value={streak} />
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
                <span className="rounded-full bg-background px-3 py-1 text-xs font-medium">
                  {c.nextLive}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-display text-2xl">{value}</dd>
    </div>
  );
}
