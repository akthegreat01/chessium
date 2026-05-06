"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { motion } from 'framer-motion';
import { Trash2, RotateCcw, Play, Check, X, ArrowRight, Brain, Sparkles, Power, FlipHorizontal, Copy, Share2 } from 'lucide-react';
import { useChessStore } from '@/lib/chessStore';
import { Engine, EngineLine } from '@/lib/engine';
import { playMoveSound, playCaptureSound, playWrongSound } from '@/lib/sounds';

interface BoardEditorProps {
  onClose: () => void;
  onAnalyze: (fen: string) => void;
}

export default function BoardEditor({ onClose, onAnalyze }: BoardEditorProps) {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [isActive, setIsActive] = useState(false);
  const [lines, setLines] = useState<EngineLine[]>([]);
  const [showCopied, setShowCopied] = useState(false);
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
      
      if (targetSquare !== 'off-board') {
        const type = piece[1].toLowerCase();
        const color = piece[0].toLowerCase() as 'w' | 'b';
        game.put({ type: type as any, color }, targetSquare as any);
        playMoveSound();
      } else {
        playWrongSound();
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
      playMoveSound();
      setFen(game.fen());
    }
  };

  const copyFen = () => {
    navigator.clipboard.writeText(fen);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
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
      className="min-h-screen bg-[#050505] flex flex-col items-center pt-24 pb-12 px-4 md:px-8 overflow-y-auto"
    >
      <div 
        className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        style={{ cursor: selectedSparePiece ? 'crosshair' : 'default' }}
      >
        
        {/* Board Section with Trays */}
        <div className="lg:col-span-8 flex items-center justify-center gap-4 md:gap-10">
          
          {/* Black Pieces Tray */}
          <div className="hidden md:flex flex-col gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-[9px] font-black uppercase text-gray-600 tracking-[0.2em] text-center mb-1 relative z-10">Black</div>
            {pieces.b.map((p) => (
              <button 
                key={p} 
                onClick={() => setSelectedSparePiece(selectedSparePiece === p ? null : p)}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all hover:scale-110 group/btn relative z-10 ${
                  selectedSparePiece === p ? 'bg-blue-500/20 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {selectedSparePiece === p && (
                  <motion.div layoutId="spare-glow-b" className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full" />
                )}
                <img src={`https://lichess1.org/assets/piece/cburnett/${p}.svg`} alt={p} className="w-12 h-12 drop-shadow-2xl group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            ))}
          </div>

          {/* Main Board Area */}
          <div className="flex flex-col gap-6 items-center flex-1 max-w-[650px]">
            <div className="w-full aspect-square relative group">
              <div className="absolute -inset-20 bg-blue-600/5 blur-[160px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none" />
              <div className="relative z-10">
                <Chessboard 
                  options={{
                    position: fen,
                    onPieceDrop: ({ sourceSquare, targetSquare, piece }) => {
                      if (!targetSquare) return false;
                      return handlePieceDrop(sourceSquare, targetSquare, piece.pieceType);
                    },
                    onSquareClick: ({ square }) => handleSquareClick(square),
                    boardOrientation: orientation,
                    id: "board-editor",
                    boardStyle: {
                      borderRadius: '12px',
                      boxShadow: '0 40px 120px rgba(0,0,0,0.85)',
                      border: '8px solid rgba(255,255,255,0.015)'
                    }
                  }}
                />
              </div>
              {selectedSparePiece && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0a0a0a] border border-blue-500/30 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-2xl z-20 flex items-center gap-3 backdrop-blur-xl"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Placing {selectedSparePiece[1] === 'K' ? 'King' : selectedSparePiece[1] === 'Q' ? 'Queen' : 'Piece'}
                </motion.div>
              )}
            </div>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setOrientation(prev => prev === 'white' ? 'black' : 'white')}
                className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all flex items-center justify-center gap-2.5"
              >
                <FlipHorizontal className="w-4 h-4" /> Flip Board
              </button>
              <button 
                onClick={() => {
                  const parts = fen.split(' ');
                  parts[1] = parts[1] === 'w' ? 'b' : 'w';
                  setFen(parts.join(' '));
                  playMoveSound();
                }}
                className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all flex items-center justify-center gap-2.5"
              >
                Turn: <span className="text-blue-400 font-black">{fen.split(' ')[1] === 'w' ? 'WHITE' : 'BLACK'}</span>
              </button>
            </div>
          </div>

          {/* White Pieces Tray */}
          <div className="hidden md:flex flex-col gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-[9px] font-black uppercase text-gray-600 tracking-[0.2em] text-center mb-1 relative z-10">White</div>
            {pieces.w.map((p) => (
              <button 
                key={p} 
                onClick={() => setSelectedSparePiece(selectedSparePiece === p ? null : p)}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all hover:scale-110 group/btn relative z-10 ${
                  selectedSparePiece === p ? 'bg-blue-500/20 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {selectedSparePiece === p && (
                  <motion.div layoutId="spare-glow-w" className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full" />
                )}
                <img src={`https://lichess1.org/assets/piece/cburnett/${p}.svg`} alt={p} className="w-12 h-12 drop-shadow-2xl group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            ))}
          </div>
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
          <div className="bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Brain className="w-40 h-40 text-blue-400" />
            </div>
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-green-400' : 'text-gray-600'}`}>
                      Stockfish 16 {isActive ? 'Live' : 'Ready'}
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest ml-4">NNUE Engine Build</span>
                </div>
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 group/power ${
                    isActive ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-600 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)]'
                  }`}
                >
                  <Power className={`w-3.5 h-3.5 ${isActive ? '' : 'group-hover/power:rotate-12 transition-transform'}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{isActive ? 'Stop' : 'Analyze'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                  <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Eval</div>
                  <div className={`text-2xl font-black tabular-nums ${evalValue > 0 ? 'text-white' : evalValue < 0 ? 'text-gray-300' : 'text-gray-500'}`}>
                    {isActive ? (evalValue > 0 ? `+${evalValue.toFixed(1)}` : evalValue.toFixed(1)) : '0.0'}
                  </div>
                </div>
                <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                  <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Stockfish Pick</div>
                  <div className="text-2xl font-black text-white flex items-center gap-2 uppercase italic tracking-tighter">
                    {isActive && bestMove ? (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        {bestMove}
                      </>
                    ) : '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button 
                onClick={clearBoard}
                className="flex-1 flex items-center justify-center gap-3 bg-white/[0.02] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 p-4 rounded-2xl transition-all group"
              >
                <Trash2 className="w-4 h-4 text-gray-700 group-hover:text-red-400" />
                <span className="text-[9px] font-black uppercase text-gray-600 group-hover:text-white tracking-widest">Clear</span>
              </button>
              <button 
                onClick={resetBoard}
                className="flex-1 flex items-center justify-center gap-3 bg-white/[0.02] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20 p-4 rounded-2xl transition-all group"
              >
                <RotateCcw className="w-4 h-4 text-gray-700 group-hover:text-blue-400" />
                <span className="text-[9px] font-black uppercase text-gray-600 group-hover:text-white tracking-widest">Reset</span>
              </button>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={copyFen}
                className="flex-1 flex items-center justify-center gap-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 p-4 rounded-2xl transition-all group relative overflow-hidden"
              >
                <motion.div animate={{ opacity: showCopied ? 1 : 0 }} className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Copied!</span>
                </motion.div>
                <Copy className="w-4 h-4 text-gray-700 group-hover:text-white" />
                <span className="text-[9px] font-black uppercase text-gray-600 group-hover:text-white tracking-widest">Copy FEN</span>
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 p-4 rounded-2xl transition-all group"
              >
                <Share2 className="w-4 h-4 text-gray-700 group-hover:text-white" />
                <span className="text-[9px] font-black uppercase text-gray-600 group-hover:text-white tracking-widest">Share</span>
              </button>
            </div>
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
