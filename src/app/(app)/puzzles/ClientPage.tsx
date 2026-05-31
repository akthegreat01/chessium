"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard), { ssr: false });
import { Puzzle } from "@/lib/puzzles/data";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { useBoardTheme } from "@/components/chess/ThemeContext";
import { useChessGame } from "@/hooks/useChessGame";
import { Chess } from "chess.js";

export default function PuzzleClient({ puzzle }: { puzzle: Puzzle }) {
  const { boardTheme } = useBoardTheme();
  
  // Custom hook to handle game logic cleanly
  const { fen, makeMove, loadFen, resetGame } = useChessGame(puzzle.fen);
  
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<"playing" | "incorrect" | "solved">("playing");

  // Determine whose turn it is visually
  const [playerColor, setPlayerColor] = useState<"White" | "Black">("White");

  useEffect(() => {
    try {
      const g = new Chess(puzzle.fen);
      setPlayerColor(g.turn() === 'w' ? "White" : "Black");
      // Reset game on puzzle change
      loadFen(puzzle.fen);
      setMoveIndex(0);
      setStatus("playing");
    } catch (e) {
      console.error(e);
    }
  }, [puzzle.fen, loadFen]);

  useEffect(() => {
    // If it's the opponent's turn (odd index), auto-play their move
    if (status === "playing" && moveIndex < puzzle.moves.length) {
      if (moveIndex % 2 !== 0) {
        const timeout = setTimeout(() => {
          const moveString = puzzle.moves[moveIndex];
          // Determine from and to from SAN is tricky without the game instance
          // We can use the loaded `game` from hook, but the easiest way is to load the move directly via chess.js
          const g = new Chess(fen);
          const m = g.move(moveString);
          if (m) {
            makeMove({ from: m.from, to: m.to, promotion: m.promotion || 'q' });
            setMoveIndex(prev => prev + 1);
          }
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [moveIndex, status, fen, puzzle.moves, makeMove]);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (status !== "playing") return false;
    if (moveIndex % 2 !== 0) return false; // Not player's turn

    // First create a temporary game to check what the move's SAN would be
    const tempGame = new Chess(fen);
    try {
      const moveResult = tempGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      });

      if (moveResult) {
        if (moveResult.san === puzzle.moves[moveIndex]) {
          makeMove({ from: sourceSquare, to: targetSquare, promotion: "q" });
          
          if (moveIndex + 1 === puzzle.moves.length) {
            setStatus("solved");
            triggerConfetti();
          } else {
            setMoveIndex(m => m + 1);
          }
          return true;
        } else {
          setStatus("incorrect");
          return false;
        }
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const retry = () => {
    loadFen(puzzle.fen);
    setMoveIndex(0);
    setStatus("playing");
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F8FAFC', '#22C55E']
    });
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-12 lg:gap-16 items-center lg:items-start justify-center min-h-[calc(100vh-100px)] pt-12 lg:pt-16">
      
      {/* Board Layout identical to PlayVsAI logic */}
      <div className="flex flex-col w-full max-w-[75vh] flex-1 bg-surface border border-border rounded-[24px] overflow-hidden relative shrink-0 shadow-2xl">
        <div className="w-full bg-surface px-5 py-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-foreground">Puzzle Board</h2>
          </div>
        </div>

        <div className="w-full aspect-square relative bg-background/50">
          <div className="w-full h-full absolute inset-0">
            {/* @ts-ignore */}
            <Chessboard 
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={playerColor === "White" ? "white" : "black"}
              customDarkSquareStyle={boardTheme.darkSquareStyle}
              customLightSquareStyle={boardTheme.lightSquareStyle}
              animationDuration={300}
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-[420px] flex flex-col gap-6">
        <div className="bg-surface border border-border p-8 rounded-[32px] shadow-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Daily Puzzle</h1>
          <div className="flex gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/5 text-secondary-foreground px-2 py-1 rounded">
              Rating: {puzzle.rating}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
              {puzzle.theme}
            </span>
          </div>

          <p className="text-lg font-medium mb-8 text-foreground">
            Find the best move for {playerColor}.
          </p>

          {status === "playing" && (
            <div className="p-4 bg-background/50 rounded-xl text-center text-secondary-foreground font-medium border border-border">
              Make your move on the board.
            </div>
          )}

          {status === "incorrect" && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center flex flex-col items-center">
              <XCircle className="w-8 h-8 text-destructive mb-2" />
              <div className="text-destructive font-bold mb-4">Incorrect Move</div>
              <Button onClick={retry} variant="outline" className="rounded-full w-full border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive">
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
            </div>
          )}

          {status === "solved" && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-center flex flex-col items-center">
              <CheckCircle2 className="w-10 h-10 text-success mb-2" />
              <div className="text-success font-bold text-xl mb-1">Puzzle Solved!</div>
              <p className="text-success/80 text-sm mb-4">You found the winning sequence.</p>
              <div className="w-full bg-background p-3 rounded-lg text-sm font-mono text-center mb-4 text-foreground border border-success/20">
                {puzzle.moves.join(" → ")}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
