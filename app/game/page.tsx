"use client";
import { useEffect, useMemo, useState } from "react";
import { useUserStore, type UserState } from "@/src/store/user";
import { listAnswers, type SavedAnswer } from "@/src/lib/answers";

export default function GamePage() {
  const uid = useUserStore((s: UserState) => s.uid);
  const xp = useUserStore((s: UserState) => s.xp);
  const level = useUserStore((s: UserState) => s.level);
  const currentStreak = useUserStore((s: UserState) => s.currentStreak);

  const [answers, setAnswers] = useState<SavedAnswer[]>([]);

  useEffect(() => {
    (async () => {
      const res = await listAnswers(uid);
      setAnswers(res);
    })();
  }, [uid]);

  const stats = useMemo(() => {
    const total = answers.length;
    const correct = answers.filter((a) => a.isCorrect).length;
    const rate = total ? Math.round((correct / total) * 100) : 0;
    return { total, correct, rate };
  }, [answers]);

  const recent = useMemo(() => answers.slice(0, 10), [answers]);

  const levelProgress = useMemo(() => {
    const threshold = 100; // 同ストアの想定に合わせる
    const curLevelXp = xp % threshold;
    return Math.min(100, Math.round((curLevelXp / threshold) * 100));
  }, [xp]);

  return (
    <main className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">ゲーム</h2>
        <p className="text-sm text-neutral-400">XP・レベル・ストリークや成績を確認できます。</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="border border-neutral-800 rounded p-4">
          <div className="text-neutral-400 text-sm">レベル</div>
          <div className="text-3xl font-bold">{level}</div>
          <div className="mt-3">
            <div className="h-2 bg-neutral-800 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="text-xs text-neutral-500 mt-1">次のレベルまで {100 - (xp % 100)} XP</div>
          </div>
        </div>

        <div className="border border-neutral-800 rounded p-4">
          <div className="text-neutral-400 text-sm">総XP</div>
          <div className="text-3xl font-bold">{xp}</div>
        </div>

        <div className="border border-neutral-800 rounded p-4">
          <div className="text-neutral-400 text-sm">現在のストリーク</div>
          <div className="text-3xl font-bold">{currentStreak} 日</div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="border border-neutral-800 rounded p-4">
          <div className="text-neutral-400 text-sm mb-2">成績</div>
          <div className="text-neutral-200 text-sm">解答数: {stats.total}</div>
          <div className="text-neutral-200 text-sm">正解数: {stats.correct}</div>
          <div className="text-neutral-200 text-sm">正答率: {stats.rate}%</div>
        </div>

        <div className="md:col-span-2 border border-neutral-800 rounded p-4">
          <div className="text-neutral-400 text-sm mb-3">直近の解答</div>
          {!recent.length ? (
            <div className="text-neutral-500 text-sm">まだ履歴がありません。</div>
          ) : (
            <ul className="space-y-2 text-sm">
              {recent.map((a, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-neutral-300">{a.questionId}</span>
                  <span className={a.isCorrect ? "text-green-400" : "text-red-400"}>
                    {a.isCorrect ? "正解" : "不正解"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
