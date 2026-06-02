"use client";

import React, { useState, useEffect } from "react";
import Board from "@/components/chess/Board";
import { Chess } from "chess.js";
import { motion, AnimatePresence } from "motion/react";
import AdSlot from "@/components/ui/AdSlot";

const GAMES = [
  { id: 1, white: "Anonymous", black: "Anonymous", realElo: 1200, pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d5 9. exd5 Nxd5 10. Qb3 Na5 11. Qa4+ Nc6 12. Qb3" },
  { id: 2, white: "Anonymous", black: "Anonymous", realElo: 600, pgn: "1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7#" },
  { id: 3, white: "Anonymous", black: "Anonymous", realElo: 2800, pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4 Qc7 12. Nbd2 cxd4 13. cxd4 Bb7 14. Nf1 Rac8 15. Bd3 d5 16. exd5 exd4 17. Bg5 Nxd5 18. Bxe7 Nxe7 19. Bxh7+ Kxh7 20. Ng5+ Kg6 21. Qg4 f5 22. Qh4 Rh8 23. Re6#" },
  { id: 4, white: "Anonymous", black: "Anonymous", realElo: 850, pgn: "1. d4 d5 2. c4 dxc4 3. e3 e6 4. Bxc4 Nf6 5. Nf3 Bb4+ 6. Bd2 Bxd2+ 7. Nbxd2 O-O 8. O-O b6 9. Rc1 Bb7 10. Qe2 Nbd7 11. e4 c5 12. e5 Nd5 13. Ne4 cxd4 14. Nd6 Rb8 15. Nxd4 Nxe5 16. Qxe5" },
  { id: 5, white: "Anonymous", black: "Anonymous", realElo: 1800, pgn: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 h6 11. Bh4 g5 12. fxg5 Ne5 13. Qe2 Nfg4 14. Nf3 hxg5 15. Bg3 Bd7 16. h3 Nxf3 17. gxf3 Ne5 18. f4 gxf4 19. Bxf4 O-O-O" },
  { id: 6, white: "Anonymous", black: "Anonymous", realElo: 400, pgn: "1. e4 f5 2. exf5 e6 3. Qh5+ g6 4. fxg6 hxg6 5. Qxh8" },
  { id: 7, white: "Anonymous", black: "Anonymous", realElo: 1450, pgn: "1. d4 Nf6 2. Bf4 g6 3. Nc3 Bg7 4. e4 d6 5. Qd2 O-O 6. O-O-O a6 7. Bh6 b5 8. f3 Nbd7 9. h4 c5 10. dxc5 Nxc5 11. h5 b4 12. Nd5 Nxd5 13. Bxg7 Kxg7 14. exd5 b3 15. hxg6 fxg6 16. Qh6+ Kf6 17. axb3" },
  { id: 8, white: "Anonymous", black: "Anonymous", realElo: 2100, pgn: "1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. g3 Bb4+ 5. Bd2 Be7 6. Bg2 O-O 7. O-O c6 8. Qc2 Nbd7 9. Rd1 b6 10. b3 Ba6 11. a4 Rc8 12. Na3 Ne4 13. Be1 f5 14. Qb2 Bf6 15. Rac1 c5 16. cxd5 exd5 17. Nb5 Bxb5 18. axb5 Qe7" },
  { id: 9, white: "Anonymous", black: "Anonymous", realElo: 950, pgn: "1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Bc4 h6 5. c3 dxc3 6. Nxc3 Nf6 7. O-O d6 8. Qb3 Qd7 9. e5 Nxe5 10. Nxe5 dxe5 11. Rd1 Qe7 12. Bxf7+ Qxf7 13. Rd8+ Ke7 14. Qd1" },
  { id: 10, white: "Anonymous", black: "Anonymous", realElo: 1600, pgn: "1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 Nc6 6. Bg5 Be6 7. c5 Ne4 8. Nxe4 dxe4 9. Be3 g6 10. Qa4 Bg7 11. Rd1 O-O 12. Bc4 Bxc4 13. Qxc4 Qa5+ 14. Bd2 Qd8 15. Bc3 e6 16. Ne2 Qg5 17. O-O Rad8" },
  { id: 11, white: "Anonymous", black: "Anonymous", realElo: 2400, pgn: "1. Nf3 Nf6 2. c4 g6 3. g3 Bg7 4. Bg2 O-O 5. O-O d6 6. Nc3 e5 7. d3 Nc6 8. Rb1 a5 9. a3 h6 10. b4 axb4 11. axb4 Be6 12. b5 Ne7 13. Nd2 Qc8 14. Re1 Nd7 15. Bb2 Nc5 16. Nb3 Na4 17. Nxa4 Rxa4 18. Nd4 Ra2" },
  { id: 12, white: "Anonymous", black: "Anonymous", realElo: 700, pgn: "1. e4 e5 2. Nf3 Qf6 3. Bc4 h6 4. d4 d6 5. dxe5 dxe5 6. Qd5 Nd7 7. Nc3 c6 8. Qd1 b5 9. Bb3 Nc5 10. Be3 Bg4 11. h3 Rd8 12. Qe2 Bxf3 13. gxf3" },
  { id: 13, white: "Anonymous", black: "Anonymous", realElo: 1100, pgn: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Bd7 10. O-O-O Rc8 11. Bb3 Ne5 12. Kb1 Re8 13. g4 b5 14. g5 Nh5" },
  { id: 14, white: "Anonymous", black: "Anonymous", realElo: 1950, pgn: "1. d4 Nf6 2. Bg5 Ne4 3. Bf4 d5 4. e3 c5 5. Bd3 Nf6 6. c3 Nc6 7. Nd2 Bg4 8. Ngf3 e6 9. Qa4 Bxf3 10. Nxf3 Bd6 11. Bxd6 Qxd6 12. O-O O-O 13. dxc5 Qxc5 14. e4 a6 15. exd5 Nxd5" },
  { id: 15, white: "Anonymous", black: "Anonymous", realElo: 550, pgn: "1. e4 e5 2. f4 exf4 3. Nf3 h6 4. d4 g5 5. h3 f6 6. Bc4 Ne7 7. Nc3 Bg7 8. Ne5 d5 9. Qh5+ Ng6 10. Qxg6+ Ke7 11. Qf7+ Kd6 12. Qxd5+ Ke7 13. Qf7+ Kd6 14. Nb5#" }
];

export default function GuessTheEloPage() {
  const [gameIndex, setGameIndex] = useState(0);
  const [fens, setFens] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [guess, setGuess] = useState<number | "">("");
  const [hasGuessed, setHasGuessed] = useState(false);
  const [score, setScore] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentGame = GAMES[gameIndex];

  useEffect(() => {
    const chess = new Chess();
    const fenArray: string[] = [];
    
    // Always add starting position
    fenArray.push(chess.fen());

    // Safely parse PGN and build FEN array
    try {
      chess.loadPgn(currentGame.pgn);
      const history = chess.history();
      
      // Reset and play moves to collect FENs
      chess.reset();
      for (const move of history) {
        chess.move(move);
        fenArray.push(chess.fen());
      }
    } catch (e) {
      console.error("Invalid PGN", e);
    }

    setFens(fenArray);
    setMoveIndex(0);
    setHasGuessed(false);
    setGuess("");
    setIsAutoPlaying(false);
  }, [gameIndex, currentGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && moveIndex < fens.length - 1) {
      interval = setInterval(() => {
        setMoveIndex(m => {
          if (m + 1 >= fens.length - 1) {
            setIsAutoPlaying(false);
            return fens.length - 1;
          }
          return m + 1;
        });
      }, 1000);
    } else if (moveIndex >= fens.length - 1) {
      setIsAutoPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, moveIndex, fens.length]);

  const handleNextMove = () => {
    if (moveIndex < fens.length - 1) {
      setMoveIndex(m => m + 1);
    }
  };

  const handlePrevMove = () => {
    if (moveIndex > 0) {
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
          <div className="text-sm text-[#a0a0a8]">{moveIndex} / {fens.length > 0 ? fens.length - 1 : 0} Moves</div>
        </div>

        <div className="aspect-square w-full shadow-elevated rounded-xl overflow-hidden border border-[#2a2a30]">
          <Board 
            position={fens[moveIndex] || "8/8/8/8/8/8/8/8 w - - 0 1"}
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
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={moveIndex === fens.length - 1}
            className={`flex-1 py-3 font-bold rounded-xl transition-colors ${
              isAutoPlaying 
                ? 'bg-[#ca3431] hover:bg-[#a62b29] text-white border-transparent' 
                : 'bg-[#81b64c] hover:bg-[#9fcc6b] text-white border-transparent'
            }`}
          >
            {isAutoPlaying ? "Stop Auto" : "▶ Auto Play"}
          </button>

          <button 
            onClick={handleNextMove}
            disabled={moveIndex === fens.length - 1}
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
