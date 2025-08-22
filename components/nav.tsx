"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import type { Route } from "next";

const tabs: { href: Route; label: string }[] = [
  { href: "/", label: "ダッシュボード" },
  { href: "/practice", label: "演習" },
  { href: "/game", label: "ゲーム" },
  { href: "/review", label: "復習ノート" },
  { href: "/reference", label: "デジタル参考書" },
  { href: "/profile", label: "プロフィール" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-3 overflow-x-auto text-sm">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={clsx(
            "rounded-md px-3 py-2 border transition",
            pathname === t.href
              ? "bg-brand.blue text-white border-brand.blue"
              : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
          )}
        >
          {t.label}
        </Link>
      ))}
      <div className="ml-auto flex gap-2">
        <Link href="/auth/sign-in" className="text-neutral-700 hover:text-neutral-900">ログイン</Link>
        <span className="text-neutral-600">/</span>
        <Link href="/auth/sign-up" className="text-neutral-700 hover:text-neutral-900">新規登録</Link>
      </div>
    </nav>
  );
}
