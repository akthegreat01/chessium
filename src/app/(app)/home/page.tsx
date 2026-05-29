import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot, Search, Puzzle, Trophy, Zap, Gamepad2, Bell, Book, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { StatSparkline, PerformanceChart } from "@/components/home/DashboardCharts";
import { StaticBoard } from "@/components/chess/StaticBoard";

// Helper for generic sparkline data
const genData = (base: number, volatility: number) => {
  return Array.from({ length: 20 }, (_, i) => ({
    value: base + Math.sin(i) * volatility + (i * volatility * 0.1)
  }));
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.email?.split('@')[0] || "Player";

  let analyses: any[] = [];
  if (user) {
    const { data } = await supabase.from("saved_analyses").select("*").order("created_at", { ascending: false });
    if (data) analyses = data;
  }

  // Calculate real stats
  const totalAnalyzed = analyses.length;
  
  const accW = totalAnalyzed > 0 ? analyses.reduce((sum, a) => sum + (parseFloat(a.accuracy_w) || 0), 0) / totalAnalyzed : 0;
  const accB = totalAnalyzed > 0 ? analyses.reduce((sum, a) => sum + (parseFloat(a.accuracy_b) || 0), 0) / totalAnalyzed : 0;
  const avgAcc = totalAnalyzed > 0 ? (accW + accB) / 2 : 0;
  
  const openings = analyses.reduce((acc: any, curr: any) => {
    if (curr.opening_name) {
      if (!acc[curr.opening_name]) acc[curr.opening_name] = { count: 0, eco: '???' };
      acc[curr.opening_name].count += 1;
      // You could extract ECO if you store it, but for now we'll just show the count or default
    }
    return acc;
  }, {});

  const uniqueOpenings = Object.keys(openings).length;

  const topOpenings = Object.entries(openings)
    .sort((a: any, b: any) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, data]: any) => ({ name, count: data.count }));

  const perfData = [...analyses].reverse().slice(-30).map((a, i) => ({
    name: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    rating: (parseFloat(a.accuracy_w) + parseFloat(a.accuracy_b)) / 2 || 0
  }));

  if (perfData.length === 0) {
    // Fallback if no real data
    perfData.push({ name: 'No Data', rating: 0 });
  }

  const todayDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 text-foreground min-h-screen">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, {name}! <span className="text-2xl">👋</span></h1>
          <p className="text-secondary-foreground font-medium">Ready to make your next move?</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-foreground" />
            <input 
              type="text" 
              placeholder="Search games, players, openings..." 
              className="w-full bg-[#121620] border border-[#1e2433] rounded-full pl-10 pr-16 py-2.5 text-sm focus:outline-none focus:border-white/20 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#1e2433] px-2 py-0.5 rounded text-[10px] font-mono text-secondary-foreground">
              <span>⌘</span><span>K</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-[#121620] border border-[#1e2433] hover:bg-[#1e2433]">
            <Bell className="w-4 h-4" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 overflow-hidden border border-[#1e2433]" />
        </div>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Games Analyzed" value={totalAnalyzed.toString()} icon={<Gamepad2 className="w-5 h-5 text-purple-500" />} data={genData(totalAnalyzed, 5)} color="#a855f7" />
        <StatCard title="Avg Accuracy" value={`${avgAcc.toFixed(1)}%`} icon={<Trophy className="w-5 h-5 text-cyan-500" />} data={genData(avgAcc, 2)} color="#06b6d4" />
        <StatCard title="White Accuracy" value={`${accW.toFixed(1)}%`} icon={<Zap className="w-5 h-5 text-primary" />} data={genData(accW, 4)} color="#f5b914" />
        <StatCard title="Openings Explored" value={uniqueOpenings.toString()} icon={<Puzzle className="w-5 h-5 text-green-500" />} data={genData(uniqueOpenings, 2)} color="#22c55e" />
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr_1fr] gap-6">
        
        {/* Quick Actions */}
        <div className="bg-[#121620] border border-[#1e2433] rounded-3xl p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <Link href="/analyze" className="bg-[#0a0d14] border border-[#1e2433] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:border-white/10 transition-colors group">
              <Search className="w-8 h-8 text-secondary-foreground group-hover:text-foreground transition-colors" />
              <div className="text-center">
                <div className="font-bold text-sm">Analyze Game</div>
                <div className="text-[10px] text-secondary-foreground mt-1">Upload or paste a PGN</div>
              </div>
            </Link>
            <Link href="/play/ai" className="bg-[#0a0d14] border border-[#1e2433] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:border-white/10 transition-colors group">
              <Bot className="w-8 h-8 text-secondary-foreground group-hover:text-foreground transition-colors" />
              <div className="text-center">
                <div className="font-bold text-sm">Play vs AI</div>
                <div className="text-[10px] text-secondary-foreground mt-1">Challenge the engine</div>
              </div>
            </Link>
            <Link href="/puzzles" className="col-span-2 bg-[#0a0d14] border border-[#1e2433] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:border-white/10 transition-colors group">
              <Puzzle className="w-8 h-8 text-primary" />
              <div className="text-center">
                <div className="font-bold text-sm">Daily Puzzle</div>
                <div className="text-[10px] text-secondary-foreground mt-1">Keep your streak</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-[#121620] border border-[#1e2433] rounded-3xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Analyses</h2>
            <Link href="/saved-analyses" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">View All</Link>
          </div>
          <div className="flex flex-col gap-4">
            {analyses.slice(0, 5).map((a: any) => (
              <AnalysisRow 
                key={a.id}
                opening={a.opening_name || "Unknown Opening"} 
                eco="N/A" 
                accW={a.accuracy_w} 
                accB={a.accuracy_b} 
                date={new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                fen="start" 
              />
            ))}
            {analyses.length === 0 && (
              <div className="text-secondary-foreground text-sm py-4 text-center">No games analyzed yet. Go import some!</div>
            )}
          </div>
        </div>

        {/* Daily Puzzle */}
        <div className="bg-[#121620] border border-[#1e2433] rounded-3xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Daily Puzzle</h2>
            <div className="text-xs text-secondary-foreground font-medium">{todayDate}</div>
          </div>
          <div className="w-full aspect-square bg-[#0a0d14] rounded-xl overflow-hidden border border-[#1e2433] mb-4 shrink-0 relative">
            <div className="absolute inset-0 z-10 pointer-events-none border border-black/20 rounded-xl" />
            <StaticBoard position="3r3k/2q3pp/8/8/3Q4/2P5/5PPP/3R2K1 w - - 0 1" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-white rounded-sm" />
            <span className="text-sm font-semibold">White to move</span>
          </div>
          <div className="text-sm font-bold text-secondary-foreground mb-4">Mate in 2</div>
          <Button className="w-full rounded-xl bg-primary text-primary-foreground font-bold h-12 shadow-[0_4px_20px_rgba(245,185,20,0.3)] hover:bg-primary/90">
            Solve Puzzle
          </Button>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 pb-10">
        
        {/* Performance Chart */}
        <div className="bg-[#121620] border border-[#1e2433] rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Accuracy Trend</h2>
            <Button variant="outline" size="sm" className="bg-[#0a0d14] border-[#1e2433] rounded-lg text-xs h-8">
              All Time <ChevronRight className="w-3 h-3 ml-1 rotate-90" />
            </Button>
          </div>
          <PerformanceChart data={perfData} />
        </div>

        {/* Opening Explorer */}
        <div className="bg-[#121620] border border-[#1e2433] rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Top Openings Played</h2>
            <Link href="/openings" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">View All</Link>
          </div>
          <div className="flex flex-col gap-5">
            {topOpenings.map((op: any, i: number) => (
              <OpeningRow key={i} name={op.name} winRate={`${op.count} times`} />
            ))}
            {topOpenings.length === 0 && (
              <div className="text-secondary-foreground text-sm py-4 text-center">No openings found.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value, sub, subClass, icon, data, color }: any) {
  return (
    <div className="bg-[#121620] border border-[#1e2433] rounded-2xl p-5 overflow-hidden flex flex-col relative group hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="text-xs font-semibold text-secondary-foreground">{title}</div>
        {icon}
      </div>
      <div className="flex items-baseline gap-2 mt-auto">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {sub && <div className={`text-sm font-bold ${subClass}`}>{sub}</div>}
      </div>
      <StatSparkline data={data} color={color} />
    </div>
  );
}

function AnalysisRow({ opening, eco, accW, accB, date, fen }: any) {
  return (
    <div className="flex items-center gap-4 p-2 -mx-2 rounded-xl hover:bg-[#0a0d14] cursor-pointer transition-colors group">
      <div className="w-12 h-12 bg-[#0a0d14] rounded overflow-hidden shrink-0 pointer-events-none">
        <StaticBoard position={fen} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate text-foreground">{opening}</div>
        <div className="text-[11px] text-secondary-foreground font-mono mt-0.5">{eco}</div>
      </div>
      <div className="hidden sm:flex items-center gap-6">
        <div>
          <div className="text-sm font-bold text-success">{accW}</div>
          <div className="text-[10px] text-secondary-foreground">White</div>
        </div>
        <div>
          <div className="text-sm font-bold text-foreground">{accB}</div>
          <div className="text-[10px] text-secondary-foreground">Black</div>
        </div>
      </div>
      <div className="text-xs font-medium text-secondary-foreground hidden md:block w-24 text-right">{date}</div>
      <ChevronRight className="w-4 h-4 text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function OpeningRow({ name, eco, winRate }: any) {
  return (
    <div className="flex items-center justify-between pb-5 border-b border-[#1e2433] last:border-0 last:pb-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#0a0d14] border border-[#1e2433] flex items-center justify-center shrink-0">
          <Book className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <div className="text-sm font-bold">{name}</div>
          <div className="text-[11px] font-mono text-secondary-foreground mt-0.5">{eco}</div>
        </div>
      </div>
      <div className="text-sm font-bold text-secondary-foreground">{winRate}</div>
    </div>
  );
}
