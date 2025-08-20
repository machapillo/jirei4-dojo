"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, usingMock } from "@/src/lib/firebase";
import { useUserStore } from "@/src/store/user";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (usingMock) {
        setUser({ uid: "demo", email });
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        setUser({ uid: res.user.uid, email: res.user.email ?? email });
      }
      router.push("/");
    } catch (err: any) {
      setError(err?.message ?? "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-6 max-w-sm">
      <h2 className="text-lg font-semibold">新規登録</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm text-neutral-300">メールアドレス</label>
          <input
            type="email"
            className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-neutral-300">パスワード</label>
          <input
            type="password"
            className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button disabled={loading} type="submit" className="w-full">{loading ? "処理中..." : "登録"}</Button>
      </form>
    </main>
  );
}
