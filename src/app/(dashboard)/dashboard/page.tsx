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
  const [dailyPuzzle, setDailyPuzzle] = useState<{fen: string, rating: number, turn: string} | null>(null);

  const supabase = createClient();

  // Helper to fetch external ratings
  const fetchExternalRatings = async (chesscom: string, lichess: string) => {
    let rapidVal: number | null = null;
    let rapidLabel = "";
    let puzzleVal: number | null = null;
    let puzzleLabel = "";

    if (chesscom) {
      try {
        const res = await fetch(`https://api.chess.com/pub/player/${chesscom}/stats`);
        if (res.ok) {
          const data = await res.json();
          const rapid = data.chess_rapid?.last?.rating;
          if (rapid) { rapidVal = rapid; rapidLabel = "Chess.com Rapid"; }
          const puzzle = data.tactics?.highest?.rating;
          if (puzzle) { puzzleVal = puzzle; puzzleLabel = "Chess.com Puzzles"; }
        }
      } catch(e) { console.error(e); }
    }
    
    if (lichess && !chesscom) { // Lichess fallback if no chess.com
      try {
        const res = await fetch(`https://lichess.org/api/user/${lichess}`);
        if (res.ok) {
          const data = await res.json();
          const rapid = data.perfs?.rapid?.rating;
          if (rapid) { rapidVal = rapid; rapidLabel = "Lichess Rapid"; }
          const puzzle = data.perfs?.puzzle?.rating;
          if (puzzle) { puzzleVal = puzzle; puzzleLabel = "Lichess Puzzles"; }
        }
      } catch(e) { console.error(e); }
    }
    
    if (rapidVal || puzzleVal) {
      setStats(prev => {
        const newStats = [...prev];
        if (rapidVal) newStats[0] = { ...newStats[0], value: rapidVal, label: rapidLabel };
        if (puzzleVal) newStats[1] = { ...newStats[1], value: puzzleVal, label: puzzleLabel };
        return newStats;
      });
    }
  };

  const fetchExternalGames = async (chesscom: string, lichess: string) => {
    let fetchedGames: any[] = [];
    if (lichess) {
      try {
        const res = await fetch(`https://lichess.org/api/games/user/${lichess}?max=5&pgnInJson=true`, { headers: { Accept: 'application/x-ndjson' }});
        if (res.ok) {
          const text = await res.text();
          const jsonLines = text.split('\n').filter(Boolean).map(line => JSON.parse(line));
          const lichessGames = jsonLines.map((g: any) => ({
            id: g.id,
            player_color: g.players.white.user.id.toLowerCase() === lichess.toLowerCase() ? "white" : "black",
            opponent_name: g.players.white.user.id.toLowerCase() === lichess.toLowerCase() ? g.players.black.user.name : g.players.white.user.name,
            result: g.winner === undefined ? 'draw' : g.winner === (g.players.white.user.id.toLowerCase() === lichess.toLowerCase() ? 'white' : 'black') ? 'win' : 'loss',
            time_control: g.speed,
            created_at: new Date(g.createdAt).toISOString(),
            pgn: g.pgn,
            platform: "lichess"
          }));
          fetchedGames = [...fetchedGames, ...lichessGames];
        }
      } catch(e) {}
    }
    
    if (chesscom) {
      try {
        const res = await fetch(`https://api.chess.com/pub/player/${chesscom}/games/archives`);
        if (res.ok) {
          const data = await res.json();
          const lastArchive = data.archives[data.archives.length - 1];
          if (lastArchive) {
            const res2 = await fetch(lastArchive);
            if (res2.ok) {
              const data2 = await res2.json();
              const last5 = data2.games.slice(-5).reverse();
              const chesscomGames = last5.map((g: any) => ({
                id: g.url,
                player_color: g.white.username.toLowerCase() === chesscom.toLowerCase() ? "white" : "black",
                opponent_name: g.white.username.toLowerCase() === chesscom.toLowerCase() ? g.black.username : g.white.username,
                result: g.white.username.toLowerCase() === chesscom.toLowerCase() 
                  ? (g.white.result === 'win' ? 'win' : (g.white.result === 'repetition' || g.white.result === 'agreed' ? 'draw' : 'loss'))
                  : (g.black.result === 'win' ? 'win' : (g.black.result === 'repetition' || g.black.result === 'agreed' ? 'draw' : 'loss')),
                time_control: g.time_class,
                created_at: new Date(g.end_time * 1000).toISOString(),
                pgn: g.pgn,
                platform: "chesscom"
              }));
              fetchedGames = [...fetchedGames, ...chesscomGames];
            }
          }
        }
      } catch(e) {}
    }
    
    setGames(prev => {
      const merged = [...prev];
      fetchedGames.forEach(fg => {
         if (!merged.find(g => g.id === fg.id)) {
           merged.push(fg);
         }
      });
      return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
    });
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
                fetchExternalGames(data.chess_com_username, data.lichess_username);
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
      } else {
        // Fallback to localStorage if not authenticated
        const savedChesscom = localStorage.getItem("chessium_chesscom_user");
        const savedLichess = localStorage.getItem("chessium_lichess_user");
        if (savedChesscom) setChesscomUsername(savedChesscom);
        if (savedLichess) setLichessUsername(savedLichess);
        
        if (savedChesscom || savedLichess) {
          fetchExternalRatings(savedChesscom || "", savedLichess || "");
          fetchExternalGames(savedChesscom || "", savedLichess || "");
        }
      }
    });

    fetch("/api/puzzle/daily")
      .then(res => res.json())
      .then(data => {
        const chess = new Chess();
        if (data.puzzle && data.puzzle.fen) {
          try {
            chess.load(data.puzzle.fen);
          } catch(e) {
            console.error("Failed to load puzzle FEN", data.puzzle.fen, e);
          }
        }
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
    
    // Always save to localStorage as a fallback
    if (chesscomUsername) localStorage.setItem("chessium_chesscom_user", chesscomUsername);
    if (lichessUsername) localStorage.setItem("chessium_lichess_user", lichessUsername);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        chess_com_username: chesscomUsername,
        lichess_username: lichessUsername
      });
    }
    
    await fetchExternalRatings(chesscomUsername, lichessUsername);
    await fetchExternalGames(chesscomUsername, lichessUsername);
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
                games.map((game, i) => {
                  let analysisUrl = "/analysis";
                  if (game.pgn) {
                    analysisUrl = `/analysis?pgn=${encodeURIComponent(game.pgn)}`;
                  }
                  
                  return (
                  <Link href={analysisUrl} key={game.id || i} className="block">
                    <div
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
                          {game.platform && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#2a2a30] text-[#a0a0a8]">
                              {game.platform === 'lichess' ? 'Lichess' : 'Chess.com'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#6b6b75]">
                          {game.time_control || 'Custom'} • {new Date(game.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <button className="text-sm font-medium text-[#81b64c] hover:text-[#9fcc6b] px-4 py-2 rounded-lg border border-[#2a2a30] hover:border-[#81b64c]/50 transition-colors bg-[#0a0a0b]">
                          Review
                        </button>
                      </div>
                    </div>
                  </Link>
                )})
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
