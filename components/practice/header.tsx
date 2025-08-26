"use client";
import { ReactNode } from "react";

export function PracticeHeader({ title, subtitle, right, below }: { title: string; subtitle?: string; right?: ReactNode; below?: ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold">{title}</h2>
          {subtitle ? <p className="hidden sm:block text-sm sm:text-base text-neutral-600">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible -mx-2 px-2">
          {right}
        </div>
      </div>
      {below ? <div>{below}</div> : null}
    </div>
  );
}
