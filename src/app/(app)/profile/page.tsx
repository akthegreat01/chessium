import React from "react";
import { User, Activity, Trophy, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.email?.split('@')[0] || "Player";

  let analyses: any[] = [];
  if (user) {
    const { data } = await supabase.from("saved_analyses").select("*");
    if (data) analyses = data;
  }
  const totalAnalyzed = analyses.length;

  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto min-h-screen flex flex-col md:flex-row gap-8">
      
      {/* Left Column - Profile Info */}
      <div className="w-full md:w-[300px] shrink-0 flex flex-col gap-6">
        <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-background border border-border flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-secondary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-1">{name}</h1>
          <p className="text-[13px] text-secondary-foreground mb-6">{user?.email || "Guest Account"}</p>
          
          <Button variant="outline" className="w-full h-9 rounded-lg text-[13px] font-medium border-border hover:bg-white/5">
            Edit Profile
          </Button>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-[14px] font-semibold mb-4">Overview</h2>
          <div className="flex flex-col gap-4 text-[13px]">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-secondary-foreground">Member Since</span>
              <span className="font-mono">May 2025</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-secondary-foreground">Games Analyzed</span>
              <span className="font-mono">{totalAnalyzed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-foreground">Time Played</span>
              <span className="font-mono">42h 15m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Stats & Achievements */}
      <div className="flex-1 flex flex-col gap-6">
        {user ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 text-[12px] text-secondary-foreground font-medium mb-3">
                <Activity className="w-4 h-4 text-emerald-400" /> Rapid Rating
              </div>
              <div className="text-4xl font-bold tracking-tight">2113</div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 text-[12px] text-secondary-foreground font-medium mb-3">
                <Star className="w-4 h-4 text-primary" /> Puzzle Rating
              </div>
              <div className="text-4xl font-bold tracking-tight">2530</div>
            </div>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center h-[140px]">
            <h2 className="text-[16px] font-semibold mb-2">Unlock Your Stats</h2>
            <p className="text-[13px] text-secondary-foreground mb-4">Create a free account to track your ratings and progress.</p>
            <a href="/signup" className="text-[13px] font-medium text-primary hover:underline">Sign up now →</a>
          </div>
        )}

        <div className="bg-surface border border-border rounded-xl p-6 flex-1">
          <h2 className="text-[14px] font-semibold mb-6 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" /> Recent Achievements
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { title: "Tactician", desc: "Solve 50 puzzles in a row.", date: "2 days ago" },
              { title: "Flawless Victory", desc: "Win a game with 99%+ accuracy.", date: "1 week ago" },
              { title: "Marathon", desc: "Analyze 100 games.", date: "1 month ago" }
            ].map((ach, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg bg-background border border-border">
                <div className="w-10 h-10 rounded bg-surface border border-border flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-primary opacity-80" />
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-semibold text-[14px]">{ach.title}</h3>
                    <span className="text-[11px] text-secondary-foreground">{ach.date}</span>
                  </div>
                  <p className="text-[13px] text-secondary-foreground">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
