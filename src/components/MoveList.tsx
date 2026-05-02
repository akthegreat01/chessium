"use client";

import { useChessStore } from '@/lib/chessStore';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Play, Pause, SkipForward, Info, Target, Zap, RotateCcw, List
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const classificationMeta: Record<string, { bg: string; text: string; label: string; glow: string }> = {
  brilliant:   { bg: '#1cb0f6', text: '!!',  label: 'Brilliant',   glow: 'shadow-[0_0_8px_rgba(28,176,246,0.4)]' },
  great:       { bg: '#5c8bb0', text: '!',   label: 'Great',       glow: 'shadow-[0_0_6px_rgba(92,139,176,0.3)]' },
  best:        { bg: '#81b64c', text: '★',   label: 'Best',        glow: '' },
  excellent:   { bg: '#96bc4b', text: '✓',   label: 'Excellent',   glow: '' },
  good:        { bg: '#96af8b', text: '●',   label: 'Good',        glow: '' },
  book:        { bg: '#d5a47d', text: '📖',  label: 'Book',        glow: '' },
  inaccuracy:  { bg: '#f7c545', text: '?!',  label: 'Inaccuracy',  glow: 'shadow-[0_0_6px_rgba(247,197,69,0.3)]' },
  mistake:     { bg: '#ffa459', text: '?',   label: 'Mistake',     glow: 'shadow-[0_0_6px_rgba(255,164,89,0.4)]' },
  blunder:     { bg: '#fa412d', text: '??',  label: 'Blunder',     glow: 'shadow-[0_0_8px_rgba(250,65,45,0.4)]' },
  forced:      { bg: '#737373', text: '→',   label: 'Forced',      glow: '' },
};

