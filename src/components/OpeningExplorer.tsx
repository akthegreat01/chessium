"use client";

import { useState, useEffect } from 'react';
import { useChessStore } from '@/lib/chessStore';
import { Book, Users, TrendingUp, ChevronRight } from 'lucide-react';

interface OpeningMove {
  uci: string;
  san: string;
  averageRating: number;
  white: number;
  draws: number;
  black: number;
}

interface OpeningData {
  opening?: {
    eco: string;
    name: string;
  };
  moves: OpeningMove[];
  topGames: any[];
}

export default function OpeningExplorer() {
  const { fen, makeMove } = useChessStore();
  const [data, setData] = useState<OpeningData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOpening = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://explorer.lichess.ovh/lichess?fen=${encodeURIComponent(fen)}&topGames=5`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch opening data", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchOpening, 300);
    return () => clearTimeout(timer);
  }, [fen]);

  if (!data && !loading) return null;

  return (
    <div className="glass-panel overflow-hidden flex flex-col border border-white/5 bg-black/20">
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Book className="w-4 h-4 text-amber-400" />
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Opening Explorer</h3>
        </div>
        {data?.opening && (
          <span className="text-[9px] font-mono text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
            {data.opening.eco}
          </span>
        )}
      </div>

      <div className="p-3">
        {data?.opening ? (
          <h4 className="text-xs font-bold text-gray-200 mb-3 leading-tight">{data.opening.name}</h4>
        ) : loading ? (
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse mb-3" />
        ) : null}

        <div className="space-y-1.5">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-8 w-full bg-white/5 rounded animate-pulse" />
            ))
          ) : data?.moves.length === 0 ? (
            <p className="text-[10px] text-gray-500 italic text-center py-2">No master games found for this position.</p>
          ) : (
            data?.moves.slice(0, 5).map((move) => {
              const total = move.white + move.draws + move.black;
              const wPct = Math.round((move.white / total) * 100);
              const dPct = Math.round((move.draws / total) * 100);
              const bPct = 100 - wPct - dPct;

              return (
                <button
                  key={move.uci}
                  onClick={() => makeMove(move.uci)}
                  className="w-full group flex items-center gap-3 p-1.5 rounded-md hover:bg-white/5 transition-all text-left border border-transparent hover:border-white/10"
                >
                  <span className="w-8 text-[11px] font-black text-amber-400 group-hover:scale-110 transition-transform">
                    {move.san}
                  </span>
                  
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase tracking-tighter">
                      <span className="text-white/70">{wPct}%</span>
                      <span>{dPct}%</span>
                      <span className="text-black/70">{bPct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden flex bg-gray-800">
                      <div className="h-full bg-white/80" style={{ width: `${wPct}%` }} />
                      <div className="h-full bg-gray-500" style={{ width: `${dPct}%` }} />
                      <div className="h-full bg-black/80 shadow-[inset_0_0_5px_rgba(255,255,255,0.1)]" style={{ width: `${bPct}%` }} />
                    </div>
                  </div>

                  <ChevronRight className="w-3 h-3 text-gray-700 group-hover:text-amber-400 transition-colors" />
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="px-3 py-2 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-medium">
          <Users className="w-3 h-3" />
          <span>Lichess Database</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-medium">
          <TrendingUp className="w-3 h-3" />
          <span>Win Rates</span>
        </div>
      </div>
    </div>
  );
}
