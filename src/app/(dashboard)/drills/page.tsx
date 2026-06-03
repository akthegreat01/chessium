"use client";

import Link from "next/link";
import { motion } from "motion/react";

const drills = [
  {
    id: "bullet",
    title: "Bullet Scramble",
    description: "Start from a crushing +5 position against a strong bot. You have exactly 10 seconds. Checkmate or flag. Premoves are essential.",
    icon: "⚡️",
    difficulty: "Hard",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "endgame",
    title: "Endgame Speedrun",
    description: "King and Queen vs King. Checkmate the bot as fast as humanly possible. Time limit: 15 seconds.",
    icon: "🎯",
    difficulty: "Medium",
    color: "from-blue-500 to-indigo-600",
    comingSoon: true
  },
  {
    id: "tactics",
    title: "Tactics Rush",
    description: "Solve as many tactics as possible in 3 minutes. One strike and you're out.",
    icon: "🔥",
    difficulty: "Hard",
    color: "from-rose-500 to-red-600",
    comingSoon: true
  }
];

export default function DrillsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Practice Drills</h1>
        <p className="text-[#a0a0a8] mt-2 max-w-2xl">
          Sharpen your mechanics, speed, and precision under extreme pressure. Premoves enabled.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drills.map((drill, i) => (
          <Link
            key={drill.id}
            href={drill.comingSoon ? "#" : `/drills/${drill.id}`}
            className={`block group ${drill.comingSoon ? "pointer-events-none opacity-60" : ""}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 h-full transition-all duration-300 hover:border-[#4a4a55] hover:shadow-xl hover:shadow-black/50 relative overflow-hidden"
            >
              {drill.comingSoon && (
                <div className="absolute top-4 right-4 bg-[#2a2a30] text-xs font-bold px-2 py-1 rounded text-[#a0a0a8]">
                  SOON
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 bg-gradient-to-br ${drill.color} shadow-lg`}>
                {drill.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{drill.title}</h3>
              <p className="text-[#a0a0a8] text-sm leading-relaxed mb-6">
                {drill.description}
              </p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6b6b75]">
                  Difficulty: <span className="text-white">{drill.difficulty}</span>
                </span>
                
                {!drill.comingSoon && (
                  <span className="text-[#81b64c] font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">
                    Start Drill &rarr;
                  </span>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
