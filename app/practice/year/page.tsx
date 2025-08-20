"use client";
import { useMemo, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { mockQuestions } from "@/src/mock/questions";
import { Notepad } from "@/components/notepad";
import { saveAnswer } from "@/src/lib/answers";
import { useUserStore } from "@/src/store/user";
import type { UserState } from "@/src/store/user";

export default function PracticeYearPage() {
  const [year, setYear] = useState<string>("");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [needsReview, setNeedsReview] = useState(false);
  const markAnswerResult = useUserStore((s: UserState) => s.markAnswerResult);
  const uid = useUserStore((s: UserState) => s.uid);

  const years = useMemo(() => {
    return Array.from(new Set(mockQuestions.map((q) => q.year))).sort((a, b) => b - a);
  }, []);

  const pool = useMemo(() => {
    return year ? mockQuestions.filter((q) => String(q.year) === String(year)) : [];
  }, [year]);

  const question = pool[idx];

  const onCheck = async () => {
    if (!question) return;
    const isCorrect = normalize(answer) === normalize(question.solution);
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
          <h2 className="text-lg font-semibold">年度別演習</h2>
          <p className="text-sm text-neutral-400">年度を選んで、本試験形式で解きましょう。</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-sm"
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
          <Button variant="outline" onClick={onNext} disabled={!pool.length}>
            次の問題
          </Button>
        </div>
      </div>

      {!year ? (
        <p className="text-neutral-400 text-sm">上のセレクトから年度を選択してください。</p>
      ) : !question ? (
        <p className="text-neutral-400 text-sm">この年度の問題が見つかりません。</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-800 p-4">
              <div className="text-xs text-neutral-400 mb-2">
                {question.year}年 第{question.questionNumber}問 / {question.category}（{idx + 1}/{pool.length}）
              </div>
              <p className="text-neutral-100 whitespace-pre-wrap leading-relaxed">{question.content}</p>
            </div>

            <div className="rounded-lg border border-neutral-800 p-4 space-y-3">
              <label className="text-sm text-neutral-300">解答</label>
              <input
                className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
                placeholder="数値のみ等、指示に従って入力"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
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
                {normalize(answer) === normalize(question.solution) ? (
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
