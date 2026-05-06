"use client";

import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';

interface ArticleBoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  caption?: string;
  solution?: string; // e.g. "Rxd4"
}

export default function ArticleBoard({ fen, orientation = 'white', caption, solution }: ArticleBoardProps) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="my-10 max-w-md mx-auto bg-black/40 p-4 rounded-2xl border border-white/10 shadow-2xl">
      <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <Chessboard 
          options={{
            id: `article-board-${fen.slice(0,10).replace(/[^a-zA-Z0-9]/g, '-')}`,
            position: fen,
            boardOrientation: orientation,
            allowDragging: false,
          }}
        />
      </div>
      {(caption || solution) && (
        <div className="mt-4 px-2 text-center">
          {caption && <p className="text-sm text-gray-400 italic mb-3">{caption}</p>}
          {solution && (
            <button 
              onClick={() => setShowSolution(!showSolution)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-[#d4af37] transition-colors border border-[#d4af37]/20"
            >
              {showSolution ? `Brilliant Move: ${solution}!!` : "Reveal Brilliant Move"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
