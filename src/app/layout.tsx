import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/contexts/SettingsContext";

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
  metadataBase: new URL('https://chessium.in'),
  title: {
    default: "Chessium — Master Every Move",
    template: "%s | Chessium",
  },
  description:
    "Master Every Move. AI-powered chess analysis, personalized training, and beautiful gameplay designed for ambitious players. Created by Akshath Kataria.",
  keywords: [
    "chess",
    "chess analysis",
    "chess puzzles",
    "chess courses",
    "stockfish",
    "chess engine",
    "play chess against bots",
    "free chess analysis",
    "game analysis",
    "chess improvement",
    "chess learning",
    "online chess",
    "learn chess openings",
  ],
  authors: [{ name: "Akshath Kataria", url: "https://chessium.in" }],
  creator: "Akshath Kataria",
  alternates: {
    canonical: '/',
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
      <head>
        <meta name="monetag" content="bb0cb39aef776ea821284c195177d29d" />
        <script src="https://quge5.com/88/tag.min.js" data-zone="246526" async data-cfasync="false"></script>
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
