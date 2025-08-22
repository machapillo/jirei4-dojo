"use client";
import { Notepad } from "@/components/notepad";
import type { Question as ExtQuestion } from "@/src/lib/questionSource";
import { Button } from "@/components/ui/button";
import { useMemo, KeyboardEvent } from "react";

export type PracticeQAProps = {
  question: ExtQuestion;
  answer: string;
  setAnswer: (v: string) => void;
  checked: boolean;
  needsReview: boolean;
  setNeedsReview: (v: boolean) => void;
  onCheck: () => void;
  isTimeUp?: boolean;
  metaRight?: string;
};

export function PracticeQA({ question, answer, setAnswer, checked, needsReview, setNeedsReview, onCheck, isTimeUp, metaRight }: PracticeQAProps) {
  const isCorrect = useMemo(() => checkCorrect(answer, question), [answer, question]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (isTimeUp) return;
    // Enter to check
    if (e.key === "Enter") {
      e.preventDefault();
      if (!checked) onCheck();
      return;
    }
    // Number keys for single-choice
    if (question.type === "single" && question.choices?.length) {
      const idx = parseInt(e.key, 10);
      if (!isNaN(idx) && idx >= 1 && idx <= Math.min(9, question.choices.length)) {
        setAnswer(question.choices[idx - 1]);
      }
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className={`rounded-lg border p-4 transition-colors ${checked ? (isCorrect ? "border-emerald-700 bg-emerald-950/20" : "border-red-700 bg-red-950/10") : "border-neutral-800"}`}>
          <div className="text-xs sm:text-[13px] text-neutral-400 mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {question.year}年 第{question.questionNumber}問 / {question.category}
              {question.difficulty ? ` / 難易度:${labelDiff(question.difficulty)}` : ""}
            </span>
            {metaRight ? <span className="text-neutral-500">{metaRight}</span> : null}
          </div>
          <p className="text-neutral-100 whitespace-pre-wrap leading-relaxed text-[15px] sm:text-base">{question.content}</p>
        </div>

        <div className="rounded-lg border border-neutral-800 p-4 space-y-3">
          <label className="text-sm text-neutral-300">解答{question.unit ? `（${question.unit}）` : ""}</label>
          {question.type === "single" && question.choices?.length ? (
            <select
              className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTimeUp}
            >
              <option value="">選択してください</option>
              {question.choices.map((c, i) => (
                <option key={i} value={c}>{`${i + 1}. ${c}`}</option>
              ))}
            </select>
          ) : (
            <input
              className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
              placeholder="数値のみ等、指示に従って入力"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTimeUp}
            />
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={needsReview}
                onChange={(e) => setNeedsReview(e.target.checked)}
                disabled={isTimeUp}
              />
              要復習に追加
            </label>
            <div className="flex gap-2">
              <Button onClick={onCheck} disabled={isTimeUp}>採点する</Button>
            </div>
          </div>
        </div>

        {checked && (
          <div className={`rounded-lg border p-4 transition-all ${isCorrect ? "border-emerald-700 bg-emerald-950/20" : "border-red-700 bg-red-950/10"}`}>
            {isCorrect ? (
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
            <p className="text-sm sm:text-[15px] text-neutral-300 whitespace-pre-wrap leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
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
