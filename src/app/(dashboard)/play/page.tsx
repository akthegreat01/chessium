"use client";

import { useState, useEffect } from "react";
import Board from "@/components/chess/Board";
import { BOT_PERSONALITIES, BotPersonality } from "@/lib/chess/bot";
import { motion, AnimatePresence } from "motion/react";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import MoveList from "@/components/chess/MoveList";
import { useSettings } from "@/contexts/SettingsContext";

import { useRouter } from "next/navigation";

export default function PlayPage() {
  const [selectedBot, setSelectedBot] = useState<BotPersonality | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [colorPreference, setColorPreference] = useState<"white" | "black" | "random">("white");
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [moveFrom, setMoveFrom] = useState<string | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});
  const [visualOrientation, setVisualOrientation] = useState<"white" | "black">("white");
  const { settings, updateSettings } = useSettings();
  const router = useRouter();
  
  const { game, position, history, makeMove, isGameOver, turn } = useChessGame();
  const { isReady, getBestMove, evaluatePosition } = useStockfish();

  const handleStartGame = (bot: BotPersonality, color: "white" | "black" | "random") => {
    setSelectedBot(bot);
    const chosenColor = color === "random" ? (Math.random() > 0.5 ? "white" : "black") : color;
    setPlayerColor(chosenColor);
    setVisualOrientation(chosenColor);
    setIsModalOpen(false);
  };

  const handleReviewGame = () => {
    localStorage.setItem("chessium_review_pgn", game.pgn());
    router.push("/analysis");
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

  const onSquareClick = (square: string) => {
    if (isGameOver || isBotThinking) return;

    // Only allow interacting if it's the player's turn
    const isWhiteTurn = turn === 'w';
    if ((playerColor === "white" && !isWhiteTurn) || (playerColor === "black" && isWhiteTurn)) {
      return;
    }

    // If we haven't selected a piece to move yet
    if (!moveFrom) {
      const piece = game.get(square as any);
      if (piece && piece.color === turn) {
        // Get valid moves for this piece
        const moves = game.moves({ square: square as any, verbose: true });
        if (moves.length === 0) return;

        setMoveFrom(square);
        
        // Highlight possible moves
        const newOptionSquares: Record<string, any> = {};
        moves.forEach((m) => {
          const targetPiece = game.get(m.to as any);
          newOptionSquares[m.to] = {
            background:
              targetPiece && targetPiece.color !== piece.color
                ? "radial-gradient(circle, rgba(0,0,0,.4) 85%, transparent 85%)"
                : "radial-gradient(circle, rgba(0,0,0,.4) 25%, transparent 25%)",
            borderRadius: "50%"
          };
        });
        // Highlight the selected square
        newOptionSquares[square] = {
          background: "rgba(255, 255, 0, 0.4)",
        };
        setOptionSquares(newOptionSquares);
      }
      return;
    }

    // We already have a moveFrom square, so try to make the move
    const moves = game.moves({ square: moveFrom as any, verbose: true });
    const foundMove = moves.find((m) => m.to === square);

    if (foundMove) {
      // It's a valid move
      makeMove({
        from: moveFrom,
        to: square,
        promotion: foundMove.promotion,
      });
      // Reset state
      setMoveFrom(null);
      setOptionSquares({});
      return;
    }

    // If they clicked an invalid square, or another piece
    const piece = game.get(square as any);
    if (piece && piece.color === turn && square !== moveFrom) {
      // They selected a different piece of their own color
      const newMoves = game.moves({ square: square as any, verbose: true });
      if (newMoves.length === 0) {
        setMoveFrom(null);
        setOptionSquares({});
        return;
      }
      setMoveFrom(square);
      
      const newOptionSquares: Record<string, any> = {};
      newMoves.forEach((m) => {
        const targetPiece = game.get(m.to as any);
        newOptionSquares[m.to] = {
          background:
            targetPiece && targetPiece.color !== piece.color
              ? "radial-gradient(circle, rgba(0,0,0,.4) 85%, transparent 85%)"
              : "radial-gradient(circle, rgba(0,0,0,.4) 25%, transparent 25%)",
          borderRadius: "50%"
        };
      });
      newOptionSquares[square] = {
        background: "rgba(255, 255, 0, 0.4)",
      };
      setOptionSquares(newOptionSquares);
    } else {
      // They clicked an invalid square or the same square to deselect
      setMoveFrom(null);
      setOptionSquares({});
    }
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
            {isGameOver && (
              <div className="text-sm font-bold text-white bg-[#2a2a30] px-3 py-1 rounded-lg">
                Game Over
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-2">
          <select 
            value={settings.boardTheme}
            onChange={(e) => updateSettings({ boardTheme: e.target.value as any })}
            className="bg-[#141416] border border-[#2a2a30] text-[#a0a0a8] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#81b64c]"
          >
            <option value="green">Green</option>
            <option value="classic">Classic</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="neon">Neon</option>
          </select>
          <button 
            onClick={() => setVisualOrientation(prev => prev === "white" ? "black" : "white")}
            className="bg-[#141416] border border-[#2a2a30] text-[#a0a0a8] hover:text-white rounded-lg p-1.5 transition-colors"
            title="Flip Board"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        <div className="w-full aspect-[1/1] relative shadow-elevated">
          <Board 
            position={position} 
            onPieceDrop={handlePieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={optionSquares}
            boardOrientation={visualOrientation}
            arePiecesDraggable={!isBotThinking && !isGameOver}
            theme={settings.boardTheme}
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
          
          <AnimatePresence>
            {isGameOver && (
              <motion.button
                initial={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0 }}
                animate={{ opacity: 1, width: "auto", paddingLeft: 16, paddingRight: 16 }}
                exit={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0 }}
                onClick={handleReviewGame}
                className="overflow-hidden whitespace-nowrap bg-[#2a2a30] hover:bg-[#3a3a42] text-white py-3 rounded-xl font-semibold transition-colors shadow-elevated flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Review Game
              </motion.button>
            )}
          </AnimatePresence>
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
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#6b6b75] hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-4 border-b border-[#2a2a30] bg-[#111113] flex items-center gap-4 justify-center">
                <span className="text-[#a0a0a8] text-sm font-medium">I play as:</span>
                <div className="flex bg-[#1a1a1f] rounded-lg p-1 border border-[#2a2a30]">
                  {(['white', 'random', 'black'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setColorPreference(c)}
                      className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors capitalize ${
                        colorPreference === c 
                          ? 'bg-[#2a2a30] text-white shadow-sm' 
                          : 'text-[#6b6b75] hover:text-[#a0a0a8]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BOT_PERSONALITIES.map(bot => (
                  <button
                    key={bot.id}
                    onClick={() => handleStartGame(bot, colorPreference)}
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
