"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Search, Trophy, BookOpen, Target, Settings, Info, Cpu } from 'lucide-react';
import PixelSnow from './PixelSnow';
import ShinyText from './ShinyText';

interface LandingPageProps {
  onStart: (mode: 'ai' | 'review' | 'editor') => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const options = [
    { 
      id: 'ai', 
      title: 'Play against bot', 
      desc: 'Challenge Stockfish with custom personalities', 
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      color: 'blue'
    },
    { 
      id: 'review', 
      title: 'Game Review', 
      desc: 'Get a professional-grade review of your games', 
      icon: <Trophy className="w-6 h-6 text-emerald-400" />,
      color: 'emerald'
    },
    { 
      id: 'editor', 
      title: 'Board Editor', 
      desc: 'Create custom positions and analyze them', 
      icon: <Settings className="w-6 h-6 text-yellow-400" />,
      color: 'yellow'
    }
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Gradient & Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#050505] to-black" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
        <PixelSnow 
          color="#ffffff" 
          flakeSize={0.015} 
          pixelResolution={180} 
          speed={1.0} 
          density={0.25} 
          brightness={0.8}
          variant="snowflake"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full py-20 px-6">
        <article className="flex flex-col items-center justify-center w-full mt-[-10vh]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-20">
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <h1 
                className="text-7xl md:text-[11rem] font-medium tracking-tight italic select-none"
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  filter: 'drop-shadow(0 0 50px rgba(255,255,255,0.15))',
                  lineHeight: 0.8
                }}
              >
                <ShinyText 
                  text="Chessium" 
                  speed={3} 
                  color="#b5b5b5" 
                  shineColor="#ffffff" 
                  spread={150}
                />
              </h1>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-sm md:text-xl font-medium text-gray-400 tracking-[0.5em] uppercase mt-2 italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                — Akshath Kataria
              </motion.span>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative w-48 h-48 md:w-[24rem] md:h-[24rem]"
            >
              <img 
                src="/horse.png" 
                alt="Chessium Professional Knight Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]"
              />
            </motion.div>
          </div>

          {/* Navigation Options - Shifted up */}
          <nav aria-label="Main navigation" className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {options.map((option, idx) => {
              const colorMap = {
                blue: { bg: 'bg-blue-500', text: 'text-blue-400', hover: 'group-hover:text-blue-300', glow: 'shadow-blue-500/50', border: 'bg-blue-500/40' },
                emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', hover: 'group-hover:text-emerald-300', glow: 'shadow-emerald-500/50', border: 'bg-emerald-500/40' },
                yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', hover: 'group-hover:text-yellow-300', glow: 'shadow-yellow-500/50', border: 'bg-yellow-500/40' }
              }[option.color as 'blue' | 'emerald' | 'yellow'];

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 + idx * 0.1 }}
                  onClick={() => {
                    onStart(option.id as any);
                  }}
                  className="group relative flex flex-col items-center gap-6 text-center transition-all duration-500"
                >
                  {/* Creative Icon Container */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                    {/* Background Glow */}
                    <div className={`absolute inset-0 rounded-3xl opacity-30 blur-xl group-hover:opacity-70 transition-opacity duration-500 ${colorMap.bg}`} />
                    
                    {/* Icon Box */}
                    <div className={`relative w-full h-full rounded-2xl md:rounded-3xl bg-white/[0.08] border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 group-hover:bg-white/[0.15] group-hover:border-white/40 transition-all duration-500 shadow-2xl shadow-black`}>
                      <div className={`${colorMap.text} transition-colors duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
                        {option.icon}
                      </div>
                    </div>
                  </div>

                  {/* Title & Underline */}
                  <div className="flex flex-col items-center gap-3">
                    <h2 className={`text-sm md:text-lg font-black uppercase tracking-[0.2em] transition-all duration-500 ${colorMap.hover} text-white/70 group-hover:text-white`}>
                      {option.title}
                    </h2>
                    <div className={`h-0.5 w-12 transition-all duration-500 ${colorMap.border} opacity-40 group-hover:opacity-100 group-hover:w-20`} />
                  </div>

                  {/* Description (Visible on desktop) */}
                  <p className="hidden md:block text-[9px] text-gray-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 absolute -bottom-10 whitespace-nowrap bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                    {option.desc}
                  </p>
                </motion.button>
              );
            })}
          </nav>
        </article>
      </div>
      
      {/* Scroll indicator or prompt */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 text-gray-500 text-[10px] uppercase font-black tracking-widest opacity-50"
      >
        Click an option to begin
      </motion.div>
    </section>
  );
}
