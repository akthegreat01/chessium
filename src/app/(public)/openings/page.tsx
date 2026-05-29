import React from "react";
import Link from "next/link";
import { openingsData } from "@/lib/openings/data";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chess Openings Explorer | Chessium",
  description: "Explore the most popular chess openings, variations, and theory. Master the Sicilian Defense, Ruy Lopez, French Defense, and more.",
};

export default function OpeningsPage() {
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
            <Link href="/puzzles" className="text-sm font-medium text-secondary-foreground hover:text-foreground">Puzzles</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          Master the Opening.
        </h1>
        <p className="text-xl text-secondary-foreground max-w-2xl mx-auto font-medium">
          Explore the theory behind the most popular chess openings. Learn the ideas, understand the plans, and crush your opponents out of the gate.
        </p>
      </section>

      {/* Openings Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {openingsData.map((opening) => (
            <div key={opening.slug} className="group bg-surface border border-white/5 rounded-[32px] overflow-hidden flex flex-col sm:flex-row transition-all hover:bg-white/5">
              
              {/* Board Preview */}
              <div className="w-full sm:w-[240px] shrink-0 aspect-square p-6 sm:border-r border-b sm:border-b-0 border-white/5 flex items-center justify-center bg-black/20 pointer-events-none">
                <Chessboard 
                  position={opening.fen} 
                  customDarkSquareStyle={{ backgroundColor: '#2d3748' }}
                  customLightSquareStyle={{ backgroundColor: '#e2e8f0' }}
                  arePiecesDraggable={false}
                />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold tracking-tight">{opening.name}</h2>
                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-secondary-foreground">
                      {opening.eco}
                    </span>
                  </div>
                  <div className="text-primary font-mono text-sm font-bold mb-4">{opening.moves}</div>
                  <p className="text-secondary-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {opening.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-secondary-foreground/60">Popular Continuations</div>
                    <div className="flex flex-wrap gap-2">
                      {opening.continuations.map((cont, idx) => (
                        <span key={idx} className="text-xs font-medium bg-black/20 border border-white/5 px-2 py-1 rounded">
                          {cont}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full rounded-xl gap-2 font-semibold">
                  <Link href={`/analyze?pgn=${encodeURIComponent(opening.moves)}`}>
                    Analyze Position <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
