"use client";

import { useState } from 'react';
import { useUserStore } from '@/lib/userStore';
import { Trophy, Lock, Flame, Star, Zap, Target, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function AchievementsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { achievements, xp, level, dailyStreak, totalAnalyses, totalPuzzlesSolved } = useUserStore();

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;
  const progressPct = (unlockedCount / totalCount) * 100;

  // XP needed for next level
  const nextLevelXp = Math.round(Math.pow(level / 1, 1 / 0.7) * 100);
  const currentLevelXp = Math.round(Math.pow((level - 1) / 1, 1 / 0.7) * 100);
  const levelProgress = Math.max(0, Math.min(100, ((xp - currentLevelXp) / Math.max(1, nextLevelXp - currentLevelXp)) * 100));

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05] hover:bg-white/[0.07] transition-all group"
      >
        <Trophy className="w-4 h-4 text-yellow-500/80 group-hover:text-yellow-400 transition-colors" />
        <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
          {unlockedCount}/{totalCount}
        </span>
        {unlockedCount > 0 && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && typeof window !== 'undefined' && createPortal(
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[520px] z-[201] bg-[#0d0e12] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/50"
            >
              {/* Header */}
              <div className="relative overflow-hidden px-6 pt-6 pb-4 border-b border-white/[0.06]">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white tracking-tight">Achievements</h2>
                      <p className="text-xs text-gray-500">{unlockedCount} of {totalCount} unlocked</p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="relative mt-4">
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-white/[0.04]">
                <div className="flex flex-col items-center gap-1 py-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-lg font-black text-white">{level}</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Level</span>
                </div>
                <div className="flex flex-col items-center gap-1 py-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-lg font-black text-white">{xp.toLocaleString()}</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Total XP</span>
                </div>
                <div className="flex flex-col items-center gap-1 py-2">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="text-lg font-black text-white">{dailyStreak}</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Streak</span>
                </div>
                <div className="flex flex-col items-center gap-1 py-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-lg font-black text-white">{totalAnalyses}</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Games</span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="px-4 py-3 border-b border-white/[0.04]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-400 font-semibold">Level {level}</span>
                  <span className="text-gray-500 font-mono">{xp - currentLevelXp} / {nextLevelXp - currentLevelXp} XP</span>
                  <span className="text-gray-400 font-semibold">Level {level + 1}</span>
                </div>
                <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-[shimmer_2s_ease-in-out_infinite]" />
                  </motion.div>
                </div>
              </div>

              {/* Achievement List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3 space-y-2">
                {achievements.map((ach, i) => {
                  const isUnlocked = !!ach.unlockedAt;
                  return (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isUnlocked
                          ? 'bg-white/[0.04] border-yellow-500/20 hover:bg-white/[0.06]'
                          : 'bg-white/[0.01] border-white/[0.04] opacity-60'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 shadow-lg shadow-yellow-500/10'
                          : 'bg-white/[0.03] border border-white/[0.06]'
                      }`}>
                        {isUnlocked ? ach.icon : <Lock className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{ach.title}</span>
                          {isUnlocked && <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-bold">UNLOCKED</span>}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{ach.description}</p>
                        {ach.maxProgress && ach.progress !== undefined && !isUnlocked && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500/60 rounded-full transition-all"
                                style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                              />
                            </div>
                            <span className="text-[9px] text-gray-600 font-mono">{ach.progress}/{ach.maxProgress}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}
