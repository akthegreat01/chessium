import React from "react";
import { BookOpen, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { StaticBoard } from "@/components/chess/StaticBoard";

const openings = [
  { name: "Sicilian Defense", eco: "B20 - B99", moves: "1. e4 c5", fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2" },
  { name: "Ruy Lopez", eco: "C60 - C99", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5", fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3" },
  { name: "Caro-Kann Defense", eco: "B10 - B19", moves: "1. e4 c6", fen: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2" },
  { name: "French Defense", eco: "C00 - C19", moves: "1. e4 e6", fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2" },
  { name: "Italian Game", eco: "C50 - C59", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3" }
];

export default function OpeningsPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Openings
          </h1>
          <p className="text-secondary-foreground text-[15px]">Explore and master opening theory.</p>
        </div>
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground" />
          <input 
            type="text" 
            placeholder="Search openings..." 
            className="w-full h-10 bg-surface border border-border rounded-lg pl-9 pr-4 text-[13px] focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openings.map((op, i) => (
          <Link href="#" key={i} className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col">
            <div className="aspect-square bg-background border-b border-border p-4 relative pointer-events-none">
              <StaticBoard position={op.fen} />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-[15px]">{op.name}</h3>
                  <span className="text-[11px] text-secondary-foreground font-mono bg-white/5 px-2 py-0.5 rounded">{op.eco}</span>
                </div>
                <p className="text-secondary-foreground text-[13px] font-mono mb-4">{op.moves}</p>
              </div>
              <div className="flex items-center text-[12px] font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                Study Opening <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
