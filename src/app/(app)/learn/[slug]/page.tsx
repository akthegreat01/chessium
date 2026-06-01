"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft, GraduationCap } from "lucide-react";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard), { ssr: false, loading: () => <div className="w-full aspect-square bg-white/5 animate-pulse rounded-xl" /> });
import { Button } from "@/components/ui/button";
import { AdUnit } from "@/components/ui/AdUnit";
import { getCourseBySlug } from "@/lib/data/learn";

export default function TheoryCoursePage({ params }: { params: { slug: string } }) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  const data = getCourseBySlug(params.slug);
  
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-6">
        <GraduationCap className="w-16 h-16 text-primary/40 mb-6" />
        <h1 className="text-4xl font-bold tracking-tight mb-4">Course Not Found</h1>
        <p className="text-secondary-foreground text-lg mb-8 max-w-[500px]">
          We couldn't find the course you're looking for. It might have been moved or hasn't been added to our curriculum yet.
        </p>
        <Link href="/learn">
          <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-8 py-6 text-base font-bold transition-all hover:-translate-y-1">
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  const currentStep = data.lessons[currentLessonIndex];

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-screen text-foreground">
      <Link href="/learn" className="inline-flex items-center text-[13px] font-bold text-secondary-foreground/70 hover:text-white transition-colors mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/10 shadow-sm">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
      </Link>
      
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-white">
          {data.title}
        </h1>
        <p className="text-secondary-foreground text-[16px] max-w-[800px] leading-relaxed">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 items-start relative z-10">
        {/* Chessboard Area */}
        <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/10 p-5 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="w-full max-w-[600px] aspect-square rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)] relative z-10">
            <Chessboard 
              position={currentStep.fen}
              customDarkSquareStyle={{ backgroundColor: "#779556" }}
              customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
              arePiecesDraggable={false}
              animationDuration={300}
            />
          </div>
        </div>

        {/* Theory Explorer */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl">
            <h2 className="text-[14px] font-black tracking-widest text-secondary-foreground/70 uppercase mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Lesson: {currentStep.title}
            </h2>
            
            <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl mb-8 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-xl rounded-full" />
              <p className="text-[15px] text-white/90 leading-relaxed font-medium relative z-10">
                {currentStep.theory}
              </p>
            </div>

            <div className="flex items-center justify-between bg-black/20 p-2 rounded-2xl border border-white/5">
              <Button 
                variant="outline" 
                size="sm"
                className="h-10 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all shadow-sm text-white font-bold"
                disabled={currentLessonIndex === 0}
                onClick={() => setCurrentLessonIndex(p => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[11px] text-secondary-foreground/80 font-bold tracking-widest">
                  {currentLessonIndex + 1} / {data.lessons.length}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="h-10 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all shadow-sm text-white font-bold"
                disabled={currentLessonIndex === data.lessons.length - 1}
                onClick={() => setCurrentLessonIndex(p => Math.min(data.lessons.length - 1, p + 1))}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-emerald-400 rounded-full" />
                Why this matters
              </h3>
              <p className="text-[14px] text-secondary-foreground/80 leading-loose mb-8">
                {data.whyThisMatters}
              </p>
              <AdUnit className="w-full min-h-[250px] rounded-2xl border border-white/5 bg-black/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
