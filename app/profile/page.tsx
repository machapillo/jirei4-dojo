"use client";
import { useUserStore } from "@/src/store/user";

export default function ProfilePage() {
  const { xp, level, currentStreak, achievements, email } = useUserStore();
  return (
    <main className="container space-y-6 py-6">
      <h2 className="text-lg font-semibold">プロフィール</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="font-medium mb-2">ステータス</h3>
          <ul className="text-sm text-neutral-700 space-y-1">
            <li>メール: {email ?? "未ログイン"}</li>
            <li>レベル: {level}</li>
            <li>XP: {xp}</li>
            <li>学習ストリーク: {currentStreak}日</li>
          </ul>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="font-medium mb-2">バッジ</h3>
          {achievements.length === 0 ? (
            <p className="text-sm text-neutral-600">まだバッジがありません。</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {achievements.map((b) => (
                <span key={b} className="text-xs rounded-full border border-neutral-300 bg-white text-neutral-700 px-2 py-1 shadow-sm">{b}</span>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
