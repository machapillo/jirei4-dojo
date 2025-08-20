"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PracticePage() {
  return (
    <main className="space-y-6">
      <h2 className="text-lg font-semibold">演習モード</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-800 p-4">
          <h3 className="font-medium mb-2">年度別演習</h3>
          <p className="text-sm text-neutral-400 mb-3">本試験と同じ80分形式で挑戦。</p>
          <Link href="/practice/year">
            <Button variant="outline">開始</Button>
          </Link>
        </div>
        <div className="rounded-lg border border-neutral-800 p-4">
          <h3 className="font-medium mb-2">分野別演習</h3>
          <p className="text-sm text-neutral-400 mb-3">苦手分野を集中トレーニング。</p>
          <Link href="/practice/category">
            <Button variant="outline">開始</Button>
          </Link>
        </div>
        <div className="rounded-lg border border-neutral-800 p-4">
          <h3 className="font-medium mb-2">ランダム演習</h3>
          <p className="text-sm text-neutral-400 mb-3">全範囲からショートクイズ。</p>
          <Link href="/practice/random">
            <Button variant="outline">開始</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
