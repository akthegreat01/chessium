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

  const { settings, updateSetting } = useSettings();
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

  // Speech synthesis voices and narration controls
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const lastSpokenTextRef = useRef("");

  // Deep mysterious voice controls
  const [narratorPitch, setNarratorPitch] = useState<number>(0.6);
  const [narratorRate, setNarratorRate] = useState<number>(0.75);
  const [showNarratorControls, setShowNarratorControls] = useState(false);

  // Typewriter states
  const [displayedDialogue, setDisplayedDialogue] = useState("");

  // Game reactions
  const [isShaking, setIsShaking] = useState(false);

  const triggerBlunderShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Load custom pitch/rate on mount
  useEffect(() => {
    const storedPitch = localStorage.getItem("chessium_narrator_pitch");
    const storedRate = localStorage.getItem("chessium_narrator_rate");
    if (storedPitch) setNarratorPitch(parseFloat(storedPitch));
    if (storedRate) setNarratorRate(parseFloat(storedRate));
  }, []);

  const updateNarratorPitch = (val: number) => {
    setNarratorPitch(val);
    localStorage.setItem("chessium_narrator_pitch", val.toString());
  };

  const updateNarratorRate = (val: number) => {
    setNarratorRate(val);
    localStorage.setItem("chessium_narrator_rate", val.toString());
  };

  // Typewriter effect handler
  useEffect(() => {
    setDisplayedDialogue("");
    if (!dialogueText) return;

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedDialogue((prev) => prev + dialogueText.charAt(index));
      index++;
      if (index >= dialogueText.length) {
        clearInterval(interval);
      }
    }, 20); // 20ms per character typewriter pace

    return () => clearInterval(interval);
  }, [dialogueText]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  const speakDialogueText = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (!settings.narrationEnabled || status === "intro") return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Deep mysterious override
    utterance.pitch = narratorPitch;
    utterance.rate = narratorRate;

    const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
    if (englishVoices.length > 0) {
      const ukVoices = englishVoices.filter(
        (v) =>
          v.lang.includes("GB") ||
          v.name.toLowerCase().includes("uk") ||
          v.name.toLowerCase().includes("great britain")
      );

      const maleKeywords = [
        "male",
        "david",
        "george",
        "daniel",
        "rishi",
        "google uk english male",
        "arthur",
        "microsoft david",
        "steve",
        "oliver",
      ];

      const candidateVoices = ukVoices.length > 0 ? ukVoices : englishVoices;
      const matchedVoice = candidateVoices.find((v) =>
        maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      } else if (candidateVoices.length > 0) {
        utterance.voice = candidateVoices[0];
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (status === "intro" || !dialogueText) return;

    if (settings.narrationEnabled) {
      speakDialogueText(dialogueText);
      lastSpokenTextRef.current = dialogueText;
    } else {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      lastSpokenTextRef.current = "";
    }
  }, [dialogueText, status, settings.narrationEnabled, narratorPitch, narratorRate, voices.length > 0]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
            triggerBlunderShake();
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
      triggerBlunderShake();
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
        triggerBlunderShake();
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

        {/* Board Container with horror shake and blood effects */}
        <div className={`w-full relative shadow-elevated rounded-2xl overflow-hidden border border-[#2a2a30] max-w-[550px] aspect-square bg-[#0a0a0b] ${isShaking ? "animate-story-shake" : ""}`}>
          <Board
            position={position}
            boardOrientation={playerColor}
            onPieceDrop={handlePieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={optionSquares}
            arePiecesDraggable={status === "playing" && !isBotThinking && !isGameOver}
            theme={settings.boardTheme}
          />

          {/* Dripping blood horror overlay */}
          {isPoisoned && (
            <div className="absolute inset-0 bg-[#600302]/40 pointer-events-none z-10 transition-opacity duration-1000">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-[#ca3431]/30 animate-pulse pointer-events-none" />
              <div className="absolute inset-x-0 top-0 bg-[#ca3431] opacity-70 pointer-events-none" style={{ height: "6px" }} />
              <div className="absolute top-0 left-[20%] w-[2px] h-[60px] bg-[#600302] rounded-full animate-story-drip" style={{ animationDelay: "0.2s" }} />
              <div className="absolute top-0 left-[45%] w-[3px] h-[90px] bg-[#ca3431] rounded-full animate-story-drip" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-0 left-[75%] w-[2px] h-[40px] bg-[#600302] rounded-full animate-story-drip" style={{ animationDelay: "0.9s" }} />
            </div>
          )}

          {/* Intro Screen Overlay */}
          {status === "intro" && (
            <div className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              <img 
                src={chapter.imagePath} 
                alt={chapter.suspectName}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-[#ca3431]/40 mb-4 shadow-elevated"
              />
              <h2 className="text-2xl font-black text-white mb-2">{chapter.suspectName}</h2>
              <p className="text-[#a0a0a8] text-sm max-w-sm mb-6 leading-relaxed">
                {chapter.description}
              </p>
              <button
                onClick={handleStartMatch}
                className="bg-[#ca3431] hover:bg-[#e24e4a] text-white font-bold px-8 py-3 rounded-xl transition-all shadow-elevated"
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
            <img 
              src={chapter.imagePath} 
              alt={chapter.suspectName}
              className="w-10 h-10 rounded-xl object-cover border border-[#2a2a30] shadow-inner select-none"
            />
            <div>
              <h3 className="font-bold text-white text-sm">{chapter.suspectName}</h3>
              <span className="text-[10px] text-[#ca3431] font-black uppercase tracking-wider">
                {isBotThinking ? "Typing..." : "Confronting"}
              </span>
            </div>
            
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setShowNarratorControls(!showNarratorControls)}
                className={`p-2 rounded-lg transition-colors ${showNarratorControls ? "text-[#ca3431] bg-white/5" : "text-[#a0a0a8] hover:text-white hover:bg-white/5"}`}
                title="Narration Pitch & Speed Settings"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={() => updateSetting("narrationEnabled", !settings.narrationEnabled)}
                className="p-2 rounded-lg text-[#a0a0a8] hover:text-white hover:bg-white/5 transition-colors"
                title={settings.narrationEnabled ? "Mute Narration" : "Unmute Narration"}
                aria-label={settings.narrationEnabled ? "Mute Narration" : "Unmute Narration"}
              >
                {settings.narrationEnabled ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#ca3431]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Narrator customized control panel drawer */}
          {showNarratorControls && (
            <div className="bg-[#0a0a0b] border border-[#2a2a30] rounded-xl p-3 mb-4 space-y-3 text-xs text-left">
              <div className="flex justify-between items-center text-[#a0a0a8] font-bold">
                <span>Narrator Tuning</span>
                <button 
                  onClick={() => {
                    updateNarratorPitch(0.6);
                    updateNarratorRate(0.75);
                  }}
                  className="text-[10px] text-[#ca3431] hover:underline"
                >
                  Reset Deep
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#a0a0a8]">Pitch: {narratorPitch.toFixed(2)}</span>
                  <span className="text-[10px] text-[#6b6b75]">{narratorPitch < 0.8 ? "Deep Voice" : "Standard"}</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.5"
                  step="0.05"
                  value={narratorPitch}
                  onChange={(e) => updateNarratorPitch(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#141416] rounded-lg appearance-none cursor-pointer accent-[#ca3431]"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#a0a0a8]">Speed: {narratorRate.toFixed(2)}x</span>
                  <span className="text-[10px] text-[#6b6b75]">{narratorRate < 0.9 ? "Ominous & Slow" : "Fast"}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={narratorRate}
                  onChange={(e) => updateNarratorRate(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#141416] rounded-lg appearance-none cursor-pointer accent-[#ca3431]"
                />
              </div>
            </div>
          )}

          {/* Chat text box */}
          <div className="flex-1 flex flex-col justify-center text-center p-3 bg-[#0a0a0b] border border-[#2a2a30] rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 text-3xl opacity-10 text-[#ca3431] p-2 select-none">“</div>
            <p className="text-sm font-medium text-white italic leading-relaxed z-10 px-2 min-h-[60px] font-mono">
              {displayedDialogue}
            </p>
            <div className="absolute bottom-0 right-0 text-3xl opacity-10 text-[#ca3431] p-2 rotate-180 select-none">“</div>
          </div>
        </div>

        {/* Global style overrides for custom animations */}
        <style>{`
          @keyframes story-shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-story-shake {
            animation: story-shake 0.4s ease-in-out;
          }
          @keyframes story-drip {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(500%); opacity: 0; }
          }
          .animate-story-drip {
            animation: story-drip 2.2s infinite linear;
          }
        `}</style>

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
