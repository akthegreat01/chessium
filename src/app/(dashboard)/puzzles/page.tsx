"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Board from "@/components/chess/Board";

export default function PuzzlesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#141416] to-[#1a1a1f] border border-[#2a2a30] p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#81b64c]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#81b64c]/10 border border-[#81b64c]/20 text-[#81b64c] text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#81b64c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#81b64c]"></span>
            </span>
            Daily Challenge Available
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Sharpen Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81b64c] to-[#9fcc6b]">Tactics</span>
          </h1>
          <p className="text-[#a0a0a8] text-lg mb-8 leading-relaxed">
            Improve your vision, calculate faster, and win more games. Solve the daily puzzle to maintain your streak, or focus on specific themes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Survival Mode Card */}
        <Link href="/puzzles/survival" className="block group lg:col-span-1">
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden hover:border-[#81b64c]/50 transition-all duration-300 h-full flex flex-col shadow-elevated relative group-hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#81b64c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-6 pb-0 flex items-center justify-between mb-6 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-[#81b64c] transition-colors">Survival Mode</h2>
                <div className="text-sm text-[#a0a0a8] mt-1">3 Lives. Highest Streak Wins.</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1f] flex items-center justify-center text-2xl border border-[#2a2a30] group-hover:scale-110 transition-transform">
                ❤️
              </div>
            </div>
            
            <div className="px-6 pb-6 pointer-events-none flex-1 relative z-10">
              <div className="rounded-xl overflow-hidden shadow-inner border border-[#2a2a30]">
                <Board position="r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3" />
              </div>
            </div>
            
            <div className="p-4 bg-[#1a1a1f] border-t border-[#2a2a30] flex justify-between items-center relative z-10">
              <span className="text-white font-medium text-sm">Play Now</span>
              <svg className="w-5 h-5 text-[#ca3431] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Ranked Puzzles */}
        <Link href="/puzzles/ranked" className="block group lg:col-span-2">
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden hover:border-[#81b64c]/50 transition-all duration-300 h-full flex flex-col shadow-elevated relative group-hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-bl from-[#81b64c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-6 pb-0 flex items-center justify-between mb-6 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-[#81b64c] transition-colors">Ranked Puzzles</h2>
                <div className="text-sm text-[#a0a0a8] mt-1">Solve random puzzles to increase your Elo</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1f] flex items-center justify-center text-2xl border border-[#2a2a30] group-hover:scale-110 transition-transform">
                📈
              </div>
            </div>
            
            <div className="px-6 pb-6 flex-1 relative z-10 flex items-center justify-center">
               <p className="text-center text-[#a0a0a8] max-w-sm">
                 Face puzzles scaled to your skill level. Correct answers boost your rating, while mistakes will cost you points. Are you ready?
               </p>
            </div>
            
            <div className="p-4 bg-[#1a1a1f] border-t border-[#2a2a30] flex justify-between items-center relative z-10">
              <span className="text-white font-medium text-sm">Start Training</span>
              <svg className="w-5 h-5 text-[#81b64c] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
