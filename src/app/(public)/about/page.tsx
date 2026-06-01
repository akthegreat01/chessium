import React from "react";
import { User, Code2, Heart } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 overflow-hidden relative">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-secondary-foreground hover:text-foreground transition-colors mb-12 bg-surface  px-4 py-2 rounded-full border border-white/5 shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        {/* Header */}
        <div className="mb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent drop-shadow-sm">
            About Chessium
          </h1>
          <p className="text-xl md:text-2xl text-secondary-foreground font-medium max-w-2xl mx-auto">
            Built by players, for players.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-surface  border border-white/10 rounded-[32px] p-8 md:p-14 mb-12 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Heart className="w-7 h-7 text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Story</h2>
          </div>
          <div className="space-y-6 text-secondary-foreground/90 leading-relaxed text-lg font-medium">
            <p>
              Chessium started as a simple idea: what if chess analysis didn't have to look like a spreadsheet? We wanted to build a platform that felt as premium and dynamic as the game itself.
            </p>
            <p>
              By combining beautiful design with powerful AI engines, we've created a modern environment where ambitious players can analyze their games, track their progress, and improve their skills through adaptive puzzles and detailed feedback.
            </p>
          </div>
        </div>

        {/* Developers Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Akshath Kataria */}
          <div className="bg-surface  border border-white/10 rounded-[32px] p-10 hover:bg-surface hover:border-white/20 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Code2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">Akshath Kataria</h3>
              </div>
            </div>
            <p className="text-secondary-foreground leading-relaxed text-[15px] font-medium">
              The visionary behind Chessium's core architecture and AI integrations. Akshath brought the sophisticated game logic and seamless analysis engine to life, ensuring that every move is evaluated with precision.
            </p>
          </div>

          {/* Nikunj Bhardwaj */}
          <div className="bg-surface  border border-white/10 rounded-[32px] p-10 hover:bg-surface hover:border-white/20 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-inner">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">Nikunj Bhardwaj</h3>
              </div>
            </div>
            <p className="text-secondary-foreground leading-relaxed text-[15px] font-medium">
              Focusing on user experience and the platform's robust feature set, Nikunj helped sculpt Chessium into a cohesive product that players actually love to use, from interactive learning tracks to dynamic puzzles.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
