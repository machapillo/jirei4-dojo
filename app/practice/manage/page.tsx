"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getQuestions, saveCustomQuestions, clearCustomQuestions, type Question } from "@/src/lib/questionSource";

export default function PracticeManagePage() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [mergedCount, setMergedCount] = useState(0);
  const [customCount, setCustomCount] = useState(0);

  useEffect(() => {
    (async () => {
      const all = await getQuestions();
      setMergedCount(all.length);
      const raw = typeof window !== "undefined" ? localStorage.getItem("customQuestions") : null;
      if (raw) {
        try {
          const arr = JSON.parse(raw) as Question[];
          setCustomCount(arr.length);
        } catch {
          setCustomCount(0);
        }
      } else {
        setCustomCount(0);
      }
    })();
  }, [okMsg]);

  const onImport = () => {
    setError(null);
    setOkMsg(null);
    try {
      const arr = JSON.parse(text) as Question[];
      // basic validate
      const valid = arr.filter(
        (q) => q && q.id && typeof q.year === "number" && typeof q.questionNumber === "number" && q.category && q.content && q.solution && q.explanation
      );
      saveCustomQuestions(valid);
      setOkMsg(`インポートしました (${valid.length} 件)`);
    } catch (e: any) {
      setError(`JSONの解析に失敗しました: ${e?.message || e}`);
    }
  };

  const onClear = () => {
    clearCustomQuestions();
    setOkMsg("カスタム問題を削除しました");
  };

  const onExport = () => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("customQuestions") : null;
    const blob = new Blob([raw || "[]"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `custom-questions.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPickFile = async (file: File) => {
    const txt = await file.text();
    setText(txt);
  };

  return (
    <main className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">問題管理（インポート/エクスポート）</h2>
        <p className="text-sm text-neutral-400">JSON形式の問題データをインポートできます。既存IDは上書きされます。</p>
      </div>

      <div className="rounded-lg border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center gap-3 text-sm text-neutral-300">
          <span>現在の問題数（統合）: {mergedCount}</span>
          <span>カスタム問題数: {customCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-300">JSONファイル選択</label>
          <input type="file" accept="application/json" onChange={(e) => e.target.files && e.target.files[0] && onPickFile(e.target.files[0])} />
          <Button variant="outline" onClick={onExport}>カスタムをエクスポート</Button>
          <Button variant="outline" onClick={onClear}>カスタムを全削除</Button>
        </div>
        <textarea
          className="w-full h-56 rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm font-mono"
          placeholder='[ { "id": "y2024-q1", "year": 2024, "questionNumber": 1, "category": "原価計算", "content": "...", "solution": "123", "explanation": "...", "difficulty":"medium", "type":"input", "unit":"円", "rounding":"round" } ]'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Button onClick={onImport}>インポート</Button>
        </div>
        {okMsg && <div className="text-green-400 text-sm">{okMsg}</div>}
        {error && <div className="text-red-400 text-sm">{error}</div>}
      </div>

      <div className="text-xs text-neutral-500 space-y-2">
        <p>注意:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>必須フィールド: id, year, questionNumber, category, content, solution, explanation</li>
          <li>オプション: difficulty (easy|medium|hard), type (input|single), choices[], unit, rounding (round|ceil|floor)</li>
          <li>インポートすると同じidの問題はカスタムで上書きされます。</li>
        </ul>
      </div>
    </main>
  );
}
