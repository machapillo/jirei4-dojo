"use client";
import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { CalendarClock, Layers3, Shuffle, Settings2 } from "lucide-react";

export default function PracticePage() {
  return (
    <main className="container space-y-6 py-6">
      <h2 className="text-lg font-semibold">演習モード</h2>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        <div className="group rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md hover:border-brand-blue focus-within:border-brand-blue">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <CalendarClock className="h-5 w-5" />
            </span>
            <h3 className="font-semibold">年度別演習</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">本試験と同じ80分形式で挑戦。</p>
          <Link href="/practice/year">
            <Button variant="outline" className="w-full sm:w-auto">開始</Button>
          </Link>
        </div>

        <div className="group rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md hover:border-brand-blue focus-within:border-brand-blue">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <Layers3 className="h-5 w-5" />
            </span>
            <h3 className="font-semibold">分野別演習</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">苦手分野を集中トレーニング。</p>
          <Link href="/practice/category">
            <Button variant="outline" className="w-full sm:w-auto">開始</Button>
          </Link>
        </div>

        <div className="group rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md hover:border-brand-blue focus-within:border-brand-blue">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <Shuffle className="h-5 w-5" />
            </span>
            <h3 className="font-semibold">ランダム演習</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">全範囲からショートクイズ。</p>
          <Link href="/practice/random">
            <Button variant="outline" className="w-full sm:w-auto">開始</Button>
          </Link>
        </div>

        <div className="group rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md hover:border-brand-blue focus-within:border-brand-blue">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <Settings2 className="h-5 w-5" />
            </span>
            <h3 className="font-semibold">問題管理</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">カスタム問題のインポート/エクスポート。</p>
          <Link href={("/practice/manage" as Route)}>
            <Button variant="outline" className="w-full sm:w-auto">開く</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
