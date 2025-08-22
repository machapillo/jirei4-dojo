"use client";
import { ReactNode } from "react";

export function PracticeHeader({ title, subtitle, right, below }: { title: string; subtitle?: string; right?: ReactNode; below?: ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle ? <p className="text-sm text-neutral-400">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">{right}</div>
      </div>
      {below ? <div>{below}</div> : null}
    </div>
  );
}
