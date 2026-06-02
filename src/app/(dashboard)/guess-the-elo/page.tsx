"use client";

import React, { useState, useEffect } from "react";
import Board from "@/components/chess/Board";
import { Chess } from "chess.js";
import { motion, AnimatePresence } from "motion/react";
import AdSlot from "@/components/ui/AdSlot";

// Sample games for the minigame
const GAMES = [
  {
    id: 1,
    white: "Anonymous",
    black: "Anonymous",
    realElo: 600,
    pgn: "1. e4 e5 2. Bc4 Bc5 3. Qh5 Nf6 4. Qxf7#"
  },
  {
    id: 2,
    white: "Anonymous",
    black: "Anonymous",
    realElo: 1400,
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4 Qc7 12. Nbd2 cxd4 13. cxd4 Bb7 14. Nf1"
  },
  {
    id: 3,
    white: "Anonymous",
    black: "Anonymous",
    realElo: 2200,
    pgn: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. Ne1 Nd7 10. f3 f5 11. g4"
  }
];

export default function GuessTheEloPage() {
  const [gameIndex, setGameIndex] = useState(0);
  const [chess] = useState(new Chess());
  const [position, setPosition] = useState(chess.fen());
  const [moveIndex, setMoveIndex] = useState(0);
  const [moves, setMoves] = useState<string[]>([]);
  const [guess, setGuess] = useState<number | "">("");
  const [hasGuessed, setHasGuessed] = useState(false);
  const [score, setScore] = useState(0);

  const currentGame = GAMES[gameIndex];

  useEffect(() => {
    chess.reset();
    chess.loadPgn(currentGame.pgn);
    const history = chess.history();
    setMoves(history);
    chess.reset();
    setPosition(chess.fen());
    setMoveIndex(0);
    setHasGuessed(false);
    setGuess("");
  }, [gameIndex, chess, currentGame]);

  const handleNextMove = () => {
    if (moveIndex < moves.length) {
      chess.move(moves[moveIndex]);
      setPosition(chess.fen());
      setMoveIndex(m => m + 1);
    }
  };

  const handlePrevMove = () => {
    if (moveIndex > 0) {
      chess.undo();
      setPosition(chess.fen());
      setMoveIndex(m => m - 1);
    }
  };

  const handleGuess = () => {
    if (typeof guess !== 'number') return;
    setHasGuessed(true);
    
    // Calculate score based on proximity
    const diff = Math.abs(guess - currentGame.realElo);
    let points = 0;
    if (diff === 0) points = 1000;
    else if (diff <= 100) points = 500;
    else if (diff <= 300) points = 200;
    else if (diff <= 600) points = 50;
    
    setScore(s => s + points);
  };

  const handleNextGame = () => {
    setGameIndex(i => (i + 1) % GAMES.length);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Left side: Board */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center px-4 py-3 bg-[#141416] border border-[#2a2a30] rounded-xl shadow-elevated">
          <div className="font-bold text-white">Anonymous Match</div>
          <div className="text-sm text-[#a0a0a8]">{moveIndex} / {moves.length} Moves</div>
        </div>

        <div className="aspect-square w-full shadow-elevated rounded-xl overflow-hidden border border-[#2a2a30]">
          <Board 
            position={position}
            arePiecesDraggable={false}
          />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handlePrevMove}
            disabled={moveIndex === 0}
            className="flex-1 py-3 bg-[#1a1a1f] hover:bg-[#2a2a30] disabled:opacity-50 text-white font-bold rounded-xl border border-[#2a2a30] transition-colors"
          >
            ← Prev
          </button>
          <button 
            onClick={handleNextMove}
            disabled={moveIndex === moves.length}
            className="flex-1 py-3 bg-[#1a1a1f] hover:bg-[#2a2a30] disabled:opacity-50 text-white font-bold rounded-xl border border-[#2a2a30] transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Right side: Guessing UI */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Guess the Elo</h1>
          <p className="text-[#a0a0a8] text-sm mb-6">
            Watch the game unfold and guess the average rating of the players. The closer you are, the more points you get!
          </p>

          <div className="text-4xl font-bold text-[#81b64c] mb-8">
            {score} pts
          </div>

          {!hasGuessed ? (
            <div className="space-y-4">
              <div>
                <input 
                  type="range" 
                  min="100" 
                  max="3000" 
                  step="50"
                  value={guess || 1500}
                  onChange={(e) => setGuess(Number(e.target.value))}
                  className="w-full accent-[#81b64c]"
                />
                <div className="text-2xl font-bold text-white mt-4">
                  {guess || "---"}
                </div>
              </div>
              
              <button 
                onClick={handleGuess}
                disabled={guess === ""}
                className="w-full py-4 bg-[#81b64c] hover:bg-[#9fcc6b] disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(129,182,76,0.2)] transition-all"
              >
                Lock in Guess
              </button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div>
                  <div className="text-[#a0a0a8] text-sm uppercase font-bold tracking-wider mb-1">Actual Elo</div>
                  <div className="text-5xl font-black text-white">{currentGame.realElo}</div>
                </div>

                <div className={`p-4 rounded-xl border ${Math.abs((guess as number) - currentGame.realElo) <= 100 ? 'bg-[#81b64c]/10 border-[#81b64c] text-[#81b64c]' : 'bg-[#ca3431]/10 border-[#ca3431] text-[#ca3431]'}`}>
                  You guessed <strong>{guess}</strong> (Off by {Math.abs((guess as number) - currentGame.realElo)})
                </div>

                <button 
                  onClick={handleNextGame}
                  className="w-full py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all"
                >
                  Next Game
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <AdSlot format="square" />
      </div>

    </div>
  );
}
