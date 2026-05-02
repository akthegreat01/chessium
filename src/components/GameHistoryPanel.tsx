"use client";

import { useState, useEffect } from 'react';
import { useChessStore } from '@/lib/chessStore';
import { loadGameHistory, deleteGameFromHistory, clearGameHistory, GameHistoryEntry } from '@/lib/gameHistory';
import { positionCache } from '@/lib/positionCache';
import { Clock, Trash2, History, Brain, ChevronDown, ChevronUp, Zap, Target } from 'lucide-react';
import MistakeTrainer from './MistakeTrainer';

const classColors: Record<string, string> = {
  brilliant: '#1cb0f6', great: '#5c8bb0', best: '#81b64c', excellent: '#96bc4b',
  good: '#96af8b', book: '#d5a47d', inaccuracy: '#f7c545', mistake: '#ffa459',
  blunder: '#fa412d',
};

export default function GameHistoryPanel() {
  const { loadPgn } = useChessStore();
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [cacheSize, setCacheSize] = useState(0);
  const [showTrainer, setShowTrainer] = useState(false);

  useEffect(() => {
    setHistory(loadGameHistory());
    setCacheSize(positionCache.stats().size);
  }, []);

  const handleLoadGame = (entry: GameHistoryEntry) => {
    // Load the PGN which triggers auto-analysis,
    // but since positions are cached, it will be much faster
    loadPgn(entry.pgn);
  };

  const handleDeleteGame = (id: string) => {
    deleteGameFromHistory(id);
    setHistory(loadGameHistory());
  };

  const handleClearAll = () => {
    clearGameHistory();
    setHistory([]);
  };

  const handleClearCache = () => {
    positionCache.clear();
    setCacheSize(0);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  if (history.length === 0 && cacheSize === 0) return null;

  return (
    <div className="glass-panel p-2 flex flex-col gap-1.5">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-green-400" />
          <h3 className="font-semibold text-sm text-white">Recent Games</h3>
          {history.length > 0 && (
            <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full">
              {history.length}
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {expanded && (
        <>
          {/* Brain stats */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg px-3 py-2 border border-purple-500/10">
            <Brain className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] text-gray-300 font-medium">Position Memory</p>
              <p className="text-[10px] text-gray-500">
                {cacheSize.toLocaleString()} positions learned · Analysis gets faster over time
              </p>
            </div>
            {cacheSize > 0 && (
              <button
                onClick={handleClearCache}
                className="text-[9px] text-gray-500 hover:text-red-400 transition-colors px-1.5 py-0.5 rounded border border-white/5 hover:border-red-500/20"
                title="Clear position cache"
              >
                Reset
              </button>
            )}
          </div>

          {/* Train Mistakes Button */}
          {history.length > 0 && (
            <button
              onClick={() => setShowTrainer(true)}
              className="w-full mt-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/20 hover:border-red-500/40 text-red-100 font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-inner"
            >
              <Target className="w-4 h-4 text-red-400" />
              Train Your Mistakes
            </button>
          )}

          {/* Game list */}
          {history.length > 0 && (
            <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] rounded-lg p-2 cursor-pointer transition-all border border-white/[0.04] hover:border-white/[0.08]"
                  onClick={() => handleLoadGame(entry)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-white truncate max-w-[100px]">{entry.white}</span>
                      <span className="text-[10px] text-gray-600">vs</span>
                      <span className="text-xs font-semibold text-white truncate max-w-[100px]">{entry.black}</span>
                      <span className="text-[10px] text-gray-600 ml-auto">{entry.result}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-white border border-gray-400" />
                        <span className="text-[10px] font-mono text-gray-400">{entry.accuracy.white.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-700 border border-gray-500" />
                        <span className="text-[10px] font-mono text-gray-400">{entry.accuracy.black.toFixed(1)}</span>
                      </div>
                      <span className="text-[10px] text-gray-600 ml-1">{entry.totalMoves} moves</span>
                      <span title="Cached - will analyze instantly">
                        <Zap className="w-2.5 h-2.5 text-yellow-500/50" />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] text-gray-600 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDate(entry.analyzedAt)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteGame(entry.id); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-gray-600 hover:text-red-400"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clear all */}
          {history.length > 2 && (
            <button
              onClick={handleClearAll}
              className="text-[10px] text-gray-600 hover:text-red-400 transition-colors text-center py-1"
            >
              Clear all history
            </button>
          )}
        </>
      )}

      {showTrainer && <MistakeTrainer onClose={() => setShowTrainer(false)} />}
    </div>
  );
}
