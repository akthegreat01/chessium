"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const PIECES = ["♔", "♕", "♖", "♗", "♘", "♙", "♚", "♛", "♜", "♝", "♞", "♟"];

interface FloatingPiece {
  id: number;
  piece: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function Hero() {
  const [pieces, setPieces] = useState<FloatingPiece[]>([]);

  useEffect(() => {
    const generated: FloatingPiece[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      piece: PIECES[Math.floor(Math.random() * PIECES.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 40,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
      opacity: 0.03 + Math.random() * 0.06,
    }));
    setPieces(generated);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Silver Edge Gradients */}
      <div className="absolute inset-y-0 left-0 w-[20vw] bg-gradient-to-r from-gray-300/10 to-transparent pointer-events-none opacity-50 mix-blend-screen" />
      <div className="absolute inset-y-0 right-0 w-[20vw] bg-gradient-to-l from-gray-300/10 to-transparent pointer-events-none opacity-50 mix-blend-screen" />

      {/* Floating chess pieces */}
      <div className="absolute inset-0 pointer-events-none">
        {pieces.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-white select-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -30, 0, 20, 0],
              x: [0, 15, -10, 5, 0],
              rotate: [0, 5, -5, 3, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          >
            {p.piece}
          </motion.div>
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#81b64c] opacity-[0.04] blur-[120px]" />

      {/* Huge Static Rook on the Left */}
      <div className="absolute left-[-15%] top-[10%] w-[55vw] max-w-[800px] aspect-square pointer-events-none z-0 hidden md:block">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Silver/White ambient glow behind the rook */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-300/15 via-gray-500/5 to-transparent blur-[100px] rounded-full scale-110" />
          
          <img 
            src="/logo.png" 
            alt="Chessium Giant Rook" 
            className="relative z-10 w-full h-full object-contain drop-shadow-[15px_15px_40px_rgba(0,0,0,0.8)]"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-20">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#81b64c] animate-pulse-glow" />
          <span className="text-sm text-[#a0a0a8]">
            Powered by Stockfish 18 — Free forever
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          Improve Your Chess
          <br />
          <span className="text-[#81b64c] text-glow-accent">Faster.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl text-[#a0a0a8] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Analyze games, solve puzzles, learn from courses, and master chess
          with powerful tools — all{" "}
          <span className="text-white font-medium">completely free</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/signup" passHref legacyBehavior>
            <a className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#81b64c] hover:bg-[#9fcc6b] transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(129,182,76,0.3)] min-w-[200px]">
              <span className="flex items-center gap-2">
                Start Free
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </a>
          </Link>
          <Link href="/analysis" passHref legacyBehavior>
            <a className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white border border-[#2a2a30] hover:border-[#3a3a42] hover:bg-[#1a1a1f] transition-all duration-300 min-w-[200px]">
              Analyze a Game
            </a>
          </Link>
        </motion.div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl border border-[#2a2a30] overflow-hidden shadow-2xl bg-[#0d0d0e]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2a2a30] bg-[#0a0a0b]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1.5 rounded-full bg-[#141416] text-xs text-[#6b6b75] font-mono tracking-wide">
                  chessium.in/analysis
                </div>
              </div>
            </div>

            {/* Premium UI Mockup */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 bg-[#0d0d0e]">
              
              {/* Left Column: Board & Eval Graph */}
              <div className="flex flex-col gap-6">
                
                {/* Board */}
                <div className="aspect-square w-full max-w-[460px] mx-auto grid grid-cols-8 grid-rows-8 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                  {Array.from({ length: 64 }, (_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isLight = (row + col) % 2 === 0;
                    
                    // Simple piece representation for the mock
                    let piece = null;
                    if (row === 0) piece = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"][col];
                    if (row === 1) piece = "♟";
                    if (row === 6) piece = "♙";
                    if (row === 7) piece = ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"][col];

                    return (
                      <div
                        key={i}
                        className={`${
                          isLight ? "bg-[#ebecd0]" : "bg-[#739552]"
                        } flex items-center justify-center text-2xl sm:text-4xl text-white opacity-90`}
                        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                      >
                        {piece}
                      </div>
                    );
                  })}
                </div>

                {/* Eval Graph */}
                <div className="h-16 w-full max-w-[460px] mx-auto rounded-xl bg-[#141416] border border-[#2a2a30] overflow-hidden relative shadow-inner">
                  <svg viewBox="0 0 400 40" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="evalGradHero" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#81b64c" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#81b64c" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,25 Q40,20 80,22 T160,25 T240,15 T320,22 T400,10 L400,40 L0,40 Z"
                      fill="url(#evalGradHero)"
                    />
                    <path
                      d="M0,25 Q40,20 80,22 T160,25 T240,15 T320,22 T400,10"
                      fill="none"
                      stroke="#81b64c"
                      strokeWidth="2"
                      style={{ filter: "drop-shadow(0 0 4px rgba(129,182,76,0.6))" }}
                    />
                    <line x1="0" y1="20" x2="400" y2="20" stroke="#2a2a30" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Right Column: Panels */}
              <div className="flex flex-col gap-6 hidden md:flex">
                
                {/* Accuracy */}
                <div className="p-6 rounded-2xl bg-[#0a0a0b] border border-[#2a2a30] flex flex-col justify-between">
                  <div className="text-xs text-[#6b6b75] uppercase tracking-widest text-center mb-6 font-medium">
                    Accuracy
                  </div>
                  <div className="flex justify-between items-center px-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white tracking-tight mb-1">94.2</div>
                      <div className="text-sm text-[#81b64c] font-medium">White</div>
                    </div>
                    <div className="w-px h-12 bg-[#2a2a30]"></div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#a0a0a8] tracking-tight mb-1">87.6</div>
                      <div className="text-sm text-[#6b6b75] font-medium">Black</div>
                    </div>
                  </div>
                </div>

                {/* Moves */}
                <div className="p-6 rounded-2xl bg-[#0a0a0b] border border-[#2a2a30] flex-1">
                  <div className="text-xs text-[#6b6b75] uppercase tracking-widest text-center mb-6 font-medium">
                    Moves
                  </div>
                  <div className="space-y-4 text-sm font-mono pl-4">
                    {[
                      { n: "1.", w: "e4", b: "e5" },
                      { n: "2.", w: "Nf3", b: "Nc6" },
                      { n: "3.", w: "Bb5", b: "a6" },
                      { n: "4.", w: "Ba4", b: "Nf6" },
                    ].map((move) => (
                      <div key={move.n} className="flex items-center gap-6">
                        <span className="text-[#6b6b75] w-6">{move.n}</span>
                        <div className="flex items-center gap-2 w-20">
                          <span className="w-2 h-2 rounded-full bg-[#81b64c] shadow-[0_0_8px_rgba(129,182,76,0.8)]" />
                          <span className="text-white">{move.w}</span>
                        </div>
                        <div className="flex items-center gap-2 w-20">
                          <span className="w-2 h-2 rounded-full bg-[#81b64c] shadow-[0_0_8px_rgba(129,182,76,0.8)]" />
                          <span className="text-white">{move.b}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engine Depth */}
                <div className="p-5 rounded-2xl bg-[#0a0a0b] border border-[#2a2a30]">
                  <div className="text-xs text-[#6b6b75] uppercase tracking-widest text-center mb-4 font-medium">
                    Engine (Depth 22)
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="px-2 py-1 rounded bg-[#81b64c]/20 text-[#81b64c] text-sm font-bold border border-[#81b64c]/30">
                      +0.3
                    </div>
                    <div className="text-[#a0a0a8] font-mono text-sm tracking-wide">
                      O-O Bd6 d3 O-O
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Glow behind mockup */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-[#81b64c] opacity-[0.06] blur-[80px] rounded-full" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[#6b6b75]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-[#2a2a30] flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-[#81b64c]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
