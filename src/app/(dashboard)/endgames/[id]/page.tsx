"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ENDGAMES_DB, Endgame } from "@/lib/chess/endgames-db";
import { Chess, Move } from "chess.js";
import Board from "@/components/chess/Board";
import { useSettings } from "@/contexts/SettingsContext";
import AdSlot from "@/components/ui/AdSlot";

export default function EndgameExplorerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { settings } = useSettings();
  
  const [endgame, setEndgame] = useState<Endgame | null>(null);
  const [chess] = useState(new Chess());
  const [history, setHistory] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [position, setPosition] = useState<string>("start");

  // Initialize
  useEffect(() => {
    const found = ENDGAMES_DB.find(o => o.id === id);
    if (found) {
      setEndgame(found);
      try {
        // Load the FEN first
        chess.load(found.fen);
        setPosition(chess.fen());
        
        // Make moves to get history
        const movesStr = found.moves.split(/\\d+\\./).join(" ").trim();
        const moveTokens = movesStr.split(/\\s+/).filter(m => m.length > 0 && !m.includes("..."));
        
        // This is a simplified parser for space-separated SAN without move numbers
        // A robust parser would handle "1. e4 e5 2..." properly.
        // For endgames, we assume standard PGN formatting might be provided, so we try loadPgn
        // But endgames might not start from initial position, so loadPgn fails!
        // We have to manually play the moves on top of the FEN.
        const c2 = new Chess(found.fen);
        
        const validMoves: Move[] = [];
        for (const move of moveTokens) {
          try {
            const res = c2.move(move);
            if (res) validMoves.push(res);
          } catch(e) {
            console.error("Failed to parse move", move);
          }
        }
        setHistory(validMoves);
        setCurrentMoveIndex(-1);
      } catch (e) {
        console.error("Failed to parse endgame", e);
      }
    }
  }, [id, chess]);

  const goToMove = (index: number) => {
    if (!endgame) return;
    chess.load(endgame.fen);
    for (let i = 0; i <= index; i++) {
      if (history[i]) chess.move(history[i]);
    }
    setPosition(chess.fen());
    setCurrentMoveIndex(index);
  };

  const nextMove = () => {
    if (currentMoveIndex < history.length - 1) {
      goToMove(currentMoveIndex + 1);
    }
  };

  const prevMove = () => {
    if (currentMoveIndex >= 0) {
      goToMove(currentMoveIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextMove();
      if (e.key === "ArrowLeft") prevMove();
      if (e.key === "ArrowUp") goToMove(-1);
      if (e.key === "ArrowDown") goToMove(history.length - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentMoveIndex, history.length]);

  if (!endgame) {
    return <div className="text-center p-12 text-[#a0a0a8]">Endgame not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Top Header */}
      <div className="mb-6">
        <Link href="/endgames" className="text-[#81b64c] hover:text-[#9fcc6b] text-sm font-medium mb-2 inline-block">
          ← Back to Endgames
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{endgame.name}</h1>
          <span className="px-3 py-1 bg-[#141416] border border-[#2a2a30] text-[#81b64c] rounded-lg font-bold">
            {endgame.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* Left Side: Board & Controls */}
        <div className="w-full lg:w-[600px] flex flex-col gap-4">
          <div className="shadow-elevated rounded-xl overflow-hidden border border-[#2a2a30]">
            <Board 
              position={position}
              arePiecesDraggable={false}
              theme={settings.boardTheme}
              animationDuration={settings.moveAnimation ? 200 : 0}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between bg-[#141416] p-3 rounded-xl border border-[#2a2a30] shadow-elevated">
            <div className="text-[#a0a0a8] font-mono text-sm px-2 truncate flex-1">
              {currentMoveIndex >= 0 ? (
                <>Move {Math.floor(currentMoveIndex/2) + 1} {currentMoveIndex % 2 !== 0 ? '...' : ''} <span className="text-white font-bold">{history[currentMoveIndex]?.san}</span></>
              ) : "Starting Position"}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => goToMove(-1)}
                className="p-2 text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] rounded-lg transition-colors"
                title="Start"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={prevMove}
                className="p-2 text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] rounded-lg transition-colors"
                title="Previous Move"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextMove}
                className="p-2 text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] rounded-lg transition-colors"
                title="Next Move"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button 
                onClick={() => goToMove(history.length - 1)}
                className="p-2 text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] rounded-lg transition-colors"
                title="End"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Theory & Move List */}
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated">
            <h3 className="text-xl font-bold text-white mb-3">About this Endgame</h3>
            <p className="text-[#a0a0a8] leading-relaxed mb-6">
              {endgame.description}
            </p>
            
            {endgame.detailedTheory && (
              <div className="mb-6 border-t border-[#2a2a30] pt-6">
                <h4 className="text-lg font-bold text-white mb-3">Deep Theoretical Concepts</h4>
                {endgame.detailedTheory.split('\\n\\n').map((paragraph, i) => (
                  <p key={i} className="text-[#a0a0a8] leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
                <div className="my-6">
                  <AdSlot format="horizontal" />
                </div>
              </div>
            )}
            
            {endgame.history && (
              <div className="mb-6 border-t border-[#2a2a30] pt-6">
                <h4 className="text-lg font-bold text-white mb-3">Historical Context</h4>
                <p className="text-[#a0a0a8] leading-relaxed mb-4">
                  {endgame.history}
                </p>
              </div>
            )}

            <div className="my-6">
              <AdSlot format="horizontal" />
            </div>
            
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#81b64c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Key Ideas
            </h4>
            <ul className="space-y-2">
              {endgame.ideas.map((idea, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#d0d0d5]">
                  <span className="text-[#81b64c] mt-0.5">•</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Winning / Drawing Line</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {history.map((move, i) => {
                const isWhite = i % 2 === 0;
                const moveNum = Math.floor(i / 2) + 1;
                const isActive = currentMoveIndex === i;
                
                return (
                  <React.Fragment key={i}>
                    {isWhite && <span className="text-[#6b6b75] font-mono text-sm py-1.5">{moveNum}.</span>}
                    <button
                      onClick={() => goToMove(i)}
                      className={`px-2 py-1 rounded font-mono text-sm transition-colors ${
                        isActive 
                          ? "bg-[#81b64c] text-white font-bold" 
                          : "text-[#d0d0d5] hover:bg-[#2a2a30]"
                      }`}
                    >
                      {move.san}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
            <div className="mt-auto">
              <AdSlot format="square" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
