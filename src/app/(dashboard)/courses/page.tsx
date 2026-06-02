"use client";

import { motion } from "motion/react";

const COURSES = [
  {
    id: "beginner-basics",
    title: "Chess Fundamentals",
    description: "Learn how the pieces move, basic rules, and how to checkmate.",
    level: "Beginner",
    lessons: 12,
    progress: 100,
    color: "#81b64c",
  },
  {
    id: "tactics-101",
    title: "Tactics 101: Pins, Forks & Skewers",
    description: "Master the most common tactical motifs to win material immediately.",
    level: "Intermediate",
    lessons: 24,
    progress: 45,
    color: "#f7c631",
  },
  {
    id: "endgame-mastery",
    title: "Endgame Mastery",
    description: "From King and Pawn vs King to complex Rook endgames.",
    level: "Advanced",
    lessons: 30,
    progress: 0,
    color: "#5c8bb0",
  },
  {
    id: "ruy-lopez",
    title: "The Ruy Lopez",
    description: "A complete repertoire for White in the Spanish Game.",
    level: "Intermediate",
    lessons: 15,
    progress: 0,
    color: "#1baca6",
  },
];

export default function CoursesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Courses
        </h1>
        <p className="text-[#a0a0a8]">Learn from interactive lessons and improve your understanding.</p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden hover:border-[#3a3a42] hover:bg-[#1a1a1f] transition-all group cursor-pointer"
          >
            {/* Thumbnail Placeholder */}
            <div 
              className="h-32 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${course.color}20 0%, ${course.color}05 100%)`
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
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
                  {course.lessons} lessons
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#81b64c] transition-colors line-clamp-1">
                {course.title}
              </h3>
              
              <p className="text-sm text-[#6b6b75] line-clamp-2 mb-6 flex-1">
                {course.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2 mt-auto">
                <div className="flex justify-between text-xs">
                  <span className="text-[#a0a0a8]">Progress</span>
                  <span className="text-white font-medium">{course.progress}%</span>
                </div>
                <div className="h-1.5 bg-[#2a2a30] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${course.progress}%`,
                      backgroundColor: course.progress === 100 ? "#81b64c" : course.color
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
