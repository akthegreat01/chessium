"use client";

import { useChessStore } from '@/lib/chessStore';
import { Activity, Play, RotateCw, ZoomIn, Star } from 'lucide-react';
import { MoveClassification } from '@/lib/analyzer';
import { motion } from 'framer-motion';
import EvalGraph from './EvalGraph';
import Image from 'next/image';

const classData: Record<MoveClassification, { label: string; color: string; symbol: string }> = {
  brilliant:   { label: 'Brilliant',   color: '#1cb0f6', symbol: '!!' },
  great:       { label: 'Great',       color: '#5c8bb0', symbol: '!' },
  best:        { label: 'Best',        color: '#81b64c', symbol: '★' },
  excellent:   { label: 'Excellent',   color: '#96bc4b', symbol: '✓' },
  good:        { label: 'Good',        color: '#96af8b', symbol: '●' },
  book:        { label: 'Book',        color: '#d5a47d', symbol: '📖' },
  inaccuracy:  { label: 'Inaccuracy',  color: '#f7c545', symbol: '?!' },
  mistake:     { label: 'Mistake',     color: '#ffa459', symbol: '?' },
  blunder:     { label: 'Blunder',     color: '#fa412d', symbol: '??' },
  forced:      { label: 'Forced',      color: '#737373', symbol: '→' },
};

function getGrade(accuracy: number) {
  if (accuracy >= 95) return { letter: 'S+', color: 'from-purple-400 to-pink-600', shadow: 'shadow-[0_0_15px_rgba(192,38,211,0.5)]' };
  if (accuracy >= 90) return { letter: 'S', color: 'from-blue-400 to-indigo-600', shadow: 'shadow-[0_0_15px_rgba(79,70,229,0.5)]' };
  if (accuracy >= 80) return { letter: 'A', color: 'from-green-400 to-emerald-600', shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]' };
  if (accuracy >= 70) return { letter: 'B', color: 'from-yellow-400 to-orange-500', shadow: '' };
  if (accuracy >= 50) return { letter: 'C', color: 'from-orange-400 to-red-500', shadow: '' };
  if (accuracy >= 30) return { letter: 'D', color: 'from-red-500 to-red-700', shadow: '' };
  return { letter: 'F', color: 'from-gray-500 to-gray-700', shadow: '' };
}

