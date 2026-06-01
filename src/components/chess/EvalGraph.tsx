"use client";

import React, { useMemo } from "react";

interface EvalGraphProps {
  evaluations: number[]; // Array of CP scores (positive = white advantage)
  currentIndex: number;
  onPointClick: (index: number) => void;
}

export default function EvalGraph({ evaluations, currentIndex, onPointClick }: EvalGraphProps) {
  const points = useMemo(() => {
    if (evaluations.length === 0) return "";
    
    // SVG coordinate space: 0 to 100 width, 0 to 100 height.
    // Y-axis: 0 = +1000 CP (White winning heavily), 100 = -1000 CP (Black winning heavily)
    // X-axis: 0 to 100 representing the moves
    
    const maxMoves = Math.max(evaluations.length - 1, 10);
    
    return evaluations.map((cp, idx) => {
      const x = (idx / maxMoves) * 100;
      // Non-linear scaling: Math.atan maps CP heavily near 0 and compresses large values
      const normalizedCp = (2 / Math.PI) * Math.atan(cp / 300);
      const y = 50 - normalizedCp * 50; 
      return `${x},${y}`;
    }).join(" ");
  }, [evaluations]);

  if (evaluations.length === 0) {
    return (
      <div className="w-full h-16 bg-surface border border-white/5 rounded-xl flex items-center justify-center text-xs text-secondary-foreground">
        Awaiting analysis...
      </div>
    );
  }

  // Calculate current indicator position
  const maxMoves = Math.max(evaluations.length - 1, 10);
  const currentX = (currentIndex / maxMoves) * 100;

  return (
    <div className="w-full h-16 bg-[#111827] border border-white/5 rounded-xl relative overflow-hidden group">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <clipPath id="topHalf">
            <rect x="0" y="0" width="100" height="50" />
          </clipPath>
          <clipPath id="bottomHalf">
            <rect x="0" y="50" width="100" height="50" />
          </clipPath>
        </defs>

        {/* Top Fill Area (White advantage) */}
        <polygon 
          points={`0,50 ${points} ${evaluations.length > 0 ? (evaluations.length-1)/maxMoves*100 : 0},50`}
          fill="#ffffff" 
          clipPath="url(#topHalf)"
        />
        
        {/* Bottom Fill Area (Black advantage) */}
        <polygon 
          points={`0,50 ${points} ${evaluations.length > 0 ? (evaluations.length-1)/maxMoves*100 : 0},50`}
          fill="#333333" 
          clipPath="url(#bottomHalf)"
        />
        
        {/* Zero Line */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      </svg>
      
      {/* Current Position Indicator */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none transition-all duration-200 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
        style={{ left: `${currentX}%` }}
      />

      {/* Click Overlay */}
      <div className="absolute inset-0 flex">
        {evaluations.map((_, idx) => (
          <div 
            key={idx}
            className="flex-1 h-full hover:bg-white/10 cursor-pointer"
            onClick={() => onPointClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}
