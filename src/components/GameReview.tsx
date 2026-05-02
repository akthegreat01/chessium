"use client";

import { useChessStore } from '@/lib/chessStore';
import { useUserStore } from '@/lib/userStore';
import { 
  Trophy, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, 
  BarChart3, Brain, Play, RotateCcw, Target, Clock, Zap, MessageSquare, List
} from 'lucide-react';
import { MoveClassification } from '@/lib/analyzer';
import { motion, AnimatePresence } from 'framer-motion';
import EvalGraph from './EvalGraph';
import { useEffect, useState } from 'react';

const classData: Record<MoveClassification, { label: string; color: string; symbol: string; glow: string; text: string }> = {
  brilliant:   { label: 'Brilliant',   color: '#1cb0f6', symbol: '!!', glow: 'shadow-[0_0_12px_rgba(28,176,246,0.6)]', text: 'text-[#1cb0f6]' },
  great:       { label: 'Great',       color: '#5c8bb0', symbol: '!',  glow: 'shadow-[0_0_8px_rgba(92,139,176,0.4)]', text: 'text-[#5c8bb0]' },
  best:        { label: 'Best',        color: '#81b64c', symbol: '★',  glow: '', text: 'text-[#81b64c]' },
  excellent:   { label: 'Excellent',   color: '#96bc4b', symbol: '✓',  glow: '', text: 'text-[#96bc4b]' },
  good:        { label: 'Good',        color: '#96af8b', symbol: '●',  glow: '', text: 'text-[#96af8b]' },
  book:        { label: 'Book',        color: '#d5a47d', symbol: '📖', glow: '', text: 'text-[#d5a47d]' },
  inaccuracy:  { label: 'Inaccuracy',  color: '#f7c545', symbol: '?!', glow: 'shadow-[0_0_8px_rgba(247,197,69,0.4)]', text: 'text-[#f7c545]' },
  mistake:     { label: 'Mistake',     color: '#ffa459', symbol: '?',  glow: 'shadow-[0_0_8px_rgba(255,164,89,0.5)]', text: 'text-[#ffa459]' },
  blunder:     { label: 'Blunder',     color: '#fa412d', symbol: '??', glow: 'shadow-[0_0_12px_rgba(250,65,45,0.6)]', text: 'text-[#fa412d]' },
  forced:      { label: 'Forced',      color: '#737373', symbol: '→',  glow: '', text: 'text-gray-500' },
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
      <svg width={size} height={size} className="-rotate-90 drop-shadow-lg">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={`url(#grad-${delay})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{ transition: `stroke-dashoffset 2s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s` }}
        />
        <defs>
          <linearGradient id={`grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: accuracy >= 80 ? '#4ade80' : accuracy >= 50 ? '#fbbf24' : '#ef4444' }} />
            <stop offset="100%" style={{ stopColor: accuracy >= 80 ? '#22c55e' : accuracy >= 50 ? '#f97316' : '#dc2626' }} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white tabular-nums tracking-tighter">{Math.round(accuracy)}</span>
        <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black opacity-50">ACC</span>
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
  
  const [activeTab, setActiveTab] = useState<'review' | 'analysis' | 'coach'>('review');
  const [hasRecorded, setHasRecorded] = useState(false);

  const typesToShow: MoveClassification[] = ['brilliant', 'great', 'best', 'excellent', 'good', 'book', 'inaccuracy', 'mistake', 'blunder'];

  const moveAnalysis = (variationAnalysis && mainLineHistory)
    ? variationAnalysis
    : analysisResult?.moveAnalyses?.[currentMoveIndex];
  const moveClass = moveAnalysis ? classData[moveAnalysis.classification] : null;

  useEffect(() => {
    if (analysisResult && !isAnalyzing && !hasRecorded) {
      setHasRecorded(true);
      const maxAccuracy = Math.max(analysisResult.accuracy.white, analysisResult.accuracy.black);
      const hasBrilliant = (analysisResult.counts.white.brilliant + analysisResult.counts.black.brilliant) > 0;
      const noBlunders = (analysisResult.counts.white.blunder + analysisResult.counts.black.blunder) === 0;
      recordAnalysis(maxAccuracy, hasBrilliant, noBlunders);
      addXp(50 + Math.round(maxAccuracy / 2));
    }
  }, [analysisResult, isAnalyzing]);

  useEffect(() => {
    if (isAnalyzing) {
      setHasRecorded(false);
      setActiveTab('review');
    }
  }, [isAnalyzing]);

  return (
    <div className="glass-panel overflow-hidden flex flex-col shadow-2xl min-h-[300px]">
      {/* Tabs */}
      <div className="flex bg-white/[0.03] border-b border-white/[0.05]">
        {[
          { id: 'review', icon: Target, label: 'Review' },
          { id: 'analysis', icon: List, label: 'Stats' },
          { id: 'coach', icon: MessageSquare, label: 'Coach' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-600'}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-2px_8px_rgba(59,130,246,0.5)]" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-16 gap-6 px-8 text-center">
            <div className="relative w-32 h-32">
              <svg width={128} height={128} className="-rotate-90">
                <circle cx={64} cy={64} r={58} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <motion.circle
                  cx={64} cy={64} r={58}
                  fill="none" stroke="url(#progressGrad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 58}
                  animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - analysisProgress / 100) }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6' }} />
                    <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white tabular-nums tracking-tighter">{Math.round(analysisProgress)}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black opacity-40">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Reviewing Game...</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[200px]">
                Stockfish is calculating thousands of variations to classify your moves.
              </p>
            </div>
          </div>
        ) : analysisResult ? (
          <AnimatePresence mode="wait">
            {activeTab === 'review' && (
              <motion.div 
                key="review"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
              >
                {/* Insights Panel */}
                <div className="p-4">
                  <div className={`rounded-2xl border backdrop-blur-md transition-all duration-500 overflow-hidden ${
                    moveAnalysis && moveClass && currentMoveIndex >= 0
                      ? ['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification)
                        ? 'bg-red-500/[0.07] border-red-500/20 shadow-[0_8px_32px_rgba(239,68,68,0.1)]'
                        : ['brilliant', 'great'].includes(moveAnalysis.classification)
                        ? 'bg-blue-500/[0.07] border-blue-500/20 shadow-[0_8px_32px_rgba(59,130,246,0.1)]'
                        : 'bg-white/[0.04] border-white/10'
                      : 'bg-white/[0.04] border-white/10'
                  }`}>
                    {moveAnalysis && moveClass && currentMoveIndex >= 0 ? (
                      <div className="p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg font-black text-white ${moveClass.glow} transition-transform duration-300 hover:scale-110`}
                            style={{ backgroundColor: moveClass.color }}
                          >
                            {moveClass.symbol}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-base font-black uppercase tracking-tight ${moveClass.text}`}>
                              {moveClass.label}
                            </span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">
                              Move {currentMoveIndex + 1}
                            </span>
                          </div>
                          <div className="ml-auto bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="text-sm font-black text-white tabular-nums tracking-tighter">
                              {moveAnalysis.moveAccuracy.toFixed(0)}%
                            </span>
                            <span className="text-[8px] text-gray-500 ml-1 font-bold">ACC</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-200 leading-relaxed font-medium">
                          {['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification) ? 
                            <span className="opacity-90">
                              <strong className={moveClass.text}>{moveAnalysis.playedMove}</strong> was a {moveAnalysis.classification}. 
                              The engine preferred <strong className="text-white">{moveAnalysis.bestMoveSan}</strong>.
                            </span> :
                          ['brilliant', 'great'].includes(moveAnalysis.classification) ? 
                            <span className="opacity-90">
                              Incredible find! <strong className={moveClass.text}>{moveAnalysis.playedMove}</strong> was the strongest move by a wide margin.
                            </span> :
                          moveAnalysis.classification === 'best' ?
                            <span className="opacity-90">
                              You found the absolute best move, <strong className={moveClass.text}>{moveAnalysis.playedMove}</strong>. Perfect calculation.
                            </span> :
                            <span className="opacity-90 text-gray-400">
                              A solid positional move that maintains the balance of the game.
                            </span>
                          }
                        </p>

                        {moveAnalysis.bestLine && ['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification) && (
                          <div className="space-y-3 pt-2">
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Better Line</span>
                                {moveAnalysis.bestLineUci && (
                                  <button 
                                    onClick={() => setExplainWhyLine(explainWhyLine ? null : moveAnalysis.bestLineUci!.split(' '))}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                                      explainWhyLine 
                                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    <Target className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-tight">
                                      {explainWhyLine ? 'Hide' : 'Explain Why'}
                                    </span>
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-green-400 font-mono leading-relaxed bg-green-500/5 p-2 rounded-md border border-green-500/10 italic">
                                {moveAnalysis.bestLine}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                          <Play className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium max-w-[180px] leading-relaxed">
                          Navigate through the moves to see grandmaster insights.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Accuracy Summary */}
                <div className="px-4 py-2 mt-auto">
                  <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6 flex items-center justify-around relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02]" />
                    
                    {/* White Accuracy */}
                    <div className="flex flex-col items-center gap-4 relative z-10">
                      <AccuracyRing accuracy={analysisResult.accuracy.white} size={90} delay={0.1} />
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">White</span>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getGrade(analysisResult.accuracy.white).bg} ${getGrade(analysisResult.accuracy.white).border} ${getGrade(analysisResult.accuracy.white).text}`}>
                          Grade {getGrade(analysisResult.accuracy.white).letter}
                        </div>
                      </div>
                    </div>

                    <div className="w-px h-16 bg-white/[0.05] relative z-10" />

                    {/* Black Accuracy */}
                    <div className="flex flex-col items-center gap-4 relative z-10">
                      <AccuracyRing accuracy={analysisResult.accuracy.black} size={90} delay={0.3} />
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Black</span>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getGrade(analysisResult.accuracy.black).bg} ${getGrade(analysisResult.accuracy.black).border} ${getGrade(analysisResult.accuracy.black).text}`}>
                          Grade {getGrade(analysisResult.accuracy.black).letter}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Eval Graph */}
                <div className="px-4 py-4">
                  <div className="h-28 rounded-xl overflow-hidden border border-white/[0.06] bg-black/20 shadow-inner">
                    <EvalGraph />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analysis' && (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col p-5 gap-6"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-50 px-1">Move Classification</h3>
                  <div className="grid gap-1.5">
                    {typesToShow.map((type, idx) => {
                      const wCount = analysisResult.counts.white[type];
                      const bCount = analysisResult.counts.black[type];
                      if (wCount === 0 && bCount === 0 && type !== 'brilliant') return null;
                      
                      const d = classData[type];
                      return (
                        <div 
                          key={type} 
                          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white ${d.glow} group-hover:scale-110 transition-transform`}
                              style={{ backgroundColor: d.color }}
                            >
                              {d.symbol}
                            </div>
                            <span className="text-xs font-bold text-gray-300">{d.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-black tabular-nums" style={{ color: wCount > 0 ? d.color : '#444' }}>
                                {wCount}
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-black tabular-nums" style={{ color: bCount > 0 ? d.color : '#444' }}>
                                {bCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                   <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-50 px-1 text-center">Summary</h3>
                   <div className="space-y-3">
                      <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
                        <p className="text-xs text-gray-300 leading-relaxed font-medium">
                          {analysisResult.summary.white}
                        </p>
                      </div>
                      <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-700" />
                        <p className="text-xs text-gray-300 leading-relaxed font-medium">
                          {analysisResult.summary.black}
                        </p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'coach' && (
              <motion.div 
                key="coach"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col h-full p-6 items-center text-center gap-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-2xl relative z-10">
                    🧙‍♂️
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-[#08090a] flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-black text-white tracking-tight">Grandmaster Insight</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest opacity-50">Powered by Stockfish 16.1</p>
                </div>

                <div className="bg-white/[0.04] p-6 rounded-3xl border border-white/10 relative shadow-2xl">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/[0.04] border-l border-t border-white/10 rotate-45" />
                  <p className="text-sm text-gray-200 leading-relaxed font-medium italic">
                    &quot;You played a remarkably solid game. Your tactical awareness in the middlegame kept your opponent under constant pressure. To reach the next level, focus on converting slight advantages into decisive endgames.&quot;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Strength</span>
                    <span className="text-lg font-black text-white">Tactics</span>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Weakness</span>
                    <span className="text-lg font-black text-white">Endgame</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-6 min-h-[250px]">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center relative z-10">
                <Brain className="w-10 h-10 text-blue-500/40" />
              </div>
              <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-125" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-black text-white uppercase tracking-tight">Review Ready</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[220px]">
                {history.length > 0 
                  ? "Click below to get deep insights, accuracy scores, and coach feedback for this game."
                  : "Play or import a game to start a deep engine review."}
              </p>
            </div>
            {history.length > 0 && (
               <button 
                 onClick={runGameReview}
                 className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/30 transition-all active:scale-95 shadow-lg shadow-blue-500/5"
               >
                 Start Analysis
               </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Re-analyze Button */}
      {!isAnalyzing && analysisResult && (
        <div className="p-4 border-t border-white/[0.05] bg-white/[0.01]">
          <button 
            onClick={runGameReview}
            className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 active:brightness-90 text-white font-black text-xs md:text-sm py-3.5 rounded-xl shadow-lg shadow-blue-900/20 active:translate-y-[2px] transition-all uppercase tracking-[0.15em] border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
            <div className="flex items-center justify-center gap-2 relative z-10">
              <RotateCcw className="w-4 h-4" />
              Re-Run Analysis
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
