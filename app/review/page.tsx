"use client";
import { useEffect, useMemo, useState } from "react";
import { useUserStore } from "@/src/store/user";
import { listAnswers, type SavedAnswer } from "@/src/lib/answers";
import { mockQuestions } from "@/src/mock/questions";
import type { UserState } from "@/src/store/user";

export default function ReviewPage() {
  const uid = useUserStore((s: UserState) => s.uid);
  const [items, setItems] = useState<SavedAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await listAnswers(uid);
      if (!mounted) return;
      // 直近50件程度を表示
      setItems(res.slice(0, 50));
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [uid]);

  const reviewTargets = useMemo(
    () => items.filter((a: SavedAnswer) => a.needsReview || !a.isCorrect),
    [items]
  );

  return (
    <main className="space-y-6">
      <h2 className="text-lg font-semibold">復習ノート</h2>
      <p className="text-sm text-neutral-400">要復習・誤答の履歴から再確認しましょう。</p>

      {loading ? (
        <p className="text-neutral-400 text-sm">読み込み中...</p>
      ) : reviewTargets.length === 0 ? (
        <p className="text-neutral-400 text-sm">復習対象はまだありません。</p>
      ) : (
        <ul className="space-y-3">
          {reviewTargets.map((a: SavedAnswer, i: number) => {
            const q = mockQuestions.find((q) => q.id === a.questionId);
            return (
              <li key={`${a.questionId}-${i}`} className="rounded-lg border border-neutral-800 p-4">
                <div className="text-xs text-neutral-400 mb-2">
                  {q ? `${q.year}年 第${q.questionNumber}問 / ${q.category}` : a.questionId}
                  {" · "}
                  {new Date(a.answeredAt).toLocaleString()}
                  {" · "}
                  {a.isCorrect ? "正解" : "不正解"}
                  {a.needsReview ? " · 要復習" : ""}
                </div>
                <div className="text-sm text-neutral-200">
                  <span className="text-neutral-400">あなたの解答:</span> {a.userAnswer}
                </div>
                {q && (
                  <div className="mt-2 text-sm text-neutral-300">
                    <span className="text-neutral-400">正解:</span> {q.solution}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
