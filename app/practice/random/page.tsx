"use client";
import { useMemo, useState } from "react";
import { mockQuestions } from "@/src/mock/questions";
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
  const markAnswerResult = useUserStore((s: UserState) => s.markAnswerResult);
  const uid = useUserStore((s: UserState) => s.uid);

  const question = useMemo(() => {
    const idx = Math.floor(((seed || Date.now()) % 997) % mockQuestions.length);
    return mockQuestions[idx];
  }, [seed]);

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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-800 p-4">
            <div className="text-xs text-neutral-400 mb-2">{question.year}年 第{question.questionNumber}問 / {question.category}</div>
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
    </main>
  );
}

function normalize(v: string) {
  return (v || "").toString().replace(/[,\s]/g, "").trim();
}
