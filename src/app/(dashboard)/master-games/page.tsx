"use client";

import React from "react";
import Link from "next/link";
import { MASTER_GAMES } from "@/lib/chess/master-games-db";
import AdSlot from "@/components/ui/AdSlot";
import { motion } from "motion/react";

export default function MasterGamesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#141416] to-[#1a1a1f] border border-[#2a2a30] p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#81b64c]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81b64c] to-[#9fcc6b]">Games</span>
          </h1>
          <p className="text-[#a0a0a8] text-lg mb-8 leading-relaxed">
            Explore the most brilliant, historical, and influential chess games ever played. Learn from the greatest minds in chess history.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MASTER_GAMES.map((game, i) => (
          <Link href={`/master-games/${game.id}`} key={game.id} className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden hover:border-[#81b64c]/50 transition-all duration-300 h-full flex flex-col shadow-elevated relative group-hover:-translate-y-1"
            >
              <div className={`h-32 ${game.thumbnail} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                <div className="w-16 h-16 rounded-2xl bg-black/30 backdrop-blur-md flex items-center justify-center text-3xl shadow-xl border border-white/10">
                  ♔
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2a2a30] text-[#a0a0a8]">
                    {game.year}
                  </span>
                  <span className="text-xs text-[#6b6b75] truncate">
                    {game.event}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#81b64c] transition-colors">{game.title}</h3>
                <div className="text-sm font-medium text-[#a0a0a8] mb-3">
                  {game.white} vs {game.black}
                </div>
                <p className="text-sm text-[#6b6b75] line-clamp-3 mb-4 flex-1">
                  {game.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-[#6b6b75] pt-4 border-t border-[#2a2a30] mt-auto">
                  <span>{game.opening} ({game.eco})</span>
                  <span className="font-bold text-white">{game.result}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8">
        <AdSlot slot="master-games-bottom" />
      </div>
    </div>
  );
}
