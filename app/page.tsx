"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserStore } from "@/src/store/user";
import type { UserState } from "@/src/store/user";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { listAnswers, type SavedAnswer } from "@/src/lib/answers";
import { mockQuestions } from "@/src/mock/questions";

export default function Page() {
  const data = useMemo(
    () => [
      { day: "Mon", correct: 5 },
      { day: "Tue", correct: 3 },
      { day: "Wed", correct: 6 },
      { day: "Thu", correct: 4 },
      { day: "Fri", correct: 7 },
      { day: "Sat", correct: 2 },
      { day: "Sun", correct: 5 },
    ],
    []
  );
  const xp = useUserStore((s: UserState) => s.xp);
  const level = useUserStore((s: UserState) => s.level);
  const streak = useUserStore((s: UserState) => s.currentStreak);
  const uid = useUserStore((s: UserState) => s.uid);

  const [answers, setAnswers] = useState<SavedAnswer[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingStats(true);
      const res = await listAnswers(uid);
      if (!mounted) return;
      setAnswers(res);
      setLoadingStats(false);
    })();
    return () => {
      mounted = false;
    };
  }, [uid]);

  const overall = useMemo(() => {
    const total = answers.length;
    const correct = answers.filter((a) => a.isCorrect).length;
    const rate = total ? Math.round((correct / total) * 100) : 0;
    return { total, correct, rate };
  }, [answers]);

  const byCategory = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    for (const a of answers) {
      const q = mockQuestions.find((q) => q.id === a.questionId);
      const cat = q?.category || "その他";
      const prev = map.get(cat) || { total: 0, correct: 0 };
      prev.total += 1;
      prev.correct += a.isCorrect ? 1 : 0;
      map.set(cat, prev);
    }
    const rows = Array.from(map.entries()).map(([cat, v]) => ({
      cat,
      total: v.total,
      correct: v.correct,
      rate: v.total ? Math.round((v.correct / v.total) * 100) : 0,
    }));
    rows.sort((a, b) => (b.total - a.total) || (b.rate - a.rate));
    return rows.slice(0, 5);
  }, [answers]);

  return (
    <main className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">ダッシュボード</h2>
          <p className="text-sm text-neutral-400">学習の進捗を確認しましょう</p>
        </div>
        <Link href="/practice/random">
          <Button className="animate-pop">今日の目標を開始</Button>
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-neutral-800 p-4">
          <h3 className="mb-2 text-sm text-neutral-300">週間 正解数</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #333" }} />
                <Line type="monotone" dataKey="correct" stroke="#2E7FE8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-800 p-4">
          <h3 className="mb-2 text-sm text-neutral-300">ステータス</h3>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>レベル: {level}</li>
            <li>XP: {xp}</li>
            <li>学習ストリーク: {streak}日</li>
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-neutral-800 p-4">
          <h3 className="mb-2 text-sm text-neutral-300">全体正答率</h3>
          {loadingStats ? (
            <p className="text-neutral-500 text-sm">集計中...</p>
          ) : (
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>解答数: {overall.total}</li>
              <li>正解数: {overall.correct}</li>
              <li>正答率: {overall.rate}%</li>
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-neutral-800 p-4">
          <h3 className="mb-2 text-sm text-neutral-300">分野別 正答率（直近）</h3>
          {loadingStats ? (
            <p className="text-neutral-500 text-sm">集計中...</p>
          ) : byCategory.length === 0 ? (
            <p className="text-neutral-500 text-sm">まだデータがありません</p>
          ) : (
            <ul className="text-sm text-neutral-300 space-y-1">
              {byCategory.map((r) => (
                <li key={r.cat} className="flex items-center justify-between">
                  <span>{r.cat}</span>
                  <span>{r.correct}/{r.total}（{r.rate}%）</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
