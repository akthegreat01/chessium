import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chess Blog & News | Chessium",
  description: "Read the latest news, strategy guides, and platform updates from the Chessium team.",
  openGraph: {
    title: "Chess Blog & News | Chessium",
    description: "Read the latest news, strategy guides, and platform updates from the Chessium team.",
    type: "website",
  }
};

export default function BlogPage() {
  return (
    <main className="flex-1 min-h-screen bg-background">
      
      {/* Header */}
      <header className="w-full border-b border-white/5 bg-surface/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
            Chessium
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/analyze" className="text-sm font-medium text-secondary-foreground hover:text-foreground">Analyzer</Link>
            <Link href="/openings" className="text-sm font-medium text-secondary-foreground hover:text-foreground">Openings</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          The Chessium Blog
        </h1>
        <p className="text-xl text-secondary-foreground font-medium mb-12">
          Insights, updates, and deep dives into the royal game.
        </p>
      </section>

      {/* Mock Articles */}
      <section className="py-12 px-6 max-w-4xl mx-auto mb-20 space-y-8">
        <article className="bg-surface border border-white/5 p-8 rounded-3xl transition-all hover:bg-white/5">
          <div className="text-sm font-bold tracking-wider text-primary mb-3">PRODUCT UPDATE</div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Introducing Chessium Analyzer V1</h2>
          <p className="text-secondary-foreground leading-relaxed mb-6">
            We've rebuilt the chess analysis experience from the ground up. Say goodbye to cluttered dashboards and heavy interfaces. Welcome to the future of chess improvement.
          </p>
          <div className="text-sm font-medium text-secondary-foreground/60">Published on Oct 24, 2025</div>
        </article>
      </section>

    </main>
  );
}
