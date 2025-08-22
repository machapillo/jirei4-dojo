"use client";
import { useEffect, useMemo, useState } from "react";
import { getQuestions, type Question as ExtQuestion } from "@/src/lib/questionSource";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/src/store/user";
import { saveAnswer } from "@/src/lib/answers";
import type { UserState } from "@/src/store/user";
import { PracticeQA } from "@/components/practice/qa";
import { PracticeHeader } from "@/components/practice/header";

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
      <PracticeHeader
        title="ランダム演習"
        subtitle="全範囲からランダムに1問出題します。"
        right={<Button variant="outline" onClick={onNext}>別の問題</Button>}
      />

      {!question ? (
        <p className="text-neutral-400 text-sm">問題を読み込み中...</p>
      ) : (
        <PracticeQA
          question={question}
          answer={answer}
          setAnswer={setAnswer}
          checked={checked}
          needsReview={needsReview}
          setNeedsReview={setNeedsReview}
          onCheck={onCheck}
        />
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
