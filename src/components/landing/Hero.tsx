"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

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

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
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
          <a
            href="/signup"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#81b64c] hover:bg-[#9fcc6b] transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(129,182,76,0.3)] min-w-[200px]"
          >
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
          <a
            href="/analysis"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white border border-[#2a2a30] hover:border-[#3a3a42] hover:bg-[#1a1a1f] transition-all duration-300 min-w-[200px]"
          >
            Analyze a Game
          </a>
        </motion.div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="relative rounded-2xl border border-[#2a2a30] overflow-hidden shadow-elevated bg-[#111113]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2a2a30] bg-[#0a0a0b]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-lg bg-[#141416] text-xs text-[#6b6b75] font-mono">
                  chessium.com/analysis
                </div>
              </div>
            </div>

            {/* Analysis UI Mockup */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
              {/* Board Area */}
              <div className="space-y-4">
                {/* Mini chess board */}
                <div className="aspect-square max-w-[360px] mx-auto grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden border border-[#2a2a30]">
                  {Array.from({ length: 64 }, (_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isLight = (row + col) % 2 === 0;
                    return (
                      <div
                        key={i}
                        className={`${
                          isLight ? "bg-[#ebecd0]" : "bg-[#739552]"
                        } flex items-center justify-center text-sm sm:text-lg`}
                      >
                        {/* Show some pieces on starting position */}
                        {row === 0 &&
                          [
                            "♜",
                            "♞",
                            "♝",
                            "♛",
                            "♚",
                            "♝",
                            "♞",
                            "♜",
                          ][col]}
                        {row === 1 && "♟"}
                        {row === 6 && "♙"}
                        {row === 7 &&
                          [
                            "♖",
                            "♘",
                            "♗",
                            "♕",
                            "♔",
                            "♗",
                            "♘",
                            "♖",
                          ][col]}
                      </div>
                    );
                  })}
                </div>

                {/* Eval Graph Mockup */}
                <div className="h-16 rounded-lg bg-[#0a0a0b] border border-[#2a2a30] overflow-hidden relative">
                  <svg
                    viewBox="0 0 200 40"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="evalGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#81b64c"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#81b64c"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,20 Q10,18 20,16 T40,14 T60,12 T80,15 T100,10 T120,8 T140,12 T160,6 T180,10 T200,5"
                      fill="none"
                      stroke="#81b64c"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M0,20 Q10,18 20,16 T40,14 T60,12 T80,15 T100,10 T120,8 T140,12 T160,6 T180,10 T200,5 L200,20 L0,20 Z"
                      fill="url(#evalGrad)"
                    />
                    <line
                      x1="0"
                      y1="20"
                      x2="200"
                      y2="20"
                      stroke="#2a2a30"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Side Panel Mockup */}
              <div className="space-y-4 hidden md:block">
                {/* Accuracy */}
                <div className="p-4 rounded-xl bg-[#0a0a0b] border border-[#2a2a30]">
                  <div className="text-xs text-[#6b6b75] mb-3 uppercase tracking-wider">
                    Accuracy
                  </div>
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        94.2
                      </div>
                      <div className="text-xs text-[#a0a0a8]">White</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#a0a0a8]">
                        87.6
                      </div>
                      <div className="text-xs text-[#a0a0a8]">Black</div>
                    </div>
                  </div>
                </div>

                {/* Moves */}
                <div className="p-4 rounded-xl bg-[#0a0a0b] border border-[#2a2a30]">
                  <div className="text-xs text-[#6b6b75] mb-3 uppercase tracking-wider">
                    Moves
                  </div>
                  <div className="space-y-1.5 text-sm font-mono">
                    {[
                      { n: "1.", w: "e4", wc: "best", b: "e5", bc: "best" },
                      {
                        n: "2.",
                        w: "Nf3",
                        wc: "best",
                        b: "Nc6",
                        bc: "best",
                      },
                      {
                        n: "3.",
                        w: "Bb5",
                        wc: "excellent",
                        b: "a6",
                        bc: "good",
                      },
                      {
                        n: "4.",
                        w: "Ba4",
                        wc: "best",
                        b: "Nf6",
                        bc: "best",
                      },
                    ].map((move) => (
                      <div
                        key={move.n}
                        className="flex items-center gap-2 py-0.5"
                      >
                        <span className="text-[#6b6b75] w-6">{move.n}</span>
                        <span className="flex items-center gap-1 w-16">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              move.wc === "best"
                                ? "bg-[#81b64c]"
                                : move.wc === "excellent"
                                ? "bg-[#96bc4b]"
                                : "bg-[#96bc4b]"
                            }`}
                          />
                          {move.w}
                        </span>
                        <span className="flex items-center gap-1 w-16">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              move.bc === "best"
                                ? "bg-[#81b64c]"
                                : move.bc === "good"
                                ? "bg-[#96bc4b]"
                                : "bg-[#f7c631]"
                            }`}
                          />
                          {move.b}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engine Suggestion */}
                <div className="p-4 rounded-xl bg-[#0a0a0b] border border-[#2a2a30]">
                  <div className="text-xs text-[#6b6b75] mb-3 uppercase tracking-wider">
                    Engine (Depth 22)
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#81b64c]/20 text-[#81b64c] text-xs font-bold">
                        +0.3
                      </span>
                      <span className="text-[#a0a0a8] font-mono">
                        O-O Bd6 d3 O-O
                      </span>
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
