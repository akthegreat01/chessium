import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import HeroBoard from "@/components/home/HeroBoard";
import { Bot, Puzzle, LineChart, Hand } from "lucide-react";

export const metadata = {
  title: "Chessium - Play & Analyze Chess",
  description: "Experience chess on a platform that gets out of your way. Lightning fast engine evaluation, deep insights, and a design that feels effortless.",
};

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="flex-1 flex flex-col min-h-screen selection:bg-primary/20 bg-background font-sans">
      <header className="w-full flex items-center justify-between px-6 py-5 sticky top-0 bg-background/95 backdrop-blur-3xl z-50 border-b border-white/5">
        <div className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Chessium</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="/openings" className="text-sm font-bold text-secondary-foreground hover:text-foreground transition-colors">Openings</Link>
          <Link href="/learn" className="text-sm font-bold text-secondary-foreground hover:text-foreground transition-colors">Learn</Link>
          <Link href="/pricing" className="text-sm font-bold text-secondary-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        <div className="flex gap-4 items-center">
          {user ? (
            <Link href="/home" className="text-sm font-bold bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold hover:text-foreground/80 transition-colors">Sign In</Link>
              <Link href="/signup" className="text-sm font-bold bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-[1400px] mx-auto w-full px-6 lg:px-16 gap-16 py-12 lg:py-20">
        
        {/* Left Column: Board */}
        <div className="flex-1 flex justify-center lg:justify-end w-full lg:w-1/2 relative">
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-75 opacity-50 pointer-events-none" />
          <HeroBoard />
        </div>

        {/* Right Column: Copy & Actions */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2">
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-foreground">
            Play Chess Online <br />
            on the <span className="text-primary">#1 Site!</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary-foreground mb-12 max-w-xl font-medium leading-relaxed">
            Experience chess on a beautifully simple platform. Powerful engine analysis, interactive puzzles, and AI opponents.
          </p>
          
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <Link 
              href="/play/ai" 
              className="flex items-center gap-4 bg-primary text-primary-foreground p-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.4)] group"
            >
              <div className="bg-black/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Hand className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-black tracking-tight leading-none mb-1">Play Online</div>
                <div className="text-primary-foreground/80 font-medium text-sm">Play vs a Person (Coming Soon)</div>
              </div>
            </Link>

            <Link 
              href="/play/ai" 
              className="flex items-center gap-4 bg-surface border border-white/10 text-foreground p-4 rounded-2xl hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="bg-white/5 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold tracking-tight leading-none mb-1">Play Computer</div>
                <div className="text-secondary-foreground font-medium text-sm">Practice vs AI Personalities</div>
              </div>
            </Link>

            <Link 
              href="/puzzles" 
              className="flex items-center gap-4 bg-surface border border-white/10 text-foreground p-4 rounded-2xl hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="bg-white/5 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Puzzle className="w-7 h-7 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold tracking-tight leading-none mb-1">Solve Puzzles</div>
                <div className="text-secondary-foreground font-medium text-sm">Improve your tactics</div>
              </div>
            </Link>

            <Link 
              href="/analyze" 
              className="flex items-center gap-4 bg-surface border border-white/10 text-foreground p-4 rounded-2xl hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="bg-white/5 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <LineChart className="w-7 h-7 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold tracking-tight leading-none mb-1">Analyze Game</div>
                <div className="text-secondary-foreground font-medium text-sm">Review your games with Stockfish</div>
              </div>
            </Link>
          </div>
          
        </div>
      </div>
    </main>
  );
}
