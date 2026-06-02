"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Board from "@/components/chess/Board";
import AdSlot from "@/components/ui/AdSlot";

export default function PuzzlesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Puzzle Dashboard</h1>
          <p className="text-[#a0a0a8]">Sharpen your tactics and improve your vision.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Puzzle */}
        <Link href="/puzzles/daily" className="block group">
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-5 hover:border-[#81b64c]/50 transition-colors h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white group-hover:text-[#81b64c] transition-colors">Daily Puzzle</h2>
              <span className="bg-[#81b64c]/10 text-[#81b64c] text-xs font-semibold px-2 py-1 rounded">New</span>
            </div>
            <div className="pointer-events-none mb-4 flex-1">
              <Board position="r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3" />
            </div>
            <div className="text-sm text-[#a0a0a8]">
              Solve the puzzle of the day to keep your streak alive.
            </div>
          </div>
        </Link>

        {/* Puzzle Themes */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-5 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">Themes</h2>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {["Mate in 1", "Mate in 2", "Fork", "Pin", "Skewer", "Endgame"].map((theme) => (
              <button key={theme} className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-3 text-sm text-[#a0a0a8] hover:text-white hover:border-[#3a3a42] text-left transition-colors">
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-5">
          <h2 className="text-xl font-bold text-white mb-4">Your Stats</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-[#a0a0a8] mb-1">Puzzle Rating</div>
              <div className="text-3xl font-bold text-[#81b64c]">1500</div>
            </div>
            <div>
              <div className="text-sm text-[#a0a0a8] mb-1">Solved Today</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div>
              <div className="text-sm text-[#a0a0a8] mb-1">Current Streak</div>
              <div className="text-2xl font-bold text-white">0 days</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <AdSlot slot="puzzles-bottom" />
      </div>
    </div>
  );
}
