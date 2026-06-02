import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chessium — Analyze. Learn. Improve.",
    template: "%s | Chessium",
  },
  description:
    "Analyze games, solve puzzles, learn from courses, and master chess with powerful tools. Chessium is the modern chess platform for players who want to improve faster.",
  keywords: [
    "chess",
    "chess analysis",
    "chess puzzles",
    "chess courses",
    "stockfish",
    "chess engine",
    "chess.com",
    "lichess",
    "game analysis",
    "chess improvement",
    "chess learning",
    "online chess",
  ],
  authors: [{ name: "Chessium" }],
  creator: "Chessium",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Chessium",
    title: "Chessium — Analyze. Learn. Improve.",
    description:
      "The modern chess platform for analysis, puzzles, courses, and improvement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chessium — Analyze. Learn. Improve.",
    description:
      "The modern chess platform for analysis, puzzles, courses, and improvement.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
