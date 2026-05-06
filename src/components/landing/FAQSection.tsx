"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "What is underpromotion in chess?",
    a: "Underpromotion is when a pawn reaches the opposite end of the board and is promoted to a piece other than a queen — such as a knight, rook, or bishop. While promoting to a queen is usually strongest, there are rare tactical situations where underpromotion is the only winning move, often involving knight forks or avoiding stalemate."
  },
  {
    q: "Why is underpromotion so rare?",
    a: "Underpromotion occurs in roughly 1 in 5,000 games. Since a queen is the most powerful piece, promoting to anything else is almost always suboptimal. The rare exceptions occur when a knight delivers a unique fork or checkmate, when a queen promotion would cause stalemate, or in specific endgame positions requiring precise piece coordination."
  },
  {
    q: "Is Underpromotion free to use?",
    a: "Yes, Underpromotion is 100% free. All analysis runs locally in your browser using Stockfish NNUE WebAssembly — there are no server costs, no subscriptions, and no premium tiers. The engine runs at grandmaster strength (3600+ ELO) with zero latency."
  },
  {
    q: "How does the chess engine analysis work?",
    a: "Underpromotion uses Stockfish 16.1 compiled to WebAssembly (WASM), which runs entirely in your browser. This means your games never leave your device — all computation is local and private. The engine evaluates positions at configurable depth, classifying each move as Brilliant, Best, Excellent, Good, Inaccuracy, Mistake, or Blunder."
  },
  {
    q: "Can beginners use this platform?",
    a: "Absolutely! Underpromotion is designed for players of all levels. Beginners can use the analysis board to review their games, learn from mistakes with the Mistake Trainer, and explore openings with the Opening Explorer. The move classification system helps you understand exactly where you went wrong and what the best move was."
  },
  {
    q: "How do I import my games for analysis?",
    a: "You can import games in three ways: (1) Enter your Chess.com or Lichess username to fetch your recent games automatically, (2) Paste a PGN (Portable Game Notation) string directly, or (3) Paste a FEN (Forsyth-Edwards Notation) string to analyze a specific position. All imports are instant and free."
  },
  {
    q: "What is the accuracy score (CAPS)?",
    a: "CAPS (Computer Aggregated Precision Score) measures how closely your moves match the engine's top recommendations. A score of 90+ indicates strong play, 95+ is near-engine level, and 99+ means virtually perfect play. This is the same scoring system used by professional chess platforms."
  },
  {
    q: "Is my data private?",
    a: "Yes. All chess analysis runs entirely in your browser — no game data is sent to any server. We use Vercel Analytics for basic traffic insights (page views, no personal data), and Google AdSense may use cookies for ad personalization. You can review our full Privacy Policy for details."
  },
];

function FAQItem({ faq, index }: { faq: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-white/[0.04] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <h3 className="text-white font-bold text-base group-hover:text-[#d4af37] transition-colors pr-4">{faq.q}</h3>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform duration-300 ${open ? 'rotate-180 text-[#d4af37]' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 text-sm leading-relaxed pb-5 pr-8">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden" id="faq">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)' }} />

      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
            <HelpCircle className="w-3 h-3" /> FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
        </motion.div>

        <div className="glass-panel rounded-2xl px-6 md:px-8">
          {FAQS.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
