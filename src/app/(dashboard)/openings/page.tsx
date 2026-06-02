"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OPENINGS_DB } from "@/lib/chess/openings-db";
import Board from "@/components/chess/Board";
import { motion } from "motion/react";

export default function OpeningsPage() {
  const [filter, setFilter] = useState<"all" | "e4" | "d4" | "other">("all");

  const filteredOpenings = OPENINGS_DB.filter(
    (op) => filter === "all" || op.category === filter
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#141416] to-[#1a1a1f] border border-[#2a2a30] p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#81b64c]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Openings <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81b64c] to-[#9fcc6b]">Explorer</span>
          </h1>
          <p className="text-[#a0a0a8] text-lg mb-8 leading-relaxed">
            Master the first phase of the game. Learn the ideas, key moves, and traps behind the most popular chess openings.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            filter === "all" ? "bg-[#81b64c] text-white" : "bg-[#141416] border border-[#2a2a30] text-[#a0a0a8] hover:text-white"
          }`}
        >
          All Openings
        </button>
        <button
          onClick={() => setFilter("e4")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            filter === "e4" ? "bg-[#81b64c] text-white" : "bg-[#141416] border border-[#2a2a30] text-[#a0a0a8] hover:text-white"
          }`}
        >
          King's Pawn (1. e4)
        </button>
        <button
          onClick={() => setFilter("d4")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            filter === "d4" ? "bg-[#81b64c] text-white" : "bg-[#141416] border border-[#2a2a30] text-[#a0a0a8] hover:text-white"
          }`}
        >
          Queen's Pawn (1. d4)
        </button>
        <button
          onClick={() => setFilter("other")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            filter === "other" ? "bg-[#81b64c] text-white" : "bg-[#141416] border border-[#2a2a30] text-[#a0a0a8] hover:text-white"
          }`}
        >
          Flank Openings (1. c4, 1. Nf3)
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpenings.map((opening, i) => (
          <Link href={`/openings/${opening.eco}`} key={opening.eco} className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden hover:border-[#81b64c]/50 transition-all duration-300 h-full flex flex-col shadow-elevated group-hover:-translate-y-1"
            >
              {/* Board Preview */}
              <div className="w-full aspect-square bg-[#0a0a0b] pointer-events-none p-4">
                <Board position={opening.fen} />
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-white group-hover:text-[#81b64c] transition-colors line-clamp-1">
                    {opening.name}
                  </h2>
                  <span className="text-xs font-bold px-2 py-1 bg-[#1a1a1f] border border-[#2a2a30] rounded-md text-[#81b64c]">
                    {opening.eco}
                  </span>
                </div>
                
                <div className="text-sm font-mono text-[#a0a0a8] mb-3 truncate">
                  {opening.moves}
                </div>
                
                <p className="text-sm text-[#6b6b75] line-clamp-3 mb-4 flex-1">
                  {opening.description}
                </p>
                
                <div className="flex items-center justify-between text-xs font-medium border-t border-[#2a2a30] pt-4 mt-auto">
                  <span className={`
                    ${opening.difficulty === 'Beginner' ? 'text-green-400' : 
                      opening.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'}
                  `}>
                    {opening.difficulty}
                  </span>
                  <span className="text-[#a0a0a8] flex items-center gap-1 group-hover:text-white transition-colors">
                    Explore <span className="text-lg">→</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
