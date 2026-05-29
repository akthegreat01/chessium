"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Undo2, Flag, RefreshCw, RefreshCcw, CheckCircle2 } from "lucide-react";
import { AIPersonality, aiPersonalities } from "@/lib/ai/personalities";

export default function PlayVsAI() {
  const [game, setGame] = useState(new Chess());
  const [personality, setPersonality] = useState<AIPersonality>(aiPersonalities[1]); // Default Aggressor
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [engineReady, setEngineReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  // Dialogue state
  const [dialogue, setDialogue] = useState<string>("");
  const [showDialogue, setShowDialogue] = useState(false);
  const dialogueTimer = useRef<NodeJS.Timeout | null>(null);
  
  const workerRef = useRef<Worker | null>(null);

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
          const move = match[1];
          makeEngineMove(move);
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
    if (engineReady && workerRef.current) {
      workerRef.current.postMessage(`setoption name Skill Level value ${personality.engine.skillLevel}`);
    }
  }, [personality, engineReady]);

  // Initial greeting
  useEffect(() => {
    const randomMsg = personality.dialogue.start[Math.floor(Math.random() * personality.dialogue.start.length)];
    displayDialogue(randomMsg, 5000);
  }, [personality, displayDialogue]);

  const requestEngineMove = useCallback((fen: string, depth: number) => {
    if (workerRef.current) {
      setIsThinking(true);
      workerRef.current.postMessage("stop");
      workerRef.current.postMessage(`position fen ${fen}`);
      workerRef.current.postMessage(`go depth ${depth}`);
    }
  }, []);

  const makeEngineMove = (moveString: string) => {
    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move(moveString, { sloppy: true } as any);
      if (result) {
        setGame(gameCopy);
        
        // Check game over
        if (gameCopy.isGameOver()) {
          if (gameCopy.isCheckmate()) {
            const msg = personality.dialogue.winning[Math.floor(Math.random() * personality.dialogue.winning.length)];
            displayDialogue(msg, 6000);
          } else if (gameCopy.isDraw()) {
            const msg = personality.dialogue.draw[Math.floor(Math.random() * personality.dialogue.draw.length)];
            displayDialogue(msg, 6000);
          }
        }
      }
    } catch (e) {
      console.error("Engine provided illegal move", moveString);
    }
    setIsThinking(false);
  };

  useEffect(() => {
    if (game.turn() !== playerColor && !game.isGameOver() && engineReady && !isThinking) {
      // Artificial delay to simulate thinking based on personality
      const delay = Math.floor(Math.random() * (personality.engine.moveTimeMax - personality.engine.moveTimeMin + 1)) + personality.engine.moveTimeMin;
      setTimeout(() => {
        requestEngineMove(game.fen(), personality.engine.depth);
      }, delay);
    }
  }, [game, playerColor, engineReady, isThinking, personality, requestEngineMove]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (game.turn() !== playerColor || game.isGameOver()) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (result) {
        setGame(gameCopy);
        
        // Randomly banter
        if (Math.random() < 0.1 && !gameCopy.isGameOver()) {
          // Just a random comment
          const msg = personality.dialogue.winning[0]; // simplistic for now
          // Could make this smarter by evaluating the position, but keeping it simple
        }

        if (gameCopy.isGameOver()) {
          if (gameCopy.isCheckmate()) {
            const msg = personality.dialogue.losing[Math.floor(Math.random() * personality.dialogue.losing.length)];
            displayDialogue(msg, 6000);
          }
        }
        
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  const undoMove = () => {
    const gameCopy = new Chess(game.fen());
    gameCopy.undo(); // Undo engine move
    if (gameCopy.turn() !== playerColor) {
      gameCopy.undo(); // Undo player move
    }
    setGame(gameCopy);
    if (workerRef.current) workerRef.current.postMessage("stop");
    setIsThinking(false);
  };

  const resetGame = () => {
    setGame(new Chess());
    if (workerRef.current) workerRef.current.postMessage("stop");
    setIsThinking(false);
    
    // Greeting again
    const randomMsg = personality.dialogue.start[Math.floor(Math.random() * personality.dialogue.start.length)];
    displayDialogue(randomMsg, 5000);
  };

  const flipBoard = () => {
    setPlayerColor(prev => prev === "w" ? "b" : "w");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-[1300px] mx-auto gap-12 px-4 lg:px-6 py-6 pb-24 lg:pb-8">
      
      {/* Selection Column (Left) */}
      <div className="w-full lg:w-[320px] flex flex-col gap-4">
        <h3 className="text-xl font-bold tracking-tight mb-2">Choose Opponent</h3>
        <div className="flex flex-col gap-3">
          {aiPersonalities.map((p) => {
            const Icon = p.avatarIcon;
            const isSelected = personality.id === p.id;
            return (
              <button 
                key={p.id}
                onClick={() => {
                  setPersonality(p);
                  if (game.history().length === 0) {
                    const randomMsg = p.dialogue.start[Math.floor(Math.random() * p.dialogue.start.length)];
                    displayDialogue(randomMsg, 5000);
                  }
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-4 ${
                  isSelected 
                    ? "bg-surface border-primary shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                    : "bg-surface border-white/5 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${p.colorClass} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-bold">{p.name}</div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="text-xs font-bold text-secondary-foreground uppercase tracking-wider mb-1">{p.title}</div>
                  <div className="text-xs text-secondary-foreground/80 leading-relaxed line-clamp-2">{p.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Board Column (Center) */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-0">
        
        {/* Opponent Info Header */}
        <div className="w-full max-w-[650px] mb-4 flex justify-between items-end px-2 relative">
          <div className="flex items-center gap-3 relative">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${personality.colorClass}`}>
              {React.createElement(personality.avatarIcon, { className: "w-6 h-6" })}
            </div>
            <div>
              <div className="font-bold text-xl">{personality.name}</div>
              <div className="text-sm font-medium text-secondary-foreground">{personality.title} • Lvl {personality.engine.skillLevel}</div>
            </div>

            {/* Dialogue Bubble */}
            <div className={`absolute top-0 left-[60px] -translate-y-[110%] w-[250px] bg-white text-black p-3 rounded-2xl rounded-bl-sm shadow-2xl transition-all duration-300 origin-bottom-left z-10 ${
              showDialogue ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}>
              <p className="text-sm font-medium leading-tight">{dialogue}</p>
            </div>
          </div>

          {isThinking && (
            <div className="flex items-center gap-2 text-sm font-medium text-primary animate-pulse pb-1">
              <span className="w-2 h-2 rounded-full bg-primary" /> Thinking
            </div>
          )}
        </div>

        {/* The Board */}
        <div className="w-full max-w-[650px] bg-background rounded-[16px] overflow-hidden shadow-2xl shadow-black/20 border border-white/10 relative z-0">
          {/* @ts-ignore */}
        <Chessboard 
            position={game.fen()} 
            onPieceDrop={onDrop}
            boardOrientation={playerColor === "w" ? "white" : "black"}
            customDarkSquareStyle={{ backgroundColor: '#2d3748' }}
            customLightSquareStyle={{ backgroundColor: '#e2e8f0' }}
            animationDuration={250}
          />
        </div>

        {/* Player Info Footer */}
        <div className="w-full max-w-[650px] mt-4 flex justify-between items-start px-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center">
              <span className="font-bold text-lg text-primary">You</span>
            </div>
            <div>
              <div className="font-bold text-xl">Challenger</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Column (Right) */}
      <div className="w-full lg:w-[280px] flex flex-col gap-6">
        <div className="bg-surface border border-white/5 rounded-[24px] p-6 shadow-xl">
          <h3 className="text-xl font-bold tracking-tight mb-6">Match Options</h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-secondary-foreground uppercase tracking-wider mb-3 block">Play As</label>
              <div className="flex bg-background border border-white/5 rounded-xl p-1 gap-1">
                <Button 
                  variant={playerColor === "w" ? "secondary" : "ghost"} 
                  className={`flex-1 rounded-lg ${playerColor === "w" ? "bg-white text-black hover:bg-white/90" : ""}`}
                  onClick={() => setPlayerColor("w")}
                >
                  White
                </Button>
                <Button 
                  variant={playerColor === "b" ? "secondary" : "ghost"} 
                  className={`flex-1 rounded-lg ${playerColor === "b" ? "bg-black text-white hover:bg-black/90" : ""}`}
                  onClick={() => setPlayerColor("b")}
                >
                  Black
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-white/5 rounded-[24px] p-6 shadow-xl space-y-3">
          <Button onClick={undoMove} disabled={game.history().length === 0 || game.isGameOver()} variant="outline" className="w-full justify-start gap-4 h-14 rounded-xl bg-background border-white/5 text-base font-medium transition-colors hover:bg-white/5">
            <Undo2 className="w-5 h-5 text-secondary-foreground" /> Undo Move
          </Button>
          <Button onClick={resetGame} variant="outline" className="w-full justify-start gap-4 h-14 rounded-xl bg-background border-white/5 text-base font-medium transition-colors hover:bg-white/5">
            <RefreshCw className="w-5 h-5 text-secondary-foreground" /> New Game
          </Button>
          <Button onClick={flipBoard} variant="outline" className="w-full justify-start gap-4 h-14 rounded-xl bg-background border-white/5 text-base font-medium transition-colors hover:bg-white/5">
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
