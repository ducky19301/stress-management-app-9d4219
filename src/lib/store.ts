/**
 * Local-first storage for Softground.
 *
 * Until the server milestones in PLAN.md land (Netlify Identity, Netlify
 * Database, AI Gateway), everything personal lives in this browser's
 * localStorage: the profile, mood check-ins, journal entries, completed
 * activities, circle posts and hugs, and the night-mode preference.
 *
 * Nothing here leaves the device. All reads happen inside `useEffect` or
 * event handlers — never during render — so server rendering never sees
 * `window` or `localStorage` (see AGENTS.md, "Browser Storage").
 */

import { useCallback, useEffect, useState } from "react";
import {
  currentUser,
  lifeAreas,
  type ChatMessage,
  type LifeArea,
} from "./fixtures";

export type UserProfile = {
  name: string;
  handle: string;
  focus: LifeArea[];
  timezone: string;
};

export const DEFAULT_PROFILE: UserProfile = {
  name: currentUser.name,
  handle: currentUser.handle,
  focus: [...currentUser.focus],
  timezone: "America/Los_Angeles",
};

export type Checkin = { date: string; value: number };
export type JournalEntry = {
  id: string;
  date: string;
  prompt: string;
  text: string;
};
export type Completion = { activityId: string; date: string; minutes: number };

const KEYS = {
  profile: "softground.profile.v1",
  checkins: "softground.checkins.v1",
  journal: "softground.journal.v1",
  completions: "softground.completions.v1",
  circlePosts: "softground.circle-posts.v1",
  hugs: "softground.hugs.v1",
  theme: "softground.theme.v1",
} as const;

/** Every localStorage key this app owns, for export and delete-my-data. */
export const ALL_KEYS = Object.values(KEYS);

export const PROFILE_CHANGED_EVENT = "softground:profile";

/* ───────────── low-level helpers ───────────── */

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode): keep going in-memory.
  }
}

function remove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** `YYYY-MM-DD` in the given time zone (defaults to the profile's). */
export function dateKey(d: Date, timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function daysAgo(n: number, timeZone?: string): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dateKey(d, timeZone);
}

/* ───────────── profile ───────────── */

export function isLifeArea(value: unknown): value is LifeArea {
  return typeof value === "string" && lifeAreas.some((a) => a.id === value);
}

export function parseProfile(value: unknown): UserProfile {
  if (typeof value !== "object" || value === null) return DEFAULT_PROFILE;
  const v = value as Partial<UserProfile>;
  const name =
    typeof v.name === "string" && v.name.trim()
      ? v.name.trim().slice(0, 40)
      : DEFAULT_PROFILE.name;
  const handle =
    typeof v.handle === "string" && v.handle.trim()
      ? v.handle
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "")
          .slice(0, 30) || DEFAULT_PROFILE.handle
      : DEFAULT_PROFILE.handle;
  const focus = Array.isArray(v.focus) ? v.focus.filter(isLifeArea) : [];
  return {
    name,
    handle,
    focus: focus.length > 0 ? focus : [...DEFAULT_PROFILE.focus],
    timezone:
      typeof v.timezone === "string" && v.timezone
        ? v.timezone
        : DEFAULT_PROFILE.timezone,
  };
}

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  return parseProfile(read<unknown>(KEYS.profile, null));
}

export function saveProfile(profile: UserProfile) {
  write(KEYS.profile, profile);
  window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT));
}

/** Profile state: defaults on the server, stored profile after mount. */
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setProfile(loadProfile());
    const onChange = () => setProfile(loadProfile());
    window.addEventListener(PROFILE_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(PROFILE_CHANGED_EVENT, onChange);
  }, []);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    saveProfile({ ...loadProfile(), ...patch });
  }, []);

  return { profile, updateProfile };
}

/** Handle shown in circles, derived from a display name. */
export function handleForName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) return DEFAULT_PROFILE.handle;
  if (slug === "natalie") return "radiant-seeker";
  return slug;
}

/* ───────────── mood check-ins ───────────── */

export function getCheckins(): Checkin[] {
  if (typeof window === "undefined") return [];
  const list = read<Checkin[]>(KEYS.checkins, []);
  return Array.isArray(list)
    ? list.filter(
        (c) => c && typeof c.date === "string" && typeof c.value === "number",
      )
    : [];
}

export function saveCheckin(value: number, timeZone?: string): Checkin[] {
  const today = dateKey(new Date(), timeZone);
  const next = [
    ...getCheckins().filter((c) => c.date !== today),
    { date: today, value },
  ];
  write(KEYS.checkins, next);
  return next;
}

export function checkinForToday(timeZone?: string): number | null {
  const today = dateKey(new Date(), timeZone);
  return getCheckins().find((c) => c.date === today)?.value ?? null;
}

