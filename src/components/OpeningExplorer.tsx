"use client";

import { useEffect, useState, useCallback } from 'react';
import { useChessStore } from '@/lib/chessStore';
import { fetchExplorerData, ExplorerData, ExplorerDB } from '@/lib/openingBook';
import { BookOpen, Database, TrendingUp } from 'lucide-react';

export default function OpeningExplorer() {
  const { fen, makeMove, game } = useChessStore();
  const [data, setData] = useState<ExplorerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [db, setDb] = useState<ExplorerDB>('masters');
  const [isOpen, setIsOpen] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await fetchExplorerData(fen, db);
    setData(result);
    setLoading(false);
  }, [fen, db]);

  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(fetchData, 400);
    return () => clearTimeout(timeout);
  }, [fetchData, isOpen]);

  const totalGames = data ? data.white + data.draws + data.black : 0;

  const getBarWidth = (w: number, d: number, b: number) => {
    const total = w + d + b;
    if (total === 0) return { white: 33, draw: 34, black: 33 };
    return {
      white: Math.round((w / total) * 100),
      draw: Math.round((d / total) * 100),
      black: Math.round((b / total) * 100),
    };
  };

  const handleMoveClick = (uci: string) => {
    const from = uci.substring(0, 2);
    const to = uci.substring(2, 4);
    const promotion = uci.length > 4 ? uci[4] : undefined;
    makeMove({ from, to, promotion });
  };

  return (
    <div className="glass-panel p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.1)] pb-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <BookOpen className="w-5 h-5 text-green-500" />
          <h2 className="font-semibold text-lg text-gray-200">Opening Explorer</h2>
        </button>
        
        <div className="flex gap-1 p-0.5 bg-[rgba(0,0,0,0.3)] rounded-lg">
          <button
            onClick={() => setDb('masters')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors font-medium ${
              db === 'masters' 
                ? 'bg-green-600/30 text-green-400 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Masters
          </button>
          <button
            onClick={() => setDb('lichess')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors font-medium ${
              db === 'lichess' 
                ? 'bg-green-600/30 text-green-400 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Lichess
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Opening Name */}
          {data?.opening && (
            <div className="flex items-center gap-2 text-sm">
              <Database className="w-3.5 h-3.5 text-green-500/60" />
              <span className="text-green-400 font-medium">{data.opening.eco}</span>
              <span className="text-gray-300 truncate">{data.opening.name}</span>
            </div>
          )}

          {/* Overall Stats Bar */}
          {totalGames > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex h-5 rounded-md overflow-hidden text-[10px] font-bold">
                {(() => {
                  const bar = getBarWidth(data!.white, data!.draws, data!.black);
                  return (
                    <>
                      {bar.white > 0 && (
                        <div className="bg-white text-black flex items-center justify-center" style={{ width: `${bar.white}%` }}>
                          {bar.white}%
                        </div>
                      )}
                      {bar.draw > 0 && (
                        <div className="bg-gray-500 text-white flex items-center justify-center" style={{ width: `${bar.draw}%` }}>
                          {bar.draw}%
                        </div>
                      )}
                      {bar.black > 0 && (
                        <div className="bg-[#1a1a2e] text-white flex items-center justify-center" style={{ width: `${bar.black}%` }}>
                          {bar.black}%
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
              <div className="text-[10px] text-gray-500 text-right">
                {totalGames.toLocaleString()} games
              </div>
            </div>
          )}

          {/* Moves List */}
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            </div>
          ) : data && data.moves.length > 0 ? (
            <div className="flex flex-col text-sm max-h-[200px] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex items-center px-2 py-1.5 text-[10px] text-gray-500 uppercase tracking-wider font-semibold border-b border-[rgba(255,255,255,0.05)]">
                <span className="w-14">Move</span>
                <span className="w-14 text-center">Games</span>
                <span className="flex-1">Result</span>
                {db === 'masters' && <span className="w-10 text-right">Avg</span>}
              </div>
              
              {data.moves.map((move, i) => {
                const total = move.white + move.draws + move.black;
                const bar = getBarWidth(move.white, move.draws, move.black);
                return (
                  <button
                    key={i}
                    onClick={() => handleMoveClick(move.uci)}
                    className="flex items-center px-2 py-1.5 hover:bg-[rgba(255,255,255,0.05)] transition-colors rounded group"
                  >
                    <span className="w-14 font-mono font-bold text-white group-hover:text-green-400 transition-colors">{move.san}</span>
                    <span className="w-14 text-center text-gray-400 text-xs">{total.toLocaleString()}</span>
                    <div className="flex-1 flex h-3 rounded-sm overflow-hidden mx-1">
                      {bar.white > 0 && <div className="bg-white/90" style={{ width: `${bar.white}%` }} />}
                      {bar.draw > 0 && <div className="bg-gray-500/80" style={{ width: `${bar.draw}%` }} />}
                      {bar.black > 0 && <div className="bg-[#1a1a2e]" style={{ width: `${bar.black}%` }} />}
                    </div>
                    {db === 'masters' && (
                      <span className="w-10 text-right text-[10px] text-gray-500">{move.averageRating || '-'}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500 italic">
              {totalGames === 0 ? 'No games found for this position' : 'No continuations in database'}
            </div>
          )}

          {/* Top Games */}
          {data?.topGames && data.topGames.length > 0 && (
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Top Games
              </p>
              {data.topGames.map((g, i) => (
                <a
                  key={i}
                  href={`https://lichess.org/${g.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between text-xs py-1 px-1 hover:bg-[rgba(255,255,255,0.03)] rounded transition-colors"
                >
                  <span className="text-gray-300 truncate">
                    {g.white.name} ({g.white.rating}) vs {g.black.name} ({g.black.rating})
                  </span>
                  <span className="text-gray-500 ml-2 whitespace-nowrap">
                    {g.winner === 'white' ? '1-0' : g.winner === 'black' ? '0-1' : '½-½'} · {g.year}
                  </span>
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
