import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import HeroBoard from "@/components/home/HeroBoard";
import { Bot, Puzzle, LineChart, Hand } from "lucide-react";
import LandingContent from "@/components/home/LandingContent";

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
        <div className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Chessium Logo" className="w-full h-full object-contain" />
          </div>
          <span className="tracking-[0.2em] uppercase text-xl">Chessium</span>
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

      <LandingContent user={user} />
    </main>
  );
}
