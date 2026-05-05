"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { motion } from 'framer-motion';
import { Trash2, RotateCcw, Play, Check, X, ArrowRight, Brain, Sparkles, Power, FlipHorizontal } from 'lucide-react';
import { useChessStore } from '@/lib/chessStore';
import { Engine, EngineLine } from '@/lib/engine';

interface BoardEditorProps {
  onClose: () => void;
  onAnalyze: (fen: string) => void;
}

export default function BoardEditor({ onClose, onAnalyze }: BoardEditorProps) {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [isActive, setIsActive] = useState(false);
  const [lines, setLines] = useState<EngineLine[]>([]);
  const engineRef = useRef<Engine | null>(null);

  // Engine logic integrated
  const startEngine = useCallback((currentFen: string) => {
    if (engineRef.current) engineRef.current.destroy();
    const eng = new Engine();
    engineRef.current = eng;
    eng.waitUntilReady().then(() => {
      eng.setConfig({ multiPv: 1, depth: 18 });
      eng.onLines((engineLines) => {
        setLines([...engineLines]);
      });
      eng.evaluatePosition(currentFen, 99);
    });
  }, []);

  useEffect(() => {
    if (isActive) {
      startEngine(fen);
    } else {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current.destroy();
        engineRef.current = null;
      }
      setLines([]);
    }
  }, [fen, isActive, startEngine]);

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current.destroy();
      }
    };
  }, []);

  const [selectedSparePiece, setSelectedSparePiece] = useState<string | null>(null);

  const handlePieceDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    try {
      const game = new Chess(fen);
      
      if (sourceSquare !== 'spare') {
        game.remove(sourceSquare as any);
      }
      
      if (targetSquare !== 'off-board') {
        const type = piece[1].toLowerCase();
        const color = piece[0].toLowerCase() as 'w' | 'b';
        game.put({ type: type as any, color }, targetSquare as any);
      }
      
      setFen(game.fen());
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSquareClick = (square: string) => {
    if (selectedSparePiece) {
      const game = new Chess(fen);
      const color = selectedSparePiece[0].toLowerCase() as 'w' | 'b';
      const type = selectedSparePiece[1].toLowerCase() as any;
      game.put({ type, color }, square as any);
      setFen(game.fen());
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSparePiece(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const clearBoard = () => setFen('8/8/8/8/8/8/8/8 w - - 0 1');
  const resetBoard = () => setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  const pieces = {
    w: ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'],
    b: ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP']
  };

  const evalValue = lines[0] ? (fen.split(' ')[1] === 'w' ? lines[0].score : -lines[0].score) / 100 : 0;
  const bestMove = lines[0]?.pv.split(' ')[0] || null;

  const validateAndAnalyze = () => {
    try {
      const game = new Chess(fen);
      onAnalyze(game.fen());
    } catch (e) {
      alert("Invalid chess position!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-[#050505]/98 backdrop-blur-3xl flex flex-col items-center justify-center p-4 md:p-8"
    >
      <div 
        className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
        style={{ cursor: selectedSparePiece ? 'crosshair' : 'default' }}
      >
        
        {/* Board Section with Trays */}
        <div className="lg:col-span-8 flex items-center justify-center gap-4 md:gap-10">
          
          {/* Black Pieces Tray */}
          <div className="hidden md:flex flex-col gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl">
            <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest text-center mb-1">Black</div>
            {pieces.b.map((p) => (
              <button 
                key={p} 
                onClick={() => setSelectedSparePiece(selectedSparePiece === p ? null : p)}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all hover:scale-110 group relative ${
                  selectedSparePiece === p ? 'bg-blue-500/20 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {selectedSparePiece === p && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#050505] animate-pulse" />
                )}
                <img src={`https://react-chessboard.com/static/media/${p}.png`} alt={p} className="w-12 h-12 drop-shadow-2xl" />
              </button>
            ))}
          </div>

          {/* Main Board Area */}
          <div className="flex flex-col gap-8 items-center flex-1 max-w-[650px]">
            <div className="w-full aspect-square relative group">
              <div className="absolute -inset-16 bg-blue-600/10 blur-[140px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
              <div className="relative z-10">
                <Chessboard 
                  position={fen}
                  onPieceDrop={({ sourceSquare, targetSquare, piece }) => {
                    if (!targetSquare) return false;
                    return handlePieceDrop(sourceSquare, targetSquare, piece);
                  }}
                  onSquareClick={(square) => handleSquareClick(square)}
                  boardOrientation={orientation}
                  id="board-editor"
                  boardStyle={{
                    borderRadius: '16px',
                    boxShadow: '0 50px 140px rgba(0,0,0,0.9)',
                    border: '10px solid rgba(255,255,255,0.02)'
                  }}
                />
              </div>
              {selectedSparePiece && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-2xl z-20 animate-bounce">
                  Select square to place {selectedSparePiece[1] === 'K' ? 'King' : selectedSparePiece[1] === 'Q' ? 'Queen' : selectedSparePiece[1] === 'R' ? 'Rook' : selectedSparePiece[1] === 'B' ? 'Bishop' : selectedSparePiece[1] === 'N' ? 'Knight' : 'Pawn'}
                </div>
              )}
            </div>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setOrientation(prev => prev === 'white' ? 'black' : 'white')}
                className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <FlipHorizontal className="w-5 h-5" /> Flip Board
              </button>
              <button 
                onClick={() => {
                  const parts = fen.split(' ');
                  parts[1] = parts[1] === 'w' ? 'b' : 'w';
                  setFen(parts.join(' '));
                }}
                className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Turn: <span className="text-white ml-1 font-black">{fen.split(' ')[1] === 'w' ? 'WHITE' : 'BLACK'}</span>
              </button>
            </div>
          </div>

          {/* White Pieces Tray */}
          <div className="hidden md:flex flex-col gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl">
            <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest text-center mb-1">White</div>
            {pieces.w.map((p) => (
              <button 
                key={p} 
                onClick={() => setSelectedSparePiece(selectedSparePiece === p ? null : p)}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all hover:scale-110 group relative ${
                  selectedSparePiece === p ? 'bg-blue-500/20 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {selectedSparePiece === p && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#050505] animate-pulse" />
                )}
                <img src={`https://react-chessboard.com/static/media/${p}.png`} alt={p} className="w-12 h-12 drop-shadow-2xl" />
              </button>
            ))}
          </div>
        </div>

        {/* Info & Analysis Area */}
        <div className="lg:col-span-4 flex flex-col gap-8 w-full">
          <div className="space-y-4">
            <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Board Editor
            </h2>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-blue-500/40" />
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
                Tactical Setup Mode
              </p>
            </div>
          </div>

          {/* Engine Dashboard */}
          <div className="bg-gradient-to-br from-white/[0.06] to-transparent border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Brain className="w-48 h-48 text-blue-400" />
            </div>
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                    Stockfish 16 {isActive ? 'Running' : 'Standby'}
                  </span>
                </div>
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
                    isActive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">{isActive ? 'Stop' : 'Start Engine'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-3xl p-5 border border-white/5">
                  <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Evaluation</div>
                  <div className="text-3xl font-mono font-bold text-white">
                    {isActive ? (evalValue > 0 ? `+${evalValue.toFixed(1)}` : evalValue.toFixed(1)) : '0.0'}
                  </div>
                </div>
                <div className="bg-black/40 rounded-3xl p-5 border border-white/5">
                  <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Top Choice</div>
                  <div className="text-3xl font-bold text-white flex items-center gap-2">
                    {isActive && bestMove ? (
                      <>
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        {bestMove}
                      </>
                    ) : '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={clearBoard}
              className="flex items-center justify-center gap-3 bg-white/[0.03] hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 p-6 rounded-3xl transition-all group"
            >
              <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-400" />
              <span className="text-xs font-black uppercase text-gray-500 group-hover:text-white">Clear All</span>
            </button>
            <button 
              onClick={resetBoard}
              className="flex items-center justify-center gap-3 bg-white/[0.03] hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/20 p-6 rounded-3xl transition-all group"
            >
              <RotateCcw className="w-5 h-5 text-gray-600 group-hover:text-blue-400" />
              <span className="text-xs font-black uppercase text-gray-500 group-hover:text-white">Start Pos</span>
            </button>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 p-6 rounded-3xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button 
              onClick={validateAndAnalyze}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 p-6 rounded-3xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <ArrowRight className="w-5 h-5" /> Analyze Position
            </button>
          </div>
        </div>
      </div>

      <p className="mt-16 text-gray-700 text-[10px] uppercase font-black tracking-[0.6em] opacity-30">
        Drag pieces off board to remove • Use spare pieces to setup
      </p>
    </motion.div>
  );
}
