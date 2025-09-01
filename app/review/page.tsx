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
import { Button } from "@/components/ui/button";

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
    <main className="container space-y-4 sm:space-y-6 py-4 sm:py-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">復習ノート</h2>
          <p className="text-xs sm:text-sm text-neutral-600">要復習・誤答の履歴から再確認しましょう。</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchItems} disabled={loading} className="hidden sm:inline-flex">
          {loading ? "更新中..." : "更新"}
        </Button>
      </header>

      {/* Sticky filter bar (mobile first) */}
      <section className="sticky top-0 z-20 -mx-4 px-4 pb-3 pt-2 glass border-b border-neutral-200/60 pb-safe">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {/* Segmented toggles */}
          <div className="inline-flex rounded-full border border-neutral-300 bg-white p-0.5">
            <button
              className={`px-3 py-1.5 rounded-full transition pressable ${onlyNeedsReview ? "bg-brand-blue text-white" : "text-neutral-700 hover:bg-neutral-100"}`}
              onClick={() => setOnlyNeedsReview((v) => !v)}
              aria-pressed={onlyNeedsReview}
            >要復習</button>
            <button
              className={`px-3 py-1.5 rounded-full transition pressable ${onlyIncorrect ? "bg-brand-blue text-white" : "text-neutral-700 hover:bg-neutral-100"}`}
              onClick={() => setOnlyIncorrect((v) => !v)}
              aria-pressed={onlyIncorrect}
            >不正解</button>
          </div>

          {/* Date chips */}
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="from-date">開始日</label>
            <input
              id="from-date"
              className="h-9 bg-white border border-neutral-300 rounded-full px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 text-sm"
              type="date"
              value={fromDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFromDate(e.target.value)}
            />
            <span className="text-neutral-400">-</span>
            <label className="sr-only" htmlFor="to-date">終了日</label>
            <input
              id="to-date"
              className="h-9 bg-white border border-neutral-300 rounded-full px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 text-sm"
              type="date"
              value={toDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setToDate(e.target.value)}
            />
          </div>

          {/* Sort select */}
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sort" className="text-neutral-500 hidden sm:inline">並び替え</label>
            <select
              id="sort"
              className="h-9 bg-white border border-neutral-300 rounded-full px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 text-sm"
              value={sortKey}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortKey(e.target.value)}
            >
              <option value="date_desc">新しい順</option>
              <option value="date_asc">古い順</option>
              <option value="incorrect_first">不正解を先に</option>
              <option value="needs_review_first">要復習を先に</option>
            </select>
          </div>
        </div>
        {/* Mobile refresh */}
        <div className="mt-2 sm:hidden">
          <Button size="sm" variant="outline" onClick={fetchItems} disabled={loading} className="w-full">
            {loading ? "更新中..." : "更新"}
          </Button>
        </div>
      </section>

      {loading ? (
        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="h-3 w-40 skeleton rounded mb-2"></div>
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
                  className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm pressable"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] sm:text-xs text-neutral-500 mb-1 truncate">
                        {q ? `${q.year}年 第${q.questionNumber}問 / ${q.category}` : a.questionId}
                        {" · "}
                        {new Date(a.answeredAt).toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-800">
                        <span className="text-neutral-500">あなたの解答:</span> {a.userAnswer}
                      </div>
                      {q && (
                        <div className="mt-1 text-sm text-neutral-800">
                          <span className="text-neutral-500">正解:</span> {q.solution}
                        </div>
                      )}
                      <div className="mt-2 text-xs">
                        <span className={a.isCorrect ? "text-emerald-600" : "text-rose-600"}>{a.isCorrect ? "正解" : "不正解"}</span>
                        {a.needsReview && <span className="ml-2 inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-amber-700">要復習</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        href={{ pathname: "/practice/category", query: { qid: a.questionId } }}
                        className="inline-flex items-center justify-center text-xs h-9 px-3 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 shadow-sm"
                      >
                        解き直す
                      </Link>
                      <button
                        className={`inline-flex items-center justify-center text-xs h-9 px-3 rounded-full shadow-sm border ${a.needsReview ? "border-amber-400 bg-amber-50 text-amber-700" : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"}`}
                        onClick={async () => {
                          const ok = await updateNeedsReview(uid, { id: a.id, questionId: a.questionId, answeredAt: a.answeredAt }, !a.needsReview);
                          if (ok) {
                            setItems((prev) => prev.map((p) => (p.questionId === a.questionId && p.answeredAt === a.answeredAt ? { ...p, needsReview: !a.needsReview } : p)));
                          }
                        }}
                        aria-pressed={a.needsReview}
                        aria-label={a.needsReview ? "要復習を解除" : "要復習に追加"}
                      >
                        {a.needsReview ? "復習中" : "要復習"}
                      </button>
                    </div>
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

