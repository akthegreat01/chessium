// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Chess, Move } from "chess.js";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard as any), { ssr: false, loading: () => <div className="w-full aspect-square bg-white/5 animate-pulse rounded" /> });
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  ChevronFirst,
  ChevronLast,
  Play,
  Pause,
  ArrowUpDown,
  Save,
  Loader2,
  Cpu,
  Layers,
  BookOpen,
  Target,
  Zap,
  AlertTriangle,
  XCircle,
  Star,
  ThumbsUp,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import { ChessEngine, EngineEvaluation } from "@/lib/analyzer/engine";
import Image from "next/image";
import { classifyMove, getClassificationColor, getClassificationExplanation, MoveClassification, calculateWinProbability } from "@/lib/analyzer/classification";
import { detectOpening } from "@/lib/analyzer/openings";
import EvalGraph from "./EvalGraph";
import { calculateAccuracyFromLosses } from "@/lib/analyzer/accuracy";
import ImportModal from "./ImportModal";
import ClassificationIcon from "./ClassificationIcon";
import { saveAnalysis } from "@/app/actions/analysis";
import { AdUnit } from "@/components/ui/AdUnit";
import { useSearchParams } from "next/navigation";
import { useBoardTheme } from "./ThemeContext";
import { createClient } from "@/utils/supabase/client";
import { AdSenseBanner } from "@/components/ui/AdSenseBanner";
import { robustLoadPgn } from "@/lib/chess/pgnParser";
import confetti from "canvas-confetti";

