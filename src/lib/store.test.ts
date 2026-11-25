import { describe, expect, it } from "vitest";
import {
  buildWeekStrip,
  computeStreak,
  dateKey,
  handleForName,
  parseProfile,
  weekStats,
  type Checkin,
  type Completion,
} from "./store";

function checkinDaysAgo(n: number, value = 3): Checkin {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return { date: dateKey(d), value };
}

describe("dateKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(dateKey(new Date("2026-11-24T10:00:00"), "UTC")).toBe("2026-11-24");
  });
});

describe("computeStreak", () => {
  it("counts consecutive days ending today", () => {
    expect(
      computeStreak([checkinDaysAgo(0), checkinDaysAgo(1), checkinDaysAgo(2)]),
    ).toBe(3);
  });

  it("counts from yesterday when today is not checked in yet", () => {
    expect(computeStreak([checkinDaysAgo(1), checkinDaysAgo(2)])).toBe(2);
  });

  it("stops at a gap", () => {
    expect(computeStreak([checkinDaysAgo(0), checkinDaysAgo(3)])).toBe(1);
  });

  it("is zero with no check-ins", () => {
    expect(computeStreak([])).toBe(0);
  });
});

describe("buildWeekStrip", () => {
  it("returns seven days, oldest first, with stored moods attached", () => {
    const checkins = [checkinDaysAgo(0, 5), checkinDaysAgo(3, 2)];
    const week = buildWeekStrip(checkins);
    expect(week).toHaveLength(7);
    expect(week[6].day).toBe("Today");
    expect(week[6].value).toBe(5);
    expect(week[3].value).toBe(2);
    expect(week[0].value).toBeNull();
    expect(week[1].value).toBeNull();
  });
});

describe("weekStats", () => {
  it("sums only the last seven days", () => {
    const checkins = [checkinDaysAgo(0), checkinDaysAgo(1), checkinDaysAgo(10)];
    const completions: Completion[] = [
      { activityId: "box-breathing", date: dateKey(new Date()), minutes: 4 },
      { activityId: "wonder-walk", date: dateKey(new Date()), minutes: 20 },
    ];
    expect(weekStats(checkins, completions)).toEqual({
      checkIns: 2,
      minutesCalm: 24,
      activitiesDone: 2,
    });
  });
});

describe("parseProfile", () => {
  it("falls back to the default profile for junk", () => {
    const p = parseProfile(null);
    expect(p.name).toBe("Natalie");
    expect(p.handle).toBe("radiant-seeker");
    expect(p.focus).toEqual(["personal", "growth"]);
  });

  it("keeps valid fields and drops unknown focus areas", () => {
    const p = parseProfile({
      name: "  Alex ",
      handle: "Alex_99",
      focus: ["work", "nope"],
      timezone: "UTC",
    });
    expect(p.name).toBe("Alex");
    expect(p.handle).toBe("alex99");
    expect(p.focus).toEqual(["work"]);
    expect(p.timezone).toBe("UTC");
  });
});

describe("handleForName", () => {
  it("gives Natalie her Radiant Seeker handle", () => {
    expect(handleForName("Natalie")).toBe("radiant-seeker");
  });

  it("slugifies other names", () => {
    expect(handleForName("Mary Jane")).toBe("mary-jane");
    expect(handleForName("")).toBe("radiant-seeker");
  });
});
