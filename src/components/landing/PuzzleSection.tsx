"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Flame, Timer, Trophy, CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import confetti from 'canvas-confetti';
import { playMoveSound } from '@/lib/sounds';

const PUZZLES = [
  { 
    id: 1, 
    title: "Kasparov's Immortal Move", 
    difficulty: "Expert", 
    fen: "b2r3r/k4p1p/p2q1np1/NppP4/3p1Q2/P4PPB/1PP4P/1K1RR3 w - - 1 24", 
    sequence: ["Rxd4", "cxd4", "Re7+", "Kb6", "Qxd4+", "Kxa5", "b4+", "Ka4", "Qc3"], 
    hint: "A rook sacrifice that ignores the queen and starts an immortal king hunt", 
    rating: 2800, 
    orientation: "white" 
  },
  { 
    id: 2, 
    title: "The Gold Coins Game", 
    difficulty: "Expert", 
    fen: "5rk1/pp4pp/4p3/2R3Q1/3n4/2q4r/P1P2PPP/5RK1 b - - 1 23", 
    sequence: ["Qg3", "Qxg3", "Ne2+", "Kh1", "Nxg3#"], 
    hint: "The move that caused the audience to shower the board with gold coins", 
    rating: 2600, 
    orientation: "black" 
  },
  { 
    id: 3, 
    title: "Game of the Century", 
    difficulty: "Hard", 
    fen: "r3r1k1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3R1K1R b - - 3 17", 
    sequence: ["Be6", "Bxb6", "Bxc4+", "Kg1", "Ne2+", "Kf1", "Nxd4+", "Kg1", "Ne2+", "Kf1", "Nc3+", "Kg1", "axb6"], 
    hint: "A 13-year-old Fischer gives up his queen for a decisive windmill attack", 
    rating: 2400, 
    orientation: "black" 
  },
  { 
    id: 4, 
    title: "The Magician's Sacrifice", 
    difficulty: "Hard", 
    fen: "rqb2rk1/3nbppp/p2pp3/6P1/1p1BPP2/2NB1Q2/PPP4P/2KR3R w - - 0 16", 
    sequence: ["Nd5", "exd5", "exd5+", "Kd8", "Bb6+"], 
    hint: "Mikhail Tal sacrifices a knight for long-term initiative and attacking geometry", 
    rating: 2300, 
    orientation: "white" 
  },
];

export default function PuzzleSection() {
  const [game, setGame] = useState(new Chess(PUZZLES[0].fen));
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [hintStage, setHintStage] = useState(0); // 0: none, 1: square, 2: move
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(true);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  const XP_PER_PUZZLE = 100;
  const XP_FOR_NEXT_LEVEL = 500;
  const currentLevel = Math.floor(xp / XP_FOR_NEXT_LEVEL) + 1;
  const levelProgress = (xp % XP_FOR_NEXT_LEVEL) / XP_FOR_NEXT_LEVEL * 100;

  useEffect(() => {
    if (!running || solved) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [running, solved]);

  const puzzle = PUZZLES[currentPuzzle];

  const playOpponentMove = useCallback((currentGame: Chess, nextIdx: number) => {
    if (nextIdx >= puzzle.sequence.length) {
      setSolved(true);
      setStreak(s => s + 1);
      setRunning(false);
      return;
    }

    setTimeout(() => {
      const gameCopy = new Chess(currentGame.fen());
      const move = gameCopy.move(puzzle.sequence[nextIdx]);
      if (move) {
        setGame(gameCopy);
        setMoveIndex(nextIdx + 1);
        
        // Play appropriate sound
        if (move.captured) playMoveSound('capture');
        else if (move.san.includes('+')) playMoveSound('check');
        else playMoveSound('move');

        if (nextIdx + 1 >= puzzle.sequence.length) {
          handleSuccess();
        }
      }
    }, 600);
  }, [puzzle.sequence]);

  const handleSuccess = () => {
    setSolved(true);
    setStreak(s => s + 1);
    setXp(prev => prev + XP_PER_PUZZLE);
    setRunning(false);
    playMoveSound('correct');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#ffffff', '#a8882a']
    });
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (solved || moveIndex % 2 !== 0) return false;
    
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (!move) return false;

      const cleanSolution = puzzle.sequence[moveIndex].replace(/[!+#]/g, '').toLowerCase();
      const cleanMoveSan = move.san.replace(/[!+#]/g, '').toLowerCase();

      if (cleanMoveSan === cleanSolution) {
        setGame(gameCopy);
        setError(false);
        const nextIdx = moveIndex + 1;
        setMoveIndex(nextIdx);
        
        // Play appropriate sound
        if (move.captured) playMoveSound('capture');
        else if (move.san.includes('+')) playMoveSound('check');
        else playMoveSound('move');

        if (nextIdx >= puzzle.sequence.length) {
          handleSuccess();
        } else {
          playOpponentMove(gameCopy, nextIdx);
        }
        return true;
      } else {
        setError(true);
        playMoveSound('wrong');
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
    setMoveIndex(0);
    setSolved(false);
    setError(false);
    setHintStage(0);
    setTimer(0);
    setRunning(true);
  };

  const resetPuzzle = () => {
    setGame(new Chess(puzzle.fen));
    setMoveIndex(0);
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
                    boardOrientation: (puzzle.orientation || 'white') as 'white' | 'black',
                    allowDragging: !solved,
                    onPieceDrop: ({ sourceSquare, targetSquare }) => {
                      if (!targetSquare) return false;
                      return onDrop(sourceSquare, targetSquare);
                    },
                    boardStyle: {
                      borderRadius: '4px',
                    },
                    squareStyles: hintStage >= 1 && !solved && moveIndex % 2 === 0 ? (() => {
                      try {
                        const gameCopy = new Chess(game.fen());
                        const moves = gameCopy.moves({ verbose: true });
                        const cleanSolution = puzzle.sequence[moveIndex].replace(/[!+#]/g, '').toLowerCase();
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
                  {/* XP Bar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Tactical Rank: Bronze II</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Level {currentLevel} • {xp % XP_FOR_NEXT_LEVEL}/{XP_FOR_NEXT_LEVEL} XP</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        className="h-full bg-gradient-to-r from-[#d4af37] to-[#e8c84a] shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                      />
                    </div>
                  </div>

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
                          <p className="text-white font-bold">Excellent vision! You've successfully played through the key moves.</p>
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
                  {hintStage >= 2 && !solved && moveIndex % 2 === 0 && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/15 mb-4">
                      <span className="text-blue-300 text-sm font-bold uppercase tracking-widest">The move is: {puzzle.sequence[moveIndex]}</span>
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
