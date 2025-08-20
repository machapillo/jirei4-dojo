"use client";
import { create } from "zustand";

export type UserState = {
  uid?: string;
  email?: string;
  xp: number;
  level: number;
  currentStreak: number;
  lastAnsweredDate?: string; // YYYY-MM-DD
  achievements: string[];
  setUser: (u: Partial<UserState>) => void;
  addXp: (amount: number) => void;
  addAchievement: (badgeId: string) => void;
  markAnswerResult: (isCorrect: boolean) => void;
  reset: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  uid: undefined,
  email: undefined,
  xp: 0,
  level: 1,
  currentStreak: 0,
  lastAnsweredDate: undefined,
  achievements: [],
  setUser: (u) => set((s) => ({ ...s, ...u })),
  addXp: (amount) =>
    set((s) => {
      const newXp = s.xp + amount;
      const levelUpThreshold = 100; // MVP: 100 XP/level
      const gainedLevels = Math.floor(newXp / levelUpThreshold) - Math.floor(s.xp / levelUpThreshold);
      return {
        ...s,
        xp: newXp,
        level: s.level + Math.max(0, gainedLevels),
      };
    }),
  addAchievement: (badgeId) =>
    set((s) =>
      s.achievements.includes(badgeId)
        ? s
        : { ...s, achievements: [...s.achievements, badgeId] }
    ),
  markAnswerResult: (isCorrect) =>
    set((s) => {
      if (!isCorrect) return s;
      const today = new Date().toISOString().slice(0, 10);
      const alreadyCountedToday = s.lastAnsweredDate === today;
      const xpGain = 10; // MVP: each correct = +10 XP
      const nextXp = s.xp + xpGain;
      const levelUpThreshold = 100;
      const gainedLevels = Math.floor(nextXp / levelUpThreshold) - Math.floor(s.xp / levelUpThreshold);
      return {
        ...s,
        xp: nextXp,
        level: s.level + Math.max(0, gainedLevels),
        currentStreak: alreadyCountedToday ? s.currentStreak : s.currentStreak + 1,
        lastAnsweredDate: today,
      };
    }),
  reset: () => ({ uid: undefined, email: undefined, xp: 0, level: 1, currentStreak: 0, lastAnsweredDate: undefined, achievements: [] }),
}));
