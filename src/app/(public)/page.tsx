import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="flex-1 flex flex-col min-h-screen selection:bg-primary/20">
      <header className="w-full flex items-center justify-between px-8 py-6 sticky top-0 bg-background/80 backdrop-blur-2xl z-50 border-b border-white/5">
        <div className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <span>Chessium</span>
        </div>
        <nav className="hidden md:flex gap-10">
          <Link href="/features" className="text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="/openings" className="text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors">Openings</Link>
          <Link href="/learn" className="text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors">Learn</Link>
          <Link href="/pricing" className="text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        <div className="flex gap-4 items-center">
          {user ? (
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 font-medium shadow-none h-9">
              <Link href="/home">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-foreground/80 transition-colors">Sign In</Link>
              <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 font-medium shadow-none h-9">
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto pt-32 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-secondary-foreground mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Stockfish 16.1 Powered
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          Pro-level analysis. <br />
          Beautifully simple.
        </h1>
        
        <p className="text-xl md:text-2xl text-secondary-foreground mb-12 max-w-3xl font-medium leading-relaxed">
          Experience chess on a platform that gets out of your way. Lightning fast engine evaluation, deep insights, and a design that feels effortless.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-14 text-lg font-medium shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_0_60px_rgba(212,175,55,0.4)]">
            <Link href={user ? "/home" : "/signup"}>Start Playing</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg font-medium border-white/10 hover:bg-white/5 bg-transparent shadow-none">
            <Link href="/analyze">Analyze Game</Link>
          </Button>
        </div>

        <div className="mt-32 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 relative bg-surface/50 aspect-video flex items-center justify-center">
           {/* Abstract hero image or board preview */}
           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
           <p className="text-secondary-foreground font-mono text-sm opacity-50">[Hero Board Preview]</p>
        </div>
      </div>
    </main>
  );
}
