import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://underpromotion.vercel.app'),
  title: {
    default: "Underpromotion — The Dark Art of Chess Calculation",
    template: "%s | Underpromotion"
  },
  description: "Premium chess analysis platform powered by Stockfish NNUE. Explore underpromotion tactics, analyze games, solve puzzles, and master the most brilliant moves in chess history. Free, browser-based, and beautifully crafted.",
  keywords: ["underpromotion", "chess", "chess analysis", "stockfish", "chess engine", "chess tactics", "chess puzzles", "brilliant moves", "chess strategy", "grandmaster", "opening explorer", "endgame", "chess sacrifice", "chess education"],
  authors: [{ name: "Akshath Kataria" }],
  creator: "Akshath Kataria",
  publisher: "Underpromotion",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Underpromotion — Where Brilliant Moves Become Immortal",
    description: "A next-generation chess experience. Analyze games with Stockfish NNUE, solve tactical puzzles, explore famous underpromotions, and master the dark art of chess calculation.",
    url: 'https://underpromotion.vercel.app',
    siteName: 'Underpromotion',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Underpromotion - Premium Chess Analysis Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Underpromotion — The Dark Art of Chess Calculation',
    description: 'Premium chess analysis, tactical puzzles, and deep chess content. Powered by Stockfish NNUE.',
    creator: '@akshath_kataria',
    images: ['/og-image.png'],
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
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0a',
};

import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9046932302377091"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* JSON-LD Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Underpromotion",
              "url": "https://underpromotion.vercel.app",
              "description": "Premium chess analysis platform with Stockfish NNUE engine, tactical puzzles, and deep chess content.",
              "publisher": {
                "@type": "Organization",
                "name": "Underpromotion",
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://underpromotion.vercel.app/analysis?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.className} bg-background text-gray-200 min-h-screen flex flex-col relative overflow-x-hidden`}>
        <CustomCursor />
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
        <main className="flex-1 relative z-0">
          {children}
          <Footer />
        </main>
        <Analytics />
      </body>
    </html>
  );
}
