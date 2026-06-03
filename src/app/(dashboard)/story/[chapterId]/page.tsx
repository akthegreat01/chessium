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

type DialogueNode = "intro_greeting" | "choice_question" | "choice_threat" | "final_confrontation";

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

  // Typewriter and Visual Novel State
  const [displayedDialogue, setDisplayedDialogue] = useState("");
  const [dialogueNode, setDialogueNode] = useState<DialogueNode>("intro_greeting");
  const [showNarratorControls, setShowNarratorControls] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Deep mysterious voice parameters
  const [narratorPitch, setNarratorPitch] = useState<number>(0.6);
  const [narratorRate, setNarratorRate] = useState<number>(0.75);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const lastSpokenTextRef = useRef("");
  const prevHistoryLengthRef = useRef(0);

  // Load narrator custom speed/pitch on mount
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

  const triggerBlunderShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Configure starting FEN and initial color on mount
  useEffect(() => {
    resetGame();
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

    // Initial Dialogue Node Setup
    setDialogueNode("intro_greeting");
    const loadLine = chapter.dialogue.find((d) => d.trigger === "onLoad");
    setDialogueText(loadLine ? loadLine.text : "Let's play.");
  }, [chapterId]);

  // Voice synthesis listing
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
    // Do not speak during intro choice nodes if sound isn't fully ready
    if (!settings.narrationEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
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

  // Narration triggers on text updates
  useEffect(() => {
    if (!dialogueText) return;

    if (settings.narrationEnabled) {
      speakDialogueText(dialogueText);
      lastSpokenTextRef.current = dialogueText;
    } else {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      lastSpokenTextRef.current = "";
    }
  }, [dialogueText, settings.narrationEnabled, narratorPitch, narratorRate, voices.length > 0]);

  // Clean voices on exit
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Typewriter animation hook
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
    }, 20); // 20ms typewriter spacing

    return () => clearInterval(interval);
  }, [dialogueText]);

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

    if (history.length !== prevHistoryLengthRef.current) {
      prevHistoryLengthRef.current = history.length;
      
      const isBotMove = (playerColor === "white" && turn === "w") || (playerColor === "black" && turn === "b");

      const dialogueLine = chapter.dialogue.find((d) => d.moveNumber === history.length);
      if (dialogueLine) {
        setDialogueText(dialogueLine.text);
      } else if (history.length > 0 && isBotMove) {
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
        localStorage.setItem(`chessium_story_completed_${chapter.id}`, "true");
      } else if (isDraw) {
        setStatus("failed");
        setDialogueText("The game ended in a draw. The mystery requires a decisive victory.");
      } else {
        setStatus("failed");
        const lossLine = chapter.dialogue.find((d) => d.trigger === "onLoss");
        setDialogueText(lossLine ? lossLine.text : "You were defeated.");
      }
    }
  }, [isGameOver, history.length, status, turn, playerColor]);

  // Move validation interceptor (specifically for Chapter 4 Poisoned Queen capture)
  const handlePieceDrop = (source: string, target: string, piece: string) => {
    if (status !== "playing" || isBotThinking || isGameOver) return false;

    const isWhiteTurn = turn === "w";
    if ((playerColor === "white" && !isWhiteTurn) || (playerColor === "black" && isWhiteTurn)) {
      return false;
    }

    const targetPiece = game.get(target as any);

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
    const firstMoveLine = chapter.dialogue.find((d) => d.trigger === "onFirstMove");
    if (firstMoveLine) {
      setDialogueText(firstMoveLine.text);
    } else {
      setDialogueText("Let the chess confrontation begin.");
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
    setDialogueNode("intro_greeting");
    setStatus("intro");
    const loadLine = chapter.dialogue.find((d) => d.trigger === "onLoad");
    setDialogueText(loadLine ? loadLine.text : "Let's begin again.");
  };

  // Dialogue Node choice handlers
  const handleChoice = (node: DialogueNode, responseText: string) => {
    setDialogueNode(node);
    setDialogueText(responseText);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Visual Novel viewport (16:9 cinematic frame) */}
      <div className="w-full relative aspect-video bg-black rounded-3xl border border-[#2a2a30] overflow-hidden shadow-elevated flex flex-col md:flex-row">
        
        {/* Widescreen Location Backdrop Scene */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${chapter.sceneBgPath})` }}
        >
          {/* Dark atmospheric overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />
        </div>

        {/* Noir UI Floating Headers */}
        <Link 
          href="/story" 
          className="absolute top-4 left-4 z-30 bg-[#0c0c0e]/80 hover:bg-black text-[#ca3431] border border-[#ca3431]/20 hover:border-[#ca3431] px-4 py-2 rounded-xl text-xs font-black transition-all backdrop-blur-sm shadow-md"
        >
          ← Abort Case
        </Link>
        <div className="absolute top-4 right-4 z-30 bg-[#0c0c0e]/80 border border-[#2a2a30] text-[#a0a0a8] text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm shadow-md">
          {chapter.title}
        </div>

        {/* 2D Character Suspect Sprite Layer */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[45%] flex items-end justify-center pointer-events-none z-10">
          <img
            src={chapter.imagePath}
            alt={chapter.suspectName}
            className={`w-[240px] md:w-[320px] h-[340px] md:h-[450px] object-cover object-top transition-all duration-500 rounded-t-3xl border-t border-x border-[#ca3431]/20 shadow-elevated ${
              isBotThinking ? "brightness-75 scale-95" : "brightness-100 scale-100"
            } ${isShaking ? "animate-story-shake border-t-[#ca3431]" : ""}`}
          />
        </div>

        {/* Interactive Bottom Dialogue Deck */}
        <div className="absolute bottom-4 inset-x-4 h-[180px] bg-[#0c0c0e]/95 border border-[#2a2a30] rounded-2xl p-4 md:p-5 z-20 flex flex-col justify-between backdrop-blur-md shadow-elevated">
          
          {/* Deck Header */}
          <div className="flex justify-between items-center pb-2 border-b border-[#2a2a30]">
            <span className="bg-[#ca3431] text-white font-black text-[10px] md:text-xs uppercase px-2.5 py-1 rounded-md tracking-wider">
              {chapter.suspectName}
            </span>
            <div className="flex items-center gap-2">
              {/* Pitch/Speed Settings Cog */}
              <button
                onClick={() => setShowNarratorControls(!showNarratorControls)}
                className={`p-1.5 rounded-lg transition-colors ${showNarratorControls ? "text-[#ca3431] bg-white/5" : "text-[#a0a0a8] hover:text-white hover:bg-white/5"}`}
                title="Narration Tuning Settings"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Mute Narration Speaker */}
              <button
                onClick={() => updateSetting("narrationEnabled", !settings.narrationEnabled)}
                className="p-1.5 rounded-lg text-[#a0a0a8] hover:text-white hover:bg-white/5 transition-colors"
                title={settings.narrationEnabled ? "Mute Narration" : "Unmute Narration"}
              >
                {settings.narrationEnabled ? (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#ca3431]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Sliders */}
          {showNarratorControls && (
            <div className="absolute bottom-[185px] right-5 w-60 bg-[#0c0c0e]/95 border border-[#2a2a30] rounded-xl p-3 space-y-3 text-[10px] md:text-xs z-30 backdrop-blur-md shadow-elevated">
              <div className="flex justify-between items-center text-[#a0a0a8] font-bold">
                <span>Narrator Tuning</span>
                <button 
                  onClick={() => {
                    updateNarratorPitch(0.6);
                    updateNarratorRate(0.75);
                  }}
                  className="text-[9px] text-[#ca3431] hover:underline"
                >
                  Reset Deep
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#a0a0a8]">Pitch: {narratorPitch.toFixed(2)}</span>
                  <span className="text-[9px] text-[#6b6b75]">{narratorPitch < 0.8 ? "Deep" : "Standard"}</span>
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
                  <span className="text-[9px] text-[#6b6b75]">{narratorRate < 0.9 ? "Ominous" : "Fast"}</span>
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

          {/* Dialogue Text Box */}
          <div className="flex-1 flex flex-col justify-center py-1">
            <p className="text-[12px] md:text-sm font-semibold text-white italic leading-relaxed font-mono pl-3 border-l-2 border-[#ca3431]/40">
              {displayedDialogue}
            </p>
          </div>

          {/* Interactive Dialogue Choices / Action panel */}
          <div className="flex gap-2 justify-end items-center mt-1">
            {status === "intro" && (
              <>
                {dialogueNode === "intro_greeting" && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
                    <button
                      onClick={() => handleChoice(
                        "choice_threat", 
                        chapter.id === "chapter-1" 
                          ? "I am Aaron Kosminski! You think you are Abberline of the Yard, but here you are nothing but meat for the grinder. Play chess or I'll slice you!"
                          : chapter.id === "chapter-2"
                          ? "Insolence, Inspector. We clean the royal crown with surgical precision. Play, or I will excise you from the script."
                          : chapter.id === "chapter-3"
                          ? "Hahaha! Accuses? Paint splatters are the drawings of the shadow itself! He whispers, I paint. Do you want to be my next canvas?"
                          : "I am Jack the Ripper. The Whispering King of the slums. I have set the coordinate traps. Take my Queen, Abberline. Take it!"
                      )}
                      className="bg-[#2a2a30] hover:bg-red-950 text-white font-bold text-[10px] md:text-xs py-2 px-4 rounded-xl border border-[#2a2a30] hover:border-[#ca3431]/40 transition-all text-left"
                    >
                      [Accuse them of the killings]
                    </button>
                    <button
                      onClick={() => handleChoice(
                        "choice_question",
                        chapter.id === "chapter-1"
                          ? "The physician Gull... Sir William Gull... he walks with a black bag, dissecting. He thinks I'm crazy, but he is the Ripper's designer."
                          : chapter.id === "chapter-2"
                          ? "Walter Sickert, the paint-smeared canvas drawer... he paints Mary Kelly's cell hours before we clean her. His drawings are maps."
                          : chapter.id === "chapter-3"
                          ? "The coordinate is 'Nf7'. Smothered mate in Mitre Square cellar. The Ripper awaits you there to finish the Canonical play."
                          : "The final coordinate Nf7 unlocks my lockbox. Solve the chessboard to catch me, if you survive the poisoned Queen e5."
                      )}
                      className="bg-[#2a2a30] hover:bg-red-950 text-white font-bold text-[10px] md:text-xs py-2 px-4 rounded-xl border border-[#2a2a30] hover:border-[#ca3431]/40 transition-all text-left"
                    >
                      [Deduce evidence & demand clues]
                    </button>
                  </div>
                )}

                {dialogueNode === "choice_threat" && (
                  <button
                    onClick={handleStartMatch}
                    className="bg-[#ca3431] hover:bg-[#e24e4a] text-white font-bold text-[10px] md:text-xs py-2 px-5 rounded-xl transition-all"
                  >
                    [Draw board and play chess]
                  </button>
                )}

                {dialogueNode === "choice_question" && (
                  <button
                    onClick={handleStartMatch}
                    className="bg-[#ca3431] hover:bg-[#e24e4a] text-white font-bold text-[10px] md:text-xs py-2 px-5 rounded-xl transition-all"
                  >
                    [Challenge their Chess Alibi]
                  </button>
                )}
              </>
            )}

            {status === "playing" && (
              <span className="text-[10px] text-[#ca3431] uppercase tracking-widest font-black animate-pulse">
                Confrontation In Progress...
              </span>
            )}

            {(status === "solved" || status === "failed") && (
              <span className="text-[10px] text-[#a0a0a8] uppercase tracking-widest font-bold">
                Confrontation Complete
              </span>
            )}
          </div>
        </div>

        {/* Sliding Chess Board Confrontation Drawer */}
        <div 
          className={`absolute top-0 right-0 w-full md:w-[55%] h-full bg-[#0a0a0b]/98 border-l border-[#2a2a30] z-20 transition-transform duration-700 flex flex-col md:flex-row backdrop-blur-md ${
            status === "playing" || status === "solved" || status === "failed" 
              ? "translate-x-0" 
              : "translate-x-full"
          }`}
        >
          {/* Chess Board Frame */}
          <div className="flex-1 flex flex-col items-center justify-center p-3 gap-2 relative">
            
            {/* Poison blood overlay */}
            {isPoisoned && (
              <div className="absolute inset-0 bg-[#600302]/45 pointer-events-none z-10 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-[#ca3431]/30 animate-pulse pointer-events-none" />
                <div className="absolute inset-x-0 top-0 bg-[#ca3431] opacity-80 pointer-events-none" style={{ height: "6px" }} />
                <div className="absolute top-0 left-[20%] w-[2px] h-[70px] bg-[#600302] rounded-full animate-story-drip" style={{ animationDelay: "0.2s" }} />
                <div className="absolute top-0 left-[45%] w-[3px] h-[100px] bg-[#ca3431] rounded-full animate-story-drip" style={{ animationDelay: "0.5s" }} />
                <div className="absolute top-0 left-[75%] w-[2px] h-[50px] bg-[#600302] rounded-full animate-story-drip" style={{ animationDelay: "0.9s" }} />
              </div>
            )}

            <div className={`w-full aspect-square max-w-[340px] shadow-elevated border border-[#2a2a30] rounded-xl overflow-hidden ${isShaking ? "animate-story-shake" : ""}`}>
              <Board
                position={position}
                boardOrientation={playerColor}
                onPieceDrop={handlePieceDrop}
                onSquareClick={onSquareClick}
                customSquareStyles={optionSquares}
                arePiecesDraggable={status === "playing" && !isBotThinking && !isGameOver}
                theme={settings.boardTheme}
              />
            </div>

            {/* Solver Win Overlay */}
            {status === "solved" && (
              <div className="absolute inset-0 bg-[#0a0a0b]/95 flex flex-col items-center justify-center p-6 text-center z-20">
                <div className="text-4xl mb-2">🔑</div>
                <h2 className="text-xl font-black text-[#ca3431] mb-1">Evidence Secured</h2>
                <p className="text-white font-bold text-xs mb-1 uppercase tracking-wider">{chapter.clueTitle}</p>
                <p className="text-[#a0a0a8] text-[10px] max-w-sm mb-4 leading-relaxed">
                  {chapter.clueDescription}
                </p>
                <div className="flex gap-3 w-full max-w-xs justify-center">
                  <Link
                    href="/story"
                    className="bg-[#2a2a30] hover:bg-[#3a3a42] text-white py-2 px-5 rounded-xl text-xs font-bold border border-[#2a2a30]"
                  >
                    Return to Notebook
                  </Link>
                  {chapterId !== "chapter-4" && (
                    <button
                      onClick={() => {
                        const nextIndex = STORY_CHAPTERS.findIndex(c => c.id === chapterId) + 1;
                        if (nextIndex < STORY_CHAPTERS.length) {
                          router.push(`/story/${STORY_CHAPTERS[nextIndex].id}`);
                        }
                      }}
                      className="bg-[#ca3431] hover:bg-[#e24e4a] text-white py-2 px-5 rounded-xl text-xs font-bold"
                    >
                      Next Suspect
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Solver Fail Overlay */}
            {status === "failed" && (
              <div className="absolute inset-0 bg-[#0a0a0b]/95 flex flex-col items-center justify-center p-6 text-center z-20">
                {isPoisoned ? (
                  <>
                    <div className="text-4xl mb-2 animate-bounce">💀</div>
                    <h2 className="text-xl font-black text-[#ca3431] mb-1 uppercase tracking-wider">Blade Poisoned!</h2>
                    <p className="text-white text-[11px] max-w-xs mb-4 leading-relaxed">
                      You captured the poisoned Queen on e5. Toxin absorbs immediately. You collapse onto the bloody floor...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">❌</div>
                    <h2 className="text-xl font-black text-[#ca3431] mb-1">Mutilated in London</h2>
                    <p className="text-[#a0a0a8] text-[11px] max-w-xs mb-4 leading-relaxed">
                      The suspect has defeated you on the board. Abberline, you must checkmate them to break their alibi.
                    </p>
                  </>
                )}
                <div className="flex gap-3 w-full max-w-xs justify-center">
                  <Link
                    href="/story"
                    className="bg-[#2a2a30] hover:bg-[#3a3a42] text-white py-2 px-5 rounded-xl text-xs font-bold border border-[#2a2a30]"
                  >
                    Withdraw
                  </Link>
                  <button
                    onClick={handleRetryMatch}
                    className="bg-[#ca3431] hover:bg-[#e24e4a] text-white py-2 px-5 rounded-xl text-xs font-bold"
                  >
                    Retry Case
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Moves list side column */}
          <div className="w-full md:w-[150px] bg-[#0c0c0e] border-t md:border-t-0 md:border-l border-[#2a2a30] p-3 flex flex-col h-[140px] md:h-full justify-between">
            <div className="text-[10px] text-[#a0a0a8] font-black uppercase tracking-wider pb-2 border-b border-[#2a2a30]">
              Match Log
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <MoveList
                moves={history.map((m) => ({ san: m.san }))}
                currentMoveIndex={history.length - 1}
                onMoveClick={() => {}}
              />
            </div>
            {status === "playing" && (
              <button
                onClick={handleRetryMatch}
                className="bg-[#ca3431]/10 text-[#ca3431] hover:bg-[#ca3431]/25 border border-[#ca3431]/30 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-center transition-colors w-full shrink-0"
              >
                Restart Board
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Global CSS styles block for visual novel animation keyframes */}
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
          100% { transform: translateY(400%); opacity: 0; }
        }
        .animate-story-drip {
          animation: story-drip 2.0s infinite linear;
        }
      `}</style>
    </div>
  );
}
