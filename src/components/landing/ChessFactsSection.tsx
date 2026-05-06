"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Swords, Eye, Flame } from 'lucide-react';

const FACTS = [
  { emoji: "♔", title: "The Immortal Game (1851)", text: "Adolf Anderssen sacrificed both rooks, a bishop, and his queen before delivering checkmate with just three minor pieces. It remains the most celebrated attacking game ever played.", category: "Famous Games" },
  { emoji: "🧠", title: "Shannon Number", text: "The total number of possible chess games is estimated at 10^120 — more than the number of atoms in the observable universe. This makes chess computationally inexhaustible.", category: "Chess Math" },
  { emoji: "⏱️", title: "Longest Official Game", text: "Nikolić vs. Arsović (1989) lasted 269 moves and ended in a draw. The game took over 20 hours of play time spread across multiple sessions.", category: "Records" },
  { emoji: "💎", title: "The Opera Game", text: "Paul Morphy's 1858 masterpiece at the Paris Opera demonstrated perfect development and tactical vision. He defeated two amateur allies while barely looking at the board.", category: "Brilliancy" },
  { emoji: "🤖", title: "Deep Blue vs Kasparov", text: "In 1997, IBM's Deep Blue became the first computer to defeat a reigning world champion in a match. Kasparov accused IBM of cheating — the controversy continues today.", category: "AI History" },
  { emoji: "♟️", title: "En Passant Mystery", text: "En passant is the most misunderstood rule in chess. Many casual players have never heard of it, and it has decided the outcome of countless tournament games.", category: "Rules" },
];

const BLUNDERS = [
  { player: "Magnus Carlsen", event: "World Blitz 2023", blunder: "Hung his queen in a completely winning position", emoji: "👑" },
  { player: "Garry Kasparov", event: "vs Deep Blue, 1997", blunder: "Resigned in a drawn position in Game 2", emoji: "🤖" },
  { player: "Viswanathan Anand", event: "World Championship 2013", blunder: "Missed a simple tactic allowing Carlsen to win", emoji: "🇮🇳" },
];

export default function ChessFactsSection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)' }} />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
            <Eye className="w-3 h-3" /> Chess Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            The <span className="text-gradient-gold">Beautiful Game</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Fascinating stories, incredible facts, and unforgettable moments from chess history.
          </p>
        </motion.div>

        {/* Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {FACTS.map((fact, i) => (
            <motion.div
              key={fact.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-panel p-6 rounded-xl group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{fact.emoji}</span>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.5)' }}>{fact.category}</span>
              </div>
              <h3 className="text-white font-bold text-base mb-2 group-hover:text-[#d4af37] transition-colors">{fact.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{fact.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Famous Blunders */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Flame className="w-6 h-6 text-red-500" />
            Famous Blunders by Legends
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BLUNDERS.map((b, i) => (
              <motion.div
                key={b.player}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-5 rounded-xl border border-red-500/10 bg-red-500/[0.02] hover:border-red-500/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{b.emoji}</span>
                  <span className="text-white font-bold text-sm">{b.player}</span>
                </div>
                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-2">{b.event}</p>
                <p className="text-gray-400 text-sm">{b.blunder}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
