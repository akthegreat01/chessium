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
    "play chess against bots",
    "free chess analysis",
    "game analysis",
    "chess improvement",
    "chess learning",
    "online chess",
    "learn chess openings",
  ],
  authors: [{ name: "Chessium" }],
  creator: "Chessium",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chessium.in",
    siteName: "Chessium",
    title: "Chessium — Analyze. Learn. Improve.",
    description:
      "The modern chess platform for analysis, puzzles, courses, and improvement.",
    images: [
      {
        url: '/og-image.jpg', // We should make sure we have a default OG image or assume one
        width: 1200,
        height: 630,
        alt: 'Chessium Preview',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chessium",
    description: "The modern chess platform for analysis, puzzles, and courses.",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
