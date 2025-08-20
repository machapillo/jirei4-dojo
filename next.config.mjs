/** @type {import('next').NextConfig} */
const REPO = 'jirei4-dojo';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  // App Router 静的エクスポート
  output: 'export',
  images: { unoptimized: true },
  // GitHub Pages のプロジェクトページ用設定
  basePath: isProd ? `/${REPO}` : '',
  assetPrefix: isProd ? `/${REPO}/` : '',
  trailingSlash: true,
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
