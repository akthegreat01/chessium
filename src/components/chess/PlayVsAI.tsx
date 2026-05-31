"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard), { ssr: false });
import { Button } from "@/components/ui/button";
import { Undo2, Flag, RefreshCw, RefreshCcw, CheckCircle2 } from "lucide-react";
import { AIPersonality, aiPersonalities } from "@/lib/ai/personalities";
import { useBoardTheme } from "./ThemeContext";
import { createClient } from "@/utils/supabase/client";
import { useChessGame } from "@/hooks/useChessGame";

export default function PlayVsAI() {
  const { boardTheme } = useBoardTheme();
  
  // Custom hook for unified chess state
  const { game, fen, turn, isGameOver, makeMove, undoMove, resetGame } = useChessGame();
  
  const [personality, setPersonality] = useState<AIPersonality>(aiPersonalities[1]); // Default Aggressor
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [engineReady, setEngineReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [hasMatchStarted, setHasMatchStarted] = useState(false);
  const [playerName, setPlayerName] = useState("Player");
  
  // Dialogue state
  const [dialogue, setDialogue] = useState<string>("");
  const [showDialogue, setShowDialogue] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const dialogueTimer = useRef<NodeJS.Timeout | null>(null);
  
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) {
        setPlayerName(data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || "Player");
      }
    });
  }, []);

  const displayDialogue = useCallback((msg: string, duration = 4000) => {
    setDialogue(msg);
    setShowDialogue(true);
    if (dialogueTimer.current) clearTimeout(dialogueTimer.current);
    dialogueTimer.current = setTimeout(() => setShowDialogue(false), duration);
  }, []);

  // Initialize Stockfish worker
  useEffect(() => {
    workerRef.current = new Worker("/stockfish/stockfish.js");
    workerRef.current.onmessage = (event) => {
      const msg = event.data;
      if (msg === "uciok") {
        setEngineReady(true);
      }
      
      // Parse Best Move
      if (msg.startsWith("bestmove")) {
        const match = msg.match(/bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (match) {
          const moveLan = match[1];
          makeEngineMove(moveLan);
        }
      }
    };
    workerRef.current.postMessage("uci");
    
    return () => {
      workerRef.current?.terminate();
      if (dialogueTimer.current) clearTimeout(dialogueTimer.current);
    };
  }, []);

  // Set skill level when personality changes
  useEffect(() => {
    if (workerRef.current && engineReady) {
      workerRef.current.postMessage(`setoption name Skill Level value ${personality.engine.skillLevel}`);
    }
  }, [personality, engineReady]);

  // Handle engine move
  const makeEngineMove = useCallback((lan: string) => {
    const move = makeMove({
      from: lan.substring(0, 2),
      to: lan.substring(2, 4),
      promotion: lan.length > 4 ? lan.charAt(4) : undefined
    });
    
    if (move) {
      // Random chance for dialogue on move
      if (Math.random() < 0.3) {
        let pool = personality.dialogue.advantage;
        if (game.inCheck()) pool = personality.dialogue.blunder;
        else if (game.history().length > 20) pool = personality.dialogue.losing;
        
        const randomMsg = pool[Math.floor(Math.random() * pool.length)];
        displayDialogue(randomMsg);
      }
    } else {
      console.error("Engine provided invalid move:", lan);
    }
    setIsThinking(false);
  }, [game, makeMove, personality, displayDialogue]);

  // Trigger engine if it's its turn
  useEffect(() => {
    if (!hasMatchStarted) return;
    
    if (isGameOver) {
      if (game.isCheckmate()) {
        const isEngineWin = turn === playerColor;
        const msg = isEngineWin 
          ? personality.dialogue.winning[Math.floor(Math.random() * personality.dialogue.winning.length)]
          : personality.dialogue.losing[Math.floor(Math.random() * personality.dialogue.losing.length)];
        displayDialogue(msg, 6000);
      }
      return;
    }

    if (turn !== playerColor && engineReady && !isThinking) {
      setIsThinking(true);
      workerRef.current?.postMessage(`position fen ${fen}`);
      workerRef.current?.postMessage(`go depth ${personality.engine.depth}`);
    }
  }, [game, fen, turn, isGameOver, playerColor, engineReady, hasMatchStarted, isThinking, personality, displayDialogue]);

  const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    if (turn !== playerColor || isGameOver) return false;

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // Auto queen for now
    });

    return move !== null;
  };

  const handleUndo = () => {
    undoMove(); // Undo engine move
    if (game.turn() !== playerColor) undoMove(); // Undo player move if needed
    if (workerRef.current) workerRef.current.postMessage("stop");
    setIsThinking(false);
  };

  const handleReset = () => {
    resetGame();
    setHasMatchStarted(false);
    if (workerRef.current) workerRef.current.postMessage("stop");
    setIsThinking(false);
  };

  const flipBoard = () => {
    setIsFlipped(prev => !prev);
  };

  const startGame = () => {
    resetGame();
    setHasMatchStarted(true);
    const randomMsg = personality.dialogue.start[Math.floor(Math.random() * personality.dialogue.start.length)];
    displayDialogue(randomMsg, 5000);
  };

  if (!hasMatchStarted) {
    return (
      <div className="flex flex-col h-full w-full max-w-[1000px] mx-auto gap-8 px-6 py-12 bg-background items-center justify-center min-h-[calc(100vh-80px)]">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center">Choose Your Opponent</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {aiPersonalities.map((p) => {
            const Icon = p.avatarIcon;
            const isSelected = personality.id === p.id;
            return (
              <button 
                key={p.id}
                onClick={() => setPersonality(p)}
                className={`w-full text-left p-5 rounded-[16px] bg-surface transition-all flex gap-4 ${
                  isSelected 
                    ? "border-2 border-primary shadow-lg shadow-primary/10" 
                    : "border-2 border-transparent hover:border-border"
                }`}
              >
                <div className={`w-14 h-14 rounded shrink-0 flex items-center justify-center ${p.colorClass} text-white`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-foreground text-base">{p.name}</div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="text-xs font-bold text-secondary-foreground uppercase tracking-wider mb-2">{p.title} • Lvl {p.engine.skillLevel}</div>
                  <div className="text-xs text-secondary-foreground leading-relaxed line-clamp-2">{p.description}</div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="bg-surface border border-border rounded-[24px] p-8 w-full max-w-[500px] flex flex-col items-center gap-6 mt-4">
          <div className="w-full">
            <h3 className="text-xs font-bold tracking-wider text-secondary-foreground uppercase mb-3 text-center">Play As</h3>
            <div className="flex gap-2 w-full">
              <Button 
                variant="secondary"
                className={`flex-1 rounded-xl h-12 text-[15px] font-bold border-2 transition-all ${playerColor === "w" ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-background text-secondary-foreground hover:bg-white/5"}`}
                onClick={() => { setPlayerColor("w"); setIsFlipped(false); }}
              >
                White
              </Button>
              <Button 
                variant="secondary"
                className={`flex-1 rounded-xl h-12 text-[15px] font-bold border-2 transition-all ${playerColor === "b" ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-background text-secondary-foreground hover:bg-white/5"}`}
                onClick={() => { setPlayerColor("b"); setIsFlipped(true); }}
              >
                Black
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
            onClick={startGame}
          >
            Start Match
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-[1200px] mx-auto gap-8 px-4 py-6 pb-24 lg:pb-6 bg-background items-center lg:items-start justify-center min-h-[calc(100vh-80px)]">
      
      {/* Board Column (Center) */}
      <div className="flex flex-col w-full max-w-[75vh] flex-1 bg-surface border border-border rounded-[24px] overflow-hidden relative shrink-0 shadow-2xl">
        
        {/* Opponent Info Header */}
        <div className="w-full bg-surface px-5 py-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-4 relative">
            <div className={`w-10 h-10 rounded flex items-center justify-center text-white shadow-md ${personality.colorClass}`}>
              {React.createElement(personality.avatarIcon, { className: "w-5 h-5" })}
            </div>
            <h2 className="text-base font-bold text-foreground">{personality.name} <span className="text-secondary-foreground font-normal text-sm ml-1">(Lvl {personality.engine.skillLevel})</span></h2>

            {/* Dialogue Bubble */}
            <div className={`absolute top-[50px] left-0 w-[250px] bg-foreground text-background p-3 rounded-xl shadow-xl transition-all duration-300 z-10 ${
              showDialogue ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}>
              <div className="absolute -top-2 left-4 w-4 h-4 bg-foreground rotate-45"></div>
              <p className="text-[13px] font-bold relative z-10 leading-snug">{dialogue}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isThinking && (
              <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Thinking
              </div>
            )}
          </div>
        </div>

        <div className="w-full aspect-square relative bg-background/50">
          <div className="w-full h-full absolute inset-0">
            {/* @ts-ignore */}
            <Chessboard 
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={playerColor === "w" ? (isFlipped ? "black" : "white") : (isFlipped ? "white" : "black")}
              customDarkSquareStyle={boardTheme.darkSquareStyle}
              customLightSquareStyle={boardTheme.lightSquareStyle}
              animationDuration={250}
            />
          </div>
        </div>

        {/* Player Info Footer */}
        <div className="w-full bg-surface px-5 py-4 flex items-center justify-between border-t border-border">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-background flex items-center justify-center overflow-hidden shadow-inner">
              <img src="/chessium_logo.png" alt="You" className="w-full h-full object-cover p-1 opacity-80" />
            </div>
            <h2 className="text-base font-bold text-foreground">{playerName}</h2>
          </div>
        </div>
      </div>

      {/* Controls Column (Right) */}
      <div className="w-full lg:w-[300px] flex flex-col gap-4">
        
        {/* Actions */}
        <div className="bg-surface rounded-2xl p-3 flex flex-col gap-2 border border-border shadow-lg">
          <Button onClick={handleUndo} disabled={game.history().length === 0 || isGameOver} variant="outline" className="w-full justify-start gap-4 h-14 rounded-xl bg-background border-border text-base font-medium transition-colors hover:bg-white/5">
            <Undo2 className="w-5 h-5 text-secondary-foreground" /> Undo Move
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full justify-start gap-4 h-14 rounded-xl bg-background border-border text-base font-medium transition-colors hover:bg-white/5">
            <RefreshCw className="w-5 h-5 text-secondary-foreground" /> Change Bot
          </Button>
          <Button onClick={flipBoard} variant="outline" className="w-full justify-start gap-4 h-14 rounded-xl bg-background border-border text-base font-medium transition-colors hover:bg-white/5">
            <RefreshCcw className="w-5 h-5 text-secondary-foreground" /> Flip Board
          </Button>
          <Button variant="outline" className="w-full justify-start gap-4 h-14 rounded-xl bg-background border-destructive/20 hover:bg-destructive/10 text-destructive text-base font-medium transition-colors">
            <Flag className="w-5 h-5" /> Resign
          </Button>
        </div>

      </div>
      
    </div>
  );
}
