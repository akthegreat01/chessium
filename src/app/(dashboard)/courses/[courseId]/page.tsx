"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCourse } from "@/lib/chess/courses-db";
import { motion } from "motion/react";

export default function CourseOverviewPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = getCourse(courseId);

  if (!course) {
    return <div className="text-center p-12 text-[#a0a0a8]">Course not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
        <p className="text-[#a0a0a8] text-lg leading-relaxed max-w-2xl">
          {course.description}
        </p>
      </div>

      <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated">
        <h2 className="text-xl font-bold text-white mb-6">Course Lessons</h2>
        
        <div className="space-y-4">
          {course.lessons.map((lesson, i) => (
            <Link href={`/courses/${course.id}/lessons/${lesson.id}`} key={lesson.id} className="block group">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#2a2a30] bg-[#0a0a0b] hover:border-[#81b64c]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#1a1a1f] flex items-center justify-center font-bold text-[#a0a0a8] group-hover:bg-[#81b64c] group-hover:text-white transition-colors">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-[#81b64c] transition-colors">{lesson.title}</h3>
                  <p className="text-sm text-[#6b6b75]">{lesson.description}</p>
                </div>
                <div className="text-[#a0a0a8] group-hover:translate-x-1 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
