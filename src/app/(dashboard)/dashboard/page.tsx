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
  const [chesscomUsername, setChesscomUsername] = useState("");
  const [lichessUsername, setLichessUsername] = useState("");
  const [isSavingAccounts, setIsSavingAccounts] = useState(false);

  const supabase = createClient();

  // Helper to fetch external ratings
  const fetchExternalRatings = async (chesscom: string, lichess: string) => {
    const newStats = [...stats];
    
    if (chesscom) {
      try {
        const res = await fetch(`https://api.chess.com/pub/player/${chesscom}/stats`);
        if (res.ok) {
          const data = await res.json();
          const rapid = data.chess_rapid?.last?.rating;
          if (rapid) {
            newStats[0] = { ...newStats[0], value: rapid, label: "Chess.com Rapid" };
          }
          const puzzle = data.tactics?.highest?.rating;
          if (puzzle) {
            newStats[1] = { ...newStats[1], value: puzzle, label: "Chess.com Puzzles" };
          }
        }
      } catch(e) { console.error(e); }
    }
    
    if (lichess && !chesscom) { // Lichess fallback if no chess.com
      try {
        const res = await fetch(`https://lichess.org/api/user/${lichess}`);
        if (res.ok) {
          const data = await res.json();
          const rapid = data.perfs?.rapid?.rating;
          if (rapid) {
            newStats[0] = { ...newStats[0], value: rapid, label: "Lichess Rapid" };
          }
          const puzzle = data.perfs?.puzzle?.rating;
          if (puzzle) {
            newStats[1] = { ...newStats[1], value: puzzle, label: "Lichess Puzzles" };
          }
        }
      } catch(e) { console.error(e); }
    }
    
    setStats(newStats);
  };

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
              setChesscomUsername(data.chess_com_username || "");
              setLichessUsername(data.lichess_username || "");
              
              const localStats = [
                { label: "Rapid Rating", value: data.rapid_rating || 1200, change: "+0", trend: "up" },
                { label: "Puzzles Rating", value: data.puzzle_rating || 1500, change: "+0", trend: "up" },
                { label: "Games Played", value: data.games_played || 0, change: "", trend: "up" },
              ];
              setStats(localStats);
              
              if (data.chess_com_username || data.lichess_username) {
                fetchExternalRatings(data.chess_com_username, data.lichess_username);
              }
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
        const pgn = data.game.pgn;
        // Parse PGN strictly just to get the FEN up to the puzzle start
        chess.loadPgn(pgn);
        setDailyPuzzle({
          fen: chess.fen(),
          rating: data.puzzle.rating,
          turn: chess.turn() === 'w' ? 'White' : 'Black'
        });
      })
      .catch(console.error);

  }, [supabase]);

  const saveAccounts = async () => {
    setIsSavingAccounts(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        chess_com_username: chesscomUsername,
        lichess_username: lichessUsername
      }).eq("id", user.id);
      
      await fetchExternalRatings(chesscomUsername, lichessUsername);
    }
    setIsSavingAccounts(false);
  };

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
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Connected Accounts */}
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated">
            <h2 className="text-xl font-bold text-white mb-4">Connected Accounts</h2>
            <p className="text-[#a0a0a8] text-sm mb-6">Link your Chess.com or Lichess accounts to automatically sync your ratings.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#a0a0a8] mb-2">Chess.com Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-xl">♟️</span>
                  </div>
                  <input
                    type="text"
                    value={chesscomUsername}
                    onChange={(e) => setChesscomUsername(e.target.value)}
                    className="bg-[#0a0a0b] border border-[#2a2a30] text-white text-sm rounded-xl focus:ring-[#81b64c] focus:border-[#81b64c] block w-full pl-10 p-2.5 outline-none transition-colors"
                    placeholder="e.g. hikaru"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a0a0a8] mb-2">Lichess Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-xl">🐴</span>
                  </div>
                  <input
                    type="text"
                    value={lichessUsername}
                    onChange={(e) => setLichessUsername(e.target.value)}
                    className="bg-[#0a0a0b] border border-[#2a2a30] text-white text-sm rounded-xl focus:ring-[#81b64c] focus:border-[#81b64c] block w-full pl-10 p-2.5 outline-none transition-colors"
                    placeholder="e.g. drnykterstein"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={saveAccounts}
                disabled={isSavingAccounts}
                className="bg-[#81b64c] hover:bg-[#9fcc6b] disabled:bg-[#2a2a30] disabled:text-[#6b6b75] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-elevated"
              >
                {isSavingAccounts ? "Syncing..." : "Save & Sync Ratings"}
              </button>
            </div>
          </div>

          {/* Recent Games */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Games</h2>
              <Link href="/games" className="text-sm text-[#81b64c] hover:text-[#9fcc6b] font-medium">
                View All
              </Link>
            </div>
            <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden shadow-elevated">
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
        </div>

        {/* Right Column: Daily Puzzle */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Daily Puzzle</h2>
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-5 shadow-elevated">
            <div className="pointer-events-none mb-5 rounded-xl overflow-hidden shadow-inner border border-[#2a2a30] relative">
              <Board position={dailyPuzzle?.fen || "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"} />
              {!dailyPuzzle && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-medium flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#81b64c]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading puzzle...
                  </span>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-white mb-1">{dailyPuzzle?.turn || 'Loading'} to move and win</div>
              <div className="text-xs text-[#a0a0a8] mb-5">Rating: {dailyPuzzle ? `~${dailyPuzzle.rating}` : '...'}</div>
              <Link
                href="/puzzles/daily"
                className="block w-full py-3 rounded-xl text-sm font-bold text-white bg-[#81b64c] hover:bg-[#9fcc6b] transition-all shadow-elevated hover:-translate-y-0.5"
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
