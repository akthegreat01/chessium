"use client";

import React, { useState, useEffect } from "react";
import Board from "@/components/chess/Board";
import { Chess } from "chess.js";
import { motion, AnimatePresence } from "motion/react";
import { getAnyRandomPuzzle, PuzzleData } from "@/lib/chess/puzzles-db";
import Link from "next/link";
import AdSlot from "@/components/ui/AdSlot";

export default function PuzzleSurvivalPage() {
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  
  const [chess] = useState(new Chess());
  const [position, setPosition] = useState("empty");
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<"playing" | "success" | "failed" | "gameover">("playing");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [moveFrom, setMoveFrom] = useState<string | null>(null);

  // Load a new puzzle
  const loadNextPuzzle = () => {
    const nextPuzzle = getAnyRandomPuzzle();
    if (nextPuzzle) {
      setPuzzle(nextPuzzle);
      chess.load(nextPuzzle.fen);
      setPosition(chess.fen());
      setMoveIndex(0);
      setStatus("playing");
      setOrientation(chess.turn() === 'w' ? 'white' : 'black');
      setMoveFrom(null);
    }
  };

  // Initialize
  useEffect(() => {
    loadNextPuzzle();
  }, [chess]);

  const handleRestart = () => {
    setLives(3);
    setStreak(0);
    loadNextPuzzle();
  };

  const handleSquareClick = (square: string) => {
    if (status !== "playing" || !puzzle) return;

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
    
    // Check if clicked square is same as moveFrom, then deselect
    if (square === moveFrom) {
      setMoveFrom(null);
      return;
    }
    
    handlePieceDrop(moveFrom, square, pieceStr);
    setMoveFrom(null);
  };

  const handlePieceDrop = (source: string, target: string, piece: string) => {
    if (status !== "playing" || !puzzle || moveIndex % 2 !== 0) return false;

    // Check if the move is the correct one in the sequence
    const expectedMove = puzzle.solution[moveIndex];
    const moveStr = `${source}${target}`;
    
    // Only consider promotion if it's a pawn reaching the back rank
    const isPawn = piece[1]?.toLowerCase() === "p";
    const isBackRank = target[1] === "8" || target[1] === "1";
    const promotion = (isPawn && isBackRank) ? "q" : undefined;
    const moveStrWithProm = promotion ? `${source}${target}${promotion}` : moveStr;

    // We must validate using chess.js
    let moveObj;
    try {
      moveObj = chess.move({
        from: source,
        to: target,
        promotion: promotion
      });
    } catch {
      return false; // Invalid move
    }

    if (!moveObj) return false;

    if (moveObj.lan === expectedMove || moveStrWithProm === expectedMove) {
      // Correct move
      setPosition(chess.fen());
      const nextIndex = moveIndex + 1;
      
      if (nextIndex >= puzzle.solution.length) {
        // Solved
        setStatus("success");
        setStreak(s => {
          const newStreak = s + 1;
          if (newStreak > bestStreak) setBestStreak(newStreak);
          return newStreak;
        });
        setTimeout(loadNextPuzzle, 1500);
      } else {
        // Opponent's turn
        setMoveIndex(nextIndex);
        setTimeout(() => {
          const opponentMove = puzzle.solution[nextIndex];
          chess.move({
            from: opponentMove.substring(0, 2),
            to: opponentMove.substring(2, 4),
            promotion: opponentMove.length > 4 ? opponentMove[4] : undefined
          });
          setPosition(chess.fen());
          setMoveIndex(nextIndex + 1);
        }, 500);
      }
      return true;
    } else {
      // Wrong move
      chess.undo(); // take back the move
      
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setStatus("gameover");
      } else {
        setStatus("failed");
        setTimeout(() => {
          setStatus("playing");
          // Optionally reset puzzle or let them try again. Let's let them try again.
        }, 1000);
      }
      return false;
    }
  };

  if (!puzzle) return null;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Left side: Board */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <Link href="/puzzles" className="text-[#81b64c] hover:text-[#9fcc6b] font-medium flex items-center gap-2">
            ← Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[#a0a0a8] uppercase text-xs font-bold tracking-wider">Lives</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i}
                  animate={lives >= i ? { scale: [1, 1.2, 1], color: '#ca3431' } : { scale: 1, color: '#2a2a30' }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl"
                >
                  {lives >= i ? '❤️' : '🖤'}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className={`aspect-square w-full shadow-elevated rounded-xl overflow-hidden border ${status === 'failed' ? 'border-[#ca3431] shadow-[0_0_30px_rgba(202,52,49,0.3)]' : status === 'success' ? 'border-[#81b64c] shadow-[0_0_30px_rgba(129,182,76,0.3)]' : 'border-[#2a2a30]'} transition-all duration-300 relative`}>
          <Board 
            position={position}
            onPieceDrop={handlePieceDrop}
            onSquareClick={handleSquareClick}
            boardOrientation={orientation}
            arePiecesDraggable={status === 'playing' && moveIndex % 2 === 0}
            customSquareStyles={
              moveFrom 
                ? { [moveFrom]: { backgroundColor: "rgba(129, 182, 76, 0.5)" } }
                : {}
            }
          />
          
          <AnimatePresence>
            {status === "gameover" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10"
              >
                <div className="text-6xl mb-4">💀</div>
                <h2 className="text-4xl font-black text-white mb-2">Game Over</h2>
                <p className="text-[#a0a0a8] mb-6">You survived {streak} puzzles.</p>
                <button 
                  onClick={handleRestart}
                  className="px-8 py-4 bg-[#81b64c] hover:bg-[#9fcc6b] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(129,182,76,0.2)]"
                >
                  Try Again
                </button>
              </motion.div>
            )}
            
            {status === "success" && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                <div className="bg-[#81b64c] text-white font-black text-4xl px-8 py-4 rounded-2xl shadow-2xl rotate-12">
                  CORRECT!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex justify-between items-center px-4 py-3 bg-[#141416] border border-[#2a2a30] rounded-xl text-[#a0a0a8] text-sm font-semibold">
          <div>Theme: {puzzle.themes.join(", ")}</div>
          <div>Rating: {puzzle.rating}</div>
        </div>
      </div>

      {/* Right side: Stats */}
      <div className="w-full lg:w-[350px] flex flex-col gap-6">
        <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-8 shadow-elevated text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#81b64c] to-transparent"></div>
          <h2 className="text-2xl font-extrabold text-white mb-2 uppercase tracking-tight">Survival Streak</h2>
          
          <motion.div 
            key={streak}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#81b64c] to-[#9fcc6b] my-6"
          >
            {streak}
          </motion.div>
          
          <div className="text-[#a0a0a8] font-medium flex items-center gap-2 bg-[#1a1a1f] px-4 py-2 rounded-lg border border-[#2a2a30]">
            Best Streak: <span className="text-white font-bold">{bestStreak}</span>
          </div>
        </div>

        <AdSlot format="square" />
      </div>

    </div>
  );
}
