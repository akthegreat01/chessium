import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chessium.in"),
  title: {
    default: "Chessium | Free Premium Chess Analysis & Stockfish 18",
    template: "%s | Chessium"
  },
  description: "Chessium is the ultimate modern chess platform. Get free premium game analysis powered by Stockfish 18, play against AI bots, solve tactics puzzles, and learn chess openings.",
  keywords: [
    "chess", "chess analysis", "free chess analysis", "stockfish 18", 
    "play chess online", "chess engine", "chess tactics", "chess puzzles",
    "chess openings", "chess courses", "analyze chess game", "pgn viewer"
  ],
  authors: [{ name: "Chessium" }],
  creator: "Chessium",
  publisher: "Chessium",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Chessium | Free Premium Chess Analysis",
    description: "Analyze your chess games for free with Stockfish 18, solve puzzles, and learn openings on Chessium's ultra-fast modern platform.",
    url: "https://chessium.in",
    siteName: "Chessium",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chessium | Free Premium Chess Analysis",
    description: "Analyze your chess games for free with Stockfish 18, solve puzzles, and learn openings on Chessium.",
    creator: "@chessium",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/chess/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
