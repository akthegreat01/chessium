"use client";

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useUserStore, getRankFromLevel } from '@/lib/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

export default function CelebrationOverlay() {
  const { celebration, clearCelebration, level } = useUserStore();
  const rank = getRankFromLevel(level);

  // Play synth sound
  const playSound = (type: 'levelUp' | 'brilliant') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);

      if (type === 'levelUp') {
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        [440, 554.37, 659.25, 880].forEach((freq, i) => { // A major chord
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          osc.connect(gain);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + 1.5);
        });
      } else {
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime); // High C
        osc.frequency.exponentialRampToValueAtTime(2093, ctx.currentTime + 0.1); // Slide up
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      // Audio context might be blocked if no user interaction, safely ignore
    }
  };

  useEffect(() => {
    if (celebration === 'levelUp') {
      playSound('levelUp');
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#8b5cf6', '#eab308']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#8b5cf6', '#eab308']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      const t = setTimeout(() => {
        clearCelebration();
      }, 4000);
      return () => clearTimeout(t);

    } else if (celebration === 'brilliant') {
      playSound('brilliant');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#1cb0f6', '#ffffff'],
        disableForReducedMotion: true,
      });

      const t = setTimeout(() => {
        clearCelebration();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [celebration, clearCelebration]);

  return (
    <AnimatePresence>
      {celebration === 'levelUp' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center"
        >
          <div className="bg-[#0a0b0e]/95 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col items-center shadow-[0_0_100px_rgba(139,92,246,0.3)]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 rounded-3xl"
            />
            
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 shadow-2xl relative shadow-purple-500/50">
              <Zap className="w-12 h-12 text-white" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border border-white/30"
              />
            </div>
            
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Level Up!</h1>
            <p className="text-gray-400 font-medium text-lg mb-6 flex items-center gap-2">
              You are now Level <span className="text-white font-bold text-2xl">{level}</span>
            </p>

            <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${rank.color} bg-opacity-20 border border-white/20 flex items-center gap-2`}>
              <Trophy className="w-5 h-5 text-white" />
              <span className="text-white font-bold uppercase tracking-widest text-sm">{rank.name} Rank</span>
            </div>
          </div>
        </motion.div>
      )}

      {celebration === 'brilliant' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ type: 'spring', bounce: 0.6 }}
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
        >
          <div className="text-[#1cb0f6] font-black text-7xl md:text-9xl uppercase tracking-tighter drop-shadow-[0_0_40px_rgba(28,176,246,0.6)] italic" style={{ WebkitTextStroke: '2px white' }}>
            Brilliant!!
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
