"use client";

import React, { useState, useEffect, useRef } from "react";
import Board from "@/components/chess/Board";
import { Chess } from "chess.js";
import { getAnyRandomPuzzle, PuzzleData } from "@/lib/chess/puzzles-db";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AdSlot from "@/components/ui/AdSlot";

export default function RankedPuzzlePage() {
  const [elo, setElo] = useState<number>(1200);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [status, setStatus] = useState<"loading" | "playing" | "solved" | "failed">("loading");
  
  const [position, setPosition] = useState("empty");
  const [moveIndex, setMoveIndex] = useState(0);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  
  const [moveFrom, setMoveFrom] = useState<string | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const chessRef = useRef(new Chess());

  // Load Elo on mount
  useEffect(() => {
    const fetchElo = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try user_metadata first
        const metaRating = user.user_metadata?.puzzle_rating;
        if (metaRating) {
          setElo(metaRating);
          return;
        }
      }
      
      // Fallback to localStorage
      const localElo = localStorage.getItem("chessium_puzzle_rating");
      if (localElo) {
        setElo(parseInt(localElo));
      }
    };
    
    fetchElo();
    loadNextPuzzle();
  }, []);

  const saveElo = async (newElo: number) => {
    setElo(newElo);
    localStorage.setItem("chessium_puzzle_rating", newElo.toString());
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.auth.updateUser({
        data: { puzzle_rating: newElo }
      });
    }
  };

  const loadNextPuzzle = () => {
    setStatus("loading");
    setHintSquare(null);
    setMoveFrom(null);
    
    const nextPuzzle = getAnyRandomPuzzle();
    if (nextPuzzle) {
      const chess = new Chess();
      chess.load(nextPuzzle.fen);
      chessRef.current = chess;
      
      setPosition(chess.fen());
      setMoveIndex(0);
      setOrientation(chess.turn() === 'w' ? 'white' : 'black');
      setPuzzle(nextPuzzle);
      setStatus("playing");
    }
  };

  const handleHint = () => {
    if (!puzzle || status !== "playing") return;
    const nextExpectedMove = puzzle.solution[moveIndex];
    if (nextExpectedMove) {
      // Highlight the source square of the piece they need to move
      setHintSquare(nextExpectedMove.substring(0, 2));
    }
  };

  // Helper to convert UCI (e.g. e2e4) to chess.js object
  const uciToObj = (uci: string) => ({
    from: uci.substring(0, 2),
    to: uci.substring(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined
  });

  const handleSquareClick = (square: string) => {
    if (status !== "playing" || !puzzle) return;
    const chess = chessRef.current;

    if (!moveFrom) {
      const piece = chess.get(square as any);
      if (piece && piece.color === chess.turn()) {
        setMoveFrom(square);
      }
      return;
    }

    const piece = chess.get(moveFrom as any);
    if (!piece) {
      setMoveFrom(null);
      return;
    }
    const pieceStr = piece.color + piece.type.toUpperCase();
    
    if (square === moveFrom) {
      setMoveFrom(null);
      return;
    }
    
    handlePieceDrop(moveFrom, square, pieceStr);
    setMoveFrom(null);
  };

  const handlePieceDrop = (source: string, target: string, piece: string) => {
    if (status !== "playing" || !puzzle || moveIndex % 2 !== 0) return false;

    const chess = chessRef.current;
    
    const isPawn = piece[1]?.toLowerCase() === "p";
    const isBackRank = target[1] === "8" || target[1] === "1";
    const promotion = (isPawn && isBackRank) ? "q" : undefined;
    
    const moveStr = source + target + (promotion || "");
    const expectedMove = puzzle.solution[moveIndex];
    
    setHintSquare(null);

    // Validate using chess.js
    let moveObj;
    try {
      moveObj = chess.move({
        from: source,
        to: target,
        promotion: promotion
      });
    } catch {
      return false;
    }
    
    if (!moveObj) return false;

    // Check if correct
    if (moveStr === expectedMove || moveObj.lan === expectedMove) {
      // Correct!
      setPosition(chess.fen());
      
      if (moveIndex + 1 === puzzle.solution.length) {
        // Puzzle solved
        setStatus("solved");
        
        // Calculate Elo change (simplified)
        const puzzleRating = puzzle.rating || 1500;
        const expectedScore = 1 / (1 + Math.pow(10, (puzzleRating - elo) / 400));
        const ratingChange = Math.round(32 * (1 - expectedScore));
        saveElo(elo + Math.max(1, ratingChange));
        
      } else {
        // Play opponent's move
        setMoveIndex(moveIndex + 1);
        setStatus("loading"); // temp disable interaction
        
        setTimeout(() => {
          const nextMove = puzzle.solution[moveIndex + 1];
          try {
            chess.move(uciToObj(nextMove));
            setPosition(chess.fen());
            setMoveIndex(moveIndex + 2);
            setStatus("playing");
            
            if (moveIndex + 2 === puzzle.solution.length) {
              setStatus("solved");
              const puzzleRating = puzzle.rating || 1500;
              const expectedScore = 1 / (1 + Math.pow(10, (puzzleRating - elo) / 400));
              const ratingChange = Math.round(32 * (1 - expectedScore));
              saveElo(elo + Math.max(1, ratingChange));
            }
          } catch (e) {
            console.error("Opponent move failed", e);
          }
        }, 500);
      }
      return true;
    } else {
      // Failed!
      chess.undo(); // undo incorrect move
      setStatus("failed");
      
      // Calculate Elo penalty
      const puzzleRating = puzzle.rating || 1500;
      const expectedScore = 1 / (1 + Math.pow(10, (puzzleRating - elo) / 400));
      const ratingChange = Math.round(32 * (0 - expectedScore));
      saveElo(Math.max(100, elo + Math.min(-1, ratingChange)));
      
      return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <Link href="/puzzles" className="text-[#81b64c] hover:text-[#9fcc6b] flex items-center gap-2">
          ← Back
        </Link>
        <div className="bg-[#1a1a1f] border border-[#2a2a30] px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
          <span className="text-[#a0a0a8] text-sm font-semibold uppercase tracking-wide">Puzzle Rating</span>
          <span className="text-white font-bold text-xl">{elo}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 w-full max-w-[600px] mx-auto">
          <div className="aspect-square relative shadow-elevated rounded-xl overflow-hidden border border-[#2a2a30]">
            <Board 
              position={position}
              boardOrientation={orientation}
              onPieceDrop={handlePieceDrop}
              onSquareClick={handleSquareClick}
              arePiecesDraggable={status === "playing"}
              customSquareStyles={{
                ...(moveFrom ? { [moveFrom]: { backgroundColor: "rgba(129, 182, 76, 0.5)" } } : {}),
                ...(hintSquare ? { [hintSquare]: { backgroundColor: "rgba(255, 170, 0, 0.5)" } } : {})
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-6 shadow-elevated flex-1 flex flex-col justify-center">
            
            <div className="text-center mb-6">
              {status === "playing" && (
                <div className="text-white text-lg font-medium">Find the best move</div>
              )}
              {status === "solved" && (
                <div className="text-[#81b64c] text-xl font-bold flex flex-col items-center gap-2">
                  <span className="text-4xl">✅</span>
                  Solved!
                </div>
              )}
              {status === "failed" && (
                <div className="text-[#ca3431] text-xl font-bold flex flex-col items-center gap-2">
                  <span className="text-4xl">❌</span>
                  Incorrect
                </div>
              )}
              {status === "loading" && (
                <div className="text-[#a0a0a8] animate-pulse">Wait...</div>
              )}
            </div>

            {puzzle && (
              <div className="bg-[#1a1a1f] border border-[#2a2a30] p-4 rounded-lg mb-6 text-center">
                <div className="text-xs text-[#a0a0a8] uppercase tracking-wider mb-1">Puzzle Difficulty</div>
                <div className="text-white font-semibold text-lg">{puzzle.rating || 1500} Elo</div>
                {puzzle.themes && puzzle.themes.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-3">
                    {puzzle.themes.map(t => (
                      <span key={t} className="text-xs bg-[#2a2a30] text-[#a0a0a8] px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-auto">
              {status === "playing" && (
                <button 
                  onClick={handleHint}
                  className="w-full bg-[#2a2a30] hover:bg-[#32323a] text-white py-3 rounded-lg font-medium transition-colors border border-[#3f3f46]"
                >
                  💡 Get a Hint
                </button>
              )}
              
              {(status === "solved" || status === "failed") && (
                <button 
                  onClick={loadNextPuzzle}
                  className="w-full bg-[#81b64c] hover:bg-[#9fcc6b] text-white py-3 rounded-lg font-bold transition-colors shadow-lg"
                >
                  Next Puzzle →
                </button>
              )}
            </div>
            
          </div>
          
          <div className="mt-auto">
            <AdSlot />
          </div>
        </div>
      </div>
    </div>
  );
}
