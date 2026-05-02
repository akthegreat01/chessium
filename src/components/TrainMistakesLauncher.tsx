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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg blur-[2px] opacity-0 group-hover:opacity-100 transition duration-500" />
        
        <div className="relative glass-panel px-3 py-2 rounded-lg border border-red-500/10 bg-red-500/[0.02] hover:bg-red-500/[0.05] transition-all flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 text-red-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[11px] font-black text-white uppercase tracking-tight truncate">Train Mistakes</h3>
              <span className="bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded-md font-black">
                {mistakeCount}
              </span>
            </div>
            <p className="text-[9px] text-gray-500 font-medium truncate">Master your past blunders</p>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {showTrainer && <MistakeTrainer onClose={() => setShowTrainer(false)} />}
    </>
  );
}
