"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Flame, Timer, Trophy, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const PUZZLES = [
  { id: 1, title: "Find the Brilliant Move", difficulty: "Hard", fen: "After 23...Qxf2+", solution: "Rxg7+!", hint: "A devastating rook sacrifice opens lines", rating: 2200 },
  { id: 2, title: "Underpromotion Tactic", difficulty: "Expert", fen: "White to play and win", solution: "e8=N+!", hint: "A queen isn't always the answer", rating: 2400 },
  { id: 3, title: "Deflection Sacrifice", difficulty: "Medium", fen: "Black to move", solution: "Bxh2+!", hint: "The bishop draws the king away", rating: 1800 },
];

export default function PuzzleSection() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(true);
  const [streak, setStreak] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    if (!running || solved) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [running, solved]);

  const puzzle = PUZZLES[currentPuzzle];

  const checkAnswer = useCallback(() => {
    if (userAnswer.trim().toLowerCase() === puzzle.solution.toLowerCase().replace('!', '').replace('+', '')) {
      setSolved(true);
      setStreak(s => s + 1);
      setRunning(false);
    }
  }, [userAnswer, puzzle.solution]);

  const nextPuzzle = () => {
    setCurrentPuzzle((currentPuzzle + 1) % PUZZLES.length);
    setSolved(false);
    setShowHint(false);
    setTimer(0);
    setRunning(true);
    setUserAnswer('');
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
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[280px] aspect-square rounded-lg overflow-hidden flex-shrink-0 border border-white/10 relative" style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.5)' }}>
                <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isLight = (row + col) % 2 === 0;
                    return <div key={i} style={{ background: isLight ? '#b8a47c' : '#7a6a50' }} />;
                  })}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-6xl">♞</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-3 py-2 text-center">
                  <span className="text-[11px] font-bold text-gray-300">{puzzle.fen}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                    <span className="font-bold">Rating: {puzzle.rating}</span>
                    <span>•</span>
                    <span>Puzzle #{puzzle.id}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">Find the strongest continuation. Enter your answer in algebraic notation.</p>

                  {/* Answer input */}
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                      placeholder="e.g. Rxg7+"
                      className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm font-mono focus:border-[#d4af37]/40 focus:outline-none transition-colors"
                      disabled={solved}
                    />
                    <button onClick={checkAnswer} disabled={solved || !userAnswer} className="btn-primary px-5 py-2.5 rounded-lg text-sm font-bold disabled:opacity-40">
                      Submit
                    </button>
                  </div>

                  {/* Result feedback */}
                  {solved && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold text-sm">Correct! The answer is {puzzle.solution}</span>
                    </motion.div>
                  )}

                  {/* Hint */}
                  {showHint && !solved && (
                    <div className="px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/15 mb-4">
                      <span className="text-amber-300 text-sm">💡 {puzzle.hint}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => setShowHint(true)} disabled={showHint || solved} className="text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-30">
                    Show Hint
                  </button>
                  {solved && (
                    <button onClick={nextPuzzle} className="ml-auto btn-gold-outline px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      Next Puzzle <ChevronRight className="w-3 h-3" />
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
