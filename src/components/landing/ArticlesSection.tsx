"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { ARTICLES } from '@/lib/articles';

// Keep the gradient mapping
const GRADIENTS = [
  "from-blue-500/10 to-cyan-500/5",
  "from-orange-500/10 to-red-500/5",
  "from-[#d4af37]/10 to-amber-500/5",
  "from-purple-500/10 to-violet-500/5",
  "from-emerald-500/10 to-green-500/5",
  "from-pink-500/10 to-rose-500/5"
];

export default function ArticlesSection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)' }} />

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}>
            <Sparkles className="w-3 h-3" /> Featured Content
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Deep Dive into <span className="text-gradient-gold">Chess Mastery</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore curated articles on tactics, strategy, psychology, and the most memorable moments in chess history.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/learn/${article.id}`} className="block glass-panel p-6 rounded-xl group cursor-pointer h-full">
                <div className={`w-full h-32 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} border border-white/[0.04]`}>
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{article.emoji}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37' }}>{article.category}</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />{article.readTime}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-3 group-hover:text-[#d4af37] transition-colors leading-snug">{article.title}</h3>
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1 group-hover:text-gray-300 transition-colors">
                  Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
