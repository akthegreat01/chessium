"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FastForward, Rewind, Upload } from "lucide-react";
import { ChessEngine, EngineEvaluation } from "@/lib/analyzer/engine";
import { classifyMove, getClassificationColor, getClassificationExplanation } from "@/lib/analyzer/classification";
import { detectOpening } from "@/lib/analyzer/openings";
import EvalGraph from "./EvalGraph";
import ImportModal from "./ImportModal";
import ClassificationIcon from "./ClassificationIcon";
import { saveAnalysis } from "@/app/actions/analysis";
import { Loader2, Save } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useBoardTheme } from "./ThemeContext";

// Helper to chunk move history into pairs
const chunkMoves = (moves: Move[]) => {
  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1]]);
  }
  return pairs;
};

export default function Analyzer() {
  const { boardTheme } = useBoardTheme();
  const searchParams = useSearchParams();
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState<Move[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [evaluations, setEvaluations] = useState<Record<number, EngineEvaluation>>({});
  const [classifications, setClassifications] = useState<Record<number, MoveClassification>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'review' | 'moves'>('review');
  
  const engineRef = useRef<ChessEngine | null>(null);
  const moveListRef = useRef<HTMLDivElement>(null);

  // Initialize engine and optionally load PGN from query
  useEffect(() => {
    engineRef.current = new ChessEngine();
    
    const pgnQuery = searchParams.get('pgn');
    if (pgnQuery) {
      const newGame = new Chess();
      try {
        newGame.loadPgn(decodeURIComponent(pgnQuery));
        const moves = newGame.history({ verbose: true });
        setHistory(moves as Move[]);
        setCurrentIndex(moves.length - 1);
        setGame(newGame);
      } catch(e) {
        console.error("Invalid PGN from query");
      }
    }

    return () => {
      engineRef.current?.terminate();
    };
  }, [searchParams]);

  // Sync game state to current index
  const currentFen = useMemo(() => {
    const tempGame = new Chess();
    if (history.length > 0 && currentIndex >= 0) {
      for (let i = 0; i <= currentIndex; i++) {
        tempGame.move(history[i]);
      }
    }
    return tempGame.fen();
  }, [history, currentIndex]);

  // Evaluate position when index changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.evaluatePosition(currentFen, 18, (evalData) => {
        setEvaluations(prev => ({ ...prev, [currentIndex]: evalData }));
        
        // Try to classify if we have the previous eval
        if (currentIndex > 0) {
          const prevEval = evaluations[currentIndex - 1];
          if (prevEval) {
            const move = history[currentIndex];
            const cls = classifyMove(
              prevEval.score, 
              evalData.score, 
              move.color, 
              evalData.bestMove === move.lan, 
              currentIndex < 10, // crude book check
              move.flags.includes('c') || move.flags.includes('e') // capture
            );
            setClassifications(prev => ({ ...prev, [currentIndex]: cls as any }));
          }
        }
      });
    }
  }, [currentFen, currentIndex, history]);

  // Keyboard Navigation
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

  // Scroll to active move
  useEffect(() => {
    if (moveListRef.current) {
      const activeEl = moveListRef.current.querySelector('.active-move');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentIndex]);

  const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    // If not at the end of history, truncate history
    const tempGame = new Chess(currentFen);
    try {
      const move = tempGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1] ? piece[1].toLowerCase() : "q",
      });
      if (move) {
        const newHistory = [...history.slice(0, currentIndex + 1), move];
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
        newGame.loadPgn(data);
        const moves = newGame.history({ verbose: true });
        setHistory(moves as Move[]);
        setCurrentIndex(moves.length - 1);
      } else {
        newGame.load(data);
        setHistory([]);
        setCurrentIndex(-1);
      }
      setGame(newGame);
      setEvaluations({});
      setClassifications({});
    } catch (e) {
      console.error("Invalid Import");
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
      accuracy_w: 0, // Placeholder: implement full accuracy calculation later
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

  // UI Derived State
  const currentEvalData = evaluations[currentIndex] || { score: 0, mate: null, depth: 0 };
  const evalScore = currentEvalData.mate ? (currentEvalData.mate > 0 ? 100 : -100) : currentEvalData.score / 100;
  const isBlackTurn = new Chess(currentFen).turn() === 'b';
  const displayScore = isBlackTurn ? -evalScore : evalScore;
  const winPercent = 50 + (displayScore / 10) * 50;
  const clampPercent = Math.max(2, Math.min(98, winPercent));
  
  const pgnMoves = history.map(m => m.san);
  const opening = detectOpening(pgnMoves);
  const movePairs = chunkMoves(history);
  const evalArray = history.map((_, i) => evaluations[i] ? evaluations[i].score : 0);

  const activeMove = currentIndex >= 0 ? history[currentIndex] : null;
  const activeClass = currentIndex >= 0 ? classifications[currentIndex] : null;

  // Compute Game Review Stats
  const reviewStats = useMemo(() => {
    let wAcc = 0, bAcc = 0;
    let wCount = 0, bCount = 0;
    const wClass = { brilliant: 0, excellent: 0, best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, book: 0 };
    const bClass = { brilliant: 0, excellent: 0, best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, book: 0 };

    Object.entries(classifications).forEach(([idxStr, cls]) => {
      const idx = parseInt(idxStr);
      const isWhite = idx % 2 === 0;
      const target = isWhite ? wClass : bClass;
      
      if (cls === "Brilliant") target.brilliant++;
      else if (cls === "Excellent" || cls === "Great Move") target.excellent++;
      else if (cls === "Best Move") target.best++;
      else if (cls === "Good") target.good++;
      else if (cls === "Inaccuracy") target.inaccuracy++;
      else if (cls === "Mistake") target.mistake++;
      else if (cls === "Blunder" || cls === "Miss") target.blunder++;
      else if (cls === "Book") target.book++;

      let score = 0;
      if (cls === "Brilliant" || cls === "Best Move" || cls === "Book") score = 100;
      else if (cls === "Excellent" || cls === "Great Move") score = 90;
      else if (cls === "Good") score = 75;
      else if (cls === "Inaccuracy") score = 40;
      else if (cls === "Mistake" || cls === "Miss") score = 15;
      else if (cls === "Blunder") score = 0;

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

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] w-full max-w-[1500px] mx-auto gap-8 px-4 lg:px-6 py-4 lg:py-6 pb-24 lg:pb-6">
      
      {/* LEFT COL: Eval Bar & Board */}
      <div className="flex flex-col items-center justify-center lg:w-[65%] min-w-0">
        
        {/* Top Header */}
        <div className="w-full flex justify-between items-end mb-4 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{game.header().Black || 'Black Player'}</h2>
          </div>
          <div className="flex gap-2">
             <Button 
               variant="outline" 
               size="sm" 
               onClick={handleSave}
               disabled={isSaving || history.length === 0}
               className="rounded-full border-white/10 bg-surface gap-2 hover:bg-white/5 transition-colors"
             >
               {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               Save
             </Button>
             <ImportModal onImport={handleImport}>
               <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-surface gap-2">
                 <Upload className="w-4 h-4" /> Import PGN
               </Button>
             </ImportModal>
          </div>
        </div>

        {/* Board & Eval Wrapper */}
        <div className="flex w-full max-w-[70vh] bg-background rounded-[16px] overflow-hidden shadow-2xl shadow-black/20 border border-white/10 relative shrink-0">
          
          {/* Eval Bar */}
          <div className="w-6 md:w-8 bg-[#1e293b] flex flex-col relative shrink-0 overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-[#e2e8f0] transition-all duration-700 ease-out flex items-start justify-center pt-2"
              style={{ height: `${clampPercent}%` }}
            >
              {displayScore >= 0 && (
                <span className="text-[9px] md:text-[11px] font-bold text-[#1e293b] select-none tracking-tighter">
                  {currentEvalData.mate ? `M${Math.abs(currentEvalData.mate)}` : `+${displayScore.toFixed(1)}`}
                </span>
              )}
            </div>
            <div className="absolute top-0 left-0 right-0 h-12 flex items-end justify-center pb-2 z-10">
              {displayScore < 0 && (
                <span className="text-[11px] font-bold text-[#e2e8f0] select-none tracking-tighter">
                  {currentEvalData.mate ? `-M${Math.abs(currentEvalData.mate)}` : displayScore.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          {/* Board */}
          <div className="flex-1 aspect-square relative">
            {/* @ts-ignore */}
            <Chessboard 
              position={currentFen}
              onPieceDrop={onDrop}
              customDarkSquareStyle={boardTheme.darkSquareStyle}
              customLightSquareStyle={boardTheme.lightSquareStyle}
              animationDuration={250}
            />
          </div>
        </div>

        {/* Bottom Header */}
        <div className="w-full flex justify-between items-start mt-4 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{game.header().White || 'White Player'}</h2>
          </div>
        </div>
      </div>

      {/* RIGHT COL: Move List, Graph, Explanation */}
      <div className="flex-1 flex flex-col min-w-[320px] max-w-[500px] lg:max-w-none bg-surface border border-white/5 rounded-[24px] overflow-hidden shadow-xl shadow-black/10">
        
        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-background/50 text-[13px] font-bold tracking-wider uppercase">
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-4 text-center transition-colors ${activeTab === 'review' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-secondary-foreground hover:text-foreground'}`}
          >
            Review
          </button>
          <button 
            onClick={() => setActiveTab('moves')}
            className={`flex-1 py-4 text-center transition-colors ${activeTab === 'moves' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-secondary-foreground hover:text-foreground'}`}
          >
            Moves
          </button>
        </div>

        {/* Header / Opening Info */}
        <div className="p-5 border-b border-white/5 bg-background/50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">{opening.name}</h3>
              <p className="text-xs font-mono text-secondary-foreground mt-1 px-2 py-0.5 bg-white/5 rounded w-fit">{opening.eco}</p>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
              Depth {currentEvalData.depth}
            </div>
          </div>
          <EvalGraph evaluations={evalArray} currentIndex={currentIndex} onPointClick={setCurrentIndex} />
        </div>

        {activeTab === 'review' ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Game Review Box */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background border border-white/5 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                <div className="text-sm font-medium text-secondary-foreground mb-1">White Accuracy</div>
                <div className="text-4xl font-bold tracking-tighter text-foreground">{reviewStats.whiteAccuracy}<span className="text-2xl text-secondary-foreground/50">%</span></div>
              </div>
              <div className="bg-background border border-white/5 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                <div className="text-sm font-medium text-secondary-foreground mb-1">Black Accuracy</div>
                <div className="text-4xl font-bold tracking-tighter text-foreground">{reviewStats.blackAccuracy}<span className="text-2xl text-secondary-foreground/50">%</span></div>
              </div>
            </div>

            {/* Classification Table */}
            <div className="bg-background border border-white/5 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_2fr_1fr] bg-white/5 p-3 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground text-center">
                <div>White</div>
                <div>Move Type</div>
                <div>Black</div>
              </div>
              
              {[
                { label: 'Brilliant', key: 'brilliant', cls: "Brilliant" },
                { label: 'Great Find', key: 'excellent', cls: "Excellent" },
                { label: 'Best Move', key: 'best', cls: "Best Move" },
                { label: 'Good', key: 'good', cls: "Good" },
                { label: 'Book', key: 'book', cls: "Book" },
                { label: 'Inaccuracy', key: 'inaccuracy', cls: "Inaccuracy" },
                { label: 'Mistake', key: 'mistake', cls: "Mistake" },
                { label: 'Blunder', key: 'blunder', cls: "Blunder" },
              ].map((row) => {
                // @ts-ignore
                const wVal = reviewStats.white[row.key];
                // @ts-ignore
                const bVal = reviewStats.black[row.key];
                if (wVal === 0 && bVal === 0 && row.key !== 'best' && row.key !== 'blunder') return null;

                return (
                  <div key={row.key} className="grid grid-cols-[1fr_2fr_1fr] p-3 text-sm font-medium border-t border-white/5 text-center items-center">
                    <div className="text-foreground">{wVal}</div>
                    <div className="flex items-center justify-center gap-2 text-secondary-foreground">
                      <ClassificationIcon classification={row.cls} className="w-4 h-4" /> <span className="hidden sm:inline">{row.label}</span>
                    </div>
                    <div className="text-foreground">{bVal}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
          {/* Move List */}
          <div className="flex-1 overflow-y-auto p-2" ref={moveListRef}>
            <div className="grid grid-cols-[auto_1fr_1fr] w-full text-[15px] font-medium">
            {movePairs.map((pair, rowIdx) => (
              <div key={rowIdx} className="contents group">
                <div className="py-2.5 px-4 text-secondary-foreground/50 font-mono text-sm border-b border-white/5 flex items-center">
                  {rowIdx + 1}
                </div>
                {/* White Move */}
                <div 
                  onClick={() => setCurrentIndex(rowIdx * 2)}
                  className={`py-2.5 px-3 border-b border-white/5 cursor-pointer flex items-center justify-between transition-colors ${
                    currentIndex === rowIdx * 2 ? 'bg-primary/20 text-foreground active-move rounded-l-md' : 'hover:bg-white/5 text-secondary-foreground'
                  }`}
                >
                  {pair[0].san}
                  {classifications[rowIdx * 2] && (
                     <ClassificationIcon classification={classifications[rowIdx * 2]} className="w-5 h-5 text-[10px]" />
                  )}
                </div>
                {/* Black Move */}
                <div 
                  onClick={() => pair[1] && setCurrentIndex(rowIdx * 2 + 1)}
                  className={`py-2.5 px-3 border-b border-white/5 cursor-pointer flex items-center justify-between transition-colors ${
                    currentIndex === rowIdx * 2 + 1 ? 'bg-primary/20 text-foreground active-move rounded-r-md' : 'hover:bg-white/5 text-secondary-foreground bg-black/10'
                  }`}
                >
                  {pair[1] ? pair[1].san : ""}
                  {pair[1] && classifications[rowIdx * 2 + 1] && (
                     <ClassificationIcon classification={classifications[rowIdx * 2 + 1]} className="w-5 h-5 text-[10px]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation Panel */}
        {activeMove && activeClass && (
          <div className="p-5 bg-background border-t border-white/5 min-h-[140px]">
            <div className="flex items-center gap-3 mb-2">
              <ClassificationIcon classification={activeClass} className="w-6 h-6 text-xs" />
              <div className="font-mono font-bold text-foreground">{activeMove.san}</div>
            </div>
            <p className="text-secondary-foreground text-sm font-medium leading-relaxed">
              {getClassificationExplanation(activeClass)}
            </p>
          </div>
        )}
        </>
        )}

        {/* Controls */}
        <div className="p-3 bg-surface border-t border-white/5 flex justify-center gap-2">
          <Button onClick={() => setCurrentIndex(-1)} variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/10"><Rewind className="w-5 h-5" /></Button>
          <Button onClick={() => setCurrentIndex(p => Math.max(-1, p - 1))} variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/10"><ChevronLeft className="w-6 h-6" /></Button>
          <Button onClick={() => setCurrentIndex(p => Math.min(history.length - 1, p + 1))} variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/10"><ChevronRight className="w-6 h-6" /></Button>
          <Button onClick={() => setCurrentIndex(history.length - 1)} variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/10"><FastForward className="w-5 h-5" /></Button>
        </div>

      </div>
    </div>
  );
}
