import { useCallback, useEffect, useState } from "react";

export interface RetentionState {
  onboardingDone: boolean;
  completeOnboarding: (faculty: string) => void;
  faculty: string | null;
  streak: number;
  contributionCount: number;
  incrementContributions: () => void;
  hasNewContent: boolean;
  dismissNewContent: () => void;
}

export function computeStreak(
  now: Date,
  lastVisit: string | null,
  storedStreak: number,
): { streak: number; visited: boolean } {
  const today = now.toDateString();
  if (lastVisit === today) {
    return { streak: storedStreak, visited: false };
  }
  const yesterday = new Date(now.getTime() - 86_400_000).toDateString();
  const streak = lastVisit === yesterday ? storedStreak + 1 : 1;
  return { streak, visited: true };
}

export function useRetention(): RetentionState {
  const [onboardingDone, setOnboardingDone] = useState<boolean>(
    () => localStorage.getItem("uc_onboarding") === "1",
  );
  const [faculty, setFacultyState] = useState<string | null>(
    () => localStorage.getItem("uc_faculty"),
  );
  const [streak, setStreak] = useState<number>(0);
  const [contributionCount, setContributionCount] = useState<number>(
    () => parseInt(localStorage.getItem("uc_contributions") ?? "0", 10),
  );
  const [hasNewContent, setHasNewContent] = useState<boolean>(false);

  useEffect(() => {
    const now = new Date();
    const today = now.toDateString();
    const lastVisit = localStorage.getItem("uc_last_visit");
    const storedStreak = parseInt(localStorage.getItem("uc_streak") ?? "0", 10);
    const { streak: nextStreak, visited } = computeStreak(now, lastVisit, storedStreak);

    setStreak(nextStreak);
    if (visited) {
      localStorage.setItem("uc_streak", String(nextStreak));
      localStorage.setItem("uc_last_visit", today);
      const lastContentView = localStorage.getItem("uc_content_viewed");
      if (lastContentView !== today) {
        setHasNewContent(true);
      }
    }
  }, []);

  const completeOnboarding = useCallback((selectedFaculty: string): void => {
    localStorage.setItem("uc_onboarding", "1");
    localStorage.setItem("uc_faculty", selectedFaculty);
    setOnboardingDone(true);
    setFacultyState(selectedFaculty);
  }, []);

  const incrementContributions = useCallback((): void => {
    setContributionCount((prev) => {
      const next = prev + 1;
      localStorage.setItem("uc_contributions", String(next));
      return next;
    });
  }, []);

  const dismissNewContent = useCallback((): void => {
    localStorage.setItem("uc_content_viewed", new Date().toDateString());
    setHasNewContent(false);
  }, []);

  return {
    onboardingDone,
    completeOnboarding,
    faculty,
    streak,
    contributionCount,
    incrementContributions,
    hasNewContent,
    dismissNewContent,
  };
}
