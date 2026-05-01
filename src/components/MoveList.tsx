"use client";

import { useChessStore } from '@/lib/chessStore';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Play, Pause, SkipForward } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const classificationMeta: Record<string, { bg: string; text: string; label: string }> = {
  brilliant:   { bg: '#1cb0f6', text: '!!',  label: 'Brilliant' },
  great:       { bg: '#5c8bb0', text: '!',   label: 'Great' },
  best:        { bg: '#81b64c', text: '✓',   label: 'Best' },
  excellent:   { bg: '#96bc4b', text: '★',   label: 'Excellent' },
  good:        { bg: '#96af8b', text: '●',   label: 'Good' },
  book:        { bg: '#d5a47d', text: '📖',  label: 'Book' },
  inaccuracy:  { bg: '#f7c545', text: '?!',  label: 'Inaccuracy' },
  mistake:     { bg: '#ffa459', text: '?',   label: 'Mistake' },
  blunder:     { bg: '#fa412d', text: '??',  label: 'Blunder' },
  forced:      { bg: '#737373', text: '→',   label: 'Forced' },
};

export default function MoveList() {
  const { history, currentMoveIndex, goToMove, goBack, goForward, analysisResult, mainLineHistory, restoreMainLine } = useChessStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [hoveredMove, setHoveredMove] = useState<number | null>(null);

  // Auto-scroll to current move
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.active-move');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentMoveIndex]);

  // Auto-play logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentMoveIndex < history.length - 1) {
          goForward();
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentMoveIndex, history.length, goForward, playbackSpeed]);

  // Group moves into pairs (white, black)
  const movePairs = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      white: history[i],
      whiteIndex: i,
      black: history[i + 1],
      blackIndex: i + 1
    });
  }

  const renderMoveButton = (moveIndex: number, san: string) => {
    const classification = analysisResult?.classifications[moveIndex];
    const meta = classification ? classificationMeta[classification] : null;
    const moveAnalysis = analysisResult?.moveAnalyses?.[moveIndex];
    const isActive = currentMoveIndex === moveIndex;
    const isHovered = hoveredMove === moveIndex;

    return (
      <div className="relative flex-1">
        <button
          onClick={() => goToMove(moveIndex)}
          onMouseEnter={() => setHoveredMove(moveIndex)}
          onMouseLeave={() => setHoveredMove(null)}
          className={`w-full text-left px-2 py-1 rounded-md transition-all flex justify-between items-center text-sm ${
            isActive 
            ? 'bg-[#81b64c]/20 text-white font-bold active-move' 
            : 'text-gray-300 hover:bg-white/5'
          }`}
          style={meta && !isActive ? { 
            paddingLeft: '6px'
          } : {}}
        >
          <span className="font-semibold">{san}</span>
          {meta && (
            <span 
              className="w-[18px] h-[18px] flex-shrink-0 rounded-full ml-1 flex items-center justify-center shadow-sm text-[10px] font-black" 
              style={{ backgroundColor: meta.bg, color: '#fff' }}
            >
              {meta.text}
            </span>
          )}
        </button>

        {/* Tooltip on hover */}
        {isHovered && moveAnalysis && (
          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[rgba(15,16,19,0.95)] backdrop-blur-md border border-[rgba(255,255,255,0.15)] rounded-lg p-2.5 shadow-2xl min-w-[160px] pointer-events-none">
            <div className="flex items-center gap-1.5 mb-1.5">
              {meta && (
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: meta.bg }} />
              )}
              <span className="text-xs font-semibold text-white">{meta?.label || 'Move'}</span>
            </div>
            <div className="flex flex-col gap-0.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-500">CP Loss</span>
                <span className={`font-mono ${moveAnalysis.cpLoss > 100 ? 'text-red-400' : moveAnalysis.cpLoss > 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {moveAnalysis.cpLoss.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Accuracy</span>
                <span className="font-mono text-gray-200">{moveAnalysis.moveAccuracy.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Best was</span>
                <span className="font-mono text-green-400">{moveAnalysis.bestMoveSan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Depth</span>
                <span className="font-mono text-gray-400">{moveAnalysis.depth}</span>
              </div>
              {moveAnalysis.bestLine && (
                <div className="mt-1 pt-1 border-t border-[rgba(255,255,255,0.1)] text-gray-400 text-[9px] line-clamp-2 leading-tight">
                  <span className="text-green-500/70 font-semibold mr-1">Line:</span>
                  {moveAnalysis.bestLine}
                </div>
              )}
            </div>
            {/* Arrow pointer */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[rgba(15,16,19,0.95)]" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#262421] rounded-lg p-4 flex flex-col gap-4 max-h-[360px]">
      <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.1)] pb-2">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-lg text-gray-200">Move List</h2>
          {mainLineHistory && (
            <button 
              onClick={restoreMainLine}
              className="text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-0.5 rounded transition-colors uppercase font-bold"
            >
              Restore Original
            </button>
          )}
        </div>
        <span className="text-[10px] text-gray-500 font-mono">{history.length} moves</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col text-sm"
      >
        {movePairs.map((pair, i) => (
          <div key={i} className="flex py-0.5 group items-center">
            <span className="w-8 text-gray-500 font-mono text-xs text-right pr-2">{i + 1}.</span>
            
            <div className="flex-1 flex gap-1.5">
              {renderMoveButton(pair.whiteIndex, pair.white.san)}
              
              {pair.black ? (
                renderMoveButton(pair.blackIndex, pair.black.san)
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-gray-500 italic text-center mt-8 flex flex-col items-center gap-2">
            <div className="text-2xl">♟</div>
            <span>No moves yet</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex gap-1">
          <button 
            onClick={() => goToMove(-1)}
            disabled={currentMoveIndex === -1}
            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="First move (Home)"
          >
            <ChevronsLeft className="w-4 h-4 text-gray-300" />
          </button>
          <button 
            onClick={goBack}
            disabled={currentMoveIndex === -1}
            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Previous move (←)"
          >
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={history.length === 0}
            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Auto-play (Space)"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-green-400" /> : <Play className="w-4 h-4 text-gray-300" />}
          </button>
          <button 
            onClick={goForward}
            disabled={currentMoveIndex === history.length - 1}
            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Next move (→)"
          >
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
          <button 
            onClick={() => goToMove(history.length - 1)}
            disabled={currentMoveIndex === history.length - 1}
            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Last move (End)"
          >
            <ChevronsRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>

        {/* Playback speed */}
        {isPlaying && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <button 
              onClick={() => setPlaybackSpeed(Math.min(3000, playbackSpeed + 500))}
              className="hover:text-gray-300 transition-colors"
            >
              ◁
            </button>
            <span className="font-mono w-8 text-center">{(playbackSpeed / 1000).toFixed(1)}s</span>
            <button 
              onClick={() => setPlaybackSpeed(Math.max(200, playbackSpeed - 200))}
              className="hover:text-gray-300 transition-colors"
            >
              ▷
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
