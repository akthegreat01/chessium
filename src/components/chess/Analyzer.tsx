"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Chess, Move } from "chess.js";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard), { ssr: false });
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
import { classifyMove, getClassificationColor, getClassificationExplanation, MoveClassification } from "@/lib/analyzer/classification";
import { detectOpening } from "@/lib/analyzer/openings";
import EvalGraph from "./EvalGraph";
import ImportModal from "./ImportModal";
import ClassificationIcon from "./ClassificationIcon";
import { saveAnalysis } from "@/app/actions/analysis";

import { useSearchParams } from "next/navigation";
import { useBoardTheme } from "./ThemeContext";
import { createClient } from "@/utils/supabase/client";
import { AdSenseBanner } from "@/components/ui/AdSenseBanner";

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
  const [playerName, setPlayerName] = useState("Player");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [engineEnabled, setEngineEnabled] = useState(true);
  
  const engineRef = useRef<ChessEngine | null>(null);
  const moveListRef = useRef<HTMLDivElement>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) {
        setPlayerName(data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || "Player");
      }
    });
  }, []);

  const runFullAnalysis = async (gameHistory: Move[]) => {
    if (!engineRef.current) return;
    setIsAutoAnalyzing(true);
    setAnalyzedPercent(0);
    
    const tempGame = new Chess();
    const initEval = await engineRef.current.evaluatePositionAsync(tempGame.fen(), 14);
    setEvaluations(prev => ({ ...prev, [-1]: initEval }));

    for (let i = 0; i < gameHistory.length; i++) {
      tempGame.move(gameHistory[i]);
      const res = await engineRef.current.evaluatePositionAsync(tempGame.fen(), 14);
      
      setEvaluations(prev => {
        const next = { ...prev, [i]: res };
        const prevEval = next[i - 1];
        if (prevEval) {
          const move = gameHistory[i];
          const cls = classifyMove(
            prevEval.score, 
            res.score, 
            move.color, 
            res.bestMove === move.lan, 
            i < 10,
            move.flags.includes('c') || move.flags.includes('e')
          );
          setClassifications(c => ({ ...c, [i]: cls as any }));
        }
        return next;
      });
      setAnalyzedPercent(Math.round(((i + 1) / gameHistory.length) * 100));
    }
    
    setIsAutoAnalyzing(false);
  };

  useEffect(() => {
    engineRef.current = new ChessEngine();
    
    const pgnQuery = searchParams.get('pgn');
    if (pgnQuery) {
      const newGame = new Chess();
      try {
        newGame.loadPgn(pgnQuery);
        const moves = newGame.history({ verbose: true });
        setHistory(moves as Move[]);
        setCurrentIndex(moves.length - 1);
        setGame(newGame);
        runFullAnalysis(moves as Move[]);
      } catch(e) {
        console.error("Invalid PGN from query:", e);
      }
    }

    return () => {
      engineRef.current?.terminate();
    };
  }, [searchParams]);

  const currentFen = useMemo(() => {
    const tempGame = new Chess();
    if (history.length > 0 && currentIndex >= 0) {
      for (let i = 0; i <= currentIndex; i++) {
        tempGame.move(history[i]);
      }
    }
    return tempGame.fen();
  }, [history, currentIndex]);

  useEffect(() => {
    if (engineRef.current && engineEnabled && !isAutoAnalyzing && !evaluations[currentIndex]) {
      engineRef.current.evaluatePositionAsync(currentFen, 14).then((evalData) => {
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
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const handleImport = (type: 'pgn' | 'fen', data: string) => {
    const newGame = new Chess();
    try {
      if (type === 'pgn') {
        try {
          newGame.loadPgn(data);
        } catch (e) {
          const rawMoves = data.replace(/\[.*?\]\s*/g, '').trim();
          newGame.loadPgn(rawMoves);
        }
        const moves = newGame.history({ verbose: true });
        setHistory(moves as Move[]);
        setCurrentIndex(moves.length - 1);
        runFullAnalysis(moves as Move[]);
      } else {
        newGame.load(data);
        setHistory([]);
        setCurrentIndex(-1);
      }
      setGame(newGame);
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
  const evalScore = currentEvalData.mate ? (currentEvalData.mate > 0 ? 100 : -100) : currentEvalData.score / 100;
  const isBlackTurn = new Chess(currentFen).turn() === 'b';
  const displayScore = isBlackTurn ? -evalScore : evalScore;
  const winPercent = 50 + (displayScore / 10) * 50;
  const clampPercent = Math.max(2, Math.min(98, winPercent));
  
  const pgnMoves = history.map(m => m.san);
  const opening = detectOpening(pgnMoves);
  const evalArray = history.map((_, i) => evaluations[i] ? evaluations[i].score : 0);

  const currentClassification = classifications[currentIndex];

  const reviewStats = useMemo(() => {
    let wAcc = 0, bAcc = 0;
    let wCount = 0, bCount = 0;
    const wClass = { brilliant: 0, excellent: 0, best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, book: 0 };
    const bClass = { brilliant: 0, excellent: 0, best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, book: 0 };

    Object.entries(classifications).forEach(([idxStr, cls]) => {
      const idx = parseInt(idxStr);
      const isWhite = idx % 2 === 0;
      const target = isWhite ? wClass : bClass;
      
      const clsName = typeof cls === 'string' ? cls : cls?.classification || cls;
      
      if (clsName === "Brilliant") target.brilliant++;
      else if (clsName === "Excellent" || clsName === "Great Move") target.excellent++;
      else if (clsName === "Best Move") target.best++;
      else if (clsName === "Good") target.good++;
      else if (clsName === "Inaccuracy") target.inaccuracy++;
      else if (clsName === "Mistake") target.mistake++;
      else if (clsName === "Blunder" || clsName === "Miss") target.blunder++;
      else if (clsName === "Book") target.book++;

      let score = 0;
      if (clsName === "Brilliant" || clsName === "Best Move" || clsName === "Book") score = 100;
      else if (clsName === "Excellent" || clsName === "Great Move") score = 90;
      else if (clsName === "Good") score = 75;
      else if (clsName === "Inaccuracy") score = 40;
      else if (clsName === "Mistake" || clsName === "Miss") score = 15;
      else if (clsName === "Blunder") score = 0;

      if (isWhite) { wAcc += score; wCount++; }
      else { bAcc += score; bCount++; }
    });

    return {
      whiteAccuracy: wCount > 0 ? (wAcc / wCount).toFixed(1) : '--',
      blackAccuracy: bCount > 0 ? (bAcc / bCount).toFixed(1) : '--',
      white: wClass,
      black: bClass
    };
  }, [classifications]);

  const formatEval = (evalData: EngineEvaluation) => {
    if (evalData.mate !== null) {
      return evalData.mate > 0 ? `M${evalData.mate}` : `-M${Math.abs(evalData.mate)}`;
    }
    const score = evalData.score / 100;
    return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
  };

  const classificationRows = [
    { label: 'Brilliant', key: 'brilliant', icon: '!!', color: '#1cb0f6' },
    { label: 'Great Find', key: 'excellent', icon: '!', color: '#5f8baf' },
    { label: 'Best Move', key: 'best', icon: '★', color: '#81b64c' },
    { label: 'Good', key: 'good', icon: '✓', color: '#96af8b' },
    { label: 'Book', key: 'book', icon: '📖', color: '#a88865' },
    { label: 'Inaccuracy', key: 'inaccuracy', icon: '?!', color: '#f0c15c' },
    { label: 'Mistake', key: 'mistake', icon: '?', color: '#f68a1e' },
    { label: 'Blunder', key: 'blunder', icon: '??', color: '#ca3431' },
  ];

  return (
    <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden bg-background">
      
      {/* ═══ COLUMN 1: Navigation Sidebar ═══ */}
      <div className="hidden xl:flex w-[260px] shrink-0 flex-col bg-surface border-r border-border">
        {/* Sidebar Header */}
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-[15px] font-bold text-foreground tracking-tight">Analysis Board</h2>
          <p className="text-[11px] text-secondary-foreground mt-0.5">Engine-powered game review</p>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 flex flex-col gap-2 border-b border-border">
          <ImportModal onImport={handleImport}>
            <Button variant="outline" size="sm" className="w-full justify-start h-9 rounded-lg bg-background border-border hover:bg-white/5 text-foreground font-medium gap-2.5 text-[13px]">
              <Upload className="w-3.5 h-3.5 text-primary" /> Import Game
            </Button>
          </ImportModal>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving || history.length === 0}
            className="w-full justify-start h-9 rounded-lg bg-background border-border hover:bg-white/5 text-foreground font-medium gap-2.5 text-[13px]"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-primary" />}
            Save Analysis
          </Button>
        </div>

        {/* Engine Info Card */}
        <div className="px-4 py-3 border-b border-border">
          <div className="bg-background rounded-xl p-3.5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">Stockfish</span>
              </div>
              <button 
                onClick={() => setEngineEnabled(!engineEnabled)}
                className={`w-8 h-[18px] rounded-full relative transition-colors ${engineEnabled ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-all ${engineEnabled ? 'left-[17px]' : 'left-[2px]'}`} />
              </button>
            </div>
            <div className="text-[28px] font-bold text-foreground tracking-tighter leading-none mb-1">
              {formatEval(currentEvalData)}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-secondary-foreground mt-2">
              <span>Depth {currentEvalData.depth}</span>
              {currentEvalData.bestMove && (
                <>
                  <span className="w-px h-3 bg-border" />
                  <span>Best: <span className="text-primary font-bold">{currentEvalData.bestMove}</span></span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Opening Info */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpen className="w-3 h-3 text-primary/60" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">Opening</span>
          </div>
          <p className="text-[13px] font-semibold text-foreground leading-snug">{opening.name}</p>
          <p className="text-[11px] font-mono text-secondary-foreground mt-0.5">{opening.eco}</p>
        </div>

        {/* Move Classification at current position */}
        {currentClassification && (
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3 h-3 text-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">Current Move</span>
            </div>
            <div className="flex items-center gap-2">
              <ClassificationIcon cls={typeof currentClassification === 'string' ? currentClassification : currentClassification?.classification} className="w-5 h-5 text-[9px]" />
              <span className="text-[13px] font-bold text-foreground">
                {typeof currentClassification === 'string' ? currentClassification : currentClassification?.classification}
              </span>
            </div>
            <p className="text-[11px] text-secondary-foreground mt-1.5 leading-relaxed">
              {getClassificationExplanation(typeof currentClassification === 'string' ? currentClassification : currentClassification?.classification)}
            </p>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Player Info */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden">
              <img src="/chessium_logo.png" alt="You" className="w-full h-full object-cover p-0.5 opacity-80" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-foreground">{playerName}</div>
              <div className="text-[10px] text-secondary-foreground">Analyzer</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ COLUMN 2: Board Area (dominant center) ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-0 bg-background relative p-3 lg:p-5">
        
        {/* Analysis progress bar */}
        {isAutoAnalyzing && (
          <div className="absolute top-0 left-0 right-0 z-20">
            <div className="h-0.5 bg-background">
              <div className="h-full bg-gradient-to-r from-primary via-primary to-primary/60 transition-all duration-300 ease-out" style={{ width: `${analyzedPercent}%` }} />
            </div>
            <div className="flex justify-between items-center px-5 py-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              <span>Analyzing game...</span>
              <span>{analyzedPercent}%</span>
            </div>
          </div>
        )}

        {/* Board + Eval Column */}
        <div className="flex items-center gap-0 w-full max-w-[min(calc(100vh-180px),700px)] mx-auto">
          
          {/* Eval Bar */}
          <div className="w-7 shrink-0 self-stretch relative bg-[#1a1a1f] rounded-l-xl overflow-hidden border border-r-0 border-border">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#e8e8e8] to-[#f5f5f5] transition-all duration-700 ease-out"
              style={{ height: `${clampPercent}%` }}
            />
            <div className="absolute inset-0 flex flex-col items-center z-10 pointer-events-none">
              {displayScore >= 0 ? (
                <span className="text-[9px] font-black text-foreground pt-1 tracking-tighter">
                  {currentEvalData.mate ? `M${Math.abs(currentEvalData.mate)}` : `+${displayScore.toFixed(1)}`}
                </span>
              ) : (
                <span className="text-[9px] font-black text-[#1a1a1f] mt-auto pb-1 tracking-tighter">
                  {currentEvalData.mate ? `-M${Math.abs(currentEvalData.mate)}` : displayScore.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          {/* Board Container */}
          <div className="flex-1 flex flex-col bg-surface border border-border rounded-r-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
            
            {/* Top player bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-background flex items-center justify-center">
                  <span className="text-secondary-foreground font-bold text-[10px]">♚</span>
                </div>
                <span className="text-[13px] font-bold text-foreground">
                  {(game.header().Black && game.header().Black !== '?') ? game.header().Black : 'Opponent'}
                </span>
              </div>
              {reviewStats.blackAccuracy !== '--' && (
                <span className="text-[10px] font-bold text-secondary-foreground bg-background px-2 py-0.5 rounded">
                  {reviewStats.blackAccuracy}%
                </span>
              )}
            </div>
            
            {/* Chessboard */}
            <div className="w-full aspect-square bg-background/50">
              {/* @ts-ignore */}
              <Chessboard 
                id="AnalyzerBoard"
                position={currentFen}
                onPieceDrop={onDrop}
                arePiecesDraggable={true}
                customDarkSquareStyle={boardTheme.darkSquareStyle}
                customLightSquareStyle={boardTheme.lightSquareStyle}
                animationDuration={250}
                boardOrientation={boardOrientation}
              />
            </div>

            {/* Bottom player bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-surface border-t border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-background flex items-center justify-center overflow-hidden">
                  <img src="/chessium_logo.png" alt="You" className="w-full h-full object-cover p-0.5 opacity-80" />
                </div>
                <span className="text-[13px] font-bold text-foreground">
                  {(game.header().White && game.header().White !== '?') ? game.header().White : playerName}
                </span>
              </div>
              {reviewStats.whiteAccuracy !== '--' && (
                <span className="text-[10px] font-bold text-secondary-foreground bg-background px-2 py-0.5 rounded">
                  {reviewStats.whiteAccuracy}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Board Controls */}
        <div className="flex items-center gap-1 mt-3 bg-surface border border-border rounded-xl px-2 py-1.5">
          <Button variant="ghost" size="icon" className="w-9 h-8 rounded-lg text-secondary-foreground hover:text-foreground hover:bg-white/5" onClick={() => { setCurrentIndex(-1); setIsAutoPlaying(false); }}>
            <ChevronFirst className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-8 rounded-lg text-secondary-foreground hover:text-foreground hover:bg-white/5" onClick={() => { setCurrentIndex(prev => Math.max(-1, prev - 1)); setIsAutoPlaying(false); }}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" size="icon" 
            className={`w-9 h-8 rounded-lg ${isAutoPlaying ? 'text-primary bg-primary/10' : 'text-secondary-foreground hover:text-foreground hover:bg-white/5'}`}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-8 rounded-lg text-secondary-foreground hover:text-foreground hover:bg-white/5" onClick={() => { setCurrentIndex(prev => Math.min(history.length - 1, prev + 1)); setIsAutoPlaying(false); }}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-8 rounded-lg text-secondary-foreground hover:text-foreground hover:bg-white/5" onClick={() => { setCurrentIndex(history.length - 1); setIsAutoPlaying(false); }}>
            <ChevronLast className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <Button variant="ghost" size="icon" className="w-9 h-8 rounded-lg text-secondary-foreground hover:text-foreground hover:bg-white/5" onClick={() => setBoardOrientation(prev => prev === 'white' ? 'black' : 'white')} title="Flip Board">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" size="icon" 
            className={`w-9 h-8 rounded-lg ${engineEnabled ? 'text-primary bg-primary/10' : 'text-secondary-foreground hover:text-foreground hover:bg-white/5'}`}
            onClick={() => setEngineEnabled(!engineEnabled)}
            title="Toggle Engine"
          >
            <Cpu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ═══ COLUMN 3: Analysis Panel ═══ */}
      <div className="hidden lg:flex w-[360px] shrink-0 flex-col bg-surface border-l border-border overflow-hidden">
        
        {/* Tabs */}
        <div className="flex bg-background text-[12px] font-bold tracking-wider uppercase">
          <button 
            onClick={() => setActiveTab('moves')}
            className={`flex-1 py-2.5 text-center transition-all border-b-2 ${activeTab === 'moves' ? 'border-primary text-primary' : 'border-transparent text-secondary-foreground hover:text-foreground'}`}
          >
            Moves
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-2.5 text-center transition-all border-b-2 ${activeTab === 'review' ? 'border-primary text-primary' : 'border-transparent text-secondary-foreground hover:text-foreground'}`}
          >
            Review
          </button>
        </div>

        {/* Eval Graph */}
        <div className="px-3 pt-3">
          <EvalGraph evaluations={evalArray} currentIndex={currentIndex} onPointClick={setCurrentIndex} />
        </div>

        {activeTab === 'moves' ? (
          <div ref={moveListRef} className="flex-1 overflow-y-auto px-3 py-2 font-mono text-[13px]">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-4">
                  <Upload className="w-5 h-5 text-primary/60" />
                </div>
                <p className="text-[14px] font-semibold text-foreground mb-1.5">No game loaded</p>
                <p className="text-[12px] text-secondary-foreground leading-relaxed">Import a PGN or play moves on the board to start analyzing.</p>
              </div>
            ) : (
              history.map((_, i) => {
                if (i % 2 !== 0) return null;
                const wMove = history[i];
                const bMove = history[i + 1];
                const turnNum = Math.floor(i / 2) + 1;
                
                return (
                  <div key={turnNum} className={`grid grid-cols-[28px_1fr_1fr] px-1.5 py-1 rounded-lg transition-colors ${currentIndex >= i && currentIndex <= i + 1 ? 'bg-primary/5 border border-primary/10' : 'hover:bg-white/[0.03]'}`}>
                    <div className="text-secondary-foreground/50 text-[12px] pt-0.5">{turnNum}.</div>
                    <div 
                      className={`cursor-pointer flex items-center gap-1.5 rounded px-1 py-0.5 transition-colors ${currentIndex === i ? 'text-foreground font-black bg-primary/10' : 'text-secondary-foreground hover:text-foreground'}`} 
                      onClick={() => setCurrentIndex(i)}
                    >
                      {wMove.san}
                      {classifications[i] && <ClassificationIcon cls={typeof classifications[i] === 'string' ? classifications[i] : classifications[i]?.classification} className="w-3.5 h-3.5 text-[7px]" />}
                    </div>
                    {bMove && (
                      <div 
                        className={`cursor-pointer flex items-center gap-1.5 rounded px-1 py-0.5 transition-colors ${currentIndex === i + 1 ? 'text-foreground font-black bg-primary/10' : 'text-secondary-foreground hover:text-foreground'}`} 
                        onClick={() => setCurrentIndex(i + 1)}
                      >
                        {bMove.san}
                        {classifications[i + 1] && <ClassificationIcon cls={typeof classifications[i + 1] === 'string' ? classifications[i + 1] : classifications[i + 1]?.classification} className="w-3.5 h-3.5 text-[7px]" />}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Accuracy Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background border border-border rounded-xl p-3.5 text-center relative overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-widest text-secondary-foreground mb-2">White</div>
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="264" strokeDashoffset={264 - (264 * (parseFloat(reviewStats.whiteAccuracy as string) || 0)) / 100} className="text-foreground transition-all duration-1000 ease-out" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black tracking-tighter text-foreground">{reviewStats.whiteAccuracy}</span>
                  </div>
                </div>
              </div>
              <div className="bg-background border border-border rounded-xl p-3.5 text-center relative overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-widest text-secondary-foreground mb-2">Black</div>
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="264" strokeDashoffset={264 - (264 * (parseFloat(reviewStats.blackAccuracy as string) || 0)) / 100} className="text-foreground transition-all duration-1000 ease-out" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black tracking-tighter text-foreground">{reviewStats.blackAccuracy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification Table */}
            <div className="bg-background border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_2fr_1fr] p-2 text-[9px] font-bold uppercase tracking-wider text-secondary-foreground text-center border-b border-border bg-surface">
                <div>White</div>
                <div>Classification</div>
                <div>Black</div>
              </div>
              {classificationRows.map(stat => {
                const wVal = reviewStats.white[stat.key as keyof typeof reviewStats.white] || 0;
                const bVal = reviewStats.black[stat.key as keyof typeof reviewStats.black] || 0;
                
                return (
                  <div key={stat.key} className="grid grid-cols-[1fr_2fr_1fr] border-t border-border/50 py-1.5 px-2 text-[12px] text-center items-center hover:bg-white/[0.02] transition-colors">
                    <div className="font-bold text-foreground">{wVal}</div>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
                      <span className="text-[11px] text-secondary-foreground">{stat.label}</span>
                    </div>
                    <div className="font-bold text-foreground">{bVal}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* XL: Import actions for mobile/tablet when sidebar hidden */}
        <div className="xl:hidden p-3 border-t border-border flex gap-2">
          <ImportModal onImport={handleImport}>
            <Button variant="outline" size="sm" className="flex-1 h-9 rounded-lg bg-background border-border hover:bg-white/5 text-foreground font-medium gap-2 text-[12px]">
              <Upload className="w-3.5 h-3.5 text-primary" /> Import
            </Button>
          </ImportModal>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving || history.length === 0}
            className="flex-1 h-9 rounded-lg bg-background border-border hover:bg-white/5 text-foreground font-medium gap-2 text-[12px]"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-primary" />}
            Save
          </Button>
        </div>
      </div>

      {/* ═══ COLUMN 4: Ad Rail ═══ */}
      <div className="hidden 2xl:flex w-[260px] shrink-0 flex-col bg-surface border-l border-border p-4 gap-4 overflow-y-auto">
        
        {/* Chessium Premium Card */}
        <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-primary">Premium</span>
          </div>
          <h3 className="text-[15px] font-bold text-foreground mb-1.5">Chessium Pro</h3>
          <p className="text-[11px] text-secondary-foreground leading-relaxed mb-4">Unlimited analysis, cloud saves, advanced engine settings, and more.</p>
          <Button size="sm" className="w-full h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-[12px] font-bold">
            Upgrade Now
          </Button>
        </div>

        {/* Sponsored Course Card */}
        <div className="bg-background border border-border rounded-2xl p-4 relative overflow-hidden group hover:border-border/80 transition-colors">
          <span className="text-[8px] font-bold text-secondary-foreground uppercase tracking-widest">Sponsored</span>
          <h4 className="text-[13px] font-bold text-foreground mt-2 mb-1 group-hover:text-primary transition-colors">Master the Endgame</h4>
          <p className="text-[11px] text-secondary-foreground leading-relaxed mb-3">Learn rook endgames from GM analysis. 12 chapters, 200+ puzzles.</p>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-primary">$29.99</span>
            <span className="text-[10px] text-secondary-foreground line-through">$49.99</span>
          </div>
        </div>

        {/* Tournament Promo */}
        <div className="bg-background border border-border rounded-2xl p-4 relative overflow-hidden group hover:border-border/80 transition-colors">
          <span className="text-[8px] font-bold text-secondary-foreground uppercase tracking-widest">Tournament</span>
          <h4 className="text-[13px] font-bold text-foreground mt-2 mb-1 group-hover:text-primary transition-colors">Chessium Weekly Arena</h4>
          <p className="text-[11px] text-secondary-foreground leading-relaxed mb-3">Compete against 500+ players. Win prizes and climb the leaderboard.</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded">Free Entry</span>
          </div>
        </div>

        {/* Chess Book */}
        <div className="bg-background border border-border rounded-2xl p-4 relative overflow-hidden group hover:border-border/80 transition-colors">
          <span className="text-[8px] font-bold text-secondary-foreground uppercase tracking-widest">Recommended</span>
          <h4 className="text-[13px] font-bold text-foreground mt-2 mb-1 group-hover:text-primary transition-colors">My System — Nimzowitsch</h4>
          <p className="text-[11px] text-secondary-foreground leading-relaxed mb-3">The foundational text on positional chess, strategy, and prophylaxis.</p>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-primary">$14.99</span>
          </div>
        </div>

        {/* AdSense */}
        <div className="mt-auto">
          <AdSenseBanner className="rounded-2xl min-h-[200px]" />
        </div>
      </div>
    </div>
  );
}
