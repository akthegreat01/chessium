"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';

const CATEGORIES = ["All", "Tactics", "Strategy", "Endgame", "History", "Psychology"];

export default function LearnContent() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? ARTICLES : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
            <BookOpen className="w-3 h-3" /> Educational Content
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Learn <span className="text-gradient-gold">Chess</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Deep-dive articles on tactics, strategy, psychology, and the most memorable moments in chess history. 
            Written for players of all levels.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat 
                  ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30' 
                  : 'bg-white/[0.03] text-gray-500 border border-white/[0.05] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-6">
          {filtered.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-panel rounded-2xl overflow-hidden group hover:border-[#d4af37]/30 transition-colors"
            >
              <Link
                href={`/learn/${article.id}`}
                className="w-full block p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <span className="text-4xl">{article.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37' }}>{article.category}</span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                    </div>
                    <h2 className="text-xl font-black text-white group-hover:text-[#d4af37] transition-colors mb-2">{article.title}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">{article.preview}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 text-xs font-bold text-gray-500 group-hover:text-[#d4af37] transition-colors mt-4 md:mt-0">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm mb-4">Want to put your knowledge into practice?</p>
          <Link href="/analysis" className="btn-primary px-8 py-3 rounded-xl text-sm uppercase tracking-[0.15em] font-black inline-flex items-center gap-2">
            Start Analyzing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
