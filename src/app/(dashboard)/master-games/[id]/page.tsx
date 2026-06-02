"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MASTER_GAMES, MasterGame } from "@/lib/chess/master-games-db";
import { Chess, Move } from "chess.js";
import Board from "@/components/chess/Board";
import { useSettings } from "@/contexts/SettingsContext";
import { playMoveSound } from "@/lib/audio";

export default function MasterGameViewer() {
  const params = useParams();
  const gameId = params.id as string;
  const { settings } = useSettings();
  
  const [game, setGame] = useState<MasterGame | null>(null);
  const [chess] = useState(new Chess());
  const [history, setHistory] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [position, setPosition] = useState<string>("start");
  const [isFlipped, setIsFlipped] = useState(false);

  // Initialize game
  useEffect(() => {
    const found = MASTER_GAMES.find(g => g.id === gameId);
    if (found) {
      setGame(found);
      try {
        chess.loadPgn(found.pgn);
        const moves = chess.history({ verbose: true }) as Move[];
        setHistory(moves);
        // Start at beginning
        chess.reset();
        setPosition(chess.fen());
        setCurrentMoveIndex(-1);
      } catch (e) {
        console.error("Failed to parse game PGN", e);
      }
    }
  }, [gameId, chess]);

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

  const flipBoard = () => setIsFlipped(!isFlipped);

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

  // Play sound on move change
  useEffect(() => {
    if (currentMoveIndex >= 0 && history[currentMoveIndex]) {
      const san = history[currentMoveIndex].san;
      playMoveSound(san.includes('x'), settings.soundEnabled);
    }
  }, [currentMoveIndex, history, settings.soundEnabled]);

  if (!game) {
    return <div className="text-center p-12 text-[#a0a0a8]">Game not found.</div>;
  }

  // Render move list in pairs
  const movePairs: { white?: Move; black?: Move }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      white: history[i],
      black: history[i + 1]
    });
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Header */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/master-games" className="text-[#81b64c] hover:text-[#9fcc6b] text-sm font-medium mb-1 inline-block">
            ← Back to Master Games
          </Link>
          <h1 className="text-2xl font-bold text-white">{game.title}</h1>
          <p className="text-[#a0a0a8] text-sm">
            {game.white} vs {game.black} • {game.event}, {game.year}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Side: Board */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="w-full max-w-[650px] mx-auto flex flex-col gap-2">
            
            {/* Top Player Info */}
            <div className="flex items-center gap-4 px-3 py-2 bg-[#141416] border border-[#2a2a30] rounded-t-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a30] to-[#1a1a1f] border border-[#3a3a42] flex items-center justify-center font-bold text-white shadow-sm text-lg">
                {isFlipped ? game.white[0] : game.black[0]}
              </div>
              <div className="font-bold text-white text-lg tracking-wide">
                {isFlipped ? game.white : game.black}
              </div>
            </div>

            {/* Board */}
            <Board 
              position={position}
              boardOrientation={isFlipped ? "black" : "white"}
              arePiecesDraggable={false}
              theme={settings.boardTheme}
              animationDuration={settings.moveAnimation ? 200 : 0}
            />

            {/* Bottom Player Info */}
            <div className="flex items-center gap-4 px-3 py-2 bg-[#141416] border border-[#2a2a30] rounded-b-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a30] to-[#1a1a1f] border border-[#3a3a42] flex items-center justify-center font-bold text-white shadow-sm text-lg">
                {isFlipped ? game.black[0] : game.white[0]}
              </div>
              <div className="font-bold text-white text-lg tracking-wide">
                {isFlipped ? game.black : game.white}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 mt-2 bg-[#141416] p-2 rounded-xl border border-[#2a2a30]">
              <button 
                onClick={() => goToMove(-1)}
                className="p-3 text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] rounded-lg transition-colors"
                title="Start"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={prevMove}
                className="p-3 text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] rounded-lg transition-colors"
                title="Previous Move"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextMove}
                className="p-3 text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] rounded-lg transition-colors"
                title="Next Move"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button 
                onClick={() => goToMove(history.length - 1)}
                className="p-3 text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] rounded-lg transition-colors"
                title="End"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
              <div className="w-px h-6 bg-[#2a2a30] mx-2"></div>
              <button 
                onClick={flipBoard}
                className="p-3 text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] rounded-lg transition-colors"
                title="Flip Board"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Move List & Details */}
        <div className="w-full lg:w-[380px] xl:w-[450px] flex flex-col gap-4 min-h-0">
          
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl flex flex-col flex-1 shadow-elevated min-h-0 overflow-hidden">
            <div className="p-4 border-b border-[#2a2a30] bg-[#1a1a1f]">
              <div className="text-lg font-bold text-white">Moves</div>
              <div className="text-sm text-[#a0a0a8] flex justify-between mt-1">
                <span>{game.opening}</span>
                <span>{game.eco}</span>
              </div>
            </div>

            {/* Scrollable Move List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0a0a0b]">
              <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 text-sm font-mono">
                {movePairs.map((pair, i) => {
                  const whiteIndex = i * 2;
                  const blackIndex = i * 2 + 1;
                  return (
                    <React.Fragment key={i}>
                      <div className="text-[#6b6b75] text-right py-1.5 select-none">{i + 1}.</div>
                      
                      <div 
                        onClick={() => goToMove(whiteIndex)}
                        className={`px-2 py-1.5 rounded cursor-pointer transition-colors
                          ${currentMoveIndex === whiteIndex 
                            ? "bg-[#81b64c] text-white font-bold" 
                            : "text-[#d0d0d5] hover:bg-[#2a2a30]"}`}
                      >
                        {pair.white?.san}
                      </div>
                      
                      {pair.black ? (
                        <div 
                          onClick={() => goToMove(blackIndex)}
                          className={`px-2 py-1.5 rounded cursor-pointer transition-colors
                            ${currentMoveIndex === blackIndex 
                              ? "bg-[#81b64c] text-white font-bold" 
                              : "text-[#d0d0d5] hover:bg-[#2a2a30]"}`}
                        >
                          {pair.black.san}
                        </div>
                      ) : <div />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Game Result */}
            <div className="p-4 border-t border-[#2a2a30] bg-[#1a1a1f] text-center font-bold text-lg text-white">
              {game.result}
            </div>
          </div>

          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-5 shadow-elevated">
            <h3 className="font-bold text-white mb-2">Historical Context</h3>
            <p className="text-sm text-[#a0a0a8] leading-relaxed">
              {game.description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
