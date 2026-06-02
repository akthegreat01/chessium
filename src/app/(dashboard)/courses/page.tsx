"use client";

import { motion } from "motion/react";
import Link from "next/link";
import AdSlot from "@/components/ui/AdSlot";
import { COURSES_DB } from "@/lib/chess/courses-db";
import { useCourseProgress } from "@/hooks/useCourseProgress";

export default function CoursesPage() {
  const { isCompleted } = useCourseProgress();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#141416] to-[#1a1a1f] border border-[#2a2a30] p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#81b64c]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81b64c] to-[#9fcc6b]">Courses</span>
          </h1>
          <p className="text-[#a0a0a8] text-lg mb-8 leading-relaxed">
            Learn step-by-step from interactive lessons. Understand the theory, practice the moves, and apply them in your games.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES_DB.map((course, i) => {
          const completed = isCompleted(course.id);
          // For now, if not completed, we assume 0% progress unless we fetch it from the DB. 
          // We can just show 0 or 100 for MVP based on isCompleted, or calculate from local storage.
          const currentProgress = completed ? 100 : 0; 
          
          return (
            <Link key={course.id} href={`/courses/${course.id}`} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col h-full bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden hover:border-[#81b64c]/50 transition-all shadow-elevated group-hover:-translate-y-1 relative"
              >
                {completed && (
                  <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#81b64c] text-white flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Thumbnail Placeholder */}
                <div 
                  className="h-32 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${course.color}20 0%, ${course.color}05 100%)`
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl border border-white/10"
                    style={{ backgroundColor: course.color }}
                  >
                    {course.title[0]}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2a2a30] text-[#a0a0a8]">
                      {course.level}
                    </span>
                    <span className="text-xs text-[#6b6b75]">
                      {course.lessons.length} lessons
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#81b64c] transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-[#6b6b75] line-clamp-2 mb-6 flex-1">
                    {course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#a0a0a8]">Progress</span>
                      <span className="text-white font-medium">{currentProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#2a2a30] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${currentProgress}%`,
                          backgroundColor: currentProgress === 100 ? "#81b64c" : course.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <AdSlot slot="courses-bottom" />
      </div>
    </div>
  );
}
