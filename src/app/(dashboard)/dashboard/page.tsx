"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Board from "@/components/chess/Board";

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) setUsername(data.display_name);
          });
      }
    });
  }, [supabase]);

  const stats = [
    { label: "Rapid Rating", value: "1200", change: "+14", trend: "up" },
    { label: "Puzzles Rating", value: "1550", change: "+42", trend: "up" },
    { label: "Accuracy", value: "78.4%", change: "-1.2%", trend: "down" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="text-[#81b64c]">{username || "Player"}</span>
          </h1>
          <p className="text-[#a0a0a8]">Ready to improve your game today?</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/play"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#81b64c] hover:bg-[#9fcc6b] transition-colors"
          >
            Play Game
          </Link>
          <Link
            href="/analysis"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-[#2a2a30] hover:border-[#3a3a42] hover:bg-[#1a1a1f] transition-all"
          >
            Analyze
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-[#141416] border border-[#2a2a30]"
          >
            <div className="text-sm text-[#a0a0a8] mb-2">{stat.label}</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div
                className={`text-sm font-medium flex items-center mb-1 ${
                  stat.trend === "up" ? "text-[#81b64c]" : "text-[#ca3431]"
                }`}
              >
                {stat.trend === "up" ? "↑" : "↓"} {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Games */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Games</h2>
            <Link href="/games" className="text-sm text-[#81b64c] hover:text-[#9fcc6b]">
              View All
            </Link>
          </div>
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden">
            {/* Mock recent games list */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border-b border-[#2a2a30] last:border-0 hover:bg-[#1a1a1f] transition-colors"
              >
                <div className="w-12 h-12 bg-[#0a0a0b] rounded-lg flex items-center justify-center text-xl border border-[#2a2a30]">
                  {i % 2 === 0 ? "♚" : "♔"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white truncate">vs Nelson (Bot)</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-[#81b64c]/10 text-[#81b64c] font-medium">
                      Won
                    </span>
                  </div>
                  <div className="text-xs text-[#6b6b75]">
                    10 min Rapid • {i} day{i > 1 ? "s" : ""} ago
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-white mb-1">Accuracy</div>
                  <div className="text-xs text-[#81b64c]">85.4%</div>
                </div>
                <button className="p-2 rounded-lg text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Puzzle */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Daily Puzzle</h2>
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-4">
            <div className="pointer-events-none mb-4">
              <Board position="r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3" />
            </div>
            <div className="text-center">
              <div className="text-sm text-[#a0a0a8] mb-1">White to move and win</div>
              <div className="text-xs text-[#6b6b75] mb-4">Rating: ~1400</div>
              <Link
                href="/puzzles/daily"
                className="block w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#81b64c] hover:bg-[#9fcc6b] transition-colors"
              >
                Solve Puzzle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
