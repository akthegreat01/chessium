"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard), { ssr: false });
import { Button } from "@/components/ui/button";

const COURSE_DATA = {
  title: "Tactics Fundamentals",
  description: "Learn the core tactical motifs that decide 99% of chess games at the beginner and intermediate level.",
  lessons: [
    { title: "The Fork", fen: "r1b1k2r/ppp2ppp/2n5/3qp3/1b1P4/5N2/PP1BPPPP/R2QKB1R w KQkq - 0 8", theory: "A fork is a tactic where a single piece attacks two or more enemy pieces simultaneously. Because the opponent can only defend or move one piece per turn, the other piece is typically lost. Knights and Queens are particularly notorious for devastating forks." },
    { title: "The Pin", fen: "r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 0 8", theory: "A pin occurs when an attacked piece cannot move without exposing a more valuable piece behind it. Absolute pins involve the King (meaning the pinned piece legally cannot move), while relative pins involve other high-value pieces like the Queen." },
    { title: "The Skewer", fen: "8/8/8/8/3k4/1R6/2K5/8 w - - 0 1", theory: "A skewer is often described as a 'reverse pin'. A valuable piece is attacked, forcing it to move and exposing a less valuable (but still hanging) piece behind it." },
  ]
};

export default function TheoryCoursePage({ params }: { params: { slug: string } }) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  const data = COURSE_DATA;
  const currentStep = data.lessons[currentLessonIndex];

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-screen text-foreground">
      <Link href="/learn" className="inline-flex items-center text-[13px] font-medium text-secondary-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h1>
        <p className="text-secondary-foreground text-[15px]">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Chessboard Area */}
        <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-center">
          <div className="w-full max-w-[600px] aspect-square rounded overflow-hidden">
            <Chessboard 
              position={currentStep.fen}
              customDarkSquareStyle={{ backgroundColor: "#779556" }}
              customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
              arePiecesDraggable={false}
            />
          </div>
        </div>

        {/* Theory Explorer */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border p-6 rounded-xl">
            <h2 className="text-[14px] font-semibold mb-4">Lesson: {currentStep.title}</h2>
            
            <div className="p-4 bg-background border border-border rounded-lg mb-6">
              <p className="text-[14px] text-secondary-foreground leading-relaxed">
                {currentStep.theory}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                className="border-border bg-transparent hover:bg-white/[0.04]"
                disabled={currentLessonIndex === 0}
                onClick={() => setCurrentLessonIndex(p => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <span className="text-[13px] text-secondary-foreground font-medium">
                {currentLessonIndex + 1} / {data.lessons.length}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                className="border-border bg-transparent hover:bg-white/[0.04]"
                disabled={currentLessonIndex === data.lessons.length - 1}
                onClick={() => setCurrentLessonIndex(p => Math.min(data.lessons.length - 1, p + 1))}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
