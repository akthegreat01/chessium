"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "@/contexts/SettingsContext";
import AdSlot from "@/components/ui/AdSlot";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"];

function getRandomSquare() {
  const f = FILES[Math.floor(Math.random() * FILES.length)];
  const r = RANKS[Math.floor(Math.random() * RANKS.length)];
  return `${f}${r}`;
}

export default function VisionTrainerPage() {
  const { settings } = useSettings();
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetSquare, setTargetSquare] = useState<string>("e4");
  const [score, setScore] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  
  // Animation states for visual feedback
  const [flashColor, setFlashColor] = useState<"green" | "red" | null>(null);

  const startGame = () => {
    setStatus("playing");
    setScore(0);
    setWrongClicks(0);
    setTimeLeft(30);
    setTargetSquare(getRandomSquare());
    setOrientation(Math.random() > 0.5 ? "white" : "black");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "playing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (status === "playing" && timeLeft === 0) {
      setStatus("finished");
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const onSquareClick = (square: string) => {
    if (status !== "playing") return;

    if (square === targetSquare) {
      setScore((s) => s + 1);
      setFlashColor("green");
      // Pick a new square that is different from the current one
      let nextSquare = targetSquare;
      while (nextSquare === targetSquare) {
        nextSquare = getRandomSquare();
      }
      setTargetSquare(nextSquare);
    } else {
      setWrongClicks((w) => w + 1);
      setFlashColor("red");
    }

    setTimeout(() => setFlashColor(null), 150);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
          Vision <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81b64c] to-[#9fcc6b]">Trainer</span>
        </h1>
        <p className="text-[#a0a0a8] text-lg">
          Find the coordinate as fast as possible. Master board vision.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center flex-1">
        
        {/* Board Side */}
        <div className="w-full max-w-[500px]">
          <div className={`rounded-xl overflow-hidden border-2 transition-colors duration-150 shadow-elevated ${
            flashColor === "green" ? "border-green-500 shadow-green-500/20" : 
            flashColor === "red" ? "border-red-500 shadow-red-500/20" : 
            "border-[#2a2a30]"
          }`}>
            <Chessboard 
              id="vision-board"
              position="8/8/8/8/8/8/8/8 w - - 0 1"
              boardOrientation={orientation}
              customDarkSquareStyle={{ backgroundColor: settings.boardTheme === 'green' ? '#739552' : settings.boardTheme === 'blue' ? '#4A739C' : '#8A785D' }}
              customLightSquareStyle={{ backgroundColor: settings.boardTheme === 'green' ? '#EBECD0' : settings.boardTheme === 'blue' ? '#EAE9D2' : '#E8E5DF' }}
              onSquareClick={onSquareClick}
              showBoardNotation={showCoordinates}
              animationDuration={0}
              arePiecesDraggable={false}
            />
          </div>
          
          {/* Controls */}
          <div className="mt-6 flex justify-between items-center bg-[#141416] p-4 rounded-xl border border-[#2a2a30]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-[#2a2a30] text-[#81b64c] focus:ring-[#81b64c] bg-[#1a1a1f]"
                checked={showCoordinates}
                onChange={(e) => setShowCoordinates(e.target.checked)}
              />
              <span className="text-sm font-medium text-[#a0a0a8]">Show Coordinates</span>
            </label>
            
            <button 
              onClick={() => setOrientation(o => o === "white" ? "black" : "white")}
              className="px-3 py-1.5 bg-[#2a2a30] hover:bg-[#323238] rounded-lg text-sm text-white transition-colors"
            >
              Flip Board
            </button>
          </div>
        </div>

        {/* HUD Side */}
        <div className="w-full md:w-64 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#141416] p-8 rounded-2xl border border-[#2a2a30] text-center"
              >
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Ready?</h3>
                <p className="text-[#a0a0a8] text-sm mb-6">You have 30 seconds to find as many squares as possible.</p>
                <button 
                  onClick={startGame}
                  className="w-full py-3 bg-[#81b64c] hover:bg-[#9fcc6b] text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(129,182,76,0.3)]"
                >
                  Start Training
                </button>
              </motion.div>
            )}

            {status === "playing" && (
              <motion.div 
                key="playing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-4"
              >
                <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 text-center shadow-elevated">
                  <div className="text-sm text-[#a0a0a8] uppercase font-bold tracking-wider mb-2">Find</div>
                  <div className="text-6xl font-black text-white font-mono">{targetSquare}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-4 text-center">
                    <div className="text-xs text-[#a0a0a8] uppercase font-bold mb-1">Time</div>
                    <div className={`text-3xl font-bold font-mono ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                      0:{timeLeft.toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-4 text-center">
                    <div className="text-xs text-[#a0a0a8] uppercase font-bold mb-1">Score</div>
                    <div className="text-3xl font-bold font-mono text-[#81b64c]">{score}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {status === "finished" && (
              <motion.div 
                key="finished"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#141416] p-6 rounded-2xl border border-[#2a2a30] text-center shadow-elevated"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Time's Up!</h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center border-b border-[#2a2a30] pb-2">
                    <span className="text-[#a0a0a8]">Correct</span>
                    <span className="text-xl font-bold text-white">{score}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#2a2a30] pb-2">
                    <span className="text-[#a0a0a8]">Missed</span>
                    <span className="text-xl font-bold text-red-400">{wrongClicks}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[#a0a0a8]">Accuracy</span>
                    <span className="text-xl font-bold text-[#81b64c]">
                      {score + wrongClicks > 0 ? Math.round((score / (score + wrongClicks)) * 100) : 0}%
                    </span>
                  </div>
                </div>

                <button 
                  onClick={startGame}
                  className="w-full py-3 bg-[#2a2a30] hover:bg-[#323238] text-white font-bold rounded-xl transition-colors mb-3"
                >
                  Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-auto hidden md:block">
            <AdSlot format="square" />
          </div>
        </div>
      </div>
      
      <div className="mt-8 md:hidden">
        <AdSlot format="horizontal" />
      </div>
    </div>
  );
}
