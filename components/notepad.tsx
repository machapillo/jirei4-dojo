"use client";
import { useState, type ChangeEvent } from "react";

export function Notepad({ onChange }: { onChange?: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="rounded-lg border border-neutral-800">
      <div className="px-3 py-2 border-b border-neutral-800 text-sm text-neutral-300">ノートパッド</div>
      <textarea
        className="w-full min-h-[160px] bg-neutral-950 text-neutral-100 p-3 outline-none"
        placeholder="計算過程や要点をメモしましょう"
        value={text}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setText(e.target.value);
          onChange?.(e.target.value);
        }}
      />
    </div>
  );
}
