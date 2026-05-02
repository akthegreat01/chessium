import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
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
  themeColor: '#0a0a0a',
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
          {/* Deep dark base */}
          <div className="absolute inset-0" style={{ background: '#0a0a0a' }} />
          {/* Subtle gold warmth at top center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px]" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
          {/* Purple depth accent bottom right */}
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px]" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(139,92,246,0.04) 0%, transparent 60%)' }} />
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
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
