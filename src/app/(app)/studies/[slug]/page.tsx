"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Button } from "@/components/ui/button";
import { AdUnit } from "@/components/ui/AdUnit";
import { ChevronRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { studiesData, Study } from "@/lib/data/studies";
import { useBoardTheme } from "@/components/chess/ThemeContext";

export default function StudyViewerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { boardTheme } = useBoardTheme();

  const [study, setStudy] = useState<Study | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return; // Wait for params to be ready
    const found = studiesData.find(s => s.slug === slug);
    if (found) {
      if (found.isLocked) {
        // Locked study, redirect back
        router.push("/studies");
        return;
      }
      setStudy(found);
      if (found.steps.length > 0) {
        const newGame = new Chess(found.steps[0].fen);
        setGame(newGame);
        setFen(newGame.fen());
      }
    } else {
      router.push("/studies");
    }
  }, [slug, router]);

  useEffect(() => {
    if (study && study.steps[currentStepIndex]) {
      const newGame = new Chess(study.steps[currentStepIndex].fen);
      setGame(newGame);
      setFen(newGame.fen());
      setIsSuccess(false);
      setErrorMsg(null);
    }
  }, [currentStepIndex, study]);

  if (!study || study.steps.length === 0) {
    return <div className="p-8 text-white">Loading Study...</div>;
  }

  const currentStep = study.steps[currentStepIndex];

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (isSuccess) return false;
    
    try {
      // Validate move
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) return false;

      // Check if it matches expected move
      if (currentStep.expectedMove && move.san === currentStep.expectedMove) {
        setFen(game.fen());
        setIsSuccess(true);
        setErrorMsg(null);
        setMoveFrom(null);
        return true;
      } else {
        game.undo();
        setErrorMsg("That's not the right move. Try again!");
        setMoveFrom(null);
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  const [moveFrom, setMoveFrom] = useState<string | null>(null);

  const onSquareClick = (square: string) => {
    if (isSuccess) return;

    if (!moveFrom) {
      // First click: select piece
      const piece = game.get(square as any);
      if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b')) {
        setMoveFrom(square);
      }
      return;
    }

    // Second click: attempt move
    const success = onDrop(moveFrom, square);
    if (!success) {
      // If it wasn't a valid move, check if they clicked another of their own pieces
      const piece = game.get(square as any);
      if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b')) {
        setMoveFrom(square);
      } else {
        setMoveFrom(null);
      }
    }
  };

  const nextStep = () => {
    if (currentStepIndex < study.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setMoveFrom(null);
    } else {
      router.push("/studies");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] lg:overflow-hidden bg-background">
      
      {/* ═══ COLUMN 1: Reader (Left) ═══ */}
      <div className="w-full lg:w-[450px] shrink-0 flex flex-col bg-surface/30 border-r border-white/5 overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
          <button 
            onClick={() => router.push("/studies")}
            className="flex items-center text-sm text-secondary-foreground hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Studies
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Chapter {study.id}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">•</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Step {currentStepIndex + 1}/{study.steps.length}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{study.title}</h1>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6 relative">
          <div className="prose prose-invert prose-p:text-secondary-foreground prose-h2:text-xl prose-h2:text-white">
            <h2 className="!mt-0 font-bold">{currentStep.title}</h2>
            <p className="text-base leading-relaxed">{currentStep.content}</p>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">i</span>
              Instruction
            </h3>
            <p className="text-[14px] text-white/80">{currentStep.instruction}</p>
          </div>

          {/* Contextual Ad Unit */}
          <div className="w-full bg-black/20 border border-white/5 p-4 rounded-[24px] mt-2 mb-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Sponsored</span>
            </div>
            <AdUnit className="w-full min-h-[250px] rounded-2xl" />
          </div>

          {/* Feedback & Actions */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
            {errorMsg && (
              <div className="text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center animate-in fade-in slide-in-from-top-1">
                {errorMsg}
              </div>
            )}
            
            {isSuccess && (
              <div className="text-green-400 text-sm font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20 flex items-center justify-center gap-2 animate-in fade-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5" /> Correct!
              </div>
            )}

            <Button 
              onClick={nextStep}
              disabled={!isSuccess}
              className={`w-full h-12 rounded-xl font-bold text-[15px] transition-all shadow-lg ${
                isSuccess 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25" 
                  : "bg-white/5 text-white/30 hover:bg-white/5"
              }`}
            >
              {currentStepIndex === study.steps.length - 1 ? "Complete Study" : "Next Step"} <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ COLUMN 2: Board Area (Right) ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center bg-transparent relative p-4 lg:p-12 z-10 lg:h-full">
        {/* Subtle board glow */}
        <div className={`absolute inset-0 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000 ${isSuccess ? 'bg-green-500/10' : 'bg-primary/5 opacity-0 lg:opacity-100'}`} />
        
        <div className="w-full max-w-[min(calc(100vh-180px),700px)] mx-auto relative group shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden border border-white/10 z-10">
          <div className="w-full aspect-square bg-black/40 relative" key={`${study.id}-${currentStepIndex}`}>
            {/* @ts-ignore */}
            <Chessboard 
              id="StudyBoard"
              position={fen}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              boardOrientation={fen.includes(" w ") ? "white" : "black"}
              arePiecesDraggable={!isSuccess}
              customDarkSquareStyle={boardTheme.darkSquareStyle}
              customLightSquareStyle={boardTheme.lightSquareStyle}
              animationDuration={200}
            />
          </div>
          
          {/* Action Bar under the board */}
          <div className="absolute bottom-4 right-4 z-20">
            {!isSuccess && currentStep.expectedMove && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setErrorMsg(`Hint: Play ${currentStep.expectedMove}`)}
                className="bg-black/50 backdrop-blur-md border-white/10 hover:bg-black/70 text-white font-bold"
              >
                Show Solution
              </Button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
