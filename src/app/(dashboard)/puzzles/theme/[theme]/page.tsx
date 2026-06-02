"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Board from "@/components/chess/Board";
import { Chess } from "chess.js";
import AdSlot from "@/components/ui/AdSlot";
import { getRandomPuzzle, PuzzleData } from "@/lib/chess/puzzles-db";

export default function ThemePuzzlePage() {
  const params = useParams();
  const themeParam = decodeURIComponent(params.theme as string);
  
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [position, setPosition] = useState<string>("start");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [status, setStatus] = useState<"loading" | "playing" | "solved" | "failed" | "not_found">("loading");
  const [moveIndex, setMoveIndex] = useState(0);
  
  const chessRef = useRef(new Chess());

  const loadNewPuzzle = () => {
    setStatus("loading");
    setMoveIndex(0);
    
    // Slight timeout for UI transition
    setTimeout(() => {
      const p = getRandomPuzzle(themeParam);
      if (!p) {
        setStatus("not_found");
        return;
      }
      
      const chess = new Chess();
      chess.load(p.fen);
      
      chessRef.current = chess;
      setPosition(chess.fen());
      setOrientation(chess.turn() === "w" ? "white" : "black");
      setPuzzle(p);
      setStatus("playing");
    }, 300);
  };

  useEffect(() => {
    loadNewPuzzle();
  }, [themeParam]);

  // Helper to convert UCI (e.g. e2e4) to chess.js object
  const uciToObj = (uci: string) => ({
    from: uci.substring(0, 2),
    to: uci.substring(2, 4),
    promotion: uci[4] ? uci[4] : undefined
  });

  // When puzzle starts, if there is a solution, the opponent plays the first move
  useEffect(() => {
    if (puzzle && status === "playing" && moveIndex === 0) {
      const firstMove = puzzle.solution[0];
      const chess = chessRef.current;
      setTimeout(() => {
        try {
          chess.move(uciToObj(firstMove));
          setPosition(chess.fen());
          setMoveIndex(1);
        } catch (err) {
          console.error("Failed to play puzzle's first move:", err);
        }
      }, 500);
    }
  }, [puzzle, status, moveIndex]);

  const handlePieceDrop = (source: string, target: string, piece: string) => {
    if (status !== "playing" || moveIndex % 2 === 0) return false;

    const chess = chessRef.current;
    const promotion = piece[1].toLowerCase();
    
    // Try to make the move
    const moveStr = source + target + (promotion === "p" ? "" : promotion);
    const expectedMove = puzzle!.solution[moveIndex];
    
    if (moveStr === expectedMove) {
      // Correct move
      try {
        chess.move(uciToObj(expectedMove));
      } catch (err) {
        console.error("Failed to make correct move:", err);
      }
      setPosition(chess.fen());
      setMoveIndex(prev => prev + 1);
      
      // Check if puzzle solved
      if (moveIndex + 1 === puzzle!.solution.length) {
        setStatus("solved");
      } else {
        // Play opponent's next move
        setTimeout(() => {
          const nextMove = puzzle!.solution[moveIndex + 1];
          try {
            chess.move(uciToObj(nextMove));
            setPosition(chess.fen());
            setMoveIndex(prev => prev + 1);
            
            if (moveIndex + 2 === puzzle!.solution.length) {
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
          promotion: promotion === "p" ? undefined : promotion,
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
      const chess = new Chess();
      chess.load(puzzle.fen);
      chessRef.current = chess;
      setPosition(chess.fen());
      setOrientation(chess.turn() === "w" ? "white" : "black");
      setStatus("playing");
      setMoveIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 capitalize">{themeParam} Puzzles</h1>
          <p className="text-[#a0a0a8] text-sm">Practice specific tactics and patterns.</p>
        </div>
        <Link href="/puzzles" className="text-[#81b64c] hover:text-[#9fcc6b] font-medium text-sm">
          ← Back to Puzzles
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 max-w-[600px] w-full mx-auto">
          <div className="aspect-square relative shadow-elevated rounded-xl overflow-hidden">
            <Board 
              position={position}
              boardOrientation={orientation}
              onPieceDrop={handlePieceDrop}
              arePiecesDraggable={status === "playing" && moveIndex % 2 !== 0}
            />
          </div>
        </div>
        
        <div className="w-full lg:w-[320px] flex flex-col gap-4">
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-5 shadow-elevated">
            {status === "loading" && (
              <div className="text-center text-[#a0a0a8] py-8">Loading puzzle...</div>
            )}
            
            {status === "not_found" && (
              <div className="text-center text-[#a0a0a8] py-8">
                No puzzles found for this theme. Check back later!
              </div>
            )}
            
            {status === "playing" && puzzle && (
              <div className="text-center py-4">
                <div className="text-xl font-bold text-white mb-2">Find the best move</div>
                <div className="text-[#a0a0a8]">
                  {orientation === "white" ? "Black" : "White"} just played. Your turn!
                </div>
              </div>
            )}
            
            {status === "solved" && (
              <div className="text-center py-4">
                <div className="text-4xl mb-4">🏆</div>
                <div className="text-xl font-bold text-[#81b64c] mb-2">Puzzle Solved!</div>
                <div className="text-[#a0a0a8] mb-6">Excellent calculation!</div>
                <button 
                  onClick={loadNewPuzzle}
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
              </div>
            )}
          </div>
          
          <AdSlot slot="theme-puzzle-sidebar" />
        </div>
      </div>
    </div>
  );
}