export default function MoveList() {
  const { 
    history, currentMoveIndex, goToMove, goBack, goForward, 
    analysisResult, mainLineHistory, restoreMainLine 
  } = useChessStore();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [hoveredMove, setHoveredMove] = useState<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const activeEl = container.querySelector('.active-move') as HTMLElement;
      if (activeEl) {
        const containerRect = container.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        
        if (elRect.top < containerRect.top || elRect.bottom > containerRect.bottom) {
          container.scrollTo({
            top: activeEl.offsetTop - container.offsetTop - container.clientHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [currentMoveIndex]);

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
    const isActive = currentMoveIndex === moveIndex;

    return (
      <div className="relative flex-1">
        <button
          onClick={() => goToMove(moveIndex)}
          onMouseEnter={() => setHoveredMove(moveIndex)}
          onMouseLeave={() => setHoveredMove(null)}
          className={`group w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between text-xs font-bold border ${
            isActive 
            ? 'bg-blue-500/10 border-blue-500/30 text-blue-100 active-move shadow-[0_4px_16px_rgba(59,130,246,0.1)]' 
            : 'text-gray-400 border-transparent hover:bg-white/[0.03] hover:text-gray-200'
          }`}
        >
          <span className="truncate pr-1">{san}</span>
          {meta && (
            <span 
              className={`w-[14px] h-[14px] flex-shrink-0 rounded-full flex items-center justify-center text-[8px] font-black shadow-sm transform transition-transform group-hover:scale-110 ${meta.glow}`} 
              style={{ backgroundColor: meta.bg, color: '#fff' }}
            >
              {meta.text}
            </span>
          )}
        </button>

        {/* Improved Tooltip */}
        <AnimatePresence>
          {hoveredMove === moveIndex && analysisResult?.moveAnalyses?.[moveIndex] && (
            <motion.div 
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute z-[60] bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[#0a0b0e]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl min-w-[180px] pointer-events-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: meta?.bg || '#444' }}>
                    {meta?.text || '?'}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight text-white">{meta?.label || 'Move'}</span>
                  <span className="ml-auto text-[10px] font-bold text-gray-500 tabular-nums">#{moveIndex + 1}</span>
                </div>
                
                <div className="space-y-1.5">
                  {[
                    { label: 'Accuracy', val: `${analysisResult.moveAnalyses[moveIndex].moveAccuracy.toFixed(0)}%`, color: 'text-gray-200' },
                    { label: 'Best Move', val: analysisResult.moveAnalyses[moveIndex].bestMoveSan, color: 'text-green-400' },
                    { label: 'CP Loss', val: analysisResult.moveAnalyses[moveIndex].cpLoss.toFixed(0), color: analysisResult.moveAnalyses[moveIndex].cpLoss > 50 ? 'text-red-400' : 'text-gray-400' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500 font-medium">{item.label}</span>
                      <span className={`font-black tabular-nums ${item.color}`}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0a0b0e] border-r border-b border-white/10 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="glass-panel flex flex-col overflow-hidden min-h-[250px] max-h-[400px] relative z-10">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <List className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Move History</h2>
        </div>
        
        {mainLineHistory && (
          <button 
            onClick={restoreMainLine}
            className="flex items-center gap-1.5 text-[9px] font-black bg-red-500/10 text-red-400 hover:bg-red-500/20 px-2.5 py-1 rounded-md transition-all uppercase tracking-tighter border border-red-500/20"
          >
            <RotateCcw className="w-3 h-3" />
            Restore Line
          </button>
        )}
      </div>

      {/* List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-0.5"
      >
        {movePairs.map((pair, i) => (
          <div key={i} className="flex items-center group/row rounded-lg hover:bg-white/[0.01] transition-colors">
            <div className="w-8 flex-shrink-0 text-center">
              <span className="text-[10px] font-black text-gray-600 group-hover/row:text-gray-500 transition-colors tabular-nums">
                {i + 1}
              </span>
            </div>
            
            <div className="flex-1 flex gap-1.5 py-0.5 pr-1">
              {renderMoveButton(pair.whiteIndex, pair.white.san)}
              
              {pair.black ? (
                renderMoveButton(pair.blackIndex, pair.black.san)
              ) : (
                <div className="flex-1 invisible" />
              )}
            </div>
          </div>
        ))}
        
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4 opacity-30">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
              <span className="text-lg font-black text-gray-500">?</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Wait for moves</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-3 border-t border-white/[0.05] bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5 bg-black/20 p-1 rounded-xl border border-white/5 shadow-inner">
            {[
              { icon: ChevronsLeft, onClick: () => goToMove(-1), disabled: currentMoveIndex === -1, title: 'First (Home)' },
              { icon: ChevronLeft, onClick: goBack, disabled: currentMoveIndex === -1, title: 'Back (←)' },
              { 
                icon: isPlaying ? Pause : Play, 
                onClick: () => setIsPlaying(!isPlaying), 
                disabled: history.length === 0, 
                title: 'Auto-play (Space)',
                active: isPlaying
              },
              { icon: ChevronRight, onClick: goForward, disabled: currentMoveIndex === history.length - 1, title: 'Forward (→)' },
              { icon: ChevronsRight, onClick: () => goToMove(history.length - 1), disabled: currentMoveIndex === history.length - 1, title: 'Last (End)' },
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                disabled={btn.disabled}
                title={btn.title}
                className={`p-2 rounded-lg transition-all ${
                  btn.disabled 
                  ? 'opacity-20 cursor-not-allowed' 
                  : btn.active
                    ? 'bg-blue-500/20 text-blue-400 shadow-inner'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 active:scale-90'
                }`}
              >
                <btn.icon className={`w-4 h-4 ${btn.active ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>

          {isPlaying && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20"
            >
              <Zap className="w-3 h-3 text-blue-400 fill-current animate-pulse" />
              <span className="text-[10px] font-black text-blue-300 tabular-nums">
                {(playbackSpeed / 1000).toFixed(1)}s
              </span>
              <div className="flex flex-col gap-0.5">
                <button 
                  onClick={() => setPlaybackSpeed(Math.max(200, playbackSpeed - 200))}
                  className="text-[8px] text-blue-400 hover:text-white leading-none"
                >
                  ▲
                </button>
                <button 
                  onClick={() => setPlaybackSpeed(Math.min(3000, playbackSpeed + 500))}
                  className="text-[8px] text-blue-400 hover:text-white leading-none"
                >
                  ▼
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
