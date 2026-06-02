"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Board from "@/components/chess/Board";
import { Chess } from "chess.js";
import AdSlot from "@/components/ui/AdSlot";

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState<any[]>([
    { label: "Rapid Rating", value: "---", change: "0", trend: "up" },
    { label: "Puzzles Rating", value: "---", change: "0", trend: "up" },
    { label: "Accuracy", value: "---", change: "0%", trend: "up" },
  ]);
  const [games, setGames] = useState<any[]>([]);
  const [dailyPuzzle, setDailyPuzzle] = useState<any>(null);
  
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUsername(data.display_name);
              setStats([
                { label: "Rapid Rating", value: data.rapid_rating || 1200, change: "+0", trend: "up" },
                { label: "Puzzles Rating", value: data.puzzle_rating || 1500, change: "+0", trend: "up" },
                { label: "Games Played", value: data.games_played || 0, change: "", trend: "up" },
              ]);
            }
          });

        supabase
          .from("games")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)
          .then(({ data }) => {
            if (data) setGames(data);
          });
      }
    });

    fetch("https://lichess.org/api/puzzle/daily")
      .then(res => res.json())
      .then(data => {
        const chess = new Chess();
        chess.loadPgn(data.game.pgn);
        setDailyPuzzle({
          fen: chess.fen(),
          rating: data.puzzle.rating,
          turn: chess.turn() === 'w' ? 'White' : 'Black'
        });
      })
      .catch(console.error);

  }, [supabase]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            Welcome back, <span className="text-[#81b64c]">{username || "Player"}</span>
          </h1>
          <p className="text-[#a0a0a8]">Ready to improve your game today?</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/play"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#81b64c] hover:bg-[#9fcc6b] transition-colors shadow-elevated"
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
              {stat.change && (
                <div
                  className={`text-sm font-medium flex items-center mb-1 ${
                    stat.trend === "up" ? "text-[#81b64c]" : "text-[#ca3431]"
                  }`}
                >
                  {stat.trend === "up" ? "↑" : "↓"} {stat.change}
                </div>
              )}
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
            {games.length === 0 ? (
              <div className="p-8 text-center text-[#a0a0a8]">No recent games found. Play a game to see it here!</div>
            ) : (
              games.map((game, i) => (
                <div
                  key={game.id || i}
                  className="flex items-center gap-4 p-4 border-b border-[#2a2a30] last:border-0 hover:bg-[#1a1a1f] transition-colors"
                >
                  <div className="w-12 h-12 bg-[#0a0a0b] rounded-lg flex items-center justify-center text-xl border border-[#2a2a30]">
                    {game.player_color === "white" ? "♔" : "♚"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white truncate">vs {game.opponent_name || "Guest"}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${game.result === 'win' ? 'bg-[#81b64c]/10 text-[#81b64c]' : game.result === 'loss' ? 'bg-[#ca3431]/10 text-[#ca3431]' : 'bg-[#a0a0a8]/10 text-[#a0a0a8]'}`}>
                        {game.result === 'win' ? 'Won' : game.result === 'loss' ? 'Lost' : 'Draw'}
                      </span>
                    </div>
                    <div className="text-xs text-[#6b6b75]">
                      {game.time_control || 'Custom'} • {new Date(game.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-white mb-1">Accuracy</div>
                    <div className="text-xs text-[#81b64c]">{game.accuracy ? `${game.accuracy}%` : 'N/A'}</div>
                  </div>
                  <Link href={`/analysis?pgn=${encodeURIComponent(game.pgn || '')}`} className="p-2 rounded-lg text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </Link>
                </div>
              ))
            )}
          </div>
          <div className="mt-4">
             <AdSlot slot="dashboard-games-bottom" />
          </div>
        </div>

        {/* Daily Puzzle */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Daily Puzzle</h2>
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-4">
            <div className="pointer-events-none mb-4 shadow-elevated rounded-lg overflow-hidden relative">
              <Board position={dailyPuzzle?.fen || "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"} />
              {!dailyPuzzle && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium">Loading puzzle...</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm text-[#a0a0a8] mb-1">{dailyPuzzle?.turn || 'Loading'} to move and win</div>
              <div className="text-xs text-[#6b6b75] mb-4">Rating: {dailyPuzzle ? `~${dailyPuzzle.rating}` : '...'}</div>
              <Link
                href="/puzzles/daily"
                className="block w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#81b64c] hover:bg-[#9fcc6b] transition-colors shadow-elevated"
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
