import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit } from "lucide-react";

export const metadata: Metadata = {
  title: "Learn Chess | Chessium",
  description: "Improve your chess skills with interactive tutorials, tactics training, and grandmaster insights.",
  openGraph: {
    title: "Learn Chess | Chessium",
    description: "Improve your chess skills with interactive tutorials, tactics training, and grandmaster insights.",
    type: "website",
  }
};

export default function LearnPage() {
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
            <Link href="/puzzles" className="text-sm font-medium text-secondary-foreground hover:text-foreground">Puzzles</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6">
          <BrainCircuit className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          Unlock your potential.
        </h1>
        <p className="text-xl text-secondary-foreground max-w-2xl mx-auto font-medium mb-10">
          From absolute beginner to seasoned master, Chessium provides the tools you need to elevate your game.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold">
            <Link href="/puzzles">Solve Daily Puzzles</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold border-white/10 bg-surface">
            <Link href="/openings">Explore Openings</Link>
          </Button>
        </div>
      </section>

      {/* Courses/Tracks */}
      <section className="py-12 px-6 max-w-5xl mx-auto mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-white/5 p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-3">Beginner</h3>
          <p className="text-secondary-foreground text-sm mb-6">Learn how the pieces move, basic checkmates, and opening principles.</p>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full">Coming Soon</span>
        </div>
        <div className="bg-surface border border-white/5 p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-3">Intermediate</h3>
          <p className="text-secondary-foreground text-sm mb-6">Master tactical motifs, positional concepts, and endgame fundamentals.</p>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full">Coming Soon</span>
        </div>
        <div className="bg-surface border border-white/5 p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-3">Advanced</h3>
          <p className="text-secondary-foreground text-sm mb-6">Deep opening preparation, complex calculations, and grandmaster games.</p>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full">Coming Soon</span>
        </div>
      </section>

    </main>
  );
}
