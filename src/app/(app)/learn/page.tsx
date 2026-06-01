import React from "react";
import { GraduationCap, Shield, Target, BookOpen, Lock } from "lucide-react";
import Link from "next/link";
import { COURSES } from "@/lib/data/learn";

const ICON_MAP: Record<string, any> = {
  "tactics-fundamentals": Target,
  "endgame-mastery": Shield,
  "opening-principles": BookOpen,
  "positional-play": GraduationCap,
};

const COLOR_MAP: Record<string, string> = {
  "tactics-fundamentals": "text-blue-400",
  "endgame-mastery": "text-emerald-400",
  "opening-principles": "text-amber-400",
  "positional-play": "text-purple-400",
};

const PROGRESS_MAP: Record<string, number> = {
  "tactics-fundamentals": 85,
  "endgame-mastery": 30,
  "opening-principles": 100,
  "positional-play": 0,
};

export default function LearnPage() {
  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-12 pb-24 min-h-[calc(100vh-80px)] justify-center">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-4 text-white">
          <GraduationCap className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
          Learn
        </h1>
        <p className="text-secondary-foreground/80 text-xl font-medium">Structured courses to improve your game.</p>
      </div>

      <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 mb-12 shadow-2xl max-w-[800px] mx-auto w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="flex justify-between items-center mb-5 relative z-10">
          <h2 className="text-[18px] font-bold text-white">Course Progress</h2>
          <span className="text-[14px] text-primary font-mono font-bold bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">Overall: 45%</span>
        </div>
        <div className="w-full h-4 bg-black/40 border border-white/5 rounded-full overflow-hidden shadow-inner relative z-10">
          <div className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full w-[45%] shadow-[0_0_10px_rgba(var(--primary),0.5)] relative">
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12 translate-x-[-100%]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {COURSES.map((course, i) => {
          const locked = course.slug === "positional-play"; // Mocking locked state for demo
          const Icon = ICON_MAP[course.slug] || GraduationCap;
          const color = COLOR_MAP[course.slug] || "text-primary";
          const progress = PROGRESS_MAP[course.slug] || 0;

          const CardContent = (
            <div className={`bg-white/[0.01] backdrop-blur-xl border border-white/5 rounded-[32px] p-8 flex flex-col justify-between h-full shadow-xl relative overflow-hidden group ${locked ? 'opacity-50 cursor-not-allowed grayscale-[50%]' : 'hover:border-white/20 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors pointer-events-none" />
              
              <div className="flex items-start gap-6 mb-12 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-black/20 border border-white/10 shadow-inner flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {locked ? <Lock className="w-8 h-8 text-secondary-foreground/50" /> : <Icon className={`w-8 h-8 ${color} drop-shadow-md`} />}
                </div>
                <div className="pt-1">
                  <h3 className={`font-extrabold text-xl mb-2 tracking-wide ${locked ? 'text-secondary-foreground/70' : 'text-white group-hover:text-primary transition-colors'}`}>{course.title}</h3>
                  <p className="text-secondary-foreground/80 text-[14px] leading-relaxed font-medium">{course.description}</p>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] text-secondary-foreground/60 font-black uppercase tracking-widest">Progress</span>
                  <span className={`text-[13px] font-mono font-bold ${locked ? 'text-secondary-foreground/50' : 'text-white'}`}>{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 border border-white/5 rounded-full overflow-hidden shadow-inner">
                  <div className={`h-full rounded-full transition-all duration-1000 ${locked ? 'bg-secondary-foreground/20' : 'bg-white'}`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          );

          if (locked) {
            return <div key={i}>{CardContent}</div>;
          }

          return (
            <Link href={`/learn/${course.slug}`} key={i} className="block outline-none">
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
