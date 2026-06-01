import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Bot, Puzzle, ChevronRight, TrendingUp, Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { PerformanceChart } from "@/components/home/DashboardCharts";
import { StaticBoard } from "@/components/chess/StaticBoard";
import DashboardImportButton from "@/components/home/DashboardImportButton";
import ChessComConnect from "@/components/home/ChessComConnect";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.display_name || user?.email?.split('@')[0] || "Player";
  
  const chesscomUsername = user?.user_metadata?.chesscom_username;

  let analyses: any[] = [];
  let profile = null;
  if (user) {
    const { data: pData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (pData) profile = pData;

    const { data: aData } = await supabase.from("saved_analyses").select("*").order("created_at", { ascending: false });
    if (aData) analyses = aData;
  }

  const totalAnalyzed = analyses.length;
  const accW = totalAnalyzed > 0 ? analyses.reduce((sum, a) => sum + (parseFloat(a.accuracy_w) || 0), 0) / totalAnalyzed : 0;
  const accB = totalAnalyzed > 0 ? analyses.reduce((sum, a) => sum + (parseFloat(a.accuracy_b) || 0), 0) / totalAnalyzed : 0;
  const avgAcc = totalAnalyzed > 0 ? (accW + accB) / 2 : 0;

  const perfData = [...analyses].reverse().slice(-30).map((a) => ({
    name: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    rating: (parseFloat(a.accuracy_w) + parseFloat(a.accuracy_b)) / 2 || 0
  }));
  if (perfData.length === 0) perfData.push({ name: 'No Data', rating: 0 });

  const todayDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());

  let rapidRating = profile?.rapid_rating || 1200;
  let blitzRating = 1200;
  let puzzleRating = profile?.puzzle_rating || 1200;

  if (chesscomUsername) {
    try {
      const res = await fetch(`https://api.chess.com/pub/player/${chesscomUsername}/stats`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const stats = await res.json();
        if (stats.chess_rapid?.last?.rating) rapidRating = stats.chess_rapid.last.rating;
        if (stats.chess_blitz?.last?.rating) blitzRating = stats.chess_blitz.last.rating;
        if (stats.tactics?.highest?.rating) puzzleRating = stats.tactics.highest.rating;
      }
    } catch (err) {
      console.error("Failed to fetch chess.com stats", err);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto text-foreground min-h-screen relative">
      
      {/* Abstract Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Welcome Header */}
      <div className="mb-10 relative">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Welcome back,</h1>
        <p className="text-secondary-foreground/80 font-medium tracking-wide">{name}</p>
      </div>

      {!chesscomUsername && user && <ChessComConnect />}

      {/* Rating Cards Row */}
      {user ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
          {[
            { label: "Rapid Rating", value: rapidRating, icon: "🔥", color: "from-blue-500/20 to-blue-600/5", border: "group-hover:border-blue-500/50" },
            { label: "Blitz Rating", value: blitzRating, icon: "⚡", color: "from-purple-500/20 to-purple-600/5", border: "group-hover:border-purple-500/50" },
            { label: "Accuracy", value: `${avgAcc.toFixed(1)}%`, icon: "🎯", color: "from-emerald-500/20 to-emerald-600/5", border: "group-hover:border-emerald-500/50" },
            { label: "Analyzed Games", value: totalAnalyzed, icon: "📈", color: "from-orange-500/20 to-orange-600/5", border: "group-hover:border-orange-500/50" },
          ].map((stat, i) => (
            <div key={i} className={`group relative bg-white/[0.02]  border border-white/10 rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 ${stat.border}`}>
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-center justify-between mb-3">
                <div className="text-[12px] uppercase tracking-wider text-secondary-foreground/70 font-semibold">{stat.label}</div>
                <div className="text-lg opacity-80">{stat.icon}</div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-300">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/[0.02]  border border-white/10 rounded-2xl p-10 mb-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <h2 className="text-xl font-bold mb-3 text-white">Unlock Your Dashboard</h2>
          <p className="text-[14px] text-secondary-foreground/80 mb-6 max-w-sm">Create a free account to automatically track your ratings, accuracy, and full play history.</p>
          <Link href="/signup">
            <Button className="bg-white text-black hover:bg-white/90 h-10 px-8 text-[14px] font-bold rounded-full shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-105 transition-all">
              Sign Up Free
            </Button>
          </Link>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-10">
        <div className="flex-1 w-full">
          <DashboardImportButton />
        </div>
        <Link href="/analyze" className="flex-1">
          <Button variant="outline" className="w-full h-12 rounded-full border-white/10 bg-white/[0.03]  hover:bg-white/[0.08] text-white font-bold tracking-wide text-[14px] gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <Search className="w-4 h-4" />
            Analyze Game
          </Button>
        </Link>
        <Link href="/play/ai" className="flex-1">
          <Button className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-indigo-600 text-white hover:opacity-90 font-bold tracking-wide text-[14px] gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 border border-primary/50">
            <Bot className="w-4 h-4" />
            Play vs AI
          </Button>
        </Link>
      </div>

      {/* Main Content: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        
        {/* Left Column */}
        <div className="flex flex-col gap-8">

          {/* Accuracy Trend Chart */}
          <div className="bg-white/[0.02]  border border-white/10 rounded-2xl p-7 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-[16px] font-bold tracking-wide text-white">Accuracy Trend</h2>
              <span className="text-[12px] uppercase tracking-wider font-semibold text-secondary-foreground/60">Last 30 games</span>
            </div>
            <div className="h-[240px] relative z-10">
              <PerformanceChart data={perfData} />
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="bg-white/[0.02]  border border-white/10 rounded-2xl p-7 hover:border-white/20 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[16px] font-bold tracking-wide text-white">Recent Analyses</h2>
              <Link href="/saved-analyses" className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group/link">
                View all <ChevronRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {analyses.slice(0, 5).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/10 rounded-xl transition-all cursor-pointer group">
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-white/90 truncate group-hover:text-white transition-colors">{a.opening_name || "Unknown Opening"}</div>
                    <div className="text-[12px] text-secondary-foreground/70 mt-1 font-medium">
                      {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center justify-center w-12 h-8 rounded-md bg-white/5 border border-white/10 text-[13px] font-mono font-bold text-white group-hover:border-primary/30 group-hover:text-primary transition-all">
                      {parseFloat(a.accuracy_w).toFixed(0)}%
                    </div>
                    <ChevronRight className="w-4 h-4 text-secondary-foreground/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
              {analyses.length === 0 && (
                <div className="text-[14px] text-secondary-foreground/60 py-10 text-center bg-white/[0.02] rounded-xl border border-dashed border-white/10">
                  No games analyzed yet. Import a game to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">

          {/* Daily Puzzle */}
          <div className="bg-white/[0.02]  border border-white/10 rounded-2xl p-7 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-orange-500/20 text-orange-400">
                  <Puzzle className="w-4 h-4" />
                </div>
                <h2 className="text-[16px] font-bold tracking-wide text-white">Daily Puzzle</h2>
              </div>
              <span className="text-[12px] uppercase tracking-wider font-semibold text-secondary-foreground/60">{todayDate}</span>
            </div>
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-white/10 mb-5 relative z-10 shadow-2xl shadow-black/40">
              <StaticBoard position="3r3k/2q3pp/8/8/3Q4/2P5/5PPP/3R2K1 w - - 0 1" />
            </div>
            <div className="flex items-center justify-between mb-6 relative z-10 bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-sm shadow-sm" />
                <span className="text-[13px] font-bold text-white/90">White to move</span>
              </div>
              <span className="text-[13px] font-bold text-orange-400">Mate in 2</span>
            </div>
            <Link href="/puzzles" className="relative z-10 block">
              <Button className="w-full h-11 rounded-full bg-white text-black hover:bg-white/90 font-bold text-[14px] shadow-lg hover:shadow-white/20 transition-all hover:-translate-y-0.5">
                Solve Puzzle
              </Button>
            </Link>
          </div>

          {/* Streak & Puzzle Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02]  border border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.04] transition-colors group">
              <div className="w-10 h-10 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-[12px] uppercase tracking-wider text-secondary-foreground/70 font-semibold mb-1">Streak</div>
              <div className="text-3xl font-extrabold text-white">{profile?.puzzle_streak || 0}</div>
            </div>
            <div className="bg-white/[0.02]  border border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.04] transition-colors group">
              <div className="w-10 h-10 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Puzzle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-[12px] uppercase tracking-wider text-secondary-foreground/70 font-semibold mb-1">Rating</div>
              <div className="text-3xl font-extrabold text-white">{puzzleRating}</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
