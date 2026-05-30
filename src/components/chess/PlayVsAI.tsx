"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Undo2, Flag, RefreshCw, RefreshCcw, CheckCircle2, ArrowUpDown } from "lucide-react";
import { AIPersonality, aiPersonalities } from "@/lib/ai/personalities";
import { useBoardTheme } from "./ThemeContext";

export default function PlayVsAI() {
  const { boardTheme } = useBoardTheme();
  const [game, setGame] = useState(new Chess());
  const [personality, setPersonality] = useState<AIPersonality>(aiPersonalities[1]); // Default Aggressor
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [engineReady, setEngineReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  // Dialogue state
  const [dialogue, setDialogue] = useState<string>("");
  const [showDialogue, setShowDialogue] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
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
    setGame(prevGame => {
      const gameCopy = new Chess(prevGame.fen());
      try {
        const from = moveString.substring(0, 2);
        const to = moveString.substring(2, 4);
        const promotion = moveString.length > 4 ? moveString.substring(4, 5) : undefined;
        
        const result = gameCopy.move({ from, to, promotion });
        if (result) {
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
          return gameCopy;
        }
      } catch (e) {
        console.error("Engine provided illegal move", moveString);
      }
      return prevGame; // return unchanged if failed
    });
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

  const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    if (game.turn() !== playerColor || game.isGameOver()) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece && piece.length > 1 ? piece[1].toLowerCase() : "q",
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
    <div className="flex flex-col lg:flex-row h-full w-full max-w-[1400px] mx-auto gap-4 px-4 py-4 pb-24 lg:pb-4 bg-background items-center lg:items-start justify-center">
      
      {/* Selection Column (Left) */}
      <div className="w-full lg:w-[280px] flex flex-col gap-4">
        <h3 className="text-sm font-bold tracking-wider text-[#c3c3c2] uppercase">Opponents</h3>
        <div className="flex flex-col gap-2">
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
                className={`w-full text-left p-3 rounded bg-[#262421] transition-all flex gap-3 ${
                  isSelected 
                    ? "border-l-4 border-primary bg-[#312e2b]" 
                    : "border-l-4 border-transparent hover:bg-[#312e2b]"
                }`}
              >
                <div className={`w-10 h-10 rounded shrink-0 flex items-center justify-center ${p.colorClass} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-bold text-[#fff] text-sm">{p.name}</div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#81b64c]" />}
                  </div>
                  <div className="text-[10px] font-bold text-[#8b8987] uppercase tracking-wider mb-1">{p.title}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Board Column (Center) */}
      <div className="flex flex-col w-full max-w-[calc(100vh-200px)] min-w-[300px] flex-1 bg-[#312e2b] rounded-md overflow-hidden relative shrink-0">
        
        {/* Opponent Info Header */}
        <div className="w-full bg-[#312e2b] px-4 py-3 flex items-center justify-between border-b border-[#262421]">
          <div className="flex items-center gap-3 relative">
            <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${personality.colorClass}`}>
              {React.createElement(personality.avatarIcon, { className: "w-4 h-4" })}
            </div>
            <h2 className="text-[15px] font-bold text-[#c3c3c2]">{personality.name} <span className="text-[#8b8987] font-normal text-sm ml-1">(Lvl {personality.engine.skillLevel})</span></h2>

            {/* Dialogue Bubble */}
            <div className={`absolute top-[40px] left-0 w-[220px] bg-[#fff] text-[#262421] p-3 rounded shadow-lg transition-all duration-300 z-10 ${
              showDialogue ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}>
              <div className="absolute -top-2 left-4 w-4 h-4 bg-[#fff] rotate-45"></div>
              <p className="text-[13px] font-bold relative z-10">{dialogue}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isThinking && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#c3c3c2] uppercase tracking-widest bg-[#262421] px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-[#81b64c] animate-pulse" /> Thinking
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-1 overflow-hidden">
          {/* The Board */}
          <div className="flex-1 aspect-square relative bg-[#262421]">
            {/* @ts-ignore */}
            <Chessboard 
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={playerColor === "w" ? (isFlipped ? "black" : "white") : (isFlipped ? "white" : "black")}
              customDarkSquareStyle={boardTheme.darkSquareStyle}
              customLightSquareStyle={boardTheme.lightSquareStyle}
              animationDuration={250}
            />
          </div>

          {/* Board Controls Bar */}
          <div className="w-12 bg-[#262421] flex flex-col items-center py-4 shrink-0 gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsFlipped(f => !f)}
              className="w-10 h-10 rounded text-[#8b8987] hover:bg-[#312e2b] hover:text-[#c3c3c2]"
              title="Flip Board"
            >
              <ArrowUpDown className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Player Info Footer */}
        <div className="w-full bg-[#312e2b] px-4 py-3 flex items-center justify-between border-t border-[#262421]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#262421] flex items-center justify-center overflow-hidden">
              <img src="/chessium_logo.png" alt="You" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-[15px] font-bold text-[#c3c3c2]">akshath2008</h2>
          </div>
        </div>
      </div>

      {/* Controls Column (Right) */}
      <div className="w-full lg:w-[280px] flex flex-col gap-4">
        
        {/* Play As */}
        <div className="bg-[#262421] rounded-md p-4">
          <h3 className="text-sm font-bold tracking-wider text-[#c3c3c2] uppercase mb-4">Play As</h3>
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              className={`flex-1 rounded h-10 ${playerColor === "w" ? "bg-[#fff] text-[#262421] hover:bg-[#fff]" : "bg-[#312e2b] text-[#8b8987] hover:bg-[#3d3935]"}`}
              onClick={() => setPlayerColor("w")}
            >
              White
            </Button>
            <Button 
              variant="secondary"
              className={`flex-1 rounded h-10 ${playerColor === "b" ? "bg-[#fff] text-[#262421] hover:bg-[#fff]" : "bg-[#312e2b] text-[#8b8987] hover:bg-[#3d3935]"}`}
              onClick={() => setPlayerColor("b")}
            >
              Black
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#262421] rounded-md p-2 flex flex-col gap-1">
          <Button onClick={undoMove} disabled={game.history().length === 0 || game.isGameOver()} variant="ghost" className="w-full justify-start gap-3 h-12 rounded bg-[#262421] hover:bg-[#312e2b] text-[#c3c3c2] font-semibold">
            <Undo2 className="w-4 h-4 text-[#8b8987]" /> Undo Move
          </Button>
          <Button onClick={resetGame} variant="ghost" className="w-full justify-start gap-3 h-12 rounded bg-[#262421] hover:bg-[#312e2b] text-[#c3c3c2] font-semibold">
            <RefreshCw className="w-4 h-4 text-[#8b8987]" /> New Game
          </Button>
          <Button onClick={flipBoard} variant="ghost" className="w-full justify-start gap-3 h-12 rounded bg-[#262421] hover:bg-[#312e2b] text-[#c3c3c2] font-semibold">
            <RefreshCcw className="w-4 h-4 text-[#8b8987]" /> Flip Board
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded bg-[#262421] hover:bg-[#312e2b] text-destructive/80 font-semibold mt-4 border-t border-[#312e2b] pt-5">
            <Flag className="w-4 h-4" /> Resign
          </Button>
        </div>

      </div>
      
    </div>
  );
}