export default function GameReview() {
  const { runGameReview, isAnalyzing, analysisProgress, analysisResult, history, currentMoveIndex, variationAnalysis, mainLineHistory } = useChessStore();

  const typesToShow: MoveClassification[] = ['brilliant', 'great', 'best', 'excellent', 'good', 'book', 'inaccuracy', 'mistake', 'blunder'];

  // Use variation analysis if exploring a sideline, otherwise use main analysis
  const moveAnalysis = (variationAnalysis && mainLineHistory)
    ? variationAnalysis
    : analysisResult?.moveAnalyses?.[currentMoveIndex];
  const moveClass = moveAnalysis ? classData[moveAnalysis.classification] : null;

  return (
    <div className="bg-[#262421] rounded-lg p-4 flex flex-col gap-4 text-gray-200 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div className="flex-1" />
        <h2 className="font-bold text-lg text-white flex items-center gap-2">
          <div className="bg-white/20 p-1 rounded-full"><Star className="w-4 h-4 text-white fill-white" /></div>
          Game Review
        </h2>
        <div className="flex-1 flex justify-end">
          <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="w-full max-w-[200px] bg-black/40 h-3 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              className="bg-[#81b64c] h-full"
              animate={{ width: `${analysisProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm font-semibold text-gray-300">Analyzing Game... {Math.round(analysisProgress)}%</p>
        </div>
      )}

      {/* Results */}
      {analysisResult && !isAnalyzing && (
        <div className="flex flex-col gap-5">
          
          {/* Coach Insight (Clean Feedback style) */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="bg-white/10 text-gray-100 px-4 py-3 rounded-lg text-sm font-medium border border-white/5 shadow-inner">
              {moveAnalysis && moveClass && currentMoveIndex >= 0 ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-black text-white"
                      style={{ backgroundColor: moveClass.color }}
                    >
                      {moveClass.symbol}
                    </span>
                    <span className="font-bold text-white">
                      {['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification) ? 'Inaccuracy detected' : 'Good move'}
                    </span>
                  </div>
                  <span className="text-gray-300">
                    {['blunder', 'mistake', 'inaccuracy'].includes(moveAnalysis.classification) ? 
                      `That was a ${moveAnalysis.classification}. You had a better move. The engine preferred ${moveAnalysis.bestMoveSan}.` :
                    ['brilliant', 'great', 'best'].includes(moveAnalysis.classification) ? 
                      "Excellent! You found the best move." :
                      "A solid move, keeping the position balanced."
                    }
                  </span>
                </div>
              ) : (
                <span className="text-gray-300">Here is your game review. Let's see how you played!</span>
              )}
            </div>
          </div>

          {/* Eval Graph directly inside Game Review */}
          <div className="mt-2 mb-2 bg-white rounded shadow overflow-hidden">
            <EvalGraph />
          </div>

          {/* Players & Accuracy */}
          <div className="flex flex-col gap-3 px-2">
            <div className="flex items-end justify-between px-8">
              <div className="text-xs font-bold text-gray-400 text-center w-16">Players</div>
              <div className="flex flex-col items-center gap-1 w-16">
                <span className="text-xs font-bold text-gray-300 w-24 text-center truncate">White</span>
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow">
                  <span className="text-3xl drop-shadow">♙</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 w-16">
                <span className="text-xs font-bold text-gray-300 w-24 text-center truncate">Black</span>
                <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center shadow">
                  <span className="text-3xl text-gray-800 drop-shadow">♟</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-8 mt-2">
              <div className="text-xs font-bold text-gray-400 w-16">Accuracy</div>
              <div className="w-16 flex flex-col items-center gap-1">
                <div className="bg-white text-gray-900 font-black text-lg px-2 py-0.5 rounded shadow w-full text-center">
                  {Math.round(analysisResult.accuracy.white * 10) / 10}
                </div>
                {analysisResult.accuracy.white > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                    className={`text-sm font-black text-transparent bg-clip-text bg-gradient-to-br ${getGrade(analysisResult.accuracy.white).color}`}
                  >
                    {getGrade(analysisResult.accuracy.white).letter}
                  </motion.div>
                )}
              </div>
              <div className="w-16 flex flex-col items-center gap-1">
                <div className="bg-[#2b2b2b] text-gray-200 border border-white/10 font-black text-lg px-2 py-0.5 rounded shadow w-full text-center">
                  {Math.round(analysisResult.accuracy.black * 10) / 10}
                </div>
                {analysisResult.accuracy.black > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                    className={`text-sm font-black text-transparent bg-clip-text bg-gradient-to-br ${getGrade(analysisResult.accuracy.black).color}`}
                  >
                    {getGrade(analysisResult.accuracy.black).letter}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Classification Breakdown */}
          <div className="flex flex-col gap-2 mt-4 px-2">
            {typesToShow.map(type => {
              const wCount = analysisResult.counts.white[type];
              const bCount = analysisResult.counts.black[type];
              if (wCount === 0 && bCount === 0) return null;
              
              const d = classData[type];
              return (
                <div key={type} className="flex items-center justify-between px-8 py-0.5">
                  <div className="w-24 text-sm font-bold text-gray-300">{d.label}</div>
                  
                  <div className="w-8 text-center text-sm font-bold" style={{ color: wCount > 0 ? d.color : '#666' }}>
                    {wCount}
                  </div>
                  
                  <div className="w-8 flex justify-center">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shadow text-white font-black text-[11px]"
                         style={{ backgroundColor: d.color }}>
                      {d.symbol}
                    </div>
                  </div>
                  
                  <div className="w-8 text-center text-sm font-bold" style={{ color: bCount > 0 ? d.color : '#666' }}>
                    {bCount}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Start Review / Analyze button */}
      {!isAnalyzing && (
        <div className="mt-4">
          <button 
            onClick={runGameReview}
            disabled={history.length === 0}
            className="w-full bg-gradient-to-r from-red-600 via-orange-500 via-purple-600 to-blue-600 hover:brightness-110 text-white font-bold text-lg py-4 rounded-xl shadow-[0_6px_0_rgba(0,0,0,0.3)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {analysisResult ? 'Re-Analyze Game' : 'Start Engine Review'}
          </button>
        </div>
      )}

      {!isAnalyzing && !analysisResult && history.length === 0 && (
        <p className="text-sm text-gray-500 italic text-center py-4">Play or import a game to review.</p>
      )}
    </div>
  );
}
