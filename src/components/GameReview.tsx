"use client";

import { useChessStore } from '@/lib/chessStore';
import { useUserStore } from '@/lib/userStore';
import { 
  Trophy, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, 
  BarChart3, Brain, Play, RotateCcw, Target, Clock, Zap
} from 'lucide-react';
import { MoveClassification } from '@/lib/analyzer';
import { motion } from 'framer-motion';
import EvalGraph from './EvalGraph';
import { useEffect, useState } from 'react';

const classData: Record<MoveClassification, { label: string; color: string; symbol: string; glow: string }> = {
  brilliant:   { label: 'Brilliant',   color: '#1cb0f6', symbol: '!!', glow: 'shadow-[0_0_8px_rgba(28,176,246,0.5)]' },
  great:       { label: 'Great',       color: '#5c8bb0', symbol: '!',  glow: 'shadow-[0_0_6px_rgba(92,139,176,0.3)]' },
  best:        { label: 'Best',        color: '#81b64c', symbol: '★',  glow: '' },
  excellent:   { label: 'Excellent',   color: '#96bc4b', symbol: '✓',  glow: '' },
  good:        { label: 'Good',        color: '#96af8b', symbol: '●',  glow: '' },
  book:        { label: 'Book',        color: '#d5a47d', symbol: '📖', glow: '' },
  inaccuracy:  { label: 'Inaccuracy',  color: '#f7c545', symbol: '?!', glow: 'shadow-[0_0_6px_rgba(247,197,69,0.3)]' },
  mistake:     { label: 'Mistake',     color: '#ffa459', symbol: '?',  glow: 'shadow-[0_0_6px_rgba(255,164,89,0.4)]' },
  blunder:     { label: 'Blunder',     color: '#fa412d', symbol: '??', glow: 'shadow-[0_0_8px_rgba(250,65,45,0.5)]' },
  forced:      { label: 'Forced',      color: '#737373', symbol: '→',  glow: '' },
};

