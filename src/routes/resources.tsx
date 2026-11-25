import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MapPin, Phone, Sparkles, Video } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  books,
  crisisLines,
  lifeAreas,
  nearbyTherapists,
  prompts,
  therapyOptions,
  type LifeArea,
} from "@/lib/fixtures";
import { img } from "@/lib/img";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [{ title: "Resources · Softground" }] }),
  component: Resources,
});

function Resources() {
  const [area, setArea] = useState<LifeArea | "all">("all");
  const [zip, setZip] = useState("");
  const [searched, setSearched] = useState(false);
  const shown = books.filter((b) => area === "all" || b.area === area);

  return (
    <AppShell>
      <div className="mx-auto max-w-content px-4 py-8 sm:px-8 md:py-12">
        <PageHeader eyebrow="Resources" title="Help that actually helps">
          Hand-picked books, real therapy you can afford, and free support
          lines. No fluff, no paywalls.
        </PageHeader>

        <Tabs defaultValue="therapy">
          <TabsList className="rounded-full">
            <TabsTrigger value="therapy" className="rounded-full">
              Therapy
            </TabsTrigger>
            <TabsTrigger value="books" className="rounded-full">
              Books
            </TabsTrigger>
            <TabsTrigger value="crisis" className="rounded-full">
              Crisis lines
            </TabsTrigger>
          </TabsList>

          <TabsContent value="therapy" className="mt-6 flex flex-col gap-6">
            <Link
              to="/companion"
              className="group relative grid overflow-hidden rounded-[1.75rem] bg-primary text-primary-foreground md:grid-cols-[1fr_16rem]"
            >
              <div className="p-7">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  <Sparkles className="size-4" /> Always free · always open
                </span>
                <h2 className="mt-3 text-3xl">AI companion therapy</h2>
                <p className="mt-2 max-w-lg text-primary-foreground/80">
                  CBT, DBT, ACT, couples-focused and compassion-based support,
                  matched to what you’re going through. Available the moment you
                  need it.
                </p>
                <span className="mt-5 inline-flex items-center gap-1 font-medium">
                  Start talking{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <img
                src={img("companion", 500)}
                alt=""
                className="hidden h-full w-full object-cover opacity-90 md:block"
              />
            </Link>

            <section className="rounded-[1.75rem] border bg-card p-6">
              <h2 className="text-2xl">Find a real therapist near you</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sliding-scale, insurance-friendly and free options first.
              </p>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearched(true);
                }}
              >
                <div className="relative flex-1">
                  <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="ZIP code or city"
                    aria-label="ZIP code or city"
                    className="h-11 rounded-full pl-9"
                  />
                </div>
                <Button type="submit" className="h-11 rounded-full px-6">
                  Search
                </Button>
              </form>
              {searched && (
                <>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Sample listings, shown until a real therapist directory is
                    connected.
                  </p>
                  <ul className="mt-3 grid gap-3 md:grid-cols-3">
                    {nearbyTherapists.map((t) => (
                      <li
                        key={t.name}
                        className="flex flex-col gap-2 rounded-2xl bg-muted p-4"
                      >
                        <div className="font-medium">
                          {t.name},{" "}
                          <span className="text-muted-foreground">
                            {t.creds}
                          </span>
                        </div>
                        <div className="text-sm">{t.focus}</div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>{t.distance}</span>·<span>{t.fee}</span>
                          {t.virtual && (
                            <span className="flex items-center gap-1">
                              · <Video className="size-3" /> Video
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-1 rounded-full"
                          onClick={() =>
                            toast(
                              "This is a sample listing — real consult requests need a connected directory.",
                            )
                          }
                        >
                          Request a free consult
                        </Button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-2xl">
                Free & low-cost options most people don’t know about
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {therapyOptions.map((o) => (
                  <div key={o.title} className="rounded-2xl border bg-card p-5">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {o.tag}
                    </span>
                    <h3 className="mt-3 text-xl">{o.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {o.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-secondary p-6">
              <h2 className="text-2xl">Inner growth, daily</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A few minutes of reflection counts as care, too. One prompt, a
                few honest lines.
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {prompts.slice(4, 7).map((p) => (
                  <li
                    key={p}
                    className="rounded-2xl bg-card p-4 font-display text-lg italic"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                to="/activities"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Try a reflection activity <ArrowRight className="size-4" />
              </Link>
            </section>
          </TabsContent>

          <TabsContent value="books" className="mt-6">
            <div className="mb-6 flex flex-wrap gap-2">
              <FilterChip on={area === "all"} onClick={() => setArea("all")}>
                All
              </FilterChip>
              {lifeAreas
                .filter((a) => books.some((b) => b.area === a.id))
                .map((a) => (
                  <FilterChip
                    key={a.id}
                    on={area === a.id}
                    onClick={() => setArea(a.id)}
                  >
                    {a.emoji} {a.label}
                  </FilterChip>
                ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {shown.map((b) => (
                <article key={b.title} className="flex flex-col gap-3">
                  <div
                    className="relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-r-2xl rounded-l-md p-5 text-white shadow-md transition-transform hover:-rotate-1"
                    style={{
                      background: `linear-gradient(160deg, oklch(0.62 0.09 ${b.hue}), oklch(0.38 0.08 ${b.hue + 25}))`,
                    }}
                  >
                    <span className="absolute inset-y-0 left-0 w-2 bg-black/15" />
                    <span className="absolute top-5 right-5 size-12 rounded-full bg-white/20" />
                    <h3 className="text-2xl leading-tight">{b.title}</h3>
                    <p className="mt-1 text-sm text-white/80">{b.author}</p>
                  </div>
                  <p className="text-sm">{b.why}</p>
                  <p className="text-xs font-medium text-primary">
                    📚 {b.free}
                  </p>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="crisis" className="mt-6">
            <div className="rounded-[1.75rem] bg-plum/10 p-6">
              <h2 className="text-2xl">
                If you’re in danger or thinking about ending your life
              </h2>
              <p className="mt-1 text-muted-foreground">
                Reach a trained human right now. Free, confidential, 24/7.
              </p>
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {crisisLines.map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.href}
                      className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors hover:bg-background"
                    >
                      <Phone className="size-5 text-plum" />
                      <span>
                        <span className="block font-medium">{l.name}</span>
                        <span className="block text-sm text-muted-foreground">
                          {l.how} · {l.region}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function FilterChip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors",
        on
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}
