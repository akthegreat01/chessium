"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Member {
  id: string;
  username: string;
  chessComUsername: string | null;
  lichessUsername?: string | null;
  role: string;
}

interface LeaderboardEntry extends Member {
  rating: number;
  mode: "rapid" | "blitz" | "bullet" | "unrated";
  isLoading: boolean;
  ratingSource?: "chesscom" | "lichess" | "";
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
      isLoading: true,
      ratingSource: "" as const
    }));
    setLeaderboard(initial);

    // Fetch stats for each member with a chess.com or lichess username
    const fetchStats = async () => {
      const updated = await Promise.all(
        initial.map(async (entry) => {
          let rating = 0;
          let ratingSource: "chesscom" | "lichess" | "" = "";

          // Try Chess.com first if connected
          if (entry.chessComUsername) {
            try {
              const res = await fetch(`https://api.chess.com/pub/player/${entry.chessComUsername}/stats`);
              if (res.ok) {
                const data = await res.json();
                const modeKey = `chess_${selectedMode}`;
                const r = data[modeKey]?.last?.rating;
                if (r) {
                  rating = r;
                  ratingSource = "chesscom";
                }
              }
            } catch (e) {
              console.error("Chess.com rating fetch failed for", entry.chessComUsername, e);
            }
          }

          // Fall back to Lichess if Chess.com rating is not found and Lichess is connected
          if (rating === 0 && entry.lichessUsername) {
            try {
              const res = await fetch(`/api/lichess/user/${entry.lichessUsername}`);
              if (res.ok) {
                const data = await res.json();
                const modeKey = selectedMode === "rapid" ? "rapid" : "blitz";
                const r = data.perfs?.[modeKey]?.rating;
                if (r) {
                  rating = r;
                  ratingSource = "lichess";
                }
              }
            } catch (e) {
              console.error("Lichess rating fetch failed for", entry.lichessUsername, e);
            }
          }

          const resolvedMode = ratingSource !== "" ? (rating > 0 ? selectedMode : "unrated" as const) : "unrated" as const;

          return {
            ...entry,
            isLoading: false,
            rating,
            mode: resolvedMode,
            ratingSource
          };
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
          <p className="text-sm text-[#a0a0a8]">Syncs with Chess.com & Lichess</p>
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
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2">
                <span className={`font-bold ${idx === 0 ? 'text-yellow-500' : 'text-white'} truncate`}>
                  {entry.username}
                </span>
                {entry.role === 'owner' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#81b64c]/20 text-[#81b64c]">OWNER</span>
                )}
                {entry.ratingSource === "chesscom" && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/25">Chess.com</span>
                )}
                {entry.ratingSource === "lichess" && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#a855f7]/10 text-[#c084fc] border border-[#a855f7]/25">Lichess</span>
                )}
              </div>
              <div className="text-xs text-[#6b6b75] flex flex-wrap gap-x-2 gap-y-1 mt-0.5">
                {entry.chessComUsername && <span>♟️ Chess.com: @{entry.chessComUsername}</span>}
                {entry.lichessUsername && <span>🐴 Lichess: @{entry.lichessUsername}</span>}
                {!entry.chessComUsername && !entry.lichessUsername && <span>No linked account</span>}
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
                <div className="text-xs font-bold text-[#6b6b75] uppercase">
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
