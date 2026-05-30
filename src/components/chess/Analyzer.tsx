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
import { Loader2, Save, ArrowUpDown } from "lucide-react";

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
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);
  const [analyzedPercent, setAnalyzedPercent] = useState(0);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  
  const engineRef = useRef<ChessEngine | null>(null);
  const moveListRef = useRef<HTMLDivElement>(null);

  
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

  // Initialize engine and optionally load PGN from query
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
    if (engineRef.current && !isAutoAnalyzing && !evaluations[currentIndex]) {
      engineRef.current.evaluatePositionAsync(currentFen, 14).then((evalData) => {
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
              currentIndex < 10,
              move.flags.includes('c') || move.flags.includes('e')
            );
            setClassifications(prev => ({ ...prev, [currentIndex]: cls as any }));
          }
        }
      });
    }
  }, [currentFen, currentIndex, history, isAutoAnalyzing, evaluations]);

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
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] w-full max-w-[1400px] mx-auto gap-4 px-4 py-4 pb-24 lg:pb-4 bg-background">
      
      {/* LEFT COL: Board Area */}
      <div className="flex flex-col items-center justify-center lg:w-[65%] min-w-0">
        
        <div className="w-full flex justify-end items-center mb-2 px-1">
          <div className="flex gap-2">
             <Button 
               variant="secondary" 
               size="sm" 
               onClick={handleSave}
               disabled={isSaving || history.length === 0}
               className="h-8 rounded bg-[#312e2b] hover:bg-[#3d3935] text-[#c3c3c2] font-semibold border-none gap-2"
             >
               {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
               Save
             </Button>
             <ImportModal onImport={handleImport}>
               <Button variant="secondary" size="sm" className="h-8 rounded bg-[#312e2b] hover:bg-[#3d3935] text-[#c3c3c2] font-semibold border-none gap-2">
                 <Upload className="w-3.5 h-3.5" /> Import Game
               </Button>
             </ImportModal>
          </div>
        </div>

        {/* Board & Eval Wrapper */}
        <div className="flex flex-col w-full max-w-[85vh] flex-1 bg-[#312e2b] rounded-md overflow-hidden relative shrink-0">
          
          {/* Top Header (Black Player) */}
          <div className="w-full bg-[#312e2b] px-4 py-3 flex items-center justify-between border-b border-[#262421]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#262421] flex items-center justify-center">
                <span className="text-[#8b8987] font-bold text-sm">?</span>
              </div>
              <h2 className="text-[15px] font-bold text-[#c3c3c2]">{(game.header().Black && game.header().Black !== '?') ? game.header().Black : 'Opponent'}</h2>
            </div>
            <div className="bg-[#262421] text-[#c3c3c2] font-mono text-[15px] font-bold px-3 py-1 rounded">5:00</div>
          </div>

          <div className="flex w-full flex-1 overflow-hidden">
            {/* Eval Bar */}
            <div className="w-5 bg-[#262421] flex flex-col relative shrink-0 overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-[#fff] transition-all duration-700 ease-out flex items-start justify-center pt-1"
                style={{ height: `${clampPercent}%` }}
              >
                {displayScore >= 0 && (
                  <span className="text-[9px] font-bold text-[#262421] select-none tracking-tighter">
                    {currentEvalData.mate ? `M${Math.abs(currentEvalData.mate)}` : `+${displayScore.toFixed(1)}`}
                  </span>
                )}
              </div>
              <div className="absolute top-0 left-0 right-0 h-12 flex items-end justify-center pb-1 z-10">
                {displayScore < 0 && (
                  <span className="text-[9px] font-bold text-[#fff] select-none tracking-tighter">
                    {currentEvalData.mate ? `-M${Math.abs(currentEvalData.mate)}` : displayScore.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Board */}
            <div className="flex-1 aspect-square relative bg-[#262421]">
              {/* @ts-ignore */}
              <Chessboard 
                position={currentFen}
                onPieceDrop={onDrop}
                customDarkSquareStyle={boardTheme.darkSquareStyle}
                customLightSquareStyle={boardTheme.lightSquareStyle}
                animationDuration={250}
                boardOrientation={boardOrientation}
              />
            </div>

            {/* Board Controls Bar */}
            <div className="w-12 bg-[#262421] flex flex-col items-center py-4 shrink-0 gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setBoardOrientation(prev => prev === 'white' ? 'black' : 'white')}
                className="w-10 h-10 rounded text-[#8b8987] hover:bg-[#312e2b] hover:text-[#c3c3c2]"
                title="Flip Board"
              >
                <ArrowUpDown className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Bottom Header (White Player) */}
          <div className="w-full bg-[#312e2b] px-4 py-3 flex items-center justify-between border-t border-[#262421]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#262421] flex items-center justify-center overflow-hidden">
                <img src="/chessium_logo.png" alt="You" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-[15px] font-bold text-[#c3c3c2]">{(game.header().White && game.header().White !== '?') ? game.header().White : 'akshath2008'}</h2>
            </div>
            <div className="bg-white/10 text-[#c3c3c2] font-mono text-[15px] font-bold px-3 py-1 rounded">5:00</div>
          </div>
        </div>
      </div>

      {/* RIGHT COL: Move List, Graph, Explanation */}
      <div className="flex-1 flex flex-col min-w-[320px] max-w-[500px] lg:max-w-none bg-[#262421] rounded-md overflow-hidden text-[#c3c3c2]">
        
        {isAutoAnalyzing && (
          <div className="p-3 bg-[#312e2b] border-b border-[#1e1c1a] flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px] font-bold text-[#81b64c] uppercase tracking-wider">
              <span>Running Game Review</span>
              <span>{analyzedPercent}%</span>
            </div>
            <div className="w-full h-1 bg-[#1e1c1a] rounded-full overflow-hidden">
              <div className="h-full bg-[#81b64c] transition-all duration-300" style={{ width: `${analyzedPercent}%` }}></div>
            </div>
          </div>
        )}
        {/* Tabs */}
        <div className="flex bg-[#1e1c1a] text-[13px] font-bold tracking-wider capitalize border-b border-[#312e2b]">
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-3 text-center transition-colors ${activeTab === 'review' ? 'bg-[#262421] text-[#fff]' : 'text-[#8b8987] hover:bg-[#312e2b] hover:text-[#c3c3c2]'}`}
          >
            Review
          </button>
          <button 
            onClick={() => setActiveTab('moves')}
            className={`flex-1 py-3 text-center transition-colors ${activeTab === 'moves' ? 'bg-[#262421] text-[#fff]' : 'text-[#8b8987] hover:bg-[#312e2b] hover:text-[#c3c3c2]'}`}
          >
            Moves
          </button>
        </div>

        {/* Header / Opening Info */}
        <div className="p-4 border-b border-[#312e2b] bg-[#262421]">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-[15px] font-bold tracking-tight text-[#fff]">{opening.name}</h3>
              <p className="text-[11px] font-mono text-[#8b8987] mt-1">{opening.eco}</p>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8b8987] bg-[#312e2b] px-2 py-1 rounded">
              Depth {currentEvalData.depth}
            </div>
          </div>
          <EvalGraph evaluations={evalArray} currentIndex={currentIndex} onPointClick={setCurrentIndex} />
        </div>

        {activeTab === 'review' ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Game Review Box */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#312e2b] rounded-lg p-5 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-[12px] font-bold uppercase tracking-widest text-[#8b8987] mb-3 z-10">White Accuracy</div>
                
                <div className="relative w-24 h-24 flex items-center justify-center z-10">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#262421]" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 - (264 * (parseFloat(reviewStats.whiteAccuracy) || 0)) / 100} className="text-[#fff] transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold tracking-tighter text-[#fff] leading-none">{reviewStats.whiteAccuracy}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#312e2b] rounded-lg p-5 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-[12px] font-bold uppercase tracking-widest text-[#8b8987] mb-3 z-10">Black Accuracy</div>
                
                <div className="relative w-24 h-24 flex items-center justify-center z-10">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#262421]" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 - (264 * (parseFloat(reviewStats.blackAccuracy) || 0)) / 100} className="text-[#fff] transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold tracking-tighter text-[#fff] leading-none">{reviewStats.blackAccuracy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification Table */}
            <div className="bg-[#312e2b] rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_2fr_1fr] bg-[#1e1c1a] p-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8b8987] text-center border-b border-[#312e2b]">
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
                { label: 'Miss', key: 'miss', cls: "Miss" },
                { label: 'Blunder', key: 'blunder', cls: "Blunder" },
              ].map(stat => {
                const wVal = classifications.filter(c => c.color === 'w' && c.classification === stat.cls).length;
                const bVal = classifications.filter(c => c.color === 'b' && c.classification === stat.cls).length;
                
                if (wVal === 0 && bVal === 0 && !['best', 'inaccuracy', 'mistake', 'blunder'].includes(stat.key)) return null;

                return (
                  <div key={stat.key} className="grid grid-cols-[1fr_2fr_1fr] border-t border-[#262421] p-2 text-[13px] text-center items-center">
                    <div className="font-bold text-[#fff]">{wVal}</div>
                    <div className="flex items-center justify-center gap-2 text-[#8b8987]">
                      <ClassificationIcon cls={stat.cls} />
                      <span className="hidden sm:inline">{stat.label}</span>
                    </div>
                    <div className="font-bold text-[#fff]">{bVal}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-2 font-mono text-[13px]">
              {history.map((_, i) => {
                if (i % 2 !== 0) return null;
                const wMove = history[i];
                const bMove = history[i + 1];
                const turnNum = Math.floor(i / 2) + 1;
                
                return (
                  <div key={turnNum} className={`grid grid-cols-[30px_1fr_1fr] px-2 py-1.5 rounded ${currentIndex >= i && currentIndex <= i + 1 ? 'bg-[#312e2b]' : 'hover:bg-[#312e2b]'}`}>
                    <div className="text-[#8b8987]">{turnNum}.</div>
                    <div className={`cursor-pointer flex items-center gap-1 ${currentIndex === i ? 'text-[#fff] font-black' : 'text-[#c3c3c2]'}`} onClick={() => setCurrentIndex(i)}>
                      {wMove.san}
                      {classifications[i] && <ClassificationIcon cls={classifications[i].classification} />}
                    </div>
                    {bMove && (
                      <div className={`cursor-pointer flex items-center gap-1 ${currentIndex === i + 1 ? 'text-[#fff] font-black' : 'text-[#c3c3c2]'}`} onClick={() => setCurrentIndex(i + 1)}>
                        {bMove.san}
                        {classifications[i + 1] && <ClassificationIcon cls={classifications[i + 1].classification} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="p-2 bg-[#1e1c1a] border-t border-[#312e2b] flex justify-center gap-1">
              <Button variant="ghost" size="icon" className="text-[#8b8987] hover:text-[#fff] h-10 w-12 rounded" onClick={() => setCurrentIndex(-1)}><ChevronFirst className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="text-[#8b8987] hover:text-[#fff] h-10 w-12 rounded" onClick={() => setCurrentIndex(prev => Math.max(-1, prev - 1))}><ChevronLeft className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="text-[#8b8987] hover:text-[#fff] h-10 w-12 rounded" onClick={() => setCurrentIndex(prev => Math.min(history.length - 1, prev + 1))}><ChevronRight className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="text-[#8b8987] hover:text-[#fff] h-10 w-12 rounded" onClick={() => setCurrentIndex(history.length - 1)}><ChevronLast className="w-5 h-5" /></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
