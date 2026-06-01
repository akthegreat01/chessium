"use client";

import React, { useState } from "react";
import { useChessComStats } from "@/hooks/useChessComStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Zap, Flame, Target } from "lucide-react";

export default function ChessComConnect() {
  const { username, stats, loading, error, saveUsername, clearUsername } = useChessComStats();
  const [inputVal, setInputVal] = useState(username || "");

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      saveUsername(inputVal.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-24 px-6 relative">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#829969]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-surface/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[32px] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center justify-center gap-3">
            <Image src="/chesscom_logo.png" alt="Chess.com" width={32} height={32} className="w-8 h-8 rounded bg-[#829969] p-1" />
            Connect Chess.com
          </h2>
          <p className="text-secondary-foreground">
            Sync your real-time ELO ratings to display them during matches and track your progress.
          </p>
        </div>

        {!username ? (
          <form onSubmit={handleConnect} className="max-w-md mx-auto flex flex-col gap-4">
            <Input 
              placeholder="Enter your Chess.com username" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="h-14 text-lg bg-background border-white/20 focus-visible:ring-[#829969]"
            />
            <Button 
              type="submit" 
              className="h-14 text-lg font-bold bg-[#829969] hover:bg-[#829969]/90 text-white"
              disabled={!inputVal.trim()}
            >
              Connect Account
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xl font-bold text-foreground">Connected as <span className="text-[#829969]">{username}</span></span>
              <Button variant="outline" size="sm" onClick={clearUsername} className="h-8 text-xs border-white/20">
                Disconnect
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-secondary-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                Fetching stats...
              </div>
            ) : error ? (
              <div className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">
                {error}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                <div className="bg-background/80 border border-border p-6 rounded-2xl flex flex-col items-center gap-2 shadow-inner">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <span className="text-sm font-semibold text-secondary-foreground uppercase tracking-widest">Blitz</span>
                  <span className="text-3xl font-black">{stats.blitz || "N/A"}</span>
                </div>
                <div className="bg-background/80 border border-border p-6 rounded-2xl flex flex-col items-center gap-2 shadow-inner">
                  <Target className="w-6 h-6 text-green-500" />
                  <span className="text-sm font-semibold text-secondary-foreground uppercase tracking-widest">Rapid</span>
                  <span className="text-3xl font-black">{stats.rapid || "N/A"}</span>
                </div>
                <div className="bg-background/80 border border-border p-6 rounded-2xl flex flex-col items-center gap-2 shadow-inner">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <span className="text-sm font-semibold text-secondary-foreground uppercase tracking-widest">Bullet</span>
                  <span className="text-3xl font-black">{stats.bullet || "N/A"}</span>
                </div>
              </div>
            ) : (
              <div className="text-secondary-foreground">No stats found.</div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
