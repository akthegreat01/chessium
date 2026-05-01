"use client";

import { useChessStore } from '@/lib/chessStore';
import { useMemo } from 'react';
import { MoveClassification } from '@/lib/analyzer';

// Move classification colors matching chess.com
const classColors: Record<string, string> = {
  brilliant: '#1cb0f6', great: '#5c8bb0', best: '#81b64c', excellent: '#96bc4b',
  good: '#96af8b', book: '#d5a47d', inaccuracy: '#f7c545', mistake: '#ffa459',
  blunder: '#fa412d', forced: '#737373',
};

export default function EvalGraph() {
  const { analysisResult, history, goToMove, currentMoveIndex } = useChessStore();
  const evals = analysisResult?.evals;

  const { points, pointsWhite, pointsBlack, classificationDots } = useMemo(() => {
    if (!evals || evals.length === 0) return { points: '', pointsWhite: '', pointsBlack: '', classificationDots: [] as { x: number; y: number; color: string; type: string }[] };
    
    const width = 1000;
    const height = 100;
    const midY = height / 2;
    const stepX = width / Math.max(1, evals.length - 1);
    
    let pts = `0,${midY} `;
    let ptsWhite = `0,${midY} `;
    let ptsBlack = `0,${midY} `;
    const dots: { x: number; y: number; color: string; type: string }[] = [];
    
    evals.forEach((ev, i) => {
      const x = i * stepX;
      const clamped = Math.max(-1000, Math.min(1000, ev));
      const scaled = (Math.atan(clamped / 300) / (Math.PI / 2)) * (height / 2);
      const y = midY - scaled; 
      
      pts += `${x},${y} `;
      ptsWhite += `${x},${Math.min(y, midY)} `;
      ptsBlack += `${x},${Math.max(y, midY)} `;

      // Add classification dots for mistakes/blunders/inaccuracies
      if (i > 0 && analysisResult?.classifications[i - 1]) {
        const cls = analysisResult.classifications[i - 1];
        if (['blunder', 'mistake', 'inaccuracy', 'brilliant'].includes(cls)) {
          dots.push({ x, y, color: classColors[cls] || '#666', type: cls });
        }
      }
    });
    
    ptsWhite += `${width},${midY} 0,${midY}`;
    ptsBlack += `${width},${midY} 0,${midY}`;
    
    return { points: pts, pointsWhite: ptsWhite, pointsBlack: ptsBlack, classificationDots: dots };
  }, [evals, analysisResult?.classifications]);

  if (!evals) return null;

  const indicatorX = currentMoveIndex >= 0 && evals.length > 0 
    ? (currentMoveIndex / Math.max(1, evals.length - 1)) * 100 
    : 0;

  return (
    <div className="w-full h-16 relative overflow-hidden cursor-pointer bg-[#333] group"
         onClick={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           const percent = (e.clientX - rect.left) / rect.width;
           const targetIndex = Math.round(percent * (evals.length - 1));
           goToMove(Math.max(0, targetIndex));
         }}>
      
      <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full absolute top-0 left-0">
        {/* White area */}
        <polygon points={pointsWhite} fill="#ffffff" />
        {/* Black area */}
        <polygon points={pointsBlack} fill="#404040" />
        {/* Main line */}
        <polyline points={points} fill="none" stroke="#262421" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Center line */}
        <line x1="0" y1="50" x2="1000" y2="50" stroke="#888" strokeWidth="1" />
        
        {/* Classification dots */}
        {classificationDots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r="6" fill={dot.color} stroke="#fff" strokeWidth="1.5" />
        ))}
      </svg>
      
      {/* Current Move Indicator */}
      {currentMoveIndex >= 0 && (
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-[#1cb0f6] z-10 transition-all duration-200"
          style={{ left: `${indicatorX}%` }}
        />
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 bg-black/[0.05] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
