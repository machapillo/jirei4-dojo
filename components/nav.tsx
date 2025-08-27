"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import type { Route } from "next";
import { Home, BookOpenText, Gamepad2, NotebookTabs, Library, User2 } from "lucide-react";

const tabs: { href: Route; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/", label: "ホーム", Icon: Home },
  { href: "/practice", label: "演習", Icon: NotebookTabs },
  { href: "/game", label: "ゲーム", Icon: Gamepad2 },
  { href: "/review", label: "復習", Icon: BookOpenText },
  { href: "/reference", label: "参考書", Icon: Library },
  { href: "/profile", label: "プロフィール", Icon: User2 },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar text-sm">
      {tabs.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        const Icon = t.Icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex items-center gap-2 rounded-full px-3.5 py-2 border transition whitespace-nowrap",
              active
                ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline-block">{t.label}</span>
            <span className="sm:hidden">{t.label}</span>
          </Link>
        );
      })}
      <div className="ml-auto flex gap-2 pl-2">
        <Link href="/auth/sign-in" className="text-neutral-700 hover:text-neutral-900">ログイン</Link>
        <span className="text-neutral-400">/</span>
        <Link href="/auth/sign-up" className="text-neutral-700 hover:text-neutral-900">新規登録</Link>
      </div>
    </nav>
  );
}
