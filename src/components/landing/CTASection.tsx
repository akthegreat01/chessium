"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center bottom, rgba(212,175,55,0.06) 0%, transparent 50%)' }} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <Sparkles className="w-8 h-8 mx-auto mb-6" style={{ color: '#d4af37' }} />
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            Ready to See <span className="text-gradient-gold">Beyond</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of chess players who use Underpromotion to analyze their games, 
            sharpen their tactics, and discover the beauty hidden in every position.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/analysis" className="btn-primary px-10 py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-black flex items-center gap-2.5 group">
              Start Analyzing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/support" className="btn-gold-outline px-8 py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-bold flex items-center gap-2.5">
              <Heart className="w-4 h-4" /> Support the Project
            </Link>
          </div>

          <p className="text-gray-600 text-xs">
            Free forever · No account required · 100% private · Built with ♟ by Akshath Kataria
          </p>
        </motion.div>
      </div>
    </section>
  );
}
