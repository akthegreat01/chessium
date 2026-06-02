"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Member {
  id: string;
  username: string;
  chessComUsername: string | null;
  role: string;
}

interface LeaderboardEntry extends Member {
  rating: number;
  mode: "rapid" | "blitz" | "bullet" | "unrated";
  isLoading: boolean;
}

export default function LiveLeaderboard({ members }: { members: Member[] }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedMode, setSelectedMode] = useState<"rapid" | "blitz">("rapid");

  useEffect(() => {
    // Initialize leaderboard with loading states
    const initial = members.map(m => ({
      ...m,
      rating: 0,
      mode: selectedMode,
      isLoading: true
    }));
    setLeaderboard(initial);

    // Fetch stats for each member with a chess.com username
    const fetchStats = async () => {
      const updated = await Promise.all(
        initial.map(async (entry) => {
          if (!entry.chessComUsername) {
            return { ...entry, isLoading: false, rating: 0, mode: "unrated" as const };
          }
          try {
            const res = await fetch(`https://api.chess.com/pub/player/${entry.chessComUsername}/stats`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            
            // Extract the requested rating
            const modeKey = `chess_${selectedMode}`;
            const rating = data[modeKey]?.last?.rating || 0;
            
            return { ...entry, isLoading: false, rating };
          } catch (e) {
            return { ...entry, isLoading: false, rating: 0, mode: "unrated" as const };
          }
        })
      );
      
      // Sort by rating descending
      updated.sort((a, b) => b.rating - a.rating);
      setLeaderboard(updated);
    };

    fetchStats();
  }, [members, selectedMode]);

  return (
    <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Live Leaderboard
          </h2>
          <p className="text-sm text-[#a0a0a8]">Syncs directly with Chess.com</p>
        </div>
        
        <div className="flex bg-[#0a0a0b] border border-[#2a2a30] rounded-lg p-1">
          <button 
            onClick={() => setSelectedMode("rapid")}
            className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${selectedMode === 'rapid' ? 'bg-[#2a2a30] text-white' : 'text-[#a0a0a8] hover:text-white'}`}
          >
            Rapid
          </button>
          <button 
            onClick={() => setSelectedMode("blitz")}
            className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${selectedMode === 'blitz' ? 'bg-[#2a2a30] text-white' : 'text-[#a0a0a8] hover:text-white'}`}
          >
            Blitz
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry, idx) => (
          <motion.div 
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-xl border ${idx === 0 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-[#2a2a30] bg-[#1a1a1f]'} transition-colors`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              idx === 0 ? 'bg-yellow-500 text-black' : 
              idx === 1 ? 'bg-gray-300 text-black' : 
              idx === 2 ? 'bg-amber-700 text-white' : 
              'bg-[#2a2a30] text-[#a0a0a8]'
            }`}>
              {idx + 1}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${idx === 0 ? 'text-yellow-500' : 'text-white'}`}>
                  {entry.username}
                </span>
                {entry.role === 'owner' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#81b64c]/20 text-[#81b64c]">OWNER</span>
                )}
              </div>
              <div className="text-xs text-[#6b6b75]">
                {entry.chessComUsername ? `@${entry.chessComUsername}` : 'No linked account'}
              </div>
            </div>

            <div className="text-right">
              {entry.isLoading ? (
                <div className="w-12 h-6 bg-[#2a2a30] rounded animate-pulse inline-block"></div>
              ) : entry.rating > 0 ? (
                <div className="text-xl font-bold font-mono text-white">
                  {entry.rating}
                </div>
              ) : (
                <div className="text-sm font-bold text-[#6b6b75] uppercase">
                  Unrated
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {leaderboard.length === 0 && (
          <div className="text-center p-8 text-[#a0a0a8]">
            No members in this club yet.
          </div>
        )}
      </div>
    </div>
  );
}
