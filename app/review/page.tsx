"use client";
import { Suspense, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useUserStore } from "@/src/store/user";
import { listAnswers, updateNeedsReview, type SavedAnswer } from "@/src/lib/answers";
import { getQuestions, type Question } from "@/src/lib/questionSource";
import type { UserState } from "@/src/store/user";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Route } from "next";

function ReviewPageInner() {
  const uid = useUserStore((s: UserState) => s.uid);
  const [items, setItems] = useState<SavedAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyNeedsReview, setOnlyNeedsReview] = useState(false);
  const [onlyIncorrect, setOnlyIncorrect] = useState(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("date_desc");
  const [questions, setQuestions] = useState<Question[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function fetchItems() {
    setLoading(true);
    const res = await listAnswers(uid);
    setItems(res.slice(0, 50));
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      // initialize from URL
      const qOnlyRev = searchParams.get("rev") === "1";
      const qOnlyIncor = searchParams.get("inc") === "1";
      const qFrom = searchParams.get("from") || "";
      const qTo = searchParams.get("to") || "";
      const qSort = searchParams.get("sort") || "date_desc";
      setOnlyNeedsReview(qOnlyRev);
      setOnlyIncorrect(qOnlyIncor);
      setFromDate(qFrom);
      setToDate(qTo);
      setSortKey(qSort);

      const [res, qs] = await Promise.all([listAnswers(uid), getQuestions()]);
      if (!mounted) return;
      // 直近50件程度を表示
      setItems(res.slice(0, 50));
      setQuestions(qs);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [uid]);

  // Reflect filter/sort state to URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (onlyNeedsReview) sp.set("rev", "1");
    if (onlyIncorrect) sp.set("inc", "1");
    if (fromDate) sp.set("from", fromDate);
    if (toDate) sp.set("to", toDate);
    if (sortKey && sortKey !== "date_desc") sp.set("sort", sortKey);
    const query = sp.toString();
    const href = (query ? `/review?${query}` : "/review") as Route;
    router.replace(href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyNeedsReview, onlyIncorrect, fromDate, toDate, sortKey]);

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
    // sorting
    const sorted = [...list];
    switch (sortKey) {
      case "date_asc":
        sorted.sort((a, b) => a.answeredAt - b.answeredAt);
        break;
      case "incorrect_first":
        sorted.sort((a, b) => Number(a.isCorrect) - Number(b.isCorrect)); // false before true
        break;
      case "needs_review_first":
        sorted.sort((a, b) => Number(b.needsReview) - Number(a.needsReview));
        break;
      default:
        sorted.sort((a, b) => b.answeredAt - a.answeredAt);
    }
    return sorted;
  }, [items, onlyNeedsReview, onlyIncorrect, fromDate, toDate, sortKey]);

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
            className="bg-white border border-neutral-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            type="date"
            value={fromDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFromDate(e.target.value)}
          />
          至
          <input
            className="bg-white border border-neutral-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            type="date"
            value={toDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setToDate(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 ml-auto">
          並び替え
          <select
            className="bg-white border border-neutral-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            value={sortKey}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortKey(e.target.value)}
          >
            <option value="date_desc">新しい順</option>
            <option value="date_asc">古い順</option>
            <option value="incorrect_first">不正解を先に</option>
            <option value="needs_review_first">要復習を先に</option>
          </select>
        </label>
        <button
          className="border border-neutral-300 bg-white text-neutral-700 rounded-md px-3 py-1 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          onClick={fetchItems}
          disabled={loading}
        >
          {loading ? "更新中..." : "更新"}
        </button>
      </section>

      {loading ? (
        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="h-3 w-48 skeleton rounded mb-3"></div>
              <div className="h-3 w-full skeleton rounded mb-2"></div>
              <div className="h-3 w-2/3 skeleton rounded"></div>
            </li>
          ))}
        </ul>
      ) : reviewTargets.length === 0 ? (
        <p className="text-neutral-500 text-sm">復習対象はまだありません。</p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {reviewTargets.map((a: SavedAnswer, i: number) => {
              const q = questions.find((qq) => qq.id === a.questionId);
              const key = `${a.questionId}-${a.answeredAt}-${a.id ?? i}`;
              return (
                <motion.li
                  key={key}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm"
                >
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
                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href={{ pathname: "/practice/category", query: { qid: a.questionId } }}
                      className="inline-block text-sm border border-neutral-300 bg-white hover:bg-neutral-50 rounded-md px-3 py-1 shadow-sm text-neutral-700"
                    >
                      この問題を解き直す
                    </Link>
                    <button
                      className={`inline-flex items-center text-sm rounded-md px-3 py-1 shadow-sm border ${a.needsReview ? "border-amber-400 bg-amber-50 text-amber-700" : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"} focus:outline-none focus:ring-2 focus:ring-brand-blue/40`}
                      onClick={async () => {
                        const ok = await updateNeedsReview(uid, { id: a.id, questionId: a.questionId, answeredAt: a.answeredAt }, !a.needsReview);
                        if (ok) {
                          setItems((prev) => prev.map((p) => (p.questionId === a.questionId && p.answeredAt === a.answeredAt ? { ...p, needsReview: !a.needsReview } : p)));
                        }
                      }}
                      aria-pressed={a.needsReview}
                      aria-label={a.needsReview ? "要復習を解除" : "要復習に追加"}
                    >
                      {a.needsReview ? "要復習中" : "要復習に追加"}
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<main className="container py-6"><p className="text-sm text-neutral-500">読み込み中...</p></main>}>
      <ReviewPageInner />
    </Suspense>
  );
}

