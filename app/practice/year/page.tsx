"use client";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { getQuestions, type Question as ExtQuestion } from "@/src/lib/questionSource";
import { listAnswers, saveAnswer } from "@/src/lib/answers";
import { useUserStore } from "@/src/store/user";
import type { UserState } from "@/src/store/user";
import { PracticeQA } from "@/components/practice/qa";
import { PracticeHeader } from "@/components/practice/header";

export default function PracticeYearPage() {
  const [year, setYear] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [allQuestions, setAllQuestions] = useState<ExtQuestion[]>([]);
  const [reviewSet, setReviewSet] = useState<Set<string>>(new Set());
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [needsReview, setNeedsReview] = useState(false);
  const [remainingSec, setRemainingSec] = useState(80 * 60); // 80分
  const [isTimeUp, setIsTimeUp] = useState(false);
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

  const years = useMemo(() => {
    return Array.from(new Set(allQuestions.map((q) => q.year))).sort((a, b) => b - a);
  }, [allQuestions]);

  const pool = useMemo(() => {
    let arr = year ? allQuestions.filter((q) => String(q.year) === String(year)) : [];
    if (difficulty) arr = arr.filter((q) => (q.difficulty || "") === difficulty);
    if (reviewOnly) arr = arr.filter((q) => reviewSet.has(q.id));
    return arr;
  }, [year, difficulty, reviewOnly, allQuestions, reviewSet]);

  const question = pool[idx];

  // タイマー（年度選択で自動開始）
  useEffect(() => {
    if (!year || pool.length === 0) return;
    setRemainingSec(80 * 60);
    setIsTimeUp(false);
  }, [year, pool.length]);

  useEffect(() => {
    if (!year || pool.length === 0 || isTimeUp) return;
    const t = setInterval(() => {
      setRemainingSec((s) => {
        if (s <= 1) {
          clearInterval(t);
          setIsTimeUp(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [year, pool.length, isTimeUp]);

  const resetTimer = () => {
    setRemainingSec(80 * 60);
    setIsTimeUp(false);
  };

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
    <main className="container space-y-6 py-6">
      <PracticeHeader
        title="年度別演習"
        subtitle="年度・難易度・復習モードを選んで、本試験形式で解きましょう。"
        right={(
          <>
            <select
              className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand.blue/40"
              value={year}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setYear(e.target.value);
                setIdx(0);
                setAnswer("");
                setNeedsReview(false);
                setChecked(false);
              }}
            >
              <option value="">年度を選択</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <select
              className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand.blue/40"
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
            <label className="flex items-center gap-2 text-sm text-neutral-700 px-2">
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
            <Button variant="outline" onClick={onNext} disabled={!pool.length || isTimeUp}>
              次の問題
            </Button>
            <Button variant="outline" onClick={resetTimer} disabled={!pool.length}>
              タイマーリセット
            </Button>
          </>
        )}
        below={year ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm text-sm text-neutral-700 flex items-center gap-3">
            <span className={isTimeUp ? "text-red-600" : "text-neutral-700"}>残り時間: {formatMMSS(remainingSec)}</span>
            {isTimeUp && <span className="text-red-600">時間切れです</span>}
          </div>
        ) : null}
      />

      {!year ? (
        <p className="text-neutral-600 text-sm">上のセレクトから年度を選択してください。</p>
      ) : !question ? (
        <p className="text-neutral-600 text-sm">この年度の問題が見つかりません。</p>
      ) : (
        <PracticeQA
          question={question}
          answer={answer}
          setAnswer={setAnswer}
          checked={checked}
          needsReview={needsReview}
          setNeedsReview={setNeedsReview}
          onCheck={onCheck}
          isTimeUp={isTimeUp}
        />
      )}
    </main>
  );
}

function normalize(v: string) {
  return (v || "").toString().replace(/[\,\s]/g, "").trim();
}

function formatMMSS(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
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
