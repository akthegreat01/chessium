import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Chessium | Premium Chess Analysis",
  description: "High-performance, beautifully crafted browser-based chess analysis engine powered by Stockfish WASM. Analyze games, train mistakes, and explore openings — all for free.",
  keywords: ["chess", "analysis", "stockfish", "engine", "chess.com", "lichess", "game review", "opening explorer"],
  authors: [{ name: "Chessium" }],
  openGraph: {
    title: "Chessium | Premium Chess Analysis",
    description: "Analyze your chess games with grandmaster-level Stockfish NNUE. Import from Chess.com and Lichess instantly.",
    type: "website",
    siteName: "Chessium",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chessium | Premium Chess Analysis",
    description: "Free, browser-based chess analysis powered by Stockfish NNUE.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#08090a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} bg-background text-gray-200 min-h-screen flex flex-col relative overflow-x-hidden`}>
        {/* Professional Background Layer */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b82f610,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <Header />
        <main className="flex-1 z-10 relative">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
