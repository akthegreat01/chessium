"use client";

import React from "react";
import { BookOpen, Swords, Shield, Crown, Play, ChevronRight, Lock } from "lucide-react";
import { AdUnit } from "@/components/ui/AdUnit";
import { Button } from "@/components/ui/button";

const chapters = [
  {
    id: 1,
    title: "Basic Principles",
    description: "Master the center, develop your pieces, and ensure king safety. The foundation of every grandmaster.",
    icon: Shield,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    modules: 5,
    isLocked: false,
  },
  {
    id: 2,
    title: "Tactical Motifs",
    description: "Forks, pins, skewers, and discovered attacks. Learn how to win material by force.",
    icon: Swords,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    modules: 12,
    isLocked: false,
  },
  {
    id: 3,
    title: "Endgame Essentials",
    description: "The opposition, Lucena position, and Philidor position. Convert winning advantages flawlessly.",
    icon: Crown,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    modules: 8,
    isLocked: true,
  },
];

export default function StudiesPage() {
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-80px)] p-6 bg-background">
      <div className="max-w-[1200px] mx-auto h-full flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center gap-5 bg-surface/50 p-8 rounded-[32px] border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 relative z-10 shadow-inner border border-primary/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-1">Chess Studies</h1>
            <p className="text-secondary-foreground text-base max-w-xl">
              Elevate your game with interactive lessons, deep tactical motifs, and master-level endgame analysis.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Chapters Column */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-xl font-bold px-2">Available Courses</h2>
            
            <div className="flex flex-col gap-4">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="bg-surface border border-border rounded-[24px] p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:border-white/10 hover:bg-white/[0.02] transition-all group">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${chapter.bg} ${chapter.color}`}>
                    <chapter.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-foreground">{chapter.title}</h3>
                      {chapter.isLocked && (
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold bg-white/5 px-2 py-0.5 rounded text-secondary-foreground">
                          <Lock className="w-3 h-3" /> Pro
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-secondary-foreground mb-3">{chapter.description}</p>
                    <div className="text-xs font-semibold text-white/40">
                      {chapter.modules} Interactive Modules
                    </div>
                  </div>

                  <Button 
                    variant={chapter.isLocked ? "outline" : "default"} 
                    className={`shrink-0 rounded-xl font-bold h-12 px-6 ${chapter.isLocked ? "bg-transparent border-white/10 text-white/50" : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.3)]"}`}
                  >
                    {chapter.isLocked ? "Unlock Premium" : "Start Course"} <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Mid-Content Ad Unit */}
            <div className="w-full bg-white/[0.01] border border-white/5 p-4 rounded-[24px] mt-4">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Sponsored Content</span>
              </div>
              <AdUnit className="w-full min-h-[150px] rounded-2xl" />
            </div>

            {/* Coming Soon */}
            <div className="bg-surface/30 border border-dashed border-border rounded-[24px] p-8 flex flex-col items-center justify-center text-center mt-4">
              <h2 className="text-lg font-bold text-white/50 mb-2">More Courses Coming Soon</h2>
              <p className="text-sm text-secondary-foreground max-w-md">
                We are constantly working with Grandmasters to bring you new openings, middle-game plans, and psychological warfare tactics.
              </p>
            </div>
          </div>

          {/* Right Rail Ads & Promos */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
            <AdUnit className="w-full min-h-[300px] rounded-[24px]" />
            
            <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 rounded-[24px] p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl" />
              <h3 className="text-[16px] font-bold text-white mb-2">Daily Puzzle Challenge</h3>
              <p className="text-[13px] text-white/60 mb-5">Solve 3 puzzles in a row without making a mistake to earn a streak multiplier.</p>
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold border border-white/5">
                <Play className="w-4 h-4 mr-2" /> Play Puzzles
              </Button>
            </div>

            <AdUnit className="w-full min-h-[600px] rounded-[24px]" />
          </div>
          
        </div>
      </div>
    </div>
  );
}
