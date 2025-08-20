"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserStore } from "@/src/store/user";
import type { UserState } from "@/src/store/user";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
    </main>
  );
}
