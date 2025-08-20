# 事例IVマスター

Next.js 14 + Tailwind + Firebase を用いた学習アプリのMVPスケルトンです。

## セットアップ

1. 依存関係のインストール
```bash
pnpm i # または npm i / yarn
```

2. 環境変数を作成
`.env.local` を作成し、`.env.example` を参考に設定してください。

3. 開発サーバ起動
```bash
pnpm dev
```

## 技術
- Next.js 14 (App Router)
- Tailwind CSS
- shadcn/ui 風の最小UI（自作）
- Firebase (Firestore, Authentication)
- Zustand（今後追加）
- Recharts / Framer Motion（今後拡張）
