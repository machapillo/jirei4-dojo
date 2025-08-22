"use client";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useUserStore } from "@/src/store/user";
import { listAnswers, type SavedAnswer } from "@/src/lib/answers";
import { mockQuestions } from "@/src/mock/questions";
import type { UserState } from "@/src/store/user";
import Link from "next/link";

export default function ReviewPage() {
  const uid = useUserStore((s: UserState) => s.uid);
  const [items, setItems] = useState<SavedAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyNeedsReview, setOnlyNeedsReview] = useState(false);
  const [onlyIncorrect, setOnlyIncorrect] = useState(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  async function fetchItems() {
    setLoading(true);
    const res = await listAnswers(uid);
    setItems(res.slice(0, 50));
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
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

  const reviewTargets = useMemo(() => {
    let list = items;
    if (onlyNeedsReview) list = list.filter((a: SavedAnswer) => a.needsReview);
    if (onlyIncorrect) list = list.filter((a: SavedAnswer) => !a.isCorrect);
    if (fromDate) {
      const from = new Date(fromDate).getTime();
      list = list.filter((a: SavedAnswer) => a.answeredAt >= from);
    }
    if (toDate) {
      const to = new Date(toDate).getTime() + 24 * 60 * 60 * 1000 - 1; // その日の終わり
      list = list.filter((a: SavedAnswer) => a.answeredAt <= to);
    }
    return list;
  }, [items, onlyNeedsReview, onlyIncorrect, fromDate, toDate]);

  return (
    <main className="container space-y-6 py-6">
      <h2 className="text-lg font-semibold">復習ノート</h2>
      <p className="text-sm text-neutral-600">要復習・誤答の履歴から再確認しましょう。</p>

      <section className="flex flex-wrap items-end gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyNeedsReview}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOnlyNeedsReview(e.target.checked)}
          />
          要復習のみ
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyIncorrect}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOnlyIncorrect(e.target.checked)}
          />
          不正解のみ
        </label>
        <label className="flex items-center gap-2">
          期間: 自
          <input
            className="bg-white border border-neutral-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand.blue/40"
            type="date"
            value={fromDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFromDate(e.target.value)}
          />
          至
          <input
            className="bg-white border border-neutral-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand.blue/40"
            type="date"
            value={toDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setToDate(e.target.value)}
          />
        </label>
        <button
          className="ml-auto border border-neutral-300 bg-white text-neutral-700 rounded-md px-3 py-1 shadow-sm hover:bg-neutral-50"
          onClick={fetchItems}
          disabled={loading}
        >
          {loading ? "更新中..." : "更新"}
        </button>
      </section>

      {loading ? (
        <p className="text-neutral-500 text-sm">読み込み中...</p>
      ) : reviewTargets.length === 0 ? (
        <p className="text-neutral-500 text-sm">復習対象はまだありません。</p>
      ) : (
        <ul className="space-y-3">
          {reviewTargets.map((a: SavedAnswer, i: number) => {
            const q = mockQuestions.find((q) => q.id === a.questionId);
            return (
              <li key={`${a.questionId}-${i}`} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-xs text-neutral-500 mb-2">
                  {q ? `${q.year}年 第${q.questionNumber}問 / ${q.category}` : a.questionId}
                  {" · "}
                  {new Date(a.answeredAt).toLocaleString()}
                  {" · "}
                  {a.isCorrect ? "正解" : "不正解"}
                  {a.needsReview ? " · 要復習" : ""}
                </div>
                <div className="text-sm text-neutral-700">
                  <span className="text-neutral-500">あなたの解答:</span> {a.userAnswer}
                </div>
                {q && (
                  <div className="mt-2 text-sm text-neutral-700">
                    <span className="text-neutral-500">正解:</span> {q.solution}
                  </div>
                )}
                <div className="mt-3">
                  <Link
                    href={{ pathname: "/practice/category", query: { qid: a.questionId } }}
                    className="inline-block text-sm border border-neutral-300 bg-white hover:bg-neutral-50 rounded-md px-3 py-1 shadow-sm text-neutral-700"
                  >
                    この問題を解き直す
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