/** Consecutive days checked in, ending today (or yesterday if not yet today). */
export function computeStreak(checkins: Checkin[], timeZone?: string): number {
  const dates = new Set(checkins.map((c) => c.date));
  const today = dateKey(new Date(), timeZone);
  let cursor = dates.has(today) ? 0 : 1;
  let streak = 0;
  while (dates.has(daysAgo(cursor, timeZone))) {
    streak += 1;
    cursor += 1;
  }
  return streak;
}

export type WeekDay = { day: string; date: string; value: number | null };

/** Last 7 calendar days, oldest first, with any stored mood attached. */
export function buildWeekStrip(
  checkins: Checkin[],
  timeZone?: string,
): WeekDay[] {
  const byDate = new Map(checkins.map((c) => [c.date, c.value]));
  const days: WeekDay[] = [];
  for (let n = 6; n >= 0; n--) {
    const date = daysAgo(n, timeZone);
    const label = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
    }).format(new Date(`${date}T12:00:00`));
    days.push({
      day: n === 0 ? "Today" : label,
      date,
      value: byDate.get(date) ?? null,
    });
  }
  return days;
}

/* ───────────── journal ───────────── */

export function getJournal(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  const list = read<JournalEntry[]>(KEYS.journal, []);
  if (!Array.isArray(list)) return [];
  return list
    .filter((e) => e && typeof e.text === "string")
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function addJournalEntry(
  prompt: string,
  text: string,
  timeZone?: string,
): JournalEntry[] {
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    date: dateKey(new Date(), timeZone),
    prompt,
    text: text.trim(),
  };
  const next = [entry, ...getJournal()];
  write(KEYS.journal, next);
  return next;
}

export function deleteJournalEntry(id: string): JournalEntry[] {
  const next = getJournal().filter((e) => e.id !== id);
  write(KEYS.journal, next);
  return next;
}

/* ───────────── activity completions ───────────── */

export function getCompletions(): Completion[] {
  if (typeof window === "undefined") return [];
  const list = read<Completion[]>(KEYS.completions, []);
  return Array.isArray(list)
    ? list.filter((c) => c && typeof c.activityId === "string")
    : [];
}

export function addCompletion(
  activityId: string,
  minutes: number,
  timeZone?: string,
): Completion[] {
  const next = [
    ...getCompletions(),
    { activityId, date: dateKey(new Date(), timeZone), minutes },
  ];
  write(KEYS.completions, next);
  return next;
}

export function completionsFor(activityId: string): Completion[] {
  return getCompletions().filter((c) => c.activityId === activityId);
}

/** Check-ins, calm minutes and activities done in the last 7 days. */
export function weekStats(
  checkins: Checkin[],
  completions: Completion[],
  timeZone?: string,
) {
  const since = daysAgo(6, timeZone);
  const weekCheckins = checkins.filter((c) => c.date >= since).length;
  const weekCompletions = completions.filter((c) => c.date >= since);
  return {
    checkIns: weekCheckins,
    minutesCalm: weekCompletions.reduce((sum, c) => sum + c.minutes, 0),
    activitiesDone: weekCompletions.length,
  };
}

/* ───────────── circle posts & hugs (local only) ───────────── */

export function getCirclePosts(circleId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const all = read<Record<string, ChatMessage[]>>(KEYS.circlePosts, {});
  const list = all?.[circleId];
  return Array.isArray(list) ? list : [];
}

export function addCirclePost(
  circleId: string,
  message: ChatMessage,
): ChatMessage[] {
  const all = read<Record<string, ChatMessage[]>>(KEYS.circlePosts, {});
  const next = [...(all[circleId] ?? []), message];
  write(KEYS.circlePosts, { ...all, [circleId]: next });
  return next;
}

export function getHugged(): string[] {
  if (typeof window === "undefined") return [];
  const list = read<string[]>(KEYS.hugs, []);
  return Array.isArray(list) ? list : [];
}

export function toggleHugged(messageId: string): string[] {
  const current = getHugged();
  const next = current.includes(messageId)
    ? current.filter((id) => id !== messageId)
    : [...current, messageId];
  write(KEYS.hugs, next);
  return next;
}

/* ───────────── night mode ───────────── */

export function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = read<string | null>(KEYS.theme, null);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(loadTheme() === "dark");
  }, []);

  useEffect(() => {
    applyTheme(dark ? "dark" : "light");
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d;
      write(KEYS.theme, next ? "dark" : "light");
      return next;
    });
  }, []);

  return { dark, toggleTheme: toggle };
}

/* ───────────── export & delete ───────────── */

export function exportAllData() {
  return {
    exportedAt: new Date().toISOString(),
    app: "Softground",
    profile: loadProfile(),
    checkins: getCheckins(),
    journal: getJournal(),
    completions: getCompletions(),
    circlePosts: read<Record<string, ChatMessage[]>>(KEYS.circlePosts, {}),
    hugged: getHugged(),
  };
}

export function deleteAllData() {
  ALL_KEYS.forEach(remove);
  window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT));
}
