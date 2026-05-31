"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard), { ssr: false });
import { Button } from "@/components/ui/button";

const OPENING_DATA = {
  title: "The Sicilian Defense",
  description: "The most popular and best-scoring response to White's first move 1.e4.",
  moves: [
    { move: "1. e4", fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", note: "White stakes a claim in the center and opens lines for the Queen and Bishop." },
    { move: "1... c5", fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2", note: "Black fights for the d4 square immediately, unbalancing the position and creating an asymmetrical pawn structure." },
    { move: "2. Nf3", fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", note: "White develops the Knight to control d4 and e5, preparing to break the center." },
    { move: "2... d6", fen: "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", note: "Black controls e5 and prepares to develop the Queenside." },
  ]
};

export default function OpeningTheoryPage({ params }: { params: { slug: string } }) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(1);
  
  // Use mock data or base it on slug (here we use static mock data for demo)
  const data = OPENING_DATA;
  const currentStep = data.moves[currentMoveIndex];

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-screen text-foreground">
      <Link href="/openings" className="inline-flex items-center text-[13px] font-medium text-secondary-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Openings
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h1>
        <p className="text-secondary-foreground text-[15px]">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Chessboard Area */}
        <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-center">
          <div className="w-full max-w-[600px] aspect-square rounded overflow-hidden">
            <Chessboard 
              position={currentStep.fen}
              customDarkSquareStyle={{ backgroundColor: "#779556" }}
              customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
              arePiecesDraggable={false}
            />
          </div>
        </div>

        {/* Theory Explorer */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border p-6 rounded-xl">
            <h2 className="text-[14px] font-semibold mb-4">Theory Explorer</h2>
            
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 border-border bg-transparent hover:bg-white/[0.04]"
                disabled={currentMoveIndex === 0}
                onClick={() => setCurrentMoveIndex(p => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-mono font-bold text-lg">{currentStep.move}</span>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 border-border bg-transparent hover:bg-white/[0.04]"
                disabled={currentMoveIndex === data.moves.length - 1}
                onClick={() => setCurrentMoveIndex(p => Math.min(data.moves.length - 1, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-[14px] text-secondary-foreground leading-relaxed">
                {currentStep.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
