"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PracticeCategoryPage() {
  return (
    <main className="space-y-6">
      <h2 className="text-lg font-semibold">分野別演習</h2>
      <p className="text-sm text-neutral-400">分野別に問題を解くページ（プレースホルダー）。</p>
      <Link href="/practice">
        <Button variant="outline">戻る</Button>
      </Link>
    </main>
  );
}
