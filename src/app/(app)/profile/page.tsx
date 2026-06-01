import React from "react";
import { User, Activity, Trophy, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.display_name || user?.email?.split('@')[0] || "Player";
  const chesscomUsername = user?.user_metadata?.chesscom_username;

  let analyses: any[] = [];
  if (user) {
    const { data } = await supabase.from("saved_analyses").select("*");
    if (data) analyses = data;
  }
  const totalAnalyzed = analyses.length;

  let rapidRating = 1200;
  let puzzleRating = 1200;

  if (chesscomUsername) {
    try {
      const res = await fetch(`https://api.chess.com/pub/player/${chesscomUsername}/stats`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const stats = await res.json();
        if (stats.chess_rapid?.last?.rating) rapidRating = stats.chess_rapid.last.rating;
        if (stats.tactics?.highest?.rating) puzzleRating = stats.tactics.highest.rating;
      }
    } catch (err) {
      console.error("Failed to fetch chess.com stats", err);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-[1000px] mx-auto min-h-screen flex flex-col gap-8 relative">
      
      {/* Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Banner Area */}
      <div className="w-full h-48 rounded-3xl bg-gradient-to-r from-primary/80 to-indigo-600/80 overflow-hidden relative border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 -mt-20 relative z-10 px-4 md:px-8">
        
        {/* Left Column - Profile Info */}
        <div className="w-full md:w-[320px] shrink-0 flex flex-col gap-6">
          <div className="bg-white/[0.02]  border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl">
            <div className="w-32 h-32 rounded-full bg-background border-4 border-white/10 flex items-center justify-center mb-6 shadow-2xl overflow-hidden relative">
              <User className="w-12 h-12 text-white/50" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-1 text-white">{name}</h1>
            <p className="text-[14px] text-secondary-foreground/70 mb-8 font-medium">{user?.email || "Guest Account"}</p>
            
            <Button variant="outline" className="w-full h-11 rounded-full text-[14px] font-bold border-white/10 hover:bg-white/10 text-white transition-all">
              Edit Profile
            </Button>
          </div>

          <div className="bg-white/[0.02]  border border-white/10 rounded-3xl p-7">
            <h2 className="text-[14px] uppercase tracking-wider font-bold mb-6 text-white/90">Overview</h2>
            <div className="flex flex-col gap-5 text-[14px] font-medium">
              <div className="flex justify-between items-center pb-5 border-b border-white/10">
                <span className="text-secondary-foreground/70">Member Since</span>
                <span className="text-white">May 2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-foreground/70">Games Analyzed</span>
                <span className="text-white font-bold">{totalAnalyzed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="flex-1 flex flex-col gap-6 pt-20 md:pt-0">
          {user ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white/[0.02]  border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-colors pointer-events-none" />
                <div className="flex items-center gap-3 text-[13px] uppercase tracking-wider text-secondary-foreground/80 font-bold mb-4 relative z-10">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  Rapid Rating
                </div>
                <div className="text-5xl font-extrabold tracking-tight text-white relative z-10">{rapidRating}</div>
              </div>
              
              <div className="bg-white/[0.02]  border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-colors pointer-events-none" />
                <div className="flex items-center gap-3 text-[13px] uppercase tracking-wider text-secondary-foreground/80 font-bold mb-4 relative z-10">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Star className="w-5 h-5" />
                  </div>
                  Puzzle Rating
                </div>
                <div className="text-5xl font-extrabold tracking-tight text-white relative z-10">{puzzleRating}</div>
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.02]  border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center h-[240px]">
              <h2 className="text-xl font-bold mb-3 text-white">Unlock Your Stats</h2>
              <p className="text-[14px] text-secondary-foreground/70 mb-6">Create a free account to track your ratings and progress globally.</p>
              <a href="/signup">
                <Button className="bg-white text-black hover:bg-white/90 h-11 px-8 rounded-full font-bold text-[14px] shadow-lg">
                  Sign up now
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
