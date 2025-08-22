"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, usingMock } from "@/src/lib/firebase";
import { useUserStore } from "@/src/store/user";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (usingMock) {
        setUser({ uid: "demo", email });
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        setUser({ uid: res.user.uid, email: res.user.email ?? email });
      }
      router.push("/");
    } catch (err: any) {
      setError(err?.message ?? "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container space-y-6 py-6 max-w-sm">
      <h2 className="text-lg font-semibold">ログイン</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm text-neutral-700">メールアドレス</label>
          <input
            type="email"
            className="w-full rounded-md bg-white border border-neutral-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand.blue/40"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-neutral-700">パスワード</label>
          <input
            type="password"
            className="w-full rounded-md bg-white border border-neutral-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand.blue/40"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button disabled={loading} type="submit" className="w-full">{loading ? "処理中..." : "ログイン"}</Button>
      </form>
    </main>
  );
}
