"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Flame, Timer, Trophy, CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const PUZZLES = [
  { id: 1, title: "Find the Brilliant Move", difficulty: "Hard", fen: "4rr1k/1pp3pp/p1pb4/5p2/3P4/2P1BP1q/PP1N1Q2/R3R1K1 w - - 0 24", solution: "Rxg7+!", hint: "A devastating rook sacrifice opens lines", rating: 2200 },
  { id: 2, title: "Underpromotion Tactic", difficulty: "Expert", fen: "8/P5pk/7p/8/8/8/6PK/1q6 w - - 0 1", solution: "a8=N+!", hint: "A queen isn't always the answer", rating: 2400 },
  { id: 3, title: "Deflection Sacrifice", difficulty: "Medium", fen: "r1b1k2r/ppq2ppp/2n1p3/3pP3/3P4/5N2/PP1QBPPP/R4RK1 w kq - 3 13", solution: "h4!", hint: "AlphaZero style pawn push to disrupt coordination", rating: 1800 },
];

export default function PuzzleSection() {
  const [game, setGame] = useState(new Chess(PUZZLES[0].fen));
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [hintStage, setHintStage] = useState(0); // 0: none, 1: square, 2: move
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!running || solved) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [running, solved]);

  const puzzle = PUZZLES[currentPuzzle];

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (solved) return false;
    
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to queen for simplicity in puzzles
      });

      if (!move) return false;

      // Clean the solution string for comparison (remove !, +, #)
      const cleanSolution = puzzle.solution.replace(/[!+#]/g, '').toLowerCase();
      const cleanMoveSan = move.san.replace(/[!+#]/g, '').toLowerCase();

      if (cleanMoveSan === cleanSolution) {
        setGame(gameCopy);
        setSolved(true);
        setError(false);
        setStreak(s => s + 1);
        setRunning(false);
        return true;
      } else {
        setError(true);
        setTimeout(() => setError(false), 1000);
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  const nextPuzzle = () => {
    const nextIdx = (currentPuzzle + 1) % PUZZLES.length;
    setCurrentPuzzle(nextIdx);
    setGame(new Chess(PUZZLES[nextIdx].fen));
    setSolved(false);
    setError(false);
    setHintStage(0);
    setTimer(0);
    setRunning(true);
  };

  const resetPuzzle = () => {
    setGame(new Chess(puzzle.fen));
    setSolved(false);
    setError(false);
    setHintStage(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden" id="daily-puzzle">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)' }} />

      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
            <Trophy className="w-3 h-3" /> Daily Challenge
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Sharpen Your <span className="text-gradient-gold">Tactical Vision</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Solve puzzles daily to build your streak and earn XP. Can you find the winning move?
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="glass-panel-gold p-6 md:p-8 rounded-2xl">
            {/* Puzzle header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-white font-black text-lg">{puzzle.title}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  puzzle.difficulty === 'Expert' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  puzzle.difficulty === 'Hard' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>{puzzle.difficulty}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-mono font-bold text-white tabular-nums">{formatTime(timer)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 fill-current" />
                  <span className="text-sm font-black text-orange-400">{streak}</span>
                </div>
              </div>
            </div>

            {/* Puzzle board area */}
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-[400px] aspect-square rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white/5 relative group shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                <div className={`absolute inset-0 z-20 pointer-events-none transition-colors duration-300 ${error ? 'bg-red-500/20' : solved ? 'bg-green-500/10' : ''}`} />
                <Chessboard 
                  options={{
                    id: "puzzle-board",
                    position: game.fen(),
                    boardOrientation: 'white',
                    allowDragging: !solved,
                    onPieceDrop: ({ sourceSquare, targetSquare }) => {
                      if (!targetSquare) return false;
                      return onDrop(sourceSquare, targetSquare);
                    },
                    boardStyle: {
                      borderRadius: '4px',
                    },
                    squareStyles: hintStage >= 1 && !solved ? (() => {
                      try {
                        const gameCopy = new Chess(game.fen());
                        const moves = gameCopy.moves({ verbose: true });
                        const cleanSolution = puzzle.solution.replace(/[!+#]/g, '').toLowerCase();
                        const correctMove = moves.find(m => m.san.replace(/[!+#]/g, '').toLowerCase() === cleanSolution);
                        if (correctMove) {
                          return { [correctMove.from]: { backgroundColor: 'rgba(212, 175, 55, 0.4)', borderRadius: '4px' } };
                        }
                      } catch (e) {}
                      return {};
                    })() : {}
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                    <span className="font-bold">Rating: {puzzle.rating}</span>
                    <span>•</span>
                    <span>Puzzle #{puzzle.id}</span>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-white text-lg font-medium mb-2">Your turn to move</p>
                    <p className="text-gray-400 text-sm leading-relaxed">Find the winning continuation by dragging pieces on the board.</p>
                  </div>

                  {/* Result feedback */}
                  {solved && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-emerald-400 font-black uppercase tracking-widest text-xs">Puzzle Solved</p>
                          <p className="text-white font-bold">Excellent vision! {puzzle.solution}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300 font-bold text-sm">That's not the right move. Try again!</span>
                    </motion.div>
                  )}

                  {/* Hint Stage 1: Text Hint */}
                  {hintStage >= 1 && !solved && (
                    <div className="px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/15 mb-4">
                      <span className="text-amber-300 text-sm">💡 {puzzle.hint}</span>
                    </div>
                  )}

                  {/* Hint Stage 2: Move Reveal */}
                  {hintStage >= 2 && !solved && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/15 mb-4">
                      <span className="text-blue-300 text-sm font-bold uppercase tracking-widest">The move is: {puzzle.solution}</span>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-auto">
                  <button onClick={resetPuzzle} disabled={solved} className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-0">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                  <button 
                    onClick={() => setHintStage(prev => Math.min(prev + 1, 2))} 
                    disabled={hintStage >= 2 || solved} 
                    className="text-xs font-bold text-gray-500 hover:text-white transition-colors disabled:opacity-30"
                  >
                    {hintStage === 0 ? 'Need a hint?' : hintStage === 1 ? 'Show me the move' : 'Move revealed'}
                  </button>
                  {solved && (
                    <button onClick={nextPuzzle} className="ml-auto bg-[#d4af37] hover:bg-[#b8962d] text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                      Next Challenge <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
