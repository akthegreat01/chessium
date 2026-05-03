"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Search, Trophy, BookOpen, Target, Settings, Info, Cpu } from 'lucide-react';
import PixelSnow from './PixelSnow';
import ShinyText from './ShinyText';

interface LandingPageProps {
  onStart: (mode: 'ai' | 'analysis') => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const options = [
    { 
      id: 'ai', 
      title: 'Play Against AI', 
      desc: 'Challenge Stockfish with custom personalities', 
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      color: 'blue'
    },
    { 
      id: 'analysis', 
      title: 'Free Analysis', 
      desc: 'Deep-dive into your positions with Stockfish 16', 
      icon: <Search className="w-6 h-6 text-emerald-400" />,
      color: 'emerald'
    },
    { 
      id: 'review', 
      title: 'Game Review', 
      desc: 'Get a professional-grade review of your games', 
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      color: 'yellow'
    },
    { 
      id: 'openings', 
      title: 'Opening Explorer', 
      desc: 'Master your opening repertoire', 
      icon: <BookOpen className="w-6 h-6 text-purple-400" />,
      color: 'purple'
    },
    { 
      id: 'mistakes', 
      title: 'Mistake Trainer', 
      desc: 'Learn from your errors and improve', 
      icon: <Target className="w-6 h-6 text-red-400" />,
      color: 'red'
    }
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
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

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-6xl w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 
            className="text-7xl md:text-9xl font-black tracking-tighter mb-4 uppercase"
            style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.1))' }}
          >
            <ShinyText 
              text="Chessium" 
              speed={3} 
              color="#b5b5b5" 
              shineColor="#ffffff" 
              spread={120}
              className="font-black"
            />
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto">
            The next generation of chess analysis and gameplay. 
            Powered by Stockfish 16 NNUE.
          </p>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {options.map((option, idx) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.05 }}
              onClick={() => {
                if (option.id === 'ai') onStart('ai');
                if (option.id === 'analysis') onStart('analysis');
              }}
              className="group glass-panel p-6 flex flex-col items-start gap-4 text-left border border-white/5 hover:border-white/20 transition-all duration-300"
            >
              <div className={`p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300`}>
                {option.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gradient-silver transition-all duration-300 uppercase tracking-tight">{option.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{option.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex items-center gap-8 text-gray-600 font-black text-[10px] uppercase tracking-[0.3em]"
        >
          <span className="flex items-center gap-2"><Settings className="w-3 h-3" /> Preferences</span>
          <span className="flex items-center gap-2"><Info className="w-3 h-3" /> About</span>
          <span className="flex items-center gap-2"><Trophy className="w-3 h-3" /> Leaderboard</span>
        </motion.div>
      </div>
      
      {/* Scroll indicator or prompt */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 text-gray-500 text-[10px] uppercase font-black tracking-widest opacity-50"
      >
        Click an option to begin
      </motion.div>
    </div>
  );
}
