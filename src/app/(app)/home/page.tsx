import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Bot, Puzzle, ChevronRight, TrendingUp, Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { PerformanceChart } from "@/components/home/DashboardCharts";
import { StaticBoard } from "@/components/chess/StaticBoard";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.email?.split('@')[0] || "Player";

  let analyses: any[] = [];
  if (user) {
    const { data } = await supabase.from("saved_analyses").select("*").order("created_at", { ascending: false });
    if (data) analyses = data;
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

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto text-foreground min-h-screen">
      
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back,</h1>
        <p className="text-secondary-foreground text-[15px]">{name}</p>
      </div>

      {/* Rating Cards Row */}
      {user ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="text-[12px] text-secondary-foreground font-medium mb-2">Rating</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">2113</span>
              <span className="text-[12px] font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> 35
              </span>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="text-[12px] text-secondary-foreground font-medium mb-2">Puzzle</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">836</span>
              <span className="text-[12px] font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> 12
              </span>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="text-[12px] text-secondary-foreground font-medium mb-2">Accuracy</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{avgAcc.toFixed(1)}%</span>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="text-[12px] text-secondary-foreground font-medium mb-2">Games</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{totalAnalyzed}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-8 mb-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-[16px] font-semibold mb-2">Unlock Your Dashboard</h2>
          <p className="text-[13px] text-secondary-foreground mb-4">Create a free account to track your ratings, accuracy, and play history.</p>
          <Link href="/signup">
            <Button className="bg-foreground text-background hover:bg-foreground/90 h-9 px-6 text-[13px] font-medium rounded-lg">
              Sign Up Free
            </Button>
          </Link>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <Link href="/analyze" className="flex-1">
          <Button variant="outline" className="w-full h-11 rounded-xl border-border bg-surface hover:bg-white/[0.06] text-foreground font-semibold text-[13px] gap-2 transition-all">
            <Search className="w-4 h-4" />
            Analyze Game
          </Button>
        </Link>
        <Link href="/play/ai" className="flex-1">
          <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-[13px] gap-2 transition-all">
            <Bot className="w-4 h-4" />
            Play vs AI
          </Button>
        </Link>
      </div>

      {/* Main Content: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">

          {/* Accuracy Trend Chart */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[14px] font-semibold">Accuracy Trend</h2>
              <span className="text-[11px] text-secondary-foreground">Last 30 games</span>
            </div>
            <div className="h-[220px]">
              <PerformanceChart data={perfData} />
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[14px] font-semibold">Recent Analyses</h2>
              <Link href="/saved-analyses" className="text-[12px] text-secondary-foreground hover:text-foreground transition-colors">
                View all
              </Link>
            </div>
            <div className="flex flex-col">
              {analyses.slice(0, 5).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-white/[0.02] -mx-3 px-3 rounded-lg transition-colors cursor-pointer group">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{a.opening_name || "Unknown Opening"}</div>
                    <div className="text-[11px] text-secondary-foreground mt-0.5">
                      {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] font-mono text-secondary-foreground">
                      {parseFloat(a.accuracy_w).toFixed(0)}%
                    </span>
                    <ChevronRight className="w-4 h-4 text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              {analyses.length === 0 && (
                <div className="text-[13px] text-secondary-foreground py-6 text-center">
                  No games analyzed yet. Import a game to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">

          {/* Daily Puzzle */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Puzzle className="w-4 h-4 text-primary" />
                <h2 className="text-[14px] font-semibold">Today&apos;s Puzzle</h2>
              </div>
              <span className="text-[11px] text-secondary-foreground">{todayDate}</span>
            </div>
            <div className="w-full aspect-square rounded-lg overflow-hidden border border-border mb-4">
              <StaticBoard position="3r3k/2q3pp/8/8/3Q4/2P5/5PPP/3R2K1 w - - 0 1" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-sm border border-border" />
                <span className="text-[13px] font-medium">White to move</span>
              </div>
              <span className="text-[12px] text-secondary-foreground">Mate in 2</span>
            </div>
            <Link href="/puzzles">
              <Button className="w-full h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-[13px]">
                Solve Puzzle
              </Button>
            </Link>
          </div>

          {/* Streak & Puzzle Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-xl p-5 text-center">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <div className="text-[11px] text-secondary-foreground font-medium mb-1">Current Streak</div>
              <div className="text-2xl font-bold">0</div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5 text-center">
              <Puzzle className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-[11px] text-secondary-foreground font-medium mb-1">Puzzle Rating</div>
              <div className="text-2xl font-bold">2530</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
