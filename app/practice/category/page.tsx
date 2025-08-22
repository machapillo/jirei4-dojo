"use client";
import { Suspense, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getQuestions, type Question as ExtQuestion } from "@/src/lib/questionSource";
import { Notepad } from "@/components/notepad";
import { listAnswers, saveAnswer } from "@/src/lib/answers";
import { useUserStore } from "@/src/store/user";
import type { UserState } from "@/src/store/user";

export default function PracticeCategoryPage() {
  return (
    <Suspense fallback={<main className="space-y-6"><p className="text-neutral-400 text-sm">読み込み中...</p></main>}>
      <PracticeCategoryContent />
    </Suspense>
  );
}

function PracticeCategoryContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [allQuestions, setAllQuestions] = useState<ExtQuestion[]>([]);
  const [reviewSet, setReviewSet] = useState<Set<string>>(new Set());
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [needsReview, setNeedsReview] = useState(false);
  const markAnswerResult = useUserStore((s: UserState) => s.markAnswerResult);
  const uid = useUserStore((s: UserState) => s.uid);

  useEffect(() => {
    getQuestions().then(setAllQuestions);
  }, []);

  useEffect(() => {
    (async () => {
      const ans = await listAnswers(uid);
      setReviewSet(new Set(ans.filter((a) => a.needsReview).map((a) => a.questionId)));
    })();
  }, [uid]);

  const categories = useMemo(() => {
    return Array.from(new Set(allQuestions.map((q) => q.category)));
  }, [allQuestions]);

  const pool = useMemo(() => {
    let arr = category ? allQuestions.filter((q) => q.category === category) : [];
    if (difficulty) arr = arr.filter((q) => (q.difficulty || "") === difficulty);
    if (reviewOnly) arr = arr.filter((q) => reviewSet.has(q.id));
    return arr;
  }, [category, difficulty, reviewOnly, allQuestions, reviewSet]);

  const question = pool[idx];

  // Deep-linking from review page: ?qid=<questionId>
  useEffect(() => {
    const qid = searchParams.get("qid");
    if (!qid || !allQuestions.length) return;
    const target = allQuestions.find((q) => q.id === qid);
    if (!target) return;
    // Ensure filters include the target
    let changed = false;
    if (category !== target.category) {
      setCategory(target.category);
      changed = true;
    }
    if (difficulty) {
      setDifficulty("");
      changed = true;
    }
    if (reviewOnly) {
      setReviewOnly(false);
      changed = true;
    }
    // If filters just changed, wait for memo recalculation in next tick
    if (changed) {
      // clear states for fresh start
      setAnswer("");
      setNeedsReview(false);
      setChecked(false);
      return;
    }
    // Compute current pool and jump to the target index
    const curPool = allQuestions
      .filter((q) => q.category === category)
      .filter((q) => (difficulty ? (q.difficulty || "") === difficulty : true))
      .filter((q) => (reviewOnly ? reviewSet.has(q.id) : true));
    const i = curPool.findIndex((q) => q.id === qid);
    if (i >= 0) {
      setIdx(i);
      setAnswer("");
      setNeedsReview(false);
      setChecked(false);
    }
  }, [searchParams, allQuestions, category, difficulty, reviewOnly, reviewSet]);

  const onCheck = async () => {
    if (!question) return;
    const isCorrect = checkCorrect(answer, question);
    setChecked(true);
    markAnswerResult(isCorrect);
    try {
      await saveAnswer(uid, {
        questionId: question.id,
        userAnswer: answer,
        isCorrect,
        needsReview,
      });
    } catch {
      // noop
    }
  };

  const onNext = () => {
    if (!pool.length) return;
    setIdx((i) => (i + 1) % pool.length);
    setAnswer("");
    setNeedsReview(false);
    setChecked(false);
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">分野別演習</h2>
          <p className="text-sm text-neutral-400">分野・難易度・復習モードを選んで演習しましょう。</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-sm"
            value={category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setCategory(e.target.value);
              setIdx(0);
              setAnswer("");
              setNeedsReview(false);
              setChecked(false);
            }}
          >
            <option value="">分野を選択</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-sm"
            value={difficulty}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setDifficulty(e.target.value);
              setIdx(0);
              setAnswer("");
              setNeedsReview(false);
              setChecked(false);
            }}
          >
            <option value="">難易度: 全て</option>
            <option value="easy">易</option>
            <option value="medium">普</option>
            <option value="hard">難</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-neutral-300 px-2">
            <input
              type="checkbox"
              checked={reviewOnly}
              onChange={(e) => {
                setReviewOnly(e.target.checked);
                setIdx(0);
              }}
            />
            復習モード（要復習のみ）
          </label>
          <Button variant="outline" onClick={onNext} disabled={!pool.length}>
            次の問題
          </Button>
        </div>
      </div>

      {!category ? (
        <p className="text-neutral-400 text-sm">上のセレクトから分野を選択してください。</p>
      ) : !question ? (
        <p className="text-neutral-400 text-sm">この分野の問題が見つかりません。</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-800 p-4">
              <div className="text-xs text-neutral-400 mb-2">
                {question.year}年 第{question.questionNumber}問 / {question.category}{question.difficulty ? ` / 難易度:${labelDiff(question.difficulty)}` : ""}（{idx + 1}/{pool.length}）
              </div>
              <p className="text-neutral-100 whitespace-pre-wrap leading-relaxed">{question.content}</p>
            </div>

            <div className="rounded-lg border border-neutral-800 p-4 space-y-3">
              <label className="text-sm text-neutral-300">解答{question.unit ? `（${question.unit}）` : ""}</label>
              {question.type === "single" && question.choices?.length ? (
                <select
                  className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                >
                  <option value="">選択してください</option>
                  {question.choices.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
                  placeholder="数値のみ等、指示に従って入力"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              )}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-neutral-300">
                  <input
                    type="checkbox"
                    checked={needsReview}
                    onChange={(e) => setNeedsReview(e.target.checked)}
                  />
                  要復習に追加
                </label>
                <Button onClick={onCheck}>採点する</Button>
              </div>
            </div>

            {checked && (
              <div className="rounded-lg border border-neutral-800 p-4">
                {checkCorrect(answer, question) ? (
                  <p className="text-green-400">正解！ +10XP</p>
                ) : (
                  <p className="text-red-400">不正解</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Notepad />
            {checked && (
              <div className="rounded-lg border border-neutral-800 p-4">
                <h3 className="font-medium mb-2">解説</h3>
                <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function normalize(v: string) {
  return (v || "").toString().replace(/[\,\s]/g, "").trim();
}

function checkCorrect(ans: string, q: ExtQuestion) {
  if (q.type === "single") {
    return normalize(ans) === normalize(q.solution);
  }
  const a = Number(normalize(ans));
  const s = Number(normalize(q.solution));
  if (!isNaN(a) && !isNaN(s)) {
    let ax = a;
    if (q.rounding === "round") ax = Math.round(ax);
    if (q.rounding === "ceil") ax = Math.ceil(ax);
    if (q.rounding === "floor") ax = Math.floor(ax);
    return Number(ax) === s;
  }
  return normalize(ans) === normalize(q.solution);
}

function labelDiff(d?: string) {
  if (d === "easy") return "易";
  if (d === "medium") return "普";
  if (d === "hard") return "難";
  return "";
}
