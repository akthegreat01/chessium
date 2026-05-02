"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useChessStore } from '@/lib/chessStore';
import { Engine, EngineLine } from '@/lib/engine';
import { Cpu, Power, Settings2 } from 'lucide-react';
import { Chess } from 'chess.js';

function uciToSan(fen: string, pv: string): string {
  if (!pv) return '';
  try {
    const tempGame = new Chess(fen);
    const uciMoves = pv.split(' ').filter(Boolean);
    const sanMoves: string[] = [];
    for (const uci of uciMoves) {
      if (uci.length < 4) break;
      const from = uci.substring(0, 2);
      const to = uci.substring(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const moveObj = tempGame.move({ from, to, promotion });
      if (moveObj) sanMoves.push(moveObj.san);
      else break;
      if (sanMoves.length >= 8) break; // limit to 8 moves
    }
    return sanMoves.join(' ');
  } catch {
    return pv;
  }
}

function formatScore(score: number, mate: number | null): string {
  if (mate !== null) {
    return mate > 0 ? `M${mate}` : `-M${Math.abs(mate)}`;
  }
  const val = score / 100;
  return (val > 0 ? '+' : '') + val.toFixed(1);
}

function formatNodes(n?: number): string {
  if (!n) return '';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'k';
  return n.toString();
}

export default function LiveEnginePanel() {
  const { fen, game } = useChessStore();
  const [isActive, setIsActive] = useState(false);
  const [lines, setLines] = useState<EngineLine[]>([]);
  const [depth, setDepth] = useState(0);
  const [nps, setNps] = useState(0);
  const [multiPv, setMultiPv] = useState(3);
  const engineRef = useRef<Engine | null>(null);
  const lastFenRef = useRef<string>('');

  const startEngine = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.destroy();
    }
    const eng = new Engine();
    engineRef.current = eng;
    
    eng.waitUntilReady().then(() => {
      eng.setConfig({ multiPv, depth: 30 });
      
      eng.onLines((engineLines) => {
        setLines([...engineLines]);
        if (engineLines.length > 0) {
          setDepth(engineLines[0].depth);
          setNps(engineLines[0].nps || 0);
        }
      });

      if (!game.isGameOver()) {
        lastFenRef.current = fen;
        eng.evaluatePosition(fen, 99);
      }
    });
  }, [multiPv]);

  const stopEngine = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
      engineRef.current.destroy();
      engineRef.current = null;
    }
    setLines([]);
    setDepth(0);
    setNps(0);
  }, []);

  // Toggle engine
  const toggleEngine = () => {
    if (isActive) {
      stopEngine();
      setIsActive(false);
    } else {
      setIsActive(true);
      startEngine();
    }
  };

  // Restart engine when position changes
  useEffect(() => {
    if (!isActive || !engineRef.current) return;
    if (fen === lastFenRef.current) return;
    lastFenRef.current = fen;
    
    if (game.isGameOver()) {
      setLines([]);
      return;
    }
    
    engineRef.current.evaluatePosition(fen, 99);
  }, [fen, isActive, game]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current.destroy();
      }
    };
  }, []);

  // Restart engine when multiPv changes
  useEffect(() => {
    if (isActive) {
      stopEngine();
      startEngine();
    }
  }, [multiPv]);

  const isWhiteTurn = game.turn() === 'w';

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isActive 
              ? 'bg-green-500/20 border border-green-500/30 shadow-lg shadow-green-500/20' 
              : 'bg-white/[0.04] border border-white/[0.06]'
          }`}>
            <Cpu className={`w-4 h-4 ${isActive ? 'text-green-400' : 'text-gray-500'}`} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Engine</h3>
            {isActive && (
              <div className="flex items-center gap-2 text-[9px] text-gray-500 font-mono">
                <span>Depth {depth}</span>
                <span>·</span>
                <span>{formatNodes(nps)} n/s</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isActive && (
            <select
              value={multiPv}
              onChange={(e) => setMultiPv(parseInt(e.target.value))}
              className="bg-white/[0.05] border border-white/[0.08] rounded-md px-2 py-1 text-[10px] text-gray-300 font-mono"
            >
              <option value={1}>1 line</option>
              <option value={2}>2 lines</option>
              <option value={3}>3 lines</option>
              <option value={5}>5 lines</option>
            </select>
          )}
          <button
            onClick={toggleEngine}
            title={isActive ? "Stop Engine" : "Start Live Engine"}
            aria-label="Toggle Live Engine"
            className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
              isActive 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            <Power className="w-4 h-4" />
            <span className="text-xs font-bold">{isActive ? "Stop" : "Start Engine"}</span>
          </button>
        </div>
      </div>

      {/* Engine Lines */}
      {isActive && lines.length > 0 && (
        <div className="divide-y divide-white/[0.03]">
          {lines.map((line, i) => {
            const sanLine = uciToSan(fen, line.pv);
            const scoreStr = formatScore(
              isWhiteTurn ? line.score : -line.score,
              line.mate !== null ? (isWhiteTurn ? line.mate : -line.mate) : null
            );
            const isPositive = line.mate !== null ? (isWhiteTurn ? line.mate > 0 : line.mate < 0) : (isWhiteTurn ? line.score > 0 : line.score < 0);
            
            return (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/[0.02] transition-colors group">
                <div className={`w-11 text-right font-mono text-[11px] font-bold tabular-nums ${
                  isPositive ? 'text-white bg-white/10 px-1 py-0.5 rounded' : 'text-gray-500 bg-black/20 px-1 py-0.5 rounded'
                }`}>
                  {scoreStr}
                </div>
                <div className="flex-1 text-xs text-gray-400 font-mono truncate group-hover:text-gray-300 transition-colors leading-relaxed">
                  {sanLine}
                </div>
                <span className="text-[9px] text-gray-600 font-mono">d{line.depth}</span>
              </div>
            );
          })}
        </div>
      )}

      {isActive && lines.length === 0 && !game.isGameOver() && (
        <div className="flex items-center justify-center py-4 gap-2">
          <div className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-500">Calculating...</span>
        </div>
      )}

      {!isActive && (
        <div className="px-4 py-3 text-center">
          <p className="text-xs text-gray-500">Click the power button to start live analysis</p>
        </div>
      )}

      {isActive && game.isGameOver() && (
        <div className="px-4 py-3 text-center">
          <p className="text-xs text-gray-400 font-semibold">Game Over</p>
        </div>
      )}
    </div>
  );
}
