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
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#050505] to-black" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 60%)' }} />
        <PixelSnow color="#ffffff" flakeSize={0.015} pixelResolution={180} speed={1.0} density={0.25} brightness={0.8} variant="snowflake" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full py-20 px-6">
        <article className="flex flex-col items-center justify-center w-full mt-[-5vh]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.25em] uppercase" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              Premium Chess Analysis Platform
            </div>
          </motion.div>

          {/* Title + Knight */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <h1 
                className="text-6xl md:text-[10rem] font-medium tracking-tight italic select-none"
                style={{ fontFamily: "'Cormorant Garamond', serif", filter: 'drop-shadow(0 0 50px rgba(255,255,255,0.15))', lineHeight: 0.85 }}
              >
                <ShinyText text="Under" speed={3} color="#b5b5b5" shineColor="#ffffff" spread={150} />
                <br />
                <ShinyText text="promotion" speed={3} color="#b5b5b5" shineColor="#ffffff" spread={150} />
              </h1>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative w-36 h-36 md:w-[20rem] md:h-[20rem]"
            >
              <img src="/horse.png" alt="Chess Knight" className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]" />
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-lg md:text-2xl text-gray-400 font-medium tracking-wide mb-12 text-center max-w-xl"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
          >
            Where Brilliant Moves Become Immortal.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/analysis?mode=review" className="btn-primary px-8 py-3.5 rounded-xl text-sm uppercase tracking-[0.15em] font-black flex items-center gap-2.5 group">
              <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Analyze a Game
            </Link>
            <Link href="/analysis?mode=ai" className="btn-gold-outline px-8 py-3.5 rounded-xl text-sm uppercase tracking-[0.15em] font-bold flex items-center gap-2.5">
              <Cpu className="w-4 h-4" />
              Play vs Engine
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="flex items-center gap-8 md:gap-16 mt-16"
          >
            {[
              { value: "3600+", label: "ELO Strength" },
              { value: "100%", label: "Free Forever" },
              { value: "0ms", label: "Server Latency" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>{stat.value}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(212,175,55,0.4)' }}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </article>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-[10px] uppercase font-black tracking-widest opacity-50">Scroll to explore</span>
        <ChevronDown className="w-4 h-4 opacity-40" />
      </motion.div>
    </section>
  );
}
