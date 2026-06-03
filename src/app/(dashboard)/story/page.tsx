"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { STORY_CHAPTERS, StoryChapter } from "@/lib/chess/story-data";
import { motion } from "motion/react";

export default function StoryLandingPage() {
  const [unlockedChapters, setUnlockedChapters] = useState<Record<string, boolean>>({
    "chapter-1": true // Chapter 1 is unlocked by default
  });
  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"dossiers" | "notebook">("dossiers");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unlocked: Record<string, boolean> = { "chapter-1": true };
      const completed: Record<string, boolean> = {};

      STORY_CHAPTERS.forEach((ch, idx) => {
        const isCompleted = localStorage.getItem(`chessium_story_completed_${ch.id}`) === "true";
        if (isCompleted) {
          completed[ch.id] = true;
          // Unlock the next chapter
          if (idx < STORY_CHAPTERS.length - 1) {
            unlocked[STORY_CHAPTERS[idx + 1].id] = true;
          }
        }
      });

      setUnlockedChapters(unlocked);
      setCompletedChapters(completed);
    }
  }, []);

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all story progress and clues? This cannot be undone.")) {
      STORY_CHAPTERS.forEach((ch) => {
        localStorage.removeItem(`chessium_story_completed_${ch.id}`);
      });
      setUnlockedChapters({ "chapter-1": true });
      setCompletedChapters({});
      setActiveTab("dossiers");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="relative bg-[#141416] border border-[#2a2a30] rounded-3xl p-8 shadow-elevated overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#81b64c]/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="text-[#81b64c] text-xs font-bold uppercase tracking-widest mb-2">Adventure Mode</div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">The Whispering King</h1>
            <p className="text-[#a0a0a8] max-w-xl text-base md:text-lg">
              Lord Alistair Thorne, a billionaire chess Grandmaster, has died under mysterious circumstances. Investigate Thorne Manor, play chess against the suspects, and piece together the final conspiracy.
            </p>
          </div>
          <button
            onClick={handleResetProgress}
            className="shrink-0 bg-[#2a2a30] hover:bg-[#3a3a42] text-xs font-bold text-[#ca3431] px-4 py-2.5 rounded-xl border border-[#ca3431]/20 hover:border-[#ca3431]/40 transition-all"
          >
            Reset Mystery Progress
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-4 border-b border-[#2a2a30] pb-px">
        <button
          onClick={() => setActiveTab("dossiers")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "dossiers"
              ? "text-[#81b64c] border-[#81b64c]"
              : "text-[#a0a0a8] border-transparent hover:text-white"
          }`}
        >
          Suspect Dossiers
        </button>
        <button
          onClick={() => setActiveTab("notebook")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "notebook"
              ? "text-[#81b64c] border-[#81b64c]"
              : "text-[#a0a0a8] border-transparent hover:text-white"
          }`}
        >
          🔍 Clues Notebook
          {Object.keys(completedChapters).length > 0 && (
            <span className="bg-[#81b64c] text-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {Object.keys(completedChapters).length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "dossiers" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STORY_CHAPTERS.map((ch, idx) => {
            const isUnlocked = unlockedChapters[ch.id];
            const isCompleted = completedChapters[ch.id];

            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex flex-col bg-[#141416] border rounded-2xl p-6 shadow-elevated ${
                  isCompleted
                    ? "border-[#81b64c]/40"
                    : isUnlocked
                    ? "border-[#2a2a30] hover:border-[#3a3a42]"
                    : "border-dashed border-[#2a2a30] opacity-50"
                } transition-all`}
              >
                {/* Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {isCompleted ? (
                    <span className="bg-[#81b64c]/10 border border-[#81b64c]/20 text-[#81b64c] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Completed & Solved
                    </span>
                  ) : isUnlocked ? (
                    <span className="bg-[#81b64c]/10 border border-[#81b64c]/20 text-[#81b64c] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Active Lead
                    </span>
                  ) : (
                    <span className="bg-[#2a2a30] text-[#6b6b75] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      🔒 Locked
                    </span>
                  )}
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#1a1a1f] border border-[#2a2a30] rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0 select-none">
                    {ch.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-0.5">{ch.suspectName}</h3>
                    <div className="text-xs text-[#a0a0a8] font-medium">{ch.title} • ELO: {ch.rating}</div>
                  </div>
                </div>

                <p className="text-sm text-[#a0a0a8] leading-relaxed mb-6 flex-1">
                  {isUnlocked ? ch.description : "Question and resolve the previous leads to unlock this file."}
                </p>

                {isUnlocked ? (
                  <Link
                    href={`/story/${ch.id}`}
                    className={`w-full py-3 rounded-xl text-sm font-bold text-center text-white transition-all shadow-elevated ${
                      isCompleted
                        ? "bg-[#2a2a30] hover:bg-[#3a3a42] border border-[#2a2a30]"
                        : "bg-[#81b64c] hover:bg-[#9fcc6b] hover:-translate-y-0.5"
                    }`}
                  >
                    {isCompleted ? "Replay Chapter" : "Investigate & Play"}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-[#1e1e21] text-[#4d4d54] py-3 rounded-xl text-sm font-bold cursor-not-allowed border border-[#2a2a30]"
                  >
                    Leads Classified
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Clues Notebook tab */
        <div className="space-y-6">
          {Object.keys(completedChapters).length === 0 ? (
            <div className="bg-[#141416] border border-dashed border-[#2a2a30] rounded-2xl p-12 text-center text-[#a0a0a8]">
              <div className="text-4xl mb-4">📓</div>
              <h3 className="text-lg font-bold text-white mb-1">Notebook is Empty</h3>
              <p className="text-sm max-w-sm mx-auto">
                Beat the suspects on the board to extract information, solve tasks, and add key clues to your case notebook.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {STORY_CHAPTERS.map((ch) => {
                const isCompleted = completedChapters[ch.id];
                if (!isCompleted) return null;

                return (
                  <motion.div
                    key={`clue-${ch.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#141416] border border-[#81b64c]/20 rounded-2xl p-6 shadow-elevated flex flex-col md:flex-row gap-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#81b64c]"></div>
                    <div className="w-12 h-12 bg-[#81b64c]/10 border border-[#81b64c]/20 rounded-xl flex items-center justify-center text-2xl shrink-0 select-none">
                      📌
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#81b64c] mb-1">{ch.clueTitle}</h4>
                      <div className="text-xs text-[#6b6b75] mb-2 uppercase font-black tracking-wider">
                        Source: {ch.suspectName} ({ch.title})
                      </div>
                      <p className="text-sm text-[#a0a0a8] leading-relaxed">
                        {ch.clueDescription}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
