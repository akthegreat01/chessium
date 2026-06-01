import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot, LineChart, Puzzle, Play, UserCircle } from "lucide-react";
import { StaticBoard } from "@/components/chess/StaticBoard";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Chess Online | Challenge AI Bots & Improve",
  description: "Play chess against personalized AI bots ranging from beginner to Grandmaster. Improve your game without the pressure of human opponents.",
  openGraph: {
    title: "Play Chess Online | Challenge AI Bots",
    description: "Play chess against personalized AI bots ranging from beginner to Grandmaster.",
    url: "https://chessium.in/play",
  }
};

export default function PlayMenuPage() {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto min-h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row items-stretch justify-center w-full gap-10">
        
        {/* Left Side: Massive Board */}
        <div className="flex-1 max-w-[800px] aspect-square rounded-[8px] overflow-hidden shadow-2xl shrink-0 pointer-events-none border border-border bg-card">
          <StaticBoard position="start" />
        </div>

        {/* Right Side: Play Menu */}
        <div className="w-full lg:w-[450px] bg-card border border-border rounded-[24px] p-8 flex flex-col shrink-0">
          
          <div className="flex justify-center items-center gap-3 mb-10 pb-6 border-b border-border">
            <Play className="w-8 h-8 text-foreground fill-current" />
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Play Chess</h1>
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/play/ai" className="flex items-center gap-5 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border hover:border-border/80 transition-colors group">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 rounded-xl shrink-0">
                <Bot className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground mb-0.5">Play Bots</div>
                <div className="text-sm font-medium text-secondary-foreground">Challenge a bot from Easy to Master</div>
              </div>
            </Link>

            <Link href="/puzzles" className="flex items-center gap-5 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border hover:border-border/80 transition-colors group">
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-500/10 rounded-xl shrink-0">
                <Puzzle className="w-7 h-7 text-yellow-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground mb-0.5">Solve Puzzles</div>
                <div className="text-sm font-medium text-secondary-foreground">Improve your tactical vision</div>
              </div>
            </Link>

            <Link href="/analyze" className="flex items-center gap-5 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border hover:border-border/80 transition-colors group">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-500/10 rounded-xl shrink-0">
                <LineChart className="w-7 h-7 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground mb-0.5">Analyze Game</div>
                <div className="text-sm font-medium text-secondary-foreground">Review your games with Stockfish</div>
              </div>
            </Link>

            <Link href="/openings" className="flex items-center gap-5 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border hover:border-border/80 transition-colors group mt-2 opacity-50 hover:opacity-100">
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-xl shrink-0">
                <UserCircle className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground mb-0.5">Play a Friend</div>
                <div className="text-sm font-medium text-secondary-foreground">Online multiplayer coming soon</div>
              </div>
            </Link>
          </div>
          
        </div>

      </div>
    </div>
  );
}
