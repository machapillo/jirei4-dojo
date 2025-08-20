import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "事例IVマスター",
  description: "中小企業診断士 事例IV（財務・会計）対策アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="container py-6">
            <header className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h1 className="text-xl font-semibold">事例IVマスター</h1>
              </div>
              <Nav />
            </header>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
