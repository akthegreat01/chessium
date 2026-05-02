"use client";

import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { loadGameHistory } from '@/lib/gameHistory';
import { useUserStore } from '@/lib/userStore';
import { X, CheckCircle, XCircle, ArrowRight, BrainCircuit, RefreshCw, Lightbulb, Flame, Trophy, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import confetti from 'canvas-confetti';

interface Puzzle {
  id: string;
  gameId: string;
  fenBefore: string;
  playerColor: 'w' | 'b';
  blunderMoveSan: string;
  bestMoveUci: string;
  bestMoveSan: string;
  classification: string;
}

export default function MistakeTrainer({ onClose }: { onClose: () => void }) {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<Chess>(new Chess());
  const [status, setStatus] = useState<'playing' | 'success' | 'failed'>('playing');
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);
  
  const { xp, level, streak, addXp, incrementStreak, resetStreak, recordPuzzleSolved } = useUserStore();
  const [xpGained, setXpGained] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = loadGameHistory();
    const extractedPuzzles: Puzzle[] = [];

    for (const gameData of history) {
      if (!gameData.analysisResult) continue;
      
      const tempChess = new Chess();
      tempChess.loadPgn(gameData.pgn);
      const moves = tempChess.history({ verbose: true });
      
      for (let i = 0; i < moves.length; i++) {
        // Skip opening phase mistakes (first 10 full moves / 20 plies)
        if (i < 20) continue;
        
        const move = moves[i];
        const fenBefore = move.before;
        const analysis = gameData.analysisResult.moveAnalyses[i];

        if (analysis && ['blunder', 'mistake'].includes(analysis.classification)) {
          const playerColor = i % 2 === 0 ? 'w' : 'b';
          extractedPuzzles.push({
            id: `${gameData.id}_${i}`,
            gameId: gameData.id || 'unknown',
            fenBefore,
            playerColor,
            blunderMoveSan: analysis.playedMove,
            bestMoveUci: analysis.bestMove,
            bestMoveSan: analysis.bestMoveSan,
            classification: analysis.classification,
          });
        }
      }
    }

    extractedPuzzles.sort(() => Math.random() - 0.5);
    setPuzzles(extractedPuzzles.slice(0, 20));
    setLoading(false);
  }, []);

  const currentPuzzle = puzzles[currentIndex];

  useEffect(() => {
    if (currentPuzzle) {
      setGameState(new Chess(currentPuzzle.fenBefore));
      setStatus('playing');
      setXpGained(0);
    }
  }, [currentPuzzle]);

  const fireConfetti = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x, y },
      colors: ['#3b82f6', '#6366f1', '#fbbf24']
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPieceDrop = (args: any) => {
    if (status !== 'playing' || !currentPuzzle) return false;
    const { sourceSquare, targetSquare, piece } = args;

    if (!targetSquare) return false;

    const gameCopy = new Chess(gameState.fen());
    const pieceType = piece?.pieceType || '';
    const isPromotion = (pieceType === 'P' || pieceType === 'p') &&
      (targetSquare[1] === '8' || targetSquare[1] === '1');
    
    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: isPromotion ? 'q' : undefined
      });

      if (!move) return false;

      const moveUci = move.from + move.to + (move.promotion || '');
      
      if (moveUci === currentPuzzle.bestMoveUci || move.san === currentPuzzle.bestMoveSan) {
        setGameState(gameCopy);
        setStatus('success');
        setShowHint(false);
        fireConfetti();
        
        // Calculate XP
        const base = 100;
        const streakBonus = streak * 10;
        const totalXp = base + streakBonus;
        setXpGained(totalXp);
        addXp(totalXp);
        incrementStreak();
        recordPuzzleSolved();
        
        return true;
      } else {
        setStatus('failed');
        resetStreak();
        setShake(true);
        setTimeout(() => setShake(false), 500);
        
        // Auto-retry after a delay
        setTimeout(() => {
          handleRetry();
        }, 1500);

        return false;
      }
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (currentIndex < puzzles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleRetry = () => {
    setGameState(new Chess(currentPuzzle.fenBefore));
    setStatus('playing');
    setShowHint(false);
  };

  // Level progress calculation
  const getLevelProgress = () => {
    const nextLevelXp = Math.pow((level) / 1, 1/0.7) * 100;
    const currentLevelXp = Math.pow((level - 1) / 1, 1/0.7) * 100;
    const progress = Math.max(0, Math.min(100, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));
    return progress || 0;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 rounded-full animate-pulse"></div>
            <BrainCircuit className="w-12 h-12 text-blue-400 relative z-10 animate-bounce" />
          </div>
          <p className="text-white font-bold text-xl tracking-wide">Building your personalized training...</p>
        </div>
      </div>
    );
  }

  if (puzzles.length === 0) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
        <div className="glass-panel p-8 max-w-md text-center flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-white">Perfect Record!</h2>
          <p className="text-gray-400 text-lg">
            No mistakes found in your recent analyzed games. Play more games to generate puzzles!
          </p>
          <button onClick={onClose} className="mt-6 w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-bold text-lg">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0b0e] flex flex-col overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Professional Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.05] bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <BrainCircuit className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Mistake Remediation</h2>
              <p className="text-[10px] text-gray-500 font-medium">PUZZLE {currentIndex + 1} OF {puzzles.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Stats Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-md border border-white/[0.05]">
              <div className="flex items-center gap-1.5 border-r border-white/10 pr-3 mr-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-500/70" />
                <span className="text-[11px] font-bold text-gray-300">Level {level}</span>
              </div>
              <div className="flex flex-col gap-1 w-20">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(xp % 1000) / 10}%` }}
                  />
                </div>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1 ml-2 pl-3 border-l border-white/10 text-orange-500/80">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[11px] font-bold">{streak}</span>
                </div>
              )}
            </div>

            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 p-4 md:p-8" ref={containerRef}>
        
        {/* Board Area */}
        <motion.div 
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={`w-full max-w-[550px] aspect-square rounded-xl overflow-hidden shadow-2xl relative transition-all duration-300 ${
            status === 'success' ? 'shadow-[0_0_50px_rgba(74,222,128,0.3)] ring-4 ring-green-500/50' : 
            status === 'failed' ? 'shadow-[0_0_50px_rgba(239,68,68,0.3)] ring-4 ring-red-500/50' : 
            'shadow-black ring-1 ring-white/10'
          }`}
        >
          <ReactChessboard 
            options={{
              position: gameState.fen(),
              onPieceDrop: onPieceDrop,
              boardOrientation: currentPuzzle.playerColor === 'w' ? 'white' : 'black',
              animationDurationInMs: 200,
              darkSquareStyle: { backgroundColor: '#739552' },
              lightSquareStyle: { backgroundColor: '#ebecd0' },
              squareStyles: showHint && currentPuzzle.bestMoveUci ? {
                [currentPuzzle.bestMoveUci.substring(0, 2)]: {
                  boxShadow: 'inset 0 0 1px 4px rgba(250, 204, 21, 1)',
                  backgroundColor: 'rgba(250, 204, 21, 0.4)',
                }
              } : {}
            }}
          />
        </motion.div>

        {/* Interaction Sidebar */}
        <div className="w-full max-w-sm flex flex-col gap-4 relative">
          
          <AnimatePresence mode="wait">
            {status === 'playing' && (
              <motion.div 
                key="playing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden border border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <BrainCircuit className="w-48 h-48" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase ${
                    currentPuzzle.classification === 'blunder' 
                      ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                      : 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                  }`}>
                    {currentPuzzle.classification} DETECTED
                  </span>
                </div>

                <h2 className="text-3xl font-black text-white leading-none">
                  Find the<br/>Best Move
                </h2>
                
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 mt-2">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    You played <strong className="text-white text-base bg-white/10 px-2 py-0.5 rounded">{currentPuzzle.blunderMoveSan}</strong> here.<br/>
                    Can you find the engine's top choice?
                  </p>
                </div>

                <button
                  onClick={() => setShowHint(true)}
                  disabled={showHint}
                  className="mt-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 hover:border-yellow-500/40 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lightbulb className="w-5 h-5" /> 
                  {showHint ? "Hint Active" : "Get a Hint"}
                </button>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center gap-4 bg-gradient-to-b from-green-900/40 to-transparent border border-green-500/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.15),transparent_70%)]"></div>
                
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.6)] relative z-10 mb-2">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-4xl font-black text-white tracking-tight relative z-10">BRILLIANT!</h2>
                
                <div className="bg-black/40 px-4 py-2 rounded-lg border border-green-500/20 flex items-center gap-3 relative z-10">
                  <span className="text-green-400 font-mono text-xl">{currentPuzzle.bestMoveSan}</span>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="flex items-center gap-1 text-yellow-400 font-black text-lg">
                    <Star className="w-5 h-5 fill-current" /> +{xpGained} XP
                  </div>
                </div>

                <button onClick={handleNext} className="mt-6 w-full py-4 bg-green-500 hover:bg-green-400 text-black font-black text-xl rounded-xl shadow-[0_6px_0_#166534] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 relative z-10">
                  Next Puzzle <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

            {status === 'failed' && (
              <motion.div 
                key="failed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center gap-4 bg-gradient-to-b from-red-900/40 to-transparent border border-red-500/30"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500 relative z-10 mb-2">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                
                <h2 className="text-2xl font-black text-white tracking-tight italic">INCORRECT</h2>
                <p className="text-red-400 text-sm font-medium">Resetting in 1.5s...</p>

                <button onClick={handleRetry} className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5">
                  <RefreshCw className="w-4 h-4" /> Try Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
    </div>
  );
}
