import React from "react";
import { GraduationCap, Shield, Target, BookOpen, Lock } from "lucide-react";
import Link from "next/link";

const courses = [
  { title: "Tactics Fundamentals", desc: "Master pins, skewers, and forks.", icon: Target, progress: 85, color: "text-blue-400" },
  { title: "Endgame Mastery", desc: "Convert advantages into wins.", icon: Shield, progress: 30, color: "text-emerald-400" },
  { title: "Opening Principles", desc: "Control the center and develop.", icon: BookOpen, progress: 100, color: "text-amber-400" },
  { title: "Positional Play", desc: "Understand pawn structures.", icon: GraduationCap, progress: 0, color: "text-purple-400", locked: true }
];

export default function LearnPage() {
  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto px-6 md:px-8 pt-12 pb-24 min-h-[calc(100vh-80px)] justify-center">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3 flex items-center justify-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" />
          Learn
        </h1>
        <p className="text-secondary-foreground text-lg">Structured courses to improve your game.</p>
      </div>

      <div className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-[32px] p-8 mb-12 shadow-2xl max-w-[800px] mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[16px] font-semibold">Course Progress</h2>
          <span className="text-[13px] text-secondary-foreground font-mono">Overall: 45%</span>
        </div>
        <div className="w-full h-3 bg-background border border-white/5 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-primary rounded-full w-[45%]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, i) => {
          const slug = course.title.toLowerCase().replace(/\s+/g, '-');
          const CardContent = (
            <div className={`bg-surface/40 backdrop-blur-sm border border-white/10 rounded-[24px] p-8 flex flex-col justify-between h-full shadow-xl ${course.locked ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer'}`}>
              <div className="flex items-start gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-background/50 border border-white/5 shadow-inner flex items-center justify-center shrink-0">
                  {course.locked ? <Lock className="w-7 h-7 text-secondary-foreground" /> : <course.icon className={`w-7 h-7 ${course.color}`} />}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-secondary-foreground text-sm leading-relaxed">{course.desc}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] text-secondary-foreground font-bold uppercase tracking-wider">Progress</span>
                  <span className="text-[12px] text-foreground font-mono font-medium">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-background border border-white/5 rounded-full overflow-hidden shadow-inner">
                  <div className={`h-full rounded-full ${course.locked ? 'bg-secondary-foreground/20' : 'bg-foreground'}`} style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            </div>
          );

          if (course.locked) {
            return <div key={i}>{CardContent}</div>;
          }

          return (
            <Link href={`/learn/${slug}`} key={i} className="block">
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
