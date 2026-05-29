"use client";

import React, { useState } from "react";
import Link from "next/link";
import { openingsData as openings } from "@/lib/openings/data";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Chessboard } from "react-chessboard";

export default function OpeningsClient() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <main className="flex-1 flex flex-col lg:flex-row h-full min-h-screen bg-background">
      <div className="w-full lg:w-[320px] bg-surface border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-xl font-bold tracking-tight mb-2 block">Chessium</Link>
          <div className="text-sm font-medium text-secondary-foreground">Opening Explorer</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {openings.map((opening, idx) => (
            <button
              key={opening.id}
              onClick={() => setSelectedIndex(idx)}
              className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between ${
                selectedIndex === idx 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "hover:bg-white/5 text-secondary-foreground hover:text-foreground"
              }`}
            >
              <div>
                <div className="font-bold">{opening.name}</div>
                <div className="text-xs opacity-80">{opening.eco}</div>
              </div>
              {selectedIndex === idx && <ChevronRight className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wider mb-4">
              ECO: {openings[selectedIndex].eco}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{openings[selectedIndex].name}</h1>
            <p className="text-xl text-secondary-foreground leading-relaxed">
              {openings[selectedIndex].description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="w-full max-w-[400px] bg-background rounded-xl overflow-hidden shadow-2xl border border-white/10 pointer-events-none">
              {/* @ts-ignore */}
              <Chessboard 
                position={openings[selectedIndex].fen} 
                customDarkSquareStyle={{ backgroundColor: '#2d3748' }}
                customLightSquareStyle={{ backgroundColor: '#e2e8f0' }}
                arePiecesDraggable={false}
              />
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-foreground mb-4">Key Moves</h3>
                <div className="font-mono bg-surface p-4 rounded-xl border border-white/5 text-lg">
                  {openings[selectedIndex].moves}
                </div>
              </div>
              <div className="space-y-4">
                <Button className="w-full justify-between h-14 text-base rounded-xl">
                  <Link href={`/analyze?fen=${encodeURIComponent(openings[selectedIndex].fen)}`} className="flex w-full justify-between items-center">
                    Analyze this Position <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full h-14 text-base rounded-xl border-white/10 bg-surface">
                  <Link href="/play/ai" className="flex w-full items-center justify-center">
                    Practice vs AI
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
