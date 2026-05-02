"use client";

import { useChessStore } from '@/lib/chessStore';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function EvaluationBar() {
  const { analysisResult, currentMoveIndex, boardFlipped, variationAnalysis, mainLineHistory } = useChessStore();

  const { targetPercent, scoreText } = useMemo(() => {
    let evalWhite = 0;
    let hasMate = false;
    let mateVal = 0;

    if (variationAnalysis && mainLineHistory) {
      evalWhite = variationAnalysis.eval;
    } else if (analysisResult && analysisResult.evals) {
      const evalIndex = currentMoveIndex + 1;
      if (evalIndex >= 0 && evalIndex < analysisResult.evals.length) {
        evalWhite = analysisResult.evals[evalIndex];
      }
    }

    if (Math.abs(evalWhite) > 9000) {
      hasMate = true;
      mateVal = evalWhite > 0 ? (10000 - evalWhite) : -(10000 + evalWhite);
    }

    let tp = 50;
    let st = "0.0";

    if (hasMate) {
      if (evalWhite > 0) {
        tp = 98;
        st = `M${Math.abs(mateVal)}`;
      } else {
        tp = 2;
        st = `M${Math.abs(mateVal)}`;
      }
    } else {
    const scoreVal = evalWhite / 100;
    // Sigmoidal scaling for better visual representation of advantage
    const scaled = (Math.atan(scoreVal / 3) / (Math.PI / 2)) * 48;
    tp = Math.max(2, Math.min(98, 50 + scaled));
    st = (scoreVal > 0 ? "+" : "") + scoreVal.toFixed(1);

    return { targetPercent: tp, scoreText: st };
  }, [analysisResult, currentMoveIndex, variationAnalysis, mainLineHistory]);

  const whiteHeight = boardFlipped ? (100 - targetPercent) : targetPercent;
  const isWhiteAdvantage = targetPercent > 50;

  return (
    <div className="w-8 md:w-10 h-full bg-[#141519] rounded-xl overflow-hidden flex flex-col relative border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Black section (top) */}
      <motion.div
        animate={{ height: `${100 - whiteHeight}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full relative z-0 ${boardFlipped ? 'bg-[#e2e2e2]' : 'bg-[#1a1c22]'}`}
      />
      
      {/* Dynamic Marker/Arrow */}
      <motion.div 
        animate={{ top: `${100 - whiteHeight}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 right-0 h-0.5 z-20"
      >
        <div className="absolute inset-0 bg-white/20 blur-[2px]" />
        <div className="absolute inset-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
      </motion.div>

      {/* White section (bottom) */}
      <motion.div
        animate={{ height: `${whiteHeight}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full relative z-0 ${boardFlipped ? 'bg-[#1a1c22]' : 'bg-[#e2e2e2]'}`}
      />

      {/* Score Labels */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-1.5 z-30">
        <div className={`text-[10px] font-black tracking-tighter tabular-nums transition-opacity duration-300 ${!isWhiteAdvantage ? 'opacity-100' : 'opacity-0'}`}>
          <span className={boardFlipped ? 'text-gray-800' : 'text-gray-400'}>{scoreText}</span>
        </div>
        <div className={`text-[10px] font-black tracking-tighter tabular-nums transition-opacity duration-300 ${isWhiteAdvantage ? 'opacity-100' : 'opacity-0'}`}>
          <span className={boardFlipped ? 'text-gray-400' : 'text-gray-800'}>{scoreText}</span>
        </div>
      </div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </div>
  );
}
