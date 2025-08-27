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
      <div className="space-y-5">
        <div className={`rounded-xl border p-6 shadow-sm transition-colors ${checked ? (isCorrect ? "border-emerald-300 bg-emerald-50 animate-pop" : "border-rose-300 bg-rose-50 animate-pop") : "border-neutral-200 bg-white"}`}>
          <div className="text-sm sm:text-base text-neutral-600 mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {question.year}年 第{question.questionNumber}問 / {question.category}
              {question.difficulty ? ` / 難易度:${labelDiff(question.difficulty)}` : ""}
            </span>
            {metaRight ? <span className="text-neutral-500">{metaRight}</span> : null}
          </div>
          <p className="text-neutral-900 whitespace-pre-wrap leading-relaxed text-base sm:text-lg">{question.content}</p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4 shadow-sm">
          <label className="text-base text-neutral-700">解答{question.unit ? `（${question.unit}）` : ""}</label>
          {question.type === "single" && question.choices?.length ? (
            <select
              className="w-full rounded-full bg-white border border-neutral-300 px-4 py-3 text-base text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
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
              className="w-full rounded-full bg-white border border-neutral-300 px-4 py-3 text-base text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="数値/式を入力可（例: (1800000+200000)/900）"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTimeUp}
            />
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-1 sticky bottom-0 glass border-t -mx-5 px-5 py-3 pb-safe shadow-[0_-6px_20px_-12px_rgba(0,0,0,0.25)] sm:static sm:bg-transparent sm:backdrop-blur-0 sm:border-0 sm:shadow-none sm:mx-0 sm:px-0 sm:py-0">
            <label className="flex items-center gap-3 text-base text-neutral-700">
              <input
                type="checkbox"
                checked={needsReview}
                onChange={(e) => setNeedsReview(e.target.checked)}
                disabled={isTimeUp}
              />
              要復習に追加
            </label>
            <div className="flex gap-2">
              <Button onClick={onCheck} disabled={isTimeUp} className="pressable rounded-full px-6 py-3 text-base sm:text-sm shadow-md">
                採点する
              </Button>
            </div>
          </div>
        </div>

        {checked && (
          <div className={`rounded-lg border p-4 shadow-sm transition-all ${isCorrect ? "border-emerald-300 bg-emerald-50" : "border-rose-300 bg-rose-50"}`}>
            {isCorrect ? (
              <p className="text-emerald-700">正解！ +10XP</p>
            ) : (
              <p className="text-rose-700">不正解</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Notepad />
        {checked && (
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-base sm:text-lg mb-3">解説</h3>
            <p className="text-base sm:text-lg text-neutral-700 whitespace-pre-wrap leading-relaxed">{question.explanation}</p>
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
  // Try number first; if NaN, try safe math expression evaluation.
  let a = Number(normalize(ans));
  if (isNaN(a)) {
    const ev = evalMathExpression(ans);
    if (ev !== null && isFinite(ev)) a = ev;
  }
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

// Safely evaluate basic arithmetic expressions with digits, + - * / ( ) and decimal point.
// Returns null if the expression is invalid.
function evalMathExpression(input: string): number | null {
  try {
    const expr = (input || "")
      .replace(/[，、]/g, ",")
      .replace(/[\s,]/g, "") // remove spaces and commas
      .replace(/[Ａ-Ｚａ-ｚ０-９＋－＊／（）．]/g, (c) => toHalfWidth(c)); // normalize full-width

    // Allow only digits, operators, parentheses, and dot
    if (!/^[0-9+\-*/().]+$/.test(expr)) return null;
    // Basic sanity: parentheses balance
    let bal = 0;
    for (const ch of expr) {
      if (ch === "(") bal++;
      if (ch === ")") bal--;
      if (bal < 0) return null;
    }
    if (bal !== 0) return null;
    // Disallow dangerous sequences (just in case)
    if (/\.\.|\+\+|--|\*\*|\/[+\-*/)]|[+\-*/(]\/\)/.test(expr)) {
      // simplistic guards against malformed tokens
      // We still rely on JS engine to throw if malformed.
    }
    // Evaluate in a very limited manner
    // Using Function after strict whitelist above
    // eslint-disable-next-line no-new-func
    const fn = new Function(`"use strict"; return (${expr});`);
    const val = fn();
    if (typeof val !== "number" || !isFinite(val)) return null;
    return val;
  } catch {
    return null;
  }
}

// Convert common full-width characters to half-width
function toHalfWidth(s: string): string {
  const code = s.charCodeAt(0);
  // Full-width zero~nine and A~Z, a~z
  if (code >= 0xff10 && code <= 0xff19) return String.fromCharCode(code - 0xfee0);
  if (code >= 0xff21 && code <= 0xff3a) return String.fromCharCode(code - 0xfee0);
  if (code >= 0xff41 && code <= 0xff5a) return String.fromCharCode(code - 0xfee0);
  // Full-width operators and punctuation
  const map: Record<string, string> = {
    "＋": "+",
    "－": "-",
    "＊": "*",
    "／": "/",
    "（": "(",
    "）": ")",
    "．": ".",
  };
  return map[s] ?? s;
}

function labelDiff(d?: string) {
  if (d === "easy") return "易";
  if (d === "medium") return "普";
  if (d === "hard") return "難";
  return "";
}
