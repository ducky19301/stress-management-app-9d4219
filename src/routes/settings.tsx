import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, Moon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { lifeAreas, type LifeArea } from "@/lib/fixtures";
import {
  deleteAllData,
  exportAllData,
  handleForName,
  useProfile,
  useTheme,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Softground" }] }),
  component: Settings,
});

const TIMEZONES = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "Europe/London",
  "UTC",
];

function Settings() {
  const { profile, updateProfile } = useProfile();
  const { dark, toggleTheme } = useTheme();
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Keep the form in sync once the stored profile loads after mount.
  useEffect(() => {
    setName(profile.name);
    setHandle(profile.handle);
  }, [profile.name, profile.handle]);

  const toggleFocus = (id: LifeArea) => {
    const next = profile.focus.includes(id)
      ? profile.focus.filter((x) => x !== id)
      : [...profile.focus, id];
    if (next.length === 0) {
      toast("Keep at least one focus area — it shapes your suggestions.");
      return;
    }
    updateProfile({ focus: next });
  };

  const saveName = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast("Give yourself a name — even a nickname works.");
      return;
    }
    updateProfile({
      name: trimmed,
      handle: handle.trim() || handleForName(trimmed),
    });
    toast("Saved 🌿");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(exportAllData(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "softground-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("Your data downloaded as softground-data.json");
  };

  const wipeData = () => {
    deleteAllData();
    setConfirmDelete(false);
    setName("Natalie");
    setHandle("radiant-seeker");
    toast("Everything stored on this device is gone. Fresh start 🌿");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-reading px-4 py-8 sm:px-8 md:py-12">
        <PageHeader eyebrow="Settings" title="Your space, your way">
          Your name, what you’re working on, and your data — all stored on this
          device only.
        </PageHeader>

        <section className="flex flex-col gap-5 rounded-[1.75rem] border bg-card p-6">
          <h2 className="text-2xl">About you</h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-name">What should we call you?</Label>
            <Input
              id="settings-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-handle">
              Circle handle (anonymous — never your real name)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">@</span>
              <Input
                id="settings-handle"
                value={handle}
                onChange={(e) =>
                  setHandle(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-timezone">Time zone</Label>
            <Select
              value={profile.timezone}
              onValueChange={(tz) => updateProfile({ timezone: tz })}
            >
              <SelectTrigger id="settings-timezone" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="h-11 self-start rounded-full px-6"
            onClick={saveName}
          >
            Save name & handle
          </Button>

          <div className="border-t pt-5">
            <Label className="text-sm font-semibold">
              What’s been weighing on you?
            </Label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {lifeAreas.map((a) => {
                const on = profile.focus.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleFocus(a.id)}
                    className={cn(
                      "relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
                      on
                        ? "border-primary bg-secondary shadow-sm"
                        : "bg-card hover:border-primary/40",
                    )}
                  >
                    <span className="text-2xl" aria-hidden>
                      {a.emoji}
                    </span>
                    <span className="text-sm font-medium">{a.label}</span>
                    {on && (
                      <Check className="absolute top-3 right-3 size-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Your focus areas shape Today’s suggestions, circle matches and
              companion replies.
            </p>
          </div>
        </section>

        <section className="mt-6 flex items-center justify-between gap-4 rounded-[1.75rem] border bg-card p-6">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <Moon className="size-5 text-primary" /> Night mode
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A darker, softer palette for 3am use.
            </p>
          </div>
          <Switch
            checked={dark}
            onCheckedChange={toggleTheme}
            aria-label="Night mode"
          />
        </section>

        <section className="mt-6 flex flex-col gap-4 rounded-[1.75rem] border bg-card p-6">
          <h2 className="text-2xl">Your data</h2>
          <p className="text-sm text-muted-foreground">
            Check-ins, journal entries, completed activities and circle posts
            live only in this browser. Export a copy any time, or delete it all
            in one tap.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={exportData}
            >
              <Download className="size-4" /> Export my data (JSON)
            </Button>
            {confirmDelete ? (
              <>
                <Button
                  variant="destructive"
                  className="rounded-full"
                  onClick={wipeData}
                >
                  Yes, delete everything
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setConfirmDelete(false)}
                >
                  Keep it
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="rounded-full text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="size-4" /> Delete my data
              </Button>
            )}
          </div>
          {confirmDelete && (
            <p className="text-sm text-destructive">
              This erases your profile, check-ins, journal, completions and
              circle posts from this device. There’s no undo.
            </p>
          )}
        </section>

        <p className="mt-6 text-sm text-muted-foreground">
          Real accounts, syncing across devices and live circles arrive with
          Netlify Identity and Netlify Database (see PLAN.md). Until then,
          everything stays here, on this device.
        </p>
      </div>
    </AppShell>
  );
}
