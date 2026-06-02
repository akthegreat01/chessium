"use client";

import { useState, useEffect } from "react";
import Board from "@/components/chess/Board";
import { BOT_PERSONALITIES, BotPersonality } from "@/lib/chess/bot";
import { motion, AnimatePresence } from "motion/react";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import MoveList from "@/components/chess/MoveList";

export default function PlayPage() {
  const [selectedBot, setSelectedBot] = useState<BotPersonality | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [isBotThinking, setIsBotThinking] = useState(false);
  
  const { game, position, history, makeMove, isGameOver, turn } = useChessGame();
  const { isReady, getBestMove, evaluatePosition } = useStockfish();

  const handleStartGame = (bot: BotPersonality, color: "white" | "black" | "random") => {
    setSelectedBot(bot);
    setPlayerColor(color === "random" ? (Math.random() > 0.5 ? "white" : "black") : color);
    setIsModalOpen(false);
  };

  const handlePieceDrop = (source: string, target: string, piece: string) => {
    if (isGameOver || isBotThinking) return false;
    
    // Only allow moving if it's the player's turn
    const isWhiteTurn = turn === 'w';
    if ((playerColor === "white" && !isWhiteTurn) || (playerColor === "black" && isWhiteTurn)) {
      return false;
    }

    const promotion = piece[1].toLowerCase();
    const move = makeMove({
      from: source,
      to: target,
      promotion: promotion === "p" ? undefined : promotion,
    });
    
    return move !== null;
  };

  // Bot logic
  useEffect(() => {
    if (!selectedBot || isGameOver || !isReady || isBotThinking) return;

    const isWhiteTurn = turn === 'w';
    const isBotTurn = (playerColor === "white" && !isWhiteTurn) || (playerColor === "black" && isWhiteTurn);

    if (isBotTurn) {
      setIsBotThinking(true);
      
      // Map bot rating (e.g. 600-2500) to Stockfish depth (1 to 20)
      const depth = Math.max(1, Math.min(20, Math.floor((selectedBot.rating - 400) / 100)));
      
      // Add slight artificial delay so it doesn't move instantly
      const thinkTime = Math.random() * 1000 + 500;
      
      setTimeout(() => {
        getBestMove(position, depth)
          .then((bestMove) => {
            if (bestMove) {
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
  }, [turn, selectedBot, playerColor, isGameOver, isReady, position, makeMove, getBestMove, isBotThinking]);

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8 relative">
      {/* Board Area */}
      <div className="flex-1 flex flex-col gap-4 max-w-[700px] mx-auto w-full">
        {selectedBot && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#141416] border border-[#2a2a30] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="text-3xl bg-[#1a1a1f] w-12 h-12 flex items-center justify-center rounded-lg border border-[#2a2a30]">
                {selectedBot.avatar}
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  {selectedBot.name}
                  <span className="text-xs bg-[#81b64c]/20 text-[#81b64c] px-2 py-0.5 rounded-full">
                    Bot
                  </span>
                </div>
                <div className="text-sm text-[#a0a0a8]">
                  {selectedBot.rating} Rating • {selectedBot.style}
                </div>
              </div>
            </div>
            {isBotThinking && (
              <div className="text-sm text-[#a0a0a8] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#81b64c] rounded-full animate-ping"></span>
                Thinking...
              </div>
            )}
          </div>
        )}

        <div className="w-full aspect-[1/1] relative shadow-elevated">
          <Board 
            position={position} 
            onPieceDrop={handlePieceDrop}
            boardOrientation={playerColor}
            arePiecesDraggable={!isBotThinking && !isGameOver}
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-3 bg-[#141416] border border-[#2a2a30] rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-[#81b64c] flex items-center justify-center text-xl font-bold text-white">
            You
          </div>
          <div>
            <div className="font-bold text-white">Guest Player</div>
            <div className="text-sm text-[#a0a0a8]">1200 Rating</div>
          </div>
        </div>
      </div>

      {/* Right Column: Moves & Controls */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4 h-full">
        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-[#81b64c] hover:bg-[#9fcc6b] text-white py-3 rounded-xl font-semibold transition-colors shadow-elevated"
          >
            New Game
          </button>
          <button className="px-4 bg-[#2a2a30] hover:bg-[#3a3a42] text-white rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
          </button>
        </div>

        <MoveList 
          moves={history.map(m => ({ san: m.san }))} 
          currentMoveIndex={history.length - 1}
          onMoveClick={() => {}}
        />
      </div>

      {/* Bot Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#111113] border border-[#2a2a30] rounded-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[#2a2a30] flex items-center justify-between bg-[#1a1a1f]">
                <h2 className="text-2xl font-bold text-white">Choose Your Opponent</h2>
                <button 
                  onClick={() => selectedBot && setIsModalOpen(false)}
                  className="text-[#6b6b75] hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BOT_PERSONALITIES.map(bot => (
                  <button
                    key={bot.id}
                    onClick={() => handleStartGame(bot, "white")}
                    className="flex flex-col items-center text-center p-6 bg-[#141416] border border-[#2a2a30] rounded-xl hover:bg-[#1a1a1f] hover:border-[#81b64c]/50 transition-all group"
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {bot.avatar}
                    </div>
                    <div className="text-lg font-bold text-white mb-1">{bot.name}</div>
                    <div className="text-[#81b64c] text-sm font-semibold mb-3">{bot.rating} • {bot.style}</div>
                    <div className="text-xs text-[#a0a0a8]">{bot.description}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
