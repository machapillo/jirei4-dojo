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
  const [audit, setAudit] = useState<{ total: number; issues: string[]; incorrectCount: number; incorrectPercent: number }>({ total: 0, issues: [], incorrectCount: 0, incorrectPercent: 0 });

  useEffect(() => {
    (async () => {
      const all = await getQuestions();
      setMergedCount(all.length);
      setAudit(runAudit(all));
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

  function runAudit(all: Question[]) {
    const issues: string[] = [];
    let incorrectCount = 0;
    const idSet = new Set<string>();

    for (const q of all) {
      const id = q.id || "(no id)";
      const solNorm = normalize(String(q.solution));
      const solNum = Number(solNorm);
      const content = q.content || "";
      const expl = q.explanation || "";

      // Required fields (structural)
      if (!q.id || typeof q.year !== "number" || typeof q.questionNumber !== "number" || !q.category || !q.content || !q.solution || !q.explanation) {
        issues.push(`[${id}] 必須フィールドの欠落があります`);
      }

      // Duplicate id (structural)
      if (q.id) {
        if (idSet.has(q.id)) issues.push(`[${id}] 重複IDが見つかりました`);
        idSet.add(q.id);
      }

      // Single-choice consistency (correctness)
      if (q.type === "single") {
        if (!q.choices || !q.choices.length) {
          issues.push(`[${id}] 単一選択ですがchoicesが空です`);
        } else if (!q.choices.some((c) => normalize(c) === solNorm)) {
          issues.push(`[${id}] 単一選択の選択肢にsolutionが含まれていません（正答不整合）`);
          incorrectCount++;
        }
      }

      // Rounding keyword expectation from content (correctness)
      if (/最も近い整数/.test(content)) {
        if (q.rounding !== "round") {
          issues.push(`[${id}] 問題文に「最も近い整数」とあり、rounding=round が期待されます`);
        }
        if (Number.isFinite(solNum) && !Number.isInteger(solNum)) {
          issues.push(`[${id}] 最も近い整数指定にも関わらずsolutionが整数ではありません（正答形式）`);
          incorrectCount++;
        }
      }
      if (/切上げ|切り上げ/.test(content)) {
        if (q.rounding !== "ceil") {
          issues.push(`[${id}] 問題文に「切上げ」があり、rounding=ceil が期待されます`);
        }
      }
      if (/切下げ|切り下げ/.test(content)) {
        if (q.rounding !== "floor") {
          issues.push(`[${id}] 問題文に「切下げ」があり、rounding=floor が期待されます`);
        }
      }

      // Rounding field sanity (structural/correctness)
      if (q.rounding) {
        if (Number.isNaN(solNum)) {
          issues.push(`[${id}] rounding指定がありますがsolutionが数値に変換できません`);
          incorrectCount++;
        }
      }

      // Unit-based sanity for numeric answers (correctness heuristics)
      const numericUnits = ["円", "個", "日", "%", "時間"];
      if (q.unit && numericUnits.includes(q.unit)) {
        if (Number.isNaN(solNum)) {
          issues.push(`[${id}] 単位「${q.unit}」ですがsolutionが数値ではありません`);
          incorrectCount++;
        } else {
          // For 円, allow negative values in NPV or price-change contexts
          const allowNegativeYen = (q.category && q.category.includes("NPV")) || /NPV|デルタ|価格変化|変化|差異/.test(content);
          if (
            ((q.unit === "円" && !allowNegativeYen) || q.unit === "個" || q.unit === "日") &&
            solNum <= 0
          ) {
            issues.push(`[${id}] 単位「${q.unit}」でsolutionが非正（0以下）です（要確認）`);
          }
          if (q.unit === "%" && (solNum < -1000 || solNum > 1000)) {
            issues.push(`[${id}] 単位「%」で値が異常に大きい/小さい可能性（要確認）`);
          }
        }
      }

      // Heuristic: explanation should reference the final numeric (allow numeric-equivalent like 8 vs 8.0)
      // Normalize: convert Unicode minus (U+2212) to ASCII '-' and remove commas before number extraction
      const explNormalized = expl.replace(/[\u2212]/g, "-").replace(/[,，]/g, "");
      const explNumbers = Array.from(explNormalized.matchAll(/-?\d+(?:\.\d+)?/g)).map((m) => m[0]);
      if (explNumbers.length > 0) {
        const solNumEq = Number(solNorm);
        const hasExactText = explNumbers.includes(solNorm);
        const hasNumericEq = Number.isFinite(solNumEq) && explNumbers.some((n) => Number(n) === solNumEq);
        if (!hasExactText && !hasNumericEq) {
          // do not count as incorrect automatically, but flag
          issues.push(`[${id}] 解説内に最終解と同一の数値表記が見当たりません（表記揺れ/丸めの可能性、確認推奨）`);
        }
      }

      // Category-specific light checks
      if (q.category.includes("EOQ") || /EOQ/.test(content)) {
        if (!Number.isNaN(solNum) && !Number.isInteger(solNum)) {
          issues.push(`[${id}] EOQは通常整数。solutionが整数でない可能性（正答形式）`);
          incorrectCount++;
        }
      }
    }

    const total = all.length;
    const incorrectPercent = total ? Math.round((incorrectCount / total) * 100) : 0;
    return { total, issues, incorrectCount, incorrectPercent };
  }

  function normalize(v: string) {
    return (v || "").toString().replace(/[\,\s]/g, "").trim();
  }

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

      <div className="rounded-lg border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-300">監査レポート</div>
          <div className="text-xs text-neutral-400">全{audit.total}件中、不備 {audit.issues.length}件 / 正答疑義 {audit.incorrectCount}件（{audit.incorrectPercent}%）</div>
        </div>
        {!audit.issues.length ? (
          <div className="text-emerald-400 text-sm">不備は見つかりませんでした。</div>
        ) : (
          <ul className="list-disc pl-5 space-y-1 text-sm text-red-300 max-h-60 overflow-auto">
            {audit.issues.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
        <div>
          <Button variant="outline" onClick={async () => {
            const all = await getQuestions();
            setAudit(runAudit(all));
          }}>再チェック</Button>
        </div>
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
