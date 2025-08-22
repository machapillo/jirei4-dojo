"use client";
import { useState, type ChangeEvent } from "react";

export function Notepad({ onChange }: { onChange?: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="px-3 py-2 border-b border-neutral-200 text-sm text-neutral-700">ノートパッド</div>
      <textarea
        className="w-full min-h-[160px] bg-white text-neutral-800 p-3 outline-none placeholder:text-neutral-400"
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