export default function Analyzer() {
  const { boardTheme } = useBoardTheme();
  const searchParams = useSearchParams();
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState<Move[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [evaluations, setEvaluations] = useState<Record<number, EngineEvaluation>>({});
  const [classifications, setClassifications] = useState<Record<number, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'review' | 'moves'>('moves');
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);
  const [analyzedPercent, setAnalyzedPercent] = useState(0);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [boardKey, setBoardKey] = useState(0);
  const [playerName, setPlayerName] = useState("Player");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [engineEnabled, setEngineEnabled] = useState(true);
  
  const engineRef = useRef<ChessEngine | null>(null);
  const moveListRef = useRef<HTMLDivElement>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);
  const analysisRunIdRef = useRef<number>(0);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) {
        setPlayerName(data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || "Player");
      }
    });
  }, []);

  const runFullAnalysis = async (gameHistory: Move[]) => {
    if (!engineRef.current) return;
    
    analysisRunIdRef.current += 1;
    const currentRunId = analysisRunIdRef.current;
    
    setIsAutoAnalyzing(true);
    setAnalyzedPercent(0);
    
    const tempGame = new Chess();
    const initEval = await engineRef.current.evaluatePositionAsync(tempGame.fen(), 18);
    if (currentRunId !== analysisRunIdRef.current) return;
    
    setEvaluations(prev => ({ ...prev, [-1]: initEval }));

    for (let i = 0; i < gameHistory.length; i++) {
      if (currentRunId !== analysisRunIdRef.current) return;
      
      tempGame.move(gameHistory[i]);
      const res = await engineRef.current.evaluatePositionAsync(tempGame.fen(), 18);
      if (currentRunId !== analysisRunIdRef.current) return;
      
      setEvaluations(prev => {
        const next = { ...prev, [i]: res };
        const prevEval = next[i - 1];
        if (prevEval) {
          const move = gameHistory[i];
          const cls = classifyMove(
            prevEval.score, 
            res.score, 
            move.color, 
            prevEval.bestMove === move.lan, 
            i < 10,
            move.flags.includes('c') || move.flags.includes('e')
          );
          setClassifications(c => ({ ...c, [i]: cls as any }));
        }
        return next;
      });
      setAnalyzedPercent(Math.round(((i + 1) / gameHistory.length) * 100));
      setCurrentIndex(i); // Auto-advance the board to show progress visually
    }
    
    if (currentRunId === analysisRunIdRef.current) {
      setIsAutoAnalyzing(false);
      // Optional: reset to beginning or stay at end after analysis
    }
  };

  useEffect(() => {
    engineRef.current = new ChessEngine();
    
    const sessionType = typeof window !== 'undefined' ? sessionStorage.getItem('chessium_import_type') : null;
    const sessionData = typeof window !== 'undefined' ? sessionStorage.getItem('chessium_import_data') : null;

    let pgnQuery = searchParams.get('pgn');
    let fenQuery = searchParams.get('fen');

    if (sessionType && sessionData) {
      if (sessionType === 'pgn') pgnQuery = sessionData;
      if (sessionType === 'fen') fenQuery = sessionData;
      sessionStorage.removeItem('chessium_import_type');
      sessionStorage.removeItem('chessium_import_data');
    }

    if (pgnQuery) {
      try {
        const newGame = robustLoadPgn(pgnQuery);
        const moves = newGame.history({ verbose: true });
        setHistory(moves as Move[]);
        setCurrentIndex(-1);
        setGame(newGame);
        runFullAnalysis(moves as Move[]);
        setBoardKey(prev => prev + 1);
      } catch(e) {
        console.error("Invalid PGN from query/session:", e);
      }
    } else if (fenQuery) {
      const newGame = new Chess();
      try {
        newGame.load(fenQuery);
        setGame(newGame);
        setBoardKey(prev => prev + 1);
      } catch (e) {
        console.error("Invalid FEN:", e);
      }
    }

    return () => {
      engineRef.current?.terminate();
    };
  }, [searchParams]);

  const currentFen = useMemo(() => {
    if (history.length === 0) {
      // If it's just a FEN import with no moves, use the game's current FEN
      return game ? game.fen() : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    
    // Get the exact starting position of this specific game
    const startingFen = history[0].before || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    if (currentIndex === -1) {
      return startingFen;
    }
    
    // Replay moves from the starting position to guarantee absolute FEN validity
    const tempGame = new Chess(startingFen);
    for (let i = 0; i <= currentIndex; i++) {
      try {
        tempGame.move(history[i].san || history[i]);
      } catch (e) {
        // Fallback to exactly what chess.js computed if move fails
        return history[currentIndex]?.after || startingFen;
      }
    }
    const finalFen = tempGame.fen();
    console.log("Analyzer.tsx currentFen calculation:", { currentIndex, startingFen, finalFen });
    return finalFen;
  }, [history, currentIndex, game]);

  useEffect(() => {
    if (engineRef.current && engineEnabled && !isAutoAnalyzing && !evaluations[currentIndex]) {
      engineRef.current.evaluatePositionAsync(currentFen, 18).then((evalData) => {
        setEvaluations(prev => ({ ...prev, [currentIndex]: evalData }));
        
        if (currentIndex > 0) {
          const prevEval = evaluations[currentIndex - 1];
          if (prevEval) {
            const move = history[currentIndex];
            const cls = classifyMove(
              prevEval.score, 
              evalData.score, 
              move.color, 
              evalData.bestMove === move.lan, 
              currentIndex < 10,
              move.flags.includes('c') || move.flags.includes('e')
            );
            setClassifications(prev => ({ ...prev, [currentIndex]: cls as any }));
          }
        }
      });
    }
  }, [currentFen, currentIndex, history, isAutoAnalyzing, evaluations, engineEnabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex(prev => Math.max(-1, prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex(prev => Math.min(history.length - 1, prev + 1));
      } else if (e.key === "Home") {
        setCurrentIndex(-1);
      } else if (e.key === "End") {
        setCurrentIndex(history.length - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history.length]);

  useEffect(() => {
    if (moveListRef.current) {
      const activeEl = moveListRef.current.querySelector('.active-move');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentIndex]);

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying && currentIndex < history.length - 1) {
      autoPlayTimer.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1000);
    } else if (isAutoPlaying && currentIndex >= history.length - 1) {
      setIsAutoPlaying(false);
    }
    return () => {
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    };
  }, [isAutoPlaying, currentIndex, history.length]);

  // Confetti effect for brilliant/great moves
  useEffect(() => {
    if (currentIndex >= 0 && classifications[currentIndex]) {
      const cls = classifications[currentIndex];
      const clsName = typeof cls === 'string' ? cls : cls.classification;
      if (clsName === 'Brilliant' || clsName === 'Great Move') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: clsName === 'Brilliant' ? ['#1cb0f6', '#ffffff'] : ['#5f8baf', '#ffffff'],
          zIndex: 100
        });
      }
    }
  }, [currentIndex, classifications]);

  const [moveFrom, setMoveFrom] = useState<string | null>(null);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const tempGame = new Chess(currentFen);
    try {
      const moveResult = tempGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (moveResult) {
        const newHistory = [...history.slice(0, currentIndex + 1), moveResult];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setGame(tempGame);
        setMoveFrom(null);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const onSquareClick = (square: string) => {
    if (moveFrom === null) {
      // Select piece
      const tempGame = new Chess(currentFen);
      const piece = tempGame.get(square as any);
      if (piece && piece.color === tempGame.turn()) {
        setMoveFrom(square);
      }
      return;
    }

    // Try to move
    const tempGame = new Chess(currentFen);
    try {
      const moveResult = tempGame.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });
      if (moveResult) {
        const newHistory = [...history.slice(0, currentIndex + 1), moveResult];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setGame(tempGame);
        setMoveFrom(null);
        return;
      }
    } catch (e) {
      // Invalid move - check if clicking another own piece
    }
    
    // If invalid move, check if they're selecting a different piece
    const g = new Chess(currentFen);
    const piece = g.get(square as any);
    if (piece && piece.color === g.turn()) {
      setMoveFrom(square);
    } else {
      setMoveFrom(null);
    }
  };

  const handleImport = (type: 'pgn' | 'fen', data: string) => {
    try {
      if (type === 'pgn') {
        const newGame = robustLoadPgn(data);
        const moves = newGame.history({ verbose: true });
        setHistory(moves as Move[]);
        setCurrentIndex(-1);
        setGame(newGame);
        runFullAnalysis(moves as Move[]);
        setBoardKey(prev => prev + 1);
      } else {
        const newGame = new Chess();
        newGame.load(data);
        setGame(newGame);
        setHistory([]);
        setCurrentIndex(-1);
        setBoardKey(prev => prev + 1);
      }
      setEvaluations({});
      setClassifications({});
    } catch (e) {
      console.error("Invalid Import", e);
      alert("Failed to parse the imported game. Please ensure the PGN or FEN is valid.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const pgn = game.pgn();
    const w = game.header().White || 'White Player';
    const b = game.header().Black || 'Black Player';
    
    const result = await saveAnalysis({
      pgn,
      white_player: w,
      black_player: b,
      opening_name: opening.name,
      accuracy_w: 0, 
      accuracy_b: 0,
      result: game.header().Result || '*'
    });

    if (result?.error) {
      alert("Please create an account to save your analysis to the cloud.");
    } else {
      alert("Analysis saved to cloud successfully!");
    }
    setIsSaving(false);
  };

  const currentEvalData = evaluations[currentIndex] || { score: 0, mate: null, depth: 0, bestMove: "", pv: "" };
  const displayScore = currentEvalData.score;
  const clampPercent = calculateWinProbability(displayScore);
  const isBlackTurn = new Chess(currentFen).turn() === 'b';
  const scoreLabelColor = isBlackTurn ? 'text-black' : 'text-white';
  const scoreBgColor = isBlackTurn ? 'bg-white' : 'bg-[#2b2b2b]';

  // Calculate overlay position for move icon
  const getSquareOverlayStyle = (square: string, orientation: 'white' | 'black') => {
    if (!square || square.length !== 2) return null;
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const fileIndex = files.indexOf(square[0]);
    const rankIndex = parseInt(square[1]) - 1;
    
    if (fileIndex === -1 || isNaN(rankIndex)) return null;

    const x = orientation === 'white' ? fileIndex : 7 - fileIndex;
    const y = orientation === 'white' ? 7 - rankIndex : rankIndex;

    return {
      left: `${(x * 100) / 8}%`,
      top: `${(y * 100) / 8}%`,
      width: '12.5%',
      height: '12.5%',
    };
  };

  const pgnMoves = history.map(m => m.san);
  const opening = detectOpening(pgnMoves);
  const evalArray = useMemo(() => [
    evaluations[-1]?.score || 0,
    ...history.map((_, i) => evaluations[i] ? evaluations[i].score : 0)
  ], [evaluations, history]);

  const currentClassification = classifications[currentIndex];

  const reviewStats = useMemo(() => {
    let wAcc = 0, bAcc = 0;
    let wCount = 0, bCount = 0;
    const wClass = { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, book: 0 };
    const bClass = { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, book: 0 };

    const whiteWPDrops: number[] = [];
    const blackWPDrops: number[] = [];

    Object.entries(classifications).forEach(([idxStr, cls]) => {
      const idx = parseInt(idxStr);
      const isWhite = idx % 2 === 0;
      const target = isWhite ? wClass : bClass;
      
      const clsName = typeof cls === 'string' ? cls : cls?.classification || cls;
      
      if (clsName === "Brilliant") target.brilliant++;
      else if (clsName === "Great Move") target.great++;
      else if (clsName === "Best Move") target.best++;
      else if (clsName === "Excellent") target.excellent++;
      else if (clsName === "Good") target.good++;
      else if (clsName === "Inaccuracy") target.inaccuracy++;
      else if (clsName === "Mistake") target.mistake++;
      else if (clsName === "Blunder" || clsName === "Miss") target.blunder++;
      else if (clsName === "Book") target.book++;

      // Compute Win Probability (WP) loss for true accuracy formula
      const evalBefore = evaluations[idx - 1]?.score || 0;
      const evalAfter = evaluations[idx]?.score || 0;
      
      const wpBefore = calculateWinProbability(evalBefore);
      const wpAfter = calculateWinProbability(evalAfter);
      
      // Calculate the drop in Win Probability for the player who moved
      const wpDrop = isWhite ? (wpBefore - wpAfter) : (wpAfter - wpBefore);
      
      if (isWhite) whiteWPDrops.push(Math.max(0, wpDrop));
      else blackWPDrops.push(Math.max(0, wpDrop));
    });

    const accuracies = calculateAccuracyFromLosses(whiteWPDrops, blackWPDrops);

    return {
      whiteAccuracy: whiteWPDrops.length > 0 ? accuracies.w.toFixed(1) : '--',
      blackAccuracy: blackWPDrops.length > 0 ? accuracies.b.toFixed(1) : '--',
      white: wClass,
      black: bClass
    };
  }, [classifications, evaluations]);

  const formatEval = (evalData: EngineEvaluation) => {
    if (evalData.mate !== null) {
      return evalData.mate > 0 ? `M${evalData.mate}` : `-M${Math.abs(evalData.mate)}`;
    }
    const score = evalData.score / 100;
    return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
  };

  const classificationRows = [
    { label: 'Brilliant', key: 'brilliant', icon: '!!', color: '#1cb0f6' },
    { label: 'Great Find', key: 'great', icon: '!', color: '#5f8baf' },
    { label: 'Best Move', key: 'best', icon: '★', color: '#81b64c' },
    { label: 'Excellent', key: 'excellent', icon: '👍', color: '#96bc4b' },
    { label: 'Good', key: 'good', icon: '✓', color: '#96af8b' },
    { label: 'Book', key: 'book', icon: '📖', color: '#a88865' },
    { label: 'Inaccuracy', key: 'inaccuracy', icon: '?!', color: '#f0c15c' },
    { label: 'Mistake', key: 'mistake', icon: '?', color: '#f68a1e' },
    { label: 'Blunder', key: 'blunder', icon: '??', color: '#ca3431' },
  ];


  return (
    <div className="flex flex-col lg:flex-row w-full min-h-full lg:h-full lg:overflow-hidden bg-background relative pb-8 lg:pb-0">
      
      {/* Abstract Background Glow for Analyzer */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] blur-[150px] rounded-full pointer-events-none -z-10 transition-colors duration-1000" 
        style={{
          backgroundColor: currentEvalData?.mate ? (currentEvalData.mate > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)') :
                           currentEvalData?.score > 150 ? 'rgba(34, 197, 94, 0.15)' : 
                           currentEvalData?.score < -150 ? 'rgba(239, 68, 68, 0.15)' : 
                           'rgba(255, 255, 255, 0.03)'
        }}
      />

      {/* ═══ COLUMN 1: Navigation Sidebar ═══ */}
      <div className="hidden xl:flex w-[240px] shrink-0 flex-col bg-white/[0.01]  border-r border-white/5 shadow-2xl relative z-10">
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-[16px] font-extrabold text-white tracking-wide relative z-10">Analysis Board</h2>
          <p className="text-[12px] text-secondary-foreground/70 mt-1 font-medium relative z-10">Engine-powered game review</p>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 flex flex-col gap-3 border-b border-white/5">
          <ImportModal onImport={handleImport}>
            <Button variant="outline" size="sm" className="w-full justify-start h-10 rounded-xl bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white font-semibold gap-3 text-[13px] hover:-translate-y-0.5 transition-all shadow-sm">
              <Upload className="w-4 h-4 text-primary" /> Import Game
            </Button>
          </ImportModal>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving || history.length === 0}
            className="w-full justify-start h-10 rounded-xl bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white font-semibold gap-3 text-[13px] hover:-translate-y-0.5 transition-all shadow-sm disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Save className="w-4 h-4 text-primary" />}
            Save Analysis
          </Button>
        </div>

        {/* Engine Info Card */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/10 shadow-inner group hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <Cpu className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-white/90">Stockfish</span>
              </div>
              <button 
                onClick={() => setEngineEnabled(!engineEnabled)}
                className={`w-8 h-[18px] rounded-full relative transition-colors ${engineEnabled ? 'bg-primary' : 'bg-white/10'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-all ${engineEnabled ? 'left-[17px]' : 'left-[2px]'}`} />
              </button>
            </div>
            <div className="text-[32px] font-extrabold text-white tracking-tighter leading-none mb-2">
              {formatEval(currentEvalData)}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-secondary-foreground/60 font-semibold uppercase tracking-wider mt-3">
              <span>Depth {currentEvalData.depth}</span>
              {currentEvalData.bestMove && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>Best: <span className="text-primary font-bold">{currentEvalData.bestMove}</span></span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Opening Info */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary/60" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground/70">Opening</span>
          </div>
          <p className="text-[14px] font-bold text-white leading-snug">{opening.name}</p>
          <p className="text-[12px] font-mono font-medium text-secondary-foreground/50 mt-1">{opening.eco}</p>
        </div>

        {/* Move Classification at current position */}
        {currentClassification && (
          <div className="px-5 py-4 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary/60" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground/70">Current Move</span>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5 shadow-sm">
              <ClassificationIcon cls={typeof currentClassification === 'string' ? currentClassification : currentClassification?.classification} className="w-6 h-6 text-[10px]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-extrabold text-white">
                  {typeof currentClassification === 'string' ? currentClassification : currentClassification?.classification}
                </span>
                <span className="text-[11px] text-secondary-foreground/70 font-medium">
                  {getClassificationExplanation(typeof currentClassification === 'string' ? currentClassification : currentClassification?.classification)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Spacer / Ad Rail */}
        <div className="flex-1 px-5 py-4 min-h-[120px] flex items-end">
          <AdUnit className="w-full min-h-[100px] rounded-2xl" />
        </div>

        {/* Player Info */}
        <div className="px-5 py-4 border-t border-white/5 bg-white/[0.02] ">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
              <Image src="/chessium_logo.png" alt="You" width={28} height={28} className="w-full h-full object-cover p-1 opacity-90" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">{playerName}</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground/50">Analyzer Pro</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ COLUMN 2: Board Area (dominant center) ═══ */}
      <div className="w-full lg:flex-1 flex flex-col items-center justify-center lg:min-w-0 bg-transparent relative p-4 lg:p-6 z-10 lg:h-full">

        {/* Board + Eval Column */}
        <div className="flex items-stretch gap-0 w-full max-w-[min(calc(100vh-180px),800px)] mx-auto relative group">
          
          {/* Subtle board glow */}
          <div className="absolute inset-0 bg-primary/5 blur-[50px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Eval Bar */}
          <div className="w-8 shrink-0 relative bg-black/40  rounded-l-2xl overflow-hidden border border-r-0 border-white/10 z-10">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-white/70 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              style={{ height: `${clampPercent}%` }}
            />
            <div className="absolute inset-0 flex flex-col items-center z-10 pointer-events-none">
              {displayScore >= 0 ? (
                <span className="text-[10px] font-black text-black pt-2 tracking-tighter drop-shadow-md">
                  {currentEvalData.mate ? `M${Math.abs(currentEvalData.mate)}` : `+${displayScore.toFixed(1)}`}
                </span>
              ) : (
                <span className="text-[10px] font-black text-white mt-auto pb-2 tracking-tighter drop-shadow-md">
                  {currentEvalData.mate ? `-M${Math.abs(currentEvalData.mate)}` : displayScore.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          {/* Board Container */}
          <div className="flex-1 flex flex-col bg-white/[0.02]  border border-white/10 rounded-r-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-10">
            
            {/* Top player bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-white/5 ">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                  <span className="text-white/80 font-bold text-[12px]">♚</span>
                </div>
                <span className="text-[14px] font-bold text-white tracking-wide">
                  {(game.header().Black && game.header().Black !== '?') ? game.header().Black : 'Opponent'}
                </span>
              </div>
              {reviewStats.blackAccuracy !== '--' && (
                <span className="text-[12px] font-bold text-white bg-white/10 px-3 py-1 rounded-full shadow-inner border border-white/5">
                  {reviewStats.blackAccuracy}%
                </span>
              )}
            </div>
            
            {/* Chessboard */}
            <div className="w-full aspect-square bg-black/40 relative">
              {/* @ts-ignore */}
              <Chessboard 
                key={boardTheme.name}
                id="AnalyzerBoard"
                position={currentFen}
                onPieceDrop={onDrop}
                onSquareClick={onSquareClick}
                arePiecesDraggable={true}
                customDarkSquareStyle={boardTheme.darkSquareStyle}
                customLightSquareStyle={boardTheme.lightSquareStyle}
                boardOrientation={boardOrientation}
                customSquareStyles={{
                  ...(moveFrom ? { [moveFrom]: { background: 'rgba(255, 255, 255, 0.2)' } } : {}),
                  ...(currentIndex >= 0 && history[currentIndex] ? {
                    [history[currentIndex].from]: { background: 'rgba(255, 255, 0, 0.3)' },
                    [history[currentIndex].to]: { background: 'rgba(255, 255, 0, 0.3)' }
                  } : {})
                }}
              />
              
              {/* Classification Icon Overlay */}
              {currentIndex >= 0 && history[currentIndex] && classifications[currentIndex] && (
                (() => {
                  const style = getSquareOverlayStyle(history[currentIndex].to, boardOrientation);
                  if (!style) return null;
                  return (
                    <div 
                      className="absolute pointer-events-none flex items-start justify-end z-10"
                      style={style}
                    >
                      <div className="w-[30%] h-[30%] min-w-[20px] min-h-[20px] translate-x-1/4 -translate-y-1/4 rounded-full flex items-center justify-center bg-background shadow-[0_2px_10px_rgba(0,0,0,0.5)] border-2 border-background">
                         <ClassificationIcon classification={classifications[currentIndex].type} className="w-full h-full" />
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Circular Analyzing Overlay */}
              {isAutoAnalyzing && (
                <div className="absolute inset-0 bg-black/40  z-20 flex items-center justify-center transition-opacity duration-500">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      {/* Background circle */}
                      <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                      {/* Animated progress circle */}
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        fill="none" 
                        className="text-primary transition-all duration-300 ease-out"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * analyzedPercent) / 100}
                        strokeLinecap="round"
                        style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.8))" }}
                      />
                    </svg>
                    <span className="absolute text-xl font-black text-white drop-shadow-md tabular-nums tracking-tighter">
                      {analyzedPercent}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom player bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-t border-white/5 ">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                  <Image src="/chessium_logo.png" alt="You" width={28} height={28} className="w-full h-full object-cover p-0.5 opacity-90" />
                </div>
                <span className="text-[14px] font-bold text-white tracking-wide">
                  {(game.header().White && game.header().White !== '?') ? game.header().White : playerName}
                </span>
              </div>
              {reviewStats.whiteAccuracy !== '--' && (
                <span className="text-[12px] font-bold text-white bg-white/10 px-3 py-1 rounded-full shadow-inner border border-white/5">
                  {reviewStats.whiteAccuracy}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Board Controls */}
        <div className="flex items-center gap-1.5 mt-5 bg-white/[0.03]  border border-white/10 rounded-full px-3 py-2 shadow-xl relative z-10">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-secondary-foreground hover:text-white hover:bg-white/10 transition-colors" onClick={() => { setCurrentIndex(-1); setIsAutoPlaying(false); }}>
            <ChevronFirst className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-secondary-foreground hover:text-white hover:bg-white/10 transition-colors" onClick={() => { setCurrentIndex(prev => Math.max(-1, prev - 1)); setIsAutoPlaying(false); }}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" size="icon" 
            className={`w-12 h-10 rounded-full transition-all ${isAutoPlaying ? 'text-white bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'text-white bg-white/10 hover:bg-white/20'}`}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-secondary-foreground hover:text-white hover:bg-white/10 transition-colors" onClick={() => { setCurrentIndex(prev => Math.min(history.length - 1, prev + 1)); setIsAutoPlaying(false); }}>
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-secondary-foreground hover:text-white hover:bg-white/10 transition-colors" onClick={() => { setCurrentIndex(history.length - 1); setIsAutoPlaying(false); }}>
            <ChevronLast className="w-5 h-5" />
          </Button>
          
          <div className="w-px h-6 bg-white/10 mx-2" />
          
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-secondary-foreground hover:text-white hover:bg-white/10 transition-colors" onClick={() => setBoardOrientation(prev => prev === 'white' ? 'black' : 'white')} title="Flip Board">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" size="icon" 
            className={`w-10 h-10 rounded-full transition-colors ${engineEnabled ? 'text-primary bg-primary/10' : 'text-secondary-foreground hover:text-white hover:bg-white/10'}`}
            onClick={() => setEngineEnabled(!engineEnabled)}
            title="Toggle Engine"
          >
            <Cpu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ═══ COLUMN 3: Analysis Panel ═══ */}
      <div className="flex w-full lg:w-[360px] shrink-0 flex-col bg-white/[0.01]  border-t lg:border-t-0 lg:border-l border-white/5 lg:overflow-hidden shadow-2xl relative z-10 lg:h-full min-h-[500px]">
        
        {/* Tabs */}
        <div className="flex bg-black/20 text-[12px] font-bold tracking-wider uppercase ">
          <button 
            onClick={() => setActiveTab('moves')}
            className={`flex-1 py-3 text-center transition-all border-b-2 ${activeTab === 'moves' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-secondary-foreground/60 hover:text-white hover:bg-white/5'}`}
          >
            Moves
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-3 text-center transition-all border-b-2 ${activeTab === 'review' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-secondary-foreground/60 hover:text-white hover:bg-white/5'}`}
          >
            Review
          </button>
        </div>

        {/* Eval Graph */}
        <div className="px-4 pt-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden p-1">
            <EvalGraph evaluations={evalArray} currentIndex={currentIndex + 1} onPointClick={(idx) => setCurrentIndex(idx - 1)} />
          </div>
        </div>

        {activeTab === 'moves' ? (
          <div ref={moveListRef} className="flex-1 overflow-y-auto px-4 py-4 font-mono text-[13px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 shadow-inner">
                  <Upload className="w-6 h-6 text-primary/60" />
                </div>
                <p className="text-[15px] font-bold text-white mb-2 tracking-wide">No game loaded</p>
                <p className="text-[13px] text-secondary-foreground/70 leading-relaxed">Import a PGN or play moves on the board to start analyzing.</p>
              </div>
            ) : (
              history.map((_, i) => {
                if (i % 2 !== 0) return null;
                const wMove = history[i];
                const bMove = history[i + 1];
                const turnNum = Math.floor(i / 2) + 1;
                
                return (
                  <div key={turnNum} className={`grid grid-cols-[36px_1fr_1fr] px-2 py-1.5 rounded-xl transition-all ${currentIndex >= i && currentIndex <= i + 1 ? 'bg-primary/10 border border-primary/20 shadow-sm' : 'hover:bg-white/[0.03]'}`}>
                    <div className="text-secondary-foreground/40 text-[12px] pt-1 font-semibold">{turnNum}.</div>
                    <div 
                      className={`cursor-pointer flex items-center gap-2 rounded-lg px-2 py-1 transition-all ${currentIndex === i ? 'text-white font-black bg-primary border border-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.3)]' : 'text-secondary-foreground/80 hover:text-white hover:bg-white/5'}`} 
                      onClick={() => setCurrentIndex(i)}
                    >
                      {wMove.san}
                      {classifications[i] && <ClassificationIcon cls={typeof classifications[i] === 'string' ? classifications[i] : classifications[i]?.classification} className="w-4 h-4 text-[8px]" />}
                    </div>
                    {bMove && (
                      <div 
                        className={`cursor-pointer flex items-center gap-2 rounded-lg px-2 py-1 transition-all ${currentIndex === i + 1 ? 'text-white font-black bg-primary border border-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.3)]' : 'text-secondary-foreground/80 hover:text-white hover:bg-white/5'}`} 
                        onClick={() => setCurrentIndex(i + 1)}
                      >
                        {bMove.san}
                        {classifications[i + 1] && <ClassificationIcon cls={typeof classifications[i + 1] === 'string' ? classifications[i + 1] : classifications[i + 1]?.classification} className="w-4 h-4 text-[8px]" />}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {/* Accuracy Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[30px]" />
                <div className="text-[11px] font-bold uppercase tracking-widest text-secondary-foreground/70 mb-3 relative z-10">White</div>
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="264" strokeDashoffset={264 - (264 * (parseFloat(reviewStats.whiteAccuracy as string) || 0)) / 100} className="text-white transition-all duration-1000 ease-out" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black tracking-tighter text-white">{reviewStats.whiteAccuracy}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[30px]" />
                <div className="text-[11px] font-bold uppercase tracking-widest text-secondary-foreground/70 mb-3 relative z-10">Black</div>
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="264" strokeDashoffset={264 - (264 * (parseFloat(reviewStats.blackAccuracy as string) || 0)) / 100} className="text-white transition-all duration-1000 ease-out" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black tracking-tighter text-white">{reviewStats.blackAccuracy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification Table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_2fr_1fr] p-3 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground/70 text-center border-b border-white/5 bg-black/20">
                <div>White</div>
                <div>Classification</div>
                <div>Black</div>
              </div>
              {classificationRows.map(stat => {
                const wVal = reviewStats.white[stat.key as keyof typeof reviewStats.white] || 0;
                const bVal = reviewStats.black[stat.key as keyof typeof reviewStats.black] || 0;
                
                return (
                  <div key={stat.key} className="grid grid-cols-[1fr_2fr_1fr] border-t border-white/5 py-2 px-3 text-[13px] text-center items-center hover:bg-white/[0.04] transition-colors">
                    <div className="font-bold text-white">{wVal}</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: stat.color }} />
                      <span className="text-[12px] font-medium text-white/80">{stat.label}</span>
                    </div>
                    <div className="font-bold text-white">{bVal}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Import actions for mobile/tablet when sidebar hidden */}
        <div className="xl:hidden p-4 border-t border-white/5 flex gap-3 bg-white/[0.01]">
          <ImportModal onImport={handleImport}>
            <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white font-bold gap-2 text-[13px]">
              <Upload className="w-4 h-4 text-primary" /> Import
            </Button>
          </ImportModal>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving || history.length === 0}
            className="flex-1 h-10 rounded-xl bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white font-bold gap-2 text-[13px] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Save className="w-4 h-4 text-primary" />}
            Save
          </Button>
        </div>
      </div>

      {/* ═══ COLUMN 4: Ad Rail ═══ */}
      <div className="hidden 2xl:flex w-[280px] shrink-0 flex-col bg-white/[0.01]  border-l border-white/5 p-5 gap-5 overflow-y-auto scrollbar-none z-10 relative">
        
        {/* Ad Unit Replacing Premium Card */}
        <div className="w-full bg-white/[0.01] border border-white/5 p-4 rounded-[24px]">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Sponsored Content</span>
          </div>
          <AdUnit className="w-full min-h-[250px] rounded-2xl" />
        </div>

        {/* Sponsored Course Card */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 relative overflow-hidden group hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer">
          <span className="text-[9px] font-bold text-secondary-foreground/60 uppercase tracking-widest">Sponsored</span>
          <h4 className="text-[15px] font-bold text-white mt-2 mb-1.5 group-hover:text-primary transition-colors">Master the Endgame</h4>
          <p className="text-[12px] text-white/60 leading-relaxed mb-4">Learn rook endgames from GM analysis. 12 chapters, 200+ puzzles.</p>
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-black text-primary">$29.99</span>
            <span className="text-[11px] font-bold text-white/30 line-through">$49.99</span>
          </div>
        </div>

        {/* Tournament Promo */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 relative overflow-hidden group hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer">
          <span className="text-[9px] font-bold text-secondary-foreground/60 uppercase tracking-widest">Tournament</span>
          <h4 className="text-[15px] font-bold text-white mt-2 mb-1.5 group-hover:text-primary transition-colors">Chessium Weekly</h4>
          <p className="text-[12px] text-white/60 leading-relaxed mb-4">Compete against 500+ players. Win prizes and climb the leaderboard.</p>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Free Entry</span>
          </div>
        </div>

        {/* AdSense */}
        <div className="mt-auto pt-5">
          <AdUnit className="w-full min-h-[300px] rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}
