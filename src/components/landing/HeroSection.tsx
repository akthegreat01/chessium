"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Play, BarChart3, Cpu } from 'lucide-react';
import Link from 'next/link';
import PixelSnow from '../PixelSnow';
import ShinyText from '../ShinyText';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-gold/5 blur-[160px] opacity-20 pointer-events-none" />
        <PixelSnow color="#ffffff" flakeSize={0.012} pixelResolution={160} speed={0.8} density={0.2} brightness={0.6} variant="snowflake" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 flex flex-col items-center">
        
        {/* Floating Knight + Brand */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mb-16">
          
          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              <h1 
                className="text-7xl md:text-[11rem] font-medium tracking-tight italic select-none leading-[0.8]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <ShinyText text="Under" speed={4} color="#a0a0a0" shineColor="#ffffff" spread={200} />
                <br />
                <ShinyText text="promotion" speed={4} color="#a0a0a0" shineColor="#ffffff" spread={200} />
              </h1>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-6 flex flex-col items-center lg:items-end"
              >
                <span className="text-xs md:text-sm text-gray-500 font-medium tracking-[0.6em] uppercase">
                  Engineered by
                </span>
                <span className="text-sm md:text-lg text-gold font-bold tracking-widest uppercase mt-1">
                  Akshath Kataria
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Visual Piece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -20, 0] 
            }}
            transition={{ 
              opacity: { duration: 1.5 },
              scale: { duration: 1.5 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-48 h-48 md:w-[22rem] md:h-[22rem] order-1 lg:order-2"
          >
            {/* Soft Glow behind the horse */}
            <div className="absolute inset-0 bg-gold/10 blur-[60px] rounded-full scale-110 opacity-30 animate-pulse" />
            <img 
              src="/horse.png" 
              alt="Chess Knight" 
              className="w-full h-full object-contain filter drop-shadow-[0_20px_60px_rgba(212,175,55,0.2)] select-none pointer-events-none brightness-110 contrast-110" 
            />
          </motion.div>
        </div>

        {/* Tagline & Actions */}
        <div className="flex flex-col items-center gap-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-lg md:text-2xl text-gray-400 font-light tracking-[0.08em] text-center italic">
              "Where Brilliant Moves Become Immortal"
            </p>
            <div className="w-12 h-px bg-gold/30" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link href="/analysis?mode=review" className="btn-primary px-10 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-3 group relative overflow-hidden">
              <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Start Analysis
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
            </Link>
            <Link href="/analysis?mode=ai" className="btn-gold-outline px-10 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-3 hover:bg-gold/5 transition-all">
              <Cpu className="w-4 h-4" />
              Vs Engine
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="grid grid-cols-3 gap-12 md:gap-24 pt-8"
          >
            {[
              { value: "3600", label: "Elo Strength" },
              { value: "NNUE", label: "Architecture" },
              { value: "0ms", label: "Latency" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1.5">
                <span className="text-xl md:text-3xl font-black text-white tabular-nums tracking-tight">{stat.value}</span>
                <span className="text-[9px] uppercase tracking-[0.3em] font-black opacity-30">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] uppercase font-bold tracking-[0.4em] opacity-20">Explore Lab</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-gold/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
