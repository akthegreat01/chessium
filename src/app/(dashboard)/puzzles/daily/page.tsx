"use client";

import { useEffect, useState, useRef } from "react";
import Board from "@/components/chess/Board";
import { Chess } from "chess.js";
import AdSlot from "@/components/ui/AdSlot";
import Link from "next/link";

export default function DailyPuzzlePage() {
  const [puzzle, setPuzzle] = useState<any>(null);
  const [position, setPosition] = useState<string>("empty");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [status, setStatus] = useState<"loading" | "playing" | "solved" | "failed">("loading");
  const [moveIndex, setMoveIndex] = useState(0);
  
  const chessRef = useRef(new Chess());

  useEffect(() => {
    fetch("/api/puzzle/daily")
      .then(res => res.json())
      .then(data => {
        const chess = new Chess();
        
        if (data.puzzle && data.puzzle.fen) {
          try {
            chess.load(data.puzzle.fen);
          } catch(e) {
            console.error("Failed to load puzzle FEN", e);
          }
        }
        
        chessRef.current = chess;
        setPosition(chess.fen());
        setOrientation(chess.turn() === "w" ? "white" : "black");
        
        setPuzzle(data.puzzle);
        setStatus("playing");
        setMoveIndex(0); // The user starts at move index 0 (even indexes are user moves)
      })
      .catch(console.error);
  }, []);

  // Helper to convert UCI (e.g. e2e4) to chess.js object
  const uciToObj = (uci: string) => ({
    from: uci.substring(0, 2),
    to: uci.substring(2, 4),
    promotion: uci[4] ? uci[4] : undefined
  });

  const handlePieceDrop = (source: string, target: string, piece: string) => {
    if (status !== "playing" || !puzzle || moveIndex % 2 !== 0) return false;

    const chess = chessRef.current;
    
    // Only consider promotion if it's a pawn reaching the back rank
    const isPawn = piece[1]?.toLowerCase() === "p";
    const isBackRank = target[1] === "8" || target[1] === "1";
    const promotion = (isPawn && isBackRank) ? "q" : undefined;
    
    // Build UCI string: source + target + optional promotion letter
    const moveStr = source + target + (promotion || "");
    const expectedMove = puzzle.solution[moveIndex];
    
    if (moveStr === expectedMove) {
      // Correct move
      try {
        chess.move(uciToObj(expectedMove));
      } catch (err) {
        console.error("Failed to make correct move:", err);
        return false;
      }
      setPosition(chess.fen());
      
      const nextIndex = moveIndex + 1;
      setMoveIndex(nextIndex);
      
      // Check if puzzle solved
      if (nextIndex === puzzle.solution.length) {
        setStatus("solved");
      } else {
        // Play opponent's next reply
        setTimeout(() => {
          const opponentMove = puzzle.solution[nextIndex];
          try {
            chess.move(uciToObj(opponentMove));
            setPosition(chess.fen());
            setMoveIndex(nextIndex + 1);
            
            if (nextIndex + 1 === puzzle.solution.length) {
              setStatus("solved");
            }
          } catch (err) {
            console.error("Failed to make opponent's next move:", err);
          }
        }, 500);
      }
      return true;
    } else {
      // Wrong move
      try {
        const testMove = chess.move({
          from: source,
          to: target,
          promotion: promotion,
        });
        
        if (testMove) {
          setPosition(chess.fen());
          setStatus("failed");
          return true; // Visually update the board but show failed state
        }
      } catch (e) {
        return false;
      }
      return false;
    }
  };

  const handleRetry = () => {
    if (puzzle) {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Daily Puzzle</h1>
        <Link href="/puzzles" className="text-[#81b64c] hover:text-[#9fcc6b] font-medium text-sm">
          ← Back to Puzzles
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 max-w-[600px] w-full mx-auto">
          <div className="aspect-square relative shadow-elevated rounded-lg overflow-hidden">
            <Board 
              position={position}
              boardOrientation={orientation}
              onPieceDrop={handlePieceDrop}
              arePiecesDraggable={status === "playing" && moveIndex % 2 === 0}
            />
          </div>
        </div>
        
        <div className="w-full lg:w-[320px] flex flex-col gap-4">
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-5 shadow-elevated">
            {status === "loading" && (
              <div className="text-center text-[#a0a0a8] py-8">Loading puzzle...</div>
            )}
            
            {status === "playing" && (
              <div className="text-center py-4">
                <div className="text-xl font-bold text-white mb-2">Find the best move</div>
                <div className="text-[#a0a0a8]">
                  {orientation === "white" ? "White" : "Black"} to play. Find the winning continuation!
                </div>
              </div>
            )}
            
            {status === "solved" && (
              <div className="text-center py-4">
                <div className="text-4xl mb-4">🏆</div>
                <div className="text-xl font-bold text-[#81b64c] mb-2">Puzzle Solved!</div>
                <div className="text-[#a0a0a8] mb-6">Excellent calculation!</div>
                <button 
                  className="w-full bg-[#81b64c] hover:bg-[#9fcc6b] text-white py-3 rounded-xl font-bold transition-colors"
                >
                  Next Puzzle
                </button>
              </div>
            )}
            
            {status === "failed" && (
              <div className="text-center py-4">
                <div className="text-4xl mb-4">❌</div>
                <div className="text-xl font-bold text-[#ca3431] mb-2">Incorrect Move</div>
                <div className="text-[#a0a0a8] mb-6">That is not the best continuation.</div>
                <button 
                  onClick={handleRetry}
                  className="w-full bg-[#2a2a30] hover:bg-[#3a3a42] text-white py-3 rounded-xl font-bold transition-colors"
                >
                  Retry Puzzle
                </button>
              </div>
            )}
            
            {puzzle && (
              <div className="mt-4 pt-4 border-t border-[#2a2a30]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0a8]">Rating</span>
                  <span className="font-bold text-white">{puzzle.rating}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-[#a0a0a8]">Themes</span>
                  <span className="font-medium text-[#81b64c]">{puzzle.themes.slice(0,2).join(', ')}</span>
                </div>
              </div>
            )}
          </div>
          
          <AdSlot slot="daily-puzzle-sidebar" />
        </div>
      </div>
    </div>
  );
}
