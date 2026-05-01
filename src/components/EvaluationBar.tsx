"use client";

import { useChessStore } from '@/lib/chessStore';
import { useMemo } from 'react';

export default function EvaluationBar() {
  const { analysisResult, currentMoveIndex, boardFlipped, variationAnalysis, mainLineHistory } = useChessStore();

  // Get the eval for the current position from analysis results
  const { targetPercent, scoreText } = useMemo(() => {
    let evalWhite = 0;
    let hasMate = false;
    let mateVal = 0;

    // If exploring a variation, use the variation analysis eval
    if (variationAnalysis && mainLineHistory) {
      evalWhite = variationAnalysis.eval;
    } else if (analysisResult && analysisResult.evals) {
      // Use the eval at the current position from analysis
      const evalIndex = currentMoveIndex + 1; // evals[0] = starting pos, evals[1] = after move 0
      if (evalIndex >= 0 && evalIndex < analysisResult.evals.length) {
        evalWhite = analysisResult.evals[evalIndex];
      }
    }

    // Detect mate scores
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
      const scaled = (Math.atan(scoreVal / 3) / (Math.PI / 2)) * 48;
      tp = Math.max(2, Math.min(98, 50 + scaled));
      st = (scoreVal > 0 ? "+" : "") + scoreVal.toFixed(1);
    }

    return { targetPercent: tp, scoreText: st };
  }, [analysisResult, currentMoveIndex, variationAnalysis, mainLineHistory]);

  const whiteHeight = boardFlipped ? (100 - targetPercent) : targetPercent;
  const isWhiteAdvantage = targetPercent > 50;

  return (
    <div className="w-7 bg-[#141519] rounded-lg overflow-hidden flex flex-col relative border border-white/[0.04] shadow-lg shadow-black/30 h-full">
      {/* Black section (top) */}
      <div
        className={`w-full transition-all duration-500 ease-out ${boardFlipped ? 'bg-gradient-to-b from-[#e8e8e8] to-[#d4d4d4]' : 'bg-gradient-to-b from-[#1a1a1a] to-[#262626]'}`}
        style={{ height: `${100 - whiteHeight}%` }}
      />
      {/* Divider line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" style={{ top: `${100 - whiteHeight}%` }} />
      {/* White section (bottom) */}
      <div
        className={`w-full transition-all duration-500 ease-out ${boardFlipped ? 'bg-gradient-to-b from-[#262626] to-[#1a1a1a]' : 'bg-gradient-to-b from-[#e8e8e8] to-[#d4d4d4]'}`}
        style={{ height: `${whiteHeight}%` }}
      />

      {/* Score Text */}
      <div className={`absolute left-0 w-full text-center text-[9px] font-bold z-10 leading-none py-1.5 tracking-tight
        ${isWhiteAdvantage
          ? (boardFlipped ? 'top-0 text-[#444]' : 'bottom-0 text-[#444]')
          : (boardFlipped ? 'bottom-0 text-[#bbb]' : 'top-0 text-[#bbb]')
        }`}
      >
        {scoreText}
      </div>
    </div>
  );
}
