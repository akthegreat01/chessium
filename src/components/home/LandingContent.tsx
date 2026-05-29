"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroBoard from "@/components/home/HeroBoard";
import { Bot, Puzzle, LineChart, Hand, Sparkles, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingContent({ user }: { user: any }) {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden w-full px-6">
      
      {/* Cool Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full pointer-events-none opacity-40 mix-blend-screen" />
      
      <div className="flex flex-col lg:flex-row items-center justify-center max-w-[1400px] w-full gap-16 relative z-10 py-10">
        
        {/* Left Copy */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:max-w-2xl"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>The Future of Chess is Here</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
            Outplay Your Opponents with <span className="bg-clip-text bg-gradient-to-r from-primary to-amber-500">Chessium.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-secondary-foreground mb-10 max-w-xl font-medium leading-relaxed">
            Experience chess on a beautifully simple platform. Powerful engine analysis, interactive puzzles, and elite AI opponents.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
            <Link href={user ? "/home" : "/login"}>
              <Button size="lg" className="bg-primary text-primary-foreground font-bold h-14 px-8 text-lg rounded-2xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,185,20,0.3)] hover:shadow-[0_0_40px_rgba(245,185,20,0.5)]">
                Start Playing Now <Zap className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/analyze">
              <Button size="lg" variant="outline" className="bg-surface border-white/10 text-foreground font-bold h-14 px-8 text-lg rounded-2xl hover:bg-white/5 hover:scale-105 transition-all group">
                Analyze a Game <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full opacity-80">
            <FeatureItem icon={<Bot />} label="AI Bots" />
            <FeatureItem icon={<Puzzle />} label="Puzzles" />
            <FeatureItem icon={<LineChart />} label="Analysis" />
            <FeatureItem icon={<Hand />} label="Multiplayer" />
          </div>
        </motion.div>

        {/* Right Board */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="flex-1 w-full max-w-[600px] relative"
        >
          {/* Decorative elements behind the board */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-purple-500/30 blur-2xl rounded-3xl z-0" />
          <div className="absolute inset-0 bg-[#121620] border border-white/10 rounded-[32px] z-10 shadow-2xl p-4 overflow-hidden flex items-center justify-center">
             <div className="w-full aspect-square pointer-events-none">
               <HeroBoard />
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center lg:items-start gap-2 text-secondary-foreground hover:text-foreground transition-colors">
      <div className="[&>svg]:w-6 [&>svg]:h-6">{icon}</div>
      <div className="text-xs font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}
