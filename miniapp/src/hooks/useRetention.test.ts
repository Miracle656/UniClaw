import { describe, expect, it } from "vitest";
import { computeStreak } from "./useRetention";

const makeDate = (iso: string): Date => new Date(iso);

describe("computeStreak", () => {
  it("keeps streak unchanged when last visit was today", () => {
    const now = makeDate("2026-04-19T10:00:00Z");
    const today = now.toDateString();
    expect(computeStreak(now, today, 5)).toEqual({ streak: 5, visited: false });
  });

  it("increments streak when last visit was yesterday", () => {
    const now = makeDate("2026-04-19T10:00:00Z");
    const yesterday = new Date(now.getTime() - 86_400_000).toDateString();
    expect(computeStreak(now, yesterday, 5)).toEqual({ streak: 6, visited: true });
  });

  it("resets streak to 1 when last visit was more than a day ago", () => {
    const now = makeDate("2026-04-19T10:00:00Z");
    const twoDaysAgo = new Date(now.getTime() - 2 * 86_400_000).toDateString();
    expect(computeStreak(now, twoDaysAgo, 5)).toEqual({ streak: 1, visited: true });
  });

  it("starts streak at 1 on first visit", () => {
    const now = makeDate("2026-04-19T10:00:00Z");
    expect(computeStreak(now, null, 0)).toEqual({ streak: 1, visited: true });
  });
});
