"use client";

import { useState, useEffect } from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { loadGameHistory } from '@/lib/gameHistory';
import MistakeTrainer from './MistakeTrainer';

export default function TrainMistakesLauncher() {
  const [showTrainer, setShowTrainer] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);

  useEffect(() => {
    const history = loadGameHistory();
    let count = 0;
    history.forEach(game => {
      if (game.analysisResult) {
        game.analysisResult.moveAnalyses.forEach(analysis => {
          if (['blunder', 'mistake'].includes(analysis?.classification || '')) {
            count++;
          }
        });
      }
    });
    setMistakeCount(count);
  }, []);

  if (mistakeCount === 0) return null;

  return (
    <>
      <div 
        onClick={() => setShowTrainer(true)}
        className="relative group cursor-pointer"
      >
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
        
        {/* Card content */}
        <div className="relative glass-panel p-5 rounded-xl border border-red-500/20 bg-black/40 hover:bg-black/60 transition-colors flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Target className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Train Your Mistakes
                <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/20">
                  {mistakeCount} Puzzles
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Turn your past blunders into interactive training puzzles.
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {showTrainer && <MistakeTrainer onClose={() => setShowTrainer(false)} />}
    </>
  );
}
