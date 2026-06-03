"use client";

import { useState, useEffect, useRef, use } from "react";
import Board from "@/components/chess/Board";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import { useBulletTimer } from "@/hooks/useBulletTimer";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Move } from "chess.js";

const DRILLS = {
  "bullet-kq": {
    title: "Bullet Scramble: Queen",
    initialFen: "8/8/8/8/3Q4/4K3/8/7k w - - 0 1", // K+Q vs K
    playerColor: "white" as const,
    seconds: 10,
    botRating: 2000,
  },
  "bullet-kr": {
    title: "Bullet Scramble: Rook",
    initialFen: "8/8/8/8/8/3R4/3K4/7k w - - 0 1", // K+R vs K
    playerColor: "white" as const,
    seconds: 15,
    botRating: 2000,
  },
  "bullet-pawn": {
    title: "Bullet Scramble: Promotion",
    initialFen: "8/8/8/8/3P4/3K4/8/3k4 w - - 0 1", // King and Pawn vs King
    playerColor: "white" as const,
    seconds: 15,
    botRating: 2000,
  }
};

export default function DrillPage() {
  const params = useParams();
  const drillId = params?.id as keyof typeof DRILLS;
  const drill = DRILLS[drillId];
  const router = useRouter();

  const { game, position, history, makeMove, isGameOver, turn, loadFen } = useChessGame();
  const { isReady, getBestMove } = useStockfish();
  
  const [hasStarted, setHasStarted] = useState(false);
  const [drillStatus, setDrillStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [premove, setPremove] = useState<{ from: string; to: string } | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Initialize timer
  const { timeLeftMs, start: startTimer, pause: pauseTimer, consumePremoveTime, formattedTime } = useBulletTimer(drill?.seconds || 10, () => {
    // Timeout
    setDrillStatus("lost");
  });

  if (!drill) {
    return <div className="text-white p-8">Drill not found.</div>;
  }

  // Load initial position
  useEffect(() => {
    loadFen(drill.initialFen);
  }, [drill.initialFen, loadFen]);

  const startGame = () => {
    setHasStarted(true);
    setDrillStatus("playing");
    startTimer();
  };

  // Check end conditions
  useEffect(() => {
    if (drillStatus === "playing") {
      if (game.isCheckmate() && turn !== drill.playerColor[0]) {
        pauseTimer();
        setDrillStatus("won");
      } else if (game.isDraw() || game.isStalemate()) {
        pauseTimer();
        setDrillStatus("lost");
      }
    }
  }, [position, drillStatus, game, turn, drill.playerColor, pauseTimer]);

  // Handle Premoves logic upon opponent move
  useEffect(() => {
    // If it is now our turn, and we have a premove stored, execute it instantly
    if (drillStatus === "playing" && turn === drill.playerColor[0] && premove) {
      // Small timeout to allow React to paint the opponent's move first before our premove fires
      const timer = setTimeout(() => {
        try {
          const move = makeMove({
            from: premove.from,
            to: premove.to,
            promotion: "q" // Auto queen for bullet
          });
          
          if (move) {
            consumePremoveTime(); // 0.1s cost
          }
        } catch (e) {
          // Illegal premove, just clear it
        } finally {
          setPremove(null);
        }
      }, 10); // Reduced to 10ms for ultimate smoothness
      return () => clearTimeout(timer);
    }
  }, [turn, drill.playerColor, premove, drillStatus, makeMove, consumePremoveTime]);

  // Bot Logic
  useEffect(() => {
    if (drillStatus !== "playing" || isGameOver || !isReady || isBotThinking) return;

    const isWhiteTurn = turn === 'w';
    const isBotTurn = (drill.playerColor === "white" && !isWhiteTurn) || (drill.playerColor === "black" && isWhiteTurn);

    if (isBotTurn) {
      setIsBotThinking(true);
      
      // Fast depth for bullet bot
      const depth = 5;
      
      // Minimal artificial delay for bullet (extreme smoothness)
      const thinkTime = Math.random() * 30 + 10;
      
      setTimeout(() => {
        getBestMove(position, depth)
          .then((bestMove) => {
            if (bestMove && drillStatus === "playing") { // Ensure we haven't lost on time
              const from = bestMove.substring(0, 2);
              const to = bestMove.substring(2, 4);
              const promotion = bestMove.length > 4 ? bestMove[4] : undefined;
              
              makeMove({ from, to, promotion });
            }
          })
          .catch(console.error)
          .finally(() => {
            setIsBotThinking(false);
          });
      }, thinkTime);
    }
  }, [turn, drill.playerColor, isGameOver, isReady, position, makeMove, getBestMove, isBotThinking, drillStatus]);

  const handlePieceDrop = (source: string, target: string, piece: string) => {
    if (drillStatus !== "playing") return false;
    
    const isWhiteTurn = turn === 'w';
    const isPlayerTurn = (drill.playerColor === "white" && isWhiteTurn) || (drill.playerColor === "black" && !isWhiteTurn);

    const isPawn = piece[1]?.toLowerCase() === "p";
    const isBackRank = target[1] === "8" || target[1] === "1";
    const promotion = (isPawn && isBackRank) ? "q" : undefined;

    if (isPlayerTurn) {
      // Normal move
      const move = makeMove({
        from: source,
        to: target,
        promotion: promotion,
      });
      return move !== null;
    } else {
      // Opponent's turn - Store as PREMOVE!
      setPremove({ from: source, to: target });
      return false; // Snap piece back visually, we'll show red squares via customStyles
    }
  };

  const handleRightClick = (square: string) => {
    // Clear premove
    if (premove) {
      setPremove(null);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 p-4 relative">
      
      {/* Sidebar Info */}
      <div className="w-full md:w-64 flex flex-col gap-6 order-2 md:order-1">
        <div>
          <Link href="/drills" className="text-[#a0a0a8] hover:text-white text-sm font-medium flex items-center gap-2 mb-6 transition-colors">
            &larr; Back to Drills
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">{drill.title}</h1>
          <p className="text-[#a0a0a8] text-sm mt-2">
            Premoves are allowed! Right click to cancel a premove.
          </p>
        </div>

        {/* Timer Box */}
        <div className={`p-6 rounded-2xl border ${timeLeftMs < 3000 ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-[#141416] border-[#2a2a30] text-white'} transition-colors duration-300`}>
          <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Time Remaining</div>
          <div className="text-5xl font-black tracking-tighter tabular-nums font-mono">
            {formattedTime()}
          </div>
        </div>

        {!hasStarted && (
          <button 
            onClick={startGame}
            className="w-full py-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-lg transition-colors shadow-[0_0_20px_rgba(129,182,76,0.3)]"
          >
            Start Drill
          </button>
        )}
      </div>

      {/* Board */}
      <div className="w-full max-w-[500px] flex-shrink-0 relative order-1 md:order-2 shadow-elevated">
        <Board 
          position={position}
          onPieceDrop={handlePieceDrop}
          onSquareRightClick={handleRightClick}
          boardOrientation={drill.playerColor}
          premove={premove}
          arePiecesDraggable={drillStatus === "playing" || !hasStarted}
          animationDuration={30} // Super fast animations for bullet
        />

        {/* Overlays */}
        <AnimatePresence>
          {drillStatus === "won" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
            >
              <div className="bg-[#141416] border border-green-500/30 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-2xl font-bold text-white mb-2">Drill Passed!</h2>
                <p className="text-[#a0a0a8] mb-6">Time left: {formattedTime()}s</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                    Retry
                  </button>
                  <Link href="/drills" className="px-6 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
                    More Drills
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {drillStatus === "lost" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
            >
              <div className="bg-[#141416] border border-red-500/30 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                <div className="text-6xl mb-4">⏱️</div>
                <h2 className="text-2xl font-bold text-white mb-2">Drill Failed!</h2>
                <p className="text-[#a0a0a8] mb-6">You ran out of time.</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {!hasStarted && (
            <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center pointer-events-none">
              <div className="bg-[#1a1a1f] px-6 py-3 rounded-full border border-[#2a2a30] text-white font-medium shadow-xl">
                Press Start to Begin
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
