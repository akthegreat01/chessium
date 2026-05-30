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
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Learn
        </h1>
        <p className="text-secondary-foreground text-[15px]">Structured courses to improve your game.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[14px] font-semibold">Course Progress</h2>
          <span className="text-[12px] text-secondary-foreground font-mono">Overall: 45%</span>
        </div>
        <div className="w-full h-2 bg-background rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-[45%]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, i) => {
          const slug = course.title.toLowerCase().replace(/\s+/g, '-');
          const CardContent = (
            <div className={`bg-surface border border-border rounded-xl p-6 flex flex-col justify-between h-full ${course.locked ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/20 transition-all cursor-pointer'}`}>
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                  {course.locked ? <Lock className="w-6 h-6 text-secondary-foreground" /> : <course.icon className={`w-6 h-6 ${course.color}`} />}
                </div>
                <div>
                  <h3 className="font-semibold text-[16px] mb-1">{course.title}</h3>
                  <p className="text-secondary-foreground text-[13px] leading-relaxed">{course.desc}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-secondary-foreground font-medium uppercase tracking-wider">Progress</span>
                  <span className="text-[11px] text-foreground font-mono">{course.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
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
