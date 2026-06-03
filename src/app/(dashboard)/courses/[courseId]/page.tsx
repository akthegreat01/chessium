"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCourse } from "@/lib/chess/courses-db";
import { motion } from "motion/react";
import AdSlot from "@/components/ui/AdSlot";
import { useCourseProgress } from "@/hooks/useCourseProgress";

export default function CourseOverviewPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const course = getCourse(courseId);
  const { completedLessons, isCompleted, isLoaded } = useCourseProgress(courseId);

  // We determine the "current" unlocked lesson.
  // It's the first lesson in the array that is NOT completed.
  const currentUnlockedIndex = useMemo(() => {
    if (!course) return 0;
    const index = course.lessons.findIndex(l => !isCompleted(l.id));
    return index === -1 ? course.lessons.length - 1 : index;
  }, [course, isCompleted]);

  if (!course) {
    return <div className="text-center p-12 text-[#a0a0a8]">Course not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Top Header */}
      <div>
        <Link href="/courses" className="text-[#81b64c] hover:text-[#9fcc6b] text-sm font-medium mb-4 inline-block">
          ← Back to Courses
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl"
            style={{ backgroundColor: course.color }}
          >
            {course.title[0]}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{course.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2a2a30] text-[#a0a0a8]">
                {course.level}
              </span>
              <span className="text-xs text-[#6b6b75]">
                {course.lessons.length} lessons
              </span>
            </div>
          </div>
        </div>
        <p className="text-[#a0a0a8] text-lg leading-relaxed max-w-2xl mb-8">
          {course.description}
        </p>

        {course.longDescription && (
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Course Overview</h2>
            {course.longDescription.split('\n\n').map((para, idx) => (
              <p key={idx} className="text-[#a0a0a8] leading-relaxed mb-4">
                {para}
              </p>
            ))}
            <div className="mt-6 mb-2">
              <AdSlot format="horizontal" />
            </div>
          </div>
        )}

        {course.whatYouWillLearn && (
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated mb-8">
            <h2 className="text-xl font-bold text-white mb-4">What You Will Learn</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.whatYouWillLearn.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[#d0d0d5]">
                  <svg className="w-6 h-6 text-[#81b64c] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <AdSlot format="horizontal" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#141416] border border-[#2a2a30] rounded-3xl p-8 shadow-elevated relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none mix-blend-overlay"></div>
        <h2 className="text-2xl font-black text-white mb-12 text-center">Learning Path</h2>
        
        <div className="relative max-w-lg mx-auto">
          {/* Vertical connection line */}
          <div className="absolute left-1/2 top-10 bottom-10 w-2 bg-[#2a2a30] -translate-x-1/2 rounded-full z-0"></div>
          
          <div className="space-y-12 relative z-10">
            {course.lessons.map((lesson, i) => {
              const completed = isCompleted(lesson.id);
              const isCurrent = i === currentUnlockedIndex;
              const isLocked = i > currentUnlockedIndex;
              
              // Winding path offset
              const isLeft = i % 2 === 0;
              const xOffset = isLeft ? -40 : 40;

              return (
                <div key={lesson.id} className={`flex ${isLeft ? 'justify-start' : 'justify-end'} relative`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ transform: `translateX(${xOffset}px)` }}
                    className="relative"
                  >
                    {isLocked ? (
                      // Locked Node
                      <div className="w-24 h-24 rounded-full bg-[#1a1a1f] border-4 border-[#2a2a30] flex flex-col items-center justify-center opacity-70">
                        <svg className="w-8 h-8 text-[#6b6b75] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    ) : (
                      // Unlocked / Completed Node
                      <Link href={`/courses/${course.id}/lessons/${lesson.id}`} className="block relative group">
                        {isCurrent && (
                          <span className="absolute inset-0 bg-[#81b64c] rounded-full animate-ping opacity-20 scale-125"></span>
                        )}
                        <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center relative z-10 transition-transform group-hover:scale-105 shadow-xl ${
                          completed 
                            ? "bg-[#81b64c] border-[#9fcc6b] text-white" 
                            : "bg-[#2a2a30] border-[#81b64c] text-white"
                        }`}>
                          {completed ? (
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-10 h-10 text-[#81b64c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </Link>
                    )}

                    {/* Lesson Label Bubble */}
                    <div className={`absolute top-1/2 -translate-y-1/2 w-48 ${isLeft ? 'left-full ml-4' : 'right-full mr-4 text-right'}`}>
                      <div className="bg-[#1a1a1f] border border-[#2a2a30] p-3 rounded-xl shadow-lg">
                        <div className="text-xs text-[#81b64c] font-bold mb-1 uppercase tracking-wider">Lesson {i + 1}</div>
                        <h3 className={`font-bold text-sm ${isLocked ? 'text-[#6b6b75]' : 'text-white'}`}>
                          {lesson.title}
                        </h3>
                      </div>
                      {/* Triangle pointer */}
                      <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1a1f] border-[#2a2a30] rotate-45 ${
                        isLeft ? '-left-1.5 border-b border-l' : '-right-1.5 border-t border-r'
                      }`}></div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-16">
          <AdSlot format="horizontal" />
        </div>
      </div>
    </div>
  );
}
