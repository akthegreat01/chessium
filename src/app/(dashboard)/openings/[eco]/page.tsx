"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { OPENINGS_DB, Opening } from "@/lib/chess/openings-db";
import { Chess, Move } from "chess.js";
import Board from "@/components/chess/Board";
import { useSettings } from "@/contexts/SettingsContext";

export default function OpeningExplorerPage() {
  const params = useParams();
  const eco = params.eco as string;
  const { settings } = useSettings();
  
  const [opening, setOpening] = useState<Opening | null>(null);
  const [chess] = useState(new Chess());
  const [history, setHistory] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [position, setPosition] = useState<string>("start");

  // Initialize
  useEffect(() => {
    const found = OPENINGS_DB.find(o => o.eco === eco);
    if (found) {
      setOpening(found);
      try {
        // Load the moves string as PGN
        chess.loadPgn(found.moves);
        const moves = chess.history({ verbose: true }) as Move[];
        setHistory(moves);
        
        chess.reset();
        setPosition(chess.fen());
        setCurrentMoveIndex(-1);
      } catch (e) {
        console.error("Failed to parse opening PGN", e);
      }
    }
  }, [eco, chess]);

  const goToMove = (index: number) => {
    chess.reset();
    for (let i = 0; i <= index; i++) {
      chess.move(history[i]);
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

  if (!opening) {
    return <div className="text-center p-12 text-[#a0a0a8]">Opening not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Top Header */}
      <div className="mb-6">
        <Link href="/openings" className="text-[#81b64c] hover:text-[#9fcc6b] text-sm font-medium mb-2 inline-block">
          ← Back to Openings
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{opening.name}</h1>
          <span className="px-3 py-1 bg-[#141416] border border-[#2a2a30] text-[#81b64c] rounded-lg font-bold">
            {opening.eco}
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
            <h3 className="text-xl font-bold text-white mb-3">About this Opening</h3>
            <p className="text-[#a0a0a8] leading-relaxed mb-6">
              {opening.description}
            </p>
            
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#81b64c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Key Ideas
            </h4>
            <ul className="space-y-2">
              {opening.ideas.map((idea, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#d0d0d5]">
                  <span className="text-[#81b64c] mt-0.5">•</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Main Line</h3>
            <div className="flex flex-wrap gap-2">
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
          </div>

        </div>
      </div>
    </div>
  );
}
