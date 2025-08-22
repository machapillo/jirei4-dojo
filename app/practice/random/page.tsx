"use client";
import { useEffect, useMemo, useState } from "react";
import { getQuestions, type Question as ExtQuestion } from "@/src/lib/questionSource";
import { Button } from "@/components/ui/button";
import { Notepad } from "@/components/notepad";
import { useUserStore } from "@/src/store/user";
import { saveAnswer } from "@/src/lib/answers";
import type { UserState } from "@/src/store/user";

export default function RandomPracticePage() {
  const [seed, setSeed] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [needsReview, setNeedsReview] = useState(false);
  const [all, setAll] = useState<ExtQuestion[]>([]);
  const markAnswerResult = useUserStore((s: UserState) => s.markAnswerResult);
  const uid = useUserStore((s: UserState) => s.uid);

  useEffect(() => {
    getQuestions().then(setAll);
  }, []);

  const question = useMemo(() => {
    if (!all.length) return undefined;
    const idx = Math.floor(((seed || Date.now()) % 997) % all.length);
    return all[idx];
  }, [seed, all]);

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
    } catch (e) {
      // no-op for MVP
    }
  };

  const onNext = () => {
    setAnswer("");
    setNeedsReview(false);
    setChecked(false);
    setSeed((s: number) => s + 1);
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">ランダム演習</h2>
          <p className="text-sm text-neutral-400">全範囲からランダムに1問出題します。</p>
        </div>
        <Button variant="outline" onClick={onNext}>別の問題</Button>
      </div>

      {!question ? (
        <p className="text-neutral-400 text-sm">問題を読み込み中...</p>
      ) : (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-800 p-4">
            <div className="text-xs text-neutral-400 mb-2">{question.year}年 第{question.questionNumber}問 / {question.category}{question.difficulty ? ` / 難易度:${labelDiff(question.difficulty)}` : ""}</div>
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