function getGrade(accuracy: number) {
  if (accuracy >= 95) return { letter: 'S+', color: 'from-purple-400 to-pink-500', bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-300' };
  if (accuracy >= 90) return { letter: 'S', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-300' };
  if (accuracy >= 80) return { letter: 'A', color: 'from-green-400 to-emerald-500', bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-300' };
  if (accuracy >= 70) return { letter: 'B', color: 'from-yellow-400 to-orange-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-300' };
  if (accuracy >= 50) return { letter: 'C', color: 'from-orange-400 to-red-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-300' };
  if (accuracy >= 30) return { letter: 'D', color: 'from-red-500 to-red-600', bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-300' };
  return { letter: 'F', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-300' };
}

function AccuracyRing({ accuracy, size = 80, delay = 0 }: { accuracy: number; size?: number; delay?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (accuracy / 100) * circumference;
  const grade = getGrade(accuracy);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={`url(#grad-${delay})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{ transition: `stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s` }}
        />
        <defs>
          <linearGradient id={`grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={grade.color.split(' ')[0].replace('from-', '')} style={{ stopColor: accuracy >= 80 ? '#4ade80' : accuracy >= 50 ? '#fbbf24' : '#ef4444' }} />
            <stop offset="100%" style={{ stopColor: accuracy >= 80 ? '#22c55e' : accuracy >= 50 ? '#f97316' : '#dc2626' }} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black text-white tabular-nums">{Math.round(accuracy * 10) / 10}</span>
        <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">ACC</span>
      </div>
    </div>
  );
}

export default function GameReview() {
  const { 
    analysisResult, isAnalyzing, analysisProgress, runGameReview,
    currentMoveIndex, history, variationAnalysis, mainLineHistory,
    explainWhyLine, setExplainWhyLine
  } = useChessStore();
  const { recordAnalysis, addXp } = useUserStore();
  const [hasRecorded, setHasRecorded] = useState(false);

  const typesToShow: MoveClassification[] = ['brilliant', 'great', 'best', 'excellent', 'good', 'book', 'inaccuracy', 'mistake', 'blunder'];

  // Use variation analysis if exploring a sideline, otherwise use main analysis
  const moveAnalysis = (variationAnalysis && mainLineHistory)
    ? variationAnalysis
    : analysisResult?.moveAnalyses?.[currentMoveIndex];
  const moveClass = moveAnalysis ? classData[moveAnalysis.classification] : null;

  // Record analysis completion for achievements
  useEffect(() => {
    if (analysisResult && !isAnalyzing && !hasRecorded) {
      setHasRecorded(true);
      const maxAccuracy = Math.max(analysisResult.accuracy.white, analysisResult.accuracy.black);
      const hasBrilliant = (analysisResult.counts.white.brilliant + analysisResult.counts.black.brilliant) > 0;
      const noBlunders = (analysisResult.counts.white.blunder + analysisResult.counts.black.blunder) === 0;
      recordAnalysis(maxAccuracy, hasBrilliant, noBlunders);
      addXp(50 + Math.round(maxAccuracy / 2)); // XP based on accuracy
    }
  }, [analysisResult, isAnalyzing]);

  // Reset recorded state when analysis changes
  useEffect(() => {
    if (isAnalyzing) setHasRecorded(false);
  }, [isAnalyzing]);

  return (
    <div className="glass-panel overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-white/[0.05]">
        <h2 className="font-bold text-sm text-white flex items-center gap-2 uppercase tracking-wider">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
            <Brain className="w-3.5 h-3.5 text-blue-400" />
          </div>
          Game Review
        </h2>
        {analysisResult?.timeTakenMs && (
          <div className="flex items-center gap-1.5 bg-white/[0.03] px-2 py-1 rounded-md border border-white/[0.05]">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] text-gray-400 font-mono">{(analysisResult.timeTakenMs / 1000).toFixed(1)}s</span>
            {analysisResult.cacheStats && (
              <>
                <Zap className="w-3 h-3 text-yellow-500/60 ml-1" />
                <span className="text-[10px] text-yellow-500/60 font-mono">{analysisResult.cacheStats.hits} cached</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-10 gap-4 px-4">
          {/* Animated progress ring */}
          <div className="relative w-24 h-24">
            <svg width={96} height={96} className="-rotate-90">
              <circle cx={48} cy={48} r={40} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <motion.circle
                cx={48} cy={48} r={40}
                fill="none" stroke="url(#progressGrad)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 40}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - analysisProgress / 100) }}
                transition={{ duration: 0.3 }}
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6' }} />
                  <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white tabular-nums">{Math.round(analysisProgress)}</span>
              <span className="text-[8px] text-gray-500 uppercase tracking-widest">%</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-bold text-white">Analyzing Game</p>
            <p className="text-[10px] text-gray-500">Evaluating {history.length} positions with Stockfish NNUE</p>
          </div>
        </div>
      )}

      {/* Results */}
      {analysisResult && !isAnalyzing && (
        <div className="flex flex-col">
          
          {/* Coach Insight (Clean Feedback style) */}
          <div className="px-4 pt-3">
            <div className={`text-gray-100 px-4 py-3 rounded-xl text-sm font-medium border backdrop-blur-sm transition-all ${
              moveAnalysis && moveClass && currentMoveIndex >= 0
                ? ['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification)
                  ? 'bg-red-500/10 border-red-500/20'
                  : ['brilliant', 'great'].includes(moveAnalysis.classification)
                  ? 'bg-blue-500/10 border-blue-500/20'
                  : 'bg-white/[0.05] border-white/[0.05]'
                : 'bg-white/[0.05] border-white/[0.05]'
            }`}>
              {moveAnalysis && moveClass && currentMoveIndex >= 0 ? (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black text-white ${moveClass.glow}`}
                      style={{ backgroundColor: moveClass.color }}
                    >
                      {moveClass.symbol}
                    </span>
                    <span className="font-bold text-white text-sm">{moveClass.label}</span>
                    <span className="text-[10px] text-gray-500 ml-auto font-mono">
                      {moveAnalysis.moveAccuracy.toFixed(0)}% acc
                    </span>
                  </div>
                  <span className="text-gray-300 text-xs leading-relaxed">
                    {['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification) ? 
                      `${moveAnalysis.playedMove} was a ${moveAnalysis.classification}. The engine preferred ${moveAnalysis.bestMoveSan}.` :
                    ['brilliant', 'great'].includes(moveAnalysis.classification) ? 
                      `Excellent find! ${moveAnalysis.playedMove} was the best move in this position.` :
                    moveAnalysis.classification === 'best' ?
                      `You found the engine's top choice: ${moveAnalysis.playedMove}.` :
                      `A solid move, keeping the position balanced.`
                    }
                  </span>
                  {moveAnalysis.bestLine && ['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification) && (
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="text-[10px] text-gray-500 font-mono bg-black/20 px-2 py-1.5 rounded-lg flex items-center justify-between group/line">
                        <span><span className="text-green-500/70 font-bold">Best line: </span>{moveAnalysis.bestLine}</span>
                        {moveAnalysis.bestLineUci && (
                          <button 
                            onClick={() => setExplainWhyLine(explainWhyLine ? null : moveAnalysis.bestLineUci!.split(' '))}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-all ${
                              explainWhyLine ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <Target className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-tighter">
                              {explainWhyLine ? 'Hide' : 'Explain Why'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-gray-300 text-xs">Navigate through moves to see analysis for each position.</span>
              )}
            </div>
          </div>

          {/* Eval Graph directly inside Game Review */}
          <div className="mt-3 mx-4 rounded-lg overflow-hidden border border-white/[0.06]">
            <EvalGraph />
          </div>

          {/* Players & Accuracy */}
          <div className="flex items-center justify-around py-2 px-3">
            {/* White */}
            <div className="flex flex-col items-center gap-2">
              <AccuracyRing accuracy={analysisResult.accuracy.white} delay={0} />
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white rounded-sm border border-gray-300" />
                <span className="text-xs font-bold text-gray-300">White</span>
              </div>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
                className={`text-sm font-black text-transparent bg-clip-text bg-gradient-to-br ${getGrade(analysisResult.accuracy.white).color}`}
              >
                {getGrade(analysisResult.accuracy.white).letter}
              </motion.span>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center gap-1 opacity-30">
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
              <span className="text-[9px] text-gray-500 font-bold uppercase">vs</span>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            </div>

            {/* Black */}
            <div className="flex flex-col items-center gap-2">
              <AccuracyRing accuracy={analysisResult.accuracy.black} delay={0.2} />
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 rounded-sm border border-gray-600" />
                <span className="text-xs font-bold text-gray-300">Black</span>
              </div>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
                className={`text-sm font-black text-transparent bg-clip-text bg-gradient-to-br ${getGrade(analysisResult.accuracy.black).color}`}
              >
                {getGrade(analysisResult.accuracy.black).letter}
              </motion.span>
            </div>
          </div>

          {/* Classification Breakdown */}
          <div className="flex flex-col gap-0 px-3 pb-3">
            {typesToShow.map((type, idx) => {
              const wCount = analysisResult.counts.white[type];
              const bCount = analysisResult.counts.black[type];
              if (wCount === 0 && bCount === 0 && type !== 'brilliant') return null;
              
              const d = classData[type];
              return (
                <motion.div 
                  key={type} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-2 w-24">
                    <div 
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white ${d.glow}`}
                      style={{ backgroundColor: d.color }}
                    >
                      {d.symbol}
                    </div>
                    <span className="text-[11px] font-semibold text-gray-300">{d.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center text-xs font-bold tabular-nums" style={{ color: wCount > 0 ? d.color : '#888' }}>
                      {wCount}
                    </span>
                    <span className="w-6 text-center text-xs font-bold tabular-nums" style={{ color: bCount > 0 ? d.color : '#888' }}>
                      {bCount}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          {analysisResult.summary && (
            <div className="px-4 pb-4">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-xs text-gray-400 leading-relaxed space-y-1.5">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-white rounded-sm border border-gray-300 mt-0.5 shrink-0" />
                  <span>{analysisResult.summary.white}</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-gray-700 rounded-sm border border-gray-600 mt-0.5 shrink-0" />
                  <span>{analysisResult.summary.black}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Start Review / Analyze button */}
      {!isAnalyzing && (
        <div className="px-4 pb-4">
          <button 
            onClick={runGameReview}
            disabled={history.length === 0}
            className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-black text-base py-3.5 rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.3)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
            {analysisResult ? (
              <span className="flex items-center justify-center gap-2">
                <RotateCw className="w-4 h-4" /> Re-Analyze
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Start Engine Review
              </span>
            )}
          </button>
        </div>
      )}

      {!isAnalyzing && !analysisResult && history.length === 0 && (
        <p className="text-xs text-gray-500 italic text-center py-4 px-4">Play or import a game to review.</p>
      )}
    </div>
  );
}
