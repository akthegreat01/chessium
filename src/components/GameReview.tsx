"use client";

import { useChessStore } from '@/lib/chessStore';
import { useUserStore } from '@/lib/userStore';
import { 
  Trophy, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, 
  BarChart3, Brain, Play, RotateCcw, Target, Clock, Zap, MessageSquare, List,
  Share2, RotateCw, Sparkles, Medal
} from 'lucide-react';
import { MoveClassification } from '@/lib/analyzer';
import { motion, AnimatePresence } from 'framer-motion';
import EvalGraph from './EvalGraph';
import GameSummaryCard from './GameSummaryCard';
import { useEffect, useState } from 'react';

const classData: Record<MoveClassification, { label: string; color: string; symbol: string; glow: string; text: string; bg: string }> = {
  brilliant:   { label: 'Brilliant',   color: '#1cb0f6', symbol: '!!', glow: 'shadow-[0_0_12px_rgba(28,176,246,0.6)]', text: 'text-[#1cb0f6]', bg: 'bg-[#1cb0f6]/10' },
  great:       { label: 'Great',       color: '#5c8bb0', symbol: '!',  glow: 'shadow-[0_0_8px_rgba(92,139,176,0.4)]', text: 'text-[#5c8bb0]', bg: 'bg-[#5c8bb0]/10' },
  best:        { label: 'Best',        color: '#81b64c', symbol: '★',  glow: '', text: 'text-[#81b64c]', bg: 'bg-[#81b64c]/10' },
  excellent:   { label: 'Excellent',   color: '#96bc4b', symbol: '✓',  glow: '', text: 'text-[#96bc4b]', bg: 'bg-[#96bc4b]/10' },
  good:        { label: 'Good',        color: '#96af8b', symbol: '●',  glow: '', text: 'text-[#96af8b]', bg: 'bg-[#96af8b]/10' },
  book:        { label: 'Book',        color: '#d5a47d', symbol: '📖', glow: '', text: 'text-[#d5a47d]', bg: 'bg-[#d5a47d]/10' },
  inaccuracy:  { label: 'Inaccuracy',  color: '#f7c545', symbol: '?!', glow: 'shadow-[0_0_8px_rgba(247,197,69,0.4)]', text: 'text-[#f7c545]', bg: 'bg-[#f7c545]/10' },
  mistake:     { label: 'Mistake',     color: '#ffa459', symbol: '?',  glow: 'shadow-[0_0_8px_rgba(255,164,89,0.5)]', text: 'text-[#ffa459]', bg: 'bg-[#ffa459]/10' },
  blunder:     { label: 'Blunder',     color: '#fa412d', symbol: '??', glow: 'shadow-[0_0_12px_rgba(250,65,45,0.6)]', text: 'text-[#fa412d]', bg: 'bg-[#fa412d]/10' },
  forced:      { label: 'Forced',      color: '#737373', symbol: '→',  glow: '', text: 'text-gray-500', bg: 'bg-gray-500/10' },
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

function AccuracyRing({ accuracy, size = 80, delay = 0, hideText = false }: { accuracy: number; size?: number; delay?: number; hideText?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (accuracy / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={`url(#grad-${delay})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: mounted ? offset : circumference }}
          transition={{ duration: 1.5, ease: "easeOut", delay }}
        />
        <defs>
          <linearGradient id={`grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: accuracy >= 80 ? '#4ade80' : accuracy >= 50 ? '#fbbf24' : '#ef4444' }} />
            <stop offset="100%" style={{ stopColor: accuracy >= 80 ? '#22c55e' : accuracy >= 50 ? '#f97316' : '#dc2626' }} />
          </linearGradient>
        </defs>
      </svg>
      {!hideText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white tabular-nums tracking-tighter leading-none">{Math.round(accuracy)}</span>
          <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black opacity-50 mt-0.5">ACC</span>
        </div>
      )}
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
  
  const [activeTab, setActiveTab] = useState<'review' | 'overview' | 'coach'>('review');
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showSummaryCard, setShowSummaryCard] = useState(false);

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
  }, [analysisResult, isAnalyzing, hasRecorded, recordAnalysis, addXp]);

  useEffect(() => {
    if (isAnalyzing) {
      setHasRecorded(false);
      setActiveTab('review');
    }
  }, [isAnalyzing]);

  return (
    <div className="glass-panel overflow-hidden flex flex-col shadow-2xl min-h-[400px]">
      {/* Chess.com Style Accuracy Header */}
      {analysisResult && !isAnalyzing && (
        <div className="bg-[#111216] border-b border-white/[0.05] p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <AccuracyRing accuracy={analysisResult.accuracy.white} size={64} />
              <span className="text-[9px] font-black text-gray-500 uppercase mt-2">White</span>
            </div>
            <div className="flex flex-col items-center">
              <AccuracyRing accuracy={analysisResult.accuracy.black} size={64} />
              <span className="text-[9px] font-black text-gray-500 uppercase mt-2">Black</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Medal className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-xs font-black text-white uppercase tracking-tighter">Review Ready</span>
             </div>
             <button 
               onClick={() => setShowSummaryCard(true)}
               className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-1.5 mt-1 transition-colors"
             >
               <Share2 className="w-3 h-3" />
               Share Report
             </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white/[0.02] border-b border-white/[0.04]">
        {[
          { id: 'review', icon: Target, label: 'Review' },
          { id: 'overview', icon: BarChart3, label: 'Stats' },
          { id: 'coach', icon: Brain, label: 'Coach' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-white bg-white/[0.03]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-600'}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-2px_10px_rgba(59,130,246,0.5)]" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-[#0d0e12]">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-20 gap-8 px-8 text-center">
            <div className="relative w-36 h-36">
              <svg width={144} height={144} className="-rotate-90">
                <circle cx={72} cy={72} r={64} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                <motion.circle
                  cx={72} cy={72} r={64}
                  fill="none" stroke="url(#progressGradFull)" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 64}
                  animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - analysisProgress / 100) }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGradFull" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6' }} />
                    <stop offset="100%" style={{ stopColor: '#d4af37' }} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{Math.round(analysisProgress)}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black opacity-50 mt-1">%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#d4af37]">
                 <Sparkles className="w-4 h-4" />
                 <h3 className="text-xl font-black uppercase tracking-tight">Reviewing Your Game</h3>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[240px]">
                Our Stockfish engine is analyzing your tactical precision and finding grandmaster lines.
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
                {/* Move Insights */}
                <div className="p-4">
                  {moveAnalysis && moveClass && currentMoveIndex >= 0 ? (
                    <div className={`rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-300 ${
                      ['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification)
                        ? 'bg-red-500/[0.03] border-red-500/20'
                        : ['brilliant', 'great'].includes(moveAnalysis.classification)
                        ? 'bg-blue-500/[0.03] border-blue-500/20'
                        : 'bg-white/[0.02] border-white/5'
                    }`}>
                      <div className="p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-12 h-12 flex items-center justify-center rounded-2xl text-xl font-black text-white ${moveClass.glow} transition-transform hover:scale-105 shadow-xl`}
                            style={{ backgroundColor: moveClass.color }}
                          >
                            {moveClass.symbol}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-lg font-black uppercase tracking-tight ${moveClass.text}`}>
                              {moveClass.label}
                            </span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">
                              Move {currentMoveIndex + 1}
                            </span>
                          </div>
                          <div className="ml-auto flex flex-col items-end">
                             <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                                <span className="text-sm font-black text-white tabular-nums tracking-tighter">
                                  {moveAnalysis.moveAccuracy.toFixed(0)}%
                                </span>
                                <span className="text-[9px] text-gray-500 ml-1.5 font-bold">PRECISION</span>
                             </div>
                          </div>
                        </div>

                        <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                           <p className="text-sm text-gray-200 leading-relaxed font-medium">
                            {['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification) ? 
                              <span>
                                <strong className={moveClass.text}>{moveAnalysis.playedMove}</strong> is a {moveAnalysis.classification}. 
                                The best move was <strong className="text-green-400">{moveAnalysis.bestMoveSan}</strong>.
                              </span> :
                            ['brilliant', 'great'].includes(moveAnalysis.classification) ? 
                              <span>
                                Stunning move! <strong className={moveClass.text}>{moveAnalysis.playedMove}</strong> is a high-level find.
                              </span> :
                            moveAnalysis.classification === 'best' ?
                              <span>
                                You found the best move, <strong className={moveClass.text}>{moveAnalysis.playedMove}</strong>. Perfect!
                              </span> :
                              <span className="text-gray-400 italic">
                                This move is solid and keeps the game balanced.
                              </span>
                            }
                           </p>
                        </div>

                        {moveAnalysis.bestLine && ['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification) && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Better Line</span>
                               <button 
                                  onClick={() => setExplainWhyLine(explainWhyLine ? null : moveAnalysis.bestLineUci!.split(' '))}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                                    explainWhyLine ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400 hover:text-white'
                                  }`}
                               >
                                  {explainWhyLine ? 'Hide Variation' : 'Show Why'}
                               </button>
                            </div>
                            <div className="bg-green-500/[0.03] p-3 rounded-xl border border-green-500/10">
                              <p className="text-xs text-green-400 font-mono italic leading-relaxed">
                                {moveAnalysis.bestLine}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center gap-5 opacity-40">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400 font-medium max-w-[200px]">
                        Click on a move to see the analysis and coach feedback.
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-4 pb-4 mt-auto">
                   <div className="h-28 rounded-xl overflow-hidden border border-white/[0.04] bg-black/30 shadow-inner">
                      <EvalGraph />
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col p-5 gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                     <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-50">Move Breakdown</h3>
                     <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-gray-500">
                        <span>White</span>
                        <span>Black</span>
                     </div>
                  </div>
                  <div className="grid gap-1">
                    {typesToShow.map((type) => {
                      const wCount = analysisResult.counts.white[type];
                      const bCount = analysisResult.counts.black[type];
                      if (wCount === 0 && bCount === 0 && type !== 'brilliant') return null;
                      
                      const d = classData[type];
                      return (
                        <div 
                          key={type} 
                          className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-lg group-hover:scale-110 transition-transform`}
                              style={{ backgroundColor: d.color }}
                            >
                              {d.symbol}
                            </div>
                            <span className="text-xs font-bold text-gray-300">{d.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-8">
                            <span className={`text-xs font-black tabular-nums w-4 text-center ${wCount > 0 ? d.text : 'text-gray-800'}`}>{wCount}</span>
                            <span className={`text-xs font-black tabular-nums w-4 text-center ${bCount > 0 ? d.text : 'text-gray-800'}`}>{bCount}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                   <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-50 text-center">Summary Insight</h3>
                   <div className="space-y-3">
                      <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
                        <p className="text-xs text-gray-300 leading-relaxed font-medium">
                          {analysisResult.summary.white}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
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
                className="flex flex-col h-full p-8 items-center text-center gap-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl shadow-2xl relative z-10">
                    🧙‍♂️
                    <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-green-500 border-4 border-[#0d0e12] flex items-center justify-center">
                      <Medal className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-blue-500/30 blur-[40px] rounded-full scale-125 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">Coach Insights</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Artificial Intelligence Analysis</p>
                </div>

                <div className="bg-white/[0.04] p-8 rounded-[2rem] border border-white/10 relative shadow-2xl max-w-[320px]">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#1a1b21] border-l border-t border-white/10 rotate-45" />
                  <p className="text-sm text-gray-200 leading-relaxed font-medium italic">
                    &quot;Your performance in the opening was strong, but you missed a critical tactical opportunity in the middlegame. Focus on scanning for checks and captures to improve your precision.&quot;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                   <div className="bg-blue-500/[0.07] p-4 rounded-2xl border border-blue-500/10 flex flex-col items-center gap-1.5">
                      <Medal className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Strength</span>
                      <span className="text-sm font-black text-white uppercase">Openings</span>
                   </div>
                   <div className="bg-purple-500/[0.07] p-4 rounded-2xl border border-purple-500/10 flex flex-col items-center gap-1.5">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Growth</span>
                      <span className="text-sm font-black text-white uppercase">Tactics</span>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-[2rem] bg-blue-600/5 border border-blue-500/10 flex items-center justify-center relative z-10 shadow-inner">
                <Sparkles className="w-10 h-10 text-blue-500/40 animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-blue-500/10 blur-[40px] rounded-full scale-150" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Review Your Game</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[240px]">
                {history.length > 0 
                  ? "Get an accuracy score and see your brilliant moves with our grandmaster review."
                  : "Play a game first to unlock deep engine analysis."}
              </p>
            </div>
            {history.length > 0 && (
               <button 
                 onClick={() => runGameReview()}
                 className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-[0_8px_32px_rgba(59,130,246,0.3)] flex items-center gap-3"
               >
                 <Zap className="w-4 h-4 fill-current" />
                 Start Game Review
               </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Re-analyze Button */}
      {!isAnalyzing && analysisResult && (
        <div className="p-4 border-t border-white/[0.05] bg-white/[0.01]">
          <button 
            onClick={() => runGameReview()}
            className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 active:brightness-90 text-white font-black text-xs md:text-sm py-4 rounded-2xl shadow-xl active:translate-y-[2px] transition-all uppercase tracking-[0.15em] border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
            <div className="flex items-center justify-center gap-2 relative z-10">
              <RotateCcw className="w-4 h-4" />
              Re-Analyze Game
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
