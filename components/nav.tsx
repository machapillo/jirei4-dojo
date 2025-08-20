"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const tabs = [
  { href: "/", label: "ダッシュボード" },
  { href: "/practice", label: "演習" },
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
              ? "border-brand.blue text-white"
              : "border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
          )}
        >
          {t.label}
        </Link>
      ))}
      <div className="ml-auto flex gap-2">
        <Link href="/auth/sign-in" className="text-neutral-300 hover:text-white">ログイン</Link>
        <span className="text-neutral-600">/</span>
        <Link href="/auth/sign-up" className="text-neutral-300 hover:text-white">新規登録</Link>
      </div>
    </nav>
  );
}
