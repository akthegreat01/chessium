"use client";

import React, { useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Puzzle } from "@/lib/puzzles/data";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { useBoardTheme } from "@/components/chess/ThemeContext";

export default function PuzzleClient({ puzzle }: { puzzle: Puzzle }) {
  const { boardTheme } = useBoardTheme();
  const [game, setGame] = useState(new Chess(puzzle.fen));
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<"playing" | "incorrect" | "solved">("playing");

  useEffect(() => {
    // Check if the current move belongs to the opponent
    if (status === "playing" && moveIndex < puzzle.moves.length) {
      // If we just started, check if the engine needs to make the first move
      // Actually, standard puzzles start with the player's move. 
      // We will assume the first move is ALWAYS the player's move.
      // Wait, if moveIndex is odd, it's the opponent's turn.
      if (moveIndex % 2 !== 0) {
        setTimeout(() => {
          const gameCopy = new Chess(game.fen());
          gameCopy.move(puzzle.moves[moveIndex]);
          setGame(gameCopy);
          setMoveIndex(m => m + 1);
        }, 500);
      }
    }
  }, [moveIndex, status, game, puzzle.moves]);

  const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    if (status !== "playing") return false;
    if (moveIndex % 2 !== 0) return false; // Opponent's turn

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      });

      if (move) {
        // Verify move
        if (move.san === puzzle.moves[moveIndex]) {
          setGame(gameCopy);
          
          if (moveIndex + 1 === puzzle.moves.length) {
            setStatus("solved");
            triggerConfetti();
          } else {
            setMoveIndex(m => m + 1);
          }
          return true;
        } else {
          // Incorrect move
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
    setGame(new Chess(puzzle.fen));
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

  const playerColor = new Chess(puzzle.fen).turn() === 'w' ? "White" : "Black";

  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-12 lg:gap-16 items-center lg:items-start justify-center min-h-[calc(100vh-100px)] pt-12 lg:pt-16">
      
      <div className="w-full max-w-[650px] bg-surface/40 backdrop-blur-xl rounded-[32px] p-4 sm:p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/10 shrink-0">
        <div className="w-full aspect-square relative rounded-[16px] overflow-hidden border border-white/5 shadow-inner bg-background/50">
          <div className="w-full h-full absolute inset-0">
            {/* @ts-ignore */}
            <Chessboard 
              position={game.fen()}
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
        <div className="bg-surface/50 backdrop-blur-md border border-white/10 p-8 rounded-[32px] shadow-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Puzzle</h1>
          <div className="flex gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded">
              Rating: {puzzle.rating}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
              {puzzle.theme}
            </span>
          </div>

          <p className="text-lg font-medium mb-8">
            Find the best move for {playerColor}.
          </p>

          {status === "playing" && (
            <div className="p-4 bg-white/5 rounded-xl text-center text-secondary-foreground font-medium">
              Make your move on the board.
            </div>
          )}

          {status === "incorrect" && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center flex flex-col items-center">
              <XCircle className="w-8 h-8 text-destructive mb-2" />
              <div className="text-destructive font-bold mb-4">Incorrect Move</div>
              <Button onClick={retry} variant="outline" className="rounded-full w-full border-white/10 hover:bg-white/5">
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
            </div>
          )}

          {status === "solved" && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-center flex flex-col items-center">
              <CheckCircle2 className="w-10 h-10 text-success mb-2" />
              <div className="text-success font-bold text-xl mb-1">Puzzle Solved!</div>
              <p className="text-success/80 text-sm mb-4">You found the winning sequence.</p>
              <div className="w-full bg-white/5 p-3 rounded-lg text-sm font-mono text-center mb-4">
                {puzzle.moves.join(" → ")}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
