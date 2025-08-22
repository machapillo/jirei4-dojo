"use client";
import { useEffect, useMemo, useState } from "react";
import { useUserStore, type UserState } from "@/src/store/user";
import { listAnswers, type SavedAnswer } from "@/src/lib/answers";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function GamePage() {
  const uid = useUserStore((s: UserState) => s.uid);
  const xp = useUserStore((s: UserState) => s.xp);
  const level = useUserStore((s: UserState) => s.level);
  const currentStreak = useUserStore((s: UserState) => s.currentStreak);
  const achievements = useUserStore((s: UserState) => s.achievements);

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

  const trend7d = useMemo(() => {
    // Build last 7 days including today
    const dayKey = (ms: number) => new Date(new Date(ms).toISOString().slice(0, 10)).getTime();
    const today = dayKey(Date.now());
    const days: number[] = Array.from({ length: 7 }, (_, i) => today - (6 - i) * 24 * 60 * 60 * 1000);
    const bucket = new Map<number, { total: number; correct: number }>();
    for (const d of days) bucket.set(d, { total: 0, correct: 0 });
    answers.forEach((a) => {
      const k = dayKey(a.answeredAt);
      if (!bucket.has(k)) return;
      const b = bucket.get(k)!;
      b.total += 1;
      if (a.isCorrect) b.correct += 1;
    });
    return days.map((d) => {
      const b = bucket.get(d)!;
      const rate = b.total ? Math.round((b.correct / b.total) * 100) : 0;
      const label = new Date(d).toLocaleDateString(undefined, { month: "numeric", day: "numeric" });
      return { day: label, count: b.total, rate };
    });
  }, [answers]);

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

      <section className="border border-neutral-800 rounded p-4">
        <div className="text-neutral-400 text-sm mb-3">7日間のトレンド（回答数/正答率）</div>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <ComposedChart data={trend7d} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="day" stroke="#9ca3af" tickLine={false} axisLine={{ stroke: "#2a2a2a" }} />
              <YAxis yAxisId="left" stroke="#9ca3af" tickLine={false} axisLine={{ stroke: "#2a2a2a" }} allowDecimals={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={{ stroke: "#2a2a2a" }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} formatter={(v: any, n: any) => (n === "rate" ? [`${v}%`, "正答率"] : [v, "回答数"])} />
              <Legend wrapperStyle={{ color: "#9ca3af" }} />
              <Bar yAxisId="left" dataKey="count" name="回答数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="rate" name="正答率" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="border border-neutral-800 rounded p-4">
        <div className="text-neutral-400 text-sm mb-3">実績</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_BADGES.map((b) => {
            const owned = achievements.includes(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-md p-3 border ${owned ? "border-emerald-700 bg-emerald-950/30" : "border-neutral-800 bg-neutral-900"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${owned ? "opacity-100" : "opacity-40"}`}>{b.icon}</div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${owned ? "text-emerald-300" : "text-neutral-300"}`}>{b.title}</div>
                    <div className="text-xs text-neutral-400">{b.desc}</div>
                  </div>
                  <div className={`text-[10px] px-2 py-0.5 rounded ${owned ? "bg-emerald-800/40 text-emerald-300 border border-emerald-700" : "bg-neutral-800 text-neutral-400 border border-neutral-700"}`}>
                    {owned ? "獲得済" : "未獲得"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

type Badge = { id: string; title: string; desc: string; icon: string };
const ALL_BADGES: Badge[] = [
  { id: "streak_3", title: "3日連続達成", desc: "3日連続で正解を記録しました", icon: "🔥" },
  { id: "streak_7", title: "7日連続達成", desc: "1週間連続で正解を記録しました", icon: "🏆" },
  { id: "xp_100", title: "累計100XP", desc: "累計XPが100に到達", icon: "✨" },
  { id: "xp_500", title: "累計500XP", desc: "継続は力なり。累計XPが500に到達", icon: "💎" },
];
