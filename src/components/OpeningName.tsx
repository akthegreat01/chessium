"use client";

import { useChessStore } from '@/lib/chessStore';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function OpeningName() {
  const { history, currentMoveIndex } = useChessStore();
  const [openingName, setOpeningName] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch opening for the first 25 moves to save requests
    if (currentMoveIndex < 0 || currentMoveIndex > 30) {
      if (currentMoveIndex < 0) setOpeningName('Starting Position');
      return;
    }

    const fetchOpening = async () => {
      try {
        // Construct play string for Lichess API (e.g. "e2e4,e7e5")
        // Lichess play API expects comma-separated UCI moves
        const uciMoves = history.slice(0, currentMoveIndex + 1).map(m => m.from + m.to + (m.promotion || '')).join(',');
        
        const res = await fetch(`https://explorer.lichess.ovh/masters?play=${uciMoves}`);
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.opening && data.opening.name) {
          setOpeningName(data.opening.name);
        } else if (data.opening === null && currentMoveIndex > 0) {
          // keep previous
        }
      } catch (err) {
        // silently fail
      }
    };

    const debounce = setTimeout(fetchOpening, 500);
    return () => clearTimeout(debounce);

  }, [currentMoveIndex, history]);

  if (!openingName) return null;

  return (
    <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-lg w-fit text-sm shadow-sm backdrop-blur-md">
      <BookOpen className="w-4 h-4 text-green-500" />
      <span className="text-gray-200 font-medium truncate max-w-[300px]">{openingName}</span>
    </div>
  );
}
