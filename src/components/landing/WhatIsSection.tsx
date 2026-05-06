"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Crown, Lightbulb, History } from 'lucide-react';

export default function WhatIsSection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden" id="what-is-underpromotion">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)' }} />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
            <BookOpen className="w-3 h-3" /> Educational Content
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            What is{' '}<span className="text-gradient-gold">Underpromotion</span>?
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: 0.1 }} className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            In chess, <strong className="text-white">underpromotion</strong> is the act of promoting a pawn to a piece other than a queen — 
            typically a knight, rook, or bishop. While promoting to a queen is almost always the strongest choice, 
            there are rare and brilliant moments when choosing a lesser piece is the <em>only</em> winning move.
          </p>

          <p className="text-gray-400 text-base leading-relaxed mb-8">
            Underpromotion is one of the most fascinating concepts in chess tactics. It occurs when promoting to a queen 
            would result in stalemate, or when a knight promotion delivers an immediate fork or checkmate that no other piece could achieve. 
            These moments represent the deepest form of chess calculation — seeing beyond the obvious to find the extraordinary.
          </p>

          {/* Key concepts cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 not-prose">
            {[
              {
                icon: Crown,
                title: "Why Not Always a Queen?",
                content: "In most cases, promoting to a queen is correct. But in roughly 1 in 5,000 games, underpromotion is the only path to victory. A queen promotion might cause stalemate, while a knight can deliver a devastating fork."
              },
              {
                icon: Lightbulb,
                title: "Knight Underpromotion",
                content: "The most common type of underpromotion. A knight has unique movement that no other piece can replicate. Knight promotions often create immediate forks against the king and queen, or deliver surprise checkmates."
              },
              {
                icon: History,
                title: "Famous Historical Examples",
                content: "In the 1953 Candidates Tournament, Petrosian vs Reshevsky featured a legendary underpromotion. More recently, Magnus Carlsen has demonstrated underpromotion ideas in world championship preparation."
              },
              {
                icon: BookOpen,
                title: "Tactical Importance",
                content: "Understanding underpromotion sharpens your tactical vision enormously. Players who study these patterns develop a deeper sense of piece coordination and an ability to see beyond conventional moves."
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel p-6 rounded-xl group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 border" style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.15)' }}>
                  <card.icon className="w-5 h-5" style={{ color: '#d4af37' }} />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.content}</p>
              </motion.div>
            ))}
          </div>

          <h3 className="text-2xl font-black text-white mb-4 mt-12">Why Grandmasters Use Underpromotion</h3>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            At the highest levels of chess, grandmasters spend hundreds of hours studying endgame positions where 
            underpromotion is the critical resource. These positions often arise in complex rook endgames and pawn races 
            where precise calculation is everything. A grandmaster who misses an underpromotion opportunity may convert 
            a winning position into a draw — or worse.
          </p>

          <p className="text-gray-400 text-base leading-relaxed mb-6">
            The ability to recognize underpromotion patterns is considered a hallmark of deep chess understanding. 
            World Champions like Bobby Fischer, Garry Kasparov, and Magnus Carlsen have all demonstrated mastery 
            of this subtle art form in critical tournament games.
          </p>

          <h3 className="text-2xl font-black text-white mb-4 mt-12">Types of Underpromotion</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-8">
            {[
              { piece: "♞", name: "Knight Promotion", desc: "Most common. Used for forks, discovered attacks, and unique knight geometry that queens can't achieve.", pct: "~85%" },
              { piece: "♜", name: "Rook Promotion", desc: "Used primarily to avoid stalemate when a queen would give the opponent no legal moves.", pct: "~12%" },
              { piece: "♝", name: "Bishop Promotion", desc: "Extremely rare. Occurs in highly specific endgame scenarios involving diagonal control.", pct: "~3%" },
            ].map((type, i) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center group hover:border-[rgba(212,175,55,0.15)] transition-all"
              >
                <div className="text-4xl mb-2">{type.piece}</div>
                <h4 className="text-white font-bold text-sm mb-1">{type.name}</h4>
                <p className="text-gray-500 text-xs mb-2">{type.desc}</p>
                <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#d4af37' }}>{type.pct} of cases</span>
              </motion.div>
            ))}
          </div>

          <blockquote className="border-l-2 pl-6 py-2 my-8 not-prose" style={{ borderColor: 'rgba(212,175,55,0.3)' }}>
            <p className="text-gray-300 text-lg italic mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              &ldquo;The most beautiful moves in chess are the ones nobody sees coming. Underpromotion is the ultimate expression of that beauty.&rdquo;
            </p>
            <cite className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.5)' }}>
              — Chess Wisdom
            </cite>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
