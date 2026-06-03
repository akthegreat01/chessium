"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Board from "@/components/chess/Board";
import MoveList from "@/components/chess/MoveList";
import { STORY_CHAPTERS, StoryChapter } from "@/lib/chess/story-data";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import { useSettings } from "@/contexts/SettingsContext";
import { playMoveSound } from "@/lib/audio";
import { motion, AnimatePresence } from "motion/react";

interface PageProps {
  params: Promise<{ chapterId: string }>;
}

export default function StoryGamePage({ params }: PageProps) {
  const { chapterId } = use(params);
  const router = useRouter();

  const chapter = STORY_CHAPTERS.find((ch) => ch.id === chapterId);

  if (!chapter) {
    return (
      <div className="text-center p-12 text-[#a0a0a8]">
        <h2 className="text-2xl font-bold text-white mb-2">Chapter Not Found</h2>
        <Link href="/story" className="text-[#81b64c] hover:underline">
          Return to Story Mode
        </Link>
      </div>
    );
  }

  const { settings } = useSettings();
  const { game, position, history, makeMove, isGameOver, turn, resetGame } = useChessGame();
  const { isReady, getBestMove, sendCommand } = useStockfish();

  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [status, setStatus] = useState<"intro" | "playing" | "solved" | "failed">("intro");
  const [dialogueText, setDialogueText] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isPoisoned, setIsPoisoned] = useState(false);

  // Click-to-move states
  const [moveFrom, setMoveFrom] = useState<string | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});

  // Track the history length to trigger dialogue lines based on move count
  const prevHistoryLengthRef = useRef(0);

  // Configure starting FEN and initial color on mount
  useEffect(() => {
    resetGame();
    // Load custom FEN if defined (like Chapter 4)
    if (chapter.startingFen && chapter.startingFen !== "start") {
      try {
        game.load(chapter.startingFen);
      } catch (e) {
        console.error("Failed to load starting FEN", e);
      }
    }
    
    const opponentColor = chapter.opponentColor;
    const playerCol = opponentColor === "white" ? "black" : "white";
    setPlayerColor(playerCol);

    // Initial dialogue
    const loadLine = chapter.dialogue.find((d) => d.trigger === "onLoad");
    setDialogueText(loadLine ? loadLine.text : "Let's play.");
  }, [chapterId]);

  // Configure Stockfish limits based on ELO when engine is ready
  useEffect(() => {
    if (isReady && status === "playing") {
      sendCommand("setoption name UCI_LimitStrength value true");
      sendCommand(`setoption name UCI_Elo value ${chapter.rating}`);
    }
  }, [isReady, status, chapter.rating]);

  // Play sound on move changes
  useEffect(() => {
    if (history.length > 0) {
      const lastMove = history[history.length - 1];
      playMoveSound(lastMove.san.includes("x"), settings.soundEnabled);
    }
  }, [history.length, settings.soundEnabled]);

  // Watch for bot turn to make engine play
  useEffect(() => {
    if (status !== "playing" || isGameOver || isBotThinking || !isReady) return;

    const isBotTurn = (playerColor === "white" && turn === "b") || (playerColor === "black" && turn === "w");
    if (!isBotTurn) return;

    setIsBotThinking(true);
    // Short artificial delay to make it feel natural
    setTimeout(async () => {
      try {
        const bestMove = await getBestMove(game.fen(), 8);
        if (bestMove) {
          const from = bestMove.substring(0, 2);
          const to = bestMove.substring(2, 4);
          const promotion = bestMove.length > 4 ? bestMove[4] : undefined;

          makeMove({ from, to, promotion });
        }
      } catch (e) {
        console.error("Bot failed to make move", e);
      } finally {
        setIsBotThinking(false);
      }
    }, 1000);
  }, [turn, status, isGameOver, isReady, playerColor, isBotThinking]);

  // Game over check and dialog updater
  useEffect(() => {
    if (status !== "playing") return;

    // Check dialogue triggers based on move counts
    if (history.length !== prevHistoryLengthRef.current) {
      prevHistoryLengthRef.current = history.length;
      
      const isBotMove = (playerColor === "white" && turn === "w") || (playerColor === "black" && turn === "b");

      // Bot trash talk / dialogue updates
      const dialogueLine = chapter.dialogue.find((d) => d.moveNumber === history.length);
      if (dialogueLine) {
        setDialogueText(dialogueLine.text);
      } else if (history.length > 0 && isBotMove) {
        // Trigger blunder dialog if the bot just captured a piece
        const lastMove = history[history.length - 1];
        if (lastMove && lastMove.san.includes("x")) {
          const blunderLine = chapter.dialogue.find((d) => d.trigger === "onBlunder");
          if (blunderLine) {
            setDialogueText(blunderLine.text);
          }
        }
      }
    }

    if (isGameOver) {
      const isDraw = game.isDraw() || game.isStalemate() || game.isThreefoldRepetition();
      const userWon = game.isCheckmate() && (
        (playerColor === "white" && turn === "b") || 
        (playerColor === "black" && turn === "w")
      );

      if (userWon) {
        setStatus("solved");
        const winLine = chapter.dialogue.find((d) => d.trigger === "onWin");
        setDialogueText(winLine ? winLine.text : "You won.");
        // Save progress to local storage
        localStorage.setItem(`chessium_story_completed_${chapter.id}`, "true");
      } else if (isDraw) {
        setStatus("failed");
        setDialogueText("The game ended in a draw. The mystery requires a decisive victory.");
      } else {
        // User lost
        setStatus("failed");
        const lossLine = chapter.dialogue.find((d) => d.trigger === "onLoss");
        setDialogueText(lossLine ? lossLine.text : "You were defeated.");
      }
    }
  }, [isGameOver, history.length, status, turn, playerColor]);

  // Move validation interceptor (specifically for Chapter 4 Poisoned Queen capture)
  const handlePieceDrop = (source: string, target: string, piece: string) => {
    if (status !== "playing" || isBotThinking || isGameOver) return false;

    // Turn control check
    const isWhiteTurn = turn === "w";
    if ((playerColor === "white" && !isWhiteTurn) || (playerColor === "black" && isWhiteTurn)) {
      return false;
    }

    const targetPiece = game.get(target as any);

    // Poisoned Queen check (Chapter 4)
    if (chapter.id === "chapter-4" && targetPiece && targetPiece.type === "q" && targetPiece.color === "b") {
      setIsPoisoned(true);
      setStatus("failed");
      const lossLine = chapter.dialogue.find((d) => d.trigger === "onLoss");
      setDialogueText(lossLine ? lossLine.text : "You fell for the poisoned piece trap.");
      return false;
    }

    const isPawn = piece[1]?.toLowerCase() === "p";
    const isBackRank = target[1] === "8" || target[1] === "1";
    const promotion = (isPawn && isBackRank) ? "q" : undefined;

    const move = makeMove({
      from: source,
      to: target,
      promotion: promotion,
    });

    if (move) {
      setMoveFrom(null);
      setOptionSquares({});
      return true;
    }
    return false;
  };

  const onSquareClick = (square: string) => {
    if (status !== "playing" || isBotThinking || isGameOver) return;

    const isWhiteTurn = turn === "w";
    if ((playerColor === "white" && !isWhiteTurn) || (playerColor === "black" && isWhiteTurn)) {
      return;
    }

    if (!moveFrom) {
      const piece = game.get(square as any);
      if (piece && piece.color === turn) {
        const moves = game.moves({ square: square as any, verbose: true });
        if (moves.length === 0) return;

        setMoveFrom(square);
        const newOptionSquares: Record<string, any> = {};
        moves.forEach((m) => {
          const targetPiece = game.get(m.to as any);
          newOptionSquares[m.to] = {
            background:
              targetPiece && targetPiece.color !== piece.color
                ? "radial-gradient(circle, rgba(0,0,0,.4) 85%, transparent 85%)"
                : "radial-gradient(circle, rgba(0,0,0,.4) 25%, transparent 25%)",
            borderRadius: "50%",
          };
        });
        newOptionSquares[square] = { background: "rgba(255, 255, 0, 0.4)" };
        setOptionSquares(newOptionSquares);
      }
      return;
    }

    const piece = game.get(moveFrom as any);
    if (!piece) {
      setMoveFrom(null);
      setOptionSquares({});
      return;
    }

    const moves = game.moves({ square: moveFrom as any, verbose: true });
    const foundMove = moves.find((m: any) => m.to === square);

    if (foundMove) {
      const targetPiece = game.get(square as any);
      
      // Poisoned Queen check (Chapter 4 click-to-move)
      if (chapter.id === "chapter-4" && targetPiece && targetPiece.type === "q" && targetPiece.color === "b") {
        setIsPoisoned(true);
        setStatus("failed");
        const lossLine = chapter.dialogue.find((d) => d.trigger === "onLoss");
        setDialogueText(lossLine ? lossLine.text : "You fell for the poisoned piece trap.");
        setMoveFrom(null);
        setOptionSquares({});
        return;
      }

      makeMove({
        from: moveFrom,
        to: square,
        promotion: foundMove.promotion,
      });
      setMoveFrom(null);
      setOptionSquares({});
    } else {
      const clickedPiece = game.get(square as any);
      if (clickedPiece && clickedPiece.color === turn && square !== moveFrom) {
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
              targetPiece && targetPiece.color !== clickedPiece.color
                ? "radial-gradient(circle, rgba(0,0,0,.4) 85%, transparent 85%)"
                : "radial-gradient(circle, rgba(0,0,0,.4) 25%, transparent 25%)",
            borderRadius: "50%",
          };
        });
        newOptionSquares[square] = { background: "rgba(255, 255, 0, 0.4)" };
        setOptionSquares(newOptionSquares);
      } else {
        setMoveFrom(null);
        setOptionSquares({});
      }
    }
  };

  const handleStartMatch = () => {
    setStatus("playing");
    // Trigger onFirstMove if defined
    const firstMoveLine = chapter.dialogue.find((d) => d.trigger === "onFirstMove");
    if (firstMoveLine) {
      setDialogueText(firstMoveLine.text);
    }
  };

  const handleRetryMatch = () => {
    setIsPoisoned(false);
    resetGame();
    if (chapter.startingFen && chapter.startingFen !== "start") {
      try {
        game.load(chapter.startingFen);
      } catch {}
    }
    setStatus("playing");
    const loadLine = chapter.dialogue.find((d) => d.trigger === "onLoad");
    setDialogueText(loadLine ? loadLine.text : "Let's begin again.");
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8 relative">
      {/* Left side: Chess Board */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px] items-center justify-center">
        {/* Navigation back link */}
        <div className="w-full flex justify-between items-center px-2">
          <Link href="/story" className="text-[#81b64c] hover:underline text-sm font-semibold">
            ← Suspect Dossiers
          </Link>
          <div className="text-white text-xs font-medium uppercase tracking-widest bg-[#141416] px-3 py-1.5 rounded-full border border-[#2a2a30]">
            {chapter.title}
          </div>
        </div>

        {/* Board Container */}
        <div className="w-full relative shadow-elevated rounded-2xl overflow-hidden border border-[#2a2a30] max-w-[550px] aspect-square bg-[#0a0a0b]">
          <Board
            position={position}
            boardOrientation={playerColor}
            onPieceDrop={handlePieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={optionSquares}
            arePiecesDraggable={status === "playing" && !isBotThinking && !isGameOver}
            theme={settings.boardTheme}
          />

          {/* Intro Screen Overlay */}
          {status === "intro" && (
            <div className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="text-6xl mb-4 select-none">{chapter.avatar}</div>
              <h2 className="text-2xl font-black text-white mb-2">{chapter.suspectName}</h2>
              <p className="text-[#a0a0a8] text-sm max-w-sm mb-6 leading-relaxed">
                {chapter.description}
              </p>
              <button
                onClick={handleStartMatch}
                className="bg-[#81b64c] hover:bg-[#9fcc6b] text-white font-bold px-8 py-3 rounded-xl transition-all shadow-elevated"
              >
                Begin Confrontation
              </button>
            </div>
          )}

          {/* Solver Win Overlay */}
          {status === "solved" && (
            <div className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="text-6xl mb-4 select-none">🔑</div>
              <h2 className="text-3xl font-black text-[#81b64c] mb-2">Lead Solved!</h2>
              <p className="text-white font-bold text-sm mb-1 uppercase tracking-wider">{chapter.clueTitle}</p>
              <p className="text-[#a0a0a8] text-xs max-w-sm mb-6 leading-relaxed">
                {chapter.clueDescription}
              </p>
              <div className="flex gap-4 w-full max-w-xs">
                <Link
                  href="/story"
                  className="flex-1 bg-[#2a2a30] hover:bg-[#3a3a42] text-white py-3 rounded-xl text-sm font-bold border border-[#2a2a30] text-center"
                >
                  Notebook
                </Link>
                {chapterId !== "chapter-4" ? (
                  <button
                    onClick={() => {
                      const nextIndex = STORY_CHAPTERS.findIndex(c => c.id === chapterId) + 1;
                      if (nextIndex < STORY_CHAPTERS.length) {
                        router.push(`/story/${STORY_CHAPTERS[nextIndex].id}`);
                      }
                    }}
                    className="flex-1 bg-[#81b64c] hover:bg-[#9fcc6b] text-white py-3 rounded-xl text-sm font-bold text-center"
                  >
                    Next Lead
                  </button>
                ) : (
                  <div className="flex-1 bg-[#81b64c]/20 text-[#81b64c] py-3 rounded-xl text-xs font-black flex items-center justify-center border border-[#81b64c]/30">
                    MYSTERY SOLVED
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Failed Overlay (Includes custom poison twist screen) */}
          {status === "failed" && (
            <div className="absolute inset-0 bg-[#0a0a0b]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              {isPoisoned ? (
                <>
                  <div className="text-6xl mb-4 select-none animate-bounce">💀</div>
                  <h2 className="text-3xl font-black text-[#ca3431] mb-2 uppercase tracking-wide">Contact Poisoned!</h2>
                  <p className="text-white text-sm max-w-xs mb-6 leading-relaxed">
                    You captured the ebony Black Queen. Toxin absorbs through your fingertips. You collapse into darkness...
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4 select-none">❌</div>
                  <h2 className="text-2xl font-black text-[#ca3431] mb-2">Confrontation Failed</h2>
                  <p className="text-[#a0a0a8] text-sm max-w-xs mb-6 leading-relaxed">
                    You were defeated by the suspect. To extract the truth, you must checkmate them.
                  </p>
                </>
              )}
              <div className="flex gap-4 w-full max-w-xs">
                <Link
                  href="/story"
                  className="flex-1 bg-[#2a2a30] hover:bg-[#3a3a42] text-white py-3 rounded-xl text-sm font-bold border border-[#2a2a30] text-center"
                >
                  Withdraw
                </Link>
                <button
                  onClick={handleRetryMatch}
                  className="flex-1 bg-[#ca3431] hover:bg-[#e24e4a] text-white py-3 rounded-xl text-sm font-bold"
                >
                  Retry Lead
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Dialogue Chat Panel & Moves */}
      <div className="w-full lg:w-[360px] flex flex-col gap-4 min-h-0">
        
        {/* Dialogue Chat Box */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-5 shadow-elevated flex flex-col flex-1 min-h-[200px]">
          <div className="flex items-center gap-3 border-b border-[#2a2a30] pb-3 mb-4">
            <div className="w-10 h-10 bg-[#1a1a1f] border border-[#2a2a30] rounded-xl flex items-center justify-center text-2xl select-none">
              {chapter.avatar}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{chapter.suspectName}</h3>
              <span className="text-[10px] text-[#81b64c] font-black uppercase tracking-wider">
                {isBotThinking ? "Typing..." : "Confronting"}
              </span>
            </div>
          </div>

          {/* Chat text box */}
          <div className="flex-1 flex flex-col justify-center text-center p-3 bg-[#0a0a0b] border border-[#2a2a30] rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 text-3xl opacity-10 text-[#81b64c] p-2 select-none">“</div>
            <p className="text-sm font-medium text-white italic leading-relaxed z-10 px-2">
              {dialogueText}
            </p>
            <div className="absolute bottom-0 right-0 text-3xl opacity-10 text-[#81b64c] p-2 rotate-180 select-none">“</div>
          </div>
        </div>

        {/* Moves Logger */}
        <div className="h-[220px] flex flex-col shrink-0">
          <div className="text-xs text-[#a0a0a8] font-bold uppercase tracking-wider mb-2 px-1">Game History</div>
          <MoveList
            moves={history.map((m) => ({ san: m.san }))}
            currentMoveIndex={history.length - 1}
            onMoveClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
