"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Zap, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const DEMO_MOVES = [
  { move: '1. e4', eval: '+0.3', cls: 'move-best' },
  { move: '1... e5', eval: '+0.3', cls: 'move-best' },
  { move: '2. Nf3', eval: '+0.4', cls: 'move-best' },
  { move: '2... Nc6', eval: '+0.3', cls: 'move-best' },
  { move: '3. Bb5', eval: '+0.5', cls: 'move-excellent' },
  { move: '3... a6', eval: '+0.4', cls: 'move-good' },
  { move: '4. Ba4', eval: '+0.5', cls: 'move-best' },
  { move: '4... Nf6', eval: '+0.3', cls: 'move-best' },
];

export default function AnalyzerPreview() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Section divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)' }} />
      
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
            <Zap className="w-3 h-3" /> Powered by Stockfish NNUE
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Professional-Grade{' '}
            <span className="text-gradient-gold">Analysis</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Import your games from Chess.com or Lichess, or paste any PGN. Get instant move-by-move 
            analysis with the world&#39;s strongest chess engine running entirely in your browser.
          </p>
        </motion.div>

        {/* Analyzer Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel-gold p-1 md:p-1.5 rounded-2xl relative group"
        >
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 40%, rgba(59,130,246,0.03) 100%)' }} />
          
          <div className="relative rounded-xl overflow-hidden bg-[#0c0c0f] p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Mini Chessboard Visual */}
              <div className="w-full md:w-[320px] flex-shrink-0">
                <div className="aspect-square rounded-lg overflow-hidden border border-white/10 relative" style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.6)' }}>
                  {/* 8x8 grid */}
                  <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isLight = (row + col) % 2 === 0;
                      return (
                        <div key={i} className="relative" style={{ background: isLight ? '#b8a47c' : '#7a6a50' }}>
                          {/* Starting position pieces */}
                          {row === 0 && <span className="absolute inset-0 flex items-center justify-center text-[min(3vw,1.5rem)] select-none">{['♜','♞','♝','♛','♚','♝','♞','♜'][col]}</span>}
                          {row === 1 && <span className="absolute inset-0 flex items-center justify-center text-[min(3vw,1.5rem)] select-none">♟</span>}
                          {row === 6 && <span className="absolute inset-0 flex items-center justify-center text-[min(3vw,1.5rem)] select-none">♙</span>}
                          {row === 7 && <span className="absolute inset-0 flex items-center justify-center text-[min(3vw,1.5rem)] select-none">{['♖','♘','♗','♕','♔','♗','♘','♖'][col]}</span>}
                        </div>
                      );
                    })}
                  </div>
                  {/* Eval bar */}
                  <div className="absolute top-0 right-0 w-4 h-full bg-gray-800 border-l border-white/10">
                    <div className="absolute bottom-0 w-full bg-white transition-all duration-1000" style={{ height: '54%' }} />
                  </div>
                </div>
              </div>

              {/* Analysis Panel Preview */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-black tracking-widest uppercase text-gray-400">Engine Analysis</span>
                  <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] font-black text-emerald-400">Depth 32</span>
                  </div>
                </div>
                
                {/* Demo move list */}
                <div className="space-y-1.5 mb-6">
                  {DEMO_MOVES.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                      <span className={`text-sm font-bold ${m.cls}`}>{m.move}</span>
                      <span className="ml-auto text-xs font-mono text-gray-500">{m.eval}</span>
                    </div>
                  ))}
                </div>

                {/* Features list */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Move Classification', icon: '💎' },
                    { label: 'Accuracy Score', icon: '🎯' },
                    { label: 'Opening Explorer', icon: '📖' },
                    { label: 'Mistake Training', icon: '🧩' },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-sm">{f.icon}</span>
                      <span className="text-[11px] font-bold text-gray-400">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <Link href="/analysis" className="btn-gold-outline px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 group">
            Open Analysis Board <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
