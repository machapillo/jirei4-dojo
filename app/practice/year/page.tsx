"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PracticeYearPage() {
  return (
    <main className="space-y-6">
      <h2 className="text-lg font-semibold">年度別演習</h2>
      <p className="text-sm text-neutral-400">年ごとの本試験形式で演習できるページ（プレースホルダー）。</p>
      <Link href="/practice">
        <Button variant="outline">戻る</Button>
      </Link>
    </main>
  );
}
