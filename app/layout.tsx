import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Nav } from "@/components/nav";
import { Noto_Sans_JP } from "next/font/google";

export const metadata: Metadata = {
  title: "事例IVマスター",
  description: "中小企業診断士 事例IV（財務・会計）対策アプリ",
};

const fontSans = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <ThemeProvider>
          <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container py-4">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight">事例IVマスター</h1>
              </div>
              <Nav />
            </div>
          </header>
          <main className="container py-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
